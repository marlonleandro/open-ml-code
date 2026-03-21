param(
    [string]$OutputDir = ".build\vsix"
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$extensionDir = Join-Path $root "apps\code-oss\extensions\openml-vibe-assistant"
$codeOssDir = Join-Path $root "apps\code-oss"
$vsceCli = Join-Path $root "apps\code-oss\build\node_modules\@vscode\vsce\vsce"
$resolvedOutputDir = Join-Path $root $OutputDir

if (-not (Test-Path $vsceCli)) {
    throw "No se encontro @vscode/vsce en $vsceCli"
}

if (-not (Test-Path $extensionDir)) {
    throw "No se encontro la extension en $extensionDir"
}

New-Item -ItemType Directory -Force -Path $resolvedOutputDir | Out-Null

Push-Location $codeOssDir
try {
    Write-Host "[OpenML Code] Compiling openml-vibe-assistant extension..." -ForegroundColor Cyan
    npm.cmd run gulp -- compile-extension:openml-vibe-assistant
    if ($LASTEXITCODE -ne 0) {
        throw "Fallo la compilacion de la extension (exit code $LASTEXITCODE)"
    }
}
finally {
    Pop-Location
}

$packageJson = Get-Content -Raw (Join-Path $extensionDir "package.json") | ConvertFrom-Json
$publisher = $packageJson.publisher
$name = $packageJson.name
$version = $packageJson.version
$vsixName = "$publisher.$name-$version.vsix"
$vsixPath = Join-Path $resolvedOutputDir $vsixName

Push-Location $extensionDir
try {
    Write-Host "[OpenML Code] Packaging VSIX..." -ForegroundColor Cyan
    node $vsceCli package --no-dependencies --out $vsixPath
    if ($LASTEXITCODE -ne 0) {
        throw "Fallo el empaquetado VSIX (exit code $LASTEXITCODE)"
    }
}
finally {
    Pop-Location
}

Write-Host "[OpenML Code] VSIX generado en: $vsixPath" -ForegroundColor Green
