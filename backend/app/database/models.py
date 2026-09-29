from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from app.database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(200), nullable=True)
    phone = Column(String(20), nullable=True)
    gender = Column(String(20), nullable=True)
    dob = Column(String(50), nullable=True)
    niche = Column(String(100), nullable=True)
    target_audience = Column(Text, nullable=True)
    brand_voice = Column(String(100), nullable=True)
    content_goals = Column(Text, nullable=True)
    logo_url = Column(String(300), nullable=True)
    avatar_url = Column(Text, nullable=True)
    bio = Column(Text, nullable=True)
    website = Column(String(200), nullable=True)
    location = Column(String(100), nullable=True)
    platform_urls = Column(JSON, nullable=True)  # Dict mapping platform name -> profile URL / handle
    
    # Profile setup fields
    content_types = Column(JSON, nullable=True)  # List of selected categories/topics
    connected_platforms = Column(JSON, nullable=True)  # List of up to 10 platforms
    profile_complete = Column(Boolean, default=False)

    
    # Email Verification & OTP
    is_verified = Column(Boolean, default=False)
    otp_code = Column(String(10), nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
    terms_accepted = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    posts = relationship("SocialPost", back_populates="user", cascade="all, delete-orphan")
    social_accounts = relationship("SocialAccount", back_populates="user", cascade="all, delete-orphan")
    experiments = relationship("ContentExperiment", back_populates="user", cascade="all, delete-orphan")
    interactions = relationship("AgentInteraction", back_populates="user", cascade="all, delete-orphan")
    memories = relationship("MemoryRecord", back_populates="user", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")


class SocialAccount(Base):
    __tablename__ = "social_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    platform = Column(String(50), nullable=False)
    account_name = Column(String(100), nullable=False)
    handle_or_id = Column(String(100), nullable=False)
    connected = Column(Boolean, default=True)
    followers_count = Column(Integer, default=0)
    following_count = Column(Integer, default=0)
    posts_count = Column(Integer, default=0)
    bio = Column(Text, nullable=True)
    profile_pic_url = Column(Text, nullable=True)
    access_token_masked = Column(String(100), nullable=True)
    last_synced_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="social_accounts")


class SocialPost(Base):
    __tablename__ = "social_posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    platform = Column(String(50), nullable=False)
    content_type = Column(String(50), nullable=False)
    title = Column(String(200), nullable=True)
    topic = Column(String(100), nullable=False)
    caption = Column(Text, nullable=True)
    post_url = Column(String(300), nullable=True)
    media_url = Column(Text, nullable=True)
    published_at = Column(DateTime, default=datetime.utcnow)
    
    # Promotion & Sponsorship tracking
    is_promotion = Column(Boolean, default=False)
    brand_name = Column(String(100), nullable=True)
    sponsorship_amount = Column(Float, default=0.0)
    promotion_type = Column(String(50), nullable=True)
    
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    saves = Column(Integer, default=0)
    engagement_rate = Column(Float, default=0.0)
    ai_analysis = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="posts")


class ContentExperiment(Base):
    __tablename__ = "content_experiments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    hypothesis = Column(Text, nullable=False)
    action = Column(Text, nullable=False)
    result = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="experiments")


class AgentInteraction(Base):
    __tablename__ = "agent_interactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_message = Column(Text, nullable=False)
    agent_response = Column(Text, nullable=False)
    memory_used = Column(Boolean, default=False)
    memory_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="interactions")


class MemoryRecord(Base):
    __tablename__ = "memory_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bank_id = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    metadata_json = Column(JSON, nullable=True)
    hindsight_id = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="memories")


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String(100), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), default="New Conversation")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan", order_by="ChatMessage.created_at")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), ForeignKey("chat_sessions.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sender = Column(String(20), nullable=False)  # 'user' or 'agent'
    text = Column(Text, nullable=False)
    memory_used = Column(Boolean, default=False)
    memory_count = Column(Integer, default=0)
    sources = Column(JSON, nullable=True)
    recalled_memories = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")
    user = relationship("User", back_populates="chat_messages")
