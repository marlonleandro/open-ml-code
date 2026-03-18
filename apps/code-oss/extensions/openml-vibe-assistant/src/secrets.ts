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

function getConfig(): vscode.WorkspaceConfiguration {
	return vscode.workspace.getConfiguration('openmlAssistant');
}

export function initializeSecretStorage(storage: vscode.SecretStorage): void {
	secretStorage = storage;
}

function requireSecretStorage(): vscode.SecretStorage {
	if (!secretStorage) {
		throw new Error('Secret storage is not initialized.');
	}

	return secretStorage;
}

export async function getProviderSecret(provider: SecretProviderId): Promise<string> {
	return (await requireSecretStorage().get(SECRET_KEYS[provider])) ?? '';
}

export async function setProviderSecret(provider: SecretProviderId, value: string): Promise<void> {
	const storage = requireSecretStorage();
	const key = SECRET_KEYS[provider];
	const trimmed = value.trim();

	if (!trimmed) {
		await storage.delete(key);
		return;
	}

	await storage.store(key, trimmed);
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
