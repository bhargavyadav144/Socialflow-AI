import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.database import engine, Base, SessionLocal
from app.api.routes import health, chat, posts, analytics, memory, demo, users, auth, social_accounts
from seed_demo import seed_demo_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("socialflow")

app = FastAPI(
    title=settings.APP_NAME,
    description="SocialFlow AI - AI-powered Social Media Memory & Strategy Agent utilizing Vectorize Hindsight",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import HTMLResponse

@app.get("/privacy", response_class=HTMLResponse, tags=["Legal"])
def get_privacy_policy():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Privacy Policy - SocialFlow AI</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1e293b; background-color: #f8fafc; }
            h1, h2 { color: #0f172a; }
            h1 { border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
            .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; background: #e0f2fe; color: #0284c7; font-size: 12px; font-weight: bold; }
            .card { background: #ffffff; padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="card">
            <span class="badge">Official Compliance</span>
            <h1>Privacy Policy for SocialFlow AI</h1>
            <p><strong>Last Updated: September 2026</strong></p>
            <p>Welcome to <strong>SocialFlow AI</strong> ("we", "our", or "us"). We respect your privacy and are committed to protecting the personal data and social media metrics you share with us.</p>
            
            <h2>1. Information We Collect</h2>
            <p>When you use SocialFlow AI, we may collect:</p>
            <ul>
                <li><strong>Account Information:</strong> Name, email address, phone number, and profile bio.</li>
                <li><strong>Social Media Analytics:</strong> Public follower counts, post titles, view metrics, likes, shares, and comments retrieved via authorized APIs (Meta Graph API, YouTube Data API, LinkedIn API, X API).</li>
                <li><strong>Hindsight Memory Telemetry:</strong> Anonymized performance insights to train your personal AI content strategist.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <ul>
                <li>To generate personalized content strategies and viral reel scripts.</li>
                <li>To synchronize channel performance metrics in real-time.</li>
                <li>To optimize AI memory recall for your creator workspace.</li>
                <li>We <strong>never sell</strong> your personal data or social media tokens to third parties.</li>
            </ul>

            <h2>3. Data Security & Storage</h2>
            <p>All API tokens and credentials are securely encrypted and stored with restricted access. OAuth tokens are used solely for read-only analytics queries authorized by you.</p>

            <h2>4. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact our support team at: <strong>dmspark.support@gmail.com</strong></p>
        </div>
    </body>
    </html>
    """

# Include API Routers
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(users.router, prefix="/api", tags=["Users Profile"])
app.include_router(social_accounts.router, prefix="/api", tags=["Social Accounts Integration"])
app.include_router(chat.router, prefix="/api", tags=["Chat & Agent"])
app.include_router(posts.router, prefix="/api", tags=["Social Posts"])
app.include_router(analytics.router, prefix="/api", tags=["Analytics"])
app.include_router(memory.router, prefix="/api", tags=["Hindsight Memory"])
app.include_router(demo.router, prefix="/api", tags=["Demo Management"])

from app.services.telemetry_scheduler import telemetry_scheduler

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed if database is brand new
    db = SessionLocal()
    try:
        from app.database.models import User
        user_count = db.query(User).count()
        if user_count == 0:
            logger.info("Database empty. Auto-seeding initial creator profiles & Hindsight memory banks...")
            seed_demo_data(db)
    finally:
        db.close()

    # Launch 5-minute automated live telemetry scheduler
    telemetry_scheduler.start()
    logger.info(f"{settings.APP_NAME} backend started successfully on port {settings.PORT} with 5-minute live telemetry polling active.")

@app.on_event("shutdown")
def shutdown_event():
    telemetry_scheduler.stop()
    logger.info("Telemetry background scheduler stopped.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
