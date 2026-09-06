from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Pydantic v2 settings
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",  # Ignores extra variables (ex.: VITE_*)
    )
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Orbee"
    
    # CORS Settings
    ALLOWED_HOSTS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://orbee.online",
        "https://www.orbee.online",
    ]
    
    # Database Settings (Supabase)
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    # Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # External APIs
    SENTINEL_HUB_CLIENT_ID: str = os.getenv("SENTINEL_HUB_CLIENT_ID", "")
    SENTINEL_HUB_CLIENT_SECRET: str = os.getenv("SENTINEL_HUB_CLIENT_SECRET", "")
    SENTINEL_HUB_INSTANCE_ID: str = os.getenv("SENTINEL_HUB_INSTANCE_ID", "")
    # NDVI Provider and AI options
    # v2: "planetary_computer" (STAC gratuito, sem credencial) é o caminho real,
    # validado na Fase 0 (v2_validation/). "sentinel_hub" mantido por compatibilidade.
    NDVI_PROVIDER: str = os.getenv("NDVI_PROVIDER", "planetary_computer")  # options: planetary_computer | sentinel_hub | earth_engine | sentinel_hub_mock
    # Planetary Computer (Microsoft) — sem credencial
    PC_STAC_URL: str = os.getenv("PC_STAC_URL", "https://planetarycomputer.microsoft.com/api/stac/v1")
    PC_COLLECTION_S2L2A: str = os.getenv("PC_COLLECTION_S2L2A", "sentinel-2-l2a")
    # Diretório de artefatos pré-computados por bacia (jobs/build_basin.py)
    JOBS_DATA_DIR: str = os.getenv("JOBS_DATA_DIR", "data/basins")
    ENABLE_SUPER_RESOLUTION: bool = os.getenv("ENABLE_SUPER_RESOLUTION", "false").lower() == "true"
    SUPER_RES_MODEL: str = os.getenv("SUPER_RES_MODEL", "bicubic")  # options: bicubic | dr-3.0 | esrgan
    
    # File Upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = ENVIRONMENT == "development"
    
    # Removed Config (Pydantic v2 doesn't allow using together with model_config)


settings = Settings()