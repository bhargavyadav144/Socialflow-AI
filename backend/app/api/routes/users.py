from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.database.models import User
from app.schemas.user import UserResponse, UserCreate

router = APIRouter()

@router.get("/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/users", response_model=UserResponse)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        name=user_in.name,
        email=user_in.email,
        niche=user_in.niche,
        target_audience=user_in.target_audience,
        brand_voice=user_in.brand_voice,
        content_goals=user_in.content_goals
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
