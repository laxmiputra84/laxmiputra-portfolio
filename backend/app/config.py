import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Full Stack Developer Portfolio API"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # DB settings
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = "cse@123"
    DB_NAME: str = "portfolio_db"
    DATABASE_URL: str = "mysql+pymysql://root:cse%40123@localhost:3306/portfolio_db"
    
    # JWT settings
    SECRET_KEY: str = "supersecretjwtkeyforportfoliobackendservice"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
