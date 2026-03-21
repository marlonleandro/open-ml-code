import * as vscode from 'vscode';

const remoteProviders = [
	{ label: 'OpenAI', provider: 'openai' as const },
	{ label: 'Gemini', provider: 'gemini' as const },
	{ label: 'Anthropic', provider: 'anthropic' as const },
	{ label: 'OpenRouter', provider: 'openrouter' as const },
	{ label: 'Azure Foundry', provider: 'azurefoundry' as const }
];

type AssistantModules = {
	context: typeof import('./context');
	memory: typeof import('./memory');
	providers: typeof import('./providers');
	panel: typeof import('./panel');
	secrets: typeof import('./secrets');
};

type AssistantRuntime = {
	modules: AssistantModules;
	provider: import('./panel').OpenMLAssistantViewProvider;
};

let runtimePromise: Promise<AssistantRuntime> | undefined;
let webviewRegistered = false;

async function loadModules(): Promise<AssistantModules> {
	const [context, memory, providers, panel, secrets] = await Promise.all([
		import('./context'),
		import('./memory'),
		import('./providers'),
		import('./panel'),
		import('./secrets')
	]);

	return { context, memory, providers, panel, secrets };
}

async function ensureAssistant(context: vscode.ExtensionContext): Promise<AssistantRuntime> {
	if (!runtimePromise) {
		runtimePromise = (async () => {
			const modules = await loadModules();

			try {
				modules.secrets.initializeSecretStorage(context.secrets, context.globalStorageUri);
			} catch (error) {
				console.error('[OpenML Assistant] Failed to initialize secret storage.', error);
			}

			try {
				modules.memory.initializeWorkspaceMemory(context.workspaceState);
			} catch (error) {
				console.error('[OpenML Assistant] Failed to initialize workspace memory.', error);
			}

			void modules.secrets.migrateLegacySecrets().catch(error => {
				console.error('[OpenML Assistant] Failed to migrate legacy secrets.', error);
			});

			const provider = new modules.panel.OpenMLAssistantViewProvider(context.extensionUri);
			return { modules, provider };
		})().catch(error => {
			runtimePromise = undefined;
			throw error;
		});
	}

	const runtime = await runtimePromise;

	if (!webviewRegistered) {
		context.subscriptions.push(
			vscode.window.registerWebviewViewProvider(runtime.modules.panel.OpenMLAssistantViewProvider.viewId, runtime.provider, {
				webviewOptions: {
					retainContextWhenHidden: true
				}
			}),
			runtime.provider
		);
		webviewRegistered = true;
	}

	return runtime;
}

async function withAssistant<T>(context: vscode.ExtensionContext, action: (runtime: AssistantRuntime) => Promise<T>): Promise<T | undefined> {
	try {
		const runtime = await ensureAssistant(context);
		return await action(runtime);
	} catch (error) {
		console.error('[OpenML Assistant] Activation failed.', error);
		const message = error instanceof Error ? error.message : String(error);
		void vscode.window.showErrorMessage(`OpenML Assistant could not start: ${message}`);
		return undefined;
	}
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	let autoOpenTimer: NodeJS.Timeout | undefined;

	const scheduleAutoOpen = (delayMs = 250): void => {
		if (autoOpenTimer) {
			clearTimeout(autoOpenTimer);
		}

		autoOpenTimer = setTimeout(() => {
			autoOpenTimer = undefined;
			void withAssistant(context, async ({ provider }) => {
				await provider.show();
			});
		}, delayMs);
	};

	context.subscriptions.push(new vscode.Disposable(() => {
		if (autoOpenTimer) {
			clearTimeout(autoOpenTimer);
			autoOpenTimer = undefined;
		}
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand('openmlAssistant.openChat', async () => {
			await withAssistant(context, async ({ provider }) => {
				await provider.show();
			});
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

			await withAssistant(context, async ({ provider }) => {
				await provider.show(prompt, 'edit');
			});
		}),
		vscode.commands.registerCommand('openmlAssistant.generatePlan', async () => {
			const prompt = await vscode.window.showInputBox({
				prompt: 'Describe the feature, task, or problem to solve',
				placeHolder: 'Example: Add local-first file tools for Ollama and LM Studio'
			});

			if (!prompt) {
				return;
			}

			await withAssistant(context, async ({ provider }) => {
				await provider.show(prompt, 'plan');
			});
		}),
		vscode.commands.registerCommand('openmlAssistant.selectProvider', async () => {
			await withAssistant(context, async ({ modules, provider }) => {
				const current = modules.providers.getActiveProvider();
				const selected = await vscode.window.showQuickPick(
					modules.providers.providerOptions.map(item => ({
						label: modules.providers.providerDisplayName(item),
						description: item === current ? 'Current' : undefined,
						provider: item
					})),
					{ placeHolder: 'Select the provider for OpenML Assistant' }
				);

				if (!selected) {
					return;
				}

				await modules.providers.setActiveProvider(selected.provider);
				await provider.refresh();
				void vscode.window.showInformationMessage(`OpenML Assistant now uses ${selected.label}.`);
			});
		}),
		vscode.commands.registerCommand('openmlAssistant.openSettings', async () => {
			await vscode.commands.executeCommand('workbench.action.openSettings', '@ext:openml.openml-vibe-assistant openmlAssistant');
		}),
		vscode.commands.registerCommand('openmlAssistant.manageApiKeys', async () => {
			await withAssistant(context, async ({ modules }) => {
				const selected = await vscode.window.showQuickPick(remoteProviders, {
					placeHolder: 'Choose the provider whose API key you want to store securely'
				});

				if (!selected) {
					return;
				}

				const saved = await modules.secrets.promptForProviderSecret(selected.provider);
				if (saved) {
					void vscode.window.showInformationMessage(`${selected.label} API key saved in SecretStorage.`);
				}
			});
		}),
		vscode.commands.registerCommand('openmlAssistant.rebuildIndex', async () => {
			await withAssistant(context, async ({ modules }) => {
				const chunks = await modules.context.rebuildSemanticIndex();
				void vscode.window.showInformationMessage(`OpenML Assistant rebuilt the semantic index with ${chunks} chunks.`);
			});
		}),
		vscode.commands.registerCommand('openmlAssistant.rememberProjectNote', async () => {
			const note = await vscode.window.showInputBox({
				prompt: 'Store a persistent project memory note for this workspace',
				placeHolder: 'Example: Prefer repository pattern in data access modules'
			});

			if (!note?.trim()) {
				return;
			}

			await withAssistant(context, async ({ modules }) => {
				await modules.memory.rememberProjectNote(note);
				void vscode.window.showInformationMessage('OpenML Assistant saved the project memory note.');
			});
		}),
		vscode.commands.registerCommand('openmlAssistant.addWorkspaceRule', async () => {
			const rule = await vscode.window.showInputBox({
				prompt: 'Add a persistent workspace rule for the assistant',
				placeHolder: 'Example: Do not introduce breaking API changes without tests'
			});

			if (!rule?.trim()) {
				return;
			}

			await withAssistant(context, async ({ modules }) => {
				await modules.memory.addWorkspaceRule(rule);
				void vscode.window.showInformationMessage('OpenML Assistant saved the workspace rule.');
			});
		}),
		vscode.workspace.onDidChangeWorkspaceFolders(() => {
			scheduleAutoOpen(150);
		})
	);

	// Start loading in the background so the view is ready on startup, but keep
	// command registration independent from any heavy module import failures.
	void withAssistant(context, async ({ modules, provider }) => {
		const chunks = await modules.context.rebuildSemanticIndex();
		await provider.refresh();
		void vscode.window.setStatusBarMessage(`OpenML Assistant indexed ${chunks} chunks for deep context.`, 4000);
	});

	scheduleAutoOpen();
}

export function deactivate(): void {}
