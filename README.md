# OpenML Code

`OpenML Code` is an IDE built on top of `Code - OSS`, focused on AI-assisted development with a `local-first` approach and support for `Ollama`, `LM Studio`, `OpenAI`, `Gemini`, `Anthropic`, `OpenRouter`, and `Azure Foundry`.

## End Of The First Stage

The first stage of the project is now complete with a real, operational product baseline:

- functional IDE with its own `OpenML Code` branding
- built-in `OpenML Assistant` integrated and usable inside the editor
- multimodal support for images and PDFs on compatible providers
- Windows installer `OpenMLCodeSetup.exe`
- Windows portable build ready to share with the community
- `.vsix` extension package ready for publication on `Open VSX`
- default theme `OpenML Prussian Blue`
- customized initial welcome experience for `OpenML Code`

With this, `OpenML Code` moves into an early distribution and user validation phase.

## What It Includes Today

`OpenML Code` already includes:

- functional editor built on top of `Code - OSS`
- default theme `OpenML Prussian Blue`
- splash and welcome page with `OpenML Code` branding
- Windows executable `OMLCode.exe`
- Windows installer `OpenMLCodeSetup.exe`
- Windows portable build `OpenMLCode-win32-x64-portable.zip`
- built-in `OpenML Assistant` chat in the right sidebar
- `agent`, `ask`, `edit`, and `plan` modes
- response `streaming`
- syntax-highlighted chat snippets with `Copy` action
- `SecretStorage` for remote API keys
- automatic local model discovery in `Ollama` and `LM Studio`
- read, search, execution, and fix-loop tools
- assisted editing with preview, apply, and suggested tests
- deep context with lightweight indexing, symbols, memory, and persistent rules
- distribution baseline with Open VSX, packaging scripts, and release runbook

## Supported Providers

### Local

- `Ollama`
- `LM Studio`

### Remote

- `OpenAI`
- `Gemini`
- `Anthropic`
- `OpenRouter`
- `Azure Foundry`

All remote providers with multimodal support can now process images and/or PDFs according to their capabilities.

## Install And Run For End Users

### 1. Open The IDE

From the project root:

```powershell
cd apps/code-oss
.\scripts\code.bat
```

Quick validation:

```powershell
.\scripts\code.bat --version
```

### 2. Open The Assistant

Inside the IDE:

- open the Command Palette
- run `OpenML Assistant: Open Chat`

The assistant appears in the right sidebar.

### 3. Choose Provider And Model

At the top of the assistant panel:

- choose a provider
- choose a model

If you use `Ollama` or `LM Studio`, the model selector is fed by automatic discovery. `Anthropic` and `OpenAI` can also populate their selector through `Refresh Models` once an API key has been stored.

### 4. Save Remote API Keys

If you use a remote provider:

- open the assistant three-dot menu
- choose `Manage API Keys`
- select the provider
- paste the API key

Keys are stored in `SecretStorage`.

### 5. Configure Base URLs If Needed

In `Settings`, search for `OpenML Assistant`.

Typical configuration values:

- `Ollama baseUrl`: `http://127.0.0.1:11434`
- `LM Studio baseUrl`: `http://127.0.0.1:1234/v1`
- `OpenAI baseUrl`: `https://api.openai.com/v1`
- `Anthropic baseUrl`: `https://api.anthropic.com/v1`
- `Azure Foundry host`: `https://your-resource.cognitiveservices.azure.com`
- `Azure Foundry apiVersion`: `2025-04-01-preview`
- `Azure Foundry deployment`: deployment/model name configured in your resource

## How To Use OpenML Assistant

### `ask` Mode

For questions, explanations, and focused help.

Example:

```text
Explain this file and tell me what risks you see.
```

### `plan` Mode

For implementation planning before touching code.

Example:

```text
Design a plan to add JWT authentication to this project.
```

### `edit` Mode

For requesting real file changes.

Examples:

```text
Create a file src/utils/fileReader.ts with an async function readTextFile(path: string): Promise<string>. Use fs/promises, handle errors, and suggest tests.
```

```text
Read the active file and optimize it without changing behavior. Improve readability, structure, and error handling. Return an editable proposal.
```

### `agent` Mode

For broader, more conversational project help.

Example:

```text
Create a React web application for invoice intake. Generate a clean architecture using web development best practices. The application must show a list of created invoices, allow viewing the details and editing the data, and support creating a new invoice. Use a style focused on excellent user experience for both desktop and mobile.
```

## Assisted Editing Flow

When the model returns a structured proposal:

1. review the assistant response
2. open the three-dot menu
3. use `Preview Edits`
4. review the diff and summary
5. use `Apply Edits` if you agree
6. use `Suggested Tests` to review proposed tests

If a long response gets cut off or you want to repeat a request, use `Run Again` from the menu. You can also switch models first and then rerun the same prompt.

## Assistant Tools

You can write direct commands in the chat:

- `/read <path>`: reads a file
- `/search <pattern>`: searches text in the workspace
- `/diff [path]`: shows the workspace diff or the diff for one file
- `/errors`: shows editor diagnostics
- `/test [command]`: runs tests
- `/run <command>`: runs a command with approval
- `/fix [test command]`: runs tests, reads errors, and starts a fix loop
- `/memory`: shows workspace memory and persistent rules
- `/remember <note>`: stores a persistent project note
- `/clear-memory`: clears workspace memory
- `/rules`: shows persistent workspace rules
- `/set-rule <rule>`: adds a persistent rule
- `/clear-rules`: clears persistent rules
- `/symbols <query>`: searches workspace symbols via LSP
- `/context <query>`: builds deep context relevant to a query
- `/reindex`: rebuilds the lightweight semantic index

## Suggested Models

- Local (LM Studio / Ollama): `Qwen3-Coder`, `GML-4.6`, `gpt-oss-20b`
- OpenAI: `gpt-5.4`, `gpt-5.3-codex`
- Gemini: `gemini-2.5-pro`, `gemini-3-flash-preview`
- Anthropic: `claude-sonet-4-5-20250929`, `claude-opus-4-6`
- OpenRouter: `minimax/minimax-m2.7`, `z-ai/glm-5-turbo`, `qwen/qwen3.5-397b-a17b`
- Azure Foundry: `gpt-5.3-codex`, `gpt-5.4`, `gpt-5.4-mini`

## Distribution

### Generate The Windows Installer

From the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\release\package-win32.ps1 -Arch x64 -Target user
```

Expected output:

- Win32 bundle in `apps/VSCode-win32-x64`
- installer in `apps/code-oss/.build/win32-x64/user-setup/OpenMLCodeSetup.exe`

### Generate The Windows Portable Build

From the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\release\package-win32-portable.ps1 -Arch x64
```

Expected output:

- portable folder in `apps/code-oss/.build/win32-x64/portable/OpenMLCode-win32-x64-portable`
- portable zip in `apps/code-oss/.build/win32-x64/portable/OpenMLCode-win32-x64-portable.zip`

Useful scripts:

```powershell
pnpm run release:win32
pnpm run release:win32:portable
pnpm run release:linux
pnpm run release:darwin
pnpm run release:observability
pnpm run extension:package
pnpm run extension:publish:openvsx
```

## Requirements To Update Or Build The Project

To modify, build, debug, or publish `OpenML Code` on Windows, this environment is recommended:

- `Windows 10` or `Windows 11` 64-bit
- `Node.js 22.22.x`
- `npm` included with `Node.js 22.22.x`
- `pnpm` installed globally
- `Git`
- `PowerShell 5.1+` or `PowerShell 7+`
- `Visual Studio 2022` or `Build Tools for Visual Studio 2022`
- `Desktop development with C++` workload
- `MSVC v143`
- recent `Windows SDK` for Windows 10/11
- `Python 3` available in `PATH` for `node-gyp` and native module rebuilds

Practical notes:

- the project uses native modules such as `node-pty`, `@vscode/spdlog`, `@vscode/sqlite3`, and `@vscode/windows-mutex`
- for day-to-day development, `npm.cmd install`, `npm.cmd run compile`, and `.\scripts\code.bat` inside `apps/code-oss` are usually enough
- to publish the Windows installer, use `.\scripts\release\package-win32.ps1` from the repository root
- if binaries such as `rg.exe`, `spdlog.node`, or `vscode-sqlite3.node` are missing, the IDE may start in an incomplete state or fail at runtime

## Current Project Status

- core technical branding applied
- splash and welcome page aligned with `OpenML Code`
- built-in `OpenML Assistant` integrated
- chat snippets with syntax highlighting and `Copy code`
- assisted editing working
- deep tools working
- first-iteration automatic fix loop working
- first-iteration deep context working
- `Anthropic` provider aligned with the `Messages API`
- `Azure Foundry` provider integrated with the `Responses API`
- remote model listing for `Anthropic` and `OpenAI`
- Windows distribution validated end to end
- Windows portable distribution validated end to end
- `Help` menu adjusted for a self-distributed product without `Report Issue`
- unified Windows executable as `OMLCode.exe`
- unified Windows installer as `OpenMLCodeSetup.exe`
- Windows portable artifact generated as `OpenMLCode-win32-x64-portable.zip`
- customized initial welcome page for `OpenML Code`
- fix applied to avoid a real secret in repository tests

## Additional Documentation

- [Planning](./PLANNING.md)
- [Architecture](./docs/architecture.md)
- [Roadmap](./docs/roadmap.md)
- [Distribution](./docs/distribution.md)
- [Branding](./docs/openml-code-branding.md)
- [Test Prompts](./TEST_PROMPTS.md)

## Credits

- Developed by: **Marlon Leandro**
- Website: https://openmlcode.mycustomdevs.com/
- Email: marlonleandro@yahoo.com

## Donations

- **PayPal** => Account: malulex@gmail.com
- **Zinli** => Account number: 4-013-88068677-16
