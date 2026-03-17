#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=========================================="
echo "  PMS Frontend - Docker Run Script"
echo "=========================================="

# -----------------------------------------------------------------------------
# 1. Check / Install Docker
# -----------------------------------------------------------------------------
install_docker() {
    echo ""
    echo ">>> Installing Docker..."
    if command -v curl &>/dev/null; then
        curl -fsSL https://get.docker.com | sh
    else
        echo "Error: curl is required to install Docker. Install curl first."
        exit 1
    fi
    # Add current user to docker group to run without sudo
    if [ -n "$SUDO_USER" ]; then
        usermod -aG docker "$SUDO_USER" 2>/dev/null || true
    fi
    echo ">>> Docker installed successfully."
}

if ! command -v docker &>/dev/null; then
    echo "Docker not found. Installing..."
    if [ "$(id -u)" -eq 0 ]; then
        install_docker
    else
        echo "Please run with sudo to install Docker: sudo $0"
        exit 1
    fi
else
    echo ">>> Docker is installed: $(docker --version)"
fi

# -----------------------------------------------------------------------------
# 2. Check Docker Compose (plugin or standalone)
# -----------------------------------------------------------------------------
if docker compose version &>/dev/null; then
    COMPOSE_CMD="docker compose"
    echo ">>> Docker Compose (plugin) is available"
elif command -v docker-compose &>/dev/null; then
    COMPOSE_CMD="docker-compose"
    echo ">>> Docker Compose (standalone) is available"
else
    echo "Error: Docker Compose is required. Install it: https://docs.docker.com/compose/install/"
    exit 1
fi

# -----------------------------------------------------------------------------
# 3. Ensure .env exists
# -----------------------------------------------------------------------------
if [ ! -f .env ]; then
    echo ""
    echo ">>> No .env file found."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo ">>> Created .env from .env.example. Please edit .env with your values."
    else
        echo ">>> Creating minimal .env..."
        cat > .env << 'ENVEOF'
VITE_API_BASE_URL=http://localhost:3000
VITE_CHAT_API_BASE_URL=http://localhost:3001
VITE_CHAT_WS_URL=ws://localhost:3001
VITE_GEOAPIFY_API_KEY=
VITE_N8N_WEBHOOK_URL=
VITE_N8N_RAG_CHAT_URL=
ENVEOF
        echo ">>> Created .env. Please edit with your actual values."
    fi
fi

# -----------------------------------------------------------------------------
# 4. Fetch latest from origin/main
# -----------------------------------------------------------------------------
if [ -d .git ]; then
    echo ""
    echo ">>> Fetching latest changes from origin/main..."
    git fetch origin main 2>/dev/null || git fetch origin 2>/dev/null || true
    git pull origin main 2>/dev/null || git pull origin 2>/dev/null || true
    echo ">>> Repository is up to date."
else
    echo ">>> Not a git repo, skipping pull."
fi

# -----------------------------------------------------------------------------
# 5. Build and run
# -----------------------------------------------------------------------------
echo ""
echo ">>> Building Docker image..."
$COMPOSE_CMD build --no-cache

echo ""
echo ">>> Stopping any existing container..."
$COMPOSE_CMD down 2>/dev/null || true

echo ""
echo ">>> Starting PMS Frontend..."
$COMPOSE_CMD up -d

echo ""
echo "=========================================="
echo "  PMS Frontend is running!"
echo "  URL: http://localhost:5741"
echo "=========================================="
