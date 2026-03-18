import * as vscode from 'vscode';
import { getProviderSecret } from './secrets';

export type ProviderId = 'ollama' | 'lmstudio' | 'openai' | 'gemini' | 'anthropic' | 'openrouter';
export type AssistantMode = 'agent' | 'ask' | 'edit' | 'plan';

export interface WorkspacePrompt {
	prompt: string;
	workspaceName: string;
	activeFileName?: string;
	selectedText?: string;
	systemPrompt: string;
	mode?: AssistantMode;
}

export type ProviderResponse = {
	text: string;
	model: string;
};

export type StreamCallbacks = {
	onDelta: (chunk: string) => void;
	onComplete?: (result: ProviderResponse) => void;
};

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
	return getNumber('requestTimeoutMs', 120000);
}

function requireValue(value: string, label: string): string {
	if (!value) {
		throw new Error(`Missing configuration: ${label}`);
	}

	return value;
}

function buildHeaders(apiKey?: string, extraHeaders?: Record<string, string>): Record<string, string> {
	return {
		'Content-Type': 'application/json',
		...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
		...(extraHeaders ?? {})
	};
}

async function getJson(url: string, headers?: Record<string, string>): Promise<any> {
	const response = await fetch(url, {
		method: 'GET',
		headers,
		signal: AbortSignal.timeout(getTimeout())
	});

	if (!response.ok) {
		throw new Error(`Request failed (${response.status}): ${await response.text()}`);
	}

	return response.json();
}

async function postJson(url: string, body: unknown, init: RequestInit = {}): Promise<any> {
	const response = await fetch(url, {
		method: 'POST',
		...init,
		body: JSON.stringify(body),
		signal: AbortSignal.timeout(getTimeout())
	});

	if (!response.ok) {
		throw new Error(`Request failed (${response.status}): ${await response.text()}`);
	}

	return response.json();
}

async function postStream(url: string, body: unknown, init: RequestInit = {}): Promise<Response> {
	const response = await fetch(url, {
		method: 'POST',
		...init,
		body: JSON.stringify(body),
		signal: AbortSignal.timeout(getTimeout())
	});

	if (!response.ok) {
		throw new Error(`Request failed (${response.status}): ${await response.text()}`);
	}

	return response;
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
				'Before the openml-edit block, explain the change, affected files, and any risks in Markdown.'
			];
		case 'plan':
			return ['Create a practical implementation plan in Markdown with files, risks, and steps.'];
		case 'agent':
		default:
			return [
				'Act like a coding agent helping inside an IDE and respond in Markdown.',
				'If the request clearly requires code edits, you may include a final ```openml-edit code block with strict JSON using full file contents for each changed file.'
			];
	}
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
		'',
		'User request:',
		input.prompt,
		'',
		'Workspace context:',
		...contextLines
	].join('\n');
}

async function readSseStream(response: Response, onEvent: (json: any) => string | undefined): Promise<string> {
	const reader = response.body?.getReader();
	if (!reader) {
		throw new Error('Streaming response body is not available.');
	}

	const decoder = new TextDecoder();
	let buffer = '';
	let text = '';

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
}

async function readNdjsonStream(response: Response, onEvent: (json: any) => string | undefined): Promise<string> {
	const reader = response.body?.getReader();
	if (!reader) {
		throw new Error('Streaming response body is not available.');
	}

	const decoder = new TextDecoder();
	let buffer = '';
	let text = '';

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
}

function getModelConfigPath(provider: ProviderId): string {
	switch (provider) {
		case 'ollama': return 'ollama.model';
		case 'lmstudio': return 'lmStudio.model';
		case 'openai': return 'openai.model';
		case 'gemini': return 'gemini.model';
		case 'anthropic': return 'anthropic.model';
		case 'openrouter': return 'openRouter.model';
	}
}

function normalizeOpenAIModel(model: string): string {
	switch (model.trim()) {
		case 'gpt-5.4': return 'gpt-5';
		case 'gpt-5.4-mini': return 'gpt-5-mini';
		default: return model.trim();
	}
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
	return getString('systemPrompt', 'You are OpenML Code Assistant. Produce practical implementation plans with concrete files, steps, risks, and tests. When working in edit mode, prefer responses that can be previewed and applied safely inside the IDE.');
}

export function getCurrentModelLabel(provider = getActiveProvider()): string {
	switch (provider) {
		case 'ollama': return getString('ollama.model', 'llama3.2');
		case 'lmstudio': return getString('lmStudio.model', 'local-model');
		case 'openai': return getString('openai.model');
		case 'gemini': return getString('gemini.model');
		case 'anthropic': return getString('anthropic.model');
		case 'openrouter': return getString('openRouter.model');
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
	}
}

export const providerOptions: ProviderId[] = ['ollama', 'lmstudio', 'openai', 'gemini', 'anthropic', 'openrouter'];
export const assistantModes: AssistantMode[] = ['agent', 'ask', 'edit', 'plan'];

async function streamOpenAICompatible(baseUrl: string, model: string, input: WorkspacePrompt, callbacks: StreamCallbacks, apiKey?: string, extraHeaders?: Record<string, string>, options?: { temperature?: number }): Promise<ProviderResponse> {
	const response = await postStream(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
		model,
		stream: true,
		messages: [
			{ role: 'system', content: input.systemPrompt },
			{ role: 'user', content: createUserPrompt(input) }
		],
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

async function callGemini(input: WorkspacePrompt): Promise<ProviderResponse> {
	const baseUrl = requireValue(getString('gemini.baseUrl', 'https://generativelanguage.googleapis.com/v1beta'), 'openmlAssistant.gemini.baseUrl');
	const apiKey = requireValue(await getProviderSecret('gemini'), 'Gemini API key');
	const model = requireValue(getString('gemini.model'), 'openmlAssistant.gemini.model');
	const json = await postJson(`${baseUrl.replace(/\/$/, '')}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
		systemInstruction: { parts: [{ text: input.systemPrompt }] },
		contents: [{ role: 'user', parts: [{ text: createUserPrompt(input) }] }],
		generationConfig: { temperature: 0.2 }
	}, {
		headers: { 'Content-Type': 'application/json' }
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

	switch (provider) {
		case 'ollama': {
			const baseUrl = requireValue(getString('ollama.baseUrl', 'http://127.0.0.1:11434'), 'openmlAssistant.ollama.baseUrl');
			const model = requireValue(getString('ollama.model', 'llama3.2'), 'openmlAssistant.ollama.model');
			const response = await postStream(`${baseUrl.replace(/\/$/, '')}/api/chat`, {
				model,
				stream: true,
				messages: [
					{ role: 'system', content: input.systemPrompt },
					{ role: 'user', content: createUserPrompt(input) }
				],
				options: { temperature: 0.2 }
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
			return streamOpenAICompatible(baseUrl, model, input, callbacks, undefined, undefined, { temperature: 0.2 });
		}
		case 'openai': {
			const baseUrl = requireValue(getString('openai.baseUrl', 'https://api.openai.com/v1'), 'openmlAssistant.openai.baseUrl');
			const apiKey = requireValue(await getProviderSecret('openai'), 'OpenAI API key');
			const model = normalizeOpenAIModel(requireValue(getString('openai.model'), 'openmlAssistant.openai.model'));
			return streamOpenAICompatible(baseUrl, model, input, callbacks, apiKey);
		}
		case 'gemini': {
			const result = await callGemini(input);
			callbacks.onDelta(result.text);
			callbacks.onComplete?.(result);
			return result;
		}
		case 'anthropic': {
			const baseUrl = requireValue(getString('anthropic.baseUrl', 'https://api.anthropic.com/v1'), 'openmlAssistant.anthropic.baseUrl');
			const apiKey = requireValue(await getProviderSecret('anthropic'), 'Anthropic API key');
			const model = requireValue(getString('anthropic.model'), 'openmlAssistant.anthropic.model');
			const response = await postStream(`${baseUrl.replace(/\/$/, '')}/messages`, {
				model,
				max_tokens: 1800,
				stream: true,
				system: input.systemPrompt,
				messages: [{ role: 'user', content: createUserPrompt(input) }]
			}, {
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': apiKey,
					'anthropic-version': '2023-06-01'
				}
			});
			const text = await readSseStream(response, json => {
				const delta = json?.delta?.text;
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
		case 'openrouter': {
			const baseUrl = requireValue(getString('openRouter.baseUrl', 'https://openrouter.ai/api/v1'), 'openmlAssistant.openRouter.baseUrl');
			const apiKey = requireValue(await getProviderSecret('openrouter'), 'OpenRouter API key');
			const model = requireValue(getString('openRouter.model'), 'openmlAssistant.openRouter.model');
			const extraHeaders = {
				'HTTP-Referer': getString('openRouter.siteUrl', 'https://openml-code.local'),
				'X-Title': getString('openRouter.appName', 'OpenML Code')
			};
			return streamOpenAICompatible(baseUrl, model, input, callbacks, apiKey, extraHeaders, { temperature: 0.2 });
		}
		default:
			throw new Error(`Unsupported provider: ${provider satisfies never}`);
	}
}


