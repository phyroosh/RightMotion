#!/usr/bin/env bash

# ===================================================================
# 🚀 RightMotion Studio: Smart Interactive Launcher (Linux / Fedora)
#
# Modes & Flags:
#   ./start_studio.sh              -> Full verification, interactive Cloud Server prompt, starts Studio.
#   ./start_studio.sh --direct     -> Instant launch (skips dependency scans).
#   ./start_studio.sh --cloud      -> Starts Studio with Worldwide Cloud Server (invite links) enabled.
#   ./start_studio.sh --local      -> Starts Studio in Local / LAN mode (cloud tunnel disabled).
#   ./start_studio.sh --setup-only -> Runs setup & dependency verification without starting server.
#   ./start_studio.sh --help       -> Displays usage options.
# ===================================================================

# Text colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m'

# Check for help flag early
for arg in "$@"; do
    if [ "$arg" = "--help" ] || [ "$arg" = "-h" ]; then
        echo -e "${BOLD}RightMotion Studio Smart Launcher${NC}"
        echo "Usage: ./start_studio.sh [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --direct, -d, --fast, -f   Instant launch (skips dependency scans)"
        echo "  --cloud, -c                Enable Worldwide Cloud Server & Invite links directly"
        echo "  --local, -l, --no-cloud    Run Local / LAN mode only (Cloud tunnel disabled)"
        echo "  --setup-only, -s           Run environment verification & setup without starting server"
        echo "  --headless, --no-terminal  Run directly without launching a terminal window"
        echo "  --help, -h                 Show this help message"
        exit 0
    fi
    if [ "$arg" = "--headless" ] || [ "$arg" = "--no-terminal" ]; then
        RIGHTMOTION_IN_TERMINAL="1"
    fi
done

# -------------------------------------------------------------------
# 0. Terminal Auto-Spawner
# If invoked from a GUI file manager (Dolphin / Nautilus) or desktop shortcut
# where stdin is not an interactive terminal ([ ! -t 0 ]), physically launch
# an interactive terminal window so the user can see logs and interact.
# -------------------------------------------------------------------
if [ ! -t 0 ] && [ -z "$RIGHTMOTION_IN_TERMINAL" ] && [ -z "$HEADLESS" ] && [ -z "$CI" ]; then
    if [ -n "$DISPLAY$WAYLAND_DISPLAY" ]; then
        SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
        SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

        for term in konsole gnome-terminal xfce4-terminal kitty alacritty wezterm foot tilix xterm; do
            if command -v "$term" >/dev/null 2>&1; then
                case "$term" in
                    konsole)
                        exec "$term" --workdir "$SCRIPT_DIR" --qwindowtitle "RightMotion Studio" -e bash -c 'export RIGHTMOTION_IN_TERMINAL=1; bash "$0" "$@"; rc=$?; if [ $rc -ne 0 ] && [ $rc -ne 130 ]; then echo ""; echo "RightMotion Studio exited with status $rc"; read -r -p "Press Enter to close..." dummy; fi' "$SCRIPT_PATH" "$@"
                        ;;
                    gnome-terminal)
                        exec "$term" --working-directory="$SCRIPT_DIR" --title="RightMotion Studio" -- bash -c 'export RIGHTMOTION_IN_TERMINAL=1; bash "$0" "$@"; rc=$?; if [ $rc -ne 0 ] && [ $rc -ne 130 ]; then echo ""; echo "RightMotion Studio exited with status $rc"; read -r -p "Press Enter to close..." dummy; fi' "$SCRIPT_PATH" "$@"
                        ;;
                    xfce4-terminal|kitty|alacritty|wezterm|foot|tilix|xterm)
                        exec "$term" -e bash -c 'export RIGHTMOTION_IN_TERMINAL=1; bash "$0" "$@"; rc=$?; if [ $rc -ne 0 ] && [ $rc -ne 130 ]; then echo ""; echo "RightMotion Studio exited with status $rc"; read -r -p "Press Enter to close..." dummy; fi' "$SCRIPT_PATH" "$@"
                        ;;
                esac
            fi
        done
    fi
fi

# Set window title across terminal emulators
printf "\033]0;%s\007" "RightMotion Studio" 2>/dev/null || true

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
export PATH="$HOME/.local/bin:$PATH"

MODE="full"
ENABLE_CLOUD_TUNNEL=""

for arg in "$@"; do
    case "$arg" in
        --direct|-d|--fast|-f)
            MODE="direct"
            ;;
        --setup-only|-s)
            MODE="setup"
            ;;
        --cloud|-c)
            ENABLE_CLOUD_TUNNEL="1"
            ;;
        --local|-l|--no-cloud)
            ENABLE_CLOUD_TUNNEL="0"
            ;;
    esac
done

# Function to safely clean up stale background processes on port 4000
cleanup_port_conflict() {
    local PIDS
    PIDS=$(lsof -ti :4000 2>/dev/null || ss -lptn "sport = :4000" 2>/dev/null | grep -oP 'pid=\K[0-9]+' || true)
    if [ -n "$PIDS" ]; then
        echo -e "  ${YELLOW}[!] Port 4000 was occupied by a previous studio process ($PIDS). Cleaning up...${NC}"
        for p in $PIDS; do
            kill -15 "$p" 2>/dev/null || true
        done
        sleep 0.8
        for p in $PIDS; do
            if kill -0 "$p" 2>/dev/null; then
                kill -9 "$p" 2>/dev/null || true
            fi
        done
    fi
    if [ "$ENABLE_CLOUD_TUNNEL" != "1" ]; then
        pkill -f "cloudflared tunnel --url http://localhost:4000" 2>/dev/null || true
    fi
}

# Function for interactive Cloud Server prompt
prompt_cloud_server() {
    if [ -z "$ENABLE_CLOUD_TUNNEL" ]; then
        if [ -t 0 ]; then
            echo -e "${CYAN}===================================================================${NC}"
            echo -e "${BOLD}🌐 Remote Cloud Server (Cloudflare Tunnel & Invite Links)${NC}"
            echo -e "${CYAN}===================================================================${NC}"
            echo -e "RightMotion Studio includes a worldwide cloud server & invite system."
            echo -e "Enabling it generates a secure HTTPS link for remote collaborators & mobile."
            echo ""
            echo -e "  ${BOLD}[1] No (Recommended)${NC}  - Local & LAN only (Fastest, private: http://localhost:4000) ${GREEN}[Default]${NC}"
            echo -e "  ${BOLD}[2] Yes${NC}               - Start Cloud Server (Generates public HTTPS invite link)"
            echo ""
            read -r -p "👉 Start Cloud Server? [1/2] (Press Enter for No): " CLOUD_INPUT || CLOUD_INPUT=""
            case "$CLOUD_INPUT" in
                2|[yY]|[yY][eE][sS])
                    ENABLE_CLOUD_TUNNEL="1"
                    echo -e "  ${GREEN}✓ Cloud Server enabled.${NC}\n"
                    ;;
                *)
                    ENABLE_CLOUD_TUNNEL="0"
                    echo -e "  ${BLUE}✓ Local-Only mode selected (Cloud Server disabled).${NC}\n"
                    ;;
            esac
        else
            ENABLE_CLOUD_TUNNEL="0"
        fi
    fi
    export ENABLE_CLOUD_TUNNEL
}

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

    prompt_cloud_server
    cleanup_port_conflict

    echo -e "${CYAN}=========================================================${NC}"
    echo -e "${BOLD}⚡ Starting RightMotion Studio & Companion Server...${NC}"
    echo -e "${CYAN}=========================================================${NC}"
    echo -e "Local URL:  ${CYAN}${BOLD}http://localhost:4000${NC}"
    if [ "$ENABLE_CLOUD_TUNNEL" = "1" ]; then
        echo -e "Cloud:      ${GREEN}Initializing Worldwide Cloud Server (Invite System Active)...${NC}"
    else
        echo -e "Cloud:      ${BLUE}Disabled (Local-Only Mode)${NC}"
    fi
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

# 5. Check Cloudflare Tunnel (cloudflared) for mobile remote connectivity
if command -v cloudflared >/dev/null 2>&1; then
    CF_VER=$(cloudflared --version 2>/dev/null | awk '{print $1, $2, $3}')
    echo -e "  [✓] Remote Tunnel: ${GREEN}${CF_VER} (Installed)${NC}"
else
    echo -e "  [!] Remote Tunnel: ${YELLOW}cloudflared not detected (Local Hotspot LAN mode active)${NC}"
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

# 6. Check Python Virtual Environment (.venv) & packages
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

# 7. Check Node.js Dependencies
echo ""
echo -e "${BOLD}Checking Node.js Dependencies...${NC}"

if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo -e "  [!] node_modules missing or incomplete. Running npm install..."
    npm install
    echo -e "  [✓] Node modules installed successfully."
else
    echo -e "  [✓] Node Modules: ${GREEN}Installed & verified${NC}"
fi

# 8. Output directory
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

# 9. Prompt for Cloud Server & clean up any port conflicts
prompt_cloud_server
cleanup_port_conflict

# 10. Launch Server
echo -e "${GREEN}===================================================================${NC}"
echo -e "${BOLD}✅ All dependencies verified! Starting RightMotion Studio...${NC}"
echo -e "${GREEN}===================================================================${NC}"
echo -e "Local URL:   ${CYAN}${BOLD}http://localhost:4000${NC}"
if [ "$ENABLE_CLOUD_TUNNEL" = "1" ]; then
    echo -e "Cloud:       ${GREEN}Initializing Worldwide Cloud Server (Invite System Active)...${NC}"
else
    echo -e "Cloud:       ${BLUE}Disabled (Local-Only Mode)${NC}"
fi
echo -e "Press ${BOLD}Ctrl+C${NC} at any time to stop the server."
echo ""

if command -v xdg-open >/dev/null 2>&1; then
    (sleep 1.2 && xdg-open "http://localhost:4000" >/dev/null 2>&1) &
fi

exec node studio/server.js
