from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: str
    niche: Optional[str] = None
    target_audience: Optional[str] = None
    brand_voice: Optional[str] = None
    content_goals: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
