from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.v1.api import api_router
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