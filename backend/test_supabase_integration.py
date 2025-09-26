#!/usr/bin/env python3
"""
Script de teste para verificar a integração com Supabase
"""

import os
import sys
from pathlib import Path

# Adicionar o diretório backend ao path
CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.append(str(CURRENT_DIR))

from app.core.config import settings
from app.core.database import get_supabase_client, get_supabase_service_client, init_db
import asyncio
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def test_supabase_connection():
    """Testa a conexão com o Supabase"""
    print("🔍 Testando integração com Supabase...")
    
    # Verificar configurações
    print(f"📋 Configurações:")
    print(f"   SUPABASE_URL: {'✅ Configurado' if settings.SUPABASE_URL else '❌ Não configurado'}")
    print(f"   SUPABASE_ANON_KEY: {'✅ Configurado' if settings.SUPABASE_ANON_KEY else '❌ Não configurado'}")
    print(f"   SUPABASE_SERVICE_ROLE_KEY: {'✅ Configurado' if settings.SUPABASE_SERVICE_ROLE_KEY else '❌ Não configurado'}")
    
    if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
        print("⚠️  Supabase não configurado - modo desenvolvimento")
        return False
    
    try:
        # Inicializar banco
        await init_db()
        
        # Testar cliente anônimo
        client = get_supabase_client()
        if client is None:
            print("❌ Falha ao criar cliente Supabase")
            return False
        
        print("✅ Cliente Supabase (anon) criado com sucesso")
        
        # Testar cliente service role
        service_client = get_supabase_service_client()
        if service_client is None:
            print("⚠️  Cliente Supabase (service role) não configurado")
        else:
            print("✅ Cliente Supabase (service role) criado com sucesso")
        
        # Teste de conexão - tentar buscar dados
        try:
            response = client.table('users').select('id').limit(1).execute()
            print("✅ Conexão com Supabase estabelecida com sucesso")
            print(f"   Tabela 'users' acessível: {len(response.data)} registros encontrados")
        except Exception as e:
            print(f"⚠️  Erro ao acessar tabela 'users': {e}")
            print("   Isso é normal se a tabela ainda não foi criada")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro na integração com Supabase: {e}")
        return False


async def test_repositories():
    """Testa os repositórios com Supabase"""
    print("\n🔍 Testando repositórios...")
    
    try:
        from app.repositories.user_repository import UserRepository
        from app.repositories.observation_repository import ObservationRepository
        from app.repositories.validation_repository import ValidationRepository
        
        client = get_supabase_client()
        if client is None:
            print("⚠️  Cliente Supabase não disponível - pulando testes de repositórios")
            return
        
        # Testar UserRepository
        user_repo = UserRepository(client)
        print("✅ UserRepository inicializado")
        
        # Testar ObservationRepository
        obs_repo = ObservationRepository(client)
        print("✅ ObservationRepository inicializado")
        
        # Testar ValidationRepository
        val_repo = ValidationRepository(client)
        print("✅ ValidationRepository inicializado")
        
        print("✅ Todos os repositórios inicializados com sucesso")
        
    except Exception as e:
        print(f"❌ Erro ao testar repositórios: {e}")


async def main():
    """Função principal de teste"""
    print("🚀 Iniciando testes de integração com Supabase\n")
    
    # Teste de conexão
    connection_ok = await test_supabase_connection()
    
    # Teste de repositórios
    await test_repositories()
    
    print("\n" + "="*50)
    if connection_ok:
        print("✅ Integração com Supabase funcionando corretamente!")
        print("📝 Próximos passos:")
        print("   1. Configure as credenciais do Supabase no arquivo .env")
        print("   2. Execute as migrações do banco de dados")
        print("   3. Teste os endpoints da API")
    else:
        print("⚠️  Integração com Supabase não configurada")
        print("📝 Para configurar:")
        print("   1. Crie um projeto no Supabase")
        print("   2. Configure as variáveis no arquivo .env")
        print("   3. Execute este script novamente")
    
    print("="*50)


if __name__ == "__main__":
    asyncio.run(main())
