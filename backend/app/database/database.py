import logging
from typing import Any, Dict
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

logger = logging.getLogger("socialflow.db")

db_url = settings.DATABASE_URL.strip()

# Standardize Heroku/Render/Supabase postgres:// to postgresql:// for SQLAlchemy 2.0
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

engine_kwargs: Dict[str, Any] = {}
if db_url.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    # PostgreSQL pool settings
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20

logger.info(f"Connecting database engine using driver: {db_url.split(':')[0]}")

try:
    engine = create_engine(db_url, **engine_kwargs)
except Exception as e:
    logger.warning(f"Unable to connect to primary database URL ({db_url.split('@')[-1] if '@' in db_url else db_url}). Error: {e}")
    # Fallback to local SQLite if PostgreSQL connection fails
    fallback_url = "sqlite:///./socialflow.db"
    logger.info(f"Falling back to local SQLite database: {fallback_url}")
    engine = create_engine(fallback_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
