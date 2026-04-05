import * as vscode from 'vscode';
import { spawn } from 'child_process';
import { buildDeepContext, getRelevantWorkspaceSymbols, rebuildSemanticIndex } from './context';
import { getAllMcpServerSummaries, getRuntimeEditorMcpServerSummaries, getWorkspaceMcpServerSummaries } from './mcp';
import { addWorkspaceRule, buildWorkspaceMemoryBlock, clearProjectMemoryNotes, clearWorkspaceRules, getWorkspaceRules, rememberProjectNote } from './memory';

type AssistantMode = 'agent' | 'ask' | 'edit' | 'plan';

const MAX_TOOL_OUTPUT = 16000;
const outputChannel = vscode.window.createOutputChannel('OpenML Assistant Tools');
const MAX_FIX_ATTEMPTS = 3;
const EXCLUDED_DIRS = new Set(['node_modules', '.git', 'out', '.build', 'dist', 'coverage']);

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

	const files = await collectWorkspaceFiles(200);
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
			const suffix = candidate.file.slice(1).toLowerCase();
			const matches = (await collectWorkspaceFiles(250)).filter(file => file.fsPath.toLowerCase().endsWith(suffix));
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

async function mcpTool(): Promise<ToolResult> {
	const summaries = await getAllMcpServerSummaries();
	return {
		title: 'Available MCP servers',
		content: summaries.length
			? summaries.map(summary => `- ${summary.label} (${summary.transport.toUpperCase()}, ${summary.sourceLabel})${summary.enabled ? '' : ' [disabled]'}: ${summary.target}`).join('\n')
			: 'No MCP servers are configured yet.',
		followUpPrompt: undefined
	};
}

async function mcpWorkspaceTool(): Promise<ToolResult> {
	const summaries = await getWorkspaceMcpServerSummaries();
	return {
		title: 'Workspace MCP servers',
		content: summaries.length
			? summaries.map(summary => `- ${summary.label} (${summary.transport.toUpperCase()}, ${summary.sourceLabel}): ${summary.target}`).join('\n')
			: 'No workspace MCP servers were found in `.mcp.json` or `.vscode/mcp.json`.'
	};
}

async function mcpLiveTool(): Promise<ToolResult> {
	const summaries = getRuntimeEditorMcpServerSummaries();
	return {
		title: 'Live editor MCP servers',
		content: summaries.length
			? summaries.map(summary => `- ${summary.label} (${summary.transport.toUpperCase()}, ${summary.sourceLabel}): ${summary.target}`).join('\n')
			: 'No live MCP servers were reported by the editor runtime registry.'
	};
}

async function mcpResourcesTool(): Promise<ToolResult> {
	await vscode.commands.executeCommand('openmlAssistant.browseMcpResources');
	return {
		title: 'MCP resource browser',
		content: 'Opened the built-in MCP resource browser. Select a resource there to inspect what is currently available from your MCP servers.'
	};
}

async function mcpManageTool(): Promise<ToolResult> {
	await vscode.commands.executeCommand('openmlAssistant.manageMcpServers');
	return {
		title: 'MCP server manager',
		content: 'Opened the built-in MCP server manager. You can start, stop, restart, inspect output, and browse resources for configured MCP servers there.'
	};
}

async function mcpAddTool(): Promise<ToolResult> {
	await vscode.commands.executeCommand('openmlAssistant.addMcpServer');
	return {
		title: 'Add MCP server',
		content: 'Opened the built-in Add MCP Server flow so you can register a new MCP configuration safely through the editor UI.'
	};
}

async function mcpCatalogTool(): Promise<ToolResult> {
	await vscode.commands.executeCommand('openmlAssistant.browseMcpServers');
	return {
		title: 'MCP server catalog',
		content: 'Opened the built-in MCP server browser so you can discover or inspect additional MCP servers.'
	};
}

async function mcpInstalledTool(): Promise<ToolResult> {
	await vscode.commands.executeCommand('openmlAssistant.showInstalledMcpServers');
	return {
		title: 'Installed MCP servers',
		content: 'Opened the installed MCP servers view so you can inspect the MCP servers already available in the editor.'
	};
}

async function mcpConfigTool(): Promise<ToolResult> {
	await vscode.commands.executeCommand('openmlAssistant.openMcpConfiguration');
	return {
		title: 'MCP configuration',
		content: 'Opened the user MCP configuration so you can inspect or edit MCP server settings managed by the editor.'
	};
}

async function mcpWorkspaceConfigTool(): Promise<ToolResult> {
	await vscode.commands.executeCommand('openmlAssistant.openWorkspaceMcpConfiguration');
	return {
		title: 'Workspace MCP configuration',
		content: 'Opened the workspace MCP configuration so you can inspect or edit `.mcp.json` or `.vscode/mcp.json` for this project.'
	};
}

async function mcpInitTool(): Promise<ToolResult> {
	await vscode.commands.executeCommand('openmlAssistant.initializeWorkspaceMcpConfiguration');
	return {
		title: 'Initialize workspace MCP',
		content: 'Opened a guided flow to create a starter workspace MCP configuration in `.mcp.json` or `.vscode/mcp.json`.'
	};
}

async function mcpGatewayTool(): Promise<ToolResult> {
	await vscode.commands.executeCommand('openmlAssistant.startMcpGateway');
	return {
		title: 'MCP gateway',
		content: 'Started the editor MCP gateway. External processes can now connect to the editor MCP endpoint shown by OpenML Assistant.'
	};
}

async function mcpGatewayStatusTool(): Promise<ToolResult> {
	await vscode.commands.executeCommand('openmlAssistant.showMcpGateway');
	return {
		title: 'MCP gateway status',
		content: 'Displayed the current MCP gateway address if the gateway is running.'
	};
}

async function mcpGatewayStopTool(): Promise<ToolResult> {
	await vscode.commands.executeCommand('openmlAssistant.stopMcpGateway');
	return {
		title: 'MCP gateway stopped',
		content: 'Stopped the editor MCP gateway if it was running.'
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

	if (trimmed === '/mcp') {
		return mcpTool();
	}

	if (trimmed === '/mcp-workspace') {
		return mcpWorkspaceTool();
	}

	if (trimmed === '/mcp-live') {
		return mcpLiveTool();
	}

	if (trimmed === '/mcp-resources') {
		return mcpResourcesTool();
	}

	if (trimmed === '/mcp-manage') {
		return mcpManageTool();
	}

	if (trimmed === '/mcp-add') {
		return mcpAddTool();
	}

	if (trimmed === '/mcp-catalog') {
		return mcpCatalogTool();
	}

	if (trimmed === '/mcp-installed') {
		return mcpInstalledTool();
	}

	if (trimmed === '/mcp-config') {
		return mcpConfigTool();
	}

	if (trimmed === '/mcp-workspace-config') {
		return mcpWorkspaceConfigTool();
	}

	if (trimmed === '/mcp-init') {
		return mcpInitTool();
	}

	if (trimmed === '/mcp-gateway') {
		return mcpGatewayTool();
	}

	if (trimmed === '/mcp-gateway-status') {
		return mcpGatewayStatusTool();
	}

	if (trimmed === '/mcp-gateway-stop') {
		return mcpGatewayStopTool();
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
			'/reindex',
			'/mcp',
			'/mcp-workspace',
			'/mcp-live',
			'/mcp-init',
			'/mcp-gateway',
			'/mcp-gateway-status',
			'/mcp-gateway-stop',
			'/mcp-manage',
			'/mcp-add',
			'/mcp-catalog',
			'/mcp-installed',
			'/mcp-resources',
			'/mcp-config',
			'/mcp-workspace-config'
		].join('\n')
	};
}

