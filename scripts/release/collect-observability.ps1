param(
    [string]$OutputDir = '.openml-observability'
)

$ErrorActionPreference = 'Stop'
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$dest = Join-Path $repoRoot $OutputDir
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$summary = @{
    capturedAt = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    machine = $env:COMPUTERNAME
    user = $env:USERNAME
    workspace = $repoRoot.Path
}

$summary | ConvertTo-Json -Depth 5 | Set-Content -Path (Join-Path $dest 'summary.json') -Encoding utf8
Write-Host "Observability bundle created at $dest"
