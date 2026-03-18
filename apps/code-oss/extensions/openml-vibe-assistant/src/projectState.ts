import * as vscode from 'vscode';

export type PersistedChatRole = 'user' | 'assistant';

export type PersistedChatMessage = {
	role: PersistedChatRole;
	content: string;
	createdAt: string;
};

type PersistedChatHistory = {
	version: number;
	summary: string;
	messages: PersistedChatMessage[];
	updatedAt: string;
};

const OPENML_DIR = '.openml';
const HISTORY_FILE = 'chat-history.json';
const WORKLOG_FILE = 'OPENML_WORKLOG.md';
const DEFAULT_HISTORY_TOKEN_BUDGET = 4000;
const MIN_HISTORY_TOKEN_BUDGET = 1000;
const MAX_VISIBLE_MESSAGES = 24;

function getConfig(): vscode.WorkspaceConfiguration {
	return vscode.workspace.getConfiguration('openmlAssistant');
}

function getWorkspaceFolder(): vscode.WorkspaceFolder | undefined {
	return vscode.workspace.workspaceFolders?.[0];
}

function getWorkspaceRoot(): vscode.Uri | undefined {
	return getWorkspaceFolder()?.uri;
}

function getOpenMLDir(): vscode.Uri | undefined {
	const root = getWorkspaceRoot();
	return root ? vscode.Uri.joinPath(root, OPENML_DIR) : undefined;
}

function getHistoryFile(): vscode.Uri | undefined {
	const dir = getOpenMLDir();
	return dir ? vscode.Uri.joinPath(dir, HISTORY_FILE) : undefined;
}

function nowIso(): string {
	return new Date().toISOString();
}

async function ensureOpenMLDir(): Promise<vscode.Uri | undefined> {
	const dir = getOpenMLDir();
	if (!dir) {
		return undefined;
	}

	await vscode.workspace.fs.createDirectory(dir);
	return dir;
}

async function readTextFile(uri: vscode.Uri): Promise<string> {
	const bytes = await vscode.workspace.fs.readFile(uri);
	return new TextDecoder('utf-8').decode(bytes);
}

async function writeTextFile(uri: vscode.Uri, content: string): Promise<void> {
	await vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(content));
}

function approximateTokens(value: string): number {
	const normalized = value.replace(/```[\s\S]*?```/g, ' ').replace(/\s+/g, ' ').trim();
	if (!normalized) {
		return 0;
	}

	return Math.max(1, Math.ceil(normalized.length / 4));
}

function getHistoryTokenBudget(): number {
	const configured = getConfig().get<number>('historyTokenBudget', DEFAULT_HISTORY_TOKEN_BUDGET);
	return Math.max(MIN_HISTORY_TOKEN_BUDGET, configured || DEFAULT_HISTORY_TOKEN_BUDGET);
}

function createEmptyHistory(): PersistedChatHistory {
	return {
		version: 1,
		summary: '',
		messages: [],
		updatedAt: nowIso()
	};
}

async function readPersistedHistory(): Promise<PersistedChatHistory> {
	const file = getHistoryFile();
	if (!file) {
		return createEmptyHistory();
	}

	try {
		const text = await readTextFile(file);
		const parsed = JSON.parse(text) as PersistedChatHistory;
		return {
			version: 1,
			summary: parsed.summary ?? '',
			messages: Array.isArray(parsed.messages) ? parsed.messages.filter(message => !!message?.content && (message.role === 'user' || message.role === 'assistant')) : [],
			updatedAt: parsed.updatedAt ?? nowIso()
		};
	} catch {
		return createEmptyHistory();
	}
}

function removeCodeBlocks(value: string): string {
	return value.replace(/```[\s\S]*?```/g, ' ').replace(/`([^`]+)`/g, '$1');
}

function compactLine(value: string): string {
	return removeCodeBlocks(value).replace(/\s+/g, ' ').trim();
}

function pickImportantLines(content: string, limit: number): string[] {
	const lines = content
		.split(/\r?\n/)
		.map(line => compactLine(line))
		.filter(Boolean);

	const important = lines.filter(line =>
		line.startsWith('#') ||
		line.startsWith('- ') ||
		/^\d+\./.test(line) ||
		/^Command:/i.test(line) ||
		/^Summary:/i.test(line) ||
		/^Diagnostics:/i.test(line) ||
		/^Workspace:/i.test(line) ||
		/^Mode:/i.test(line)
	);

	const source = important.length ? important : lines;
	return source.slice(0, limit).map(line => line.length > 220 ? `${line.slice(0, 217)}...` : line);
}

function summarizeMessage(message: PersistedChatMessage): string[] {
	const prefix = message.role === 'user' ? 'User request' : 'Assistant outcome';
	const lines = pickImportantLines(message.content, message.role === 'user' ? 2 : 4);
	if (!lines.length) {
		return [];
	}

	const [first, ...rest] = lines;
	const bullets = [`- ${prefix}: ${first}`];
	for (const line of rest) {
		bullets.push(`  ${line}`);
	}
	return bullets;
}

function buildSmartSummary(previousSummary: string, archivedMessages: PersistedChatMessage[]): string {
	const lines: string[] = ['# OpenML Project Memory'];
	if (previousSummary.trim()) {
		lines.push('', '## Previous summary', previousSummary.trim());
	}

	const userBullets: string[] = [];
	const assistantBullets: string[] = [];
	for (const message of archivedMessages) {
		const summaryLines = summarizeMessage(message);
		if (!summaryLines.length) {
			continue;
		}
		if (message.role === 'user') {
			userBullets.push(...summaryLines);
		} else {
			assistantBullets.push(...summaryLines);
		}
	}

	if (userBullets.length) {
		lines.push('', '## User requests and decisions', ...userBullets.slice(0, 18));
	}

	if (assistantBullets.length) {
		lines.push('', '## Work completed or guidance produced', ...assistantBullets.slice(0, 24));
	}

	return lines.join('\n').trim();
}

function trimSummary(summary: string, budgetTokens: number): string {
	if (approximateTokens(summary) <= budgetTokens) {
		return summary;
	}

	const targetChars = Math.max(1200, budgetTokens * 4);
	return `${summary.slice(0, Math.max(0, targetChars - 3)).trim()}...`;
}

function computeHistoryTokens(summary: string, messages: PersistedChatMessage[]): number {
	return approximateTokens(summary) + messages.reduce((total, message) => total + approximateTokens(message.content), 0);
}

function normalizeMessages(messages: PersistedChatMessage[]): PersistedChatMessage[] {
	return messages
		.filter(message => message.role === 'user' || message.role === 'assistant')
		.map(message => ({
			role: message.role,
			content: message.content.trim(),
			createdAt: message.createdAt || nowIso()
		}))
		.filter(message => !!message.content)
		.slice(-MAX_VISIBLE_MESSAGES * 3);
}

function compressHistory(summary: string, messages: PersistedChatMessage[], budgetTokens: number): PersistedChatHistory {
	let nextSummary = summary.trim();
	let nextMessages = [...messages];

	while (computeHistoryTokens(nextSummary, nextMessages) > budgetTokens && nextMessages.length > 6) {
		const archiveCount = Math.max(2, Math.ceil(nextMessages.length / 3));
		const archived = nextMessages.splice(0, archiveCount);
		nextSummary = buildSmartSummary(nextSummary, archived);
		nextSummary = trimSummary(nextSummary, Math.floor(budgetTokens * 0.55));
	}

	while (nextMessages.length > MAX_VISIBLE_MESSAGES) {
		const archived = nextMessages.splice(0, nextMessages.length - MAX_VISIBLE_MESSAGES);
		nextSummary = buildSmartSummary(nextSummary, archived);
		nextSummary = trimSummary(nextSummary, Math.floor(budgetTokens * 0.55));
	}

	return {
		version: 1,
		summary: nextSummary,
		messages: nextMessages,
		updatedAt: nowIso()
	};
}

export async function loadProjectChatHistory(): Promise<PersistedChatHistory> {
	return readPersistedHistory();
}

export async function saveProjectChatHistory(messages: PersistedChatMessage[], existingSummary = ''): Promise<PersistedChatHistory> {
	const dir = await ensureOpenMLDir();
	if (!dir) {
		return {
			version: 1,
			summary: existingSummary,
			messages: normalizeMessages(messages),
			updatedAt: nowIso()
		};
	}

	const history = compressHistory(existingSummary, normalizeMessages(messages), getHistoryTokenBudget());
	await writeTextFile(vscode.Uri.joinPath(dir, HISTORY_FILE), JSON.stringify(history, null, 2));
	return history;
}

export async function clearProjectChatHistory(): Promise<void> {
	const file = getHistoryFile();
	if (!file) {
		return;
	}

	try {
		await vscode.workspace.fs.delete(file, { useTrash: false });
	} catch {
		// ignore if the file does not exist yet
	}
}

export async function buildProjectHistoryContext(): Promise<string> {
	const history = await loadProjectChatHistory();
	const lines: string[] = [];

	if (history.summary.trim()) {
		lines.push('Project chat memory summary:');
		lines.push(history.summary.trim());
		lines.push('');
	}

	if (history.messages.length) {
		lines.push('Recent project chat history:');
		for (const message of history.messages.slice(-8)) {
			const role = message.role === 'user' ? 'User' : 'Assistant';
			lines.push(`- ${role}: ${compactLine(message.content).slice(0, 280)}`);
		}
	}

	const planning = await readPlanningFileContext();
	if (planning) {
		lines.push('', 'Project planning file excerpt:', planning);
	}

	const worklog = await readWorklogContext();
	if (worklog) {
		lines.push('', 'Project worklog excerpt:', worklog);
	}

	return lines.join('\n').trim();
}

async function readPlanningFileContext(): Promise<string> {
	const root = getWorkspaceRoot();
	if (!root) {
		return '';
	}

	try {
		const content = await readTextFile(vscode.Uri.joinPath(root, 'PLANNING.md'));
		return content.trim().slice(0, 3200);
	} catch {
		return '';
	}
}

async function readWorklogContext(): Promise<string> {
	const root = getWorkspaceRoot();
	if (!root) {
		return '';
	}

	try {
		const content = await readTextFile(vscode.Uri.joinPath(root, WORKLOG_FILE));
		return content.trim().slice(-3200);
	} catch {
		return '';
	}
}

async function writeRootMarkdownFile(fileName: string, content: string): Promise<void> {
	const root = getWorkspaceRoot();
	if (!root) {
		return;
	}

	await writeTextFile(vscode.Uri.joinPath(root, fileName), content);
}

async function appendRootMarkdownFile(fileName: string, content: string): Promise<void> {
	const root = getWorkspaceRoot();
	if (!root) {
		return;
	}

	const target = vscode.Uri.joinPath(root, fileName);
	let current = '';
	try {
		current = await readTextFile(target);
	} catch {
		current = '';
	}

	const next = current.trim()
		? `${current.trimEnd()}\n\n${content.trim()}\n`
		: `${content.trim()}\n`;
	await writeTextFile(target, next);
}

function buildPlanningDocument(prompt: string, response: string, historySummary: string): string {
	return [
		'# PLANNING',
		'',
		`Updated: ${nowIso()}`,
		'',
		'## Current objective',
		prompt.trim() || 'No prompt captured.',
		'',
		'## Latest assistant output',
		response.trim() || 'No assistant output captured.',
		'',
		'## Project memory summary',
		historySummary.trim() || 'No summarized history yet.',
		'',
		'## Next suggested steps',
		'- Review the latest assistant output.',
		'- Continue implementation from the current state.',
		'- Use this file and the `.openml` folder to recover project context.'
	].join('\n');
}

function normalizeHeading(kind: string): string {
	return kind
		.replace(/[-_]+/g, ' ')
		.replace(/\b\w/g, char => char.toUpperCase());
}

function buildWorklogEntry(kind: string, prompt: string, content: string): string {
	return [
		`## ${normalizeHeading(kind)} update`,
		'',
		`- Timestamp: ${nowIso()}`,
		`- Scope: ${normalizeHeading(kind)}`,
		'',
		'### Request',
		prompt.trim() || 'No request captured.',
		'',
		'### Result',
		content.trim() || 'No result captured.'
	].join('\n');
}

export async function updatePlanningFile(prompt: string, response: string, historySummary: string): Promise<void> {
	await writeRootMarkdownFile('PLANNING.md', buildPlanningDocument(prompt, response, historySummary));
}

export async function writeActivityLog(kind: string, prompt: string, content: string): Promise<void> {
	const heading = '# OPENML WORKLOG\n\nThis file records meaningful implementation progress for the project.';
	const entry = buildWorklogEntry(kind, prompt, content);
	const root = getWorkspaceRoot();
	if (!root) {
		return;
	}

	const target = vscode.Uri.joinPath(root, WORKLOG_FILE);
	let exists = true;
	try {
		await vscode.workspace.fs.stat(target);
	} catch {
		exists = false;
	}

	if (!exists) {
		await writeTextFile(target, `${heading}\n\n${entry}\n`);
		return;
	}

	await appendRootMarkdownFile(WORKLOG_FILE, entry);
}

export { getHistoryTokenBudget, approximateTokens };
