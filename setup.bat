@echo off
setlocal enabledelayedexpansion

echo ===================================================================
echo 🚀 Setting up RightClips Automated Video Engine...
echo ===================================================================
echo.

:: 1. Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo [1/4] Found Node.js: !NODE_VER!

:: 2. Check Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.9+ from https://python.org
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VER=%%i
echo [2/4] Found Python: !PYTHON_VER!

:: 3. Install Node Dependencies
echo.
echo [3/4] Installing Node.js dependencies (Remotion, Express, Tailwind, Lucide)...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed!
    pause
    exit /b 1
)

:: 4. Install Python Dependencies
echo.
echo [4/4] Installing Python dependencies (edge-tts, faster-whisper, ctranslate2)...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [WARNING] Some python packages had install warnings. Verifying basic import...
)

:: 5. Create out directory
if not exist "out" mkdir out
if not exist "out\.gitkeep" type nul > "out\.gitkeep"

echo.
echo ===================================================================
echo ✅ RightClips Engine Setup Complete!
echo ===================================================================
echo.
echo 🎬 To launch Studio Web Dashboard:
echo    double click "start_studio.bat" or run: npm run studio
echo.
echo 🤖 To generate new video with an AI Agent (AGY / Claude Code / Cursor):
echo    Simply tell your AI agent: "Here is the script to generate the short video: <paste text>"
echo    The agent will read AGENTS.md and generate voice, animation, thumbnail, and 4K video automatically!
echo ===================================================================
echo.
pause
