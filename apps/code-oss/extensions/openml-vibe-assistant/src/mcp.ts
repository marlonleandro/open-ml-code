import * as vscode from 'vscode';

type McpTransport = 'stdio' | 'http';

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
};

const MCP_PROVIDER_ID = 'configured-servers';

const onDidChangeMcpServersEmitter = new vscode.EventEmitter<void>();

function getConfig(): vscode.WorkspaceConfiguration {
	return vscode.workspace.getConfiguration('openmlAssistant');
}

function getConfiguredServers(): ConfiguredMcpServer[] {
	return getConfig().get<ConfiguredMcpServer[]>('mcp.servers', []);
}

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

export function getMcpServerSummaries(): McpServerSummary[] {
	return getNormalizedServers().map(server => ({
		label: server.label,
		transport: server.transport,
		target: server.transport === 'stdio'
			? `${server.command ?? ''} ${(server.args ?? []).join(' ')}`.trim()
			: (server.url ?? ''),
		enabled: server.enabled !== false
	}));
}

export function getEnabledMcpServerCount(): number {
	return getNormalizedServers().filter(server => server.enabled !== false).length;
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
		}
	});

	const summariesCommand = vscode.commands.registerCommand('openmlAssistant.showMcpServers', async () => {
		const summaries = getMcpServerSummaries();
		if (!summaries.length) {
			void vscode.window.showInformationMessage('OpenML Assistant has no MCP servers configured.');
			return;
		}

		const selected = await vscode.window.showQuickPick(
			summaries.map(summary => ({
				label: summary.label,
				description: `${summary.transport.toUpperCase()}${summary.enabled ? '' : ' | disabled'}`,
				detail: summary.target || 'No target configured'
			})),
			{ placeHolder: 'Configured MCP servers published by OpenML Assistant' }
		);

		if (selected) {
			void vscode.window.showInformationMessage(`${selected.label}: ${selected.detail ?? selected.description ?? ''}`);
		}
	});

	context.subscriptions.push(providerDisposable, configurationDisposable, summariesCommand);
	return vscode.Disposable.from(providerDisposable, configurationDisposable, summariesCommand);
}
