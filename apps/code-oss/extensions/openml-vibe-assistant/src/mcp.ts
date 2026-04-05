import * as vscode from 'vscode';

type McpTransport = 'stdio' | 'http';
type McpSource = 'assistant' | 'workspace-standalone' | 'workspace-vscode' | 'editor-runtime';
type McpAssistantMode = 'agent' | 'ask' | 'edit' | 'plan';
type RuntimeMcpGateway = vscode.Disposable & { address: vscode.Uri };

type ConfiguredMcpServer = {
	label: string;
	transport: McpTransport;
	command?: string;
	args?: string[];
	cwd?: string;
	env?: Record<string, string | number | null>;
	url?: string;
	headers?: Record<string, string>;
	version?: string;
	enabled?: boolean;
};

export type McpServerSummary = {
	label: string;
	transport: McpTransport;
	target: string;
	enabled: boolean;
	source: McpSource;
	sourceLabel: string;
};

const MCP_PROVIDER_ID = 'configured-servers';
const MCP_ADD_CONFIGURATION_COMMAND = 'workbench.mcp.addConfiguration';
const MCP_BROWSE_SERVERS_COMMAND = 'workbench.mcp.browseServers';
const MCP_BROWSE_RESOURCES_COMMAND = 'workbench.mcp.browseResources';
const MCP_LIST_SERVERS_COMMAND = 'workbench.mcp.listServer';
const MCP_OPEN_USER_CONFIG_COMMAND = 'workbench.mcp.openUserMcpJson';
const MCP_OPEN_WORKSPACE_CONFIG_COMMAND = 'workbench.mcp.openWorkspaceMcpJson';
const MCP_OPEN_WORKSPACE_FOLDER_CONFIG_COMMAND = 'workbench.mcp.openWorkspaceFolderMcpJson';
const MCP_SHOW_INSTALLED_COMMAND = 'workbench.mcp.showInstalledServers';

const onDidChangeMcpServersEmitter = new vscode.EventEmitter<void>();
const onDidChangeKnownMcpServersEmitter = new vscode.EventEmitter<void>();
let activeGateway: RuntimeMcpGateway | undefined;

function getConfig(): vscode.WorkspaceConfiguration {
	return vscode.workspace.getConfiguration('openmlAssistant');
}

function getConfiguredServers(): ConfiguredMcpServer[] {
	return getConfig().get<ConfiguredMcpServer[]>('mcp.servers', []);
}

export const onDidChangeKnownMcpServers = onDidChangeKnownMcpServersEmitter.event;

function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value) && value.every(item => typeof item === 'string');
}

function sanitizeHeaders(value: unknown): Record<string, string> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return {};
	}

	const headers: Record<string, string> = {};
	for (const [key, headerValue] of Object.entries(value)) {
		if (isNonEmptyString(key) && typeof headerValue === 'string') {
			headers[key] = headerValue;
		}
	}
	return headers;
}

function sanitizeEnv(value: unknown): Record<string, string | number | null> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return {};
	}

	const env: Record<string, string | number | null> = {};
	for (const [key, envValue] of Object.entries(value)) {
		if (!isNonEmptyString(key)) {
			continue;
		}
		if (typeof envValue === 'string' || typeof envValue === 'number' || envValue === null) {
			env[key] = envValue;
		}
	}
	return env;
}

function normalizeServer(entry: unknown): ConfiguredMcpServer | undefined {
	if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
		return undefined;
	}

	const candidate = entry as Record<string, unknown>;
	const label = isNonEmptyString(candidate.label) ? candidate.label.trim() : '';
	const transport = candidate.transport === 'http' ? 'http' : candidate.transport === 'stdio' ? 'stdio' : undefined;
	if (!label || !transport) {
		return undefined;
	}

	const server: ConfiguredMcpServer = {
		label,
		transport,
		enabled: candidate.enabled !== false,
		version: isNonEmptyString(candidate.version) ? candidate.version.trim() : undefined
	};

	if (transport === 'stdio') {
		server.command = isNonEmptyString(candidate.command) ? candidate.command.trim() : undefined;
		server.args = isStringArray(candidate.args) ? candidate.args : [];
		server.cwd = isNonEmptyString(candidate.cwd) ? candidate.cwd.trim() : undefined;
		server.env = sanitizeEnv(candidate.env);
		return server.command ? server : undefined;
	}

	server.url = isNonEmptyString(candidate.url) ? candidate.url.trim() : undefined;
	server.headers = sanitizeHeaders(candidate.headers);
	return server.url ? server : undefined;
}

function getNormalizedServers(): ConfiguredMcpServer[] {
	return getConfiguredServers()
		.map(normalizeServer)
		.filter((server): server is ConfiguredMcpServer => !!server);
}

function toMcpDefinition(server: ConfiguredMcpServer): vscode.McpServerDefinition | undefined {
	if (server.transport === 'stdio') {
		if (!server.command) {
			return undefined;
		}

		const definition = new vscode.McpStdioServerDefinition(
			server.label,
			server.command,
			server.args ?? [],
			server.env ?? {},
			server.version
		);
		if (server.cwd) {
			definition.cwd = vscode.Uri.file(server.cwd);
		}
		return definition;
	}

	if (!server.url) {
		return undefined;
	}

	return new vscode.McpHttpServerDefinition(
		server.label,
		vscode.Uri.parse(server.url),
		server.headers ?? {},
		server.version
	);
}

type WorkspaceMcpServer = {
	label: string;
	transport: McpTransport;
	target: string;
	source: McpSource;
	sourceLabel: string;
};

function normalizeWorkspaceTransport(value: unknown): McpTransport {
	if (value === 'http' || value === 'sse') {
		return 'http';
	}

	return 'stdio';
}

function normalizeWorkspaceServerEntry(name: string, entry: unknown, source: McpSource, sourceLabel: string): WorkspaceMcpServer | undefined {
	if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
		return undefined;
	}

	const candidate = entry as Record<string, unknown>;
	const transport = normalizeWorkspaceTransport(candidate.type);
	if (transport === 'stdio') {
		const command = isNonEmptyString(candidate.command) ? candidate.command.trim() : '';
		if (!command) {
			return undefined;
		}

		const args = isStringArray(candidate.args) ? candidate.args.join(' ') : '';
		const cwd = isNonEmptyString(candidate.cwd) ? ` (cwd: ${candidate.cwd.trim()})` : '';
		return {
			label: name,
			transport,
			target: `${command}${args ? ` ${args}` : ''}${cwd}`.trim(),
			source,
			sourceLabel
		};
	}

	const url = isNonEmptyString(candidate.url) ? candidate.url.trim() : '';
	if (!url) {
		return undefined;
	}

	return {
		label: name,
		transport,
		target: url,
		source,
		sourceLabel
	};
}

async function readWorkspaceMcpConfig(uri: vscode.Uri, source: McpSource, sourceLabel: string): Promise<WorkspaceMcpServer[]> {
	try {
		const bytes = await vscode.workspace.fs.readFile(uri);
		const parsed = JSON.parse(new TextDecoder('utf-8').decode(bytes)) as { servers?: Record<string, unknown> };
		if (!parsed?.servers || typeof parsed.servers !== 'object') {
			return [];
		}

		return Object.entries(parsed.servers)
			.map(([name, entry]) => normalizeWorkspaceServerEntry(name, entry, source, sourceLabel))
			.filter((server): server is WorkspaceMcpServer => !!server);
	} catch {
		return [];
	}
}

export async function getWorkspaceMcpServerSummaries(): Promise<McpServerSummary[]> {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (!workspaceFolder) {
		return [];
	}

	const standaloneUri = vscode.Uri.joinPath(workspaceFolder.uri, '.mcp.json');
	const vscodeUri = vscode.Uri.joinPath(workspaceFolder.uri, '.vscode', 'mcp.json');
	const servers = await Promise.all([
		readWorkspaceMcpConfig(standaloneUri, 'workspace-standalone', '.mcp.json'),
		readWorkspaceMcpConfig(vscodeUri, 'workspace-vscode', '.vscode/mcp.json')
	]);

	return servers.flat().map(server => ({
		label: server.label,
		transport: server.transport,
		target: server.target,
		enabled: true,
		source: server.source,
		sourceLabel: server.sourceLabel
	}));
}

function getRuntimeEditorMcpDefinitions(): readonly vscode.McpServerDefinition[] {
	const runtimeLm = vscode.lm as typeof vscode.lm & {
		mcpServerDefinitions?: readonly vscode.McpServerDefinition[];
	};

	return runtimeLm.mcpServerDefinitions ?? [];
}

export function getRuntimeEditorMcpServerSummaries(): McpServerSummary[] {
	return getRuntimeEditorMcpDefinitions().map(definition => {
		if (definition instanceof vscode.McpStdioServerDefinition) {
			const cwd = definition.cwd ? ` (cwd: ${definition.cwd.fsPath})` : '';
			return {
				label: definition.label,
				transport: 'stdio' as const,
				target: `${definition.command}${definition.args.length ? ` ${definition.args.join(' ')}` : ''}${cwd}`.trim(),
				enabled: true,
				source: 'editor-runtime',
				sourceLabel: 'Editor MCP registry'
			};
		}

		return {
			label: definition.label,
			transport: 'http' as const,
			target: definition.uri.toString(true),
			enabled: true,
			source: 'editor-runtime',
			sourceLabel: 'Editor MCP registry'
		};
	});
}

export function getMcpServerSummaries(): McpServerSummary[] {
	return getNormalizedServers().map(server => ({
		label: server.label,
		transport: server.transport,
		target: server.transport === 'stdio'
			? `${server.command ?? ''} ${(server.args ?? []).join(' ')}`.trim()
			: (server.url ?? ''),
		enabled: server.enabled !== false,
		source: 'assistant',
		sourceLabel: 'OpenML Assistant settings'
	}));
}

export async function getAllMcpServerSummaries(): Promise<McpServerSummary[]> {
	const combined = [
		...getMcpServerSummaries(),
		...(await getWorkspaceMcpServerSummaries()),
		...getRuntimeEditorMcpServerSummaries()
	];

	const deduped = new Map<string, McpServerSummary>();
	for (const summary of combined) {
		const key = `${summary.label}::${summary.transport}::${summary.target}`;
		if (!deduped.has(key)) {
			deduped.set(key, summary);
		}
	}

	return [...deduped.values()];
}

export async function getKnownMcpServerCount(): Promise<number> {
	return (await getAllMcpServerSummaries()).filter(summary => summary.enabled !== false).length;
}

export function getMcpGatewayAddress(): string | undefined {
	return activeGateway?.address.toString(true);
}

export async function ensureMcpGateway(): Promise<string> {
	if (!activeGateway) {
		const startGateway = (vscode.lm as typeof vscode.lm & { startMcpGateway?: () => Thenable<RuntimeMcpGateway | undefined> }).startMcpGateway;
		if (!startGateway) {
			throw new Error('MCP gateway is not available in this build of the editor.');
		}
		activeGateway = await startGateway();
	}

	if (!activeGateway) {
		throw new Error('MCP gateway is not available in this environment.');
	}

	return activeGateway.address.toString(true);
}

export function stopMcpGateway(): boolean {
	if (!activeGateway) {
		return false;
	}

	activeGateway.dispose();
	activeGateway = undefined;
	return true;
}

function buildMcpUsageGuidance(mode?: McpAssistantMode): string[] {
	const guidance = [
		'Safe assistant MCP guidance:',
		'- MCP servers listed here are available to the editor environment and can be managed from OpenML Assistant.',
		'- Do not claim that this assistant already executes MCP tools automatically inside the chat.',
		'- If MCP interaction is needed, refer to the assistant MCP menu or slash commands such as /mcp, /mcp-workspace, /mcp-resources, or /mcp-manage.'
	];

	if (mode === 'ask' || mode === 'plan') {
		guidance.push('- In ask/plan mode, you may reference these MCP servers as relevant capabilities for recommendations, architecture notes, and next steps.');
	}

	if (mode === 'agent' || mode === 'edit') {
		guidance.push('- In agent/edit mode, treat MCP as available surrounding infrastructure, but do not represent MCP actions as already executed unless the user explicitly opened or ran them through the IDE.');
	}

	return guidance;
}

export async function buildMcpContextBlock(mode?: McpAssistantMode): Promise<string> {
	const configuredSummaries = getMcpServerSummaries().filter(summary => summary.enabled);
	const workspaceSummaries = await getWorkspaceMcpServerSummaries();
	const runtimeSummaries = getRuntimeEditorMcpServerSummaries();
	if (!configuredSummaries.length && !workspaceSummaries.length && !runtimeSummaries.length) {
		return '';
	}

	const lines: string[] = [];
	if (configuredSummaries.length) {
		lines.push('Assistant-published MCP servers available to the editor:');
		lines.push(...configuredSummaries.map(summary => `- ${summary.label} (${summary.transport.toUpperCase()}): ${summary.target}`));
	}

	if (workspaceSummaries.length) {
		if (lines.length) {
			lines.push('');
		}
		lines.push('Workspace MCP servers discovered from project configuration:');
		lines.push(...workspaceSummaries.map(summary => `- ${summary.label} (${summary.transport.toUpperCase()}, ${summary.sourceLabel}): ${summary.target}`));
	}

	if (runtimeSummaries.length) {
		if (lines.length) {
			lines.push('');
		}
		lines.push('Live MCP servers currently known by the editor runtime:');
		lines.push(...runtimeSummaries.map(summary => `- ${summary.label} (${summary.transport.toUpperCase()}, ${summary.sourceLabel}): ${summary.target}`));
	}

	const gatewayAddress = getMcpGatewayAddress();
	if (gatewayAddress) {
		lines.push('');
		lines.push(`Active MCP gateway exposed by the editor: ${gatewayAddress}`);
	}

	lines.push('');
	lines.push(...buildMcpUsageGuidance(mode));

	return lines.join('\n');
}

export function getEnabledMcpServerCount(): number {
	return getNormalizedServers().filter(server => server.enabled !== false).length;
}

function buildWorkspaceMcpTemplateContent(serverName: string): string {
	return JSON.stringify({
		servers: {
			[serverName]: {
				type: 'stdio',
				command: 'npx',
				args: ['-y', '@modelcontextprotocol/server-filesystem', '${workspaceFolder}']
			}
		}
	}, null, '\t');
}

async function initializeWorkspaceMcpTemplate(): Promise<void> {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (!workspaceFolder) {
		throw new Error('Open a workspace folder before creating workspace MCP configuration.');
	}

	const target = await vscode.window.showQuickPick([
		{
			label: '.mcp.json',
			description: 'Standalone workspace MCP configuration in the project root',
			uri: vscode.Uri.joinPath(workspaceFolder.uri, '.mcp.json')
		},
		{
			label: '.vscode/mcp.json',
			description: 'VS Code-style workspace MCP configuration inside .vscode',
			uri: vscode.Uri.joinPath(workspaceFolder.uri, '.vscode', 'mcp.json')
		}
	], {
		placeHolder: 'Choose where to initialize workspace MCP configuration'
	});

	if (!target) {
		return;
	}

	try {
		await vscode.workspace.fs.stat(target.uri);
		const overwrite = await vscode.window.showWarningMessage(
			`${target.label} already exists. Do you want to overwrite it with a starter MCP template?`,
			{ modal: true },
			'Overwrite'
		);
		if (overwrite !== 'Overwrite') {
			return;
		}
	} catch {
		// file does not exist yet
	}

	const parent = vscode.Uri.joinPath(target.uri, '..');
	await vscode.workspace.fs.createDirectory(parent);
	await vscode.workspace.fs.writeFile(target.uri, new TextEncoder().encode(buildWorkspaceMcpTemplateContent('filesystem')));
	const document = await vscode.workspace.openTextDocument(target.uri);
	await vscode.window.showTextDocument(document);
	void vscode.window.showInformationMessage(`Created ${target.label} with a starter MCP server definition.`);
}

export function registerConfiguredMcpServers(context: vscode.ExtensionContext): vscode.Disposable {
	const provider: vscode.McpServerDefinitionProvider = {
		onDidChangeMcpServerDefinitions: onDidChangeMcpServersEmitter.event,
		provideMcpServerDefinitions() {
			return getNormalizedServers()
				.filter(server => server.enabled !== false)
				.map(toMcpDefinition)
				.filter((definition): definition is vscode.McpServerDefinition => !!definition);
		},
		resolveMcpServerDefinition(server) {
			return server;
		}
	};

	const providerDisposable = vscode.lm.registerMcpServerDefinitionProvider(MCP_PROVIDER_ID, provider);
	const configurationDisposable = vscode.workspace.onDidChangeConfiguration(event => {
		if (event.affectsConfiguration('openmlAssistant.mcp.servers')) {
			onDidChangeMcpServersEmitter.fire();
			onDidChangeKnownMcpServersEmitter.fire();
		}
	});

	const standaloneMcpWatcher = vscode.workspace.createFileSystemWatcher('**/.mcp.json');
	const vscodeMcpWatcher = vscode.workspace.createFileSystemWatcher('**/.vscode/mcp.json');
	const fireWorkspaceMcpChanged = () => onDidChangeKnownMcpServersEmitter.fire();
	const watcherDisposables = [
		standaloneMcpWatcher.onDidCreate(fireWorkspaceMcpChanged),
		standaloneMcpWatcher.onDidChange(fireWorkspaceMcpChanged),
		standaloneMcpWatcher.onDidDelete(fireWorkspaceMcpChanged),
		vscodeMcpWatcher.onDidCreate(fireWorkspaceMcpChanged),
		vscodeMcpWatcher.onDidChange(fireWorkspaceMcpChanged),
		vscodeMcpWatcher.onDidDelete(fireWorkspaceMcpChanged)
	];

	const runtimeLm = vscode.lm as typeof vscode.lm & {
		onDidChangeMcpServerDefinitions?: vscode.Event<void>;
	};
	const runtimeRegistryDisposable = runtimeLm.onDidChangeMcpServerDefinitions?.(() => {
		onDidChangeKnownMcpServersEmitter.fire();
	});

	const summariesCommand = vscode.commands.registerCommand('openmlAssistant.showMcpServers', async () => {
		const summaries = await getAllMcpServerSummaries();
		if (!summaries.length) {
			void vscode.window.showInformationMessage('OpenML Assistant found no MCP servers in settings or workspace configuration.');
			return;
		}

		const selected = await vscode.window.showQuickPick(
			summaries.map(summary => ({
				label: summary.label,
				description: `${summary.transport.toUpperCase()}${summary.enabled ? '' : ' | disabled'} | ${summary.sourceLabel}`,
				detail: summary.target || 'No target configured'
			})),
			{ placeHolder: 'MCP servers available through OpenML Assistant settings or workspace configuration' }
		);

		if (selected) {
			void vscode.window.showInformationMessage(`${selected.label}: ${selected.detail ?? selected.description ?? ''}`);
		}
	});

	const runtimeSummariesCommand = vscode.commands.registerCommand('openmlAssistant.showRuntimeMcpServers', async () => {
		const summaries = getRuntimeEditorMcpServerSummaries();
		if (!summaries.length) {
			void vscode.window.showInformationMessage('OpenML Assistant found no live MCP servers in the editor runtime registry.');
			return;
		}

		const selected = await vscode.window.showQuickPick(
			summaries.map(summary => ({
				label: summary.label,
				description: `${summary.transport.toUpperCase()} | ${summary.sourceLabel}`,
				detail: summary.target || 'No target configured'
			})),
			{ placeHolder: 'Live MCP servers currently known by the editor runtime' }
		);

		if (selected) {
			void vscode.window.showInformationMessage(`${selected.label}: ${selected.detail ?? selected.description ?? ''}`);
		}
	});

	const browseResourcesCommand = vscode.commands.registerCommand('openmlAssistant.browseMcpResources', async () => {
		await vscode.commands.executeCommand(MCP_BROWSE_RESOURCES_COMMAND);
	});

	const manageServersCommand = vscode.commands.registerCommand('openmlAssistant.manageMcpServers', async () => {
		await vscode.commands.executeCommand(MCP_LIST_SERVERS_COMMAND);
	});

	const addServerCommand = vscode.commands.registerCommand('openmlAssistant.addMcpServer', async () => {
		await vscode.commands.executeCommand(MCP_ADD_CONFIGURATION_COMMAND);
	});

	const browseServersCommand = vscode.commands.registerCommand('openmlAssistant.browseMcpServers', async () => {
		await vscode.commands.executeCommand(MCP_BROWSE_SERVERS_COMMAND);
	});

	const showInstalledCommand = vscode.commands.registerCommand('openmlAssistant.showInstalledMcpServers', async () => {
		await vscode.commands.executeCommand(MCP_SHOW_INSTALLED_COMMAND);
	});

	const openConfigCommand = vscode.commands.registerCommand('openmlAssistant.openMcpConfiguration', async () => {
		await vscode.commands.executeCommand(MCP_OPEN_USER_CONFIG_COMMAND);
	});

	const openWorkspaceConfigCommand = vscode.commands.registerCommand('openmlAssistant.openWorkspaceMcpConfiguration', async () => {
		try {
			await vscode.commands.executeCommand(MCP_OPEN_WORKSPACE_CONFIG_COMMAND);
		} catch {
			await vscode.commands.executeCommand(MCP_OPEN_WORKSPACE_FOLDER_CONFIG_COMMAND);
		}
	});

	const initWorkspaceConfigCommand = vscode.commands.registerCommand('openmlAssistant.initializeWorkspaceMcpConfiguration', async () => {
		await initializeWorkspaceMcpTemplate();
	});

	const startGatewayCommand = vscode.commands.registerCommand('openmlAssistant.startMcpGateway', async () => {
		const address = await ensureMcpGateway();
		const action = await vscode.window.showInformationMessage(
			`OpenML Assistant MCP gateway is running at ${address}`,
			'Copy Address'
		);
		if (action === 'Copy Address') {
			await vscode.env.clipboard.writeText(address);
		}
	});

	const stopGatewayCommand = vscode.commands.registerCommand('openmlAssistant.stopMcpGateway', async () => {
		const stopped = stopMcpGateway();
		void vscode.window.showInformationMessage(stopped
			? 'OpenML Assistant MCP gateway stopped.'
			: 'OpenML Assistant MCP gateway was not running.');
	});

	const showGatewayCommand = vscode.commands.registerCommand('openmlAssistant.showMcpGateway', async () => {
		const address = getMcpGatewayAddress();
		if (!address) {
			void vscode.window.showInformationMessage('OpenML Assistant MCP gateway is not running. Start it from the assistant menu or with /mcp-gateway.');
			return;
		}

		const action = await vscode.window.showInformationMessage(
			`OpenML Assistant MCP gateway address: ${address}`,
			'Copy Address'
		);
		if (action === 'Copy Address') {
			await vscode.env.clipboard.writeText(address);
		}
	});

	context.subscriptions.push(
		providerDisposable,
		configurationDisposable,
		standaloneMcpWatcher,
		vscodeMcpWatcher,
		...watcherDisposables,
		summariesCommand,
		runtimeSummariesCommand,
		browseResourcesCommand,
		manageServersCommand,
		addServerCommand,
		browseServersCommand,
		showInstalledCommand,
		openConfigCommand,
		openWorkspaceConfigCommand,
		initWorkspaceConfigCommand,
		startGatewayCommand,
		stopGatewayCommand,
		showGatewayCommand,
		runtimeRegistryDisposable ?? new vscode.Disposable(() => undefined)
	);
	return vscode.Disposable.from(
		providerDisposable,
		configurationDisposable,
		standaloneMcpWatcher,
		vscodeMcpWatcher,
		...watcherDisposables,
		summariesCommand,
		runtimeSummariesCommand,
		browseResourcesCommand,
		manageServersCommand,
		addServerCommand,
		browseServersCommand,
		showInstalledCommand,
		openConfigCommand,
		openWorkspaceConfigCommand,
		initWorkspaceConfigCommand,
		startGatewayCommand,
		stopGatewayCommand,
		showGatewayCommand,
		runtimeRegistryDisposable ?? new vscode.Disposable(() => undefined),
		new vscode.Disposable(() => {
			activeGateway?.dispose();
			activeGateway = undefined;
		})
	);
}
