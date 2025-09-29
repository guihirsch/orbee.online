#!/usr/bin/env python3
"""
Agendador para execução periódica do pré-processamento
Executa o script de pré-processamento em intervalos regulares
"""

import asyncio
import logging
import schedule
import time
from datetime import datetime
from backend.scripts.preprocessing.preload_municipalities import MunicipalityPreloader

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class MunicipalityScheduler:
    def __init__(self):
        self.preloader = MunicipalityPreloader()
        self.is_running = False
        
    async def run_preprocessing(self):
        """Executa o pré-processamento"""
        if self.is_running:
            logger.warning("Pré-processamento já em execução, pulando...")
            return
            
        self.is_running = True
        start_time = datetime.now()
        
        try:
            logger.info("Iniciando pré-processamento agendado...")
            success_count, total_count = await self.preloader.run()
            
            duration = datetime.now() - start_time
            logger.info(f"Pré-processamento concluído em {duration}")
            logger.info(f"Resultado: {success_count}/{total_count} municípios processados")
            
        except Exception as e:
            logger.error(f"Erro no pré-processamento agendado: {e}")
        finally:
            self.is_running = False

    def schedule_jobs(self):
        """Configura os trabalhos agendados"""
        logger.info("Configurando agendamentos...")
        
        # Execução a cada 6 horas
        schedule.every(6).hours.do(
            lambda: asyncio.create_task(self.run_preprocessing())
        )
        
        # Execução diária às 2:00 AM
        schedule.every().day.at("02:00").do(
            lambda: asyncio.create_task(self.run_preprocessing())
        )
        
        # Execução semanal aos domingos às 3:00 AM (processamento completo)
        schedule.every().sunday.at("03:00").do(
            lambda: asyncio.create_task(self.run_preprocessing())
        )
        
        logger.info("Agendamentos configurados:")
        logger.info("- A cada 6 horas")
        logger.info("- Diariamente às 2:00 AM")
        logger.info("- Semanalmente aos domingos às 3:00 AM")

    async def run_scheduler(self):
        """Executa o agendador"""
        logger.info("Iniciando agendador de pré-processamento...")
        
        # Executa uma vez imediatamente
        await self.run_preprocessing()
        
        # Configura agendamentos
        self.schedule_jobs()
        
        # Loop principal
        while True:
            try:
                schedule.run_pending()
                await asyncio.sleep(60)  # Verifica a cada minuto
            except KeyboardInterrupt:
                logger.info("Agendador interrompido pelo usuário")
                break
            except Exception as e:
                logger.error(f"Erro no agendador: {e}")
                await asyncio.sleep(300)  # Aguarda 5 minutos em caso de erro

async def main():
    """Função principal"""
    scheduler = MunicipalityScheduler()
    await scheduler.run_scheduler()

if __name__ == "__main__":
    asyncio.run(main())
