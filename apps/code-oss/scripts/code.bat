@echo off
setlocal

title VSCode Dev

pushd %~dp0\..

:: Get electron, compile, built-in extensions
if "%VSCODE_SKIP_PRELAUNCH%"=="" (
	node build/lib/preLaunch.ts
)

for /f "usebackq delims=" %%a in (`powershell -NoProfile -Command "(Get-Content -Raw 'product.json' | ConvertFrom-Json).nameShort"`) do if not defined NAMESHORT set "NAMESHORT=%%a"
set "CODE=.build\electron\%NAMESHORT%.exe"

:: Manage built-in extensions
if "%~1"=="--builtin" goto builtin

:: Configuration
set NODE_ENV=development
set VSCODE_DEV=1
set VSCODE_CLI=1
set ELECTRON_ENABLE_LOGGING=1
set ELECTRON_ENABLE_STACK_DUMPING=1

set DISABLE_TEST_EXTENSION="--disable-extension=vscode.vscode-api-tests"
for %%A in (%*) do (
	if "%%~A"=="--extensionTestsPath" (
		set DISABLE_TEST_EXTENSION=""
	)
)

:: Launch Code
"%CODE%" . %DISABLE_TEST_EXTENSION% %*
goto end

:builtin
"%CODE%" build/builtin

:end

popd

endlocal
