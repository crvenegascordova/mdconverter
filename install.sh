#!/usr/bin/env bash
# mdconverter - Automated Global Installer for Linux & macOS

set -e

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}===================================================${NC}"
echo -e "${CYAN} 🚀 Installing mdconverter globally (Linux / macOS)${NC}"
echo -e "${CYAN}===================================================${NC}"

# 1. Determine Runtime (Bun or Node)
if command -v bun &> /dev/null; then
    RUNTIME="bun"
    echo -e "${GREEN}✓ Found Bun runtime${NC}"
elif command -v node &> /dev/null || command -v npm &> /dev/null; then
    RUNTIME="node"
    echo -e "${GREEN}✓ Found Node.js / npm runtime${NC}"
else
    echo -e "${RED}❌ Error: Neither Bun nor Node.js/npm were found on your system.${NC}"
    echo -e "${YELLOW}Please install Bun (https://bun.sh) or Node.js (https://nodejs.org) first.${NC}"
    exit 1
fi

# 2. Install Dependencies
echo -e "\n${CYAN}📦 Installing project dependencies...${NC}"
if [ "$RUNTIME" = "bun" ]; then
    bun install
else
    npm install
fi

# 3. Build Executable or JS Bundle
echo -e "\n${CYAN}⚙️ Building project...${NC}"
if [ "$RUNTIME" = "bun" ]; then
    bun run build
else
    npm run build
    # Create Node wrapper executable if Bun binary wasn't built
    if [ ! -f "./dist/mdconverter" ]; then
        echo '#!/usr/bin/env node' > ./dist/mdconverter
        echo 'import "./index.js";' >> ./dist/mdconverter
        chmod +x ./dist/mdconverter
    fi
fi

# 4. Determine Target Global Installation Path
INSTALL_DIR=""

if [ -w "/usr/local/bin" ]; then
    INSTALL_DIR="/usr/local/bin"
elif [ -d "$HOME/.local/bin" ]; then
    INSTALL_DIR="$HOME/.local/bin"
    mkdir -p "$INSTALL_DIR"
elif [ -d "$HOME/.bun/bin" ]; then
    INSTALL_DIR="$HOME/.bun/bin"
else
    INSTALL_DIR="/usr/local/bin"
fi

echo -e "\n${CYAN}🔗 Installing 'mdconverter' binary to ${INSTALL_DIR}...${NC}"

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ "$INSTALL_DIR" = "/usr/local/bin" ] && [ ! -w "/usr/local/bin" ]; then
    echo -e "${YELLOW}Superuser privileges needed to link to /usr/local/bin:${NC}"
    sudo ln -sf "${PROJECT_DIR}/dist/mdconverter" "$INSTALL_DIR/mdconverter"
else
    ln -sf "${PROJECT_DIR}/dist/mdconverter" "$INSTALL_DIR/mdconverter"
fi

chmod +x "$INSTALL_DIR/mdconverter"

echo -e "\n${GREEN}===================================================${NC}"
echo -e "${GREEN} ✨ mdconverter installed successfully!${NC}"
echo -e "${GREEN}===================================================${NC}"
echo -e "You can now run ${CYAN}mdconverter${NC} from ANY directory using ${CYAN}Node.js${NC} or ${CYAN}Bun${NC}:"
echo -e "  ${CYAN}mdconverter mi_documento.md -f all${NC}\n"
