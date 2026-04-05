import * as vscode from 'vscode';
import { buildDeepContext } from './context';
import { getProviderSecret } from './secrets';

export type ProviderId = 'ollama' | 'lmstudio' | 'openai' | 'gemini' | 'anthropic' | 'openrouter' | 'azurefoundry';
export type AssistantMode = 'agent' | 'ask' | 'edit' | 'plan';
export type AttachmentKind = 'image' | 'pdf';

const DEFAULT_REQUEST_TIMEOUT_MS = 300000;
const DEFAULT_COMPATIBLE_MAX_OUTPUT_TOKENS = 28000;
const DEFAULT_GEMINI_MAX_OUTPUT_TOKENS = 28000;
const DEFAULT_ANTHROPIC_MAX_OUTPUT_TOKENS = 28000;
const DEFAULT_AZURE_FOUNDRY_MAX_OUTPUT_TOKENS = 28000;

export interface WorkspacePrompt {
	prompt: string;
	workspaceName: string;
	activeFileName?: string;
	selectedText?: string;
	extraContext?: string;
	systemPrompt: string;
	mode?: AssistantMode;
	attachments?: PromptAttachment[];
}

export interface PromptAttachment {
	name: string;
	mimeType: string;
	kind: AttachmentKind;
	byteSize?: number;
	base64Data?: string;
}

export type ProviderResponse = {
	text: string;
	model: string;
};

export type StreamCallbacks = {
	onDelta: (chunk: string) => void;
	onComplete?: (result: ProviderResponse) => void;
};

let activeRequestController: AbortController | undefined;

function getConfig(): vscode.WorkspaceConfiguration {
	return vscode.workspace.getConfiguration('openmlAssistant');
}

function getString(path: string, fallback = ''): string {
	return getConfig().get<string>(path, fallback).trim();
}

function getNumber(path: string, fallback: number): number {
	return getConfig().get<number>(path, fallback);
}

function getTimeout(): number {
	return getNumber('requestTimeoutMs', DEFAULT_REQUEST_TIMEOUT_MS);
}

function createRequestSignal(): AbortSignal {
	const timeoutSignal = AbortSignal.timeout(getTimeout());
	activeRequestController = new AbortController();
	return AbortSignal.any([timeoutSignal, activeRequestController.signal]);
}

function clearActiveRequestController(): void {
	activeRequestController = undefined;
}

export function cancelActiveProviderRequest(): void {
	activeRequestController?.abort();
}

export function isTimeoutError(error: unknown): boolean {
	if (!(error instanceof Error)) {
		return false;
	}

	return error.name === 'TimeoutError' || /timed?\s*out|timeout/i.test(error.message);
}

export function isAbortError(error: unknown): boolean {
	return error instanceof Error && error.name === 'AbortError';
}

function requireValue(value: string, label: string): string {
	if (!value) {
		throw new Error(`Missing configuration: ${label}`);
	}

	return value;
}

function getAttachmentLabel(kind: AttachmentKind): string {
	switch (kind) {
		case 'image': return 'image';
		case 'pdf': return 'PDF';
		default: return 'PDF';
	}
}

function getAttachmentKinds(input: WorkspacePrompt): AttachmentKind[] {
	return [...new Set((input.attachments ?? []).map(attachment => attachment.kind))];
}

function formatAttachmentKinds(kinds: AttachmentKind[]): string {
	return kinds.map(getAttachmentLabel).join(', ');
}

function assertProviderSupportsAttachments(provider: ProviderId, input: WorkspacePrompt): void {
	const kinds = getAttachmentKinds(input);
	if (!kinds.length) {
		return;
	}

	switch (provider) {
		case 'gemini':
		case 'anthropic':
		case 'openrouter':
		case 'azurefoundry':
			return;
		case 'openai': {
			const unsupportedKinds = kinds.filter(kind => kind !== 'image' && kind !== 'pdf');
			if (unsupportedKinds.length) {
				throw new Error(`The model does not support files of type ${formatAttachmentKinds(unsupportedKinds)}.`);
			}

			const oversizeImage = (input.attachments ?? []).find(attachment => attachment.kind === 'image' && (attachment.byteSize ?? 0) > 2 * 1024 * 1024);
			if (oversizeImage) {
				throw new Error(`The attached image ${oversizeImage.name} exceeds the 2 MB limit supported by OpenAI.`);
			}
			return;
		}
		default: {
			throw new Error(`The model does not support files of type ${formatAttachmentKinds(kinds)}.`);
		}
	}
}

function isAttachmentSupportError(error: unknown): boolean {
	if (!(error instanceof Error)) {
		return false;
	}

	return /unsupported|not supported|does not support|invalid.+(file|attachment|document|image|pdf|mime)|unsupported.+(file|attachment|document|image|pdf)|cannot process.+(file|attachment|document|image|pdf)|media type|mime type|document type|image input|vision is not enabled|file uploads? are not supported/i.test(error.message);
}

function normalizeAttachmentError(input: WorkspacePrompt, error: unknown): never {
	if (input.attachments?.length && isAttachmentSupportError(error)) {
		throw new Error(`The model does not support files of type ${formatAttachmentKinds(getAttachmentKinds(input))}.`);
	}

	throw error;
}

function buildHeaders(apiKey?: string, extraHeaders?: Record<string, string>): Record<string, string> {
	return {
		'Content-Type': 'application/json',
		...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
		...(extraHeaders ?? {})
	};
}

async function getJson(url: string, headers?: Record<string, string>): Promise<any> {
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers,
			signal: createRequestSignal()
		});

		if (!response.ok) {
			throw new Error(`Request failed (${response.status}): ${await response.text()}`);
		}

		return response.json();
	} finally {
		clearActiveRequestController();
	}
}

async function postJson(url: string, body: unknown, init: RequestInit = {}): Promise<any> {
	try {
		const response = await fetch(url, {
			method: 'POST',
			...init,
			body: JSON.stringify(body),
			signal: createRequestSignal()
		});

		if (!response.ok) {
			throw new Error(`Request failed (${response.status}): ${await response.text()}`);
		}

		return response.json();
	} finally {
		clearActiveRequestController();
	}
}

async function postStream(url: string, body: unknown, init: RequestInit = {}): Promise<Response> {
	const response = await fetch(url, {
		method: 'POST',
		...init,
		body: JSON.stringify(body),
		signal: createRequestSignal()
	});

	if (!response.ok) {
		clearActiveRequestController();
		throw new Error(`Request failed (${response.status}): ${await response.text()}`);
	}

	return response;
}

async function readSseStream(response: Response, onEvent: (json: any) => string | undefined): Promise<string> {
	const reader = response.body?.getReader();
	if (!reader) {
		clearActiveRequestController();
		throw new Error('Streaming response body is not available.');
	}

	const decoder = new TextDecoder();
	let buffer = '';
	let text = '';

	try {
		while (true) {
			const { done, value } = await reader.read();
			buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });

			let boundary = buffer.indexOf('\n\n');
			while (boundary >= 0) {
				const block = buffer.slice(0, boundary);
				buffer = buffer.slice(boundary + 2);
				const dataLines = block
					.split(/\r?\n/)
					.filter(line => line.startsWith('data:'))
					.map(line => line.slice(5).trim())
					.filter(Boolean);

				for (const dataLine of dataLines) {
					if (dataLine === '[DONE]') {
						return text;
					}

					const json = JSON.parse(dataLine);
					const delta = onEvent(json);
					if (delta) {
						text += delta;
					}
				}

				boundary = buffer.indexOf('\n\n');
			}

			if (done) {
				break;
			}
		}

		return text;
	} finally {
		clearActiveRequestController();
	}
}

async function readNdjsonStream(response: Response, onEvent: (json: any) => string | undefined): Promise<string> {
	const reader = response.body?.getReader();
	if (!reader) {
		clearActiveRequestController();
		throw new Error('Streaming response body is not available.');
	}

	const decoder = new TextDecoder();
	let buffer = '';
	let text = '';

	try {
		while (true) {
			const { done, value } = await reader.read();
			buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
			const lines = buffer.split(/\r?\n/);
			buffer = lines.pop() ?? '';

			for (const line of lines) {
				if (!line.trim()) {
					continue;
				}

				const json = JSON.parse(line);
				const delta = onEvent(json);
				if (delta) {
					text += delta;
				}
			}

			if (done) {
				break;
			}
		}

		return text;
	} finally {
		clearActiveRequestController();
	}
}

function getModeInstructions(mode: AssistantMode): string[] {
	switch (mode) {
		case 'ask':
			return ['Answer the developer question directly in Markdown.'];
		case 'edit':
			return [
				'Produce an implementation-oriented editing response in Markdown.',
				'When the user asks for code changes, include a final ```openml-edit code block containing strict JSON with this shape: {"summary":"...","files":[{"path":"relative/path","content":"full file content"}],"tests":["test command or test idea"]}.',
				'Paths in the openml-edit block must be relative to the workspace and each file content must be the full desired file content, not a patch.',
				'Before the openml-edit block, explain the change, affected files, and any risks in Markdown.',
			'Never truncate the JSON proposal. If the request is large, prioritize a minimal but functional scaffold that fits in one complete response.'
			];
		case 'plan':
			return ['Create a practical implementation plan in Markdown with files, risks, and steps.'];
		case 'agent':
		default:
			return [
				'Act like a coding agent helping inside an IDE and respond in Markdown.',
				'If the request clearly requires code edits, you may include a final ```openml-edit code block with strict JSON using full file contents for each changed file.',
				'When asked to create or implement something, do not stop at recommendations. Return a complete editable proposal. Never truncate the JSON proposal; if needed, reduce scope to a minimal functional scaffold.'
			];
	}
}

function getAttachmentInstructions(input: WorkspacePrompt): string[] {
	if (!(input.attachments?.length)) {
		return [];
	}

	const attachmentSummary = input.attachments
		.map(attachment => `${attachment.name} (${attachment.mimeType})`)
		.join(', ');

	const lines = [
		`Attached files available to analyze: ${attachmentSummary}.`,
		'Use the attached files as source material for your answer.',
		'Do not ignore the attachments.'
	];

	if (input.mode === 'agent' || input.mode === 'edit') {
		lines.push('If the user is asking to create, modify, implement, scaffold, or adapt code based on the attached files, you must return a complete openml-edit proposal with full file contents.');
		lines.push('Use the attached files as source of truth for layout, structure, visual design, requirements, and extracted details.');
		lines.push('Do not stop at describing the attached files when the user is asking for implementation work.');
		lines.push('If the user is only asking to analyze, summarize, extract, or describe the attached files, answer normally in Markdown without forcing openml-edit.');
	}

	return lines;
}

function createUserPrompt(input: WorkspacePrompt): string {
	const mode = input.mode ?? 'agent';
	const contextLines = [
		`Workspace: ${input.workspaceName}`,
		`Mode: ${mode}`,
		input.activeFileName ? `Active file: ${input.activeFileName}` : 'Active file: none',
		input.selectedText ? `Selected text:\n${input.selectedText}` : 'Selected text: none'
	];

	return [
		...getModeInstructions(mode),
		...getAttachmentInstructions(input),
		'',
		'User request:',
		input.prompt,
		'',
		'Workspace context:',
		...contextLines,
		input.extraContext ? '' : undefined,
		input.extraContext ? 'Deep workspace context:' : undefined,
		input.extraContext || undefined
	].filter(Boolean).join('\n');
}

function getModelConfigPath(provider: ProviderId): string {
	switch (provider) {
		case 'ollama': return 'ollama.model';
		case 'lmstudio': return 'lmStudio.model';
		case 'openai': return 'openai.model';
		case 'gemini': return 'gemini.model';
		case 'anthropic': return 'anthropic.model';
		case 'openrouter': return 'openRouter.model';
		case 'azurefoundry': return 'azureFoundry.deployment';
	}
}

function normalizeOpenAIModel(model: string): string {
	switch (model.trim()) {
		case 'gpt-5.4': return 'gpt-5';
		case 'gpt-5.4-mini': return 'gpt-5-mini';
		default: return model.trim();
	}
}

function isAllowedOpenAIModel(modelId: string): boolean {
	const id = modelId.trim().toLowerCase();
	if (!id) {
		return false;
	}

	const prefixes = ['gpt-4', 'gpt-4.', 'gpt-4o', 'gpt-5', 'gpt-5.'];
	if (!prefixes.some(prefix => id.startsWith(prefix))) {
		return false;
	}

	const blockedMarkers = ['audio', 'realtime', 'transcribe', 'tts', 'image', 'embedding', 'moderation', 'search', 'vision-preview'];
	if (blockedMarkers.some(marker => id.includes(marker))) {
		return false;
	}

	const sizeMarkers = ['mini', 'max', 'pro'];
	const hasKnownSize = sizeMarkers.some(marker => id.includes(marker));
	return hasKnownSize || /^gpt-4(?:[.-]|$)/.test(id) || /^gpt-4o(?:[.-]|$)/.test(id) || /^gpt-5(?:[.-]|$)/.test(id);
}

function usesOpenAIResponsesApi(modelId: string): boolean {
	return /^gpt-5(?:[.-]|$)/i.test(modelId.trim());
}

function buildAnthropicMessagesUrl(baseUrl: string): string {
	const normalized = baseUrl.trim().replace(/\/$/, '');
	if (normalized.endsWith('/messages')) {
		return normalized;
	}
	return `${normalized}/messages`;
}

function buildAnthropicModelsUrl(baseUrl: string): string {
	const normalized = baseUrl.trim().replace(/\/$/, '');
	if (normalized.endsWith('/models')) {
		return normalized;
	}
	if (normalized.endsWith('/messages')) {
		return normalized.replace(/\/messages$/, '/models');
	}
	return `${normalized}/models`;
}

function extractAnthropicText(json: any): string {
	return (json?.content ?? [])
		.filter((block: { type?: string; text?: string }) => block?.type === 'text' && typeof block?.text === 'string')
		.map((block: { text?: string }) => block.text ?? '')
		.join('')
		.trim();
}

function buildAzureFoundryResponsesUrl(host: string, apiVersion: string): string {
	const normalizedVersion = apiVersion.trim() || '2025-04-01-preview';
	const rawHost = host.trim();
	if (!rawHost) {
		return `/openai/responses?api-version=${encodeURIComponent(normalizedVersion)}`;
	}

	const parsedUrl = new URL(rawHost);
	const normalizedPath = parsedUrl.pathname.replace(/\/$/, '');
	if (!/\/openai(?:\/v1)?\/responses$/i.test(normalizedPath)) {
		parsedUrl.pathname = `${normalizedPath}/openai/responses`;
	}

	parsedUrl.searchParams.set('api-version', normalizedVersion);
	return parsedUrl.toString();
}

function buildAzureFoundryHeaders(apiKey: string, authMode: string): Record<string, string> {
	return authMode === 'api-key'
		? { 'Content-Type': 'application/json', 'api-key': apiKey }
		: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` };
}

function buildOpenAIResponsesUrl(baseUrl: string): string {
	const normalized = baseUrl.trim().replace(/\/$/, '');
	return normalized.endsWith('/responses') ? normalized : `${normalized}/responses`;
}

function extractTextFromResponseContent(content: unknown): string {
	if (!Array.isArray(content)) {
		return '';
	}

	return content
		.flatMap(item => {
			if (!item || typeof item !== 'object') {
				return [];
			}

			const typedItem = item as { type?: string; text?: string };
			if ((typedItem.type === 'output_text' || typedItem.type === 'text') && typeof typedItem.text === 'string') {
				return [typedItem.text];
			}

			return [];
		})
		.join('')
		.trim();
}

function extractResponsesApiText(json: any): string {
	if (typeof json?.output_text === 'string' && json.output_text.trim()) {
		return json.output_text.trim();
	}

	if (Array.isArray(json?.output_text)) {
		const outputText = json.output_text
			.map((item: unknown) => {
				if (typeof item === 'string') {
					return item;
				}

				if (item && typeof item === 'object' && typeof (item as { text?: string }).text === 'string') {
					return (item as { text: string }).text;
				}

				return '';
			})
			.join('')
			.trim();
		if (outputText) {
			return outputText;
		}
	}

	const fromMessages = (json?.output ?? [])
		.filter((item: { type?: string }) => item?.type === 'message')
		.map((item: { content?: unknown }) => extractTextFromResponseContent(item?.content))
		.join('')
		.trim();

	if (fromMessages) {
		return fromMessages;
	}

	return extractTextFromResponseContent(json?.content);
}

function createResponsesApiUserContent(input: WorkspacePrompt): Array<Record<string, string>> {
	return [
		{ type: 'input_text', text: createUserPrompt(input) },
		...(input.attachments ?? [])
			.filter(attachment => attachment.kind === 'image')
			.map(attachment => ({
				type: 'input_image',
				image_url: `data:${attachment.mimeType};base64,${attachment.base64Data ?? ''}`
			})),
		...(input.attachments ?? [])
			.filter(attachment => attachment.kind === 'pdf')
			.map(attachment => ({
				type: 'input_file',
				filename: attachment.name,
				file_data: `data:${attachment.mimeType};base64,${attachment.base64Data ?? ''}`
			}))
	];
}

async function callAzureFoundry(input: WorkspacePrompt): Promise<ProviderResponse> {
	const host = requireValue(getString('azureFoundry.host'), 'openmlAssistant.azureFoundry.host');
	const apiVersion = getString('azureFoundry.apiVersion', '2025-04-01-preview');
	const apiKey = requireValue(await getProviderSecret('azurefoundry'), 'Azure Foundry API key');
	const deployment = requireValue(getString('azureFoundry.deployment'), 'openmlAssistant.azureFoundry.deployment');
	const authMode = getString('azureFoundry.authMode', 'bearer') || 'bearer';
	const json = await postJson(buildAzureFoundryResponsesUrl(host, apiVersion), {
		model: deployment,
		input: [{
			role: 'user',
			content: createResponsesApiUserContent(input)
		}],
		instructions: input.systemPrompt,
		max_output_tokens: getNumber('azureFoundry.maxOutputTokens', DEFAULT_AZURE_FOUNDRY_MAX_OUTPUT_TOKENS)
	}, {
		headers: buildAzureFoundryHeaders(apiKey, authMode)
	});

	const text = extractResponsesApiText(json);
	if (!text) {
		throw new Error('Azure Foundry response did not include visible text content.');
	}

	return { text, model: deployment };
}

async function callOpenAIResponses(input: WorkspacePrompt): Promise<ProviderResponse> {
	const baseUrl = requireValue(getString('openai.baseUrl', 'https://api.openai.com/v1'), 'openmlAssistant.openai.baseUrl');
	const apiKey = requireValue(await getProviderSecret('openai'), 'OpenAI API key');
	const model = normalizeOpenAIModel(requireValue(getString('openai.model'), 'openmlAssistant.openai.model'));
	const json = await postJson(buildOpenAIResponsesUrl(baseUrl), {
		model,
		instructions: input.systemPrompt,
		input: [{
			role: 'user',
			content: createResponsesApiUserContent(input)
		}],
		max_output_tokens: getNumber('openai.maxOutputTokens', DEFAULT_COMPATIBLE_MAX_OUTPUT_TOKENS)
	}, {
		headers: buildHeaders(apiKey)
	});

	const text = extractResponsesApiText(json);
	if (!text) {
		throw new Error('OpenAI response did not include visible text content.');
	}

	return { text, model };
}

export function getActiveProvider(): ProviderId {
	return getConfig().get<ProviderId>('provider', 'ollama');
}

export async function setActiveProvider(provider: ProviderId): Promise<void> {
	await getConfig().update('provider', provider, vscode.ConfigurationTarget.Global);
}

export async function setModelForProvider(provider: ProviderId, model: string): Promise<void> {
	await getConfig().update(getModelConfigPath(provider), model.trim(), vscode.ConfigurationTarget.Global);
}

export function getSystemPrompt(): string {
	return getString('systemPrompt', 'You are OpenML Code Assistant. Produce practical implementation plans with concrete files, steps, risks, tests, and workspace-aware reasoning. When working in edit mode, prefer responses that can be previewed and applied safely inside the IDE.');
}

export function getCurrentModelLabel(provider = getActiveProvider()): string {
	switch (provider) {
		case 'ollama': return getString('ollama.model', 'llama3.2');
		case 'lmstudio': return getString('lmStudio.model', 'local-model');
		case 'openai': return getString('openai.model');
		case 'gemini': return getString('gemini.model');
		case 'anthropic': return getString('anthropic.model');
		case 'openrouter': return getString('openRouter.model');
		case 'azurefoundry': return getString('azureFoundry.deployment');
	}
}

export function isLocalProvider(provider = getActiveProvider()): boolean {
	return provider === 'ollama' || provider === 'lmstudio';
}

export function providerDisplayName(provider: ProviderId): string {
	switch (provider) {
		case 'ollama': return 'Ollama';
		case 'lmstudio': return 'LM Studio';
		case 'openai': return 'OpenAI';
		case 'gemini': return 'Gemini';
		case 'anthropic': return 'Anthropic';
		case 'openrouter': return 'OpenRouter';
		case 'azurefoundry': return 'Azure Foundry';
	}
}

export const providerOptions: ProviderId[] = ['ollama', 'lmstudio', 'openai', 'gemini', 'anthropic', 'openrouter', 'azurefoundry'];
export const assistantModes: AssistantMode[] = ['agent', 'ask', 'edit', 'plan'];

async function streamOpenAICompatible(baseUrl: string, model: string, input: WorkspacePrompt, callbacks: StreamCallbacks, apiKey?: string, extraHeaders?: Record<string, string>, options?: { temperature?: number; maxTokens?: number }): Promise<ProviderResponse> {
	const response = await postStream(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
		model,
		stream: true,
		messages: [
			{ role: 'system', content: input.systemPrompt },
			{ role: 'user', content: createUserPrompt(input) }
		],
		...(typeof options?.maxTokens === 'number' ? { max_tokens: options.maxTokens } : {}),
		...(typeof options?.temperature === 'number' ? { temperature: options.temperature } : {})
	}, {
		headers: buildHeaders(apiKey, extraHeaders)
	});

	const text = await readSseStream(response, json => {
		const delta = json?.choices?.[0]?.delta?.content;
		if (typeof delta === 'string' && delta) {
			callbacks.onDelta(delta);
			return delta;
		}
		return undefined;
	});

	const result = { text, model };
	callbacks.onComplete?.(result);
	return result;
}

async function streamOpenRouter(input: WorkspacePrompt, callbacks: StreamCallbacks): Promise<ProviderResponse> {
	const baseUrl = requireValue(getString('openRouter.baseUrl', 'https://openrouter.ai/api/v1'), 'openmlAssistant.openRouter.baseUrl');
	const apiKey = requireValue(await getProviderSecret('openrouter'), 'OpenRouter API key');
	const model = requireValue(getString('openRouter.model'), 'openmlAssistant.openRouter.model');
	const extraHeaders = {
		'HTTP-Referer': getString('openRouter.siteUrl', 'https://openml-code.local'),
		'X-Title': getString('openRouter.appName', 'OpenML Code')
	};
	const hasBinaryAttachments = (input.attachments ?? []).length > 0;

	if (!hasBinaryAttachments) {
		return streamOpenAICompatible(baseUrl, model, input, callbacks, apiKey, extraHeaders, {
			temperature: 0.2,
			maxTokens: getNumber('openRouter.maxOutputTokens', DEFAULT_COMPATIBLE_MAX_OUTPUT_TOKENS)
		});
	}

	const response = await postStream(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
		model,
		stream: true,
		messages: [{
			role: 'user',
			content: [
				{ type: 'text', text: createUserPrompt(input) },
				...(input.attachments ?? [])
					.filter(attachment => attachment.kind === 'image')
					.map(attachment => ({
						type: 'image_url',
						image_url: {
							url: `data:${attachment.mimeType};base64,${attachment.base64Data ?? ''}`
						}
					})),
				...(input.attachments ?? [])
					.filter(attachment => attachment.kind === 'pdf')
					.map(attachment => ({
						type: 'file',
						file: {
							filename: attachment.name,
							file_data: `data:${attachment.mimeType};base64,${attachment.base64Data ?? ''}`
						}
					}))
			]
		}],
		temperature: 0.2,
		max_tokens: getNumber('openRouter.maxOutputTokens', DEFAULT_COMPATIBLE_MAX_OUTPUT_TOKENS)
	}, {
		headers: buildHeaders(apiKey, extraHeaders)
	});

	const text = await readSseStream(response, json => {
		const delta = json?.choices?.[0]?.delta?.content;
		if (typeof delta === 'string' && delta) {
			callbacks.onDelta(delta);
			return delta;
		}
		return undefined;
	});

	const result = { text, model };
	callbacks.onComplete?.(result);
	return result;
}

async function callGemini(input: WorkspacePrompt): Promise<ProviderResponse> {
	const baseUrl = requireValue(getString('gemini.baseUrl', 'https://generativelanguage.googleapis.com/v1beta'), 'openmlAssistant.gemini.baseUrl');
	const apiKey = requireValue(await getProviderSecret('gemini'), 'Gemini API key');
	const model = requireValue(getString('gemini.model'), 'openmlAssistant.gemini.model');
	const parts = [
		{ text: createUserPrompt(input) },
		...(input.attachments ?? [])
			.filter(attachment => attachment.kind === 'image' || attachment.kind === 'pdf')
			.map(attachment => ({
				inline_data: {
					mime_type: attachment.mimeType,
					data: attachment.base64Data ?? ''
				}
			}))
	];
	const json = await postJson(`${baseUrl.replace(/\/$/, '')}/models/${encodeURIComponent(model)}:generateContent`, {
		systemInstruction: { parts: [{ text: input.systemPrompt }] },
		contents: [{ role: 'user', parts }],
		generationConfig: { temperature: 0.2, maxOutputTokens: getNumber('gemini.maxOutputTokens', DEFAULT_GEMINI_MAX_OUTPUT_TOKENS) }
	}, {
		headers: {
			'Content-Type': 'application/json',
			'x-goog-api-key': apiKey
		}
	});

	const text = json?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('\n').trim();
	if (!text) {
		throw new Error('Gemini response did not include content.');
	}

	return { text, model };
}

export async function listAvailableModels(provider = getActiveProvider()): Promise<string[]> {
	try {
		switch (provider) {
			case 'ollama': {
				const baseUrl = requireValue(getString('ollama.baseUrl', 'http://127.0.0.1:11434'), 'openmlAssistant.ollama.baseUrl');
				const json = await getJson(`${baseUrl.replace(/\/$/, '')}/api/tags`);
				return (json?.models ?? []).map((model: { name?: string }) => model.name ?? '').filter(Boolean);
			}
			case 'lmstudio': {
				const baseUrl = requireValue(getString('lmStudio.baseUrl', 'http://127.0.0.1:1234/v1'), 'openmlAssistant.lmStudio.baseUrl');
				const json = await getJson(`${baseUrl.replace(/\/$/, '')}/models`);
				return (json?.data ?? []).map((model: { id?: string }) => model.id ?? '').filter(Boolean);
			}
			case 'openai': {
				const baseUrl = requireValue(getString('openai.baseUrl', 'https://api.openai.com/v1'), 'openmlAssistant.openai.baseUrl');
				const apiKey = requireValue(await getProviderSecret('openai'), 'OpenAI API key');
				const json = await getJson(`${baseUrl.replace(/\/$/, '')}/models`, {
					Authorization: `Bearer ${apiKey}`
				});
				return (json?.data ?? [])
					.map((model: { id?: string }) => model.id ?? '')
					.filter((modelId: string) => !!modelId && isAllowedOpenAIModel(modelId))
					.sort((a: string, b: string) => a.localeCompare(b));
			}
			case 'anthropic': {
				const baseUrl = requireValue(getString('anthropic.baseUrl', 'https://api.anthropic.com/v1'), 'openmlAssistant.anthropic.baseUrl');
				const apiKey = requireValue(await getProviderSecret('anthropic'), 'Anthropic API key');
				const json = await getJson(buildAnthropicModelsUrl(baseUrl), {
					'x-api-key': apiKey,
					'anthropic-version': '2023-06-01'
				});
				return (json?.data ?? []).map((model: { id?: string; display_name?: string }) => model.id ?? model.display_name ?? '').filter(Boolean);
			}
			default:
				return [];
		}
	} catch {
		return [];
	}
}

export async function syncLocalModelSelection(provider = getActiveProvider()): Promise<string[]> {
	const models = await listAvailableModels(provider);
	if (!models.length) {
		return [];
	}

	const current = getCurrentModelLabel(provider);
	if (!current || !models.includes(current)) {
		await setModelForProvider(provider, models[0]);
	}

	return models;
}

export async function requestAssistantResponse(input: WorkspacePrompt): Promise<ProviderResponse> {
	let text = '';
	let model = getCurrentModelLabel(getActiveProvider()) || 'unknown';
	const result = await streamAssistantResponse(input, {
		onDelta: chunk => {
			text += chunk;
		},
		onComplete: value => {
			model = value.model;
			text = value.text;
		}
	});

	return result ?? { text, model };
}

export async function streamAssistantResponse(input: WorkspacePrompt, callbacks: StreamCallbacks): Promise<ProviderResponse> {
	const provider = getActiveProvider();
	const enrichedInput: WorkspacePrompt = {
		...input,
		extraContext: await buildDeepContext(input.prompt, input.activeFileName, input.selectedText, input.mode)
	};
	assertProviderSupportsAttachments(provider, enrichedInput);

	try {
		switch (provider) {
			case 'ollama': {
				const baseUrl = requireValue(getString('ollama.baseUrl', 'http://127.0.0.1:11434'), 'openmlAssistant.ollama.baseUrl');
				const model = requireValue(getString('ollama.model', 'llama3.2'), 'openmlAssistant.ollama.model');
				const response = await postStream(`${baseUrl.replace(/\/$/, '')}/api/chat`, {
					model,
					stream: true,
					messages: [
						{ role: 'system', content: enrichedInput.systemPrompt },
						{ role: 'user', content: createUserPrompt(enrichedInput) }
					],
					options: {
						temperature: 0.2,
						num_predict: getNumber('ollama.maxOutputTokens', DEFAULT_COMPATIBLE_MAX_OUTPUT_TOKENS)
					}
				});
				const text = await readNdjsonStream(response, json => {
					const delta = json?.message?.content;
					if (typeof delta === 'string' && delta) {
						callbacks.onDelta(delta);
						return delta;
					}
					return undefined;
				});
				const result = { text, model };
				callbacks.onComplete?.(result);
				return result;
			}
			case 'lmstudio': {
				const baseUrl = requireValue(getString('lmStudio.baseUrl', 'http://127.0.0.1:1234/v1'), 'openmlAssistant.lmStudio.baseUrl');
				const model = requireValue(getString('lmStudio.model', 'local-model'), 'openmlAssistant.lmStudio.model');
				return streamOpenAICompatible(baseUrl, model, enrichedInput, callbacks, undefined, undefined, {
					temperature: 0.2,
					maxTokens: getNumber('lmStudio.maxOutputTokens', DEFAULT_COMPATIBLE_MAX_OUTPUT_TOKENS)
				});
			}
			case 'openai': {
				const model = normalizeOpenAIModel(requireValue(getString('openai.model'), 'openmlAssistant.openai.model'));
				const hasBinaryAttachments = (enrichedInput.attachments ?? []).length > 0;
				if (hasBinaryAttachments || usesOpenAIResponsesApi(model)) {
					const result = await callOpenAIResponses(enrichedInput);
					callbacks.onDelta(result.text);
					callbacks.onComplete?.(result);
					return result;
				}

				const baseUrl = requireValue(getString('openai.baseUrl', 'https://api.openai.com/v1'), 'openmlAssistant.openai.baseUrl');
				const apiKey = requireValue(await getProviderSecret('openai'), 'OpenAI API key');
				return streamOpenAICompatible(baseUrl, model, enrichedInput, callbacks, apiKey, undefined, {
					maxTokens: getNumber('openai.maxOutputTokens', DEFAULT_COMPATIBLE_MAX_OUTPUT_TOKENS)
				});
			}
			case 'gemini': {
				const result = await callGemini(enrichedInput);
				callbacks.onDelta(result.text);
				callbacks.onComplete?.(result);
				return result;
			}
			case 'anthropic': {
				const baseUrl = requireValue(getString('anthropic.baseUrl', 'https://api.anthropic.com/v1'), 'openmlAssistant.anthropic.baseUrl');
				const apiKey = requireValue(await getProviderSecret('anthropic'), 'Anthropic API key');
				const model = requireValue(getString('anthropic.model'), 'openmlAssistant.anthropic.model');
				const url = buildAnthropicMessagesUrl(baseUrl);
				const headers = {
					'Content-Type': 'application/json',
					'x-api-key': apiKey,
					'anthropic-version': '2023-06-01'
				};
				const body = {
					model,
					max_tokens: getNumber('anthropic.maxOutputTokens', DEFAULT_ANTHROPIC_MAX_OUTPUT_TOKENS),
					stream: true,
					system: enrichedInput.systemPrompt,
					messages: [{
						role: 'user',
						content: [
							{ type: 'text', text: createUserPrompt(enrichedInput) },
							...(enrichedInput.attachments ?? [])
								.filter(attachment => attachment.kind === 'image')
								.map(attachment => ({
									type: 'image',
									source: {
										type: 'base64',
										media_type: attachment.mimeType,
										data: attachment.base64Data ?? ''
									}
								})),
							...(enrichedInput.attachments ?? [])
								.filter(attachment => attachment.kind === 'pdf')
								.map(attachment => ({
									type: 'document',
									source: {
										type: 'base64',
										media_type: attachment.mimeType,
										data: attachment.base64Data ?? ''
									}
								}))
						]
					}]
				};
				const response = await postStream(url, body, { headers });
				let text = await readSseStream(response, json => {
					if (json?.type === 'error') {
						throw new Error(json?.error?.message ?? 'Anthropic streaming request failed.');
					}
					const delta = json?.type === 'content_block_delta' && json?.delta?.type === 'text_delta'
						? json?.delta?.text
						: undefined;
					if (typeof delta === 'string' && delta) {
						callbacks.onDelta(delta);
						return delta;
					}
					return undefined;
				});
				if (!text.trim()) {
					const fallback = await postJson(url, {
						...body,
						stream: false
					}, { headers });
					text = extractAnthropicText(fallback);
					if (!text) {
						throw new Error('Anthropic response did not include visible text content.');
					}
					callbacks.onDelta(text);
				}
				const result = { text, model };
				callbacks.onComplete?.(result);
				return result;
			}
			case 'openrouter': {
				return streamOpenRouter(enrichedInput, callbacks);
			}
			case 'azurefoundry': {
				const result = await callAzureFoundry(enrichedInput);
				callbacks.onDelta(result.text);
				callbacks.onComplete?.(result);
				return result;
			}
			default:
				throw new Error(`Unsupported provider: ${provider satisfies never}`);
		}
	} catch (error) {
		normalizeAttachmentError(enrichedInput, error);
	}
}




