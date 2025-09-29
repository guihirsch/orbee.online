#!/usr/bin/env python3
"""
Script para adicionar a coluna 'role' à tabela 'users' no Supabase
"""

from supabase import create_client
from app.core.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def add_role_column():
    """Adiciona a coluna role à tabela users"""
    try:
        # Conectar ao Supabase
        supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
        
        # SQL para adicionar a coluna role
        sql = """
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'citizen';
        """
        
        logger.info("Adicionando coluna 'role' à tabela 'users'...")
        
        # Executar SQL via RPC (se disponível) ou via query direta
        try:
            # Tentar via RPC
            result = supabase.rpc('exec', {'sql': sql}).execute()
            logger.info("✅ Coluna 'role' adicionada com sucesso via RPC")
            return True
        except Exception as e:
            logger.warning(f"RPC não disponível: {e}")
            
            # Tentar via query direta (pode não funcionar para DDL)
            try:
                result = supabase.postgrest.rpc('exec', {'sql': sql}).execute()
                logger.info("✅ Coluna 'role' adicionada com sucesso via query direta")
                return True
            except Exception as e2:
                logger.error(f"Erro ao executar SQL: {e2}")
                
                # Como alternativa, vamos verificar se a coluna já existe
                logger.info("Verificando se a coluna 'role' já existe...")
                try:
                    # Tentar fazer uma query que inclua a coluna role
                    test_result = supabase.table('users').select('role').limit(1).execute()
                    logger.info("✅ Coluna 'role' já existe na tabela")
                    return True
                except Exception as e3:
                    logger.error(f"Coluna 'role' não existe: {e3}")
                    logger.info("❌ Não foi possível adicionar a coluna 'role' automaticamente")
                    logger.info("💡 Adicione manualmente no dashboard do Supabase:")
                    logger.info("   ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'citizen';")
                    return False
        
    except Exception as e:
        logger.error(f"Erro ao conectar ao Supabase: {e}")
        return False

if __name__ == "__main__":
    add_role_column()
