# Phase-Based Roadmap

## Phase 0. Foundation

- `Code - OSS` fork
- initial technical branding
- local build
- working extension host
- monorepo baseline

Deliverable: renamed editor compiling and starting locally.

Status: completed

## Phase 1. Usable Assistant Inside The IDE

- custom assistant panel
- active file context
- support for local and remote providers
- `agent`, `ask`, `edit`, and `plan` modes
- right sidebar view
- initial minimalist UX

Deliverable: the user can talk to an integrated assistant inside the editor.

Status: completed

## Phase 2. AI Product Polish

- response `streaming`
- `SecretStorage` for API keys
- automatic model discovery for `Ollama` and `LM Studio`
- remote model listing for `Anthropic` and `OpenAI`
- initial workspace tools
- real Markdown response rendering
- `Enter` to send and UX closer to other AI IDEs

Deliverable: an AI chat useful for real work inside the IDE.

Status: completed

## Phase 3. Assisted Editing

- generate `openml-edit` proposals
- change preview with diff
- apply changes with approval
- multi-file editing
- suggested tests
- `Edit With Preview` command

Deliverable: the agent proposes structured changes, the user reviews them, and then applies them.

Status: completed in its first functional version

## Phase 4. Tools And Deep Execution

- richer controlled terminal
- test execution
- error and diagnostics reading
- fix loops
- automatic re-check after applying changes
- controlled retries in the correction loop

Deliverable: an `implement -> test -> fix -> revalidate` flow inside the IDE.

Status: completed in its first functional version

## Phase 5. Deep Context

- lightweight semantic indexing
- symbols/LSP
- project memory
- persistent workspace rules
- better automatic context selection

Deliverable: more precise responses, less manual context, and better continuity between tasks.

Status: completed in its first functional version

## Phase 6. Distributable Product

- baseline multi-platform packaging
- product-level auto-update configuration
- Open VSX as the default extension registry
- baseline telemetry and observability
- Windows binary branding
- Win32 release validated end to end
- Win32 portable release validated end to end
- production splash and welcome page aligned with `OpenML Code`
- initial welcome page customized for `OpenML Code`
- `OpenML Prussian Blue` applied by default on fresh installs
- `Report Issue` removed from the `Help` menu in the custom distribution

Deliverable: installable product with a first operational distribution baseline.

Status: completed and closed in its first operational baseline, with Windows installer and portable build validated

## Phase 7. Visual Quality And Snippets

- richer syntax highlighting in code blocks
- snippet actions (`copy code`, etc.)
- improved typography and visual polish in the chat
- better presentation of long and technical responses
- UX improvements for editable proposals (`Preview`, `Apply`, `Yes / No`)

Deliverable: a more professional visual experience comparable to mature AI IDEs.

Status: completed in its first functional version

## Phase 8. Agent Robustness

- smarter error parser
- configurable maximum number of fix-loop attempts
- higher extraction success rate for `openml-edit`
- stronger validations before applying changes
- better retry strategy when remote providers return truncated responses
- preventive sweeps to avoid real secrets in tests or fixtures

Deliverable: more consistent correction and editing flows across models.

Status: pending

## Current Milestone

The first stage of the project is now closed with:

- Windows-distributable base product
- installer and portable build ready for the community
- built-in assistant already integrated into the product
- `.vsix` package prepared for `Open VSX`
- initial welcome experience aligned with the `OpenML Code` brand

The recommended next focus is advanced distribution, agent robustness, and UX refinement based on real usage.

## Phase 9. Advanced Distribution

- real auto-update backend
- real Linux and macOS packaging validation
- CI/CD pipeline for signed releases
- telemetry connected to a real platform
- crash reporting and observability dashboards

Deliverable: sustainably maintainable private beta distribution across multiple platforms.

Status: pending

## Recommended Immediate Priorities

1. improve snippet rendering and add more code actions
2. make the maximum fix-loop retry count configurable
3. improve error parsing so the next patch targets the most relevant failures first
4. define the final logo/icon system and complete cross-platform branding
5. evaluate a richer semantic layer with embeddings or an optional service
