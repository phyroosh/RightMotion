#!/usr/bin/env bash
set -e

# ===================================================================
# 🚀 RightMotion Studio: Smart Launcher (Fedora / Linux)
#
# Modes:
#   ./start_studio.sh              -> Verifies all dependencies, auto-sets
#                                     up missing tools, opens browser & starts server.
#   ./start_studio.sh --direct     -> Instant launch (skips dependency scans).
#   ./start_studio.sh --setup-only -> Runs full verification & setup without starting server.
# ===================================================================

# Text colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

MODE="full"
for arg in "$@"; do
    case "$arg" in
        --direct|-d|--fast|-f)
            MODE="direct"
            ;;
        --setup-only|-s)
            MODE="setup"
            ;;
    esac
done

# -------------------------------------------------------------------
# Fast / Direct Mode
# -------------------------------------------------------------------
if [ "$MODE" = "direct" ]; then
    if ! command -v node >/dev/null 2>&1; then
        echo -e "${RED}[ERROR] Node.js is not installed or not found in PATH!${NC}"
        echo -e "Run: ${YELLOW}sudo dnf install -y nodejs npm${NC}"
        exit 1
    fi

    if [ -d ".venv" ]; then
        source .venv/bin/activate
    fi

    echo -e "${CYAN}=========================================================${NC}"
    echo -e "${BOLD}⚡ Starting RightMotion Studio directly at http://localhost:4000${NC}"
    echo -e "${CYAN}=========================================================${NC}"
    echo -e "Press ${BOLD}Ctrl+C${NC} at any time to stop the server."
    echo ""

    if command -v xdg-open >/dev/null 2>&1; then
        (sleep 1 && xdg-open "http://localhost:4000" >/dev/null 2>&1) &
    fi

    exec node studio/server.js
fi

# -------------------------------------------------------------------
# Full Verification & Setup Mode
# -------------------------------------------------------------------
echo -e "${CYAN}===================================================================${NC}"
echo -e "${BOLD}🚀 RightMotion Studio: Complete Verification & Launch (Fedora Linux)${NC}"
echo -e "${CYAN}===================================================================${NC}"
echo ""

HAS_ERRORS=0

# 1. Check Node.js
if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}[ERROR] Node.js is not installed or not found in PATH!${NC}"
    echo -e "To install on Fedora Linux, run:"
    echo -e "    ${YELLOW}sudo dnf install -y nodejs npm${NC}"
    echo -e "Or install via fnm / nvm:"
    echo -e "    ${YELLOW}curl -fsSL https://fnm.vercel.app/install | bash${NC}"
    HAS_ERRORS=1
else
    NODE_VER=$(node -v)
    echo -e "  [✓] Node.js:  ${GREEN}${NODE_VER}${NC}"
fi

# 2. Check npm
if ! command -v npm >/dev/null 2>&1; then
    if [ $HAS_ERRORS -eq 0 ]; then
        echo -e "${RED}[ERROR] npm is not installed or not in PATH!${NC}"
        echo -e "To install npm on Fedora Linux, run:"
        echo -e "    ${YELLOW}sudo dnf install -y npm${NC}"
        HAS_ERRORS=1
    fi
else
    NPM_VER=$(npm -v)
    echo -e "  [✓] npm:      ${GREEN}v${NPM_VER}${NC}"
fi

# 3. Check Python 3
if ! command -v python3 >/dev/null 2>&1; then
    echo -e "${RED}[ERROR] Python 3 is not installed or not found in PATH!${NC}"
    echo -e "To install Python on Fedora Linux, run:"
    echo -e "    ${YELLOW}sudo dnf install -y python3 python3-pip${NC}"
    HAS_ERRORS=1
else
    PYTHON_VER=$(python3 --version)
    echo -e "  [✓] Python:   ${GREEN}${PYTHON_VER}${NC}"
fi

# 4. Check FFmpeg
if ! command -v ffmpeg >/dev/null 2>&1; then
    echo -e "${YELLOW}[WARNING] FFmpeg is not installed or not found in PATH!${NC}"
    echo -e "FFmpeg is required for voiceover silence trimming and video production."
    echo -e "To install on Fedora Linux, run:"
    echo -e "    ${YELLOW}sudo dnf install -y ffmpeg${NC}"
else
    FFMPEG_VER=$(ffmpeg -version 2>/dev/null | head -n 1 | awk '{print $1, $2, $3}')
    echo -e "  [✓] FFmpeg:   ${GREEN}${FFMPEG_VER}${NC}"
fi

# Halt if critical system tools are missing
if [ $HAS_ERRORS -ne 0 ]; then
    echo ""
    echo -e "${RED}===================================================================${NC}"
    echo -e "${RED}❌ Missing required system tools listed above.${NC}"
    echo -e "Please install them via DNF and run ${YELLOW}./start_studio.sh${NC} again."
    echo -e "${RED}===================================================================${NC}"
    exit 1
fi

# 5. Check Python Virtual Environment (.venv) & packages
echo ""
echo -e "${BOLD}Checking Python AI Environment...${NC}"

if [ ! -d ".venv" ]; then
    echo -e "  [+] Creating Python virtual environment in .venv/ ..."
    python3 -m venv .venv
fi

source .venv/bin/activate
echo -e "  [✓] VirtualEnv: ${GREEN}Active (.venv)${NC}"

if ! python -c "import edge_tts, faster_whisper, soundfile" >/dev/null 2>&1; then
    echo -e "  [!] Missing Python packages. Installing from requirements.txt..."
    python -m pip install --upgrade pip --quiet
    python -m pip install -r requirements.txt || {
        echo -e "${YELLOW}[WARNING] Some python packages had install warnings.${NC}"
    }
else
    echo -e "  [✓] Python Packages: ${GREEN}edge-tts, faster-whisper, soundfile verified${NC}"
fi

# 6. Check Node.js Dependencies
echo ""
echo -e "${BOLD}Checking Node.js Dependencies...${NC}"

if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo -e "  [!] node_modules missing or incomplete. Running npm install..."
    npm install
    echo -e "  [✓] Node modules installed successfully."
else
    echo -e "  [✓] Node Modules: ${GREEN}Installed & verified${NC}"
fi

# 7. Output directory
mkdir -p out
[ ! -f "out/.gitkeep" ] && touch "out/.gitkeep"

# If setup-only mode, stop here
if [ "$MODE" = "setup" ]; then
    echo ""
    echo -e "${GREEN}===================================================================${NC}"
    echo -e "${BOLD}✅ RightMotion Environment Setup Complete!${NC}"
    echo -e "${GREEN}===================================================================${NC}"
    echo -e "To launch Studio: ${CYAN}./start_studio.sh${NC} or ${CYAN}./Direct_start_server.sh${NC}"
    exit 0
fi

# 8. Launch Server
echo ""
echo -e "${GREEN}===================================================================${NC}"
echo -e "${BOLD}✅ All dependencies verified! Starting RightMotion Studio Dashboard...${NC}"
echo -e "${GREEN}===================================================================${NC}"
echo -e "Local URL:  ${CYAN}${BOLD}http://localhost:4000${NC}"
echo -e "Press ${BOLD}Ctrl+C${NC} at any time to stop the server."
echo ""

if command -v xdg-open >/dev/null 2>&1; then
    (sleep 1.2 && xdg-open "http://localhost:4000" >/dev/null 2>&1) &
fi

exec node studio/server.js
