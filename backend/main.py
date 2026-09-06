import os
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from contextlib import asynccontextmanager

# Garante que o diretório 'backend' esteja no sys.path para permitir imports 'app.*'
CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
	sys.path.append(str(CURRENT_DIR))

from app.core.config import settings
from app.api.v1.api import api_router
from app.api.v2.api import router as api_router_v2
from app.core.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Iniciando OrBee.Online Backend...")
    await init_db()
    yield
    # Shutdown
    print("🛑 Encerrando OrBee.Online Backend...")


app = FastAPI(
    title="OrBee.Online API",
    description="API para monitoramento ambiental com dados satelitais e validação comunitária",
    version="1.0.0",
    lifespan=lifespan
)

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas da API
app.include_router(api_router, prefix=settings.API_V1_STR)

# API v2 — portal comunitário (leitura pública; v1 intocada)
app.include_router(api_router_v2, prefix="/api/v2")


@app.get("/")
async def root():
    return JSONResponse({
        "message": "OrBee.Online API",
        "description": "Inteligência coletiva para um futuro sustentável",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "online"
    })


@app.get("/health")
async def health_check():
    return JSONResponse({
        "status": "healthy",
        "service": "orbee-api"
    })


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )