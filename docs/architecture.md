# Arquitectura tecnica concreta

## 1. Vision de producto

Tu IDE se construye sobre `Code - OSS`, pero la inteligencia vive fuera del core siempre que sea posible. Eso reduce el costo de mantenimiento y acelera la iteracion.

Formula objetivo:

`Code - OSS + branding propio + extension AI principal + tools + servicios opcionales`

## 2. Estructura de carpetas

```text
custom-ide/
├─ apps/
│  └─ code-oss/                # fork o checkout de Code - OSS
├─ docs/
│  ├─ architecture.md
│  └─ roadmap.md
├─ extensions/
│  └─ vibe-assistant/          # extension principal del agente
├─ packages/
│  ├─ agent-core/              # prompts, tools, orquestacion, policy
│  └─ shared-types/            # tipos de dominio y contratos
├─ services/
│  ├─ gateway/                 # futuro proxy/API opcional
│  ├─ memory/                  # futuro almacenamiento de memoria
│  └─ indexing/                # futuro indexado semantico
├─ package.json
├─ pnpm-workspace.yaml
└─ tsconfig.base.json
```

## 3. Modulos

### `apps/code-oss`

- branding
- empaquetado
- update strategy
- configuracion de producto
- integracion con Open VSX o registry propio

### `extensions/vibe-assistant`

- chat/panel del agente
- comandos del editor
- lectura de contexto local
- previews de cambios
- invocacion de herramientas
- aprobacion de acciones riesgosas

### `packages/agent-core`

- contratos del agente
- plantilla de prompts
- seleccion de contexto
- reglas de seguridad
- planificacion de tareas
- abstraccion de proveedores de modelos

### `packages/shared-types`

- `AgentRequest`
- `AgentResponse`
- `WorkspaceContext`
- `ToolCall`
- `PlanStep`

### `services/gateway`

- proxy de proveedores
- autenticacion
- cuotas
- logs
- feature flags

## 4. Stack exacto recomendado

### Capa editor

- `Code - OSS`
- TypeScript
- VS Code Extension API
- Webviews solo cuando la UX no entre bien en paneles nativos

### Capa AI

- proveedor inicial: OpenAI Responses API o un adaptador compatible
- fallback local: Ollama
- contratos de herramientas propios en `agent-core`

### Capa backend opcional

- Node.js 22
- Fastify
- Zod
- SQLite para MVP local o Postgres para SaaS

### DX y build

- `pnpm`
- TypeScript project references cuando crezca el repo
- `@vscode/vsce` para empaquetar la extension
- GitHub Actions para CI

## 5. Principios de arquitectura

1. Mantener el fork de VS Code lo mas delgado posible.
2. Poner la mayor parte de la inteligencia en extensiones y paquetes compartidos.
3. Diseñar herramientas explicitas y auditables en vez de prompts opacos.
4. Pedir aprobacion antes de ejecutar comandos, editar muchos archivos o tocar configuracion sensible.
5. Separar proveedor de modelos y UX del agente desde el inicio.

## 6. MVP tecnico

El MVP inicial en este workspace cubre:

- monorepo base
- tipos compartidos
- orquestador simple local
- extension `vibe-assistant`
- panel basico para convertir una idea en plan de implementacion
- insercion de salida en el editor activo

No cubre todavia:

- conexion real a LLM
- multi-file edit automatica
- indexado semantico
- herramientas de terminal/tests
- memoria persistente

