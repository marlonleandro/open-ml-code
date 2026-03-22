# OpenML Code Planning

## 1. Project Goal

Build `OpenML Code`, a custom IDE based on `Code - OSS`, with a maintainable `local-first` AI experience focused on:

1. contextual chat and assistance
2. multi-file assisted editing
3. controlled execution inside the IDE
4. deep workspace context
5. real product distribution

The strategy still follows two layers:

1. a custom `Code - OSS` distribution
2. a custom AI layer centered on `openml-vibe-assistant`

## 2. Key Decisions

- Product name: `OpenML Code`
- Editor base: `Code - OSS`
- Default theme: `OpenML Prussian Blue`
- Local and distributable Windows executable: `OMLCode.exe`
- Windows installer: `OpenMLCodeSetup.exe`
- Main model flow: `Ollama` and `LM Studio`
- Supported remote providers: `OpenAI`, `Gemini`, `Anthropic`, `OpenRouter`, `Azure Foundry`
- Custom chat placed in the right sidebar
- `GitHub Copilot` removed as the product's default chat
- Remote API keys stored in `SecretStorage`
- Default registry: `Open VSX`
- Assistant UX philosophy: compact, minimal, and close to modern AI IDEs

## 3. Current Real Status

### Product

- `OpenML Code` builds and starts locally
- the local Electron runtime is generated as `OMLCode.exe`
- the Win32 bundle is also generated as `OMLCode.exe`
- the Win32 installer is generated as `OpenMLCodeSetup.exe`
- the Win32 portable build is generated as `OpenMLCode-win32-x64-portable.zip`
- the launcher `./scripts/code.bat` works to open the IDE and validate the version
- the main technical branding is applied in the fork
- the default theme already uses the `Prussian Blue` palette
- the splash and welcome page already reflect `OpenML Code` branding
- the initial Welcome Page now shows an `OpenML Code` introduction
- the `Help` menu in the custom distribution no longer exposes `Report Issue`

### Versioning

There are two important version concepts:

- Commercial product version: `OpenML Code 1.0.0-beta1`
- Internal VS Code host version: `1.95.0`

This was separated because built-in VS Code extensions still require a compatible host API version.

## 4. Current Repository Structure

```text
CustomIDE/
|-- apps/
|   |-- code-oss/
|   `-- VSCode-win32-x64/
|-- docs/
|   |-- architecture.md
|   |-- distribution.md
|   |-- roadmap.md
|   `-- openml-code-branding.md
|-- scripts/
|   `-- release/
|-- .vscode/
|-- README.md
`-- PLANNING.md
```

## 5. Important Files Today

### Branding, Runtime, And Distribution

- `apps/code-oss/product.json`
- `apps/code-oss/build/lib/electron.ts`
- `apps/code-oss/build/gulpfile.vscode.ts`
- `apps/code-oss/build/gulpfile.vscode.win32.ts`
- `apps/code-oss/build/win32/code.iss`
- `apps/code-oss/scripts/code.bat`
- `scripts/release/package-win32.ps1`
- `docs/distribution.md`

### AI Assistant

- `apps/code-oss/extensions/openml-vibe-assistant/package.json`
- `apps/code-oss/extensions/openml-vibe-assistant/src/extension.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/panel.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/providers.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/secrets.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/editing.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/tools.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/context.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/memory.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/projectState.ts`

## 6. Current OpenML Assistant Capabilities

### Chat And Providers

- custom view in the right sidebar
- `agent`, `ask`, `edit`, and `plan` modes
- response `streaming`
- support for `Ollama`, `LM Studio`, `OpenAI`, `Gemini`, `Anthropic`, `OpenRouter`, and `Azure Foundry`
- multimodal support for images and PDFs in `OpenAI`, `Gemini`, `Anthropic`, and `OpenRouter`
- automatic model discovery for `Ollama` and `LM Studio`
- remote model listing for `Anthropic` and `OpenAI`
- provider and model selector in the UI
- real Markdown rendering in responses
- syntax highlighting in chat code blocks
- `Copy` action per snippet in the chat
- `Enter` to send and `Shift+Enter` for line breaks
- `Run Again` to rerun the last prompt using the current model
- `Send` button that changes to `Stop` during execution and can cancel the active request
- `Azure Foundry` support through the `Responses API`

### Security And Configuration

- `SecretStorage` for remote API keys
- migration from legacy settings to secure secrets
- approval flow before running commands
- real secret removed from tests and replaced with a synthetic value to avoid leaks

### Workspace Tools

- `/read <path>`
- `/search <pattern>`
- `/diff [path]`
- `/errors`
- `/test [command]`
- `/run <command>`
- `/fix [test command]`
- `/memory`
- `/remember <note>`
- `/clear-memory`
- `/rules`
- `/set-rule <rule>`
- `/clear-rules`
- `/symbols <query>`
- `/context <query>`
- `/reindex`

### Assisted Editing

- `openml-edit` proposal extraction
- change preview with Markdown summary and diff
- apply flow with approval
- multi-file support
- suggested tests
- `OpenML Assistant: Edit With Preview` command

### Deep Execution

- richer controlled terminal through `OpenML Assistant Tools` output channel
- basic test execution
- editor diagnostics reading
- automatic fix loop with post-apply recheck
- controlled retry loop for fixes

### Deep Context

- lightweight semantic workspace indexing
- local lexical scoring for relevant fragment retrieval
- symbol lookup through `WorkspaceSymbolProvider`
- persistent project memory per workspace
- persistent rules per workspace
- automatic prompt enrichment with deep context

## 7. Current Limitations

- the model does not always return an `openml-edit` block; when that happens, the response cannot be applied as a structured change
- syntax highlighting in the chat improved, but longer responses, complex snippets, and extra code actions still need more polish
- test error parsing is still generic and does not yet prioritize the most relevant failures
- the current semantic index is lightweight and local; it does not yet use embeddings or a vector database
- auto-update is configured at the product level, but the real backend is not yet deployed
- Linux and macOS already have release scripts, but the full validation completed in this stage was Windows

## 8. Build And Release Status

Completed validations:

- `npm.cmd install` in `apps/code-oss`: OK
- `npm.cmd run compile` in `apps/code-oss`: OK
- `npm.cmd run electron`: OK
- `apps/code-oss/.build/electron/OMLCode.exe`: generated correctly
- `./scripts/code.bat --version`: OK
- separate compilation of `openml-vibe-assistant`: OK
- `scripts/release/package-win32.ps1 -Arch x64 -Target user`: OK
- `scripts/release/package-win32-portable.ps1 -Arch x64`: OK
- Win32 bundle generated in `apps/VSCode-win32-x64`: OK
- Win32 installer generated in `apps/code-oss/.build/win32-x64/user-setup/OpenMLCodeSetup.exe`: OK
- Win32 portable zip generated in `apps/code-oss/.build/win32-x64/portable/OpenMLCode-win32-x64-portable.zip`: OK
- Win32 pipeline hardened to include `rg.exe` and native runtime binaries: OK

## 9. Updated Roadmap

### Phase 0. Foundation

Status: completed

### Phase 1. Usable Assistant

Status: completed

### Phase 2. AI Product Polish

Status: completed

### Phase 3. Assisted Editing

Status: completed in its first functional version

### Phase 4. Tools And Deep Execution

Status: completed in its first functional version

### Phase 5. Deep Context

Status: completed in its first functional version

### Phase 6. Distributable Product

- Win32 packaging validated end to end
- installer renamed to `OpenMLCodeSetup.exe`
- Windows executable unified as `OMLCode.exe`
- base integration for `Open VSX`, `updateUrl`, and local observability
- Win32 portable build generated and ready to share through GitHub Releases
- customized initial Welcome Page for `OpenML Code`

Status: completed and closed in its first operational baseline, with Windows installer and portable build validated

## 10. Risks And Notes

- maintaining a deep VS Code fork remains costly; as much logic as possible should stay in extensions
- persisted workbench state can leave layout remnants in old profiles
- access to the official Microsoft Marketplace should not be assumed for the final distribution
- `OpenML Code` is oriented toward `Open VSX` as the default registry
- some models still behave inconsistently when returning structured editable proposals
- remote model catalogs can include unwanted IDs; `OpenAI` listing is already filtered to useful chat/coding families
- when GitHub detects exposed secrets, the real credential must still be revoked or rotated in addition to the code fix
- reproducible Windows builds require `Node.js 22.22.x`, `Visual Studio 2022` with C++, `Windows SDK`, and `Python 3`

## 11. Stage 1 Closure

The first stage is closed with these concrete deliverables:

- functional `Code - OSS` fork with custom branding
- working built-in `OpenML Assistant`
- `agent`, `ask`, `edit`, and `plan` modes
- multimodal image and PDF support for compatible remote providers
- working Windows installer
- working Windows portable build
- `.vsix` package for `Open VSX`
- documentation and release scripts aligned with the real product state

The next stage now focuses on experience quality, agent robustness, advanced distribution, and validation with real users.
