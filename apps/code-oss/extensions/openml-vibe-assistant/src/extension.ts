import * as vscode from 'vscode';
import { getActiveProvider, providerDisplayName, providerOptions, setActiveProvider } from './providers';
import { OpenMLAssistantViewProvider } from './panel';

export function activate(context: vscode.ExtensionContext): void {
	const provider = new OpenMLAssistantViewProvider();
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
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('openmlAssistant.selectProvider', async () => {
			const current = getActiveProvider();
			const selected = await vscode.window.showQuickPick(
				providerOptions.map(item => ({
					label: providerDisplayName(item),
					description: item === current ? 'Current' : undefined,
					provider: item
				})),
				{
					placeHolder: 'Select the provider for OpenML Assistant'
				}
			);

			if (!selected) {
				return;
			}

			await setActiveProvider(selected.provider);
			await provider.refresh();
			void vscode.window.showInformationMessage(`OpenML Assistant now uses ${selected.label}.`);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('openmlAssistant.openSettings', async () => {
			await vscode.commands.executeCommand('workbench.action.openSettings', '@ext:openml.openml-vibe-assistant openmlAssistant');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('openmlAssistant.generatePlan', async () => {
			const prompt = await vscode.window.showInputBox({
				prompt: 'Describe the feature, task, or problem to solve',
				placeHolder: 'Example: Add local-first file tools for Ollama and LM Studio'
			});

			if (!prompt) {
				return;
			}

			await provider.show(prompt, 'plan');
		})
	);
}

export function deactivate(): void {}


