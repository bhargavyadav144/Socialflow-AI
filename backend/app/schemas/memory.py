from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class MemoryCreate(BaseModel):
    category: str # user_profile, content, performance, audience, strategy, conversation
    content: str
    metadata: Optional[Dict[str, Any]] = None
    user_id: Optional[int] = 1

class MemoryResponse(BaseModel):
    id: int
    user_id: int
    bank_id: str
    category: str
    content: str
    metadata_json: Optional[Dict[str, Any]] = None
    hindsight_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class MemoryOverviewResponse(BaseModel):
    total_memories: int
    recent_memories: List[MemoryResponse]
    categories: Dict[str, int]
