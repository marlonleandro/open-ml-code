import * as vscode from 'vscode';
import {
	assistantModes,
	getActiveProvider,
	getCurrentModelLabel,
	getSystemPrompt,
	isLocalProvider,
	listAvailableModels,
	providerDisplayName,
	providerOptions,
	setActiveProvider,
	setModelForProvider,
	streamAssistantResponse,
	syncLocalModelSelection,
	type AssistantMode,
	type ProviderId
} from './providers';
import { applyEditProposal, extractEditProposal, previewEditProposal, showSuggestedTests, stripEditProposalBlock, type EditProposal } from './editing';
import { buildFixLoopPrompt, maxFixAttempts, runTestsCommand, tryHandleToolPrompt } from './tools';

type ChatRole = 'user' | 'assistant' | 'status';

type ChatMessage = {
	role: ChatRole;
	content: string;
};

type WebviewInboundMessage =
	| { type: 'ready' }
	| { type: 'submitPrompt'; prompt: string }
	| { type: 'selectProvider'; provider: ProviderId }
	| { type: 'selectModel'; model: string }
	| { type: 'selectMode'; mode: AssistantMode }
	| { type: 'openSettings' }
	| { type: 'manageApiKeys' }
	| { type: 'refreshModels' }
	| { type: 'previewEdits' }
	| { type: 'applyEdits' }
	| { type: 'showSuggestedTests' }
	| { type: 'copyLastResponse' }
	| { type: 'insertLastResponse' };

type WebviewOutboundMessage =
	| { type: 'state'; state: ChatState }
	| { type: 'busy'; busy: boolean }
	| { type: 'copied' }
	| { type: 'error'; message: string };

type ChatState = {
};

type FixLoopState = {
	command: string;
	attempt: number;
};

export class OpenMLAssistantViewProvider implements vscode.WebviewViewProvider, vscode.Disposable {
	static readonly viewId = 'openmlAssistant.chatView';

	private webviewView: vscode.WebviewView | undefined;
	private readonly disposables: vscode.Disposable[] = [];
	private readonly messages: ChatMessage[] = [
		{ role: 'status', content: 'Local-first ready. Use Ollama or LM Studio as your primary workflow.' }
	];
	private readonly modelsByProvider = new Map<ProviderId, string[]>();
	private readonly extensionUri: vscode.Uri;
	private lastAssistantResponse = '';
	private lastEditProposal: EditProposal | undefined;
	private activeFixLoop: FixLoopState | undefined;
	private isBusy = false;
	private mode: AssistantMode = 'agent';
	private pendingPrompt: string | undefined;
	private pendingMode: AssistantMode | undefined;

	constructor(extensionUri: vscode.Uri) {
		this.extensionUri = extensionUri;
	}

	async resolveWebviewView(webviewView: vscode.WebviewView): Promise<void> {
		this.webviewView = webviewView;
		const markdownItUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, '..', '..', 'node_modules', 'markdown-it', 'dist', 'markdown-it.min.js'));
		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [
				this.extensionUri,
				vscode.Uri.joinPath(this.extensionUri, '..', '..', 'node_modules', 'markdown-it', 'dist')
			]
		};
		webviewView.webview.html = this.getHtml(markdownItUri);

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
		await this.syncState(true);
	}

	dispose(): void {
		while (this.disposables.length) {
			this.disposables.pop()?.dispose();
		}
	}

	private async onMessage(message: WebviewInboundMessage): Promise<void> {
		switch (message.type) {
			case 'ready':
				await this.syncState(true);
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
				await this.syncState(true);
				return;
			case 'selectModel':
				await setModelForProvider(getActiveProvider(), message.model);
				await this.syncState();
				return;
			case 'selectMode':
				this.mode = message.mode;
				await this.syncState();
				return;
			case 'openSettings':
				await vscode.commands.executeCommand('openmlAssistant.openSettings');
				return;
			case 'manageApiKeys':
				await vscode.commands.executeCommand('openmlAssistant.manageApiKeys');
				await this.syncState();
				return;
			case 'refreshModels':
				await this.syncState(true);
				return;
			case 'previewEdits':
				await this.previewEdits();
				return;
			case 'applyEdits':
				await this.applyEdits();
				return;
			case 'showSuggestedTests':
				await this.showTests();
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

		let requestPrompt = trimmedPrompt;
		let requestMode = this.mode;

		const toolResult = await tryHandleToolPrompt(trimmedPrompt);
		if (toolResult) {
			this.lastEditProposal = undefined;
			this.messages.push({ role: 'assistant', content: `## ${toolResult.title}\n\n${toolResult.content}` });
			this.lastAssistantResponse = toolResult.content;
			await this.syncState();
			if (!toolResult.followUpPrompt) {
				return;
			}

			requestPrompt = toolResult.followUpPrompt;
			requestMode = toolResult.preferredMode ?? 'edit';
			if (toolResult.fixLoopCommand) {
				this.activeFixLoop = { command: toolResult.fixLoopCommand, attempt: toolResult.fixLoopAttempt ?? 1 };
			}
		} else {
			this.messages.push({ role: 'user', content: trimmedPrompt });
			if (!trimmedPrompt.startsWith('/fix')) {
				this.activeFixLoop = undefined;
			}
		}
		const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
		this.messages.push(assistantMessage);
		this.lastEditProposal = undefined;
		this.isBusy = true;
		await this.syncState();
		this.postMessage({ type: 'busy', busy: true });

		const editor = vscode.window.activeTextEditor;

		try {
			await streamAssistantResponse({
				prompt: requestPrompt,
				workspaceName: vscode.workspace.name ?? 'workspace',
				activeFileName: editor?.document.fileName,
				selectedText: editor?.document.getText(editor.selection).trim() || undefined,
				systemPrompt: getSystemPrompt(),
				mode: requestMode
			}, {
				onDelta: chunk => {
					assistantMessage.content += chunk;
					this.lastAssistantResponse = assistantMessage.content.trim();
					void this.syncState();
				}
			});

			const editProposal = extractEditProposal(assistantMessage.content);
			if (editProposal) {
				this.lastEditProposal = editProposal;
				assistantMessage.content = stripEditProposalBlock(assistantMessage.content);
			} else if (this.mode === 'edit') {
				assistantMessage.content = `${assistantMessage.content.trim()}\n\n> OpenML Assistant could not extract an editable proposal from this response. Ask the model to return the result as an \`openml-edit\` proposal with full file contents.`.trim();
			}

			this.lastAssistantResponse = assistantMessage.content.trim();
			if (!this.lastAssistantResponse) {
				assistantMessage.content = editProposal?.summary || 'The provider completed without returning visible content.';
				this.lastAssistantResponse = assistantMessage.content;
			}
		} catch (error) {
			const text = error instanceof Error ? error.message : String(error);
			assistantMessage.content = `Error: ${text}`;
			this.lastEditProposal = undefined;
			this.postMessage({ type: 'error', message: text });
		} finally {
			this.isBusy = false;
			await this.syncState();
			this.postMessage({ type: 'busy', busy: false });
		}
	}

	private async continueFixLoop(): Promise<void> {
		if (!this.activeFixLoop) {
			return;
		}

		const current = this.activeFixLoop;
		const testResult = await runTestsCommand(current.command, false);
		this.messages.push({
			role: 'assistant',
			content: `## Fix Verification

${testResult.summary}

### Diagnostics

${testResult.diagnostics}`
		});
		this.lastAssistantResponse = testResult.summary;
		await this.syncState();

		if (testResult.success) {
			this.activeFixLoop = undefined;
			void vscode.window.showInformationMessage('OpenML Assistant fix loop completed successfully.');
			return;
		}

		if (current.attempt >= maxFixAttempts) {
			this.activeFixLoop = undefined;
			this.messages.push({ role: 'assistant', content: `Reached the fix loop limit (${maxFixAttempts} attempts). Review the latest failures before trying again.` });
			await this.syncState();
			return;
		}

		this.activeFixLoop = { command: current.command, attempt: current.attempt + 1 };
		this.mode = 'edit';
		await this.handlePrompt(buildFixLoopPrompt(testResult, current.attempt + 1));
	}
	private async previewEdits(): Promise<void> {
		try {
			if (!this.lastEditProposal) {
				throw new Error('The last assistant response does not include an edit proposal.');
			}
			await previewEditProposal(this.lastEditProposal);
		} catch (error) {
			const text = error instanceof Error ? error.message : String(error);
			this.postMessage({ type: 'error', message: text });
		}
	}

	private async applyEdits(): Promise<void> {
		try {
			if (!this.lastEditProposal) {
				throw new Error('The last assistant response does not include an edit proposal.');
			}
			await applyEditProposal(this.lastEditProposal);
			await this.continueFixLoop();
		} catch (error) {
			const text = error instanceof Error ? error.message : String(error);
			this.postMessage({ type: 'error', message: text });
		}
	}

	private async showTests(): Promise<void> {
		try {
			if (!this.lastEditProposal) {
				throw new Error('The last assistant response does not include suggested tests.');
			}
			await showSuggestedTests(this.lastEditProposal);
		} catch (error) {
			const text = error instanceof Error ? error.message : String(error);
			this.postMessage({ type: 'error', message: text });
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

	private async ensureModels(provider: ProviderId, refresh = false): Promise<string[]> {
		if (refresh || !this.modelsByProvider.has(provider)) {
			const models = isLocalProvider(provider)
				? await syncLocalModelSelection(provider)
				: await listAvailableModels(provider);
			this.modelsByProvider.set(provider, models);
		}

		return this.modelsByProvider.get(provider) ?? [];
	}

	private async syncState(refreshModels = false): Promise<void> {
		const provider = getActiveProvider();
		const models = await this.ensureModels(provider, refreshModels);
		this.postMessage({
			type: 'state',
			state: {
				provider,
				providerLabel: providerDisplayName(provider),
				modelLabel: getCurrentModelLabel(provider) || 'Not configured',
				models,
				localFirst: isLocalProvider(provider),
				mode: this.mode,
				hasEditProposal: !!this.lastEditProposal?.files.length,
				suggestedTestsCount: this.lastEditProposal?.tests.length ?? 0,
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

	private getHtml(markdownItUri: vscode.Uri): string {
		const providerOptionsMarkup = providerOptions.map(provider => `<option value="${provider}">${providerDisplayName(provider)}</option>`).join('');
		const modeButtonsMarkup = assistantModes.map(mode => `<button type="button" class="mode-button" data-mode="${mode}">${mode}</button>`).join('');

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
			--code-bg: rgba(3, 16, 28, 0.72);
		}

		* { box-sizing: border-box; }
		html, body { margin: 0; height: 100%; }
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
			padding: 4px 0;
		}

		.topbar, .messages, .composer {
			border: 1px solid var(--border);
			border-radius: 8px;
			background: var(--surface);
		}

		.topbar {
			display: grid;
			grid-template-columns: minmax(0, 1fr) auto auto auto;
			gap: 4px;
			align-items: center;
			padding: 2px;
		}

		.menu-wrap { position: relative; }
		.icon-button, .mode-button, .send-button, .menu-item { font: inherit; }

		.icon-button {
			width: 26px;
			height: 26px;
			border-radius: 8px;
			border: 1px solid transparent;
			background: transparent;
			color: var(--muted);
			cursor: pointer;
			display: inline-flex;
			align-items: center;
			justify-content: center;
		}

		.icon-button:hover, .mode-button:hover, .send-button:hover, .menu-item:hover {
			background: var(--accent-soft);
			color: var(--text);
		}

		.menu {
			position: absolute;
			top: 30px;
			right: 0;
			min-width: 170px;
			border: 1px solid var(--border);
			border-radius: 8px;
			background: rgba(7, 28, 47, 0.98);
			padding: 4px;
			display: grid;
			gap: 2px;
			z-index: 20;
			box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
		}

		.menu.hidden { display: none; }

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

		.provider-select, .model-select, .prompt-input {
			width: 100%;
			border: 1px solid var(--border);
			border-radius: 8px;
			background: var(--surface-strong);
			color: var(--text);
			padding: 5px 6px;
			font: inherit;
		}

		.provider-select { max-width: 120px; }
		.model-select { max-width: 150px; }

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
			padding: 6px 8px;
			word-break: break-word;
			line-height: 1.5;
		}

		.message.user {
			background: rgba(215, 235, 250, 0.06);
			white-space: pre-wrap;
		}

		.message.assistant { background: rgba(7, 28, 47, 0.38); }

		.meta {
			font-size: 10px;
			font-weight: 700;
			letter-spacing: 0.06em;
			text-transform: uppercase;
			color: var(--muted);
			margin-bottom: 6px;
		}

		.rendered > *:first-child { margin-top: 0; }
		.rendered > *:last-child { margin-bottom: 0; }
		.rendered p, .rendered ul, .rendered ol, .rendered table, .rendered pre, .rendered blockquote { margin: 0 0 10px; }
		.rendered h1, .rendered h2, .rendered h3, .rendered h4 { margin: 14px 0 8px; line-height: 1.3; }
		.rendered h1 { font-size: 1.2rem; }
		.rendered h2 { font-size: 1.08rem; }
		.rendered h3 { font-size: 1rem; }
		.rendered strong { font-weight: 700; }
		.rendered em { font-style: italic; }
		.rendered code {
			font-family: var(--vscode-editor-font-family, Consolas, monospace);
			background: rgba(215, 235, 250, 0.08);
			padding: 1px 5px;
			border-radius: 6px;
		}
		.rendered pre {
			background: var(--code-bg);
			border: 1px solid var(--border);
			border-radius: 8px;
			overflow: auto;
			padding: 0;
		}
		.rendered pre code {
			display: block;
			background: transparent;
			padding: 12px;
			border-radius: 0;
			white-space: pre;
		}
		.rendered blockquote {
			margin-left: 0;
			padding-left: 10px;
			border-left: 3px solid rgba(215, 235, 250, 0.18);
			color: var(--muted);
		}
		.rendered table {
			width: 100%;
			border-collapse: collapse;
			font-size: 0.94rem;
		}
		.rendered th, .rendered td {
			border: 1px solid var(--border);
			padding: 6px 8px;
			text-align: left;
			vertical-align: top;
		}
		.rendered th { background: rgba(215, 235, 250, 0.06); }
		.rendered a { color: var(--accent); text-decoration: none; }
		.rendered a:hover { text-decoration: underline; }

		.composer {
			display: grid;
			gap: 4px;
			padding: 3px 2px;
		}

		.prompt-input {
			min-height: 86px;
			resize: none;
		}

		.hint {
			font-size: 10px;
			color: var(--muted);
			padding: 0 2px;
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
			width: 30px;
			height: 30px;
			padding: 0;
			border: 1px solid var(--border);
			border-radius: 999px;
			background: rgba(215, 235, 250, 0.1);
			color: var(--text);
			cursor: pointer;
			display: inline-flex;
			align-items: center;
			justify-content: center;
		}

		.send-icon {
			width: 14px;
			height: 14px;
		}
	</style>
</head>
<body>
	<div class="shell">
		<section class="topbar">
			<div id="statusText" class="status">OpenML Assistant</div>
			<select id="providerSelect" class="provider-select">${providerOptionsMarkup}</select>
			<select id="modelSelect" class="model-select"></select>
			<div class="menu-wrap">
				<button id="menuButton" class="icon-button" type="button" aria-label="More actions">&#8942;</button>
				<div id="contextMenu" class="menu hidden">
					<button id="previewEditsButton" class="menu-item" type="button">Preview Edits</button>
					<button id="applyEditsButton" class="menu-item" type="button">Apply Edits</button>
					<button id="testsButton" class="menu-item" type="button">Suggested Tests</button>
					<button id="keysButton" class="menu-item" type="button">Manage API Keys</button>
					<button id="refreshModelsButton" class="menu-item" type="button">Refresh Models</button>
					<button id="settingsButton" class="menu-item" type="button">Settings</button>
					<button id="copyButton" class="menu-item" type="button">Copy Last</button>
					<button id="insertButton" class="menu-item" type="button">Insert Last</button>
				</div>
			</div>
		</section>

		<section id="messages" class="messages"></section>

		<section class="composer">
			<textarea id="promptInput" class="prompt-input" placeholder="Ask, edit, plan, delegate, or use /read, /search, /diff, /errors, /test, /run, /fix."></textarea>
			<div id="hintText" class="hint">Tools: /read path, /search pattern, /diff [path], /errors, /test [command], /run command, /fix [test command]</div>
			<div class="bottom">
				<div id="modeSelector" class="mode-selector">${modeButtonsMarkup}</div>
				<button id="sendButton" class="send-button" type="button" aria-label="Send">
					<svg class="send-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
						<path d="M3 20L21 12L3 4V10L15 12L3 14V20Z" fill="currentColor"/>
					</svg>
				</button>
			</div>
		</section>
	</div>

	<script src="${markdownItUri}"></script>
	<script>
		const vscode = acquireVsCodeApi();
		const md = window.markdownit({ html: false, linkify: true, breaks: true });
		const messages = document.getElementById('messages');
		const providerSelect = document.getElementById('providerSelect');
		const modelSelect = document.getElementById('modelSelect');
		const promptInput = document.getElementById('promptInput');
		const sendButton = document.getElementById('sendButton');
		const statusText = document.getElementById('statusText');
		const hintText = document.getElementById('hintText');
		const modeSelector = document.getElementById('modeSelector');
		const menuButton = document.getElementById('menuButton');
		const contextMenu = document.getElementById('contextMenu');
		const previewEditsButton = document.getElementById('previewEditsButton');
		const applyEditsButton = document.getElementById('applyEditsButton');
		const testsButton = document.getElementById('testsButton');
		const settingsButton = document.getElementById('settingsButton');
		const keysButton = document.getElementById('keysButton');
		const refreshModelsButton = document.getElementById('refreshModelsButton');
		const copyButton = document.getElementById('copyButton');
		const insertButton = document.getElementById('insertButton');

		function escapeHtml(value) {
			return value
				.replaceAll('&', '&amp;')
				.replaceAll('<', '&lt;')
				.replaceAll('>', '&gt;')
				.replaceAll('"', '&quot;');
		}

		function closeMenu() {
			contextMenu.classList.add('hidden');
		}

		function renderMarkdown(value) {
			return md.render(value || '');
		}

		function renderMessages(items) {
			const visibleMessages = items.filter(message => message.role !== 'status');
			messages.innerHTML = visibleMessages.map(message => {
				const title = message.role === 'user' ? 'You' : 'Assistant';
				const body = message.role === 'user'
					? '<div>' + escapeHtml(message.content) + '</div>'
					: '<div class="rendered">' + renderMarkdown(message.content) + '</div>';
				return '<article class="message ' + message.role + '">' +
					'<div class="meta">' + title + '</div>' +
					body +
					'</article>';
			}).join('');
			messages.scrollTop = messages.scrollHeight;
		}

		function renderModels(models, selectedModel) {
			const options = models.length ? models : [selectedModel || 'Not configured'];
			modelSelect.innerHTML = options.map(model => '<option value="' + escapeHtml(model) + '">' + escapeHtml(model) + '</option>').join('');
			modelSelect.value = selectedModel || options[0] || '';
		}

		function setBusy(isBusy) {
			sendButton.disabled = isBusy;
			providerSelect.disabled = isBusy;
			modelSelect.disabled = isBusy;
			promptInput.disabled = isBusy;
			statusText.textContent = isBusy ? 'Thinking...' : statusText.textContent;
		}

		function setMode(mode) {
			for (const button of modeSelector.querySelectorAll('.mode-button')) {
				button.classList.toggle('active', button.dataset.mode === mode);
			}
		}

		function submitPrompt() {
			const prompt = promptInput.value.trim();
			if (!prompt) {
				return;
			}
			vscode.postMessage({ type: 'submitPrompt', prompt });
			promptInput.value = '';
		}

		menuButton.addEventListener('click', event => {
			event.stopPropagation();
			contextMenu.classList.toggle('hidden');
		});

		document.addEventListener('click', closeMenu);
		contextMenu.addEventListener('click', event => event.stopPropagation());
		previewEditsButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'previewEdits' });
		});
		applyEditsButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'applyEdits' });
		});
		testsButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'showSuggestedTests' });
		});
		settingsButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'openSettings' });
		});
		keysButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'manageApiKeys' });
		});
		refreshModelsButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'refreshModels' });
		});
		copyButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'copyLastResponse' });
		});
		insertButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'insertLastResponse' });
		});

		sendButton.addEventListener('click', submitPrompt);

		promptInput.addEventListener('keydown', event => {
			if (event.key === 'Enter' && !event.shiftKey) {
				event.preventDefault();
				submitPrompt();
			}
		});

		providerSelect.addEventListener('change', () => {
			vscode.postMessage({ type: 'selectProvider', provider: providerSelect.value });
		});

		modelSelect.addEventListener('change', () => {
			vscode.postMessage({ type: 'selectModel', model: modelSelect.value });
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
					renderModels(message.state.models, message.state.modelLabel);
					statusText.textContent = message.state.providerLabel + ' | ' + message.state.modelLabel + (message.state.localFirst ? ' | local' : ' | remote');
					hintText.textContent = message.state.hasEditProposal
						? 'Edit proposal ready. Use Preview Edits, Apply Edits, or Suggested Tests from the menu.'
						: 'Tools: /read path, /search pattern, /diff [path], /errors, /test [command], /run command, /fix [test command]';
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










