from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class SendOTPRequest(BaseModel):
    email: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp_code: str

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None
    otp_code: Optional[str] = None
    niche: Optional[str] = "General Creator"
    target_audience: Optional[str] = "General audience"
    brand_voice: Optional[str] = "Authentic, engaging"
    content_goals: Optional[str] = "Grow reach and engagement"
    terms_accepted: bool = True

class UserLogin(BaseModel):
    email: str
    password: str

class ResetPasswordRequest(BaseModel):
    email: str
    otp_code: str
    new_password: Optional[str] = None  # None means skip (login without password change)

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[str] = None
    bio: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    platform_urls: Optional[Dict[str, str]] = None
    content_types: Optional[List[str]] = None  # selected niche categories
    connected_platforms: Optional[List[str]] = None  # selected platforms
    niche: Optional[str] = None
    target_audience: Optional[str] = None
    brand_voice: Optional[str] = None
    content_goals: Optional[str] = None
    logo_url: Optional[str] = None
    password: Optional[str] = None
    current_password: Optional[str] = None


class SocialAuthRequest(BaseModel):
    provider: str  # "google" or "facebook"
    token: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None
    picture: Optional[str] = None

class AuthResponse(BaseModel):
    user_id: int
    name: str
    email: str
    phone: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[str] = None
    bio: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    platform_urls: Optional[Dict[str, str]] = None
    niche: Optional[str] = None
    target_audience: Optional[str] = None
    content_types: Optional[List[str]] = None
    connected_platforms: Optional[List[str]] = None
    logo_url: Optional[str] = None
    profile_complete: bool = False
    token: str
    message: str
