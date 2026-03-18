# Arquitectura tecnica concreta

## 1. Vision de producto

`OpenML Code` se construye sobre `Code - OSS`, pero la mayor parte de la inteligencia vive fuera del core. La regla sigue siendo esta:

`Code - OSS + branding propio + extension AI builtin + tools + servicios opcionales`

Eso reduce el costo de mantenimiento del fork y permite iterar rapido en la experiencia AI.

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
|   |-- memory/                           # futuro almacenamiento de memoria
|   `-- indexing/                         # futuro indexado semantico
|-- package.json
|-- pnpm-workspace.yaml
`-- tsconfig.base.json
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
- tools iniciales del workspace
- aprobacion de acciones riesgosas
- gestion segura de secretos remotos con `SecretStorage`

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
- proveedores remotos: `OpenAI`, `Gemini`, `Anthropic`, `OpenRouter`
- `SecretStorage` para API keys
- `markdown-it` para render de respuestas enriquecidas

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

### UI

Archivos principales:

- `apps/code-oss/extensions/openml-vibe-assistant/src/extension.ts`
- `apps/code-oss/extensions/openml-vibe-assistant/src/panel.ts`

Responsabilidad:

- registrar la vista builtin del asistente
- abrir el chat en la barra lateral derecha
- manejar eventos del webview
- coordinar envio de prompts, cambios de proveedor/modelo y acciones del menu

### Runtime del asistente

Archivo principal:

- `apps/code-oss/extensions/openml-vibe-assistant/src/providers.ts`

Responsabilidad:

- construir prompts con contexto local
- resolver proveedor activo
- autodetectar modelos de `Ollama` y `LM Studio`
- hacer llamadas normales y en `streaming`
- soportar configuracion local-first con fallback a proveedores remotos

### Secretos

Archivo principal:

- `apps/code-oss/extensions/openml-vibe-assistant/src/secrets.ts`

Responsabilidad:

- guardar claves remotas en `SecretStorage`
- migrar API keys antiguas desde settings
- exponer flujo seguro para captura de credenciales

### Tools iniciales

Archivo principal:

- `apps/code-oss/extensions/openml-vibe-assistant/src/tools.ts`

Responsabilidad:

- lectura de archivos (`/read`)
- busqueda simple en workspace (`/search`)
- lectura de diff de Git (`/diff`)
- ejecucion de comandos con aprobacion (`/run`)

## 6. Principios de arquitectura

1. Mantener el fork de VS Code lo mas delgado posible.
2. Poner la mayor parte de la inteligencia en extensiones y paquetes compartidos.
3. Diseñar herramientas explicitas y auditables en vez de prompts opacos.
4. Pedir aprobacion antes de ejecutar comandos, editar muchos archivos o tocar configuracion sensible.
5. Separar proveedor de modelos, render UI, secretos y tools desde el inicio.
6. Favorecer `local-first` siempre que el usuario tenga modelos corriendo localmente.

## 7. Estado real del MVP

El MVP actual ya cubre:

- fork funcional de `Code - OSS`
- branding tecnico principal
- build y arranque local validados
- asistente builtin dentro del editor
- proveedores locales y remotos
- `streaming` de respuestas
- `SecretStorage` para API keys
- autodeteccion de modelos locales
- renderizado Markdown de respuestas
- tools iniciales del workspace
- UX de chat mas cercana a otros IDEs modernos

Todavia no cubre:

- resaltado de sintaxis avanzado en bloques de codigo
- acciones por snippet como `copy code`
- edicion multiarchivo aplicada automaticamente
- preview y aplicacion de diffs sobre archivos
- memoria persistente del proyecto
- indexado semantico y simbolos profundos
- backend opcional / gateway centralizado
