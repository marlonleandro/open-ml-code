import * as vscode from 'vscode';
import { assistantModes, getActiveProvider, getCurrentModelLabel, getSystemPrompt, isLocalProvider, providerDisplayName, providerOptions, requestAssistantResponse, setActiveProvider, type AssistantMode, type ProviderId } from './providers';

type ChatRole = 'user' | 'assistant' | 'status';

type ChatMessage = {
	role: ChatRole;
	content: string;
};

type WebviewInboundMessage =
	| { type: 'ready' }
	| { type: 'submitPrompt'; prompt: string }
	| { type: 'selectProvider'; provider: ProviderId }
	| { type: 'selectMode'; mode: AssistantMode }
	| { type: 'openSettings' }
	| { type: 'copyLastResponse' }
	| { type: 'insertLastResponse' };

type WebviewOutboundMessage =
	| { type: 'state'; state: ChatState }
	| { type: 'busy'; busy: boolean }
	| { type: 'copied' }
	| { type: 'error'; message: string };

type ChatState = {
	provider: ProviderId;
	providerLabel: string;
	modelLabel: string;
	localFirst: boolean;
	mode: AssistantMode;
	messages: ChatMessage[];
};

export class OpenMLAssistantViewProvider implements vscode.WebviewViewProvider, vscode.Disposable {
	static readonly viewId = 'openmlAssistant.chatView';

	private webviewView: vscode.WebviewView | undefined;
	private readonly disposables: vscode.Disposable[] = [];
	private readonly messages: ChatMessage[] = [
		{
			role: 'status',
			content: 'Local-first listo. Usa Ollama o LM Studio como flujo principal.'
		}
	];
	private lastAssistantResponse = '';
	private isBusy = false;
	private mode: AssistantMode = 'agent';
	private pendingPrompt: string | undefined;
	private pendingMode: AssistantMode | undefined;

	constructor() {}

	async resolveWebviewView(webviewView: vscode.WebviewView): Promise<void> {
		this.webviewView = webviewView;
		webviewView.webview.options = {
			enableScripts: true
		};
		webviewView.webview.html = this.getHtml();

		webviewView.webview.onDidReceiveMessage(message => {
			void this.onMessage(message as WebviewInboundMessage);
		}, null, this.disposables);

		webviewView.onDidDispose(() => {
			this.webviewView = undefined;
		}, null, this.disposables);
	}

	async show(initialPrompt?: string, preferredMode?: AssistantMode): Promise<void> {
		if (initialPrompt) {
			this.pendingPrompt = initialPrompt;
		}
		if (preferredMode) {
			this.mode = preferredMode;
			this.pendingMode = preferredMode;
		}

		await vscode.commands.executeCommand('workbench.view.extension.openml-assistant');
		await vscode.commands.executeCommand('workbench.action.focusAuxiliaryBar');
		await this.refresh();
	}

	async refresh(): Promise<void> {
		await this.syncState();
	}

	dispose(): void {
		while (this.disposables.length) {
			const disposable = this.disposables.pop();
			disposable?.dispose();
		}
	}

	private async onMessage(message: WebviewInboundMessage): Promise<void> {
		switch (message.type) {
			case 'ready':
				await this.syncState();
				if (this.pendingMode) {
					this.mode = this.pendingMode;
					this.pendingMode = undefined;
					await this.syncState();
				}
				if (this.pendingPrompt) {
					const prompt = this.pendingPrompt;
					this.pendingPrompt = undefined;
					await this.handlePrompt(prompt);
				}
				return;
			case 'submitPrompt':
				await this.handlePrompt(message.prompt);
				return;
			case 'selectProvider':
				await setActiveProvider(message.provider);
				await this.syncState();
				return;
			case 'selectMode':
				this.mode = message.mode;
				await this.syncState();
				return;
			case 'openSettings':
				await vscode.commands.executeCommand('openmlAssistant.openSettings');
				return;
			case 'copyLastResponse':
				if (this.lastAssistantResponse) {
					await vscode.env.clipboard.writeText(this.lastAssistantResponse);
					this.postMessage({ type: 'copied' });
				}
				return;
			case 'insertLastResponse':
				await this.insertLastResponse();
				return;
		}
	}

	private async handlePrompt(prompt: string): Promise<void> {
		const trimmedPrompt = prompt.trim();
		if (!trimmedPrompt || this.isBusy) {
			return;
		}

		this.messages.push({ role: 'user', content: trimmedPrompt });
		this.isBusy = true;
		await this.syncState();
		this.postMessage({ type: 'busy', busy: true });

		const editor = vscode.window.activeTextEditor;

		try {
			const response = await requestAssistantResponse({
				prompt: trimmedPrompt,
				workspaceName: vscode.workspace.name ?? 'workspace',
				activeFileName: editor?.document.fileName,
				selectedText: editor?.document.getText(editor.selection).trim() || undefined,
				systemPrompt: getSystemPrompt(),
				mode: this.mode
			});

			this.lastAssistantResponse = response.text.trim();
			this.messages.push({
				role: 'assistant',
				content: this.lastAssistantResponse
			});
		} catch (error) {
			const text = error instanceof Error ? error.message : String(error);
			this.messages.push({
				role: 'status',
				content: `Error: ${text}`
			});
			this.postMessage({ type: 'error', message: text });
		} finally {
			this.isBusy = false;
			await this.syncState();
			this.postMessage({ type: 'busy', busy: false });
		}
	}

	private async insertLastResponse(): Promise<void> {
		if (!this.lastAssistantResponse) {
			return;
		}

		const editor = vscode.window.activeTextEditor ?? await vscode.window.showTextDocument(
			await vscode.workspace.openTextDocument({ language: 'markdown', content: '' })
		);

		await editor.edit(editBuilder => {
			const prefix = editor.document.getText().length === 0 ? '' : '\n\n';
			editBuilder.insert(editor.selection.active, `${prefix}${this.lastAssistantResponse}`);
		});
	}

	private async syncState(): Promise<void> {
		const provider = getActiveProvider();
		this.postMessage({
			type: 'state',
			state: {
				provider,
				providerLabel: providerDisplayName(provider),
				modelLabel: getCurrentModelLabel(provider) || 'Not configured',
				localFirst: isLocalProvider(provider),
				mode: this.mode,
				messages: this.messages
			}
		});
	}

	private postMessage(message: WebviewOutboundMessage): void {
		if (!this.webviewView) {
			return;
		}

		void this.webviewView.webview.postMessage(message);
	}

	private getHtml(): string {
		const providerOptionsMarkup = providerOptions
			.map(provider => `<option value="${provider}">${providerDisplayName(provider)}</option>`)
			.join('');
		const modeButtonsMarkup = assistantModes
			.map(mode => `<button type="button" class="mode-button" data-mode="${mode}">${mode}</button>`)
			.join('');

		return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>OpenML Assistant</title>
	<style>
		:root {
			color-scheme: dark;
			--bg: transparent;
			--surface: rgba(4, 19, 33, 0.24);
			--surface-strong: rgba(7, 28, 47, 0.54);
			--border: rgba(175, 206, 227, 0.10);
			--text: #ecf4f9;
			--muted: #9fb3c3;
			--accent: #d7ebfa;
			--accent-soft: rgba(215, 235, 250, 0.10);
		}

		* { box-sizing: border-box; }

		html, body {
			margin: 0;
			height: 100%;
		}

		body {
			font-family: var(--vscode-font-family, 'Segoe UI', sans-serif);
			background: var(--bg);
			color: var(--text);
		}

		.shell {
			display: grid;
			grid-template-rows: auto 1fr auto;
			height: 100vh;
			gap: 2px;
			padding: 0;
		}

		.topbar,
		.messages,
		.composer {
			border: 1px solid var(--border);
			border-radius: 8px;
			background: var(--surface);
		}

		.topbar {
			display: grid;
			grid-template-columns: 1fr auto auto;
			gap: 4px;
			align-items: center;
			padding: 2px;
		}

		.menu-wrap {
			position: relative;
		}

		.icon-button,
		.mode-button,
		.send-button,
		.menu-item {
			font: inherit;
		}

		.icon-button {
			width: 26px;
			height: 26px;
			border-radius: 8px;
			border: 1px solid transparent;
			background: transparent;
			color: var(--muted);
			cursor: pointer;
		}

		.icon-button:hover,
		.mode-button:hover,
		.send-button:hover,
		.menu-item:hover {
			background: var(--accent-soft);
			color: var(--text);
		}

		.menu {
			position: absolute;
			top: 30px;
			right: 0;
			min-width: 146px;
			border: 1px solid var(--border);
			border-radius: 8px;
			background: rgba(7, 28, 47, 0.98);
			padding: 4px;
			display: grid;
			gap: 2px;
			z-index: 20;
			box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
		}

		.menu.hidden {
			display: none;
		}

		.menu-item {
			padding: 7px 8px;
			border: 0;
			border-radius: 6px;
			background: transparent;
			color: var(--text);
			text-align: left;
			cursor: pointer;
		}

		.status {
			font-size: 11px;
			color: var(--muted);
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			padding-left: 1px;
		}

		.provider-select,
		.prompt-input {
			width: 100%;
			border: 1px solid var(--border);
			border-radius: 8px;
			background: var(--surface-strong);
			color: var(--text);
			padding: 5px 6px;
			font: inherit;
		}

		.provider-select {
			max-width: 146px;
		}

		.messages {
			overflow: auto;
			padding: 1px;
			display: grid;
			gap: 3px;
			align-content: start;
		}

		.message {
			border: 1px solid var(--border);
			border-radius: 8px;
			padding: 6px;
			white-space: pre-wrap;
			word-break: break-word;
			line-height: 1.4;
		}

		.message.user {
			background: rgba(215, 235, 250, 0.06);
		}

		.message.assistant {
			background: rgba(7, 28, 47, 0.38);
		}

		.meta {
			font-size: 10px;
			font-weight: 700;
			letter-spacing: 0.06em;
			text-transform: uppercase;
			color: var(--muted);
			margin-bottom: 4px;
		}

		.composer {
			display: grid;
			gap: 4px;
			padding: 3px 2px;
		}

		.prompt-input {
			min-height: 78px;
			resize: vertical;
		}

		.bottom {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 4px;
		}

		.mode-selector {
			display: flex;
			gap: 3px;
			flex-wrap: wrap;
		}

		.mode-button {
			padding: 4px 6px;
			border: 1px solid var(--border);
			border-radius: 8px;
			background: transparent;
			color: var(--muted);
			text-transform: capitalize;
			cursor: pointer;
		}

		.mode-button.active {
			background: var(--accent-soft);
			color: var(--accent);
			border-color: rgba(215, 235, 250, 0.2);
		}

		.send-button {
			padding: 4px 9px;
			border: 1px solid var(--border);
			border-radius: 8px;
			background: var(--surface-strong);
			color: var(--text);
			cursor: pointer;
		}

		.send-button.primary {
			background: rgba(215, 235, 250, 0.1);
		}
	</style>
</head>
<body>
	<div class="shell">
		<section class="topbar">
			<div id="statusText" class="status">OpenML Assistant</div>
			<select id="providerSelect" class="provider-select">${providerOptionsMarkup}</select>
			<div class="menu-wrap">
				<button id="menuButton" class="icon-button" type="button" aria-label="More actions">&#8942;</button>
				<div id="contextMenu" class="menu hidden">
					<button id="settingsButton" class="menu-item" type="button">Settings</button>
					<button id="copyButton" class="menu-item" type="button">Copy last</button>
					<button id="insertButton" class="menu-item" type="button">Insert last</button>
				</div>
			</div>
		</section>

		<section id="messages" class="messages"></section>

		<section class="composer">
			<textarea id="promptInput" class="prompt-input" placeholder="Ask, edit, plan or delegate your next task."></textarea>
			<div class="bottom">
				<div id="modeSelector" class="mode-selector">${modeButtonsMarkup}</div>
				<button id="sendButton" class="send-button primary" type="button">Send</button>
			</div>
		</section>
	</div>

	<script>
		const vscode = acquireVsCodeApi();
		const messages = document.getElementById('messages');
		const providerSelect = document.getElementById('providerSelect');
		const promptInput = document.getElementById('promptInput');
		const sendButton = document.getElementById('sendButton');
		const statusText = document.getElementById('statusText');
		const modeSelector = document.getElementById('modeSelector');
		const menuButton = document.getElementById('menuButton');
		const contextMenu = document.getElementById('contextMenu');
		const settingsButton = document.getElementById('settingsButton');
		const copyButton = document.getElementById('copyButton');
		const insertButton = document.getElementById('insertButton');

		function escapeHtml(value) {
			return value
				.replaceAll('&', '&amp;')
				.replaceAll('<', '&lt;')
				.replaceAll('>', '&gt;');
		}

		function closeMenu() {
			contextMenu.classList.add('hidden');
		}

		function renderMessages(items) {
			const visibleMessages = items.filter(message => message.role !== 'status');
			messages.innerHTML = visibleMessages.map(message => {
				const title = message.role === 'user' ? 'You' : 'Assistant';
				return '<article class="message ' + message.role + '">' +
					'<div class="meta">' + title + '</div>' +
					'<div>' + escapeHtml(message.content) + '</div>' +
					'</article>';
			}).join('');
			messages.scrollTop = messages.scrollHeight;
		}

		function setBusy(isBusy) {
			sendButton.disabled = isBusy;
			providerSelect.disabled = isBusy;
			promptInput.disabled = isBusy;
			statusText.textContent = isBusy ? 'Thinking...' : statusText.textContent;
		}

		function setMode(mode) {
			for (const button of modeSelector.querySelectorAll('.mode-button')) {
				button.classList.toggle('active', button.dataset.mode === mode);
			}
		}

		menuButton.addEventListener('click', event => {
			event.stopPropagation();
			contextMenu.classList.toggle('hidden');
		});

		document.addEventListener('click', closeMenu);
		contextMenu.addEventListener('click', event => event.stopPropagation());
		settingsButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'openSettings' });
		});
		copyButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'copyLastResponse' });
		});
		insertButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'insertLastResponse' });
		});

		sendButton.addEventListener('click', () => {
			const prompt = promptInput.value.trim();
			if (!prompt) {
				return;
			}
			vscode.postMessage({ type: 'submitPrompt', prompt });
			promptInput.value = '';
		});

		promptInput.addEventListener('keydown', event => {
			if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
				sendButton.click();
			}
		});

		providerSelect.addEventListener('change', () => {
			vscode.postMessage({ type: 'selectProvider', provider: providerSelect.value });
		});

		for (const button of modeSelector.querySelectorAll('.mode-button')) {
			button.addEventListener('click', () => {
				vscode.postMessage({ type: 'selectMode', mode: button.dataset.mode });
			});
		}

		window.addEventListener('message', event => {
			const message = event.data;
			switch (message.type) {
				case 'state':
					providerSelect.value = message.state.provider;
					statusText.textContent = message.state.providerLabel + ' â€¢ ' + message.state.modelLabel + (message.state.localFirst ? ' â€¢ local' : ' â€¢ remote');
					setMode(message.state.mode);
					renderMessages(message.state.messages);
					return;
				case 'busy':
					setBusy(message.busy);
					if (!message.busy) {
						statusText.textContent = 'Ready';
					}
					return;
				case 'copied':
					statusText.textContent = 'Last response copied';
					return;
				case 'error':
					statusText.textContent = 'Error: ' + message.message;
					return;
			}
		});

		vscode.postMessage({ type: 'ready' });
	</script>
</body>
</html>`;
	}
}
