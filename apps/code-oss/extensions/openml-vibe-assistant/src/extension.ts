import * as vscode from 'vscode';
import { rebuildSemanticIndex } from './context';
import { initializeWorkspaceMemory, rememberProjectNote, addWorkspaceRule } from './memory';
import { getActiveProvider, providerDisplayName, providerOptions, setActiveProvider } from './providers';
import { OpenMLAssistantViewProvider } from './panel';
import { initializeSecretStorage, migrateLegacySecrets, promptForProviderSecret } from './secrets';

const remoteProviders = [
	{ label: 'OpenAI', provider: 'openai' as const },
	{ label: 'Gemini', provider: 'gemini' as const },
	{ label: 'Anthropic', provider: 'anthropic' as const },
	{ label: 'OpenRouter', provider: 'openrouter' as const },
	{ label: 'Azure Foundry', provider: 'azurefoundry' as const }
];

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	initializeSecretStorage(context.secrets);
	initializeWorkspaceMemory(context.workspaceState);
	await migrateLegacySecrets();

	const provider = new OpenMLAssistantViewProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(OpenMLAssistantViewProvider.viewId, provider, {
			webviewOptions: {
				retainContextWhenHidden: true
			}
		}),
		provider
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('openmlAssistant.openChat', async () => {
			await provider.show();
		}),
		vscode.commands.registerCommand('openmlAssistant.editWithPreview', async () => {
			const editor = vscode.window.activeTextEditor;
			const prompt = await vscode.window.showInputBox({
				prompt: 'Describe the code change you want to make',
				placeHolder: editor?.document.fileName
					? `Example: Refactor ${editor.document.fileName} and suggest tests`
					: 'Example: Implement assisted multi-file edits with suggested tests'
			});

			if (!prompt) {
				return;
			}

			await provider.show(prompt, 'edit');
		}),
		vscode.commands.registerCommand('openmlAssistant.generatePlan', async () => {
			const prompt = await vscode.window.showInputBox({
				prompt: 'Describe the feature, task, or problem to solve',
				placeHolder: 'Example: Add local-first file tools for Ollama and LM Studio'
			});

			if (!prompt) {
				return;
			}

			await provider.show(prompt, 'plan');
		}),
		vscode.commands.registerCommand('openmlAssistant.selectProvider', async () => {
			const current = getActiveProvider();
			const selected = await vscode.window.showQuickPick(
				providerOptions.map(item => ({
					label: providerDisplayName(item),
					description: item === current ? 'Current' : undefined,
					provider: item
				})),
				{ placeHolder: 'Select the provider for OpenML Assistant' }
			);

			if (!selected) {
				return;
			}

			await setActiveProvider(selected.provider);
			await provider.refresh();
			void vscode.window.showInformationMessage(`OpenML Assistant now uses ${selected.label}.`);
		}),
		vscode.commands.registerCommand('openmlAssistant.openSettings', async () => {
			await vscode.commands.executeCommand('workbench.action.openSettings', '@ext:openml.openml-vibe-assistant openmlAssistant');
		}),
		vscode.commands.registerCommand('openmlAssistant.manageApiKeys', async () => {
			const selected = await vscode.window.showQuickPick(remoteProviders, {
				placeHolder: 'Choose the provider whose API key you want to store securely'
			});

			if (!selected) {
				return;
			}

			const saved = await promptForProviderSecret(selected.provider);
			if (saved) {
				void vscode.window.showInformationMessage(`${selected.label} API key saved in SecretStorage.`);
			}
		}),
		vscode.commands.registerCommand('openmlAssistant.rebuildIndex', async () => {
			const chunks = await rebuildSemanticIndex();
			void vscode.window.showInformationMessage(`OpenML Assistant rebuilt the semantic index with ${chunks} chunks.`);
		}),
		vscode.commands.registerCommand('openmlAssistant.rememberProjectNote', async () => {
			const note = await vscode.window.showInputBox({
				prompt: 'Store a persistent project memory note for this workspace',
				placeHolder: 'Example: Prefer repository pattern in data access modules'
			});

			if (!note?.trim()) {
				return;
			}

			await rememberProjectNote(note);
			void vscode.window.showInformationMessage('OpenML Assistant saved the project memory note.');
		}),
		vscode.commands.registerCommand('openmlAssistant.addWorkspaceRule', async () => {
			const rule = await vscode.window.showInputBox({
				prompt: 'Add a persistent workspace rule for the assistant',
				placeHolder: 'Example: Do not introduce breaking API changes without tests'
			});

			if (!rule?.trim()) {
				return;
			}

			await addWorkspaceRule(rule);
			void vscode.window.showInformationMessage('OpenML Assistant saved the workspace rule.');
		})
	);

	void rebuildSemanticIndex().then(chunks => {
		void provider.refresh();
		void vscode.window.setStatusBarMessage(`OpenML Assistant indexed ${chunks} chunks for deep context.`, 4000);
	}, () => undefined);
}

export function deactivate(): void {}
