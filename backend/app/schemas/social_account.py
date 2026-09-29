from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class SocialAccountBase(BaseModel):
    platform: str # Instagram, YouTube, LinkedIn, X/Twitter
    account_name: str
    handle_or_id: str
    followers_count: Optional[int] = 0
    following_count: Optional[int] = 0
    posts_count: Optional[int] = 0
    bio: Optional[str] = None
    profile_pic_url: Optional[str] = None

class SocialAccountConnect(SocialAccountBase):
    access_token: Optional[str] = "eaab_mock_oauth_token"

class SocialAccountUpdate(BaseModel):
    followers_count: Optional[int] = None
    following_count: Optional[int] = None
    posts_count: Optional[int] = None
    bio: Optional[str] = None
    profile_pic_url: Optional[str] = None
    account_name: Optional[str] = None
    handle_or_id: Optional[str] = None

class SocialAccountResponse(SocialAccountBase):
    id: int
    user_id: int
    connected: bool
    access_token_masked: Optional[str] = None
    last_synced_at: datetime

    model_config = ConfigDict(from_attributes=True)
