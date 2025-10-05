#!/usr/bin/env python3
"""
Script de migração para configurar o banco de dados OrBee.Online no Supabase

Este script:
1. Conecta ao Supabase usando as credenciais do .env
2. Executa o schema.sql para criar as tabelas
3. Executa o seed.sql para inserir dados iniciais
4. Configura políticas RLS (Row Level Security)
5. Verifica a integridade dos dados

Uso:
    python migrate.py [--reset] [--seed-only] [--verify-only]
"""

import os
import sys
import argparse
from pathlib import Path
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor
import logging

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_environment():
    """Carrega variáveis de ambiente do arquivo .env"""
    env_path = Path(__file__).parent.parent / '.env'
    if env_path.exists():
        load_dotenv(env_path)
        logger.info(f"Carregadas variáveis de ambiente de {env_path}")
    else:
        logger.warning("Arquivo .env não encontrado. Usando variáveis do sistema.")
    
    # Verificar variáveis obrigatórias
    required_vars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        logger.error(f"Variáveis de ambiente obrigatórias não encontradas: {missing_vars}")
        sys.exit(1)

def get_database_connection():
    """Cria conexão com o banco de dados Supabase"""
    try:
        # Extrair informações da URL do Supabase
        supabase_url = os.getenv('SUPABASE_URL')
        service_key = os.getenv('SUPABASE_SERVICE_KEY')
        
        # Construir string de conexão PostgreSQL
        # Supabase URL format: https://xxxxx.supabase.co
        project_id = supabase_url.replace('https://', '').replace('.supabase.co', '')
        
        connection_string = f"postgresql://postgres:{service_key}@db.{project_id}.supabase.co:5432/postgres"
        
        conn = psycopg2.connect(
            connection_string,
            cursor_factory=RealDictCursor
        )
        
        logger.info("Conexão com Supabase estabelecida com sucesso")
        return conn
        
    except Exception as e:
        logger.error(f"Erro ao conectar com o banco de dados: {e}")
        sys.exit(1)

def execute_sql_file(conn, file_path, description):
    """Executa um arquivo SQL"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            sql_content = file.read()
        
        logger.info(f"Executando {description}...")
        
        with conn.cursor() as cursor:
            # Executar o SQL em uma transação
            cursor.execute(sql_content)
            conn.commit()
        
        logger.info(f"{description} executado com sucesso")
        
    except Exception as e:
        logger.error(f"Erro ao executar {description}: {e}")
        conn.rollback()
        raise

def setup_rls_policies(conn):
    """Configura políticas de Row Level Security"""
    rls_policies = """
    -- Habilitar RLS nas tabelas principais
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    ALTER TABLE observations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE observation_validations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE monitored_areas ENABLE ROW LEVEL SECURITY;
    ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
    ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
    
    -- Políticas para usuários
    CREATE POLICY "Users can view their own profile" ON users
        FOR SELECT USING (auth.uid()::text = id::text);
    
    CREATE POLICY "Users can update their own profile" ON users
        FOR UPDATE USING (auth.uid()::text = id::text);
    
    -- Políticas para observações
    CREATE POLICY "Anyone can view public observations" ON observations
        FOR SELECT USING (visibility = 'public' AND deleted_at IS NULL);
    
    CREATE POLICY "Users can view their own observations" ON observations
        FOR SELECT USING (auth.uid()::text = user_id::text);
    
    CREATE POLICY "Users can create observations" ON observations
        FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
    
    CREATE POLICY "Users can update their own observations" ON observations
        FOR UPDATE USING (auth.uid()::text = user_id::text);
    
    -- Políticas para validações
    CREATE POLICY "Anyone can view validations of public observations" ON observation_validations
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM observations 
                WHERE observations.id = observation_validations.observation_id 
                AND observations.visibility = 'public'
                AND observations.deleted_at IS NULL
            )
        );
    
    CREATE POLICY "Users can create validations" ON observation_validations
        FOR INSERT WITH CHECK (auth.uid()::text = validator_id::text);
    
    -- Políticas para áreas monitoradas
    CREATE POLICY "Users can view their own monitored areas" ON monitored_areas
        FOR SELECT USING (auth.uid()::text = user_id::text);
    
    CREATE POLICY "Users can manage their own monitored areas" ON monitored_areas
        FOR ALL USING (auth.uid()::text = user_id::text);
    
    -- Políticas para alertas
    CREATE POLICY "Users can view their own alerts" ON alerts
        FOR SELECT USING (auth.uid()::text = user_id::text);
    
    -- Políticas para conquistas
    CREATE POLICY "Users can view their own achievements" ON user_achievements
        FOR SELECT USING (auth.uid()::text = user_id::text);
    
    -- Tabelas públicas (somente leitura)
    CREATE POLICY "Anyone can view achievements" ON achievements
        FOR SELECT USING (is_active = true);
    
    CREATE POLICY "Anyone can view recommendations" ON recommendations
        FOR SELECT USING (is_active = true);
    
    CREATE POLICY "Anyone can view NDVI data" ON ndvi_data
        FOR SELECT USING (true);
    """
    
    try:
        logger.info("Configurando políticas RLS...")
        
        with conn.cursor() as cursor:
            cursor.execute(rls_policies)
            conn.commit()
        
        logger.info("Políticas RLS configuradas com sucesso")
        
    except Exception as e:
        logger.error(f"Erro ao configurar políticas RLS: {e}")
        conn.rollback()
        raise

def verify_database(conn):
    """Verifica a integridade do banco de dados"""
    verification_queries = [
        ("Contagem de usuários", "SELECT COUNT(*) as count FROM users"),
        ("Contagem de observações", "SELECT COUNT(*) as count FROM observations"),
        ("Contagem de conquistas", "SELECT COUNT(*) as count FROM achievements"),
        ("Contagem de recomendações", "SELECT COUNT(*) as count FROM recommendations"),
        ("Contagem de dados NDVI", "SELECT COUNT(*) as count FROM ndvi_data"),
        ("Usuários com conquistas", """
            SELECT u.username, COUNT(ua.id) as achievements_count
            FROM users u
            LEFT JOIN user_achievements ua ON u.id = ua.user_id AND ua.is_unlocked = true
            GROUP BY u.id, u.username
            ORDER BY achievements_count DESC
        """),
        ("Observações por status", """
            SELECT status, COUNT(*) as count
            FROM observations
            WHERE deleted_at IS NULL
            GROUP BY status
            ORDER BY count DESC
        """),
        ("Dados NDVI por qualidade", """
            SELECT data_quality, COUNT(*) as count
            FROM ndvi_data
            GROUP BY data_quality
            ORDER BY count DESC
        """)
    ]
    
    logger.info("Verificando integridade do banco de dados...")
    
    try:
        with conn.cursor() as cursor:
            for description, query in verification_queries:
                cursor.execute(query)
                results = cursor.fetchall()
                
                logger.info(f"\n{description}:")
                for row in results:
                    if len(row) == 1:
                        logger.info(f"  Total: {row['count']}")
                    else:
                        logger.info(f"  {dict(row)}")
        
        logger.info("\nVerificação concluída com sucesso!")
        
    except Exception as e:
        logger.error(f"Erro na verificação: {e}")
        raise

def reset_database(conn):
    """Remove todas as tabelas para reset completo"""
    reset_sql = """
    -- Desabilitar RLS temporariamente
    ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS observations DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS observation_validations DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS monitored_areas DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS alerts DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS user_achievements DISABLE ROW LEVEL SECURITY;
    
    -- Remover políticas RLS
    DROP POLICY IF EXISTS "Users can view their own profile" ON users;
    DROP POLICY IF EXISTS "Users can update their own profile" ON users;
    DROP POLICY IF EXISTS "Anyone can view public observations" ON observations;
    DROP POLICY IF EXISTS "Users can view their own observations" ON observations;
    DROP POLICY IF EXISTS "Users can create observations" ON observations;
    DROP POLICY IF EXISTS "Users can update their own observations" ON observations;
    DROP POLICY IF EXISTS "Anyone can view validations of public observations" ON observation_validations;
    DROP POLICY IF EXISTS "Users can create validations" ON observation_validations;
    DROP POLICY IF EXISTS "Users can view their own monitored areas" ON monitored_areas;
    DROP POLICY IF EXISTS "Users can manage their own monitored areas" ON monitored_areas;
    DROP POLICY IF EXISTS "Users can view their own alerts" ON alerts;
    DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;
    DROP POLICY IF EXISTS "Anyone can view achievements" ON achievements;
    DROP POLICY IF EXISTS "Anyone can view recommendations" ON recommendations;
    DROP POLICY IF EXISTS "Anyone can view NDVI data" ON ndvi_data;
    
    -- Remover tabelas em ordem de dependência
    DROP TABLE IF EXISTS user_achievements CASCADE;
    DROP TABLE IF EXISTS observation_validations CASCADE;
    DROP TABLE IF EXISTS alerts CASCADE;
    DROP TABLE IF EXISTS observations CASCADE;
    DROP TABLE IF EXISTS monitored_areas CASCADE;
    DROP TABLE IF EXISTS ndvi_data CASCADE;
    DROP TABLE IF EXISTS recommendations CASCADE;
    DROP TABLE IF EXISTS achievements CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    
    -- Remover função de trigger
    DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
    """
    
    try:
        logger.info("Resetando banco de dados...")
        
        with conn.cursor() as cursor:
            cursor.execute(reset_sql)
            conn.commit()
        
        logger.info("Banco de dados resetado com sucesso")
        
    except Exception as e:
        logger.error(f"Erro ao resetar banco de dados: {e}")
        conn.rollback()
        raise

def main():
    parser = argparse.ArgumentParser(description='Migração do banco de dados OrBee.Online')
    parser.add_argument('--reset', action='store_true', help='Reset completo do banco de dados')
    parser.add_argument('--seed-only', action='store_true', help='Apenas inserir dados iniciais')
    parser.add_argument('--verify-only', action='store_true', help='Apenas verificar integridade')
    parser.add_argument('--no-rls', action='store_true', help='Pular configuração de RLS')
    
    args = parser.parse_args()
    
    # Carregar ambiente
    load_environment()
    
    # Conectar ao banco
    conn = get_database_connection()
    
    try:
        # Determinar arquivos SQL
        db_dir = Path(__file__).parent
        schema_file = db_dir / 'schema.sql'
        seed_file = db_dir / 'seed.sql'
        
        # Verificar se arquivos existem
        if not schema_file.exists():
            logger.error(f"Arquivo schema.sql não encontrado em {schema_file}")
            sys.exit(1)
        
        if not seed_file.exists():
            logger.error(f"Arquivo seed.sql não encontrado em {seed_file}")
            sys.exit(1)
        
        # Executar operações baseadas nos argumentos
        if args.verify_only:
            verify_database(conn)
        elif args.seed_only:
            execute_sql_file(conn, seed_file, "dados iniciais (seed.sql)")
            verify_database(conn)
        else:
            # Migração completa
            if args.reset:
                reset_database(conn)
            
            # Executar schema
            execute_sql_file(conn, schema_file, "schema do banco (schema.sql)")
            
            # Executar seed
            execute_sql_file(conn, seed_file, "dados iniciais (seed.sql)")
            
            # Configurar RLS
            if not args.no_rls:
                setup_rls_policies(conn)
            
            # Verificar integridade
            verify_database(conn)
        
        logger.info("\n🎉 Migração concluída com sucesso!")
        
    except Exception as e:
        logger.error(f"Erro durante a migração: {e}")
        sys.exit(1)
    
    finally:
        conn.close()
        logger.info("Conexão com banco de dados fechada")

if __name__ == '__main__':
    main()