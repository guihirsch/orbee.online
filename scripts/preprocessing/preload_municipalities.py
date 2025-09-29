#!/usr/bin/env python3
"""
Script de pré-processamento de dados municipais
Carrega dados de municípios em background para cache rápido
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import httpx
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from pathlib import Path

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class MunicipalityPreloader:
    def __init__(self):
        self.base_url = "http://localhost:8000"
        self.db_url = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/orbee")
        self.engine = create_engine(self.db_url)
        self.Session = sessionmaker(bind=self.engine)
        
        # Lista de municípios prioritários (RS, SC, PR)
        self.priority_municipalities = [
            {"name": "Santa Cruz do Sul", "code": "4320676", "state": "RS"},   
        ]
        
        # Configurações de processamento
        self.max_concurrent = 5  # Máximo de municípios processados simultaneamente
        self.retry_attempts = 3
        self.cache_duration_hours = 24  # Cache válido por 24 horas

    async def create_cache_tables(self):
        """Cria tabelas necessárias para cache"""
        logger.info("Criando tabelas de cache...")
        
        with self.engine.connect() as conn:
            # Tabela para cache de geometrias municipais
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS municipality_geometry_cache (
                    id SERIAL PRIMARY KEY,
                    municipality_code VARCHAR(10) UNIQUE NOT NULL,
                    municipality_name VARCHAR(255) NOT NULL,
                    state VARCHAR(2) NOT NULL,
                    geometry_data JSONB NOT NULL,
                    bbox JSONB,
                    source VARCHAR(20) DEFAULT 'osm',
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW(),
                    expires_at TIMESTAMP NOT NULL
                );
            """))
            
            # Tabela para cache de planos de ação
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS municipality_plan_cache (
                    id SERIAL PRIMARY KEY,
                    municipality_code VARCHAR(10) UNIQUE NOT NULL,
                    municipality_name VARCHAR(255) NOT NULL,
                    state VARCHAR(2) NOT NULL,
                    plan_data JSONB NOT NULL,
                    ndvi_data JSONB,
                    zones_data JSONB,
                    summary_data JSONB,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW(),
                    expires_at TIMESTAMP NOT NULL
                );
            """))
            
            # Tabela para cache de dados NDVI
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS municipality_ndvi_cache (
                    id SERIAL PRIMARY KEY,
                    municipality_code VARCHAR(10) NOT NULL,
                    date_observed DATE NOT NULL,
                    ndvi_value DECIMAL(4,3),
                    cloud_coverage INTEGER,
                    geometry_data JSONB,
                    statistics JSONB,
                    created_at TIMESTAMP DEFAULT NOW(),
                    expires_at TIMESTAMP NOT NULL,
                    UNIQUE(municipality_code, date_observed)
                );
            """))
            
            # Índices para performance
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_municipality_geometry_code 
                ON municipality_geometry_cache(municipality_code);
            """))
            
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_municipality_plan_code 
                ON municipality_plan_cache(municipality_code);
            """))
            
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_municipality_ndvi_code_date 
                ON municipality_ndvi_cache(municipality_code, date_observed);
            """))
            
            conn.commit()
        
        logger.info("Tabelas de cache criadas com sucesso!")

    async def fetch_municipality_geometry(self, municipality: Dict) -> Optional[Dict]:
        """Busca geometria do município"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                url = f"{self.base_url}/api/v1/geo/municipalities/{municipality['code']}/geometry"
                params = {"source": "osm"}
                
                response = await client.get(url, params=params)
                response.raise_for_status()
                
                data = response.json()
                return {
                    "geometry": data.get("geometry"),
                    "bbox": data.get("bbox"),
                    "source": "osm"
                }
        except Exception as e:
            logger.error(f"Erro ao buscar geometria de {municipality['name']}: {e}")
            return None

    async def fetch_municipality_plan(self, municipality: Dict) -> Optional[Dict]:
        """Busca plano de ação do município"""
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                url = f"{self.base_url}/api/v1/plan/municipality/{municipality['code']}"
                params = {"source": "osm"}
                
                response = await client.get(url, params=params)
                response.raise_for_status()
                
                data = response.json()
                return {
                    "plan": data.get("plan"),
                    "ndvi_data": data.get("ndvi_data"),
                    "zones": data.get("zones"),
                    "summary": data.get("summary")
                }
        except Exception as e:
            logger.error(f"Erro ao buscar plano de {municipality['name']}: {e}")
            return None

    async def fetch_municipality_ndvi(self, municipality: Dict) -> Optional[Dict]:
        """Busca dados NDVI do município"""
        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                # Busca dados dos últimos 30 dias
                end_date = datetime.now().date()
                start_date = end_date - timedelta(days=30)
                
                url = f"{self.base_url}/api/v1/ndvi/history/{municipality['code']}"
                params = {
                    "days": 30,
                    "limit": 100
                }
                
                response = await client.get(url, params=params)
                response.raise_for_status()
                
                data = response.json()
                return {
                    "time_series": data.get("time_series", []),
                    "statistics": data.get("statistics"),
                    "trend": data.get("trend")
                }
        except Exception as e:
            logger.error(f"Erro ao buscar NDVI de {municipality['name']}: {e}")
            return None

    async def save_geometry_cache(self, municipality: Dict, geometry_data: Dict):
        """Salva geometria no cache"""
        try:
            with self.Session() as session:
                expires_at = datetime.now() + timedelta(hours=self.cache_duration_hours)
                
                session.execute(text("""
                    INSERT INTO municipality_geometry_cache 
                    (municipality_code, municipality_name, state, geometry_data, bbox, source, expires_at)
                    VALUES (:code, :name, :state, :geometry, :bbox, :source, :expires)
                    ON CONFLICT (municipality_code) 
                    DO UPDATE SET 
                        geometry_data = EXCLUDED.geometry_data,
                        bbox = EXCLUDED.bbox,
                        updated_at = NOW(),
                        expires_at = EXCLUDED.expires_at
                """), {
                    "code": municipality["code"],
                    "name": municipality["name"],
                    "state": municipality["state"],
                    "geometry": json.dumps(geometry_data["geometry"]),
                    "bbox": json.dumps(geometry_data["bbox"]),
                    "source": geometry_data["source"],
                    "expires": expires_at
                })
                session.commit()
                logger.info(f"Geometria de {municipality['name']} salva no cache")
        except Exception as e:
            logger.error(f"Erro ao salvar geometria de {municipality['name']}: {e}")

    async def save_plan_cache(self, municipality: Dict, plan_data: Dict):
        """Salva plano no cache"""
        try:
            with self.Session() as session:
                expires_at = datetime.now() + timedelta(hours=self.cache_duration_hours)
                
                session.execute(text("""
                    INSERT INTO municipality_plan_cache 
                    (municipality_code, municipality_name, state, plan_data, ndvi_data, zones_data, summary_data, expires_at)
                    VALUES (:code, :name, :state, :plan, :ndvi, :zones, :summary, :expires)
                    ON CONFLICT (municipality_code) 
                    DO UPDATE SET 
                        plan_data = EXCLUDED.plan_data,
                        ndvi_data = EXCLUDED.ndvi_data,
                        zones_data = EXCLUDED.zones_data,
                        summary_data = EXCLUDED.summary_data,
                        updated_at = NOW(),
                        expires_at = EXCLUDED.expires_at
                """), {
                    "code": municipality["code"],
                    "name": municipality["name"],
                    "state": municipality["state"],
                    "plan": json.dumps(plan_data["plan"]),
                    "ndvi": json.dumps(plan_data["ndvi_data"]),
                    "zones": json.dumps(plan_data["zones"]),
                    "summary": json.dumps(plan_data["summary"]),
                    "expires": expires_at
                })
                session.commit()
                logger.info(f"Plano de {municipality['name']} salvo no cache")
        except Exception as e:
            logger.error(f"Erro ao salvar plano de {municipality['name']}: {e}")

    async def save_ndvi_cache(self, municipality: Dict, ndvi_data: Dict):
        """Salva dados NDVI no cache"""
        try:
            with self.Session() as session:
                expires_at = datetime.now() + timedelta(hours=self.cache_duration_hours)
                
                # Salva série temporal
                for item in ndvi_data.get("time_series", []):
                    session.execute(text("""
                        INSERT INTO municipality_ndvi_cache 
                        (municipality_code, date_observed, ndvi_value, cloud_coverage, statistics, expires_at)
                        VALUES (:code, :date, :ndvi, :cloud, :stats, :expires)
                        ON CONFLICT (municipality_code, date_observed) 
                        DO UPDATE SET 
                            ndvi_value = EXCLUDED.ndvi_value,
                            cloud_coverage = EXCLUDED.cloud_coverage,
                            statistics = EXCLUDED.statistics,
                            expires_at = EXCLUDED.expires_at
                    """), {
                        "code": municipality["code"],
                        "date": item.get("date"),
                        "ndvi": item.get("ndvi"),
                        "cloud": item.get("cloud_coverage"),
                        "stats": json.dumps(ndvi_data.get("statistics")),
                        "expires": expires_at
                    })
                
                session.commit()
                logger.info(f"NDVI de {municipality['name']} salvo no cache")
        except Exception as e:
            logger.error(f"Erro ao salvar NDVI de {municipality['name']}: {e}")

    async def process_municipality(self, municipality: Dict) -> bool:
        """Processa um município completo"""
        logger.info(f"Processando {municipality['name']} ({municipality['code']})...")
        
        try:
            # Busca dados em paralelo
            geometry_task = self.fetch_municipality_geometry(municipality)
            plan_task = self.fetch_municipality_plan(municipality)
            ndvi_task = self.fetch_municipality_ndvi(municipality)
            
            # Aguarda todas as tarefas
            geometry_data, plan_data, ndvi_data = await asyncio.gather(
                geometry_task, plan_task, ndvi_task, return_exceptions=True
            )
            
            # Processa resultados
            success_count = 0
            
            if not isinstance(geometry_data, Exception) and geometry_data:
                await self.save_geometry_cache(municipality, geometry_data)
                success_count += 1
            
            if not isinstance(plan_data, Exception) and plan_data:
                await self.save_plan_cache(municipality, plan_data)
                success_count += 1
            
            if not isinstance(ndvi_data, Exception) and ndvi_data:
                await self.save_ndvi_cache(municipality, ndvi_data)
                success_count += 1
            
            logger.info(f"{municipality['name']}: {success_count}/3 dados processados")
            return success_count > 0
            
        except Exception as e:
            logger.error(f"Erro ao processar {municipality['name']}: {e}")
            return False

    async def process_municipalities_parallel(self):
        """Processa municípios em paralelo"""
        logger.info(f"Processando {len(self.priority_municipalities)} municípios...")
        
        # Cria semáforo para limitar concorrência
        semaphore = asyncio.Semaphore(self.max_concurrent)
        
        async def process_with_semaphore(municipality):
            async with semaphore:
                return await self.process_municipality(municipality)
        
        # Processa em lotes
        tasks = [process_with_semaphore(municipality) for municipality in self.priority_municipalities]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Conta sucessos
        success_count = sum(1 for result in results if result is True)
        total_count = len(self.priority_municipalities)
        
        logger.info(f"Processamento concluído: {success_count}/{total_count} municípios processados com sucesso")
        return success_count, total_count

    async def cleanup_expired_cache(self):
        """Remove cache expirado"""
        logger.info("Limpando cache expirado...")
        
        with self.Session() as session:
            # Remove geometrias expiradas
            result1 = session.execute(text("""
                DELETE FROM municipality_geometry_cache 
                WHERE expires_at < NOW()
            """))
            
            # Remove planos expirados
            result2 = session.execute(text("""
                DELETE FROM municipality_plan_cache 
                WHERE expires_at < NOW()
            """))
            
            # Remove NDVI expirado
            result3 = session.execute(text("""
                DELETE FROM municipality_ndvi_cache 
                WHERE expires_at < NOW()
            """))
            
            session.commit()
            
            total_cleaned = result1.rowcount + result2.rowcount + result3.rowcount
            logger.info(f"Cache limpo: {total_cleaned} registros expirados removidos")

    async def run(self):
        """Executa o pré-processamento completo"""
        logger.info("Iniciando pré-processamento de municípios...")
        
        try:
            # 1. Cria tabelas se necessário
            await self.create_cache_tables()
            
            # 2. Limpa cache expirado
            await self.cleanup_expired_cache()
            
            # 3. Processa municípios em paralelo
            success_count, total_count = await self.process_municipalities_parallel()
            
            # 4. Relatório final
            logger.info(f"Pré-processamento concluído!")
            logger.info(f"Municípios processados: {success_count}/{total_count}")
            logger.info(f"Taxa de sucesso: {(success_count/total_count)*100:.1f}%")
            
            return success_count, total_count
            
        except Exception as e:
            logger.error(f"Erro no pré-processamento: {e}")
            raise

async def main():
    """Função principal"""
    preloader = MunicipalityPreloader()
    await preloader.run()

if __name__ == "__main__":
    asyncio.run(main())
