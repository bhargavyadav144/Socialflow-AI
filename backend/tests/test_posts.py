from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_posts():
    response = client.get("/api/posts")
    assert response.status_code == 200
    posts = response.json()
    assert isinstance(posts, list)
    assert len(posts) > 0

def test_create_and_delete_post():
    payload = {
        "platform": "Instagram",
        "content_type": "Reel",
        "title": "Test Reel Post",
        "topic": "Testing",
        "caption": "Testing post creation",
        "views": 1000,
        "likes": 100,
        "comments": 10,
        "shares": 5,
        "saves": 15
    }
    create_res = client.post("/api/posts", json=payload)
    assert create_res.status_code == 200
    created = create_res.json()
    assert created["title"] == "Test Reel Post"
    assert created["engagement_rate"] == 13.0 # (100+10+5+15)/1000 * 100

    post_id = created["id"]
    delete_res = client.delete(f"/api/posts/{post_id}")
    assert delete_res.status_code == 200
    assert delete_res.json()["status"] == "deleted"
