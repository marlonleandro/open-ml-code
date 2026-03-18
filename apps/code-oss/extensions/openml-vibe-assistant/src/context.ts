import * as vscode from 'vscode';
import { buildWorkspaceMemoryBlock } from './memory';
import { buildProjectHistoryContext } from './projectState';

type IndexChunk = {
	path: string;
	preview: string;
	content: string;
	tokens: string[];
};

const MAX_INDEXED_FILES = 150;
const MAX_CONTEXT_CHUNKS = 6;
const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 200;
const EXCLUDE_GLOB = '**/{node_modules,.git,out,.build,dist,coverage}/**';

let lastIndexedAt = 0;
let indexedChunks: IndexChunk[] = [];

function tokenize(value: string): string[] {
	return Array.from(new Set(
		value
			.toLowerCase()
			.split(/[^a-z0-9_]+/)
			.map(token => token.trim())
			.filter(token => token.length >= 3)
	));
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

async function readFileText(uri: vscode.Uri): Promise<string> {
	const bytes = await vscode.workspace.fs.readFile(uri);
	return new TextDecoder('utf-8').decode(bytes);
}

function scoreChunk(chunk: IndexChunk, queryTokens: string[], activeFileName?: string): number {
	let score = 0;
	for (const token of queryTokens) {
		if (chunk.tokens.includes(token)) {
			score += 4;
		}
		if (chunk.path.toLowerCase().includes(token)) {
			score += 6;
		}
	}

	if (activeFileName && chunk.path === activeFileName) {
		score += 10;
	}

	return score;
}

export async function rebuildSemanticIndex(): Promise<number> {
	const files = await vscode.workspace.findFiles('**/*', EXCLUDE_GLOB, MAX_INDEXED_FILES);
	const nextChunks: IndexChunk[] = [];

	for (const file of files) {
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
			const preview = chunk.replace(/\s+/g, ' ').trim().slice(0, 220);
			nextChunks.push({
				path: file.fsPath,
				preview,
				content: chunk,
				tokens: tokenize(`${file.fsPath}\n${chunk}`)
			});
		}
	}

	indexedChunks = nextChunks;
	lastIndexedAt = Date.now();
	return indexedChunks.length;
}

async function ensureSemanticIndex(): Promise<void> {
	if (!indexedChunks.length || Date.now() - lastIndexedAt > 5 * 60 * 1000) {
		await rebuildSemanticIndex();
	}
}

export async function getRelevantWorkspaceSymbols(query: string, limit = 12): Promise<string[]> {
	const queryTokens = tokenize(query).slice(0, 4);
	const collected = new Map<string, string>();

	for (const token of queryTokens.length ? queryTokens : [query]) {
		try {
			const symbols = await vscode.commands.executeCommand<vscode.SymbolInformation[]>('vscode.executeWorkspaceSymbolProvider', token);
			for (const symbol of symbols ?? []) {
				const key = `${symbol.location.uri.fsPath}:${symbol.location.range.start.line + 1}:${symbol.name}`;
				if (!collected.has(key)) {
					collected.set(key, `${symbol.name} (${vscode.SymbolKind[symbol.kind]}) - ${symbol.location.uri.fsPath}:${symbol.location.range.start.line + 1}`);
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
	const memoryBlock = buildWorkspaceMemoryBlock();
	const historyBlock = await buildProjectHistoryContext();
	const symbols = await getRelevantWorkspaceSymbols(query, 10);
	const topChunks = indexedChunks
		.map(chunk => ({ chunk, score: scoreChunk(chunk, queryTokens, activeFileName) }))
		.filter(entry => entry.score > 0)
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
		sections.push('Relevant indexed workspace context:');
		for (const entry of topChunks) {
			sections.push(`- ${entry.chunk.path}`);
			sections.push(`  ${entry.chunk.preview}`);
		}
	}

	return sections.join('\n').trim();
}
