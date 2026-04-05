import * as vscode from 'vscode';
import * as path from 'path';
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
	cancelActiveProviderRequest,
	isAbortError,
	isTimeoutError,
	type AssistantMode,
	type ProviderId,
	type PromptAttachment,
	type AttachmentKind
} from './providers';
import { getKnownMcpServerCount } from './mcp';
import { applyEditProposal, buildUserFacingEditSummary, clearEditPreviewArtifacts, extractEditProposal, looksLikePartialEditProposal, previewEditProposal, showSuggestedTests, stripEditProposalBlock, type EditProposal } from './editing';
import { buildFixLoopPrompt, maxFixAttempts, runTestsCommand, tryHandleToolPrompt } from './tools';
import { clearProjectChatHistory, loadProjectChatHistory, saveProjectChatHistory, updatePlanningFile, writeActivityLog, type PersistedChatMessage } from './projectState';

type ChatRole = 'user' | 'assistant' | 'status';

type ChatMessage = {
	role: ChatRole;
	content: string;
};

type PendingAttachment = PromptAttachment & {
	id: string;
};

type AttachmentSummary = {
	id: string;
	name: string;
	kind: AttachmentKind;
};

type WebviewInboundMessage =
	| { type: 'ready' }
	| { type: 'submitPrompt'; prompt: string }
	| { type: 'pickAttachments' }
	| { type: 'removeAttachment'; id: string }
	| { type: 'selectProvider'; provider: ProviderId }
	| { type: 'selectModel'; model: string }
	| { type: 'selectMode'; mode: AssistantMode }
	| { type: 'openSettings' }
	| { type: 'manageApiKeys' }
	| { type: 'manageMcpServers' }
	| { type: 'addMcpServer' }
	| { type: 'browseMcpServers' }
	| { type: 'showInstalledMcpServers' }
	| { type: 'showRuntimeMcpServers' }
	| { type: 'browseMcpResources' }
	| { type: 'openMcpConfiguration' }
	| { type: 'openWorkspaceMcpConfiguration' }
	| { type: 'initializeWorkspaceMcpConfiguration' }
	| { type: 'startMcpGateway' }
	| { type: 'showMcpGateway' }
	| { type: 'stopMcpGateway' }
	| { type: 'refreshModels' }
	| { type: 'previewEdits' }
	| { type: 'applyEdits' }
	| { type: 'discardEdits' }
	| { type: 'showSuggestedTests' }
	| { type: 'copyLastResponse' }
	| { type: 'insertLastResponse' }
	| { type: 'clearHistory' }
	| { type: 'rerunLastPrompt' }
	| { type: 'cancelRequest' };

type WebviewOutboundMessage =
	| { type: 'state'; state: ChatState }
	| { type: 'busy'; busy: boolean }
	| { type: 'copied' }
	| { type: 'error'; message: string };

type ChatState = {
	provider: ProviderId;
	providerLabel: string;
	modelLabel: string;
	models: string[];
	localFirst: boolean;
	mcpServerCount: number;
	mode: AssistantMode;
	hasEditProposal: boolean;
	showAgentApplyPrompt: boolean;
	suggestedTestsCount: number;
	attachments: AttachmentSummary[];
	messages: ChatMessage[];
};

type FixLoopState = {
	command: string;
	attempt: number;
};

function createWebviewNonce(): string {
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let nonce = '';
	for (let index = 0; index < 32; index += 1) {
		nonce += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
	}
	return nonce;
}

function createAttachmentId(): string {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function inferAttachmentKind(fileName: string): AttachmentKind | undefined {
	const ext = path.extname(fileName).toLowerCase();
	if (['.png', '.jpg', '.jpeg', '.gif', '.bmp'].includes(ext)) {
		return 'image';
	}
	if (ext === '.pdf') {
		return 'pdf';
	}
	return undefined;
}

function inferMimeType(fileName: string, kind: AttachmentKind): string {
	const ext = path.extname(fileName).toLowerCase();
	if (kind === 'pdf') {
		return 'application/pdf';
	}
	if (kind === 'image') {
		switch (ext) {
			case '.png': return 'image/png';
			case '.jpg':
			case '.jpeg': return 'image/jpeg';
			case '.gif': return 'image/gif';
			case '.bmp': return 'image/bmp';
			default: return 'image/png';
		}
	}

	return 'application/octet-stream';
}

export class OpenMLAssistantViewProvider implements vscode.WebviewViewProvider, vscode.Disposable {
	static readonly viewId = 'openmlAssistant.chatView';

	private webviewView: vscode.WebviewView | undefined;
	private readonly disposables: vscode.Disposable[] = [];
	private messages: ChatMessage[] = [
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
	private historyLoaded = false;
	private historySummary = '';
	private lastUserPrompt = '';
	private attachments: PendingAttachment[] = [];

	constructor(extensionUri: vscode.Uri) {
		this.extensionUri = extensionUri;
	}

	async resolveWebviewView(webviewView: vscode.WebviewView): Promise<void> {
		this.webviewView = webviewView;
		const highlightCssUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, '..', 'markdown-language-features', 'media', 'highlight.css'));
		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [
				this.extensionUri,
				vscode.Uri.joinPath(this.extensionUri, '..', '..', 'node_modules', 'markdown-it', 'dist'),
				vscode.Uri.joinPath(this.extensionUri, '..', 'markdown-language-features', 'node_modules', 'highlight.js'),
				vscode.Uri.joinPath(this.extensionUri, '..', 'markdown-language-features', 'media')
			]
		};
		webviewView.webview.html = this.getHtml(webviewView.webview, highlightCssUri);

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
		await this.ensureProjectHistoryLoaded();
		await this.syncState(true);
	}

	dispose(): void {
		while (this.disposables.length) {
			this.disposables.pop()?.dispose();
		}
	}

	private async ensureProjectHistoryLoaded(): Promise<void> {
		if (this.historyLoaded) {
			return;
		}

		const history = await loadProjectChatHistory();
		this.historySummary = history.summary;
		const restoredMessages = history.messages.map<ChatMessage>(message => ({
			role: message.role,
			content: message.content
		}));
		this.messages = [
			{ role: 'status', content: 'Local-first ready. Use Ollama or LM Studio as your primary workflow.' },
			...restoredMessages
		];
		this.historyLoaded = true;
	}

	private async pickAttachments(): Promise<void> {
		const picks = await vscode.window.showOpenDialog({
			canSelectMany: true,
			openLabel: 'Attach Files',
			filters: {
				'Supported files': ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'pdf']
			}
		});

		if (!picks?.length) {
			return;
		}

		for (const fileUri of picks) {
			const kind = inferAttachmentKind(fileUri.fsPath);
			if (!kind) {
				void vscode.window.showWarningMessage(`OpenML Assistant skipped ${path.basename(fileUri.fsPath)} because its file type is not supported.`);
				continue;
			}

			const bytes = await vscode.workspace.fs.readFile(fileUri);
			const name = path.basename(fileUri.fsPath);
			const attachment: PendingAttachment = {
				id: createAttachmentId(),
				name,
				kind,
				mimeType: inferMimeType(name, kind),
				byteSize: bytes.byteLength,
				base64Data: Buffer.from(bytes).toString('base64')
			};

			this.attachments = [
				...this.attachments.filter(existing => existing.name !== attachment.name),
				attachment
			];
		}

		await this.syncState();
	}

	private async removeAttachment(id: string): Promise<void> {
		this.attachments = this.attachments.filter(attachment => attachment.id !== id);
		await this.syncState();
	}

	private toPersistedMessages(): PersistedChatMessage[] {
		return this.messages
			.filter((message): message is ChatMessage & { role: 'user' | 'assistant' } => message.role === 'user' || message.role === 'assistant')
			.map(message => ({
				role: message.role,
				content: message.content,
				createdAt: new Date().toISOString()
			}));
	}

	private async persistProjectHistory(): Promise<void> {
		const persisted = await saveProjectChatHistory(this.toPersistedMessages(), this.historySummary);
		this.historySummary = persisted.summary;
		this.messages = [
			this.messages[0] ?? { role: 'status', content: 'Local-first ready. Use Ollama or LM Studio as your primary workflow.' },
			...persisted.messages.map<ChatMessage>(message => ({ role: message.role, content: message.content }))
		];
	}

	private async writeProjectArtifacts(prompt: string, output: string, mode: AssistantMode, kind: 'conversation' | 'execution'): Promise<void> {
		if (mode === 'agent' || mode === 'plan') {
			await updatePlanningFile(prompt, output, this.historySummary);
		}

		const hasImplementationProgress = kind === 'execution' || !!this.lastEditProposal?.files.length;
		if (!hasImplementationProgress) {
			return;
		}

		const label = kind === 'execution' ? 'execution' : mode;
		await writeActivityLog(label, prompt, output);
	}

	private promptImpliesImplementation(prompt: string): boolean {
		const normalized = prompt.toLowerCase();
		return [
			'crear',
			'crea',
			'generar',
			'genera',
			'implementar',
			'implementa',
			'construir',
			'construye',
			'refactor',
			'refactoriza',
			'optimiza',
			'optimiz',
			'configura',
			'configurar',
			'add ',
			'create ',
			'generate ',
			'implement ',
			'build ',
			'refactor ',
			'optimize ',
			'modifica',
			'modificar',
			'edita',
			'editar',
			'archivo',
			'componente',
			'feature',
			'proyecto',
			'estructura'
		].some(keyword => normalized.includes(keyword));
	}

	private isShortAffirmation(prompt: string): boolean {
		const normalized = prompt.toLowerCase().trim().replace(/[.!?]+$/g, '');
		return ['si', 's?', 'dale', 'procede', 'hazlo', 'continua', 'contin?a', 'ok', 'okay', 'de acuerdo', 'adelante'].includes(normalized);
	}

	private shouldContinuePreviousImplementation(): boolean {
		const previous = this.lastAssistantResponse.toLowerCase();
		return [
			'deseas que proceda',
			'prefieres',
			'proceed',
			'next steps',
			'pr?ximos pasos sugeridos',
			'proceed with',
			'?deseas',
			'deseas que continuemos'
		].some(marker => previous.includes(marker));
	}

	private buildContinuationPrompt(userReply: string): string {
		return [
			'Proceed with the implementation described in the previous assistant response.',
			'Create or modify the necessary workspace files now.',
			'Return the result as an openml-edit proposal with full file contents for every file to create or update.',
			'Include suggested tests.',
			`User confirmation: ${userReply}`
		].join(' ');
	}

	private buildChunkedRetryPrompt(originalPrompt: string): string {
		return [
			originalPrompt,
			'',
			'Retry this task because the previous editable proposal was truncated.',
			'Return only the first batch of the most essential files needed for a minimal functional scaffold.',
			'Limit the result to a maximum of 6 files.',
			'Prioritize package.json, config files, entry points, and the smallest set of feature files required to run.',
			'Do not include optional improvements, long explanations, roadmap notes, or setup sections.',
			'Return a complete openml-edit proposal with valid full file contents and suggested tests.'
		].join('\n');
	}

	private buildAttachmentEditRetryPrompt(originalPrompt: string): string {
		return [
			originalPrompt,
			'',
			'Retry this task using the attached files as the source of truth.',
			'The previous response did not include a valid openml-edit proposal.',
			'You must produce the implementation requested by the user, not only describe the attached files.',
			'Return Markdown plus a final ```openml-edit code block with strict JSON.',
			'The JSON must include full file contents for every file to create or update.',
			'Do not omit the openml-edit block.'
		].join('\n');
	}

	private async onMessage(message: WebviewInboundMessage): Promise<void> {
		switch (message.type) {
			case 'ready':
				await this.ensureProjectHistoryLoaded();
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
			case 'pickAttachments':
				await this.pickAttachments();
				return;
			case 'removeAttachment':
				await this.removeAttachment(message.id);
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
			case 'manageMcpServers':
				await vscode.commands.executeCommand('openmlAssistant.manageMcpServers');
				return;
			case 'addMcpServer':
				await vscode.commands.executeCommand('openmlAssistant.addMcpServer');
				return;
			case 'browseMcpServers':
				await vscode.commands.executeCommand('openmlAssistant.browseMcpServers');
				return;
			case 'showInstalledMcpServers':
				await vscode.commands.executeCommand('openmlAssistant.showInstalledMcpServers');
				return;
			case 'showRuntimeMcpServers':
				await vscode.commands.executeCommand('openmlAssistant.showRuntimeMcpServers');
				return;
			case 'browseMcpResources':
				await vscode.commands.executeCommand('openmlAssistant.browseMcpResources');
				return;
			case 'openMcpConfiguration':
				await vscode.commands.executeCommand('openmlAssistant.openMcpConfiguration');
				return;
			case 'openWorkspaceMcpConfiguration':
				await vscode.commands.executeCommand('openmlAssistant.openWorkspaceMcpConfiguration');
				return;
			case 'initializeWorkspaceMcpConfiguration':
				await vscode.commands.executeCommand('openmlAssistant.initializeWorkspaceMcpConfiguration');
				return;
			case 'startMcpGateway':
				await vscode.commands.executeCommand('openmlAssistant.startMcpGateway');
				return;
			case 'showMcpGateway':
				await vscode.commands.executeCommand('openmlAssistant.showMcpGateway');
				return;
			case 'stopMcpGateway':
				await vscode.commands.executeCommand('openmlAssistant.stopMcpGateway');
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
			case 'discardEdits':
				await this.discardEdits();
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
			case 'clearHistory':
				await this.clearHistory();
				return;
			case 'rerunLastPrompt':
				if (this.lastUserPrompt) {
					await this.handlePrompt(this.lastUserPrompt);
				}
				return;
			case 'cancelRequest':
				cancelActiveProviderRequest();
				return;
		}
	}

	private async handlePrompt(prompt: string): Promise<void> {
		await this.ensureProjectHistoryLoaded();
		const trimmedPrompt = prompt.trim();
		if (!trimmedPrompt || this.isBusy) {
			return;
		}

		this.lastUserPrompt = trimmedPrompt;

		let requestPrompt = trimmedPrompt;
		let requestMode = this.mode;
		let interactionKind: 'conversation' | 'execution' = 'conversation';
		const currentAttachments = [...this.attachments];

		if (this.mode === 'agent' && this.isShortAffirmation(trimmedPrompt) && this.shouldContinuePreviousImplementation()) {
			requestPrompt = this.buildContinuationPrompt(trimmedPrompt);
			requestMode = 'edit';
		} else if (this.mode === 'agent' && this.promptImpliesImplementation(trimmedPrompt)) {
			requestMode = 'edit';
		}

		const toolResult = await tryHandleToolPrompt(trimmedPrompt);
		if (toolResult) {
			this.lastEditProposal = undefined;
			this.messages.push({ role: 'assistant', content: `## ${toolResult.title}\n\n${toolResult.content}` });
			this.lastAssistantResponse = toolResult.content;
			await this.persistProjectHistory();
			await this.syncState();
			await this.writeProjectArtifacts(trimmedPrompt, toolResult.content, this.mode, 'execution');
			if (!toolResult.followUpPrompt) {
				return;
			}

			requestPrompt = toolResult.followUpPrompt;
			requestMode = toolResult.preferredMode ?? 'edit';
			interactionKind = 'execution';
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

		const runAssistantRequest = async (promptText: string, modeText: AssistantMode): Promise<string> => {
			assistantMessage.content = '';
			await streamAssistantResponse({
				prompt: promptText,
				workspaceName: vscode.workspace.name ?? 'workspace',
				activeFileName: editor?.document.fileName,
				selectedText: editor?.document.getText(editor.selection).trim() || undefined,
				systemPrompt: getSystemPrompt(),
				mode: modeText,
				attachments: currentAttachments
			}, {
				onDelta: chunk => {
					assistantMessage.content += chunk;
					this.lastAssistantResponse = assistantMessage.content.trim();
					void this.syncState();
				}
			});
			return assistantMessage.content;
		};

		try {
			let rawResponse = await runAssistantRequest(requestPrompt, requestMode);
			let editProposal = extractEditProposal(rawResponse);
			let truncatedProposal = !editProposal && requestMode === 'edit' && looksLikePartialEditProposal(rawResponse);

			if (!editProposal && truncatedProposal) {
				assistantMessage.content = 'The model response was truncated. Retrying automatically with a smaller batch...';
				this.lastAssistantResponse = assistantMessage.content;
				await this.syncState();
				rawResponse = await runAssistantRequest(this.buildChunkedRetryPrompt(trimmedPrompt), 'edit');
				editProposal = extractEditProposal(rawResponse);
				truncatedProposal = !editProposal && looksLikePartialEditProposal(rawResponse);
			}

			if (!editProposal && requestMode === 'edit' && currentAttachments.length && !truncatedProposal) {
				const visibleResponse = stripEditProposalBlock(rawResponse).trim();
				if (visibleResponse) {
					assistantMessage.content = 'The model analyzed the attached files but did not return an editable proposal. Retrying automatically with stricter instructions...';
					this.lastAssistantResponse = assistantMessage.content;
					await this.syncState();
					rawResponse = await runAssistantRequest(this.buildAttachmentEditRetryPrompt(trimmedPrompt), 'edit');
					editProposal = extractEditProposal(rawResponse);
					truncatedProposal = !editProposal && looksLikePartialEditProposal(rawResponse);
				}
			}

			const visibleResponse = stripEditProposalBlock(rawResponse).trim();

			if (editProposal) {
				this.lastEditProposal = editProposal;
				assistantMessage.content = [
					visibleResponse,
					buildUserFacingEditSummary(editProposal)
				].filter(Boolean).join('\n\n');
			} else if (requestMode === 'edit') {
				if (currentAttachments.length && visibleResponse) {
					assistantMessage.content = visibleResponse;
				} else {
					assistantMessage.content = truncatedProposal
						? 'The work could not be completed because the full response was not received from the model provider. The editable proposal was truncated before the JSON finished, even after retrying with a smaller batch. Increase the provider output limit or split the request into smaller steps.'
						: (visibleResponse + '\n\n> OpenML Assistant could not extract an editable proposal from this response. Ask the model to return the result as an `openml-edit` proposal with full file contents.').trim();
				}
			} else {
				assistantMessage.content = visibleResponse;
			}

			this.lastAssistantResponse = assistantMessage.content.trim();
			if (!this.lastAssistantResponse) {
				assistantMessage.content = editProposal?.summary || 'The provider completed without returning visible content.';
				this.lastAssistantResponse = assistantMessage.content;
			}

			await this.persistProjectHistory();
			await this.writeProjectArtifacts(trimmedPrompt, assistantMessage.content, requestMode, interactionKind);
			this.attachments = [];
		} catch (error) {
			const text = error instanceof Error ? error.message : String(error);
			if (isTimeoutError(error)) {
				assistantMessage.content = 'The request exceeded the configured timeout. Increase the timeout or use a faster model for this task.';
				this.lastEditProposal = undefined;
				this.lastAssistantResponse = assistantMessage.content;
				await this.persistProjectHistory();
				this.postMessage({ type: 'error', message: text });
			} else if (isAbortError(error)) {
				assistantMessage.content = 'Execution was cancelled by the user.';
				this.lastEditProposal = undefined;
				this.lastAssistantResponse = assistantMessage.content;
				await this.persistProjectHistory();
			} else {
				assistantMessage.content = `Error: ${text}`;
				this.lastEditProposal = undefined;
				await this.persistProjectHistory();
				this.postMessage({ type: 'error', message: text });
			}
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
			content: `## Fix Verification\n\n${testResult.summary}\n\n### Diagnostics\n\n${testResult.diagnostics}`
		});
		this.lastAssistantResponse = testResult.summary;
		await this.persistProjectHistory();
		await this.writeProjectArtifacts(`/fix ${current.command}`.trim(), `${testResult.summary}\n\n${testResult.diagnostics}`, 'edit', 'execution');
		await this.syncState();

		if (testResult.success) {
			this.activeFixLoop = undefined;
			void vscode.window.showInformationMessage('OpenML Assistant fix loop completed successfully.');
			return;
		}

		if (current.attempt >= maxFixAttempts) {
			this.activeFixLoop = undefined;
			this.messages.push({ role: 'assistant', content: `Reached the fix loop limit (${maxFixAttempts} attempts). Review the latest failures before trying again.` });
			await this.persistProjectHistory();
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
				throw new Error('No proposed file changes available. Ask the assistant to return an openml-edit proposal with the files to create or modify.');
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
				throw new Error('No proposed file changes available. Ask the assistant to return an openml-edit proposal with the files to create or modify.');
			}
			await applyEditProposal(this.lastEditProposal);
			await clearEditPreviewArtifacts();
			this.lastEditProposal = undefined;
			await this.syncState();
			await this.continueFixLoop();
		} catch (error) {
			const text = error instanceof Error ? error.message : String(error);
			this.postMessage({ type: 'error', message: text });
		}
	}

	private async discardEdits(): Promise<void> {
		if (!this.lastEditProposal) {
			return;
		}

		await clearEditPreviewArtifacts();
		this.lastEditProposal = undefined;
		await this.syncState();
		void vscode.window.showInformationMessage('OpenML Assistant cleared the pending edit proposal.');
	}

	private async showTests(): Promise<void> {
		try {
			if (!this.lastEditProposal) {
				throw new Error('No suggested tests are available for the last editable proposal.');
			}
			await showSuggestedTests(this.lastEditProposal);
		} catch (error) {
			const text = error instanceof Error ? error.message : String(error);
			this.postMessage({ type: 'error', message: text });
		}
	}

	private async clearHistory(): Promise<void> {
		const confirmation = await vscode.window.showWarningMessage('Clear the persisted project chat history for this workspace?', { modal: true }, 'Clear History');
		if (confirmation !== 'Clear History') {
			return;
		}

		await clearProjectChatHistory();
		this.historySummary = '';
		this.messages = [{ role: 'status', content: 'Local-first ready. Use Ollama or LM Studio as your primary workflow.' }];
		this.lastAssistantResponse = '';
		this.lastEditProposal = undefined;
		this.activeFixLoop = undefined;
		await this.syncState();
		void vscode.window.showInformationMessage('OpenML Assistant project history cleared.');
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
				mcpServerCount: await getKnownMcpServerCount(),
				mode: this.mode,
				hasEditProposal: !!this.lastEditProposal?.files.length,
				showAgentApplyPrompt: this.mode === 'agent' && !!this.lastEditProposal?.files.length,
				suggestedTestsCount: this.lastEditProposal?.tests.length ?? 0,
				attachments: this.attachments.map(attachment => ({ id: attachment.id, name: attachment.name, kind: attachment.kind })),
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

	private getHtml(webview: vscode.Webview, highlightCssUri: vscode.Uri): string {
		const nonce = createWebviewNonce();
		const providerOptionsMarkup = providerOptions.map(provider => `<option value="${provider}">${providerDisplayName(provider)}</option>`).join('');
		const modeButtonsMarkup = assistantModes.map(mode => `<button type="button" class="mode-button" data-mode="${mode}">${mode}</button>`).join('');

		return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>OpenML Assistant</title>
	<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} data: https:; style-src ${webview.cspSource} 'nonce-${nonce}'; script-src 'nonce-${nonce}'; font-src ${webview.cspSource};" />
	<link rel="stylesheet" href="${highlightCssUri}" />
	<style nonce="${nonce}">
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
			--code-bg: rgba(3, 16, 28, 0.78);
			--code-border: rgba(146, 193, 224, 0.16);
			--code-header: rgba(10, 30, 50, 0.94);
			--code-inline-bg: rgba(215, 235, 250, 0.08);
			--code-shadow: 0 14px 28px rgba(0, 0, 0, 0.22);
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
			width: 34px;
			height: 34px;
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

		.attach-icon {
			width: 20px;
			height: 20px;
			display: block;
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

		.menu.menu-up {
			top: auto;
			bottom: calc(100% + 6px);
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
			background: var(--code-inline-bg);
			padding: 1px 5px;
			border-radius: 6px;
		}
		.rendered .code-block {
			margin: 0 0 12px;
			border: 1px solid var(--code-border);
			border-radius: 12px;
			background: linear-gradient(180deg, rgba(12, 34, 55, 0.98), rgba(4, 17, 29, 0.98));
			box-shadow: var(--code-shadow);
			overflow: hidden;
		}
		.rendered .code-block-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 8px;
			padding: 8px 10px;
			background: linear-gradient(180deg, rgba(18, 43, 67, 0.96), var(--code-header));
			border-bottom: 1px solid rgba(146, 193, 224, 0.10);
		}
		.rendered .code-block-language {
			font-size: 11px;
			font-weight: 700;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: #b9d7ea;
		}
		.rendered .code-copy-button {
			border: 1px solid rgba(185, 215, 234, 0.14);
			border-radius: 999px;
			padding: 4px 9px;
			background: rgba(215, 235, 250, 0.06);
			color: var(--text);
			font: inherit;
			font-size: 11px;
			cursor: pointer;
		}
		.rendered .code-copy-button:hover {
			background: rgba(215, 235, 250, 0.12);
		}
		.rendered .code-copy-button.copied {
			color: #b8f7d4;
			border-color: rgba(184, 247, 212, 0.28);
		}
		.rendered pre {
			margin: 0;
			background: var(--code-bg);
			overflow: auto;
			padding: 0;
		}
		.rendered pre code {
			display: block;
			background: transparent;
			padding: 14px 16px;
			border-radius: 0;
			white-space: pre;
			tab-size: 2;
			font-size: 12px;
			line-height: 1.6;
		}
		.rendered pre code.hljs { background: transparent; display: block; color: inherit; }
		.rendered blockquote {
			margin-left: 0;
			padding-left: 10px;
			border-left: 3px solid rgba(215, 235, 250, 0.18);
			color: var(--muted);
		}
		.rendered table {
			width: 100%;
			border-collapse: collapse;
			font-size: 0.82rem;
			line-height: 1.35;
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

		.attachments {
			display: flex;
			flex-wrap: wrap;
			gap: 6px;
			margin-top: 6px;
		}

		.attachment-chip {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			padding: 4px 8px;
			border: 1px solid var(--border);
			border-radius: 999px;
			background: rgba(215, 235, 250, 0.06);
			font-size: 11px;
			color: var(--text);
		}

		.attachment-kind {
			color: var(--muted);
			text-transform: uppercase;
			font-size: 10px;
		}

		.attachment-remove {
			border: 0;
			background: transparent;
			color: var(--muted);
			cursor: pointer;
			font: inherit;
			padding: 0;
		}

		.bottom {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 4px;
		}

		.apply-confirm {
			display: none;
			margin-top: 6px;
			padding: 8px 10px;
			border: 1px solid rgba(76, 136, 180, 0.32);
			border-radius: 10px;
			background: linear-gradient(180deg, rgba(10, 36, 58, 0.96), rgba(7, 24, 39, 0.96));
			gap: 10px;
			align-items: center;
			justify-content: space-between;
		}

		.apply-confirm.visible {
			display: flex;
		}

		.apply-confirm-text {
			font-size: 11px;
			line-height: 1.4;
			color: var(--text);
		}

		.apply-confirm-actions {
			display: inline-flex;
			gap: 6px;
			flex-shrink: 0;
		}

		.confirm-button {
			padding: 5px 10px;
			border-radius: 8px;
			border: 1px solid var(--border);
			background: rgba(215, 235, 250, 0.08);
			color: var(--text);
			cursor: pointer;
		}

		.confirm-button.primary {
			background: rgba(76, 136, 180, 0.24);
			border-color: rgba(76, 136, 180, 0.46);
		}

		.confirm-button:hover {
			background: rgba(215, 235, 250, 0.14);
		}

		.confirm-button.primary:hover {
			background: rgba(76, 136, 180, 0.34);
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

		.composer-actions {
			display: inline-flex;
			align-items: center;
			gap: 6px;
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
					<button id="rerunButton" class="menu-item" type="button">Run Again</button>
					<button id="refreshModelsButton" class="menu-item" type="button">Refresh Models</button>
					<button id="settingsButton" class="menu-item" type="button">Settings</button>
					<button id="copyButton" class="menu-item" type="button">Copy Last</button>
					<button id="insertButton" class="menu-item" type="button">Insert Last</button>
					<button id="clearHistoryButton" class="menu-item" type="button">Clear History</button>
				</div>
			</div>
		</section>

		<section id="messages" class="messages"></section>

		<section class="composer">
			<textarea id="promptInput" class="prompt-input" placeholder="Ask, edit, plan, delegate, or use /context, /symbols, /memory, /rules, /read, /search, /test, /fix."></textarea>
			<div id="hintText" class="hint">Tools: /context query, /symbols query, /memory, /remember note, /rules, /set-rule rule, /read path, /search pattern, /test [command], /fix [test command]</div>
			<div id="attachments" class="attachments"></div>
			<div id="applyConfirm" class="apply-confirm">
				<div class="apply-confirm-text">Do you want to apply these changes to the current project?</div>
				<div class="apply-confirm-actions">
					<button id="confirmApplyYesButton" class="confirm-button primary" type="button">Yes</button>
					<button id="confirmApplyNoButton" class="confirm-button" type="button">No</button>
				</div>
			</div>
			<div class="bottom">
				<div id="modeSelector" class="mode-selector">${modeButtonsMarkup}</div>
				<div class="composer-actions">
					<div class="menu-wrap">
						<button id="mcpButton" class="icon-button" type="button" aria-label="MCP actions">
							<svg class="attach-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
								<path d="M7 7.75C7 6.7835 7.7835 6 8.75 6H11.25C12.2165 6 13 6.7835 13 7.75V9.25C13 10.2165 12.2165 11 11.25 11H8.75C7.7835 11 7 10.2165 7 9.25V7.75Z" fill="currentColor"/>
								<path d="M11 14.75C11 13.7835 11.7835 13 12.75 13H15.25C16.2165 13 17 13.7835 17 14.75V16.25C17 17.2165 16.2165 18 15.25 18H12.75C11.7835 18 11 17.2165 11 16.25V14.75Z" fill="currentColor"/>
								<path d="M14.5303 8.46967C14.8232 8.17678 15.2981 8.17678 15.591 8.46967L17.7803 10.659C18.0732 10.9519 18.0732 11.4268 17.7803 11.7197C17.4874 12.0126 17.0126 12.0126 16.7197 11.7197L14.5303 9.53033C14.2374 9.23744 14.2374 8.76256 14.5303 8.46967Z" fill="currentColor"/>
								<path d="M8.28033 12.2803C8.57322 11.9874 9.0481 11.9874 9.34099 12.2803L11.5303 14.4697C11.8232 14.7626 11.8232 15.2374 11.5303 15.5303C11.2374 15.8232 10.7626 15.8232 10.4697 15.5303L8.28033 13.341C7.98744 13.0481 7.98744 12.5732 8.28033 12.2803Z" fill="currentColor"/>
							</svg>
						</button>
						<div id="mcpContextMenu" class="menu menu-up hidden">
							<button id="manageMcpServersButton" class="menu-item" type="button">Manage MCP Servers</button>
							<button id="addMcpServerButton" class="menu-item" type="button">Add MCP Server</button>
							<button id="browseMcpServersButton" class="menu-item" type="button">Browse MCP Servers</button>
							<button id="showInstalledMcpServersButton" class="menu-item" type="button">Show Installed MCP Servers</button>
							<button id="showRuntimeMcpServersButton" class="menu-item" type="button">Show Live MCP Servers</button>
							<button id="browseMcpResourcesButton" class="menu-item" type="button">Browse MCP Resources</button>
							<button id="openMcpConfigurationButton" class="menu-item" type="button">Open MCP Configuration</button>
							<button id="openWorkspaceMcpConfigurationButton" class="menu-item" type="button">Open Workspace MCP Configuration</button>
							<button id="initializeWorkspaceMcpConfigurationButton" class="menu-item" type="button">Initialize Workspace MCP</button>
							<button id="startMcpGatewayButton" class="menu-item" type="button">Start MCP Gateway</button>
							<button id="showMcpGatewayButton" class="menu-item" type="button">Show MCP Gateway</button>
							<button id="stopMcpGatewayButton" class="menu-item" type="button">Stop MCP Gateway</button>
						</div>
					</div>
					<button id="attachButton" class="icon-button" type="button" aria-label="Attach files">
						<svg class="attach-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path d="M4.75 4.75H15.5C16.8807 4.75 18 5.86929 18 7.25V12.5H16.5V7.25C16.5 6.69772 16.0523 6.25 15.5 6.25H4.75C4.19772 6.25 3.75 6.69772 3.75 7.25V15.5C3.75 16.0523 4.19772 16.5 4.75 16.5H11V18H4.75C3.36929 18 2.25 16.8807 2.25 15.5V7.25C2.25 5.86929 3.36929 4.75 4.75 4.75Z" fill="currentColor"/>
							<path d="M6.7 14.7L9.9 10.85C10.1017 10.6069 10.4718 10.5942 10.6898 10.8227L12.95 13.1912L14.3819 11.5803C14.589 11.3474 14.9438 11.3334 15.1687 11.5494L16.75 13.0687V15.1498L14.7985 13.2758L13.3326 14.9247C13.1267 15.1564 12.7737 15.1716 12.5496 14.9588L10.303 12.8251L7.8526 15.7735C7.67685 15.985 7.36268 16.0349 7.12865 15.8926L4.75 14.4459V12.6917L6.7 14.7Z" fill="currentColor"/>
							<path d="M8.375 9.5C9.06536 9.5 9.625 8.94036 9.625 8.25C9.625 7.55964 9.06536 7 8.375 7C7.68464 7 7.125 7.55964 7.125 8.25C7.125 8.94036 7.68464 9.5 8.375 9.5Z" fill="currentColor"/>
							<path d="M18 14.25C18.4142 14.25 18.75 14.5858 18.75 15V17.25H21C21.4142 17.25 21.75 17.5858 21.75 18C21.75 18.4142 21.4142 18.75 21 18.75H18.75V21C18.75 21.4142 18.4142 21.75 18 21.75C17.5858 21.75 17.25 21.4142 17.25 21V18.75H15C14.5858 18.75 14.25 18.4142 14.25 18C14.25 17.5858 14.5858 17.25 15 17.25H17.25V15C17.25 14.5858 17.5858 14.25 18 14.25Z" fill="currentColor"/>
						</svg>
					</button>
					<button id="sendButton" class="send-button" type="button" aria-label="Send">
						<svg class="send-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path d="M3 20L21 12L3 4V10L15 12L3 14V20Z" fill="currentColor"/>
						</svg>
					</button>
				</div>
			</div>
		</section>
	</div>

	<script nonce="${nonce}">
		(() => {
		const vscode = acquireVsCodeApi();
		const hljs = undefined;

		const messages = document.getElementById('messages');
		const providerSelect = document.getElementById('providerSelect');
		const modelSelect = document.getElementById('modelSelect');
		const promptInput = document.getElementById('promptInput');
		const sendButton = document.getElementById('sendButton');
		const attachButton = document.getElementById('attachButton');
		const attachments = document.getElementById('attachments');
		const statusText = document.getElementById('statusText');
		const hintText = document.getElementById('hintText');
		const applyConfirm = document.getElementById('applyConfirm');
		const confirmApplyYesButton = document.getElementById('confirmApplyYesButton');
		const confirmApplyNoButton = document.getElementById('confirmApplyNoButton');
		const modeSelector = document.getElementById('modeSelector');
		const menuButton = document.getElementById('menuButton');
		const contextMenu = document.getElementById('contextMenu');
		const mcpButton = document.getElementById('mcpButton');
		const mcpContextMenu = document.getElementById('mcpContextMenu');
		const previewEditsButton = document.getElementById('previewEditsButton');
		const applyEditsButton = document.getElementById('applyEditsButton');
		const testsButton = document.getElementById('testsButton');
		const settingsButton = document.getElementById('settingsButton');
		const keysButton = document.getElementById('keysButton');
		const refreshModelsButton = document.getElementById('refreshModelsButton');
		const manageMcpServersButton = document.getElementById('manageMcpServersButton');
		const addMcpServerButton = document.getElementById('addMcpServerButton');
		const browseMcpServersButton = document.getElementById('browseMcpServersButton');
		const showInstalledMcpServersButton = document.getElementById('showInstalledMcpServersButton');
		const showRuntimeMcpServersButton = document.getElementById('showRuntimeMcpServersButton');
		const browseMcpResourcesButton = document.getElementById('browseMcpResourcesButton');
		const openMcpConfigurationButton = document.getElementById('openMcpConfigurationButton');
		const openWorkspaceMcpConfigurationButton = document.getElementById('openWorkspaceMcpConfigurationButton');
		const initializeWorkspaceMcpConfigurationButton = document.getElementById('initializeWorkspaceMcpConfigurationButton');
		const startMcpGatewayButton = document.getElementById('startMcpGatewayButton');
		const showMcpGatewayButton = document.getElementById('showMcpGatewayButton');
		const stopMcpGatewayButton = document.getElementById('stopMcpGatewayButton');
		const rerunButton = document.getElementById('rerunButton');
		const copyButton = document.getElementById('copyButton');
		const insertButton = document.getElementById('insertButton');
		const clearHistoryButton = document.getElementById('clearHistoryButton');

		function normalizeHighlightLang(lang) {
			switch ((lang || '').toLowerCase()) {
				case 'shell':
					return 'sh';
				case 'py3':
					return 'python';
				case 'tsx':
				case 'typescriptreact':
					return 'tsx';
				case 'ts':
					return 'typescript';
				case 'js':
					return 'javascript';
				case 'json5':
				case 'jsonc':
					return 'json';
				case 'c#':
				case 'csharp':
					return 'csharp';
				default:
					return lang || '';
			}
		}

		function escapeHtml(value) {
			return value
				.replaceAll('&', '&amp;')
				.replaceAll('<', '&lt;')
				.replaceAll('>', '&gt;')
				.replaceAll('"', '&quot;');
		}

		function escapeAttribute(value) {
			return escapeHtml(value).replaceAll("'", '&#39;');
		}

		function renderInlineMarkdown(value) {
			const source = value || '';
			let html = '';
			let index = 0;
			let inCode = false;
			let inStrong = false;
			let inEmphasis = false;
			const inlineCodeToken = String.fromCharCode(96);

			function appendText(text) {
				html += escapeHtml(text);
			}

			while (index < source.length) {
				if (source.startsWith('<br>', index)) {
					html += '<br>';
					index += 4;
					continue;
				}

				if (!inCode && source.startsWith('**', index)) {
					html += inStrong ? '</strong>' : '<strong>';
					inStrong = !inStrong;
					index += 2;
					continue;
				}

				const current = source[index];

				if (current === inlineCodeToken) {
					html += inCode ? '</code>' : '<code>';
					inCode = !inCode;
					index += 1;
					continue;
				}

				if (!inCode && (current === '*' || current === '_')) {
					html += inEmphasis ? '</em>' : '<em>';
					inEmphasis = !inEmphasis;
					index += 1;
					continue;
				}

				if (!inCode && current === '[') {
					const labelEnd = source.indexOf(']', index + 1);
					const urlStart = labelEnd >= 0 ? source.indexOf('(', labelEnd + 1) : -1;
					const urlEnd = urlStart >= 0 ? source.indexOf(')', urlStart + 1) : -1;
					if (labelEnd >= 0 && urlStart === labelEnd + 1 && urlEnd > urlStart) {
						const label = source.slice(index + 1, labelEnd);
						const href = source.slice(urlStart + 1, urlEnd).trim();
						const safeHref = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') ? href : '';
						if (safeHref) {
							html += '<a href="' + escapeAttribute(safeHref) + '">' + renderInlineMarkdown(label) + '</a>';
							index = urlEnd + 1;
							continue;
						}
					}
				}

				appendText(current);
				index += 1;
			}

			if (inCode) {
				html += '</code>';
			}
			if (inStrong) {
				html += '</strong>';
			}
			if (inEmphasis) {
				html += '</em>';
			}

			return html;
		}

		function renderCodeBlock(content, langName) {
			const normalizedLang = normalizeHighlightLang(langName);
			let codeHtml = '';
			let codeClass = normalizedLang ? 'language-' + normalizedLang : '';

			if (hljs) {
				try {
					if (normalizedLang && hljs.getLanguage(normalizedLang)) {
						codeHtml = hljs.highlight(content, {
							language: normalizedLang,
							ignoreIllegals: true
						}).value;
						codeClass = 'hljs language-' + normalizedLang;
					} else {
						codeHtml = hljs.highlightAuto(content).value;
						codeClass = 'hljs';
					}
				} catch {
					codeHtml = escapeHtml(content);
				}
			} else {
				codeHtml = escapeHtml(content);
			}

			const languageLabel = langName || 'Code';
			return '<div class="code-block">' +
				'<div class="code-block-header">' +
				'<span class="code-block-language">' + escapeHtml(languageLabel) + '</span>' +
				'<button type="button" class="code-copy-button" data-copy-code>Copy</button>' +
				'</div>' +
				'<pre><code class="' + escapeAttribute(codeClass) + '">' + codeHtml + '</code></pre>' +
				'</div>';
		}

		function renderFallbackMarkdown(value) {
			const source = (value || '').split('\\r\\n').join('\\n').split('\\r').join('\\n');
			const lines = source.split('\\n');
			const html = [];
			let i = 0;
			const fenceToken = String.fromCharCode(96).repeat(3);

			function isFence(text) {
				return typeof text === 'string' && text.trimStart().startsWith(fenceToken);
			}

			function getFenceLanguage(text) {
				const trimmed = (text || '').trim();
				return trimmed.startsWith(fenceToken) ? trimmed.slice(fenceToken.length).trim() : '';
			}

			function isTableRow(text) {
				const trimmed = (text || '').trim();
				return trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length >= 2;
			}

			function isTableSeparator(text) {
				const trimmed = (text || '').trim();
				if (!trimmed || !trimmed.includes('|')) {
					return false;
				}

				for (const char of trimmed) {
					if (!['|', '-', ':', ' '].includes(char)) {
						return false;
					}
				}

				return true;
			}

			function getHeadingLevel(text) {
				const trimmed = (text || '').trimStart();
				let level = 0;
				while (level < trimmed.length && trimmed[level] === '#') {
					level += 1;
				}
				if (level === 0 || level > 4 || trimmed[level] !== ' ') {
					return 0;
				}
				return level;
			}

			function isHorizontalRule(text) {
				const trimmed = (text || '').trim();
				if (trimmed.length < 3) {
					return false;
				}

				const marker = trimmed[0];
				if (marker !== '-' && marker !== '*') {
					return false;
				}

				for (const char of trimmed) {
					if (char !== marker) {
						return false;
					}
				}

				return true;
			}

			function getOrderedItemText(text) {
				const trimmed = (text || '').trimStart();
				let cursor = 0;
				while (cursor < trimmed.length && trimmed[cursor] >= '0' && trimmed[cursor] <= '9') {
					cursor += 1;
				}
				if (cursor === 0 || trimmed.slice(cursor, cursor + 2) !== '. ') {
					return undefined;
				}
				return trimmed.slice(cursor + 2);
			}

			while (i < lines.length) {
				const line = lines[i];
				if (isFence(line)) {
					const langName = getFenceLanguage(line);
					i += 1;
					const codeLines = [];
					while (i < lines.length && !isFence(lines[i])) {
						codeLines.push(lines[i]);
						i += 1;
					}
					html.push(renderCodeBlock(codeLines.join('\\n'), langName));
					i += 1;
					continue;
				}

				if (isTableRow(line) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
					const headerCells = line.split('|').slice(1, -1).map(cell => cell.trim());
					i += 2;
					const bodyRows = [];
					while (i < lines.length && isTableRow(lines[i])) {
						bodyRows.push(lines[i].split('|').slice(1, -1).map(cell => cell.trim()));
						i += 1;
					}

					html.push('<table><thead><tr>' +
						headerCells.map(cell => '<th>' + renderInlineMarkdown(cell) + '</th>').join('') +
						'</tr></thead><tbody>' +
						bodyRows.map(row => '<tr>' + row.map(cell => '<td>' + renderInlineMarkdown(cell) + '</td>').join('') + '</tr>').join('') +
						'</tbody></table>');
					continue;
				}

				if (isHorizontalRule(line)) {
					html.push('<hr>');
					i += 1;
					continue;
				}

				const headingLevel = getHeadingLevel(line);
				if (headingLevel > 0) {
					const headingText = line.trimStart().slice(headingLevel + 1);
					html.push('<h' + headingLevel + '>' + renderInlineMarkdown(headingText) + '</h' + headingLevel + '>');
					i += 1;
					continue;
				}

				if (!line.trim()) {
					i += 1;
					continue;
				}

				if (line.startsWith('- ') || line.startsWith('* ')) {
					const items = [];
					while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
						items.push(lines[i].slice(2));
						i += 1;
					}
					html.push('<ul>' + items.map(item => '<li>' + renderInlineMarkdown(item) + '</li>').join('') + '</ul>');
					continue;
				}

				const orderedItem = getOrderedItemText(line);
				if (orderedItem !== undefined) {
					const items = [];
					while (i < lines.length) {
						const item = getOrderedItemText(lines[i]);
						if (item === undefined) {
							break;
						}
						items.push(item);
						i += 1;
					}
					html.push('<ol>' + items.map(item => '<li>' + renderInlineMarkdown(item) + '</li>').join('') + '</ol>');
					continue;
				}

				if (line.trimStart().startsWith('> ')) {
					const quoteLines = [];
					while (i < lines.length && lines[i].trimStart().startsWith('> ')) {
						quoteLines.push(lines[i].trimStart().slice(2));
						i += 1;
					}
					html.push('<blockquote>' + renderInlineMarkdown(quoteLines.join('<br>')) + '</blockquote>');
					continue;
				}

				const paragraph = [];
				while (
					i < lines.length &&
					lines[i].trim() &&
					!isFence(lines[i]) &&
					!isTableRow(lines[i]) &&
					!isHorizontalRule(lines[i]) &&
					getHeadingLevel(lines[i]) === 0 &&
					getOrderedItemText(lines[i]) === undefined &&
					!lines[i].trimStart().startsWith('> ') &&
					!lines[i].startsWith('- ') &&
					!lines[i].startsWith('* ')
				) {
					paragraph.push(lines[i]);
					i += 1;
				}

				html.push('<p>' + renderInlineMarkdown(paragraph.join('<br>')) + '</p>');
			}

			return html.join('');
		}

		function closeMenu() {
			contextMenu.classList.add('hidden');
			mcpContextMenu.classList.add('hidden');
		}

		function renderMarkdown(value) {
			return renderFallbackMarkdown(value || '');
		}

		let lastRenderedRoles = [];
		let lastRenderedContents = [];

		function createMessageMarkup(message) {
			const title = message.role === 'user' ? 'You' : 'Assistant';
			const body = message.role === 'user'
				? '<div>' + escapeHtml(message.content) + '</div>'
				: '<div class="rendered">' + renderMarkdown(message.content) + '</div>';
			return '<article class="message ' + message.role + '">' +
				'<div class="meta">' + title + '</div>' +
				body +
				'</article>';
		}

		function renderMessages(items) {
			const visibleMessages = items.filter(message => message.role !== 'status');

			const roles = visibleMessages.map(message => message.role);
			const contents = visibleMessages.map(message => message.content);
			const sameShape =
				roles.length === lastRenderedRoles.length &&
				roles.every((role, index) => role === lastRenderedRoles[index]);

			if (
				sameShape &&
				visibleMessages.length > 0 &&
				roles[roles.length - 1] === 'assistant'
			) {
				let changedIndex = -1;
				for (let index = 0; index < contents.length; index += 1) {
					if (contents[index] !== lastRenderedContents[index]) {
						if (changedIndex !== -1) {
							changedIndex = -2;
							break;
						}
						changedIndex = index;
					}
				}

				if (changedIndex === contents.length - 1) {
					const lastNode = messages.lastElementChild;
					if (lastNode instanceof HTMLElement) {
						const rendered = lastNode.querySelector('.rendered');
						if (rendered instanceof HTMLElement) {
							rendered.innerHTML = renderMarkdown(visibleMessages[changedIndex].content);
							lastRenderedContents = contents;
							messages.scrollTop = messages.scrollHeight;
							return;
						}
					}
				}
			}

			messages.innerHTML = visibleMessages.map(createMessageMarkup).join('');
			lastRenderedRoles = roles;
			lastRenderedContents = contents;
			messages.scrollTop = messages.scrollHeight;
		}

		function renderModels(models, selectedModel) {
			const options = models.length ? models : [selectedModel || 'Not configured'];
			modelSelect.innerHTML = options.map(model => '<option value="' + escapeHtml(model) + '">' + escapeHtml(model) + '</option>').join('');
			modelSelect.value = selectedModel || options[0] || '';
		}

		function renderAttachments(items) {
			attachments.innerHTML = items.map(item =>
				'<div class="attachment-chip">' +
					'<span class="attachment-kind">' + escapeHtml(item.kind) + '</span>' +
					'<span>' + escapeHtml(item.name) + '</span>' +
					'<button type="button" class="attachment-remove" data-remove-attachment="' + escapeAttribute(item.id) + '">x</button>' +
				'</div>'
			).join('');
		}

		let currentBusy = false;
		let pendingState = null;
		let scheduledStateRender = 0;
		setMode('agent');

		function flushStateRender() {
			scheduledStateRender = 0;
			const state = pendingState;
			pendingState = null;
			if (!state) {
				return;
			}

			providerSelect.value = state.provider;
			renderModels(state.models, state.modelLabel);
			statusText.textContent = state.providerLabel + ' | ' + state.modelLabel + (state.localFirst ? ' | local' : ' | remote') + ' | MCP: ' + String(state.mcpServerCount ?? 0);
			hintText.textContent = state.hasEditProposal
				? (state.showAgentApplyPrompt
					? 'Changes are ready. Confirm with Yes / No or use Preview Edits to review before applying.'
					: 'Edit proposal ready. Use Preview Edits, Apply Edits, or Suggested Tests from the menu.')
				: 'Tools: /context query, /symbols query, /memory, /remember note, /rules, /set-rule rule, /read path, /search pattern, /test [command], /fix [test command]';
			setApplyPromptVisible(state.showAgentApplyPrompt);
			setMode(state.mode);
			renderAttachments(state.attachments || []);
			renderMessages(state.messages);
		}

		function scheduleStateRender(state) {
			pendingState = state;
			if (scheduledStateRender) {
				return;
			}

			const delay = currentBusy ? 80 : 0;
			scheduledStateRender = window.setTimeout(flushStateRender, delay);
		}

		function setBusy(isBusy) {
			currentBusy = isBusy;
			providerSelect.disabled = isBusy;
			modelSelect.disabled = isBusy;
			promptInput.disabled = isBusy;
			attachButton.disabled = isBusy;
			sendButton.innerHTML = isBusy
				? '<svg class="send-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" fill="#ef4444"/></svg>'
				: '<svg class="send-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 20L21 12L3 4V10L15 12L3 14V20Z" fill="currentColor"/></svg>';
			sendButton.setAttribute('aria-label', isBusy ? 'Stop' : 'Send');
			statusText.textContent = isBusy ? 'Working...' : statusText.textContent;
		}

		function setMode(mode) {
			for (const button of modeSelector.querySelectorAll('.mode-button')) {
				button.classList.toggle('active', button.dataset.mode === mode);
			}
		}

		function setApplyPromptVisible(visible) {
			applyConfirm.classList.toggle('visible', !!visible);
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
			mcpContextMenu.classList.add('hidden');
			contextMenu.classList.toggle('hidden');
		});

		mcpButton.addEventListener('click', event => {
			event.stopPropagation();
			contextMenu.classList.add('hidden');
			mcpContextMenu.classList.toggle('hidden');
		});

		document.addEventListener('click', closeMenu);
		contextMenu.addEventListener('click', event => event.stopPropagation());
		mcpContextMenu.addEventListener('click', event => event.stopPropagation());
		messages.addEventListener('click', async event => {
			const target = event.target;
			if (!(target instanceof HTMLElement)) {
				return;
			}

			const copyButton = target.closest('[data-copy-code]');
			if (!(copyButton instanceof HTMLButtonElement)) {
				return;
			}

			const block = copyButton.closest('.code-block');
			const codeElement = block ? block.querySelector('pre code') : null;
			const code = codeElement ? codeElement.textContent || '' : '';
			if (!code) {
				return;
			}

			try {
				await navigator.clipboard.writeText(code);
				copyButton.textContent = 'Copied';
				copyButton.classList.add('copied');
				window.setTimeout(() => {
					copyButton.textContent = 'Copy';
					copyButton.classList.remove('copied');
				}, 1400);
			} catch (error) {
				console.warn('OpenML Assistant could not copy the code block.', error);
			}
		});
		attachments.addEventListener('click', event => {
			const target = event.target;
			if (!(target instanceof HTMLElement)) {
				return;
			}

			const id = target.dataset.removeAttachment;
			if (!id) {
				return;
			}

			vscode.postMessage({ type: 'removeAttachment', id });
		});
		previewEditsButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'previewEdits' });
		});
		applyEditsButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'applyEdits' });
		});
		confirmApplyYesButton.addEventListener('click', () => {
			vscode.postMessage({ type: 'applyEdits' });
		});
		confirmApplyNoButton.addEventListener('click', () => {
			vscode.postMessage({ type: 'discardEdits' });
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
		manageMcpServersButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'manageMcpServers' });
		});
		addMcpServerButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'addMcpServer' });
		});
		browseMcpServersButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'browseMcpServers' });
		});
		showInstalledMcpServersButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'showInstalledMcpServers' });
		});
		showRuntimeMcpServersButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'showRuntimeMcpServers' });
		});
		browseMcpResourcesButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'browseMcpResources' });
		});
		openMcpConfigurationButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'openMcpConfiguration' });
		});
		openWorkspaceMcpConfigurationButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'openWorkspaceMcpConfiguration' });
		});
		initializeWorkspaceMcpConfigurationButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'initializeWorkspaceMcpConfiguration' });
		});
		startMcpGatewayButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'startMcpGateway' });
		});
		showMcpGatewayButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'showMcpGateway' });
		});
		stopMcpGatewayButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'stopMcpGateway' });
		});
		rerunButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'rerunLastPrompt' });
		});
		copyButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'copyLastResponse' });
		});
		insertButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'insertLastResponse' });
		});
		clearHistoryButton.addEventListener('click', () => {
			closeMenu();
			vscode.postMessage({ type: 'clearHistory' });
		});
		attachButton.addEventListener('click', () => {
			vscode.postMessage({ type: 'pickAttachments' });
		});

		sendButton.addEventListener('click', () => {
			if (currentBusy) {
				vscode.postMessage({ type: 'cancelRequest' });
				return;
			}
			submitPrompt();
		});

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
					scheduleStateRender(message.state);
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
		})();
	</script>
</body>
</html>`;
	}
}




