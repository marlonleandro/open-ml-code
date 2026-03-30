import * as path from 'path';
import * as vscode from 'vscode';
import { buildWorkspaceMemoryBlock } from './memory';
import { buildProjectHistoryContext } from './projectState';
import { getProviderSecret } from './secrets';

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
	providerSignature: string;
	chunks: IndexChunk[];
};

type SemanticEmbeddingProvider = 'local' | 'openai' | 'azurefoundry';

const SEMANTIC_INDEX_VERSION = 2;
const MAX_INDEXED_FILES = 150;
const MAX_CONTEXT_CHUNKS = 6;
const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 200;
const VECTOR_DIMENSIONS = 192;
const INDEX_MAX_AGE_MS = 5 * 60 * 1000;
const EXTERNAL_EMBEDDING_BATCH_SIZE = 24;
const EXTERNAL_EMBEDDING_TIMEOUT_MS = 45000;
const EXTERNAL_EMBEDDING_FAILURE_COOLDOWN_MS = 5 * 60 * 1000;
const EXCLUDED_DIRS = new Set(['node_modules', '.git', 'out', '.build', 'dist', 'coverage']);

let storageRoot: vscode.Uri | undefined;
let lastIndexedAt = 0;
let indexedChunks: IndexChunk[] = [];
let indexedProviderSignature = getProviderSignature();
let loadingIndexPromise: Promise<void> | undefined;
let externalEmbeddingsDisabledUntil = 0;

export function initializeContextStorage(storageUri?: vscode.Uri): void {
	storageRoot = storageUri;
}

function getWorkspaceFolder(): vscode.WorkspaceFolder | undefined {
	return vscode.workspace.workspaceFolders?.[0];
}

function getWorkspaceRoot(): string | undefined {
	return getWorkspaceFolder()?.uri.fsPath;
}

function getConfig(): vscode.WorkspaceConfiguration {
	return vscode.workspace.getConfiguration('openmlAssistant');
}

function getString(path: string, fallback = ''): string {
	return getConfig().get<string>(path, fallback).trim();
}

function getSemanticEmbeddingProvider(): SemanticEmbeddingProvider {
	return getConfig().get<SemanticEmbeddingProvider>('semanticSearch.provider', 'local');
}

function getSemanticEmbeddingModel(provider: SemanticEmbeddingProvider): string {
	switch (provider) {
		case 'openai':
			return getString('semanticSearch.openaiModel', 'text-embedding-3-small');
		case 'azurefoundry':
			return getString('semanticSearch.azureFoundryDeployment');
		case 'local':
		default:
			return 'local-hash';
	}
}

function getProviderSignature(provider = getSemanticEmbeddingProvider()): string {
	return `${provider}:${getSemanticEmbeddingModel(provider)}`;
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

function normalizeVector(vector: number[]): number[] {
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

function createAbortableTimeoutSignal(timeoutMs: number): AbortSignal {
	return AbortSignal.timeout(timeoutMs);
}

async function postJsonWithTimeout(url: string, body: unknown, init: RequestInit = {}, timeoutMs = EXTERNAL_EMBEDDING_TIMEOUT_MS): Promise<any> {
	const response = await fetch(url, {
		method: 'POST',
		...init,
		body: JSON.stringify(body),
		signal: createAbortableTimeoutSignal(timeoutMs)
	});

	if (!response.ok) {
		throw new Error(`Request failed (${response.status}): ${await response.text()}`);
	}

	return response.json();
}

function buildOpenAIEmbeddingsUrl(baseUrl: string): string {
	const normalized = baseUrl.trim().replace(/\/$/, '');
	return normalized.endsWith('/embeddings') ? normalized : `${normalized}/embeddings`;
}

function buildAzureFoundryEmbeddingsUrl(host: string, apiVersion: string): string {
	const normalizedVersion = apiVersion.trim() || '2025-04-01-preview';
	const rawHost = host.trim();
	if (!rawHost) {
		return `/openai/v1/embeddings?api-version=${encodeURIComponent(normalizedVersion)}`;
	}

	const parsedUrl = new URL(rawHost);
	const normalizedPath = parsedUrl.pathname.replace(/\/$/, '');
	if (!/\/openai(?:\/v1)?\/embeddings$/i.test(normalizedPath)) {
		parsedUrl.pathname = `${normalizedPath}/openai/v1/embeddings`;
	}

	parsedUrl.searchParams.set('api-version', normalizedVersion);
	return parsedUrl.toString();
}

function buildAzureFoundryHeaders(apiKey: string, authMode: string): Record<string, string> {
	return authMode === 'api-key'
		? { 'Content-Type': 'application/json', 'api-key': apiKey }
		: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` };
}

function splitIntoBatches<T>(items: T[], size: number): T[][] {
	const batches: T[][] = [];
	for (let index = 0; index < items.length; index += size) {
		batches.push(items.slice(index, index + size));
	}
	return batches;
}

async function createOpenAIEmbeddings(texts: string[]): Promise<number[][]> {
	const baseUrl = getString('openai.baseUrl', 'https://api.openai.com/v1');
	const apiKey = (await getProviderSecret('openai')).trim();
	const model = getSemanticEmbeddingModel('openai');
	if (!baseUrl || !apiKey || !model) {
		throw new Error('OpenAI semantic search is not fully configured.');
	}

	const json = await postJsonWithTimeout(buildOpenAIEmbeddingsUrl(baseUrl), {
		model,
		input: texts
	}, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`
		}
	});

	return (json?.data ?? []).map((item: { embedding?: number[] }) => normalizeVector(Array.isArray(item?.embedding) ? item.embedding : []));
}

async function createAzureFoundryEmbeddings(texts: string[]): Promise<number[][]> {
	const host = getString('azureFoundry.host');
	const apiVersion = getString('azureFoundry.apiVersion', '2025-04-01-preview');
	const apiKey = (await getProviderSecret('azurefoundry')).trim();
	const deployment = getSemanticEmbeddingModel('azurefoundry');
	const authMode = getString('azureFoundry.authMode', 'bearer') || 'bearer';
	if (!host || !apiKey || !deployment) {
		throw new Error('Azure Foundry semantic search is not fully configured.');
	}

	const json = await postJsonWithTimeout(buildAzureFoundryEmbeddingsUrl(host, apiVersion), {
		model: deployment,
		input: texts
	}, {
		headers: buildAzureFoundryHeaders(apiKey, authMode)
	});

	return (json?.data ?? []).map((item: { embedding?: number[] }) => normalizeVector(Array.isArray(item?.embedding) ? item.embedding : []));
}

async function createExternalEmbeddings(texts: string[]): Promise<number[][]> {
	const provider = getSemanticEmbeddingProvider();
	if (provider === 'local') {
		return texts.map(text => createVector(tokenize(text)));
	}

	if (Date.now() < externalEmbeddingsDisabledUntil) {
		throw new Error('External semantic embeddings are temporarily disabled after a recent failure.');
	}

	try {
		const batches = splitIntoBatches(texts, EXTERNAL_EMBEDDING_BATCH_SIZE);
		const vectors: number[][] = [];
		for (const batch of batches) {
			const batchVectors = provider === 'openai'
				? await createOpenAIEmbeddings(batch)
				: await createAzureFoundryEmbeddings(batch);
			vectors.push(...batchVectors);
		}
		if (vectors.length !== texts.length) {
			throw new Error('External semantic embeddings returned an unexpected number of vectors.');
		}
		return vectors;
	} catch (error) {
		externalEmbeddingsDisabledUntil = Date.now() + EXTERNAL_EMBEDDING_FAILURE_COOLDOWN_MS;
		console.warn('[OpenML Assistant] External semantic embeddings failed. Falling back to local vectors.', error);
		throw error;
	}
}

async function createSemanticVectors(inputs: string[]): Promise<number[][]> {
	const provider = getSemanticEmbeddingProvider();
	if (provider === 'local') {
		return inputs.map(input => createVector(tokenize(input)));
	}

	try {
		return await createExternalEmbeddings(inputs);
	} catch {
		return inputs.map(input => createVector(tokenize(input)));
	}
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
			providerSignature: getProviderSignature(),
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
			parsed.providerSignature !== getProviderSignature() ||
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
		indexedProviderSignature = parsed.providerSignature || getProviderSignature();
	} catch {
		// ignore cache miss / parse failures
	}
}

export async function rebuildSemanticIndex(): Promise<number> {
	const files = await collectWorkspaceFiles(MAX_INDEXED_FILES);
	const providerSignature = getProviderSignature();
	const previousByFile = new Map<string, IndexChunk[]>();
	for (const chunk of indexedProviderSignature === providerSignature ? indexedChunks : []) {
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

		const chunksForFile = chunkText(content);
		const vectorInputs = chunksForFile.map(chunk => `${file.fsPath}\n${chunk}`);
		const vectors = await createSemanticVectors(vectorInputs);

		for (let index = 0; index < chunksForFile.length; index += 1) {
			const chunk = chunksForFile[index];
			const tokens = buildChunkTokens(file.fsPath, chunk);
			nextChunks.push({
				path: file.fsPath,
				preview: buildChunkPreview(chunk),
				tokens,
				vector: vectors[index] ?? createVector(tokens),
				fileMtime: stat.mtime,
				fileSize: stat.size
			});
		}
	}

	indexedChunks = nextChunks;
	lastIndexedAt = Date.now();
	indexedProviderSignature = providerSignature;
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

	if (
		!indexedChunks.length ||
		indexedProviderSignature !== getProviderSignature() ||
		Date.now() - lastIndexedAt > INDEX_MAX_AGE_MS
	) {
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
	const [queryVector] = await createSemanticVectors([`${query}\n${selectedText ?? ''}`]);
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
