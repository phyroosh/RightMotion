@echo off
cd /d "%~dp0..\.."

echo =========================================================
echo 🚀 Launching RightClips Studio Dashboard at http://localhost:4000
echo =========================================================
echo.

if not exist "node_modules" (
    echo [INFO] First-time run detected. Installing dependencies...
    call "%~dp0setup.bat"
)

start http://localhost:4000
node studio/server.js
pause
