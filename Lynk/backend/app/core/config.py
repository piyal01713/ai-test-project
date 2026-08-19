from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Lynk Backend"
    chunk_size: int = 4 * 1024 * 1024  # 4MB default
    host: str = "0.0.0.0"
    port: int = 8000
    
    class Config:
        env_file = ".env"

settings = Settings()
