@echo off
setlocal

pushd %~dp0\..

for /f "usebackq delims=" %%a in (`powershell -NoProfile -Command "$p=Get-Content -Raw 'product.json' | ConvertFrom-Json; if ($p.win32ExecutableName) { $p.win32ExecutableName } else { $p.nameShort }"`) do if not defined EXENAME set "EXENAME=%%a"
set "CODE=.build\electron\%EXENAME%.exe"

"%CODE%" %*

popd
endlocal
