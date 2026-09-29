from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SocialPostBase(BaseModel):
    platform: str = Field(..., example="Instagram")
    content_type: str = Field(..., example="Reel")
    title: Optional[str] = Field(None, example="5 Python Mistakes Beginners Make")
    topic: str = Field(..., example="Python")
    caption: Optional[str] = Field(None, example="Stop doing this in Python! Here is the clean way.")
    post_url: Optional[str] = None
    media_url: Optional[str] = None
    published_at: Optional[datetime] = None
    
    # Promotion fields
    is_promotion: bool = Field(False)
    brand_name: Optional[str] = Field(None, example="TechBrand Inc.")
    sponsorship_amount: float = Field(0.0, ge=0.0)
    promotion_type: Optional[str] = Field(None, example="Sponsored Video")
    
    views: int = Field(0, ge=0)
    likes: int = Field(0, ge=0)
    comments: int = Field(0, ge=0)
    shares: int = Field(0, ge=0)
    saves: int = Field(0, ge=0)
    ai_analysis: Optional[str] = None

class SocialPostCreate(SocialPostBase):
    pass

class SocialPostUpdate(BaseModel):
    platform: Optional[str] = None
    content_type: Optional[str] = None
    title: Optional[str] = None
    topic: Optional[str] = None
    caption: Optional[str] = None
    post_url: Optional[str] = None
    media_url: Optional[str] = None
    published_at: Optional[datetime] = None
    is_promotion: Optional[bool] = None
    brand_name: Optional[str] = None
    sponsorship_amount: Optional[float] = None
    promotion_type: Optional[str] = None
    views: Optional[int] = None
    likes: Optional[int] = None
    comments: Optional[int] = None
    shares: Optional[int] = None
    saves: Optional[int] = None
    ai_analysis: Optional[str] = None

class SocialPostResponse(SocialPostBase):
    id: int
    user_id: int
    engagement_rate: float
    created_at: datetime

    class Config:
        from_attributes = True
