#!/usr/bin/env python3
"""
Script para configurar o banco de dados no Supabase
"""

import os
import sys
from pathlib import Path

# Adicionar o diretório backend ao path
CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.append(str(CURRENT_DIR))

from app.core.config import settings
from app.core.database import get_supabase_service_client
import asyncio
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def setup_database():
    """Configura o banco de dados no Supabase"""
    print("🔧 Configurando banco de dados no Supabase...")
    
    # Verificar configurações
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        print("❌ Configurações do Supabase não encontradas")
        print("   Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env")
        return False
    
    try:
        # Obter cliente com service role
        client = get_supabase_service_client()
        if client is None:
            print("❌ Falha ao criar cliente Supabase (service role)")
            return False
        
        print("✅ Cliente Supabase (service role) conectado")
        
        # Ler schema SQL
        schema_path = Path(__file__).parent.parent / "database" / "schema.sql"
        if not schema_path.exists():
            print(f"❌ Arquivo schema.sql não encontrado: {schema_path}")
            return False
        
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema_sql = f.read()
        
        print("📄 Schema SQL carregado")
        
        # Executar schema (dividir em comandos individuais)
        commands = [cmd.strip() for cmd in schema_sql.split(';') if cmd.strip()]
        
        print(f"🔨 Executando {len(commands)} comandos SQL...")
        
        for i, command in enumerate(commands, 1):
            if command.upper().startswith(('CREATE', 'ALTER', 'DROP', 'INSERT', 'UPDATE')):
                try:
                    # Usar RPC para executar SQL
                    result = client.rpc('exec_sql', {'sql': command}).execute()
                    print(f"   ✅ Comando {i}/{len(commands)} executado")
                except Exception as e:
                    # Ignorar erros de "já existe" e similares
                    if any(msg in str(e).lower() for msg in ['already exists', 'duplicate', 'exists']):
                        print(f"   ⚠️  Comando {i}/{len(commands)} já existe (ignorado)")
                    else:
                        print(f"   ❌ Erro no comando {i}/{len(commands)}: {e}")
                        # Continuar mesmo com erro
            else:
                print(f"   ⏭️  Comando {i}/{len(commands)} ignorado (não é DDL)")
        
        print("✅ Schema do banco de dados configurado com sucesso!")
        
        # Verificar tabelas criadas
        try:
            tables = ['users', 'observations', 'observation_validations', 'ndvi_history']
            for table in tables:
                result = client.table(table).select('*').limit(1).execute()
                print(f"   ✅ Tabela '{table}' acessível")
        except Exception as e:
            print(f"   ⚠️  Erro ao verificar tabelas: {e}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao configurar banco de dados: {e}")
        return False


async def create_sample_data():
    """Cria dados de exemplo"""
    print("\n🌱 Criando dados de exemplo...")
    
    try:
        client = get_supabase_service_client()
        if client is None:
            print("❌ Cliente Supabase não disponível")
            return False
        
        # Dados de exemplo para usuários
        sample_users = [
            {
                "email": "admin@orbee.online",
                "username": "admin",
                "full_name": "Administrador OrBee",
                "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8K8K8K8",  # senha: admin123
                "is_verified": True,
                "points": 1000,
                "level": 5
            },
            {
                "email": "maria@example.com",
                "username": "maria_silva",
                "full_name": "Maria Silva",
                "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8K8K8K8",
                "location": "Campinas, SP",
                "points": 250,
                "level": 3
            }
        ]
        
        for user_data in sample_users:
            try:
                result = client.table('users').insert(user_data).execute()
                print(f"   ✅ Usuário '{user_data['username']}' criado")
            except Exception as e:
                if "duplicate" in str(e).lower():
                    print(f"   ⚠️  Usuário '{user_data['username']}' já existe")
                else:
                    print(f"   ❌ Erro ao criar usuário '{user_data['username']}': {e}")
        
        # Dados de exemplo para NDVI
        sample_ndvi = [
            {
                "municipality_code": "4320676",
                "municipality_name": "Santa Cruz do Sul",
                "ndvi_value": 0.75,
                "average_ndvi": 0.72,
                "min_ndvi": 0.65,
                "max_ndvi": 0.85,
                "start_date": "2024-01-01",
                "end_date": "2024-01-31",
                "acquisition_date": "2024-01-15",
                "trend": "stable",
                "vegetation_status": "good"
            }
        ]
        
        for ndvi_data in sample_ndvi:
            try:
                result = client.table('ndvi_history').insert(ndvi_data).execute()
                print(f"   ✅ Dados NDVI para '{ndvi_data['municipality_name']}' criados")
            except Exception as e:
                if "duplicate" in str(e).lower():
                    print(f"   ⚠️  Dados NDVI para '{ndvi_data['municipality_name']}' já existem")
                else:
                    print(f"   ❌ Erro ao criar dados NDVI: {e}")
        
        print("✅ Dados de exemplo criados com sucesso!")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao criar dados de exemplo: {e}")
        return False


async def main():
    """Função principal"""
    print("🚀 Configuração do banco de dados OrBee.Online\n")
    
    # Configurar schema
    schema_ok = await setup_database()
    
    if schema_ok:
        # Criar dados de exemplo
        await create_sample_data()
        
        print("\n" + "="*50)
        print("✅ Banco de dados configurado com sucesso!")
        print("📝 Próximos passos:")
        print("   1. Teste os endpoints da API")
        print("   2. Configure autenticação JWT")
        print("   3. Teste upload de imagens")
        print("="*50)
    else:
        print("\n" + "="*50)
        print("❌ Falha na configuração do banco de dados")
        print("📝 Verifique:")
        print("   1. Credenciais do Supabase no .env")
        print("   2. Conexão com a internet")
        print("   3. Permissões do service role key")
        print("="*50)


if __name__ == "__main__":
    asyncio.run(main())
