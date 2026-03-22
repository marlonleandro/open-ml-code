param(
    [ValidateSet('x64','arm64')]
    [string]$Arch = 'x64'
)

$ErrorActionPreference = 'Stop'
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$codeRoot = Join-Path $repoRoot 'apps\code-oss'
$bundleDir = Join-Path $repoRoot "apps\VSCode-win32-$Arch"
$portableRoot = Join-Path $codeRoot ".build\win32-$Arch\portable"
$portableStageDir = Join-Path $portableRoot "OpenMLCode-win32-$Arch-portable"
$portableZip = Join-Path $portableRoot "OpenMLCode-win32-$Arch-portable.zip"
$ripgrepPackageDir = Join-Path $codeRoot 'node_modules\@vscode\ripgrep'
$ripgrepBinDir = Join-Path $ripgrepPackageDir 'bin'
$ripgrepExe = Join-Path $ripgrepBinDir 'rg.exe'
$nativeModules = @(
    @{
        Package = '@vscode\spdlog'
        Binary = 'build\Release\spdlog.node'
        RebuildArg = '@vscode/spdlog'
    },
    @{
        Package = '@vscode\windows-mutex'
        Binary = 'build\Release\CreateMutex.node'
        RebuildArg = '@vscode/windows-mutex'
    },
    @{
        Package = '@vscode\sqlite3'
        Binary = 'build\Release\vscode-sqlite3.node'
        RebuildArg = '@vscode/sqlite3'
    }
)

if (-not $env:BUILD_SOURCEVERSION) {
    try {
        $commit = (git -C $repoRoot rev-parse HEAD).Trim()
        if ($commit -match '^[0-9a-fA-F]{40}$') {
            $env:BUILD_SOURCEVERSION = $commit
        }
    }
    catch {
        Write-Warning 'Unable to resolve git commit from repository root. Packaging will fall back to upstream defaults.'
    }
}

function Update-BundleExecutableBranding {
    param(
        [string]$BundlePath,
        [string]$ProductPath
    )

    $product = Get-Content -Raw $ProductPath | ConvertFrom-Json
    $desiredExeBase = if ($product.win32ExecutableName) { [string]$product.win32ExecutableName } else { [string]$product.nameShort }
    $legacyExeBase = [string]$product.nameShort

    if ($desiredExeBase -ne $legacyExeBase) {
        $legacyExe = Join-Path $BundlePath ($legacyExeBase + '.exe')
        $desiredExe = Join-Path $BundlePath ($desiredExeBase + '.exe')
        if ((Test-Path $legacyExe) -and -not (Test-Path $desiredExe)) {
            Rename-Item -Path $legacyExe -NewName ($desiredExeBase + '.exe')
        }

        $legacyManifest = Join-Path $BundlePath ($legacyExeBase + '.VisualElementsManifest.xml')
        $desiredManifest = Join-Path $BundlePath ($desiredExeBase + '.VisualElementsManifest.xml')
        if ((Test-Path $legacyManifest) -and -not (Test-Path $desiredManifest)) {
            Rename-Item -Path $legacyManifest -NewName ($desiredExeBase + '.VisualElementsManifest.xml')
        }
    }
}

function Invoke-Step {
    param(
        [string]$Label,
        [string[]]$Command
    )

    Write-Host "[OpenML Code] $Label"
    & $Command[0] $Command[1..($Command.Length-1)]
    if ($LASTEXITCODE -ne 0) {
        throw "Step failed: $Label (exit code $LASTEXITCODE)"
    }
}

function Ensure-RipgrepBinary {
    if (Test-Path $ripgrepExe) {
        Write-Host "[OpenML Code] ripgrep binary detected at $ripgrepExe"
        return
    }

    if (-not (Test-Path $ripgrepPackageDir)) {
        throw "Missing @vscode/ripgrep package at $ripgrepPackageDir"
    }

    $rgCommand = Get-Command rg.exe -ErrorAction SilentlyContinue
    if (-not $rgCommand) {
        throw "Could not locate rg.exe in PATH and $ripgrepExe does not exist."
    }

    New-Item -ItemType Directory -Force -Path $ripgrepBinDir | Out-Null
    Copy-Item -Path $rgCommand.Source -Destination $ripgrepExe -Force
    Write-Host "[OpenML Code] ripgrep binary copied from $($rgCommand.Source) to $ripgrepExe"
}

function Ensure-NativeWindowsModules {
    foreach ($module in $nativeModules) {
        $packageDir = Join-Path $codeRoot ("node_modules\" + $module.Package)
        $binaryPath = Join-Path $packageDir $module.Binary

        if (Test-Path $binaryPath) {
            Write-Host "[OpenML Code] native module ready: $binaryPath"
            continue
        }

        Write-Host "[OpenML Code] rebuilding native module $($module.RebuildArg)..."
        Invoke-Step "Rebuilding $($module.RebuildArg)..." @('npm.cmd', 'rebuild', $module.RebuildArg, '--foreground-scripts')

        if (-not (Test-Path $binaryPath)) {
            throw "Native module rebuild completed but binary is still missing: $binaryPath"
        }
    }
}

function New-PortableArchive {
    param(
        [string]$SourceBundle,
        [string]$StageDir,
        [string]$ZipPath
    )

    if (Test-Path $StageDir) {
        Remove-Item -Recurse -Force $StageDir
    }

    if (Test-Path $ZipPath) {
        Remove-Item -Force $ZipPath
    }

    New-Item -ItemType Directory -Force -Path $StageDir | Out-Null
    Copy-Item -Path (Join-Path $SourceBundle '*') -Destination $StageDir -Recurse -Force
    New-Item -ItemType Directory -Force -Path (Join-Path $StageDir 'data') | Out-Null

    $parentDir = Split-Path -Parent $StageDir
    $leafName = Split-Path -Leaf $StageDir
    Push-Location $parentDir
    try {
        Compress-Archive -Path $leafName -DestinationPath $ZipPath -CompressionLevel Optimal -Force
    }
    finally {
        Pop-Location
    }
}

Push-Location $codeRoot
try {
    Ensure-RipgrepBinary
    Ensure-NativeWindowsModules
    Invoke-Step 'Compiling sources...' @('npm.cmd', 'run', 'compile')
    Invoke-Step "Packaging win32 bundle for $Arch..." @('npm.cmd', 'run', 'gulp', '--', "vscode-win32-$Arch")

    if (-not (Test-Path $bundleDir)) {
        throw "Expected bundle directory was not generated: $bundleDir"
    }

    Update-BundleExecutableBranding -BundlePath $bundleDir -ProductPath (Join-Path $codeRoot 'product.json')
    New-Item -ItemType Directory -Force -Path $portableRoot | Out-Null
    New-PortableArchive -SourceBundle $bundleDir -StageDir $portableStageDir -ZipPath $portableZip
    Write-Host "[OpenML Code] Portable archive created at $portableZip"
}
finally {
    Pop-Location
}
