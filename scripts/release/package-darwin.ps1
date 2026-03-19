param(
    [ValidateSet('x64','arm64')]
    [string]$Arch = 'arm64'
)

$ErrorActionPreference = 'Stop'
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$codeRoot = Join-Path $repoRoot 'apps\code-oss'

Push-Location $codeRoot
try {
    npm.cmd run compile
    npm.cmd run gulp -- "vscode-darwin-$Arch"
}
finally {
    Pop-Location
}
