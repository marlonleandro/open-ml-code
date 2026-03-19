# OpenML Code

`OpenML Code` es un IDE basado en `Code - OSS`, enfocado en desarrollo asistido por IA, con enfoque `local-first` y soporte para `Ollama`, `LM Studio`, `OpenAI`, `Gemini`, `Anthropic`, `OpenRouter` y `Azure Foundry`.

## Que es hoy

`OpenML Code` ya incluye:

- editor funcional construido sobre `Code - OSS`
- tema por defecto `OpenML Prussian Blue`
- ejecutable Windows `OMLCode.exe`
- instalador Windows `OpenMLCodeSetup.exe`
- chat propio `OpenML Assistant` en la barra lateral derecha
- modos `agent`, `ask`, `edit`, `plan`
- `streaming` de respuestas
- `SecretStorage` para API keys remotas
- autodeteccion de modelos locales en `Ollama` y `LM Studio`
- herramientas de lectura, busqueda, ejecucion y fix loop
- edicion asistida con preview, apply y tests sugeridos
- contexto profundo con indexado ligero, simbolos, memoria y reglas persistentes
- base de distribucion con Open VSX, scripts de empaquetado y runbook de release

## Proveedores soportados

### Locales

- `Ollama`
- `LM Studio`

### Remotos

- `OpenAI`
- `Gemini`
- `Anthropic`
- `OpenRouter`
- `Azure Foundry`

## Instalacion y arranque para usuario final

### 1. Abrir el IDE

Desde la raiz del proyecto:

```powershell
cd apps/code-oss
.\scripts\code.bat
```

Validacion rapida:

```powershell
.\scripts\code.bat --version
```

### 2. Abrir el asistente

Dentro del IDE:

- abre la paleta de comandos
- ejecuta `OpenML Assistant: Open Chat`

El asistente aparece en la barra lateral derecha.

### 3. Elegir proveedor y modelo

En la parte superior del panel del asistente:

- elige proveedor
- elige modelo

Si usas `Ollama` o `LM Studio`, el selector de modelos se alimenta desde la deteccion automatica. `Anthropic` y `OpenAI` tambien pueden poblar su selector al usar `Refresh Models` con la API key guardada.

### 4. Guardar API keys remotas

Si usas un proveedor remoto:

- abre el menu de tres puntos del asistente
- elige `Manage API Keys`
- selecciona el proveedor
- pega la API key

Las claves se guardan en `SecretStorage`.

### 5. Configurar base URLs si hace falta

En `Settings`, busca `OpenML Assistant`.

Configuraciones tipicas:

- `Ollama baseUrl`: `http://127.0.0.1:11434`
- `LM Studio baseUrl`: `http://127.0.0.1:1234/v1`
- `OpenAI baseUrl`: `https://api.openai.com/v1`
- `Anthropic baseUrl`: `https://api.anthropic.com/v1`
- `Azure Foundry host`: `https://tu-recurso.cognitiveservices.azure.com`
- `Azure Foundry apiVersion`: `2025-04-01-preview`
- `Azure Foundry deployment`: nombre del deployment/modelo configurado en tu recurso

## Como usar OpenML Assistant

### Modo `ask`

Para preguntas, explicaciones y ayuda puntual.

Ejemplo:

```text
Explicame este archivo y dime que riesgos ves.
```

### Modo `plan`

Para planes de implementacion antes de tocar codigo.

Ejemplo:

```text
Disena un plan para agregar autenticacion JWT a este proyecto.
```

### Modo `edit`

Para pedir cambios reales sobre archivos.

Ejemplos:

```text
Crea un archivo src/utils/fileReader.ts con una funcion async readTextFile(path: string): Promise<string>. Usa fs/promises, maneja errores y sugiere tests.
```

```text
Lee el archivo activo y optimizalo sin cambiar su comportamiento. Mejora legibilidad, estructura y manejo de errores. Devuelve una propuesta editable.
```

### Modo `agent`

Para una ayuda mas amplia y conversacional dentro del proyecto.

Ejemplo:

```text
Analiza este modulo, identifica el siguiente paso y propon la mejor forma de implementarlo.
```

## Flujo de edicion asistida

Cuando el modelo devuelve una propuesta estructurada:

1. revisa la respuesta del asistente
2. abre el menu de tres puntos
3. usa `Preview Edits`
4. revisa el diff y el resumen
5. usa `Apply Edits` si estas conforme
6. usa `Suggested Tests` para ver pruebas sugeridas

Si una respuesta larga se corta o quieres repetir una consulta, usa `Run Again` desde el menu. Tambien puedes cambiar primero el modelo y luego volver a ejecutar el mismo prompt.

## Herramientas del asistente

Puedes escribir comandos directos en el chat:

- `/read <path>`: lee un archivo
- `/search <pattern>`: busca texto en el workspace
- `/diff [path]`: muestra diff del workspace o de un archivo
- `/errors`: muestra diagnosticos del editor
- `/test [command]`: ejecuta tests
- `/run <command>`: ejecuta un comando con aprobacion
- `/fix [test command]`: corre tests, lee errores e inicia un loop de correccion
- `/memory`: muestra memoria y reglas persistentes del workspace
- `/remember <note>`: guarda una nota persistente del proyecto
- `/clear-memory`: limpia la memoria del proyecto en ese workspace
- `/rules`: muestra reglas persistentes del workspace
- `/set-rule <rule>`: agrega una regla persistente
- `/clear-rules`: limpia las reglas persistentes
- `/symbols <query>`: busca simbolos del workspace via LSP
- `/context <query>`: construye contexto profundo relevante para una consulta
- `/reindex`: reconstruye el indice semantico ligero

## Distribucion

### Generar el instalador de Windows

Desde la raiz del proyecto:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\release\package-win32.ps1 -Arch x64 -Target user
```

Salida esperada:

- bundle Win32 en `apps/VSCode-win32-x64`
- instalador en `apps/code-oss/.build/win32-x64/user-setup/OpenMLCodeSetup.exe`

Scripts utiles:

```powershell
pnpm run release:win32
pnpm run release:linux
pnpm run release:darwin
pnpm run release:observability
```

## Estado actual del proyecto

- branding tecnico principal aplicado
- `OpenML Assistant` builtin integrado
- edicion asistida funcional
- herramientas profundas funcionales
- fix loop automatico de primera iteracion
- contexto profundo funcional de primera iteracion
- proveedor `Anthropic` alineado con `Messages API`
- proveedor `Azure Foundry` integrado con `Responses API`
- listado remoto de modelos para `Anthropic` y `OpenAI`
- distribucion Windows validada end-to-end
- ejecutable Windows unificado como `OMLCode.exe`
- instalador Windows unificado como `OpenMLCodeSetup.exe`
- correccion aplicada para evitar un secreto real en tests del repo

## Documentacion adicional

- [Planning](./PLANNING.md)
- [Arquitectura](./docs/architecture.md)
- [Roadmap](./docs/roadmap.md)
- [Distribucion](./docs/distribution.md)
- [Branding](./docs/openml-code-branding.md)

## Creditos

- Desarrollado por: **Marlon Leandro**
- Sitio web: https://mycustomdevs.com/
- Correo: marlonleandro@yahoo.com

## Donaciones

- **Yape** => Numero de telefono +51985689885
- **Zinli** => Nro. de cuenta 4-013-88068677-16
