from supabase import create_client, Client
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Cliente Supabase global
supabase: Client = None


def get_supabase_client() -> Client:
    """Retorna o cliente Supabase configurado"""
    global supabase
    if supabase is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            raise ValueError("Configurações do Supabase não encontradas")
        
        supabase = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY
        )
        logger.info("Cliente Supabase inicializado")
    
    return supabase


async def init_db():
    """Inicializa a conexão com o banco de dados"""
    try:
        client = get_supabase_client()
        # Teste de conexão
        response = client.table('users').select('id').limit(1).execute()
        logger.info("Conexão com Supabase estabelecida com sucesso")
    except Exception as e:
        logger.warning(f"Erro ao conectar com Supabase: {e}")
        logger.info("Continuando sem conexão com banco (modo desenvolvimento)")


def get_db() -> Client:
    """Dependency para obter cliente do banco"""
    return get_supabase_client()