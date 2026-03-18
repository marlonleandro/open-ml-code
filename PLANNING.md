# OpenML Code Planning

## 1. Objetivo del proyecto

Construir `OpenML Code`, un IDE propio basado en `Code - OSS`, con una experiencia de desarrollo AI `local-first`, mantenible en el tiempo y orientada a edicion asistida, herramientas de ejecucion y loops de correccion.

La estrategia sigue siendo de dos capas:

1. una distribucion propia de `Code - OSS`
2. una capa AI propia centrada en `openml-vibe-assistant`

## 2. Decisiones clave

- Nombre del producto: `OpenML Code`
- Base del editor: `Code - OSS`
- Tema por defecto: `OpenML Prussian Blue`
- Ejecutable en Windows: `omlcode.exe`
- Flujo principal de modelos: `Ollama` y `LM Studio`
- Proveedores remotos soportados: `OpenAI`, `Gemini`, `Anthropic`, `OpenRouter`
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

## 6. Capacidades actuales de OpenML Assistant

### Chat y proveedores

- vista propia en la barra lateral derecha
- modos `agent`, `ask`, `edit`, `plan`
- `streaming` de respuestas
- soporte para `Ollama`, `LM Studio`, `OpenAI`, `Gemini`, `Anthropic` y `OpenRouter`
- autodeteccion de modelos para `Ollama` y `LM Studio`
- selector de proveedor y modelo desde la UI
- renderizado Markdown real en respuestas
- envio con `Enter` y salto de linea con `Shift+Enter`

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

### Edicion asistida

- extraccion de propuestas `openml-edit`
- preview de cambios con resumen Markdown y diff
- aplicacion de cambios con aprobacion
- soporte multiarchivo
- tests sugeridos
- comando `OpenML Assistant: Edit With Preview`

### Fase 4 ya iniciada

- terminal controlada mas rica via output channel `OpenML Assistant Tools`
- ejecucion de tests con autodeteccion basica
- lectura de diagnosticos del editor
- loop inicial de fix
- re-check automatico despues de `Apply Edits`
- reintentos automaticos del fix loop hasta un limite controlado

## 7. Limitaciones actuales

- el modelo no siempre devuelve un bloque `openml-edit`; cuando eso pasa no se puede aplicar la respuesta como cambio estructurado
- el resaltado de sintaxis de snippets en el chat todavia es basico
- aun no existe memoria persistente del proyecto ni indexado semantico profundo
- el parsing de errores de tests todavia es generico; no prioriza los fallos mas relevantes
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

Estado: avanzada y funcional en primera iteracion

### Fase 5. Contexto profundo

- indexado semantico
- simbolos/LSP
- memoria de proyecto
- reglas persistentes por workspace

Estado: pendiente

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

1. hacer configurable el numero maximo de intentos del fix loop
2. mejorar el parser de errores para priorizar fallos importantes antes del siguiente parche
3. añadir acciones sobre snippets (`copy code`, etc.) y mejor resaltado visual
4. definir icono/logo definitivo y completar branding multiplataforma
5. avanzar hacia contexto profundo, indexado y memoria de proyecto
