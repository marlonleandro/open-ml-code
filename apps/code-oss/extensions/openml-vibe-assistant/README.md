# OpenML Vibe Assistant

`OpenML Vibe Assistant` es la extension builtin que impulsa el chat AI de `OpenML Code`.

## Capacidades principales

- modos `agent`, `ask`, `edit` y `plan`
- soporte para `Ollama`, `LM Studio`, `OpenAI`, `Gemini`, `Anthropic`, `OpenRouter` y `Azure Foundry`
- render Markdown enriquecido en el chat
- snippets con resaltado de sintaxis y accion `Copy`
- propuestas editables `openml-edit` con `Preview Edits` y `Apply Edits`
- herramientas del workspace: lectura, busqueda, diff, tests, fix loop, simbolos, memoria y reglas
- soporte para `SecretStorage` en credenciales remotas

## Uso

Una vez instalada la extension:

1. abre la vista `OpenML Assistant`
2. selecciona proveedor y modelo
3. elige el modo de trabajo
4. envia prompts o usa comandos como `/read`, `/search`, `/test` o `/fix`

## Notas

- el flujo local-first recomienda `Ollama` o `LM Studio` como opciones primarias
- para distribuciones derivadas de `Code - OSS`, esta extension tambien puede empaquetarse como `.vsix`
