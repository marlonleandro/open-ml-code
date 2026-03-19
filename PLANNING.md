# OpenML Code Planning

## 1. Objetivo del proyecto

Construir `OpenML Code`, un IDE propio basado en `Code - OSS`, con una experiencia AI `local-first`, mantenible en el tiempo y orientada a:

1. chat y asistencia contextual
2. edicion asistida multiarchivo
3. ejecucion controlada dentro del IDE
4. contexto profundo de workspace
5. distribucion real del producto

La estrategia sigue siendo de dos capas:

1. una distribucion propia de `Code - OSS`
2. una capa AI propia centrada en `openml-vibe-assistant`

## 2. Decisiones clave

- Nombre del producto: `OpenML Code`
- Base del editor: `Code - OSS`
- Tema por defecto: `OpenML Prussian Blue`
- Ejecutable local y distribuible en Windows: `OMLCode.exe`
- Instalador Windows: `OpenMLCodeSetup.exe`
- Flujo principal de modelos: `Ollama` y `LM Studio`
- Proveedores remotos soportados: `OpenAI`, `Gemini`, `Anthropic`, `OpenRouter`, `Azure Foundry`
- Chat propio ubicado en la barra lateral derecha
- `GitHub Copilot` removido como chat por defecto del producto
- API keys remotas guardadas en `SecretStorage`
- Registry por defecto: `Open VSX`
- Filosofia UX del asistente: compacta, minimalista y cercana a IDEs AI modernos

## 3. Estado actual real

### Producto

- `OpenML Code` compila y arranca localmente
- el runtime local de Electron ya se genera como `OMLCode.exe`
- el bundle Win32 tambien se genera con `OMLCode.exe`
- el instalador Win32 ya se genera como `OpenMLCodeSetup.exe`
- el launcher `./scripts/code.bat` funciona para abrir el IDE y validar version
- el branding tecnico principal esta aplicado en el fork
- el tema por defecto ya usa la paleta `Prussian Blue`

### Versionado

Hay dos nociones de version importantes:

- Version comercial del producto: `OpenML Code 1.0.0-beta1`
- Version tecnica interna del host de VS Code: `1.95.0`

Esto se separo porque las extensiones builtin de VS Code necesitan una version API compatible del host.

## 4. Estructura actual del repo

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
|-- extensions/
|   `-- vibe-assistant/
|-- packages/
|   |-- agent-core/
|   `-- shared-types/
|-- services/
|   `-- gateway/
|-- scripts/
|   `-- release/
|-- .vscode/
|-- README.md
`-- PLANNING.md
```

## 5. Archivos importantes hoy

### Branding, runtime y distribucion

- `apps/code-oss/product.json`
- `apps/code-oss/build/lib/electron.ts`
- `apps/code-oss/build/gulpfile.vscode.ts`
- `apps/code-oss/build/gulpfile.vscode.win32.ts`
- `apps/code-oss/build/win32/code.iss`
- `apps/code-oss/scripts/code.bat`
- `scripts/release/package-win32.ps1`
- `docs/distribution.md`

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
- `apps/code-oss/extensions/openml-vibe-assistant/src/projectState.ts`

## 6. Capacidades actuales de OpenML Assistant

### Chat y proveedores

- vista propia en la barra lateral derecha
- modos `agent`, `ask`, `edit`, `plan`
- `streaming` de respuestas
- soporte para `Ollama`, `LM Studio`, `OpenAI`, `Gemini`, `Anthropic`, `OpenRouter` y `Azure Foundry`
- autodeteccion de modelos para `Ollama` y `LM Studio`
- listado remoto de modelos para `Anthropic` y `OpenAI`
- selector de proveedor y modelo desde la UI
- renderizado Markdown real en respuestas
- resaltado de sintaxis en bloques de codigo del chat
- accion `Copy` por snippet dentro del chat
- envio con `Enter` y salto de linea con `Shift+Enter`
- opcion `Run Again` para relanzar el ultimo prompt con el modelo actual
- boton `Send` que cambia a `Stop` durante la ejecucion y permite cancelar la solicitud activa
- proveedor `Azure Foundry` via `Responses API`

### Seguridad y configuracion

- `SecretStorage` para API keys remotas
- migracion desde settings legacy a secretos seguros
- comandos con aprobacion antes de ejecucion
- correccion de secreto real en test reemplazado por valor sintetico para evitar fugas en el repo

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
- el resaltado de sintaxis del chat ya mejoro, pero todavia falta mas pulido visual para respuestas largas, snippets complejos y acciones adicionales sobre codigo
- el parsing de errores de tests todavia es generico; no prioriza los fallos mas relevantes
- el indexado semantico actual es ligero y local; aun no usa embeddings ni vector DB
- el auto-update sigue configurado a nivel de producto, pero el backend real aun no esta desplegado
- Linux y macOS ya tienen scripts de release, pero la validacion completa realizada en esta etapa fue la de Windows

## 8. Estado del build y release

Validaciones completadas:

- `npm.cmd install` en `apps/code-oss`: OK
- `npm.cmd run compile` en `apps/code-oss`: OK
- `npm.cmd run electron`: OK
- `apps/code-oss/.build/electron/OMLCode.exe`: generado correctamente
- `./scripts/code.bat --version`: OK
- compilacion separada de `openml-vibe-assistant`: OK
- `scripts/release/package-win32.ps1 -Arch x64 -Target user`: OK
- bundle Win32 generado en `apps/VSCode-win32-x64`: OK
- instalador Win32 generado en `apps/code-oss/.build/win32-x64/user-setup/OpenMLCodeSetup.exe`: OK

## 9. Roadmap actualizado

### Fase 0. Fundacion

Estado: completada

### Fase 1. Asistente usable

Estado: completada

### Fase 2. Pulido AI

Estado: completada

### Fase 3. Edicion asistida

Estado: completada en su primera version funcional

### Fase 4. Herramientas y ejecucion profunda

Estado: completada en su primera version funcional

### Fase 5. Contexto profundo

Estado: completada en su primera version funcional

### Fase 6. Producto distribuible

- empaquetado Win32 validado end-to-end
- instalador renombrado a `OpenMLCodeSetup.exe`
- ejecutable Windows unificado como `OMLCode.exe`
- base de `Open VSX`, `updateUrl` y observabilidad local ya integrada

Estado: completada en su primera base operativa, con Windows validado

## 10. Riesgos y observaciones

- mantener un fork profundo del core sigue siendo costoso; conviene dejar la mayor parte posible en extensiones
- el estado persistido del workbench puede dejar restos de layout en perfiles viejos
- el acceso al Marketplace oficial de Microsoft no debe asumirse para la distribucion final
- `OpenML Code` queda orientado a `Open VSX` como registry por defecto
- algunos modelos siguen siendo inconsistentes devolviendo propuestas editables estructuradas
- los catalogos remotos de modelos pueden incluir ids no deseados; hoy el listado de `OpenAI` ya se filtra a familias utiles para chat/coding
- cuando GitHub detecte secretos expuestos, ademas del fix en codigo se debe rotar o revocar la credencial real
