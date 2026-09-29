from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database.models import SocialPost, User
from app.services.hindsight_service import hindsight_service

class AgentTools:
    """
    Tools available to the SocialMind AI Agent to inspect structured DB records
    and interact with Hindsight memory.
    """

    @staticmethod
    def get_recent_posts(db: Session, user_id: int = 1, limit: int = 10) -> List[Dict[str, Any]]:
        posts = db.query(SocialPost).filter(SocialPost.user_id == user_id).order_by(SocialPost.published_at.desc()).limit(limit).all()
        return [
            {
                "id": p.id,
                "title": p.title,
                "platform": p.platform,
                "content_type": p.content_type,
                "topic": p.topic,
                "views": p.views,
                "engagement_rate": p.engagement_rate
            }
            for p in posts
        ]

    @staticmethod
    def get_post_performance(db: Session, post_id: int) -> Optional[Dict[str, Any]]:
        post = db.query(SocialPost).filter(SocialPost.id == post_id).first()
        if not post:
            return None
        return {
            "id": post.id,
            "title": post.title,
            "platform": post.platform,
            "content_type": post.content_type,
            "topic": post.topic,
            "views": post.views,
            "likes": post.likes,
            "comments": post.comments,
            "shares": post.shares,
            "saves": post.saves,
            "engagement_rate": post.engagement_rate
        }

    @staticmethod
    def calculate_engagement_rate(views: int, likes: int, comments: int, shares: int, saves: int) -> float:
        if not views or views == 0:
            return 0.0
        return round(((likes + comments + shares + saves) / views) * 100, 2)

    @staticmethod
    def find_top_performing_content(db: Session, user_id: int = 1, limit: int = 3) -> List[Dict[str, Any]]:
        posts = db.query(SocialPost).filter(SocialPost.user_id == user_id).order_by(SocialPost.engagement_rate.desc(), SocialPost.views.desc()).limit(limit).all()
        return [
            {
                "title": p.title,
                "topic": p.topic,
                "content_type": p.content_type,
                "views": p.views,
                "engagement_rate": p.engagement_rate
            }
            for p in posts
        ]

    @staticmethod
    def find_low_performing_content(db: Session, user_id: int = 1, limit: int = 3) -> List[Dict[str, Any]]:
        posts = db.query(SocialPost).filter(SocialPost.user_id == user_id).order_by(SocialPost.engagement_rate.asc(), SocialPost.views.asc()).limit(limit).all()
        return [
            {
                "title": p.title,
                "topic": p.topic,
                "content_type": p.content_type,
                "views": p.views,
                "engagement_rate": p.engagement_rate
            }
            for p in posts
        ]

    @staticmethod
    def find_content_gaps(db: Session, user_id: int = 1) -> List[str]:
        posts = db.query(SocialPost).filter(SocialPost.user_id == user_id).all()
        covered_topics = set(p.topic.lower() for p in posts)
        
        potential_gaps = [
            "Beginner Python API tutorial",
            "Debugging common Async JavaScript errors",
            "Code portfolio review for tech students",
            "FastAPI vs Flask quick comparison",
            "Git & GitHub workflow secrets"
        ]
        
        gaps = [gap for gap in potential_gaps if not any(t in gap.lower() for t in covered_topics)]
        return gaps or ["Advanced System Design", "Docker containers for beginners"]

    @staticmethod
    def get_audience_profile(db: Session, user_id: int = 1) -> Dict[str, Any]:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return {"niche": "Tech & Coding", "target_audience": "College students & beginner developers"}
        return {
            "name": user.name,
            "niche": user.niche or "Tech & Coding",
            "target_audience": user.target_audience or "College students & beginner developers",
            "brand_voice": user.brand_voice or "Educational, energetic, actionable",
            "content_goals": user.content_goals or "Grow channel and boost engagement"
        }

    @staticmethod
    def recall_relevant_memory(query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        return hindsight_service.recall(query, top_k=top_k)

    @staticmethod
    def store_memory(content: str, category: str = "general", metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        return hindsight_service.retain(content, category=category, metadata=metadata)

    @staticmethod
    def generate_content_ideas(topic: str, format_type: str = "Reel") -> List[str]:
        return [
            f"3 Common {topic} Mistakes Every Beginner Makes",
            f"Why Your {topic} Code Fails (and the 10-Second Fix)",
            f"How I Mastered {topic} in 7 Days as a Student"
        ]
