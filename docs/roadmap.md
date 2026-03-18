# Roadmap por fases

## Fase 0. Fundacion

- fork de `Code - OSS`
- branding tecnico inicial
- build local
- extension host funcionando
- base monorepo

Entregable: editor renombrado compilando y arrancando localmente.

Estado: completada

## Fase 1. Asistente usable dentro del IDE

- panel de asistente propio
- contexto del archivo activo
- soporte de proveedores locales y remotos
- modos `agent`, `ask`, `edit` y `plan`
- vista en la barra lateral derecha
- UX minimalista inicial

Entregable: el usuario conversa con un asistente integrado dentro del editor.

Estado: completada

## Fase 2. Pulido de producto AI

- `streaming` de respuestas
- `SecretStorage` para API keys
- autodeteccion de modelos de `Ollama` y `LM Studio`
- herramientas iniciales del workspace
- renderizado Markdown real para respuestas
- envio por `Enter` y UX mas cercana a otros IDEs

Entregable: chat AI ya util para trabajo real dentro del IDE.

Estado: completada en su primera version funcional

## Fase 3. Calidad visual y snippets

- resaltado de sintaxis en bloques de codigo
- acciones sobre snippets (`copy code`, etc.)
- mayor pulido tipografico y visual del chat
- iconografia definitiva del producto

Entregable: experiencia visual mas profesional y comparable a IDEs AI maduros.

Estado: siguiente fase recomendada

## Fase 4. Edicion asistida

- generar diffs accionables
- aplicar cambios con preview
- edicion multiarchivo
- tests sugeridos

Entregable: el agente propone y aplica cambios pequeños con confirmacion.

Estado: pendiente

## Fase 5. Herramientas y ejecucion profunda

- terminal controlada mas rica
- ejecucion de tests
- lectura de errores
- loops de fix

Entregable: flujo `implementa -> prueba -> corrige`.

Estado: pendiente

## Fase 6. Contexto profundo

- indexado semantico
- simbolos/LSP
- memoria de proyecto
- reglas persistentes por workspace

Entregable: respuestas mas precisas y menos contexto manual.

Estado: pendiente

## Fase 7. Producto distribuible

- empaquetado multiplataforma
- auto-update
- Open VSX o registry propio
- telemetria y observabilidad

Entregable: beta privada distribuible.

Estado: pendiente
