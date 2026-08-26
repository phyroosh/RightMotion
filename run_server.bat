@echo off
title RightClips Studio Server
cd /d "%~dp0"

echo ===================================================
echo          RightClips Studio Server Launcher
echo ===================================================
echo.

:: Check for Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not found in PATH.
    echo Please install Node.js from https://nodejs.org/ to run the server.
    echo.
    pause
    exit /b 1
)

:: Check if node_modules exists, install if missing
if not exist "node_modules\" (
    echo [INFO] Dependencies not found. Installing node modules...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
)

echo Starting RightClips Studio at http://localhost:4000 ...
echo Press Ctrl+C at any time to stop the server.
echo.

:: Open default browser to Studio UI
start http://localhost:4000

:: Start the Express Studio server
node studio/server.js

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Server stopped with error code %errorlevel%.
)

echo.
echo Server stopped.
pause
