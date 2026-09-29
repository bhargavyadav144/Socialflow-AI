import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "SocialFlow AI"
    ENVIRONMENT: str = "production"
    PORT: int = 8000
    
    # LLM Settings
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "groq") # groq, openai, gemini, mock
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")
    
    # Hindsight Memory Settings (Vectorize)
    HINDSIGHT_URL: str = os.getenv("HINDSIGHT_URL", "http://localhost:8888")
    HINDSIGHT_API_KEY: str = os.getenv("HINDSIGHT_API_KEY", "hsk_demo_key")
    HINDSIGHT_BANK_ID: str = os.getenv("HINDSIGHT_BANK_ID", "socialflow_user_bank")
    
    # Database Settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./socialflow.db")

    # Real Email & OTP SMTP Settings
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    EMAILS_FROM_EMAIL: str = os.getenv("EMAILS_FROM_EMAIL", "noreply@socialflow.ai")
    EMAILS_FROM_NAME: str = os.getenv("EMAILS_FROM_NAME", "SocialFlow AI Security")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
