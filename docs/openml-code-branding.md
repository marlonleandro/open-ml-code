# OpenML Code Branding

## Branding minimo aplicado

- nombre visible del producto: `OpenML Code`
- `applicationName`: `openml-code`
- carpeta de datos: `.openml-code`
- protocolo URL: `openml-code`
- identificadores base de Windows y macOS actualizados
- nombre del manifiesto web y accesos Linux/Windows actualizados
- `linuxIconName`: `openml-code`

## Estado actual de identidad visual

Los assets principales del producto ya fueron sustituidos en estas rutas:

- `apps/code-oss/resources/win32/code.ico`
- `apps/code-oss/resources/win32/code_150x150.png`
- `apps/code-oss/resources/win32/code_70x70.png`
- `apps/code-oss/resources/linux/code.png`
- `apps/code-oss/resources/linux/rpm/code.xpm`
- `apps/code-oss/resources/darwin/code.icns`
- `apps/code-oss/resources/server/code-192.png`
- `apps/code-oss/resources/server/code-512.png`
- `apps/code-oss/resources/server/favicon.ico`

Mientras mantengas esos nombres de archivo, no hace falta cambiar las referencias actuales en manifiestos y packaging.

## Pendientes de identidad visual

- definir logo principal y lineamientos de marca finales
- decidir si mas adelante se renombraran tambien los archivos fisicos `code.*` a `openml-code.*`
- revisar splash, about y capturas promocionales cuando se prepare distribucion

## Pendientes tecnicos recomendados

- revisar referencias residuales de `code-oss` en scripts de desarrollo, tests y package-lock
- sustituir URLs de reporte y documentacion cuando exista repo propio
- validar empaquetado Linux para confirmar que `openml-code` se propaga bien como icon name
