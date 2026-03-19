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
- listado remoto de modelos para `Anthropic` y `OpenAI`
- herramientas iniciales del workspace
- renderizado Markdown real para respuestas
- envio por `Enter` y UX mas cercana a otros IDEs

Entregable: chat AI util para trabajo real dentro del IDE.

Estado: completada

## Fase 3. Edicion asistida

- generar propuestas `openml-edit`
- preview de cambios con diff
- aplicar cambios con aprobacion
- edicion multiarchivo
- tests sugeridos
- comando `Edit With Preview`

Entregable: el agente propone cambios estructurados, el usuario los revisa y luego los aplica.

Estado: completada en su primera version funcional

## Fase 4. Herramientas y ejecucion profunda

- terminal controlada mas rica
- ejecucion de tests
- lectura de errores y diagnosticos
- loops de fix
- re-check automatico tras aplicar cambios
- reintentos controlados del loop de correccion

Entregable: flujo `implementa -> prueba -> corrige -> revalida` dentro del IDE.

Estado: completada en su primera version funcional

## Fase 5. Contexto profundo

- indexado semantico ligero
- simbolos/LSP
- memoria de proyecto
- reglas persistentes por workspace
- mejor seleccion automatica de contexto

Entregable: respuestas mas precisas, menos contexto manual y mejor continuidad entre tareas.

Estado: completada en su primera version funcional

## Fase 6. Producto distribuible

- empaquetado multiplataforma base
- auto-update configurado a nivel de producto
- Open VSX como registry de extensiones por defecto
- telemetria y observabilidad base
- branding de binarios de Windows
- release Win32 validado end-to-end

Entregable: producto instalable con una primera base operativa de distribucion.

Estado: completada en su primera base operativa, con Windows validado

## Fase 7. Calidad visual y snippets

- resaltado de sintaxis mas rico en bloques de codigo
- acciones sobre snippets (`copy code`, etc.)
- mayor pulido tipografico y visual del chat
- mejor presentacion de respuestas largas y tecnicas

Entregable: experiencia visual mas profesional y comparable a IDEs AI maduros.

Estado: siguiente fase recomendada

## Fase 8. Robustez del agente

- parser de errores mas inteligente
- configuracion del numero maximo de intentos del fix loop
- mejor tasa de extraccion de propuestas `openml-edit`
- validaciones mas fuertes antes de aplicar cambios
- mejor estrategia de retry cuando proveedores remotos devuelvan respuestas truncadas
- barridos preventivos para evitar secretos reales en tests o fixtures

Entregable: flujos de correccion y edicion mas consistentes entre modelos.

Estado: pendiente

## Fase 9. Distribucion avanzada

- backend real de auto-update
- validacion real de empaquetado Linux y macOS
- pipeline CI/CD de releases firmados
- telemetria conectada a una plataforma real
- crash reporting y dashboards de observabilidad

Entregable: beta privada distribuible y sostenible de mantener en varias plataformas.

Estado: pendiente

## Prioridades inmediatas recomendadas

1. mejorar el render visual de snippets y anadir acciones sobre codigo
2. hacer configurable el numero maximo de intentos del fix loop
3. mejorar el parser de errores para priorizar fallos relevantes antes del siguiente parche
4. definir icono/logo definitivo y completar branding multiplataforma
5. evaluar una capa semantica mas rica con embeddings o servicio opcional
