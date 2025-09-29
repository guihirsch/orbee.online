#!/bin/bash

# Script para executar pré-processamento de municípios
# Uso: ./run_preload.sh [--once] [--schedule] [--cleanup]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verifica se o ambiente virtual está ativado
if [[ "$VIRTUAL_ENV" == "" ]]; then
    warning "Ambiente virtual não detectado. Ativando..."
    source ../.venv/bin/activate 2>/dev/null || {
        error "Ambiente virtual não encontrado. Execute: python -m venv .venv"
        exit 1
    }
fi

# Instala dependências se necessário
if [ ! -f "requirements.txt" ]; then
    error "Arquivo requirements.txt não encontrado"
    exit 1
fi

log "Instalando dependências..."
pip install -r requirements.txt

# Verifica variáveis de ambiente
if [ -z "$DATABASE_URL" ]; then
    warning "DATABASE_URL não definida. Usando padrão local..."
    export DATABASE_URL="postgresql://user:password@localhost:5432/orbee"
fi

# Função para executar uma vez
run_once() {
    log "Executando pré-processamento uma vez..."
    python preload_municipalities.py
    success "Pré-processamento concluído!"
}

# Função para executar agendador
run_schedule() {
    log "Iniciando agendador de pré-processamento..."
    python scheduler.py
}

# Função para limpar cache
cleanup_cache() {
    log "Limpando cache expirado..."
    python -c "
import asyncio
from preload_municipalities import MunicipalityPreloader

async def cleanup():
    preloader = MunicipalityPreloader()
    await preloader.cleanup_expired_cache()

asyncio.run(cleanup())
"
    success "Cache limpo!"
}

# Função para mostrar status
show_status() {
    log "Verificando status do cache..."
    python -c "
import asyncio
from preload_municipalities import MunicipalityPreloader

async def status():
    preloader = MunicipalityPreloader()
    with preloader.Session() as session:
        # Conta registros em cada tabela
        result = session.execute('''
            SELECT 
                (SELECT COUNT(*) FROM municipality_geometry_cache WHERE expires_at > NOW()) as geometry_count,
                (SELECT COUNT(*) FROM municipality_plan_cache WHERE expires_at > NOW()) as plan_count,
                (SELECT COUNT(*) FROM municipality_ndvi_cache WHERE expires_at > NOW()) as ndvi_count
        ''').fetchone()
        
        print(f'Geometrias em cache: {result[0]}')
        print(f'Planos em cache: {result[1]}')
        print(f'Dados NDVI em cache: {result[2]}')

asyncio.run(status())
"
}

# Processa argumentos
case "${1:-once}" in
    "--once")
        run_once
        ;;
    "--schedule")
        run_schedule
        ;;
    "--cleanup")
        cleanup_cache
        ;;
    "--status")
        show_status
        ;;
    "--help"|"-h")
        echo "Uso: $0 [opção]"
        echo ""
        echo "Opções:"
        echo "  --once      Executa pré-processamento uma vez"
        echo "  --schedule  Inicia agendador contínuo"
        echo "  --cleanup   Limpa cache expirado"
        echo "  --status    Mostra status do cache"
        echo "  --help      Mostra esta ajuda"
        echo ""
        echo "Exemplos:"
        echo "  $0 --once        # Executa uma vez"
        echo "  $0 --schedule    # Inicia agendador"
        echo "  $0 --status      # Verifica status"
        ;;
    *)
        error "Opção inválida: $1"
        echo "Use --help para ver as opções disponíveis"
        exit 1
        ;;
esac
