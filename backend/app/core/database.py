from supabase import create_client, Client
from app.core.config import settings
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Cliente Supabase global
supabase: Optional[Client] = None


def get_supabase_client() -> Optional[Client]:
    """Retorna o cliente Supabase configurado"""
    global supabase
    if supabase is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
            logger.warning("Configurações do Supabase não encontradas - modo desenvolvimento")
            return None
        
        try:
            # Tentar importar e criar cliente Supabase
            from supabase import create_client
            supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
            logger.info("Cliente Supabase inicializado com sucesso")
        except ImportError as e:
            logger.error(f"Erro ao importar Supabase: {e}")
            logger.info("Instale o Supabase: pip install supabase")
            return None
        except Exception as e:
            logger.error(f"Erro ao inicializar Supabase: {e}")
            return None
    
    return supabase


def get_supabase_service_client() -> Optional[Client]:
    """Retorna o cliente Supabase com service role key para operações administrativas"""
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        logger.warning("Service role key não configurada")
        return None
    
    try:
        from supabase import create_client
        service_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
        logger.info("Cliente Supabase (service role) inicializado")
        return service_client
    except Exception as e:
        logger.error(f"Erro ao inicializar cliente Supabase (service role): {e}")
        return None


async def init_db():
    """Inicializa a conexão com o banco de dados"""
    try:
        client = get_supabase_client()
        if client is None:
            logger.info("Modo desenvolvimento - Supabase não configurado")
            return
            
        # Teste de conexão
        response = client.table('users').select('id').limit(1).execute()
        logger.info("Conexão com Supabase estabelecida com sucesso")
    except Exception as e:
        logger.warning(f"Erro ao conectar com Supabase: {e}")
        logger.info("Continuando sem conexão com banco (modo desenvolvimento)")


def get_db() -> Optional[Client]:
    """Dependency para obter cliente do banco"""
    return get_supabase_client()


def get_service_db() -> Optional[Client]:
    """Dependency para obter cliente do banco com service role"""
    return get_supabase_service_client()