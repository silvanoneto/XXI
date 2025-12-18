#!/bin/bash
# =============================================================================
# Paêbirú XXI - Instalação de Dependências
# =============================================================================

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║        Paêbirú XXI - Instalação de Dependências              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Detectar sistema operacional
OS="$(uname -s)"

# -----------------------------------------------------------------------------
# Dependências do Sistema
# -----------------------------------------------------------------------------
echo "📦 Instalando dependências do sistema..."
echo ""

case "$OS" in
    Darwin)
        echo "🍎 Sistema detectado: macOS"
        if ! command -v brew &> /dev/null; then
            echo "❌ Homebrew não encontrado. Instale em: https://brew.sh"
            exit 1
        fi

        # Cairo é necessário para cairosvg
        if ! brew list cairo &> /dev/null; then
            echo "   → Instalando Cairo..."
            brew install cairo
        else
            echo "   ✓ Cairo já instalado"
        fi
        ;;

    Linux)
        echo "🐧 Sistema detectado: Linux"
        if command -v apt-get &> /dev/null; then
            echo "   → Instalando dependências via apt..."
            sudo apt-get update
            sudo apt-get install -y libcairo2-dev libffi-dev
        elif command -v dnf &> /dev/null; then
            echo "   → Instalando dependências via dnf..."
            sudo dnf install -y cairo-devel libffi-devel
        elif command -v pacman &> /dev/null; then
            echo "   → Instalando dependências via pacman..."
            sudo pacman -S --noconfirm cairo
        else
            echo "❌ Gerenciador de pacotes não suportado"
            echo "   Instale manualmente: cairo, libffi"
            exit 1
        fi
        ;;

    *)
        echo "❌ Sistema operacional não suportado: $OS"
        exit 1
        ;;
esac

echo ""

# -----------------------------------------------------------------------------
# Dependências Python
# -----------------------------------------------------------------------------
echo "🐍 Instalando dependências Python..."
echo ""

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado"
    exit 1
fi

# Verificar se pip está instalado
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 não encontrado"
    exit 1
fi

# Instalar dependências do requirements.txt
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REQUIREMENTS_FILE="$SCRIPT_DIR/requirements.txt"

if [ -f "$REQUIREMENTS_FILE" ]; then
    echo "   → Instalando pacotes de requirements.txt..."
    pip3 install -r "$REQUIREMENTS_FILE"
else
    echo "❌ Arquivo requirements.txt não encontrado"
    exit 1
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              ✅ Instalação concluída com sucesso!            ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "Para gerar o EPUB, execute:"
echo "  ./epub_build.sh"
echo ""
