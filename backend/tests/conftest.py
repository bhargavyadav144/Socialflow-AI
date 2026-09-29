import pytest
from app.database.database import engine, Base, SessionLocal
from seed_demo import seed_demo_data

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_demo_data(db)
    db.close()
    yield
