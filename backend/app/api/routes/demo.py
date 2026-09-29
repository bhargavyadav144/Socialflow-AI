from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User, SocialPost, MemoryRecord, AgentInteraction
from app.agent.memory import agent_memory_manager
from seed_demo import seed_demo_data

router = APIRouter()

@router.post("/demo/seed")
def seed_demo_endpoint(db: Session = Depends(get_db)):
    """
    Seeds database and Hindsight memory bank with realistic demo user (Alex) and 18 historical posts.
    """
    result = seed_demo_data(db)
    return {"status": "success", "message": "Demo data seeded successfully", "details": result}

@router.post("/demo/reset")
def reset_demo_endpoint(db: Session = Depends(get_db)):
    """
    Resets the database and re-seeds.
    """
    db.query(AgentInteraction).delete()
    db.query(MemoryRecord).delete()
    db.query(SocialPost).delete()
    db.query(User).delete()
    db.commit()

    result = seed_demo_data(db)
    return {"status": "success", "message": "Database and Hindsight memories reset and re-seeded.", "details": result}
