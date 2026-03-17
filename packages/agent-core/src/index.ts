import type { AgentRequest, AgentResponse, PlanStep } from "@custom-ide/shared-types";

function buildSuggestedFiles(prompt: string): string[] {
  const normalized = prompt.toLowerCase();
  const suggestions = ["README.md"];

  if (normalized.includes("api")) {
    suggestions.push("services/gateway/src/routes.ts");
  }

  if (normalized.includes("extension") || normalized.includes("editor")) {
    suggestions.push("extensions/vibe-assistant/src/extension.ts");
  }

  if (normalized.includes("ui") || normalized.includes("panel")) {
    suggestions.push("extensions/vibe-assistant/src/panel.ts");
  }

  return suggestions;
}

function buildSteps(request: AgentRequest): PlanStep[] {
  const contextHint = request.context.activeFileName
    ? `Revisar el archivo activo ${request.context.activeFileName} y su relacion con la tarea.`
    : "Explorar la estructura del workspace para ubicar el punto de entrada correcto.";

  return [
    {
      title: "Alinear el objetivo",
      detail: `Convertir la idea en un entregable acotado: ${request.prompt}.`
    },
    {
      title: "Entender el contexto",
      detail: contextHint
    },
    {
      title: "Diseñar el cambio",
      detail: "Definir archivos a tocar, contratos y riesgos antes de editar."
    },
    {
      title: "Implementar y verificar",
      detail: "Aplicar cambios pequenos, correr validaciones y dejar proximos pasos claros."
    }
  ];
}

export function createImplementationPlan(request: AgentRequest): AgentResponse {
  return {
    title: "Plan de implementacion",
    summary: "Borrador inicial generado localmente por el agente base. Sustituye esta logica por un proveedor LLM en la siguiente fase.",
    steps: buildSteps(request),
    suggestedFiles: buildSuggestedFiles(request.prompt)
  };
}

