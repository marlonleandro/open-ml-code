@echo off
setlocal

title VSCode Dev

pushd %~dp0\..

:: Get electron, compile, built-in extensions
if "%VSCODE_SKIP_PRELAUNCH%"=="" (
	node build/lib/preLaunch.ts
)

for /f "usebackq delims=" %%a in (`powershell -NoProfile -Command "$p=Get-Content -Raw 'product.json' | ConvertFrom-Json; if ($p.win32ExecutableName) { $p.win32ExecutableName } else { $p.nameShort }"`) do if not defined EXENAME set "EXENAME=%%a"
set "CODE=.build\electron\%EXENAME%.exe"

:: Manage built-in extensions
if "%~1"=="--builtin" goto builtin

:: Configuration
set NODE_ENV=development
set VSCODE_DEV=1
set VSCODE_CLI=1
set ELECTRON_ENABLE_LOGGING=1
set ELECTRON_ENABLE_STACK_DUMPING=1
set DISABLE_TEST_EXTENSION="--disable-extension=vscode.vscode-api-tests"
set "OPEN_TARGET=."

for %%A in (%*) do (
	if "%%~A"=="--extensionTestsPath" set DISABLE_TEST_EXTENSION=""
	if "%%~A"=="--version" set "OPEN_TARGET="
	if "%%~A"=="-v" set "OPEN_TARGET="
	if "%%~A"=="--help" set "OPEN_TARGET="
	if "%%~A"=="-h" set "OPEN_TARGET="
)

:: Launch Code
"%CODE%" %OPEN_TARGET% %DISABLE_TEST_EXTENSION% %*
goto end

:builtin
"%CODE%" build/builtin

:end
popd
endlocal
