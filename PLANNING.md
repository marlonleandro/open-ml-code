# OpenML Code Planning

## 1. Objetivo del proyecto

Construir un IDE propio llamado `OpenML Code`, basado en `Code - OSS`, con una experiencia de `Vibe Coding` local-first y sostenible en mantenimiento.

La estrategia elegida es trabajar en dos capas:

1. un fork/distribucion propia de `Code - OSS`
2. una capa AI propia desacoplada en extensiones, paquetes compartidos y servicios

## 2. Decisiones tomadas

- Nombre del IDE: `OpenML Code`
- Version actual del IDE: `1.0.0`
- Base del editor: `Code - OSS`
- Estrategia de mantenimiento: mantener el fork del core lo mas delgado posible
- Tema por defecto: `OpenML Prussian Blue`
- Capa AI principal: `openml-vibe-assistant` como extension builtin dentro del fork
- Flujo principal de modelos: `Ollama` y `LM Studio`
- Soporte adicional de proveedores: `OpenAI`, `Gemini`, `Anthropic` y `OpenRouter`
- Ubicacion del chat propio: barra lateral derecha (`Secondary Side Bar`)
- Copilot: removido como `defaultChatAgent` del producto

## 3. Estructura actual

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
|-- package.json
|-- pnpm-workspace.yaml
|-- tsconfig.base.json
|-- README.md
`-- PLANNING.md
```

## 4. Documentos de referencia

- [README.md](./README.md)
- [docs/architecture.md](./docs/architecture.md)
- [docs/roadmap.md](./docs/roadmap.md)
- [docs/openml-code-branding.md](./docs/openml-code-branding.md)

## 5. Branding de OpenML Code

Ya se aplico branding tecnico principal en `apps/code-oss`.

### Archivos modificados

- `apps/code-oss/product.json`
- `apps/code-oss/package.json`
- `apps/code-oss/package-lock.json`
- `apps/code-oss/resources/linux/code.desktop`
- `apps/code-oss/resources/linux/code-url-handler.desktop`
- `apps/code-oss/resources/server/manifest.json`
- `apps/code-oss/resources/win32/VisualElementsManifest.xml`
- `apps/code-oss/extensions/theme-defaults/package.json`
- `apps/code-oss/extensions/theme-defaults/package.nls.json`
- `apps/code-oss/extensions/theme-defaults/themes/openml_prussian_blue.json`

### Cambios ya aplicados

- nombre visible del producto: `OpenML Code`
- `applicationName`: `openml-code`
- carpeta de datos: `.openml-code`
- protocolo URL: `openml-code`
- identificadores base de Windows y macOS actualizados
- version del IDE fijada en `1.0.0`
- tema por defecto: `OpenML Prussian Blue`
- `GitHub Copilot` removido como agente de chat por defecto en `product.json`

### Pendientes de branding

- definir icono/logo definitivo
- reemplazar assets visuales multiplataforma
- cambiar `linuxIconName` cuando exista icono final
- sustituir URLs de documentacion/reporte cuando exista repo propio

## 6. Estado del build local de Code - OSS

El build local de `apps/code-oss` ya fue validado de punta a punta.

### Problemas que hubo que resolver

- `npm` bloqueado en PowerShell por Execution Policy
  - se resolvio usando `npm.cmd`
- Node desalineado con el repo
  - se cambio a `22.22.1`
- faltaba toolchain C++ para `node-gyp`
  - se instalaron componentes de Visual Studio 2022
- faltaban librerias Spectre del toolset
  - se corrigio en Visual Studio Installer
- `postinstall` exigia un repo Git
  - se ejecuto `git init` en `apps/code-oss`
- Git rechazaba el repo por `dubious ownership`
  - se agrego `safe.directory`
- faltaban bindings nativos en runtime
  - se reconstruyeron modulos `@vscode/*`

### Validaciones completadas

- `npm.cmd install` en `apps/code-oss` termina correctamente
- `npm.cmd run compile` en `apps/code-oss` termina correctamente
- `./scripts/code.bat --version` inicia el editor correctamente
- la extension builtin `openml-vibe-assistant` compila correctamente por separado

### Observaciones restantes

- siguen apareciendo warnings de `npm` por claves antiguas en `.npmrc`
- puede persistir estado visual anterior del layout en perfiles ya usados
- si el chat antiguo siguiera visible tras reinicio, probablemente sea por estado guardado del workbench y no por `defaultChatAgent`

## 7. OpenML Assistant integrado

La integracion AI principal ya esta montada dentro del fork en:

- `apps/code-oss/extensions/openml-vibe-assistant/package.json`
- `apps/code-oss/extensions/openml-vibe-assistant/src/extension.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/panel.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/providers.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/media/openml-assistant.svg`
- `apps/code-oss/build/gulpfile.extensions.ts`

### Capacidades actuales

- vista propia en la barra lateral derecha
- UX minimalista con menu contextual de acciones
- selector de proveedor
- selector de modos `agent`, `ask`, `edit`, `plan`
- modo por defecto: `agent`
- flujo local-first visible para `Ollama` y `LM Studio`
- soporte remoto para `OpenAI`, `Gemini`, `Anthropic` y `OpenRouter`
- reutilizacion del contexto del editor activo
- comando `Generate Plan` que abre el chat en modo `plan`
- acciones `Copy last` e `Insert last`

### Ajustes UX ya aplicados

- el chat ya no se abre como panel flotante
- el asistente vive en la `Secondary Side Bar`
- la UI se hizo mas compacta y cercana al estilo de Copilot Chat
- los tres puntos quedaron ubicados al lado derecho
- los mensajes `status` ya no se renderizan como tarjetas en el historial
- se redujeron paddings y espacios laterales para aprovechar mejor el ancho del lateral

### Lo que aun no hace

- streaming token a token
- guardado seguro de API keys con `SecretStorage`
- autodeteccion de modelos cargados en `Ollama` o `LM Studio`
- herramientas agenticas de archivos, busqueda, terminal y diffs
- memoria persistente del proyecto

## 8. Stack definido

### Editor

- `Code - OSS`
- Electron
- TypeScript

### Capa AI

- VS Code Extension API
- extension builtin `openml-vibe-assistant`
- proveedor principal local: `Ollama` / `LM Studio`
- proveedores remotos: `OpenAI`, `Gemini`, `Anthropic`, `OpenRouter`

### Monorepo y tooling

- `pnpm`
- TypeScript
- Gulp del propio repo de VS Code para compilar extensiones builtin

### Backend futuro

- Node.js 22
- Fastify
- Zod
- SQLite o Postgres

## 9. Roadmap por fases

### Fase 0. Fundacion

- fork/base de `Code - OSS`
- branding inicial
- build local
- extension host funcional
- base monorepo

Estado actual: completada

### Fase 1. Asistente usable dentro del IDE

- integracion builtin del asistente
- soporte de proveedores locales y remotos
- vista propia en lateral derecho
- historial de mensajes
- modos basicos `agent`, `ask`, `edit`, `plan`
- UX minimalista inicial

Estado actual: completada en su primera version usable

### Fase 2. Pulido de producto AI

- streaming de respuestas
- `SecretStorage` para API keys
- autodeteccion de modelos locales
- mejor manejo de estados, errores y layout persistido

Estado actual: siguiente fase recomendada

### Fase 3. Edicion asistida

- generar diffs
- aplicar cambios con preview
- edicion multiarchivo
- tests sugeridos

Estado actual: pendiente

### Fase 4. Herramientas y ejecucion

- lectura de archivos
- busqueda en workspace
- terminal controlada
- ejecucion de tests
- lectura de errores y loops de fix

Estado actual: pendiente

### Fase 5. Contexto profundo

- indexado semantico
- simbolos/LSP
- memoria de proyecto
- reglas por workspace

Estado actual: pendiente

### Fase 6. Producto distribuible

- empaquetado multiplataforma
- auto-update
- Open VSX o registry propio
- telemetria y observabilidad

Estado actual: pendiente

## 10. Riesgos tecnicos conocidos

- mantener un fork profundo de VS Code encarece mucho el proyecto
- el estado persistido del workbench puede hacer visibles vistas antiguas aunque el producto ya no las configure por defecto
- el acceso al Marketplace oficial de Microsoft no debe asumirse para una distribucion propia
- los builds de Windows dependen de modulos nativos sensibles al entorno

## 11. Comandos utiles

### En `apps/code-oss`

```powershell
npm.cmd install
npm.cmd run compile
npm.cmd run watch
.\scripts\code.bat
.\scripts\code.bat --version
npm.cmd run gulp -- compile-extension:openml-vibe-assistant
```

### En la raiz del monorepo

```powershell
pnpm install
pnpm build
```

## 12. Punto actual del proyecto

En este momento:

- el monorepo base existe
- el branding tecnico principal esta aplicado
- `OpenML Code` compila y arranca localmente
- `OpenML Assistant` ya esta integrado dentro del editor
- el asistente ya usa lateral derecho propio, proveedores reales y modos basicos
- `Copilot` ya no esta configurado como chat por defecto en el producto
- el siguiente trabajo importante es pulir la experiencia AI y empezar a agregar herramientas de workspace

## 13. Siguiente paso recomendado

1. implementar `streaming` en `OpenML Assistant`
2. mover API keys a `SecretStorage`
3. detectar automaticamente modelos de `Ollama` y `LM Studio`
4. agregar herramientas iniciales:
   - lectura de archivos
   - busqueda en workspace
   - generacion de diffs
   - comandos con aprobacion
5. decidir si hace falta migrar o limpiar estado de layout para ocultar restos del chat antiguo en perfiles previos
6. completar branding visual
