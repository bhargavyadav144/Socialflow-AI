import random
import hashlib
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User, SocialAccount
from app.schemas.auth import (
    UserRegister, UserLogin, AuthResponse, SendOTPRequest, 
    VerifyOTPRequest, ResetPasswordRequest, UpdateProfileRequest, SocialAuthRequest
)
from app.agent.memory import agent_memory_manager

from app.services.email_service import email_service

router = APIRouter()

# In-memory OTP storage cache for fast verification
otp_cache = {}

def hash_pw(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()

def make_auth_response(user: User, message: str) -> AuthResponse:
    return AuthResponse(
        user_id=user.id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        gender=user.gender,
        dob=user.dob,
        bio=user.bio,
        website=user.website,
        location=user.location,
        avatar_url=user.avatar_url,
        platform_urls=user.platform_urls or {},
        niche=user.niche,
        target_audience=user.target_audience,
        content_types=user.content_types or [],
        connected_platforms=user.connected_platforms or [],
        logo_url=user.logo_url,
        profile_complete=user.profile_complete or False,
        token=f"token_user_{user.id}",
        message=message
    )


@router.post("/auth/social-login", response_model=AuthResponse)
def social_login(req: SocialAuthRequest, db: Session = Depends(get_db)):
    """
    Authenticate or Register user via Google or Facebook OAuth.
    """
    if not req.email:
        raise HTTPException(status_code=400, detail="Email is required for social login.")

    email_clean = req.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()

    if not user:
        # Auto-create user from Google / Facebook account metadata
        display_name = req.name or email_clean.split('@')[0].capitalize()
        user = User(
            name=display_name,
            email=email_clean,
            password_hash=hash_pw(f"social_oauth_{random.randint(100000, 999999)}"),
            is_verified=True,
            terms_accepted=True,
            profile_complete=False,
            connected_platforms=["YouTube", "Instagram"] if req.provider == "google" else ["Facebook", "Instagram"]
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Store initial fact into Hindsight bank
        agent_memory_manager.store_user_fact(
            db, user.id, f"Creator registered via {req.provider.capitalize()} OAuth.", category="user_profile"
        )
        return make_auth_response(user, f"Successfully registered via {req.provider.capitalize()}!")

    return make_auth_response(user, f"Welcome back! Authenticated via {req.provider.capitalize()}.")


@router.post("/auth/send-otp")
def send_otp(req: SendOTPRequest, db: Session = Depends(get_db)):
    code = f"{random.randint(100000, 999999)}"
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    otp_cache[req.email.lower()] = {
        "code": code,
        "expires_at": expires_at
    }

    # Send real email via SMTP if configured
    email_sent = email_service.send_otp_email(req.email.lower(), code, is_reset=False)

    # If user exists in DB, update OTP
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if user:
        user.otp_code = code
        user.otp_expires_at = expires_at
        db.commit()

    return {
        "status": "success",
        "email": req.email,
        "message": f"Verification 6-digit OTP code sent to {req.email}.",
        "email_sent_real": email_sent,
        "demo_otp_code": code
    }

@router.post("/auth/verify-otp")
def verify_otp(req: VerifyOTPRequest):
    cached = otp_cache.get(req.email.lower())
    if not cached:
        raise HTTPException(status_code=400, detail="No OTP code requested for this email")

    if cached["code"] != req.otp_code.strip():
        raise HTTPException(status_code=400, detail="Invalid 6-digit OTP verification code")

    if datetime.utcnow() > cached["expires_at"]:
        raise HTTPException(status_code=400, detail="OTP code has expired. Please request a new code.")

    return {
        "status": "verified",
        "email": req.email,
        "message": "Email address successfully verified!"
    }

@router.post("/auth/register", response_model=AuthResponse)
def register_user(req: UserRegister, db: Session = Depends(get_db)):
    if not req.terms_accepted:
        raise HTTPException(status_code=400, detail="You must accept the Terms & Conditions and Privacy Policy to register.")

    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered. Please sign in.")

    user = User(
        name=req.name,
        email=req.email.lower(),
        password_hash=hash_pw(req.password),
        phone=req.phone,
        niche=req.niche,
        target_audience=req.target_audience,
        brand_voice=req.brand_voice,
        content_goals=req.content_goals,
        is_verified=True,
        terms_accepted=True,
        profile_complete=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Automatically initialize brand memory in Hindsight bank
    agent_memory_manager.store_user_fact(
        db, user.id, f"Creator {user.name} registered account.", category="user_profile"
    )

    return make_auth_response(user, "Account created & verified successfully!")

@router.post("/auth/login", response_model=AuthResponse)
def login_user(req: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if user.password_hash and user.password_hash != hash_pw(req.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return make_auth_response(user, "Login successful")

@router.post("/auth/forgot-password")
def forgot_password(req: SendOTPRequest, db: Session = Depends(get_db)):
    """Send OTP to email for password reset. Works even if user doesn't exist (for security)."""
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email address.")
    
    code = f"{random.randint(100000, 999999)}"
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    otp_cache[req.email.lower()] = {
        "code": code,
        "expires_at": expires_at,
        "purpose": "reset"
    }
    user.otp_code = code
    user.otp_expires_at = expires_at
    db.commit()

    # Send real email via SMTP
    email_sent = email_service.send_otp_email(req.email.lower(), code, is_reset=True)

    return {
        "status": "success",
        "email": req.email,
        "message": f"Password reset OTP sent to {req.email}.",
        "email_sent_real": email_sent,
        "demo_otp_code": code
    }

@router.post("/auth/reset-password", response_model=AuthResponse)
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Verify OTP and optionally set new password. If new_password is null, skip password change and just login."""
    cached = otp_cache.get(req.email.lower())
    if not cached:
        raise HTTPException(status_code=400, detail="No OTP code requested for this email")

    if cached["code"] != req.otp_code.strip():
        raise HTTPException(status_code=400, detail="Invalid OTP code")

    if datetime.utcnow() > cached["expires_at"]:
        raise HTTPException(status_code=400, detail="OTP code has expired.")

    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update password only if provided (otherwise skip)
    if req.new_password:
        user.password_hash = hash_pw(req.new_password)
        db.commit()
        return make_auth_response(user, "Password updated successfully!")
    
    # Skip - just login without changing password
    return make_auth_response(user, "Login successful (password unchanged)")

@router.get("/auth/profile/{user_id}", response_model=AuthResponse)
def get_profile(user_id: int, db: Session = Depends(get_db)):
    """Fetch full user profile."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return make_auth_response(user, "Profile fetched successfully")

@router.put("/auth/profile/{user_id}", response_model=AuthResponse)
def update_profile(user_id: int, req: UpdateProfileRequest, db: Session = Depends(get_db)):
    """Update user profile with content types, platforms, gender, etc."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if req.name is not None:
        user.name = req.name
    if req.phone is not None:
        user.phone = req.phone
    if req.gender is not None:
        user.gender = req.gender
    if req.dob is not None:
        user.dob = req.dob
    if req.bio is not None:
        user.bio = req.bio
    if req.website is not None:
        user.website = req.website
    if req.location is not None:
        user.location = req.location
    if req.avatar_url is not None:
        user.avatar_url = req.avatar_url
    if req.platform_urls is not None:
        user.platform_urls = req.platform_urls
    if req.content_types is not None:
        user.content_types = req.content_types
    if req.connected_platforms is not None:
        user.connected_platforms = req.connected_platforms
        
        # Sync SocialAccount records
        existing_accounts = db.query(SocialAccount).filter(SocialAccount.user_id == user.id).all()
        existing_platforms = {acc.platform for acc in existing_accounts}
        
        # Add new platforms
        for platform in req.connected_platforms:
            if platform not in existing_platforms:
                safe_name = user.name if user.name else "user"
                new_acc = SocialAccount(
                    user_id=user.id,
                    platform=platform,
                    account_name=safe_name,
                    handle_or_id=f"@{safe_name.replace(' ', '').lower()}",
                    followers_count=0,
                    status="Active"
                )
                db.add(new_acc)
        
        # Delete removed platforms
        for acc in existing_accounts:
            if acc.platform not in req.connected_platforms:
                db.delete(acc)
    if req.niche is not None:
        user.niche = req.niche
    if req.target_audience is not None:
        user.target_audience = req.target_audience
    if req.brand_voice is not None:
        user.brand_voice = req.brand_voice
    if req.content_goals is not None:
        user.content_goals = req.content_goals
    if req.logo_url is not None:
        user.logo_url = req.logo_url
    if req.password is not None and req.password.strip():
        if user.password_hash and req.current_password:
            if hash_pw(req.current_password) != user.password_hash:
                raise HTTPException(status_code=400, detail="Current password is incorrect.")
        user.password_hash = hash_pw(req.password)

    
    user.profile_complete = True
    db.commit()
    db.refresh(user)


    # Store profile info in Hindsight memory
    if req.content_types:
        agent_memory_manager.store_user_fact(
            db, user.id, 
            f"Creator selected content types: {', '.join(req.content_types)}.", 
            category="user_profile"
        )
    if req.connected_platforms:
        agent_memory_manager.store_user_fact(
            db, user.id, 
            f"Creator is active on platforms: {', '.join(req.connected_platforms)}.", 
            category="user_profile"
        )

    return make_auth_response(user, "Profile updated successfully!")
