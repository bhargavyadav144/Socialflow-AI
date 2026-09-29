from fastapi import APIRouter
from app.config import settings

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "hindsight_bank": settings.HINDSIGHT_BANK_ID,
        "llm_provider": settings.LLM_PROVIDER
    }
