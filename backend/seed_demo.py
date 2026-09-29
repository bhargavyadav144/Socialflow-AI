from typing import Optional
from sqlalchemy.orm import Session
from app.database.database import SessionLocal, engine, Base

def seed_demo_data(db: Optional[Session] = None):
    """
    Clean table initializer. No dummy users or fake posts are auto-seeded.
    Real accounts are created via User Registration with OTP verification.
    """
    close_session = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_session = True

    if close_session:
        db.close()

    return {
        "status": "clean_initialized",
        "message": "Database initialized cleanly for real user registrations."
    }

if __name__ == "__main__":
    res = seed_demo_data()
    print("Database Initialized:", res)
