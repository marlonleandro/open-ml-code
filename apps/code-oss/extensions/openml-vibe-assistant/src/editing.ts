import * as vscode from 'vscode';
const { createTwoFilesPatch } = require('diff') as {
	createTwoFilesPatch: (
		oldFileName: string,
		newFileName: string,
		oldStr: string,
		newStr: string,
		oldHeader?: string,
		newHeader?: string,
		options?: { context?: number }
	) => string;
};

export type EditProposalFile = {
	path: string;
	content: string;
};

export type EditProposal = {
	summary: string;
	files: EditProposalFile[];
	tests: string[];
};

export type EditPreview = {
	markdown: string;
	fileCount: number;
	testCount: number;
};

const EDIT_BLOCK_REGEX = /```openml-edit\s*([\s\S]*?)```/i;
const GENERIC_JSON_BLOCK_REGEX = /```(?:json)?\s*([\s\S]*?)```/ig;

function normalizeParsedProposal(parsed: Partial<EditProposal>): EditProposal | undefined {
	const files = Array.isArray(parsed.files)
		? parsed.files.filter((file): file is EditProposalFile => !!file && typeof file.path === 'string' && typeof file.content === 'string')
		: [];
	const tests = Array.isArray(parsed.tests)
		? parsed.tests.filter((item): item is string => typeof item === 'string' && !!item.trim()).map(item => item.trim())
		: [];

	if (!files.length) {
		return undefined;
	}

	return {
		summary: typeof parsed.summary === 'string' ? parsed.summary.trim() : '',
		files,
		tests
	};
}

function tryParseProposalJson(value: string): EditProposal | undefined {
	try {
		const parsed = JSON.parse(value.trim()) as Partial<EditProposal>;
		return normalizeParsedProposal(parsed);
	} catch {
		return undefined;
	}
}

function extractJsonObjectCandidate(response: string): string | undefined {
	const start = response.indexOf('{');
	const end = response.lastIndexOf('}');
	if (start < 0 || end <= start) {
		return undefined;
	}

	return response.slice(start, end + 1).trim();
}

export function extractEditProposal(response: string): EditProposal | undefined {
	const openmlMatch = response.match(EDIT_BLOCK_REGEX);
	if (openmlMatch) {
		const parsed = tryParseProposalJson(openmlMatch[1]);
		if (parsed) {
			return parsed;
		}
	}

	for (const match of response.matchAll(GENERIC_JSON_BLOCK_REGEX)) {
		const parsed = tryParseProposalJson(match[1]);
		if (parsed) {
			return parsed;
		}
	}

	const direct = tryParseProposalJson(response);
	if (direct) {
		return direct;
	}

	const candidate = extractJsonObjectCandidate(response);
	if (candidate) {
		return tryParseProposalJson(candidate);
	}

	return undefined;
}

export function looksLikePartialEditProposal(response: string): boolean {
	const trimmed = response.trim();
	if (!trimmed) {
		return false;
	}

	const mentionsEditShape = /"summary"\s*:|"files"\s*:\s*\[|```openml-edit|```json/i.test(trimmed);
	if (!mentionsEditShape) {
		return false;
	}

	const openBraces = (trimmed.match(/\{/g) ?? []).length;
	const closeBraces = (trimmed.match(/\}/g) ?? []).length;
	const openBrackets = (trimmed.match(/\[/g) ?? []).length;
	const closeBrackets = (trimmed.match(/\]/g) ?? []).length;
	const unmatchedFence = (trimmed.match(/```/g) ?? []).length % 2 !== 0;
	const endsAbruptly = /[,:\\]$/.test(trimmed) || /path\.resolve\(__dirname,?$/i.test(trimmed);

	return unmatchedFence || openBraces > closeBraces || openBrackets > closeBrackets || endsAbruptly;
}

export function stripEditProposalBlock(response: string): string {
	if (EDIT_BLOCK_REGEX.test(response)) {
		return response.replace(EDIT_BLOCK_REGEX, '').trim();
	}

	const genericBlocks = [...response.matchAll(GENERIC_JSON_BLOCK_REGEX)];
	for (const match of genericBlocks) {
		if (tryParseProposalJson(match[1])) {
			return response.replace(match[0], '').trim();
		}
	}

	if (tryParseProposalJson(response)) {
		return '';
	}

	const candidate = extractJsonObjectCandidate(response);
	if (candidate && tryParseProposalJson(candidate)) {
		return response.replace(candidate, '').trim();
	}

	return response.trim();
}

function getWorkspaceFolder(): vscode.WorkspaceFolder {
	const folder = vscode.workspace.workspaceFolders?.[0];
	if (!folder) {
		throw new Error('No workspace folder is open.');
	}

	return folder;
}

function resolveProposalUri(filePath: string): vscode.Uri {
	if (/^[a-zA-Z]:\\|^\//.test(filePath)) {
		throw new Error(`Edit proposal path must be relative to the workspace: ${filePath}`);
	}

	return vscode.Uri.joinPath(getWorkspaceFolder().uri, filePath);
}

async function pickProposalFile(proposal: EditProposal): Promise<EditProposalFile | undefined> {
	if (!proposal.files.length) {
		return undefined;
	}

	if (proposal.files.length === 1) {
		return proposal.files[0];
	}

	const selected = await vscode.window.showQuickPick(
		proposal.files.map(file => ({ label: file.path, description: 'Preview this file', file })),
		{ placeHolder: 'Select the file you want to preview' }
	);

	return selected?.file;
}

async function readWorkspaceFile(filePath: string): Promise<string> {
	const targetUri = resolveProposalUri(filePath);
	try {
		const existingBytes = await vscode.workspace.fs.readFile(targetUri);
		return new TextDecoder('utf-8').decode(existingBytes);
	} catch {
		return '';
	}
}

function ensureTrailingNewline(value: string): string {
	return value.endsWith('\n') ? value : `${value}\n`;
}

function createFilePatch(filePath: string, before: string, after: string): string {
	return createTwoFilesPatch(
		filePath,
		filePath,
		ensureTrailingNewline(before),
		ensureTrailingNewline(after),
		'workspace',
		'proposal',
		{ context: 3 }
	);
}

export function buildUserFacingEditSummary(proposal: EditProposal): string {
	const lines: string[] = [];
	lines.push('## Cambios listos para revisar');
	lines.push('');
	lines.push(proposal.summary || 'OpenML Assistant preparo una propuesta editable para este cambio.');
	lines.push('');
	lines.push(`Archivos propuestos: ${proposal.files.length}`);
	if (proposal.files.length) {
		lines.push('');
		lines.push('### Archivos');
		for (const file of proposal.files.slice(0, 12)) {
			lines.push(`- \`${file.path}\``);
		}
		if (proposal.files.length > 12) {
			lines.push(`- ... y ${proposal.files.length - 12} archivo(s) mas`);
		}
	}

	if (proposal.tests.length) {
		lines.push('');
		lines.push(`Tests sugeridos: ${proposal.tests.length}`);
	}

	lines.push('');
	lines.push('Usa `Preview Edits` para revisar los cambios y `Apply Edits` para aplicarlos.');
	return lines.join('\n');
}

export async function buildEditPreview(proposal: EditProposal): Promise<EditPreview> {
	const sections: string[] = [
		'# OpenML Assistant Edit Preview',
		'',
		proposal.summary || 'No summary was provided by the model.',
		'',
		`Files proposed: ${proposal.files.length}`,
		`Suggested tests: ${proposal.tests.length}`,
		''
	];

	for (const file of proposal.files) {
		const before = await readWorkspaceFile(file.path);
		sections.push(`## ${file.path}`);
		sections.push('');
		sections.push('```diff');
		sections.push(createFilePatch(file.path, before, file.content).trim());
		sections.push('```');
		sections.push('');
	}

	if (proposal.tests.length) {
		sections.push('## Suggested Tests');
		sections.push('');
		for (const test of proposal.tests) {
			sections.push(`- \`${test}\``);
		}
		sections.push('');
	}

	return {
		markdown: sections.join('\n').trim(),
		fileCount: proposal.files.length,
		testCount: proposal.tests.length
	};
}

export async function previewEditProposal(proposal: EditProposal): Promise<void> {
	if (!proposal.files.length) {
		throw new Error('No proposed file changes available.');
	}

	const preview = await buildEditPreview(proposal);
	const previewDocument = await vscode.workspace.openTextDocument({
		language: 'markdown',
		content: preview.markdown
	});
	await vscode.window.showTextDocument(previewDocument, { preview: false, preserveFocus: true });

	const file = await pickProposalFile(proposal);
	if (!file) {
		return;
	}

	const targetUri = resolveProposalUri(file.path);
	const language = targetUri.fsPath.split('.').pop();
	const originalDoc = await vscode.workspace.openTextDocument({
		language,
		content: await readWorkspaceFile(file.path)
	});
	const proposedDoc = await vscode.workspace.openTextDocument({
		language,
		content: file.content
	});
	await vscode.commands.executeCommand(
		'vscode.diff',
		originalDoc.uri,
		proposedDoc.uri,
		proposal.files.length > 1 ? `Preview ${file.path} (${proposal.files.length} files proposed)` : `Preview ${file.path}`
	);
}

export async function applyEditProposal(proposal: EditProposal): Promise<void> {
	if (!proposal.files.length) {
		throw new Error('There are no file edits to apply.');
	}

	const approval = await vscode.window.showWarningMessage(
		`OpenML Assistant wants to apply ${proposal.files.length} file change(s).`,
		{ modal: true, detail: proposal.summary || 'Review the preview before applying these changes.' },
		'Apply'
	);

	if (approval !== 'Apply') {
		throw new Error('Edit application was cancelled.');
	}

	const encoder = new TextEncoder();
	for (const file of proposal.files) {
		const targetUri = resolveProposalUri(file.path);
		const parent = vscode.Uri.joinPath(targetUri, '..');
		try {
			await vscode.workspace.fs.createDirectory(parent);
		} catch {
			// createDirectory is idempotent enough for our workflow
		}
		await vscode.workspace.fs.writeFile(targetUri, encoder.encode(file.content));
	}

	await vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
	void vscode.window.showInformationMessage(`Applied ${proposal.files.length} file change(s).`);
}

export async function clearEditPreviewArtifacts(): Promise<void> {
	const tabsToClose = vscode.window.tabGroups.all
		.flatMap(group => group.tabs)
		.filter(tab => tab.label === 'OpenML Assistant Edit Preview' || tab.label.startsWith('Preview '));

	if (tabsToClose.length) {
		await vscode.window.tabGroups.close(tabsToClose);
	}
}

export async function showSuggestedTests(proposal: EditProposal): Promise<void> {
	if (!proposal.tests.length) {
		throw new Error('There are no suggested tests in the last edit proposal.');
	}

	const content = ['# Suggested Tests', '', ...proposal.tests.map(test => `- \`${test}\``)].join('\n');
	const document = await vscode.workspace.openTextDocument({ language: 'markdown', content });
	await vscode.window.showTextDocument(document, { preview: false });
}

