# Arquitectura tecnica concreta

## 1. Vision de producto

`OpenML Code` se construye sobre `Code - OSS`, pero la mayor parte de la inteligencia vive fuera del core:

`Code - OSS + branding propio + extension AI builtin + tools + contexto profundo + servicios opcionales`

Eso reduce el costo de mantenimiento del fork y permite iterar rapido en la experiencia AI sin acoplar todo al core del editor.

## 2. Estructura de carpetas

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

## 3. Modulos principales

### `apps/code-oss`

Responsabilidad:

- branding del producto
- empaquetado y distribucion
- configuracion de producto
- ajustes minimos del workbench cuando no exista alternativa por extension
- estrategia de updates y sincronizacion con upstream

### `apps/code-oss/extensions/openml-vibe-assistant`

Responsabilidad:

- panel/chat del agente
- UX de proveedor, modelo y modo
- `streaming` de respuestas
- renderizado Markdown en el webview
- integracion con contexto del editor activo
- herramientas del workspace
- aprobacion de acciones riesgosas
- gestion segura de secretos remotos con `SecretStorage`
- edicion asistida y loops de correccion
- indexado semantico ligero, simbolos, memoria y reglas persistentes por workspace

## 4. Stack exacto actual

### Capa editor

- `Code - OSS`
- Electron
- TypeScript
- VS Code Extension API
- webview propio para el asistente
- tareas gulp del repo de VS Code para compilar y empaquetar

### Capa AI actual

- `openml-vibe-assistant` como extension builtin
- proveedores locales: `Ollama`, `LM Studio`
- proveedores remotos: `OpenAI`, `Gemini`, `Anthropic`, `OpenRouter`, `Azure Foundry`
- `SecretStorage` para API keys
- `markdown-it` para render de respuestas enriquecidas
- `Open VSX` como registry de extensiones por defecto

### Contexto profundo actual

- indice semantico ligero local basado en chunks y scoring lexical
- `vscode.executeWorkspaceSymbolProvider` para simbolos
- `workspaceState` para memoria y reglas persistentes
- enriquecimiento automatico de prompts con contexto profundo

### Distribucion y observabilidad

- `product.json` configurado con `quality`, `updateUrl`, `extensionsGallery`, `win32ExecutableName` y `win32SetupExeName`
- scripts de release en `scripts/release/` para Windows, Linux y macOS
- runbook operativo en `docs/distribution.md`
- bundle local inicial de observabilidad via `collect-observability.ps1`
- empaquetado Win32 validado con bundle `OMLCode.exe` e instalador `OpenMLCodeSetup.exe`
- splash y welcome page alineados con branding de `OpenML Code`
- menu `Help` ajustado para distribucion propia sin `Report Issue`

### Tooling y build

- `pnpm`
- `Node.js 22.22.x`
- TypeScript
- Gulp del repo de VS Code para compilar extensiones builtin
- PowerShell y `npm.cmd` en Windows
- `Visual Studio 2022` o `Build Tools 2022` con workload de C++
- `MSVC v143`
- `Windows SDK`
- `Python 3` para `node-gyp` y reconstruccion de modulos nativos

### Backend futuro

- Node.js 22
- Fastify
- Zod
- SQLite o Postgres

## 5. Arquitectura del asistente actual

### UI y orquestacion

Archivos principales:

- `apps/code-oss/extensions/openml-vibe-assistant/src/extension.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/panel.ts`

Responsabilidad:

- registrar la vista builtin del asistente
- abrir el chat en la barra lateral derecha
- manejar eventos del webview
- coordinar envio de prompts, cambios de proveedor/modelo y acciones del menu
- permitir reejecucion del ultimo prompt y cancelacion de solicitudes en curso
- coordinar preview, apply, tests sugeridos y loops de fix
- inicializar memoria de workspace y reconstruir indice al activar la extension

### Runtime de proveedores

Archivo principal:

- `apps/code-oss/extensions/openml-vibe-assistant/src/providers.ts`

Responsabilidad:

- construir prompts con contexto local
- resolver proveedor activo
- autodetectar modelos de `Ollama` y `LM Studio`
- listar modelos remotos de `Anthropic` y `OpenAI`
- hacer llamadas normales y en `streaming`
- soportar respuestas de modo `edit` preparadas para `openml-edit`
- integrar contexto profundo antes de cada llamada
- manejar `Anthropic Messages API`
- manejar `Azure Foundry Responses API`
- filtrar el catalogo de modelos de `OpenAI` a familias utiles para chat/coding

### Secretos

Archivo principal:

- `apps/code-oss/extensions/openml-vibe-assistant/src/secrets.ts`

Responsabilidad:

- guardar claves remotas en `SecretStorage`
- migrar API keys antiguas desde settings
- exponer flujo seguro para captura de credenciales

### Edicion asistida

Archivo principal:

- `apps/code-oss/extensions/openml-vibe-assistant/src/editing.ts`

Responsabilidad:

- extraer bloques `openml-edit`
- construir preview Markdown y diff
- abrir diff por archivo
- aplicar cambios multiarchivo con aprobacion
- mostrar tests sugeridos
- cerrar previews obsoletos y refrescar el explorador despues de aplicar cambios

### Tools profundas

Archivo principal:

- `apps/code-oss/extensions/openml-vibe-assistant/src/tools.ts`

Responsabilidad:

- lectura de archivos, busqueda y diff
- lectura de diagnosticos
- ejecucion de tests
- ejecucion de comandos con aprobacion
- loops de fix
- memoria del proyecto y reglas persistentes
- simbolos del workspace
- contexto profundo
- canal de salida dedicado para ejecucion profunda

### Contexto profundo

Archivos principales:

- `apps/code-oss/extensions/openml-vibe-assistant/src/context.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/memory.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/projectState.ts`

Responsabilidad:

- indexar un subconjunto util del workspace en chunks
- puntuar fragmentos relevantes para una consulta
- consultar simbolos via LSP
- persistir memoria, reglas e historial resumido por workspace
- construir un bloque de contexto enriquecido para el modelo

## 6. Flujo actual del fix loop

1. el usuario ejecuta `/fix` o `/fix <comando>`
2. el asistente corre tests y recoge diagnosticos
3. se construye un prompt de correccion con ese contexto
4. el modelo devuelve una propuesta `openml-edit`
5. el usuario revisa y aplica cambios
6. el asistente vuelve a correr tests automaticamente
7. si aun falla, genera un nuevo intento hasta un limite controlado

## 7. Flujo actual de contexto profundo

1. el usuario envia una consulta o un prompt de edicion
2. el asistente indexa o reutiliza el indice ligero del workspace
3. recupera chunks relevantes segun la consulta y el archivo activo
4. consulta simbolos del workspace por `WorkspaceSymbolProvider`
5. incorpora memoria, historial resumido y reglas persistentes del workspace
6. concatena ese bloque como contexto profundo antes de llamar al modelo

## 8. Principios de arquitectura

1. Mantener el fork de VS Code lo mas delgado posible.
2. Poner la mayor parte de la inteligencia en extensiones y paquetes compartidos.
3. Disenar herramientas explicitas y auditables en vez de prompts opacos.
4. Pedir aprobacion antes de ejecutar comandos, editar muchos archivos o tocar configuracion sensible.
5. Separar proveedor de modelos, render UI, secretos, edicion, tools y contexto desde el inicio.
6. Favorecer `local-first` siempre que el usuario tenga modelos corriendo localmente.
7. Revalidar cambios automaticamente cuando el flujo ya tenga suficiente contexto para hacerlo de forma segura.
8. Persistir conocimiento por workspace sin depender todavia de servicios externos.

## 9. Estado real del producto hoy

El producto actual ya cubre:

- fork funcional de `Code - OSS`
- branding tecnico principal
- build y arranque local validados
- ejecutable `OMLCode.exe` en Windows
- instalador `OpenMLCodeSetup.exe` en Windows
- asistente builtin dentro del editor
- proveedores locales y remotos
- listado remoto de modelos para `Anthropic` y `OpenAI`
- `streaming` de respuestas
- `SecretStorage` para API keys
- autodeteccion de modelos locales
- renderizado Markdown de respuestas
- tools del workspace
- edicion asistida con preview, apply y tests
- fix loop automatico de primera iteracion
- contexto profundo funcional de primera iteracion
- proveedor `Azure Foundry`
- UI con `Run Again` y cancelacion en curso
- release Win32 validado de punta a punta
- tema por defecto `OpenML Prussian Blue` aplicado tambien en instalaciones nuevas

Todavia no cubre:

- resaltado de sintaxis avanzado y acciones sobre snippets
- parsing mas inteligente de errores de tests
- embeddings o vector DB reales para contexto semantico
- backend opcional o gateway centralizado
- branding visual final del producto
- validacion de release Linux/macOS al mismo nivel que Windows
