# OpenML Code

Base de trabajo para construir `OpenML Code`, un IDE propio sobre `Code - OSS` con una experiencia AI local-first centrada en `Ollama` y `LM Studio`, y soporte adicional para `OpenAI`, `Gemini`, `Anthropic` y `OpenRouter`.

## Estado actual

- `apps/code-oss` ya contiene una copia funcional del fuente de `Code - OSS`
- el branding tecnico principal de `OpenML Code` ya fue aplicado
- la version del IDE ya esta fijada en `1.0.0`
- el tema por defecto ya usa `Prussian Blue`
- `npm.cmd install` en `apps/code-oss` ya termina correctamente
- `npm.cmd run compile` en `apps/code-oss` ya compila sin errores
- `./scripts/code.bat` ya arranca el editor localmente
- `OpenML Assistant` ya esta integrado como extension builtin dentro del fork
- el chat usable del asistente ya vive en la barra lateral derecha (`Secondary Side Bar`)
- `Copilot` ya no esta configurado como agente de chat por defecto en `product.json`

## Arquitectura recomendada

- `apps/code-oss`: fork y distribucion del editor
- `apps/code-oss/extensions/openml-vibe-assistant`: asistente AI integrado dentro del editor
- `extensions/vibe-assistant`: MVP externo inicial que sirvio como base conceptual
- `packages/agent-core`: orquestacion, prompts y contratos del agente
- `packages/shared-types`: tipos compartidos
- `services/`: futuros conectores HTTP, memoria, indexado y gateway

## Branding aplicado

El nombre del producto ya es `OpenML Code` en los puntos principales del fork:

- `apps/code-oss/product.json`
- `apps/code-oss/package.json`
- `apps/code-oss/resources/linux/code.desktop`
- `apps/code-oss/resources/linux/code-url-handler.desktop`
- `apps/code-oss/resources/server/manifest.json`
- `apps/code-oss/resources/win32/VisualElementsManifest.xml`

Tambien ya quedaron aplicados:

- version `1.0.0`
- tema por defecto `OpenML Prussian Blue`
- identificadores internos propios
- remocion de `GitHub Copilot` como `defaultChatAgent`

Todavia falta definir icono final y reemplazar assets visuales multiplataforma.

## OpenML Assistant actual

`OpenML Assistant` ya no es solo un planner basico. Hoy puede:

- abrirse como vista propia en la barra lateral derecha
- usar `Ollama` o `LM Studio` como flujo principal local-first
- cambiar entre proveedores desde la UI
- usar `OpenAI`, `Gemini`, `Anthropic` y `OpenRouter`
- mantener historial de mensajes dentro de la vista
- enviar prompts en modos `agent`, `ask`, `edit` y `plan`
- copiar o insertar la ultima respuesta desde menu contextual
- reutilizar contexto del editor activo al enviar prompts

Archivos principales:

- `apps/code-oss/extensions/openml-vibe-assistant/package.json`
- `apps/code-oss/extensions/openml-vibe-assistant/src/extension.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/panel.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/providers.ts`

## Comandos utiles

### Editor base

```powershell
cd apps/code-oss
npm.cmd install
npm.cmd run compile
.\scripts\code.bat
```

### Validacion rapida

```powershell
cd apps/code-oss
.\scripts\code.bat --version
npm.cmd run gulp -- compile-extension:openml-vibe-assistant
```

### Monorepo

```powershell
pnpm install
pnpm build
```

## Proximos pasos

1. implementar `streaming` de respuestas en `OpenML Assistant`
2. mover API keys a almacenamiento mas seguro con `SecretStorage`
3. detectar automaticamente modelos activos en `Ollama` y `LM Studio`
4. agregar herramientas de workspace: lectura de archivos, busqueda, diffs y terminal con aprobacion
5. decidir si se migra estado/layout para ocultar cualquier resto del chat antiguo en instalaciones ya usadas
6. definir icono y completar branding visual

## Documentacion

- [Planning](./PLANNING.md)
- [Arquitectura](./docs/architecture.md)
- [Roadmap](./docs/roadmap.md)
- [Branding](./docs/openml-code-branding.md)
