#!/usr/bin/env python3
"""
Script para executar SQL diretamente no Supabase
"""

import os
import sys
from pathlib import Path
import requests
import json

# Adicionar o diretório backend ao path
CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.append(str(CURRENT_DIR))

from app.core.config import settings


def execute_sql_direct(sql_command):
    """Executa SQL diretamente via API do Supabase"""
    url = f"{settings.SUPABASE_URL}/rest/v1/rpc/exec"
    
    headers = {
        "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "sql": sql_command
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            return True, response.json()
        else:
            return False, response.text
    except Exception as e:
        return False, str(e)


def setup_database_direct():
    """Configura o banco usando API direta"""
    print("🔧 Configurando banco de dados via API direta...")
    
    # Verificar configurações
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        print("❌ Configurações do Supabase não encontradas")
        return False
    
    # Ler schema SQL
    schema_path = Path(__file__).parent.parent / "database" / "schema.sql"
    if not schema_path.exists():
        print(f"❌ Arquivo schema.sql não encontrado: {schema_path}")
        return False
    
    with open(schema_path, 'r', encoding='utf-8') as f:
        schema_sql = f.read()
    
    print("📄 Schema SQL carregado")
    
    # Dividir em comandos
    commands = [cmd.strip() for cmd in schema_sql.split(';') if cmd.strip()]
    
    print(f"🔨 Executando {len(commands)} comandos SQL...")
    
    success_count = 0
    for i, command in enumerate(commands, 1):
        if command.upper().startswith(('CREATE', 'ALTER', 'DROP', 'INSERT', 'UPDATE')):
            success, result = execute_sql_direct(command)
            if success:
                print(f"   ✅ Comando {i}/{len(commands)} executado")
                success_count += 1
            else:
                # Ignorar erros de "já existe"
                if any(msg in str(result).lower() for msg in ['already exists', 'duplicate', 'exists']):
                    print(f"   ⚠️  Comando {i}/{len(commands)} já existe (ignorado)")
                    success_count += 1
                else:
                    print(f"   ❌ Erro no comando {i}/{len(commands)}: {result}")
        else:
            print(f"   ⏭️  Comando {i}/{len(commands)} ignorado (não é DDL)")
    
    print(f"✅ {success_count}/{len(commands)} comandos executados com sucesso!")
    return success_count > 0


def test_connection():
    """Testa conexão com Supabase"""
    print("🔍 Testando conexão com Supabase...")
    
    url = f"{settings.SUPABASE_URL}/rest/v1/"
    headers = {
        "apikey": settings.SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_ANON_KEY}"
    }
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            print("✅ Conexão com Supabase estabelecida")
            return True
        else:
            print(f"❌ Erro na conexão: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Erro na conexão: {e}")
        return False


def main():
    """Função principal"""
    print("🚀 Configuração do banco de dados OrBee.Online (API Direta)\n")
    
    # Testar conexão
    if not test_connection():
        print("❌ Falha na conexão com Supabase")
        return
    
    # Configurar banco
    if setup_database_direct():
        print("\n" + "="*50)
        print("✅ Banco de dados configurado com sucesso!")
        print("📝 Próximos passos:")
        print("   1. Verifique as tabelas no painel do Supabase")
        print("   2. Teste os endpoints da API")
        print("   3. Configure autenticação JWT")
        print("="*50)
    else:
        print("\n" + "="*50)
        print("❌ Falha na configuração do banco de dados")
        print("📝 Verifique:")
        print("   1. Credenciais do Supabase no .env")
        print("   2. Permissões do service role key")
        print("   3. Extensões habilitadas no Supabase")
        print("="*50)


if __name__ == "__main__":
    main()
