from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from app.database.database import get_db
from app.database.models import MemoryRecord
from app.schemas.memory import MemoryCreate, MemoryResponse, MemoryOverviewResponse
from app.agent.memory import agent_memory_manager

router = APIRouter()

@router.get("/memory", response_model=MemoryOverviewResponse)
def get_memories(category: Optional[str] = Query(None), user_id: int = 1, db: Session = Depends(get_db)):
    query = db.query(MemoryRecord).filter(MemoryRecord.user_id == user_id)
    if category:
        query = query.filter(MemoryRecord.category == category)
    
    memories = query.order_by(MemoryRecord.created_at.desc()).all()
    
    # Calculate category counts
    categories_count: Dict[str, int] = {}
    all_user_memories = db.query(MemoryRecord).filter(MemoryRecord.user_id == user_id).all()
    for m in all_user_memories:
        categories_count[m.category] = categories_count.get(m.category, 0) + 1

    return MemoryOverviewResponse(
        total_memories=len(all_user_memories),
        recent_memories=memories,
        categories=categories_count
    )

@router.post("/memory", response_model=MemoryResponse)
def add_memory(mem_in: MemoryCreate, db: Session = Depends(get_db)):
    user_id = mem_in.user_id or 1
    record = agent_memory_manager.store_user_fact(
        db,
        user_id=user_id,
        content=mem_in.content,
        category=mem_in.category,
        metadata=mem_in.metadata
    )
    return record
