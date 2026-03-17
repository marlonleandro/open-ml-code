export type PlanStep = {
  title: string;
  detail: string;
};

export type WorkspaceContext = {
  workspaceName: string;
  activeFileName?: string;
  selectedText?: string;
};

export type AgentRequest = {
  prompt: string;
  context: WorkspaceContext;
};

export type AgentResponse = {
  title: string;
  summary: string;
  steps: PlanStep[];
  suggestedFiles: string[];
};

