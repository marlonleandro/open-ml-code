import * as path from 'path';
import * as vscode from 'vscode';
import { buildWorkspaceMemoryBlock } from './memory';
import { buildProjectHistoryContext } from './projectState';

type IndexChunk = {
	path: string;
	preview: string;
	tokens: string[];
	vector: number[];
	fileMtime: number;
	fileSize: number;
};

type PersistedSemanticIndex = {
	version: number;
	workspaceRoot: string;
	createdAt: number;
	chunks: IndexChunk[];
};

const SEMANTIC_INDEX_VERSION = 1;
const MAX_INDEXED_FILES = 150;
const MAX_CONTEXT_CHUNKS = 6;
const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 200;
const VECTOR_DIMENSIONS = 192;
const INDEX_MAX_AGE_MS = 5 * 60 * 1000;
const EXCLUDED_DIRS = new Set(['node_modules', '.git', 'out', '.build', 'dist', 'coverage']);

let storageRoot: vscode.Uri | undefined;
let lastIndexedAt = 0;
let indexedChunks: IndexChunk[] = [];
let loadingIndexPromise: Promise<void> | undefined;

export function initializeContextStorage(storageUri?: vscode.Uri): void {
	storageRoot = storageUri;
}

function getWorkspaceFolder(): vscode.WorkspaceFolder | undefined {
	return vscode.workspace.workspaceFolders?.[0];
}

function getWorkspaceRoot(): string | undefined {
	return getWorkspaceFolder()?.uri.fsPath;
}

function getIndexStorageUri(): vscode.Uri | undefined {
	return storageRoot ? vscode.Uri.joinPath(storageRoot, 'semantic-index.json') : undefined;
}

function tokenize(value: string): string[] {
	return Array.from(new Set(
		value
			.toLowerCase()
			.split(/[^a-z0-9_]+/)
			.map(token => token.trim())
			.filter(token => token.length >= 3)
	));
}

function splitIdentifier(value: string): string[] {
	return tokenize(
		value
			.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
			.replace(/[_\-./\\]+/g, ' ')
	);
}

function chunkText(content: string): string[] {
	const chunks: string[] = [];
	for (let start = 0; start < content.length; start += CHUNK_SIZE - CHUNK_OVERLAP) {
		chunks.push(content.slice(start, start + CHUNK_SIZE));
		if (start + CHUNK_SIZE >= content.length) {
			break;
		}
	}
	return chunks;
}

function hashToken(token: string): number {
	let hash = 2166136261;
	for (let index = 0; index < token.length; index += 1) {
		hash ^= token.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}
	return Math.abs(hash >>> 0);
}

function createVector(tokens: string[]): number[] {
	const vector = new Array<number>(VECTOR_DIMENSIONS).fill(0);
	for (const token of tokens) {
		const hash = hashToken(token);
		const bucket = hash % VECTOR_DIMENSIONS;
		const sign = (hash & 1) === 0 ? 1 : -1;
		vector[bucket] += sign * (1 + Math.min(token.length, 12) / 12);
	}

	let magnitude = 0;
	for (const value of vector) {
		magnitude += value * value;
	}

	if (magnitude <= 0) {
		return vector;
	}

	const normalizer = Math.sqrt(magnitude);
	return vector.map(value => Number((value / normalizer).toFixed(6)));
}

function cosineSimilarity(left: number[], right: number[]): number {
	const length = Math.min(left.length, right.length);
	let score = 0;
	for (let index = 0; index < length; index += 1) {
		score += left[index] * right[index];
	}
	return score;
}

async function readFileText(uri: vscode.Uri): Promise<string> {
	const bytes = await vscode.workspace.fs.readFile(uri);
	return new TextDecoder('utf-8').decode(bytes);
}

async function collectWorkspaceFiles(limit: number): Promise<vscode.Uri[]> {
	const workspaceFolder = getWorkspaceFolder();
	if (!workspaceFolder) {
		return [];
	}

	const files: vscode.Uri[] = [];
	const visit = async (directory: vscode.Uri): Promise<void> => {
		if (files.length >= limit) {
			return;
		}

		let entries: [string, vscode.FileType][];
		try {
			entries = await vscode.workspace.fs.readDirectory(directory);
		} catch {
			return;
		}

		for (const [name, type] of entries) {
			if (files.length >= limit) {
				return;
			}

			if (type === vscode.FileType.Directory) {
				if (!EXCLUDED_DIRS.has(name)) {
					await visit(vscode.Uri.joinPath(directory, name));
				}
				continue;
			}

			if (type === vscode.FileType.File) {
				files.push(vscode.Uri.joinPath(directory, name));
			}
		}
	};

	await visit(workspaceFolder.uri);
	return files;
}

function extractSymbolHints(content: string): string[] {
	const results = new Set<string>();
	const patterns = [
		/\b(?:class|interface|enum|type|function|const|let|var)\s+([A-Za-z_][A-Za-z0-9_]*)/g,
		/\bexport\s+(?:default\s+)?(?:class|function|const|type|interface|enum)?\s*([A-Za-z_][A-Za-z0-9_]*)/g,
		/\b([A-Za-z_][A-Za-z0-9_]*)\s*[:=]\s*(?:async\s+)?\(/g
	];

	for (const pattern of patterns) {
		let match: RegExpExecArray | null;
		while ((match = pattern.exec(content)) !== null) {
			for (const token of splitIdentifier(match[1])) {
				results.add(token);
			}
		}
	}

	return [...results];
}

function buildChunkTokens(filePath: string, chunk: string): string[] {
	const baseName = path.basename(filePath);
	const dirName = path.dirname(filePath);
	const identifiers = Array.from(new Set([
		...splitIdentifier(baseName),
		...splitIdentifier(dirName),
		...extractSymbolHints(chunk)
	]));
	return Array.from(new Set([
		...tokenize(`${filePath}\n${baseName}\n${dirName}\n${chunk}`),
		...identifiers
	]));
}

function buildChunkPreview(chunk: string): string {
	return chunk.replace(/\s+/g, ' ').trim().slice(0, 220);
}

function scoreChunk(chunk: IndexChunk, queryTokens: string[], queryVector: number[], activeFileName?: string): number {
	let lexicalScore = 0;
	for (const token of queryTokens) {
		if (chunk.tokens.includes(token)) {
			lexicalScore += 4;
		}
		if (chunk.path.toLowerCase().includes(token)) {
			lexicalScore += 6;
		}
	}

	if (activeFileName && chunk.path === activeFileName) {
		lexicalScore += 10;
	}

	const semanticScore = cosineSimilarity(chunk.vector, queryVector) * 12;
	return lexicalScore + semanticScore;
}

async function persistSemanticIndex(): Promise<void> {
	const indexUri = getIndexStorageUri();
	const workspaceRoot = getWorkspaceRoot();
	if (!indexUri || !workspaceRoot || !storageRoot) {
		return;
	}

	try {
		await vscode.workspace.fs.createDirectory(storageRoot);
		const payload: PersistedSemanticIndex = {
			version: SEMANTIC_INDEX_VERSION,
			workspaceRoot,
			createdAt: lastIndexedAt,
			chunks: indexedChunks
		};
		const json = JSON.stringify(payload);
		await vscode.workspace.fs.writeFile(indexUri, new TextEncoder().encode(json));
	} catch {
		// best effort only
	}
}

async function loadPersistedSemanticIndex(): Promise<void> {
	const indexUri = getIndexStorageUri();
	const workspaceRoot = getWorkspaceRoot();
	if (!indexUri || !workspaceRoot) {
		return;
	}

	try {
		const bytes = await vscode.workspace.fs.readFile(indexUri);
		const parsed = JSON.parse(new TextDecoder('utf-8').decode(bytes)) as PersistedSemanticIndex;
		if (
			parsed.version !== SEMANTIC_INDEX_VERSION ||
			parsed.workspaceRoot !== workspaceRoot ||
			!Array.isArray(parsed.chunks)
		) {
			return;
		}

		indexedChunks = parsed.chunks.filter(chunk =>
			typeof chunk.path === 'string' &&
			typeof chunk.preview === 'string' &&
			Array.isArray(chunk.tokens) &&
			Array.isArray(chunk.vector) &&
			typeof chunk.fileMtime === 'number' &&
			typeof chunk.fileSize === 'number'
		);
		lastIndexedAt = parsed.createdAt || 0;
	} catch {
		// ignore cache miss / parse failures
	}
}

export async function rebuildSemanticIndex(): Promise<number> {
	const files = await collectWorkspaceFiles(MAX_INDEXED_FILES);
	const previousByFile = new Map<string, IndexChunk[]>();
	for (const chunk of indexedChunks) {
		const entries = previousByFile.get(chunk.path) ?? [];
		entries.push(chunk);
		previousByFile.set(chunk.path, entries);
	}
	const nextChunks: IndexChunk[] = [];

	for (const file of files) {
		let stat: vscode.FileStat;
		try {
			stat = await vscode.workspace.fs.stat(file);
		} catch {
			continue;
		}

		const cachedChunks = previousByFile.get(file.fsPath);
		if (
			cachedChunks?.length &&
			cachedChunks.every(chunk => chunk.fileMtime === stat.mtime && chunk.fileSize === stat.size)
		) {
			nextChunks.push(...cachedChunks);
			continue;
		}

		let content = '';
		try {
			content = await readFileText(file);
		} catch {
			continue;
		}

		if (!content.trim()) {
			continue;
		}

		for (const chunk of chunkText(content)) {
			const tokens = buildChunkTokens(file.fsPath, chunk);
			nextChunks.push({
				path: file.fsPath,
				preview: buildChunkPreview(chunk),
				tokens,
				vector: createVector(tokens),
				fileMtime: stat.mtime,
				fileSize: stat.size
			});
		}
	}

	indexedChunks = nextChunks;
	lastIndexedAt = Date.now();
	await persistSemanticIndex();
	return indexedChunks.length;
}

async function ensureSemanticIndex(): Promise<void> {
	if (!indexedChunks.length && !loadingIndexPromise) {
		loadingIndexPromise = loadPersistedSemanticIndex().finally(() => {
			loadingIndexPromise = undefined;
		});
	}

	if (loadingIndexPromise) {
		await loadingIndexPromise;
	}

	if (!indexedChunks.length || Date.now() - lastIndexedAt > INDEX_MAX_AGE_MS) {
		await rebuildSemanticIndex();
	}
}

export async function getRelevantWorkspaceSymbols(query: string, limit = 12): Promise<string[]> {
	const queryTokens = tokenize(query).slice(0, 4);
	const collected = new Map<string, string>();
	const candidateUris = new Map<string, vscode.Uri>();

	for (const editor of vscode.window.visibleTextEditors) {
		candidateUris.set(editor.document.uri.toString(), editor.document.uri);
	}

	for (const document of vscode.workspace.textDocuments) {
		if (!document.isUntitled) {
			candidateUris.set(document.uri.toString(), document.uri);
		}
	}

	for (const uri of candidateUris.values()) {
		try {
			const symbols = await vscode.commands.executeCommand<(vscode.DocumentSymbol | vscode.SymbolInformation)[]>('vscode.executeDocumentSymbolProvider', uri);
			for (const symbol of symbols ?? []) {
				const name = symbol.name;
				const line = 'selectionRange' in symbol ? symbol.selectionRange.start.line + 1 : symbol.location.range.start.line + 1;
				const kind = vscode.SymbolKind[symbol.kind];
				const haystack = `${uri.fsPath}\n${name}`.toLowerCase();
				if (queryTokens.length && !queryTokens.some(token => haystack.includes(token))) {
					continue;
				}

				const key = `${uri.fsPath}:${line}:${name}`;
				if (!collected.has(key)) {
					collected.set(key, `${name} (${kind}) - ${uri.fsPath}:${line}`);
				}
				if (collected.size >= limit) {
					return [...collected.values()];
				}
			}
		} catch {
			// best effort only
		}
	}

	return [...collected.values()];
}

export async function buildDeepContext(query: string, activeFileName?: string, selectedText?: string): Promise<string> {
	await ensureSemanticIndex();
	const queryTokens = tokenize(`${query}\n${selectedText ?? ''}`);
	const queryVector = createVector(queryTokens);
	const memoryBlock = buildWorkspaceMemoryBlock();
	const historyBlock = await buildProjectHistoryContext();
	const symbols = await getRelevantWorkspaceSymbols(query, 10);
	const topChunks = indexedChunks
		.map(chunk => ({ chunk, score: scoreChunk(chunk, queryTokens, queryVector, activeFileName) }))
		.filter(entry => entry.score > 0.1)
		.sort((a, b) => b.score - a.score)
		.slice(0, MAX_CONTEXT_CHUNKS);

	const sections: string[] = [];

	if (historyBlock) {
		sections.push('Persistent project history context:');
		sections.push(historyBlock);
		sections.push('');
	}

	if (memoryBlock) {
		sections.push('Persistent workspace context:');
		sections.push(memoryBlock);
		sections.push('');
	}

	if (symbols.length) {
		sections.push('Relevant workspace symbols:');
		for (const symbol of symbols) {
			sections.push(`- ${symbol}`);
		}
		sections.push('');
	}

	if (topChunks.length) {
		sections.push('Relevant semantic workspace context:');
		for (const entry of topChunks) {
			sections.push(`- ${entry.chunk.path}`);
			sections.push(`  ${entry.chunk.preview}`);
		}
	}

	return sections.join('\n').trim();
}
