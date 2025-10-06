from supabase import create_client, Client
from app.core.config import settings
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Global Supabase client
supabase: Optional[Client] = None


def get_supabase_client() -> Optional[Client]:
    """Returns configured Supabase client"""
    global supabase
    if supabase is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
            logger.warning("Supabase configuration not found - development mode")
            return None
        
        try:
            # Try to import and create Supabase client
            from supabase import create_client
            supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
            logger.info("Supabase client initialized successfully")
        except ImportError as e:
            logger.error(f"Error importing Supabase: {e}")
            logger.info("Install Supabase: pip install supabase")
            return None
        except Exception as e:
            logger.error(f"Error initializing Supabase: {e}")
            return None
    
    return supabase


def get_supabase_service_client() -> Optional[Client]:
    """Returns Supabase client with service role key for administrative operations"""
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        logger.warning("Service role key not configured")
        return None
    
    try:
        from supabase import create_client
        service_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
        logger.info("Supabase client (service role) initialized")
        return service_client
    except Exception as e:
        logger.error(f"Error initializing Supabase client (service role): {e}")
        return None


async def init_db():
    """Initializes database connection"""
    try:
        client = get_supabase_client()
        if client is None:
            logger.info("Development mode - Supabase not configured")
            return
            
        # Connection test
        response = client.table('users').select('id').limit(1).execute()
        logger.info("Supabase connection established successfully")
    except Exception as e:
        logger.warning(f"Error connecting to Supabase: {e}")
        logger.info("Continuing without database connection (development mode)")


def get_db() -> Optional[Client]:
    """Dependency to get database client"""
    return get_supabase_client()


def get_service_db() -> Optional[Client]:
    """Dependency to get database client with service role"""
    return get_supabase_service_client()