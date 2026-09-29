# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from app.database.database import get_db
from app.schemas.analytics import AnalyticsOverview
from app.services.analytics_service import analytics_service
from app.services.dataset_intelligence_service import dataset_intelligence_service

router = APIRouter()

@router.get("/analytics", response_model=AnalyticsOverview)
def get_analytics(user_id: int = 1, db: Session = Depends(get_db)):
    overview = analytics_service.get_overview(db, user_id=user_id)
    return overview

class HookEvaluationRequest(BaseModel):
    platform: str
    hook: str
    topic: Optional[str] = "General"
    content_type: Optional[str] = "Reel"

@router.post("/ai/evaluate-hook")
def evaluate_hook(req: HookEvaluationRequest):
    """
    Evaluates a hook or video concept using patterns trained from the 10,000 multiplatform dataset.
    """
    return dataset_intelligence_service.predict_performance(
        platform=req.platform,
        hook=req.hook,
        topic=req.topic or "General",
        content_type=req.content_type or "Reel"
    )

@router.get("/ai/top-hooks")
def get_top_hooks(platform: Optional[str] = None, topic: Optional[str] = None, limit: int = 5):
    """
    Retrieves top performing hooks from the trained dataset.
    """
    return dataset_intelligence_service.find_top_hooks(platform=platform, topic=topic, limit=limit)

@router.get("/ai/model-training-summary")
def get_model_training_summary():
    """
    Returns the training and evaluation summary for the fine-tuned multiplatform LLM model.
    """
    import os, json
    meta_file = os.path.join(dataset_intelligence_service.data_dir, "model_training_summary.json")
    if os.path.exists(meta_file):
        with open(meta_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "status": "training_available",
        "total_training_samples": 5000,
        "total_test_samples": 5000
    }
