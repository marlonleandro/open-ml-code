@echo off
setlocal

pushd %~dp0\..

for /f "usebackq delims=" %%a in (`powershell -NoProfile -Command "(Get-Content -Raw 'product.json' | ConvertFrom-Json).nameShort"`) do if not defined NAMESHORT set "NAMESHORT=%%a"
set "CODE=.build\electron\%NAMESHORT%.exe"

"%CODE%" %*

popd
endlocal
