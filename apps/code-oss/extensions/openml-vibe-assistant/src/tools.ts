import * as vscode from 'vscode';
import { spawn } from 'child_process';
import { buildDeepContext, getRelevantWorkspaceSymbols, rebuildSemanticIndex } from './context';
import { addWorkspaceRule, buildWorkspaceMemoryBlock, clearProjectMemoryNotes, clearWorkspaceRules, getWorkspaceRules, rememberProjectNote } from './memory';

type AssistantMode = 'agent' | 'ask' | 'edit' | 'plan';

const MAX_TOOL_OUTPUT = 16000;
const outputChannel = vscode.window.createOutputChannel('OpenML Assistant Tools');
const MAX_FIX_ATTEMPTS = 3;

export type ToolResult = {
	title: string;
	content: string;
	followUpPrompt?: string;
	preferredMode?: AssistantMode;
	fixLoopCommand?: string;
	fixLoopAttempt?: number;
};

export type CommandExecution = {
	stdout: string;
	stderr: string;
	exitCode: number;
	combined: string;
	command: string;
	cwd?: string;
};

export type TestRunResult = {
	command: string;
	execution: CommandExecution;
	summary: string;
	diagnostics: string;
	success: boolean;
};

export const maxFixAttempts = MAX_FIX_ATTEMPTS;

function truncate(value: string, max = MAX_TOOL_OUTPUT): string {
	if (value.length <= max) {
		return value;
	}

	return `${value.slice(0, max)}\n\n[output truncated]`;
}

function getWorkspaceFolder(): vscode.WorkspaceFolder | undefined {
	return vscode.workspace.workspaceFolders?.[0];
}

function getWorkspaceRoot(): string | undefined {
	return getWorkspaceFolder()?.uri.fsPath;
}

function resolveWorkspacePath(inputPath: string): vscode.Uri {
	if (/^[a-zA-Z]:\\|^\//.test(inputPath)) {
		return vscode.Uri.file(inputPath);
	}

	const workspaceFolder = getWorkspaceFolder();
	if (!workspaceFolder) {
		throw new Error('No workspace folder is open.');
	}

	return vscode.Uri.joinPath(workspaceFolder.uri, inputPath);
}

async function readFileText(uri: vscode.Uri): Promise<string> {
	const bytes = await vscode.workspace.fs.readFile(uri);
	return new TextDecoder('utf-8').decode(bytes);
}

function appendOutput(title: string, body: string): void {
	outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] ${title}`);
	outputChannel.appendLine(body);
	outputChannel.appendLine('');
}

function shellForPlatform(): { executable: string; args: string[] } {
	if (process.platform === 'win32') {
		return { executable: 'cmd.exe', args: ['/d', '/s', '/c'] };
	}

	return { executable: '/bin/sh', args: ['-lc'] };
}

function runShellCommand(command: string, cwd?: string): Promise<CommandExecution> {
	return new Promise((resolve, reject) => {
		const shell = shellForPlatform();
		const child = spawn(shell.executable, [...shell.args, command], {
			cwd,
			shell: false,
			env: process.env,
			windowsHide: true
		});

		let stdout = '';
		let stderr = '';

		child.stdout.on('data', chunk => {
			const text = chunk.toString();
			stdout += text;
			outputChannel.append(text);
		});

		child.stderr.on('data', chunk => {
			const text = chunk.toString();
			stderr += text;
			outputChannel.append(text);
		});

		child.on('error', error => reject(error));
		child.on('close', exitCode => {
			const combined = [stdout, stderr].filter(Boolean).join('\n').trim();
			resolve({
				stdout,
				stderr,
				exitCode: exitCode ?? -1,
				combined,
				command,
				cwd
			});
		});
	});
}

async function requestCommandApproval(command: string, purpose: string): Promise<void> {
	const approval = await vscode.window.showWarningMessage(
		`OpenML Assistant wants to ${purpose}:\n${command}`,
		{ modal: true },
		'Run'
	);

	if (approval !== 'Run') {
		throw new Error('Command execution was cancelled.');
	}
}

function summarizeExecution(execution: CommandExecution): string {
	return [
		`Command: ${execution.command}`,
		execution.cwd ? `CWD: ${execution.cwd}` : undefined,
		`Exit code: ${execution.exitCode}`,
		'',
		truncate(execution.combined || 'Command completed with no output.')
	].filter(Boolean).join('\n');
}

export function formatDiagnostics(limit = 100): string {
	const diagnostics = vscode.languages.getDiagnostics()
		.flatMap(([uri, items]) => items.map(item => ({ uri, item })))
		.filter(entry => entry.item.severity === vscode.DiagnosticSeverity.Error || entry.item.severity === vscode.DiagnosticSeverity.Warning)
		.slice(0, limit);

	if (!diagnostics.length) {
		return 'No diagnostics found.';
	}

	return diagnostics.map(entry => {
		const severity = entry.item.severity === vscode.DiagnosticSeverity.Error ? 'error' : 'warning';
		return `${entry.uri.fsPath}:${entry.item.range.start.line + 1}:${entry.item.range.start.character + 1} [${severity}] ${entry.item.message}`;
	}).join('\n');
}

async function readFileTool(filePath: string): Promise<ToolResult> {
	const uri = resolveWorkspacePath(filePath);
	const content = await readFileText(uri);
	return {
		title: `Read ${uri.fsPath}`,
		content: truncate(content)
	};
}

async function searchWorkspaceTool(pattern: string): Promise<ToolResult> {
	const workspaceFolder = getWorkspaceFolder();
	if (!workspaceFolder) {
		throw new Error('No workspace folder is open.');
	}

	const files = await vscode.workspace.findFiles('**/*', '**/{node_modules,.git,out,.build,dist,coverage}/**', 200);
	const results: string[] = [];
	const lowerPattern = pattern.toLowerCase();

	for (const file of files) {
		let content = '';
		try {
			content = await readFileText(file);
		} catch {
			continue;
		}

		const lines = content.split(/\r?\n/);
		for (let index = 0; index < lines.length; index++) {
			if (lines[index].toLowerCase().includes(lowerPattern)) {
				results.push(`${file.fsPath}:${index + 1}: ${lines[index].trim()}`);
				if (results.length >= 50) {
					return {
						title: `Search results for \"${pattern}\"`,
						content: truncate(results.join('\n'))
					};
				}
			}
		}
	}

	return {
		title: `Search results for \"${pattern}\"`,
		content: results.length ? truncate(results.join('\n')) : 'No matches found.'
	};
}

async function diffTool(optionalPath?: string): Promise<ToolResult> {
	const workspaceRoot = getWorkspaceRoot();
	if (!workspaceRoot) {
		throw new Error('No workspace folder is open.');
	}

	const command = optionalPath
		? `git diff -- \"${optionalPath.replace(/\"/g, '\\\"')}\"`
		: 'git diff';
	const execution = await runShellCommand(command, workspaceRoot);
	appendOutput('Diff command', summarizeExecution(execution));
	return {
		title: optionalPath ? `Diff for ${optionalPath}` : 'Workspace diff',
		content: truncate(execution.combined || 'No changes found.')
	};
}

async function runCommandTool(command: string): Promise<ToolResult> {
	const workspaceRoot = getWorkspaceRoot();
	await requestCommandApproval(command, 'run this command');
	outputChannel.show(true);
	const execution = await runShellCommand(command, workspaceRoot);
	appendOutput('Command execution', summarizeExecution(execution));
	return {
		title: `Command: ${command}`,
		content: summarizeExecution(execution)
	};
}

async function detectTestCommand(): Promise<string | undefined> {
	const workspaceRoot = getWorkspaceRoot();
	if (!workspaceRoot) {
		return undefined;
	}

	const packageJsonUri = vscode.Uri.joinPath(vscode.Uri.file(workspaceRoot), 'package.json');
	try {
		const packageJson = JSON.parse(await readFileText(packageJsonUri)) as { scripts?: Record<string, string> };
		if (packageJson.scripts?.test) {
			return 'npm test';
		}
	} catch {
		// ignore
	}

	const candidates = [
		{ file: 'pnpm-lock.yaml', command: 'pnpm test' },
		{ file: 'package-lock.json', command: 'npm test' },
		{ file: 'yarn.lock', command: 'yarn test' },
		{ file: 'pytest.ini', command: 'pytest' },
		{ file: 'pyproject.toml', command: 'pytest' },
		{ file: 'Cargo.toml', command: 'cargo test' },
		{ file: 'go.mod', command: 'go test ./...' },
		{ file: '*.sln', command: 'dotnet test' }
	];

	for (const candidate of candidates) {
		if (candidate.file.startsWith('*.')) {
			const matches = await vscode.workspace.findFiles(candidate.file, '**/{node_modules,.git,out,.build,dist}/**', 1);
			if (matches.length) {
				return candidate.command;
			}
			continue;
		}

		const uri = vscode.Uri.joinPath(vscode.Uri.file(workspaceRoot), candidate.file);
		try {
			await vscode.workspace.fs.stat(uri);
			return candidate.command;
		} catch {
			// keep looking
		}
	}

	return undefined;
}

export async function runTestsCommand(command?: string, requireApproval = true): Promise<TestRunResult> {
	const resolved = command?.trim() || await detectTestCommand();
	if (!resolved) {
		throw new Error('Could not detect a test command. Use /test <command>.');
	}

	if (requireApproval) {
		await requestCommandApproval(resolved, 'run tests');
	}

	outputChannel.show(true);
	const execution = await runShellCommand(resolved, getWorkspaceRoot());
	const summary = summarizeExecution(execution);
	appendOutput('Test execution', summary);
	return {
		command: resolved,
		execution,
		summary,
		diagnostics: formatDiagnostics(60),
		success: execution.exitCode === 0
	};
}

export function buildFixLoopPrompt(testResult: TestRunResult, attempt: number): string {
	return [
		`Fix loop attempt: ${attempt} of ${MAX_FIX_ATTEMPTS}`,
		'Analyze the following failing execution context and propose the required code changes as an openml-edit response.',
		'If files need to be changed, return a strict openml-edit block with full file contents and suggested tests.',
		'',
		'Execution result:',
		testResult.summary,
		'',
		'Diagnostics:',
		testResult.diagnostics
	].join('\n');
}

async function runTestsTool(command?: string): Promise<ToolResult> {
	const result = await runTestsCommand(command, true);
	return {
		title: `Tests: ${result.command}`,
		content: result.summary
	};
}

async function errorsTool(): Promise<ToolResult> {
	const content = formatDiagnostics();
	return {
		title: 'Workspace diagnostics',
		content: truncate(content)
	};
}

async function memoryTool(): Promise<ToolResult> {
	return {
		title: 'Project memory',
		content: buildWorkspaceMemoryBlock() || 'No project memory or workspace rules have been stored yet.'
	};
}

async function rememberTool(note: string): Promise<ToolResult> {
	await rememberProjectNote(note);
	return {
		title: 'Project memory updated',
		content: `Saved memory note: ${note.trim()}`
	};
}

async function rulesTool(): Promise<ToolResult> {
	const rules = getWorkspaceRules();
	return {
		title: 'Workspace rules',
		content: rules.length ? rules.map(rule => `- ${rule}`).join('\n') : 'No workspace rules stored yet.'
	};
}

async function setRuleTool(rule: string): Promise<ToolResult> {
	await addWorkspaceRule(rule);
	return {
		title: 'Workspace rule added',
		content: `Saved rule: ${rule.trim()}`
	};
}

async function clearMemoryTool(): Promise<ToolResult> {
	await clearProjectMemoryNotes();
	return {
		title: 'Project memory cleared',
		content: 'Stored project memory notes were removed for this workspace.'
	};
}

async function clearRulesTool(): Promise<ToolResult> {
	await clearWorkspaceRules();
	return {
		title: 'Workspace rules cleared',
		content: 'Stored workspace rules were removed for this workspace.'
	};
}

async function symbolsTool(query: string): Promise<ToolResult> {
	const symbols = await getRelevantWorkspaceSymbols(query, 15);
	return {
		title: `Workspace symbols for \"${query}\"`,
		content: symbols.length ? symbols.join('\n') : 'No matching workspace symbols were found.'
	};
}

async function reindexTool(): Promise<ToolResult> {
	const chunks = await rebuildSemanticIndex();
	return {
		title: 'Semantic index rebuilt',
		content: `Indexed ${chunks} chunks from the current workspace.`
	};
}

async function contextTool(query: string): Promise<ToolResult> {
	return {
		title: `Deep context for \"${query}\"`,
		content: await buildDeepContext(query, vscode.window.activeTextEditor?.document.fileName, vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor.selection).trim() || undefined)
	};
}

async function fixLoopTool(command?: string): Promise<ToolResult> {
	const testResult = await runTestsCommand(command, true);
	return {
		title: 'Fix loop context',
		content: [testResult.summary, '', 'Diagnostics:', testResult.diagnostics].join('\n'),
		followUpPrompt: buildFixLoopPrompt(testResult, 1),
		preferredMode: 'edit',
		fixLoopCommand: testResult.command,
		fixLoopAttempt: 1
	};
}

export async function tryHandleToolPrompt(prompt: string): Promise<ToolResult | undefined> {
	const trimmed = prompt.trim();
	if (!trimmed.startsWith('/')) {
		return undefined;
	}

	if (trimmed.startsWith('/read ')) {
		return readFileTool(trimmed.slice('/read '.length).trim());
	}

	if (trimmed.startsWith('/search ')) {
		return searchWorkspaceTool(trimmed.slice('/search '.length).trim());
	}

	if (trimmed === '/diff') {
		return diffTool();
	}

	if (trimmed.startsWith('/diff ')) {
		return diffTool(trimmed.slice('/diff '.length).trim());
	}

	if (trimmed === '/errors') {
		return errorsTool();
	}

	if (trimmed === '/test') {
		return runTestsTool();
	}

	if (trimmed.startsWith('/test ')) {
		return runTestsTool(trimmed.slice('/test '.length).trim());
	}

	if (trimmed.startsWith('/run ')) {
		return runCommandTool(trimmed.slice('/run '.length).trim());
	}

	if (trimmed === '/fix') {
		return fixLoopTool();
	}

	if (trimmed.startsWith('/fix ')) {
		return fixLoopTool(trimmed.slice('/fix '.length).trim());
	}

	if (trimmed === '/memory') {
		return memoryTool();
	}

	if (trimmed.startsWith('/remember ')) {
		return rememberTool(trimmed.slice('/remember '.length));
	}

	if (trimmed === '/clear-memory') {
		return clearMemoryTool();
	}

	if (trimmed === '/rules') {
		return rulesTool();
	}

	if (trimmed.startsWith('/set-rule ')) {
		return setRuleTool(trimmed.slice('/set-rule '.length));
	}

	if (trimmed === '/clear-rules') {
		return clearRulesTool();
	}

	if (trimmed.startsWith('/symbols ')) {
		return symbolsTool(trimmed.slice('/symbols '.length).trim());
	}

	if (trimmed === '/reindex') {
		return reindexTool();
	}

	if (trimmed.startsWith('/context ')) {
		return contextTool(trimmed.slice('/context '.length).trim());
	}

	return {
		title: 'OpenML Assistant tools',
		content: [
			'Use one of these commands:',
			'/read <path>',
			'/search <pattern>',
			'/diff [path]',
			'/errors',
			'/test [command]',
			'/run <command>',
			'/fix [test command]',
			'/memory',
			'/remember <note>',
			'/clear-memory',
			'/rules',
			'/set-rule <rule>',
			'/clear-rules',
			'/symbols <query>',
			'/context <query>',
			'/reindex'
		].join('\n')
	};
}

