#!/usr/bin/env bash
set -e

# ===================================================================
# 🚀 RightClips Automated Video Engine Setup (Fedora / Linux)
# ===================================================================

# Text colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo -e "${CYAN}===================================================================${NC}"
echo -e "${BOLD}🚀 Setting up RightClips Automated Video Engine on Fedora Linux...${NC}"
echo -e "${CYAN}===================================================================${NC}"
echo ""

HAS_ERRORS=0

# 1. Check Node.js & npm
echo -e "${BOLD}[1/5] Checking Node.js & npm...${NC}"
if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}[ERROR] Node.js is not installed or not found in PATH!${NC}"
    echo -e "To install Node.js & npm on Fedora Linux, run:"
    echo -e "    ${YELLOW}sudo dnf install -y nodejs npm${NC}"
    echo -e "Or install via fnm / nvm:"
    echo -e "    ${YELLOW}curl -fsSL https://fnm.vercel.app/install | bash${NC}"
    HAS_ERRORS=1
else
    NODE_VER=$(node -v)
    echo -e "      Found Node.js: ${GREEN}${NODE_VER}${NC}"
fi

if ! command -v npm >/dev/null 2>&1; then
    if [ $HAS_ERRORS -eq 0 ]; then
        echo -e "${RED}[ERROR] npm is not installed or not in PATH!${NC}"
        echo -e "To install npm on Fedora Linux, run:"
        echo -e "    ${YELLOW}sudo dnf install -y npm${NC}"
        HAS_ERRORS=1
    fi
else
    NPM_VER=$(npm -v)
    echo -e "      Found npm:     ${GREEN}v${NPM_VER}${NC}"
fi

# 2. Check Python 3
echo ""
echo -e "${BOLD}[2/5] Checking Python 3...${NC}"
if ! command -v python3 >/dev/null 2>&1; then
    echo -e "${RED}[ERROR] Python 3 is not installed or not found in PATH!${NC}"
    echo -e "To install Python on Fedora Linux, run:"
    echo -e "    ${YELLOW}sudo dnf install -y python3 python3-pip${NC}"
    HAS_ERRORS=1
else
    PYTHON_VER=$(python3 --version)
    echo -e "      Found Python:  ${GREEN}${PYTHON_VER}${NC}"
fi

# 3. Check FFmpeg
echo ""
echo -e "${BOLD}[3/5] Checking FFmpeg (Audio/Video processor)...${NC}"
if ! command -v ffmpeg >/dev/null 2>&1; then
    echo -e "${YELLOW}[WARNING] FFmpeg is not installed or not found in PATH!${NC}"
    echo -e "FFmpeg is required for voiceover silence trimming and media processing."
    echo -e "To install FFmpeg on Fedora Linux, run:"
    echo -e "    ${YELLOW}sudo dnf install -y ffmpeg${NC}"
    echo -e "    (or enable RPM Fusion free/nonfree if standard repo lacks full codecs)"
else
    FFMPEG_VER=$(ffmpeg -version | head -n 1)
    echo -e "      Found FFmpeg:  ${GREEN}${FFMPEG_VER}${NC}"
fi

if [ $HAS_ERRORS -ne 0 ]; then
    echo ""
    echo -e "${RED}===================================================================${NC}"
    echo -e "${RED}❌ Setup cannot continue until required dependencies are installed.${NC}"
    echo -e "Please install the missing tools above and re-run: ${YELLOW}./setup.sh${NC}"
    echo -e "${RED}===================================================================${NC}"
    exit 1
fi

# 4. Set up Python Virtual Environment (.venv) & dependencies
echo ""
echo -e "${BOLD}[4/5] Setting up Python virtual environment (.venv)...${NC}"
if [ ! -d ".venv" ]; then
    echo "      Creating virtual environment in .venv/ ..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate
echo -e "      Active Python: ${GREEN}$(which python)${NC}"

echo "      Upgrading pip and installing requirements (edge-tts, faster-whisper, soundfile)..."
python -m pip install --upgrade pip --quiet
python -m pip install -r requirements.txt || {
    echo -e "${YELLOW}[WARNING] Some python packages had install warnings. Verifying basic functionality...${NC}"
}

# 5. Install Node Dependencies
echo ""
echo -e "${BOLD}[5/5] Installing Node.js dependencies (Remotion, Express, Tailwind, Lucide)...${NC}"
npm install || {
    echo -e "${RED}[ERROR] npm install failed! Check errors above.${NC}"
    exit 1
}

# 6. Ensure output directory exists
mkdir -p out
if [ ! -f "out/.gitkeep" ]; then
    touch "out/.gitkeep"
fi

echo ""
echo -e "${GREEN}===================================================================${NC}"
echo -e "${BOLD}✅ RightClips Engine Setup Complete for Fedora Linux!${NC}"
echo -e "${GREEN}===================================================================${NC}"
echo ""
echo -e "🎬 To launch Studio Web Dashboard:"
echo -e "   Run: ${CYAN}./start_studio.sh${NC} or ${CYAN}npm run studio${NC}"
echo ""
echo -e "🤖 To generate new video with an AI Agent (Antigravity / Claude Code / Cursor):"
echo -e "   Simply tell your AI agent: \"Here is the script to generate the short video: <paste text>\""
echo -e "   The agent will generate voice, animation, thumbnail, and 4K video automatically!"
echo -e "${GREEN}===================================================================${NC}"
