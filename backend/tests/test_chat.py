from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_analytics_overview():
    response = client.get("/api/analytics")
    assert response.status_code == 200
    data = response.json()
    assert "total_posts" in data
    assert "average_engagement" in data
    assert data["total_posts"] >= 0

def test_chat_with_memory():
    res = client.post("/api/chat", json={"message": "What should I post next?"})
    assert res.status_code == 200
    data = res.json()
    assert "response" in data
    assert "memory_used" in data

def test_chat_no_memory_demo():
    res = client.post("/api/chat", json={"message": "What should I post next?", "disable_memory": True})
    assert res.status_code == 200
    data = res.json()
    assert data["memory_used"] == False
