param(
    [string]$Token = $env:OPENVSX_TOKEN,
    [string]$VsixPath = "",
    [string]$OvsxCommand = "npx --yes ovsx"
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$extensionDir = Join-Path $root "apps\code-oss\extensions\openml-vibe-assistant"
$packageScript = Join-Path $root "scripts\release\package-openml-assistant-vsix.ps1"
$defaultVsixDir = Join-Path $root ".build\vsix"

if (-not (Test-Path $extensionDir)) {
    throw "No se encontro la extension en $extensionDir"
}

$packageJson = Get-Content -Raw (Join-Path $extensionDir "package.json") | ConvertFrom-Json
$publisher = $packageJson.publisher
$name = $packageJson.name
$version = $packageJson.version

if ([string]::IsNullOrWhiteSpace($VsixPath)) {
    $VsixPath = Join-Path $defaultVsixDir "$publisher.$name-$version.vsix"
}

if (-not (Test-Path $VsixPath)) {
    Write-Host "[OpenML Code] VSIX no encontrado. Generando paquete primero..." -ForegroundColor Yellow
    & powershell.exe -ExecutionPolicy Bypass -File $packageScript
    if ($LASTEXITCODE -ne 0) {
        throw "No se pudo generar el VSIX antes de publicar (exit code $LASTEXITCODE)"
    }
}

if (-not (Test-Path $VsixPath)) {
    throw "No se encontro el VSIX en $VsixPath"
}

if ([string]::IsNullOrWhiteSpace($Token)) {
    throw "Falta el token de Open VSX. Define OPENVSX_TOKEN o usa -Token."
}

if (-not $packageJson.PSObject.Properties.Name.Contains('repository')) {
    Write-Warning "La extension no declara 'repository' en package.json. Open VSX puede aceptar la publicacion, pero conviene agregarlo."
}

Write-Host "[OpenML Code] Publicando $VsixPath en Open VSX..." -ForegroundColor Cyan
$publishCommand = "$OvsxCommand publish `"$VsixPath`" -p `"$Token`""
Invoke-Expression $publishCommand

if ($LASTEXITCODE -ne 0) {
    throw "Fallo la publicacion en Open VSX (exit code $LASTEXITCODE)"
}

Write-Host "[OpenML Code] Publicacion completada en Open VSX." -ForegroundColor Green
