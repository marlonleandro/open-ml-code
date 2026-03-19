param(
    [ValidateSet('x64','arm64','armhf')]
    [string]$Arch = 'x64',
    [ValidateSet('deb','rpm','snap')]
    [string]$Format = 'deb'
)

$ErrorActionPreference = 'Stop'
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$codeRoot = Join-Path $repoRoot 'apps\code-oss'

$taskMap = @{
    'deb' = "vscode-linux-$Arch-build-deb"
    'rpm' = "vscode-linux-$Arch-build-rpm"
    'snap' = "vscode-linux-$Arch-build-snap"
}

Push-Location $codeRoot
try {
    npm.cmd run compile
    npm.cmd run gulp -- "vscode-linux-$Arch"
    npm.cmd run gulp -- $taskMap[$Format]
}
finally {
    Pop-Location
}
