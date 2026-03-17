import * as vscode from 'vscode';

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

type ProviderResponse = {
	text: string;
	model: string;
};

function getConfig() {
	return vscode.workspace.getConfiguration('openmlAssistant');
}

export function getActiveProvider(): ProviderId {
	return getConfig().get<ProviderId>('provider', 'ollama');
}

export async function setActiveProvider(provider: ProviderId): Promise<void> {
	await getConfig().update('provider', provider, vscode.ConfigurationTarget.Global);
}

function getString(path: string, fallback = ''): string {
	return getConfig().get<string>(path, fallback).trim();
}

function getNumber(path: string, fallback: number): number {
	return getConfig().get<number>(path, fallback);
}

export function getSystemPrompt(): string {
	return getString('systemPrompt', 'You are OpenML Code Assistant. Produce practical implementation plans with concrete files, steps, and risks. Prefer concise, developer-focused answers.');
}

export function getCurrentModelLabel(provider = getActiveProvider()): string {
	switch (provider) {
		case 'ollama':
			return getString('ollama.model', 'llama3.2');
		case 'lmstudio':
			return getString('lmStudio.model', 'local-model');
		case 'openai':
			return getString('openai.model');
		case 'gemini':
			return getString('gemini.model');
		case 'anthropic':
			return getString('anthropic.model');
		case 'openrouter':
			return getString('openRouter.model');
	}
}

export function isLocalProvider(provider = getActiveProvider()): boolean {
	return provider === 'ollama' || provider === 'lmstudio';
}

function getTimeout(): number {
	return getNumber('requestTimeoutMs', 120000);
}

function getModeInstructions(mode: AssistantMode): string[] {
	switch (mode) {
		case 'ask':
			return [
				'Answer the developer question directly in Markdown.',
				'The response should include:',
				'1. A concise answer.',
				'2. Relevant technical reasoning.',
				'3. Suggested next steps when useful.'
			];
		case 'edit':
			return [
				'Produce an implementation-oriented editing response in Markdown.',
				'The response should include:',
				'1. What should change.',
				'2. Concrete file-level suggestions.',
				'3. Risks, edge cases, or tests to add.'
			];
		case 'plan':
			return [
				'Create a practical implementation plan in Markdown.',
				'The response must include:',
				'1. A short summary.',
				'2. A numbered implementation plan.',
				'3. Suggested files to modify or create.',
				'4. Risks or assumptions.'
			];
		case 'agent':
		default:
			return [
				'Act like a coding agent helping inside an IDE and respond in Markdown.',
				'The response should include:',
				'1. The best immediate approach.',
				'2. Concrete next actions.',
				'3. Files, commands, or checks that matter.',
				'4. Risks or assumptions when relevant.'
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

function buildHeaders(apiKey?: string, extraHeaders?: Record<string, string>): Record<string, string> {
	return {
		'Content-Type': 'application/json',
		...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
		...(extraHeaders ?? {})
	};
}

async function postJson(url: string, body: unknown, init: RequestInit = {}): Promise<any> {
	const response = await fetch(url, {
		method: 'POST',
		...init,
		body: JSON.stringify(body),
		signal: AbortSignal.timeout(getTimeout())
	});

	if (!response.ok) {
		const details = await response.text();
		throw new Error(`Request failed (${response.status}): ${details}`);
	}

	return response.json();
}

function requireValue(value: string, label: string): string {
	if (!value) {
		throw new Error(`Missing configuration: ${label}`);
	}

	return value;
}

async function callOpenAICompatible(baseUrl: string, model: string, input: WorkspacePrompt, apiKey?: string, extraHeaders?: Record<string, string>): Promise<ProviderResponse> {
	const payload = {
		model,
		messages: [
			{ role: 'system', content: input.systemPrompt },
			{ role: 'user', content: createUserPrompt(input) }
		],
		temperature: 0.2
	};

	const json = await postJson(`${baseUrl.replace(/\/$/, '')}/chat/completions`, payload, {
		headers: buildHeaders(apiKey, extraHeaders)
	});

	const text = json?.choices?.[0]?.message?.content;
	if (!text) {
		throw new Error('Provider response did not include message content.');
	}

	return { text, model };
}

async function callOllama(input: WorkspacePrompt): Promise<ProviderResponse> {
	const baseUrl = requireValue(getString('ollama.baseUrl', 'http://127.0.0.1:11434'), 'openmlAssistant.ollama.baseUrl');
	const model = requireValue(getString('ollama.model', 'llama3.2'), 'openmlAssistant.ollama.model');

	const json = await postJson(`${baseUrl.replace(/\/$/, '')}/api/chat`, {
		model,
		stream: false,
		messages: [
			{ role: 'system', content: input.systemPrompt },
			{ role: 'user', content: createUserPrompt(input) }
		],
		options: {
			temperature: 0.2
		}
	});

	const text = json?.message?.content;
	if (!text) {
		throw new Error('Ollama response did not include message content.');
	}

	return { text, model };
}

async function callLmStudio(input: WorkspacePrompt): Promise<ProviderResponse> {
	const baseUrl = requireValue(getString('lmStudio.baseUrl', 'http://127.0.0.1:1234/v1'), 'openmlAssistant.lmStudio.baseUrl');
	const model = requireValue(getString('lmStudio.model', 'local-model'), 'openmlAssistant.lmStudio.model');
	return callOpenAICompatible(baseUrl, model, input);
}

async function callOpenAI(input: WorkspacePrompt): Promise<ProviderResponse> {
	const baseUrl = requireValue(getString('openai.baseUrl', 'https://api.openai.com/v1'), 'openmlAssistant.openai.baseUrl');
	const apiKey = requireValue(getString('openai.apiKey'), 'openmlAssistant.openai.apiKey');
	const model = requireValue(getString('openai.model'), 'openmlAssistant.openai.model');
	return callOpenAICompatible(baseUrl, model, input, apiKey);
}

async function callOpenRouter(input: WorkspacePrompt): Promise<ProviderResponse> {
	const baseUrl = requireValue(getString('openRouter.baseUrl', 'https://openrouter.ai/api/v1'), 'openmlAssistant.openRouter.baseUrl');
	const apiKey = requireValue(getString('openRouter.apiKey'), 'openmlAssistant.openRouter.apiKey');
	const model = requireValue(getString('openRouter.model'), 'openmlAssistant.openRouter.model');
	const appName = getString('openRouter.appName', 'OpenML Code');
	const siteUrl = getString('openRouter.siteUrl');

	const extraHeaders: Record<string, string> = {
		'HTTP-Referer': siteUrl || 'https://openml-code.local',
		'X-Title': appName
	};

	return callOpenAICompatible(baseUrl, model, input, apiKey, extraHeaders);
}

async function callGemini(input: WorkspacePrompt): Promise<ProviderResponse> {
	const baseUrl = requireValue(getString('gemini.baseUrl', 'https://generativelanguage.googleapis.com/v1beta'), 'openmlAssistant.gemini.baseUrl');
	const apiKey = requireValue(getString('gemini.apiKey'), 'openmlAssistant.gemini.apiKey');
	const model = requireValue(getString('gemini.model'), 'openmlAssistant.gemini.model');

	const json = await postJson(`${baseUrl.replace(/\/$/, '')}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
		systemInstruction: {
			parts: [{ text: input.systemPrompt }]
		},
		contents: [
			{
				role: 'user',
				parts: [{ text: createUserPrompt(input) }]
			}
		],
		generationConfig: {
			temperature: 0.2
		}
	}, {
		headers: {
			'Content-Type': 'application/json'
		}
	});

	const text = json?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('\n').trim();
	if (!text) {
		throw new Error('Gemini response did not include content.');
	}

	return { text, model };
}

async function callAnthropic(input: WorkspacePrompt): Promise<ProviderResponse> {
	const baseUrl = requireValue(getString('anthropic.baseUrl', 'https://api.anthropic.com/v1'), 'openmlAssistant.anthropic.baseUrl');
	const apiKey = requireValue(getString('anthropic.apiKey'), 'openmlAssistant.anthropic.apiKey');
	const model = requireValue(getString('anthropic.model'), 'openmlAssistant.anthropic.model');

	const json = await postJson(`${baseUrl.replace(/\/$/, '')}/messages`, {
		model,
		max_tokens: 1800,
		system: input.systemPrompt,
		messages: [
			{
				role: 'user',
				content: createUserPrompt(input)
			}
		]
	}, {
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
			'anthropic-version': '2023-06-01'
		}
	});

	const text = json?.content?.map((item: { type?: string; text?: string }) => item.type === 'text' ? item.text ?? '' : '').join('\n').trim();
	if (!text) {
		throw new Error('Anthropic response did not include content.');
	}

	return { text, model };
}

export async function requestAssistantResponse(input: WorkspacePrompt): Promise<ProviderResponse> {
	const provider = getActiveProvider();

	switch (provider) {
		case 'ollama':
			return callOllama(input);
		case 'lmstudio':
			return callLmStudio(input);
		case 'openai':
			return callOpenAI(input);
		case 'gemini':
			return callGemini(input);
		case 'anthropic':
			return callAnthropic(input);
		case 'openrouter':
			return callOpenRouter(input);
		default:
			throw new Error(`Unsupported provider: ${provider satisfies never}`);
	}
}

export function providerDisplayName(provider: ProviderId): string {
	switch (provider) {
		case 'ollama':
			return 'Ollama';
		case 'lmstudio':
			return 'LM Studio';
		case 'openai':
			return 'OpenAI';
		case 'gemini':
			return 'Gemini';
		case 'anthropic':
			return 'Anthropic';
		case 'openrouter':
			return 'OpenRouter';
	}
}

export const providerOptions: ProviderId[] = ['ollama', 'lmstudio', 'openai', 'gemini', 'anthropic', 'openrouter'];
export const assistantModes: AssistantMode[] = ['agent', 'ask', 'edit', 'plan'];
