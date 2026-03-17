import * as vscode from "vscode";
import { createImplementationPlan } from "@custom-ide/agent-core";
import type { AgentRequest } from "@custom-ide/shared-types";

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("vibeAssistant.openPlanner", async () => {
      const prompt = await vscode.window.showInputBox({
        prompt: "Describe la feature, bug o idea que quieres aterrizar",
        placeHolder: "Ejemplo: Crear un panel de chat agentic con contexto del workspace"
      });

      if (!prompt) {
        return;
      }

      await renderPlan(prompt);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vibeAssistant.planFromSelection", async () => {
      const editor = vscode.window.activeTextEditor;
      const selectedText = editor?.document.getText(editor.selection).trim();

      if (!selectedText) {
        void vscode.window.showInformationMessage("Selecciona texto en el editor para generar el plan.");
        return;
      }

      await renderPlan(`Analiza y continua este fragmento:\n\n${selectedText}`);
    })
  );
}

async function renderPlan(prompt: string): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  const request: AgentRequest = {
    prompt,
    context: {
      workspaceName: vscode.workspace.name ?? "workspace",
      activeFileName: editor?.document.fileName,
      selectedText: editor?.document.getText(editor.selection)
    }
  };

  const plan = createImplementationPlan(request);
  const content = toMarkdown(plan);

  const target = editor ?? (await vscode.window.showTextDocument(await vscode.workspace.openTextDocument({ language: "markdown", content: "" })));
  await target.edit((editBuilder) => {
    if (target.document.getText().length === 0) {
      editBuilder.insert(new vscode.Position(0, 0), content);
      return;
    }

    editBuilder.insert(target.selection.active, `\n\n${content}`);
  });

  await vscode.window.showInformationMessage("Vibe Assistant inserto un plan inicial en el editor.");
}

function toMarkdown(plan: ReturnType<typeof createImplementationPlan>): string {
  const steps = plan.steps
    .map((step, index) => `${index + 1}. **${step.title}**\n   ${step.detail}`)
    .join("\n");

  const files = plan.suggestedFiles.map((file) => `- \`${file}\``).join("\n");

  return [
    `## ${plan.title}`,
    "",
    plan.summary,
    "",
    "### Pasos",
    steps,
    "",
    "### Archivos sugeridos",
    files
  ].join("\n");
}

export function deactivate(): void {}

