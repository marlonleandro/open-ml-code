# Arquitectura tecnica concreta

## 1. Vision de producto

`OpenML Code` se construye sobre `Code - OSS`, pero la mayor parte de la inteligencia vive fuera del core. La regla sigue siendo esta:

`Code - OSS + branding propio + extension AI builtin + tools + contexto profundo + servicios opcionales`

Eso reduce el costo de mantenimiento del fork y permite iterar rapido en la experiencia AI sin acoplar todo al core del editor.

## 2. Estructura de carpetas

```text
CustomIDE/
|-- apps/
|   `-- code-oss/                         # fork o copia funcional de Code - OSS
|       `-- extensions/
|           `-- openml-vibe-assistant/    # asistente AI integrado en el editor
|-- docs/
|   |-- architecture.md
|   |-- roadmap.md
|   `-- openml-code-branding.md
|-- extensions/
|   `-- vibe-assistant/                   # MVP externo inicial / base conceptual
|-- packages/
|   |-- agent-core/                       # prompts, policy, orquestacion futura
|   `-- shared-types/                     # tipos de dominio y contratos
|-- services/
|   |-- gateway/                          # futuro proxy/API opcional
|   |-- memory/                           # futuro almacenamiento externo de memoria
|   `-- indexing/                         # futuro indexado semantico mas rico
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

### `packages/agent-core`

Responsabilidad futura:

- contratos del agente
- seleccion de contexto
- reglas de seguridad
- planificacion de tareas
- abstraccion de proveedores de modelos
- estrategias de herramienta / llamada a tools

### `packages/shared-types`

Responsabilidad:

- `AgentRequest`
- `AgentResponse`
- `WorkspaceContext`
- `ToolCall`
- `PlanStep`

### `services/gateway`

Responsabilidad futura:

- proxy de proveedores
- autenticacion centralizada
- cuotas
- logs
- feature flags
- potencial modo SaaS o modo hibrido

## 4. Stack exacto actual

### Capa editor

- `Code - OSS`
- Electron
- TypeScript
- VS Code Extension API
- webview propio para el asistente

### Capa AI actual

- `openml-vibe-assistant` como extension builtin
- proveedores locales: `Ollama`, `LM Studio`
- proveedores remotos: `OpenAI`, `Gemini`, `Anthropic`, `OpenRouter`, `Azure Foundry`
- `SecretStorage` para API keys
- `markdown-it` para render de respuestas enriquecidas

### Contexto profundo actual

- indice semantico ligero local basado en chunks y scoring lexical
- `vscode.executeWorkspaceSymbolProvider` para simbolos
- `workspaceState` para memoria y reglas persistentes
- enriquecimiento automatico de prompts con contexto profundo

### Tooling y build

- `pnpm`
- TypeScript
- Gulp del repo de VS Code para compilar extensiones builtin
- PowerShell / `npm.cmd` en Windows

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
- hacer llamadas normales y en `streaming`
- soportar configuracion `local-first` con fallback a proveedores remotos
- soportar respuestas de modo `edit` preparadas para `openml-edit`
- integrar contexto profundo antes de cada llamada
- manejar `Anthropic Messages API` con stream y fallback no-streaming
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

- lectura de archivos (`/read`)
- busqueda simple en workspace (`/search`)
- lectura de diff de Git (`/diff`)
- lectura de diagnosticos (`/errors`)
- ejecucion de tests (`/test`)
- ejecucion de comandos con aprobacion (`/run`)
- loops de fix (`/fix`)
- memoria del proyecto (`/memory`, `/remember`, `/clear-memory`)
- reglas persistentes (`/rules`, `/set-rule`, `/clear-rules`)
- simbolos del workspace (`/symbols`)
- contexto profundo (`/context`, `/reindex`)
- canal de salida dedicado para ejecucion profunda

### Contexto profundo

Archivos principales:

- `apps/code-oss/extensions/openml-vibe-assistant/src/context.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/memory.ts`

Responsabilidad:

- indexar un subconjunto util del workspace en chunks
- puntuar fragmentos relevantes para una consulta
- consultar simbolos via LSP
- persistir memoria y reglas por workspace
- construir un bloque de contexto enriquecido para el modelo

## 6. Flujo actual del fix loop

El fix loop actual sigue este ciclo:

1. el usuario ejecuta `/fix` o `/fix <comando>`
2. el asistente corre tests y recoge diagnosticos
3. se construye un prompt de correccion con ese contexto
4. el modelo devuelve una propuesta `openml-edit`
5. el usuario revisa y aplica cambios
6. el asistente vuelve a correr tests automaticamente
7. si aun falla, genera un nuevo intento hasta un limite controlado

Este diseño mantiene al usuario en control de la aplicacion de cambios, pero automatiza la parte de revalidacion y siguiente intento.

## 7. Flujo actual de contexto profundo

1. el usuario envia una consulta o un prompt de edicion
2. el asistente indexa o reutiliza el indice ligero del workspace
3. recupera chunks relevantes segun la consulta y el archivo activo
4. consulta simbolos del workspace por `WorkspaceSymbolProvider`
5. incorpora memoria y reglas persistentes del workspace
6. concatena ese bloque como `Deep workspace context` antes de llamar al modelo

## 8. Principios de arquitectura

1. Mantener el fork de VS Code lo mas delgado posible.
2. Poner la mayor parte de la inteligencia en extensiones y paquetes compartidos.
3. Diseñar herramientas explicitas y auditables en vez de prompts opacos.
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
- ejecutable `omlcode.exe` en Windows
- asistente builtin dentro del editor
- proveedores locales y remotos
- listado remoto de modelos para `Anthropic` y `OpenAI`
- `streaming` de respuestas
- `SecretStorage` para API keys
- autodeteccion de modelos locales
- renderizado Markdown de respuestas
- tools del workspace
- edicion asistida con preview/apply/tests
- fix loop automatico de primera iteracion
- contexto profundo funcional de primera iteracion
- compatibilidad ajustada con `Anthropic Messages API`
- proveedor `Azure Foundry` con `Responses API`
- listados de modelos remotos para `Anthropic` y `OpenAI`
- UI con `Run Again` y cancelacion en curso

Todavia no cubre:

- resaltado de sintaxis avanzado y acciones sobre snippets
- parsing mas inteligente de errores de tests
- embeddings o vector DB reales para contexto semantico
- backend opcional / gateway centralizado
- branding visual final del producto

## 10. Riesgos tecnicos conocidos

- mantener un fork profundo de VS Code encarece mucho el proyecto
- el estado persistido del workbench puede hacer visibles restos de layout en perfiles viejos
- el acceso al Marketplace oficial de Microsoft no debe asumirse para una distribucion propia
- los builds de Windows dependen de modulos nativos sensibles al entorno
- el modelo no siempre devuelve una propuesta `openml-edit`; se necesita seguir endureciendo prompts y validaciones
- el fix loop actual es funcional, pero aun no prioriza automaticamente la causa raiz mas relevante entre varios fallos
- el contexto profundo actual mejora mucho la precision, pero sigue siendo un indice local ligero y no una capa semantica avanzada
