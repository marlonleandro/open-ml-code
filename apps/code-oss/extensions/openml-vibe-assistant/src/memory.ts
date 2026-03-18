import * as vscode from 'vscode';

type WorkspaceMemoryState = {
	notes: string[];
	rules: string[];
};

const MEMORY_KEY = 'openmlAssistant.workspaceMemory';
let workspaceState: vscode.Memento | undefined;

function ensureState(): vscode.Memento {
	if (!workspaceState) {
		throw new Error('Workspace memory has not been initialized.');
	}

	return workspaceState;
}

function getState(): WorkspaceMemoryState {
	return ensureState().get<WorkspaceMemoryState>(MEMORY_KEY, { notes: [], rules: [] });
}

async function updateState(next: WorkspaceMemoryState): Promise<void> {
	await ensureState().update(MEMORY_KEY, next);
}

export function initializeWorkspaceMemory(state: vscode.Memento): void {
	workspaceState = state;
}

export function getProjectMemoryNotes(): string[] {
	return [...getState().notes];
}

export async function rememberProjectNote(note: string): Promise<void> {
	const trimmed = note.trim();
	if (!trimmed) {
		return;
	}

	const state = getState();
	const notes = [trimmed, ...state.notes.filter(existing => existing !== trimmed)].slice(0, 20);
	await updateState({ ...state, notes });
}

export async function clearProjectMemoryNotes(): Promise<void> {
	const state = getState();
	await updateState({ ...state, notes: [] });
}

export function getWorkspaceRules(): string[] {
	return [...getState().rules];
}

export async function addWorkspaceRule(rule: string): Promise<void> {
	const trimmed = rule.trim();
	if (!trimmed) {
		return;
	}

	const state = getState();
	const rules = [...state.rules, trimmed].slice(-20);
	await updateState({ ...state, rules });
}

export async function replaceWorkspaceRules(rules: string[]): Promise<void> {
	const cleaned = rules.map(rule => rule.trim()).filter(Boolean).slice(-20);
	const state = getState();
	await updateState({ ...state, rules: cleaned });
}

export async function clearWorkspaceRules(): Promise<void> {
	const state = getState();
	await updateState({ ...state, rules: [] });
}

export function buildWorkspaceMemoryBlock(): string {
	const notes = getProjectMemoryNotes();
	const rules = getWorkspaceRules();
	const lines: string[] = [];

	if (rules.length) {
		lines.push('Workspace rules:');
		for (const rule of rules) {
			lines.push(`- ${rule}`);
		}
		lines.push('');
	}

	if (notes.length) {
		lines.push('Project memory:');
		for (const note of notes) {
			lines.push(`- ${note}`);
		}
	}

	return lines.join('\n').trim();
}
