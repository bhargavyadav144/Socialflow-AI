from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_otp_flow():
    # 1. Send OTP
    send_res = client.post("/api/auth/send-otp", json={"email": "creator@test.com"})
    assert send_res.status_code == 200
    data = send_res.json()
    assert data["status"] == "success"
    otp_code = data["demo_otp_code"]

    # 2. Verify OTP
    verify_res = client.post("/api/auth/verify-otp", json={"email": "creator@test.com", "otp_code": otp_code})
    assert verify_res.status_code == 200
    assert verify_res.json()["status"] == "verified"

    # 3. Register User with verified OTP
    reg_payload = {
        "name": "Verified Creator",
        "email": "creator@test.com",
        "password": "securepassword123",
        "otp_code": otp_code,
        "niche": "Technology",
        "target_audience": "Tech enthusiasts",
        "brand_voice": "Informative",
        "content_goals": "Growth",
        "terms_accepted": True
    }
    reg_res = client.post("/api/auth/register", json=reg_payload)
    assert reg_res.status_code == 200
    assert reg_res.json()["email"] == "creator@test.com"
