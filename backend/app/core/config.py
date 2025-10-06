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
    NDVI_PROVIDER: str = os.getenv("NDVI_PROVIDER", "sentinel_hub")  # options: sentinel_hub | earth_engine | sentinel_hub_mock
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