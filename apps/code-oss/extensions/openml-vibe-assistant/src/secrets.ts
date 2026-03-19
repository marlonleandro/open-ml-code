import * as vscode from 'vscode';

type SecretProviderId = 'openai' | 'gemini' | 'anthropic' | 'openrouter' | 'azurefoundry';

const SECRET_KEYS: Record<SecretProviderId, string> = {
	openai: 'openmlAssistant.openai.apiKey',
	gemini: 'openmlAssistant.gemini.apiKey',
	anthropic: 'openmlAssistant.anthropic.apiKey',
	openrouter: 'openmlAssistant.openRouter.apiKey',
	azurefoundry: 'openmlAssistant.azureFoundry.apiKey'
};

let secretStorage: vscode.SecretStorage | undefined;
let fallbackSecretsDir: vscode.Uri | undefined;
let fallbackSecretsFile: vscode.Uri | undefined;
let fallbackWarningShown = false;

function getConfig(): vscode.WorkspaceConfiguration {
	return vscode.workspace.getConfiguration('openmlAssistant');
}

export function initializeSecretStorage(storage: vscode.SecretStorage, globalStorageUri?: vscode.Uri): void {
	secretStorage = storage;
	fallbackSecretsDir = globalStorageUri;
	fallbackSecretsFile = globalStorageUri ? vscode.Uri.joinPath(globalStorageUri, 'openml-assistant-secrets.json') : undefined;
}

function requireSecretStorage(): vscode.SecretStorage {
	if (!secretStorage) {
		throw new Error('Secret storage is not initialized.');
	}

	return secretStorage;
}

async function readFallbackSecrets(): Promise<Partial<Record<SecretProviderId, string>>> {
	if (!fallbackSecretsFile) {
		return {};
	}

	try {
		const content = await vscode.workspace.fs.readFile(fallbackSecretsFile);
		const parsed = JSON.parse(new TextDecoder().decode(content));
		if (!parsed || typeof parsed !== 'object') {
			return {};
		}

		const secrets: Partial<Record<SecretProviderId, string>> = {};
		for (const provider of Object.keys(SECRET_KEYS) as SecretProviderId[]) {
			const value = parsed[provider];
			if (typeof value === 'string' && value.trim()) {
				secrets[provider] = value.trim();
			}
		}

		return secrets;
	} catch {
		return {};
	}
}

async function writeFallbackSecrets(secrets: Partial<Record<SecretProviderId, string>>): Promise<void> {
	if (!fallbackSecretsDir || !fallbackSecretsFile) {
		return;
	}

	await vscode.workspace.fs.createDirectory(fallbackSecretsDir);
	const content = new TextEncoder().encode(JSON.stringify(secrets, null, 2));
	await vscode.workspace.fs.writeFile(fallbackSecretsFile, content);
}

function showFallbackStorageWarning(): void {
	if (fallbackWarningShown) {
		return;
	}

	fallbackWarningShown = true;
	void vscode.window.showWarningMessage('OpenML Assistant is using local fallback storage for API keys because SecretStorage is unavailable in this build.');
}

export async function getProviderSecret(provider: SecretProviderId): Promise<string> {
	try {
		const value = (await requireSecretStorage().get(SECRET_KEYS[provider])) ?? '';
		if (value.trim()) {
			return value.trim();
		}
	} catch {
		// Fall through to file-based fallback storage.
	}

	const fallbackSecrets = await readFallbackSecrets();
	return fallbackSecrets[provider]?.trim() ?? '';
}

export async function setProviderSecret(provider: SecretProviderId, value: string): Promise<void> {
	const trimmed = value.trim();
	let secretStorageAvailable = true;

	try {
		const storage = requireSecretStorage();
		if (!trimmed) {
			await storage.delete(SECRET_KEYS[provider]);
		} else {
			await storage.store(SECRET_KEYS[provider], trimmed);
		}
	} catch {
		secretStorageAvailable = false;
	}

	const fallbackSecrets = await readFallbackSecrets();
	if (!trimmed) {
		delete fallbackSecrets[provider];
	} else {
		fallbackSecrets[provider] = trimmed;
	}
	await writeFallbackSecrets(fallbackSecrets);

	if (!secretStorageAvailable && trimmed) {
		showFallbackStorageWarning();
	}
}

export async function migrateLegacySecrets(): Promise<void> {
	const migrations: Array<{ provider: SecretProviderId; configKey: string }> = [
		{ provider: 'openai', configKey: 'openai.apiKey' },
		{ provider: 'gemini', configKey: 'gemini.apiKey' },
		{ provider: 'anthropic', configKey: 'anthropic.apiKey' },
		{ provider: 'openrouter', configKey: 'openRouter.apiKey' },
		{ provider: 'azurefoundry', configKey: 'azureFoundry.apiKey' }
	];

	for (const item of migrations) {
		const currentSecret = await getProviderSecret(item.provider);
		if (currentSecret) {
			continue;
		}

		const legacyValue = getConfig().get<string>(item.configKey, '').trim();
		if (!legacyValue) {
			continue;
		}

		await setProviderSecret(item.provider, legacyValue);
		await getConfig().update(item.configKey, '', vscode.ConfigurationTarget.Global);
	}
}

export async function promptForProviderSecret(provider: SecretProviderId): Promise<boolean> {
	const labels: Record<SecretProviderId, string> = {
		openai: 'OpenAI',
		gemini: 'Gemini',
		anthropic: 'Anthropic',
		openrouter: 'OpenRouter',
		azurefoundry: 'Azure Foundry'
	};

	const value = await vscode.window.showInputBox({
		prompt: `Enter the API key for ${labels[provider]}`,
		password: true,
		ignoreFocusOut: true,
		placeHolder: 'Paste the API key here'
	});

	if (typeof value !== 'string') {
		return false;
	}

	await setProviderSecret(provider, value);
	return !!value.trim();
}
