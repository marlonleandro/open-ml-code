# Distribucion de OpenML Code

## Objetivo

Esta guia define la primera base operativa para distribuir `OpenML Code` como producto:

- empaquetado Windows, Linux y macOS
- auto-update preparado a nivel de producto
- registry de extensiones sobre `Open VSX`
- observabilidad minima para release y soporte

## Registry de extensiones

`OpenML Code` queda configurado para usar `Open VSX` como gallery por defecto a traves de `product.json`.

Valores principales:

- `serviceUrl`: `https://open-vsx.org/vscode/gallery`
- `itemUrl`: `https://open-vsx.org/vscode/item`
- `resourceUrlTemplate`: `https://open-vsx.org/vscode/unpkg/{publisher}/{name}/{version}/{path}`

## Auto-update

El producto queda preparado con:

- `quality: stable`
- `updateUrl: https://updates.openmlcode.dev/api/update`

Importante:

- esa URL es el endpoint objetivo del producto
- para que el auto-update funcione en produccion, debes desplegar un servicio compatible con el esquema de updates de VS Code/Electron
- en desarrollo local puede quedar sin backend real y el producto simplemente no encontrara updates

## Scripts de empaquetado

### Windows

```powershell
.\scripts\release\package-win32.ps1 -Arch x64 -Target user
.\scripts\release\package-win32.ps1 -Arch arm64 -Target system
```

### Linux

```powershell
.\scripts\release\package-linux.ps1 -Arch x64 -Format deb
.\scripts\release\package-linux.ps1 -Arch x64 -Format rpm
.\scripts\release\package-linux.ps1 -Arch arm64 -Format snap
```

### macOS

```powershell
.\scripts\release\package-darwin.ps1 -Arch arm64
```

## Tareas gulp relevantes del fork

- `vscode-win32-x64`
- `vscode-win32-arm64`
- `vscode-win32-x64-user-setup`
- `vscode-win32-x64-system-setup`
- `vscode-linux-x64`
- `vscode-linux-x64-build-deb`
- `vscode-linux-x64-build-rpm`
- `vscode-linux-x64-build-snap`
- `vscode-darwin-x64`
- `vscode-darwin-arm64`

## Observabilidad minima

Se agrega un script inicial:

```powershell
.\scripts\release\collect-observability.ps1
```

Este genera un bundle minimo en `.openml-observability/` para soporte y diagnostico local.

## Siguiente iteracion recomendada

1. desplegar el backend de updates real
2. firmar binarios Windows y macOS
3. publicar extensiones propias en `Open VSX`
4. conectar eventos de producto y crash reporting a una plataforma real
5. agregar CI matrix para builds multiplataforma
