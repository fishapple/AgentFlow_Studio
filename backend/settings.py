"""
Application Settings Configuration
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )
    
    # Application
    APP_NAME: str = "AgentFlow Studio"
    APP_VERSION: str = "0.1.0-alpha"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = "postgresql://agentflow:secret@localhost/agentflow_db"
    
    # Redis Cache
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]
    
    # Security
    SECRET_KEY: str = "change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    @property
    def api_v1(self) -> str:
        """Get the API v1 prefix."""
        return self.API_V1_PREFIX


settings = Settings()
