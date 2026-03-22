# Concrete Technical Architecture

## 1. Product Vision

`OpenML Code` is built on top of `Code - OSS`, but most of the intelligence lives outside the core:

`Code - OSS + custom branding + built-in AI extension + tools + deep context + optional services`

This reduces the maintenance cost of the fork and allows fast iteration on the AI experience without coupling everything to the editor core.

## 2. Folder Structure

```text
CustomIDE/
|-- apps/
|   |-- code-oss/
|   |   `-- extensions/
|   |       `-- openml-vibe-assistant/
|   `-- VSCode-win32-x64/
|-- docs/
|   |-- architecture.md
|   |-- distribution.md
|   |-- roadmap.md
|   `-- openml-code-branding.md
|-- scripts/
|   `-- release/
|-- README.md
`-- PLANNING.md
```

## 3. Main Modules

### `apps/code-oss`

Responsibility:

- product branding
- packaging and distribution
- product configuration
- minimal workbench adjustments when no extension-based alternative exists
- update strategy and upstream synchronization

### `apps/code-oss/extensions/openml-vibe-assistant`

Responsibility:

- agent panel/chat
- provider, model, and mode UX
- response `streaming`
- Markdown rendering in the webview
- active editor context integration
- workspace tools
- approval for risky actions
- secure remote secret handling with `SecretStorage`
- assisted editing and correction loops
- lightweight semantic indexing, symbols, memory, and persistent workspace rules

## 4. Current Exact Stack

### Editor Layer

- `Code - OSS`
- Electron
- TypeScript
- VS Code Extension API
- custom assistant webview
- VS Code repo gulp tasks for compilation and packaging

### Current AI Layer

- `openml-vibe-assistant` as a built-in extension
- local providers: `Ollama`, `LM Studio`
- remote providers: `OpenAI`, `Gemini`, `Anthropic`, `OpenRouter`, `Azure Foundry`
- `SecretStorage` for API keys
- `markdown-it` for rich response rendering
- `Open VSX` as the default extension registry

### Current Deep Context

- local lightweight semantic index based on chunks and lexical scoring
- `vscode.executeWorkspaceSymbolProvider` for symbols
- `workspaceState` for memory and persistent rules
- automatic prompt enrichment with deep context

### Distribution And Observability

- `product.json` configured with `quality`, `updateUrl`, `extensionsGallery`, `win32ExecutableName`, and `win32SetupExeName`
- release scripts in `scripts/release/` for Windows, Linux, and macOS
- portable release script in `scripts/release/package-win32-portable.ps1`
- operational runbook in `docs/distribution.md`
- initial local observability bundle through `collect-observability.ps1`
- validated Win32 packaging with `OMLCode.exe` bundle and `OpenMLCodeSetup.exe` installer
- validated Win32 portable packaging with `OpenMLCode-win32-x64-portable.zip`
- splash and welcome page aligned with `OpenML Code` branding
- customized initial Welcome Page for the custom distribution
- `Help` menu adjusted for self-distribution without `Report Issue`

### Tooling And Build

- `pnpm`
- `Node.js 22.22.x`
- TypeScript
- VS Code repo gulp tasks to build built-in extensions
- PowerShell and `npm.cmd` on Windows
- `Visual Studio 2022` or `Build Tools 2022` with C++ workload
- `MSVC v143`
- `Windows SDK`
- `Python 3` for `node-gyp` and native module rebuilds

### Future Backend

- Node.js 22
- Fastify
- Zod
- SQLite or Postgres

## 5. Current Assistant Architecture

### UI And Orchestration

Main files:

- `apps/code-oss/extensions/openml-vibe-assistant/src/extension.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/panel.ts`

Responsibility:

- register the built-in assistant view
- open the chat in the right sidebar
- handle webview events
- coordinate prompt sending, provider/model changes, and menu actions
- support rerunning the last prompt and canceling active requests
- coordinate preview, apply, suggested tests, and fix loops
- initialize workspace memory and rebuild the index on extension activation

### Provider Runtime

Main file:

- `apps/code-oss/extensions/openml-vibe-assistant/src/providers.ts`

Responsibility:

- build prompts with local context
- resolve the active provider
- autodetect `Ollama` and `LM Studio` models
- list remote models for `Anthropic` and `OpenAI`
- execute regular and `streaming` calls
- support `edit` mode responses prepared for `openml-edit`
- inject deep context before every call
- handle `Anthropic Messages API`
- handle `Azure Foundry Responses API`
- handle multimodal image and PDF inputs for compatible providers
- filter the `OpenAI` catalog down to useful chat/coding model families

### Secrets

Main file:

- `apps/code-oss/extensions/openml-vibe-assistant/src/secrets.ts`

Responsibility:

- store remote keys in `SecretStorage`
- migrate old API keys from settings
- expose a secure credential capture flow

### Assisted Editing

Main file:

- `apps/code-oss/extensions/openml-vibe-assistant/src/editing.ts`

Responsibility:

- extract `openml-edit` blocks
- build preview Markdown and diff
- open per-file diffs
- apply multi-file changes with approval
- show suggested tests
- close stale previews and refresh the explorer after applying changes

### Deep Tools

Main file:

- `apps/code-oss/extensions/openml-vibe-assistant/src/tools.ts`

Responsibility:

- file reading, search, and diff
- diagnostics reading
- test execution
- command execution with approval
- fix loops
- project memory and persistent rules
- workspace symbols
- deep context
- dedicated output channel for deep execution

### Deep Context

Main files:

- `apps/code-oss/extensions/openml-vibe-assistant/src/context.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/memory.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/projectState.ts`

Responsibility:

- index a useful subset of the workspace into chunks
- score relevant fragments for a query
- query symbols through LSP
- persist memory, rules, and summarized history per workspace
- build an enriched context block for the model

## 6. Current Fix Loop Flow

1. the user runs `/fix` or `/fix <command>`
2. the assistant runs tests and collects diagnostics
3. a correction prompt is built with that context
4. the model returns an `openml-edit` proposal
5. the user reviews and applies the changes
6. the assistant reruns tests automatically
7. if it still fails, it generates another attempt up to a controlled limit

## 7. Current Deep Context Flow

1. the user sends a query or an editing prompt
2. the assistant indexes or reuses the lightweight workspace index
3. it retrieves relevant chunks based on the query and active file
4. it queries workspace symbols through `WorkspaceSymbolProvider`
5. it injects workspace memory, summarized history, and persistent rules
6. it appends that block as deep context before calling the model

## 8. Architectural Principles

1. Keep the VS Code fork as thin as possible.
2. Put as much intelligence as possible into extensions and shared packages.
3. Design explicit, auditable tools instead of opaque prompts.
4. Require approval before running commands, editing many files, or touching sensitive configuration.
5. Separate providers, UI rendering, secrets, editing, tools, and context from the beginning.
6. Favor `local-first` whenever the user has local models running.
7. Revalidate changes automatically when the flow already has enough context to do so safely.
8. Persist workspace knowledge without depending on external services yet.

## 9. Real Product State Today

The current product already covers:

- functional `Code - OSS` fork
- core technical branding
- validated local build and startup
- `OMLCode.exe` on Windows
- `OpenMLCodeSetup.exe` installer on Windows
- `OpenMLCode-win32-x64-portable.zip` portable build on Windows
- built-in assistant inside the editor
- local and remote providers
- remote model listing for `Anthropic` and `OpenAI`
- multimodal image and PDF support on compatible remote providers
- response `streaming`
- `SecretStorage` for API keys
- local model autodetection
- Markdown response rendering
- workspace tools
- assisted editing with preview, apply, and tests
- first-iteration automatic fix loop
- first-iteration deep context
- `Azure Foundry` provider
- UI with `Run Again` and in-progress cancellation
- end-to-end validated Win32 release
- `OpenML Prussian Blue` default theme also applied to fresh installs

It still does not fully cover:

- advanced syntax highlighting and richer snippet actions
- smarter test error parsing
- real embeddings or vector database for semantic context
- optional backend or centralized gateway
- final visual branding system
- Linux/macOS release validation at the same level as Windows
