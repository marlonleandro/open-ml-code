# OpenML Code Planning

## 1. Objetivo del proyecto

Construir `OpenML Code`, un IDE propio basado en `Code - OSS`, con una experiencia AI `local-first`, mantenible en el tiempo y orientada a:

1. chat y asistencia contextual
2. edicion asistida multiarchivo
3. ejecucion controlada dentro del IDE
4. contexto profundo de workspace

La estrategia sigue siendo de dos capas:

1. una distribucion propia de `Code - OSS`
2. una capa AI propia centrada en `openml-vibe-assistant`

## 2. Decisiones clave

- Nombre del producto: `OpenML Code`
- Base del editor: `Code - OSS`
- Tema por defecto: `OpenML Prussian Blue`
- Ejecutable en Windows: `omlcode.exe`
- Flujo principal de modelos: `Ollama` y `LM Studio`
- Proveedores remotos soportados: `OpenAI`, `Gemini`, `Anthropic`, `OpenRouter`, `Azure Foundry`
- Chat propio ubicado en la barra lateral derecha
- `GitHub Copilot` removido como chat por defecto del producto
- API keys remotas guardadas en `SecretStorage`
- Filosofia UX del asistente: compacta, minimalista y cercana a IDEs AI modernos

## 3. Estado actual real

### Producto

- `OpenML Code` compila y arranca localmente
- el ejecutable de Windows ya se genera como `omlcode.exe`
- el launcher `./scripts/code.bat` funciona para abrir el IDE y validar version
- el branding tecnico principal esta aplicado en el fork
- el tema por defecto ya usa la paleta `Prussian Blue`

### Versionado

Hay dos nociones de version importantes:

- Version comercial del producto: `OpenML Code 1.0.0`
- Version tecnica interna del host de VS Code: `1.95.0`

Esto se separo porque las extensiones builtin de VS Code necesitan una version API compatible del host. Si se usa `1.0.0` como version interna del host, fallan extensiones como `vscode.json-language-features`.

## 4. Estructura actual del repo

```text
CustomIDE/
|-- apps/
|   `-- code-oss/
|-- docs/
|   |-- architecture.md
|   |-- roadmap.md
|   `-- openml-code-branding.md
|-- extensions/
|   `-- vibe-assistant/
|-- packages/
|   |-- agent-core/
|   `-- shared-types/
|-- services/
|   `-- gateway/
|-- .vscode/
|-- README.md
`-- PLANNING.md
```

## 5. Archivos importantes hoy

### Branding y runtime

- `apps/code-oss/product.json`
- `apps/code-oss/package.json`
- `apps/code-oss/package-lock.json`
- `apps/code-oss/build/lib/electron.ts`
- `apps/code-oss/scripts/code.bat`
- `apps/code-oss/scripts/code-cli.bat`
- `apps/code-oss/scripts/node-electron.bat`
- `apps/code-oss/scripts/test.bat`

### Asistente AI

- `apps/code-oss/extensions/openml-vibe-assistant/package.json`
- `apps/code-oss/extensions/openml-vibe-assistant/src/extension.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/panel.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/providers.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/secrets.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/editing.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/tools.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/context.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/memory.ts`

## 6. Capacidades actuales de OpenML Assistant

### Chat y proveedores

- vista propia en la barra lateral derecha
- modos `agent`, `ask`, `edit`, `plan`
- `streaming` de respuestas
- soporte para `Ollama`, `LM Studio`, `OpenAI`, `Gemini`, `Anthropic`, `OpenRouter` y `Azure Foundry`
- autodeteccion de modelos para `Ollama` y `LM Studio`
- listado remoto de modelos para `Anthropic` y `OpenAI` usando la API key guardada
- selector de proveedor y modelo desde la UI
- renderizado Markdown real en respuestas
- envio con `Enter` y salto de linea con `Shift+Enter`
- opcion `Run Again` para relanzar el ultimo prompt con el modelo actual
- boton `Send` que cambia a `Stop` durante la ejecucion y permite cancelar la solicitud activa
- compatibilidad reforzada con la API de `Anthropic` para `POST /v1/messages` con stream y fallback no-streaming
- proveedor `Azure Foundry` via `Responses API`

### Seguridad y configuracion

- `SecretStorage` para API keys remotas
- migracion desde settings legacy a secretos seguros
- comandos con aprobacion antes de ejecucion

### Herramientas del workspace

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

### Edicion asistida

- extraccion de propuestas `openml-edit`
- preview de cambios con resumen Markdown y diff
- aplicacion de cambios con aprobacion
- soporte multiarchivo
- tests sugeridos
- comando `OpenML Assistant: Edit With Preview`

### Ejecucion profunda

- terminal controlada mas rica via output channel `OpenML Assistant Tools`
- ejecucion de tests con autodeteccion basica
- lectura de diagnosticos del editor
- fix loop automatico con re-check despues de `Apply Edits`
- reintentos automaticos del fix loop hasta un limite controlado

### Contexto profundo

- indexado semantico ligero del workspace
- recuperacion de fragmentos relevantes por scoring lexical local
- consulta de simbolos por `WorkspaceSymbolProvider`
- memoria persistente de proyecto por workspace
- reglas persistentes por workspace
- inyeccion automatica de contexto profundo en los prompts del asistente

## 7. Limitaciones actuales

- el modelo no siempre devuelve un bloque `openml-edit`; cuando eso pasa no se puede aplicar la respuesta como cambio estructurado
- el resaltado de sintaxis de snippets en el chat todavia es basico
- el parsing de errores de tests todavia es generico; no prioriza los fallos mas relevantes
- el indexado semantico actual es ligero y local; aun no usa embeddings ni vector DB
- no se ha completado el branding visual final del producto

## 8. Estado del build

Validaciones ya completadas:

- `npm.cmd install` en `apps/code-oss`: OK
- `npm.cmd run compile` en `apps/code-oss`: OK
- `npm.cmd run electron`: OK
- `apps/code-oss/.build/electron/omlcode.exe`: generado correctamente
- `./scripts/code.bat --version`: OK
- compilacion separada de `openml-vibe-assistant`: OK

## 9. Roadmap actualizado

### Fase 0. Fundacion

- fork de `Code - OSS`
- branding tecnico inicial
- build local
- base monorepo

Estado: completada

### Fase 1. Asistente usable

- panel AI propio
- proveedores locales y remotos
- chat usable en el IDE
- modos `agent`, `ask`, `edit`, `plan`

Estado: completada

### Fase 2. Pulido AI

- `streaming`
- `SecretStorage`
- autodeteccion de modelos locales
- herramientas iniciales del workspace
- renderizado Markdown

Estado: completada

### Fase 3. Edicion asistida

- preview de cambios
- aplicacion aprobada
- edicion multiarchivo
- tests sugeridos

Estado: completada en su primera version funcional

### Fase 4. Herramientas y ejecucion profunda

- terminal controlada mas rica
- ejecucion de tests
- lectura de errores
- loops de fix

Estado: completada en su primera version funcional

### Fase 5. Contexto profundo

- indexado semantico
- simbolos/LSP
- memoria de proyecto
- reglas persistentes por workspace

Estado: completada en su primera version funcional

### Fase 6. Producto distribuible

- empaquetado multiplataforma
- auto-update
- registry de extensiones
- telemetria y observabilidad

Estado: pendiente

## 10. Riesgos y observaciones

- mantener un fork profundo del core sigue siendo costoso; conviene dejar la mayor parte posible en extensiones
- el estado persistido del workbench puede dejar restos de layout en perfiles viejos
- el acceso al Marketplace oficial de Microsoft no debe asumirse para la distribucion final
- el build de Windows sigue dependiendo de modulos nativos y toolchain correcto
- algunos modelos siguen siendo inconsistentes devolviendo propuestas editables estructuradas
- los catalogos remotos de modelos pueden incluir ids no deseados; hoy el listado de `OpenAI` ya se filtra a familias utiles para chat/coding

## 11. Comandos utiles

### En `apps/code-oss`

```powershell
npm.cmd install
npm.cmd run compile
npm.cmd run electron
.\scripts\code.bat
.\scripts\code.bat --version
npm.cmd run gulp -- compile-extension:openml-vibe-assistant
```

### En la raiz del monorepo

```powershell
pnpm install
pnpm build
```

## 12. Siguientes pasos recomendados

1. mejorar el render visual de snippets y acciones sobre codigo
2. hacer configurable el numero maximo de intentos del fix loop
3. mejorar el parser de errores para priorizar la causa raiz
4. fortalecer todavia mas el batching automatico cuando un proveedor remoto trunque respuestas
5. definir icono/logo definitivo y completar branding multiplataforma
6. evaluar una capa de indexado semantico mas rica con embeddings o servicio opcional
