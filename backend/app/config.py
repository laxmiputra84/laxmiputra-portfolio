import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Full Stack Developer Portfolio API"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # DB settings

    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: int = int(os.getenv("DB_PORT", 3306))
    DB_USER: str = os.getenv("DB_USER", "root")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "")
    DB_NAME: str = os.getenv("DB_NAME", "portfolio_db")

    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")
    
    def __init__(self, **values):
        super().__init__(**values)
        if not self.DATABASE_URL:
            import urllib.parse
            passwd = urllib.parse.quote_plus(self.DB_PASSWORD) if self.DB_PASSWORD else ""
            self.DATABASE_URL = f"mysql+pymysql://{self.DB_USER}:{passwd}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    # JWT settings
    SECRET_KEY: str = "supersecretjwtkeyforportfoliobackendservice"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
