import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    APP_NAME: str = "AtendeZap Backend"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    PORT: int = int(os.getenv("PORT", "8000"))

    # Meta WhatsApp Cloud API credentials
    META_VERIFY_TOKEN: str = os.getenv("META_VERIFY_TOKEN", "")
    META_ACCESS_TOKEN: str = os.getenv("META_ACCESS_TOKEN", "")
    META_PHONE_NUMBER_ID: str = os.getenv("META_PHONE_NUMBER_ID", "")

    # AI Engine settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    OLLAMA_HOST: str = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2:1b")

    # Database
    DB_PATH: str = os.getenv("DB_PATH", os.path.join(os.path.dirname(__file__), "atendezap.db"))

settings = Settings()
