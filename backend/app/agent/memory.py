import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.services.hindsight_service import hindsight_service
from app.database.models import MemoryRecord, SocialPost, User

logger = logging.getLogger("socialmind.agent.memory")

class AgentMemoryManager:
    """
    Manages structured memory sync and Hindsight memory bank updates.
    """

    def __init__(self, hindsight=hindsight_service):
        self.hindsight = hindsight

    def store_user_fact(self, db: Session, user_id: int, content: str, category: str = "user_profile", metadata: Optional[Dict[str, Any]] = None) -> MemoryRecord:
        """
        Stores user fact in both PostgreSQL MemoryRecord table and Hindsight Memory Bank.
        """
        user = db.query(User).filter(User.id == user_id).first()
        bank_id = f"socialmind_user_{user_id}"

        # 1. Store in Hindsight
        h_res = self.hindsight.retain(content, category=category, metadata=metadata, bank_id=bank_id)
        hindsight_id = h_res.get("id") or h_res.get("hindsight_id")

        # 2. Store in DB
        mem_record = MemoryRecord(
            user_id=user_id,
            bank_id=bank_id,
            category=category,
            content=content,
            metadata_json=metadata or {},
            hindsight_id=hindsight_id
        )
        db.add(mem_record)
        db.commit()
        db.refresh(mem_record)

        logger.info(f"[Memory Created] Category: {category} | Content: '{content[:50]}...'")
        return mem_record

    def store_post_performance_memory(self, db: Session, post: SocialPost) -> MemoryRecord:
        """
        Translates a social post's metrics into a strategic memory in Hindsight.
        """
        category = "performance"
        performance_desc = "strong" if post.engagement_rate >= 5.0 else "moderate" if post.engagement_rate >= 2.5 else "low"
        
        content = (
            f"Post '{post.title or post.topic}' on {post.platform} ({post.content_type}) "
            f"achieved {post.views:,} views, {post.likes:,} likes, {post.comments:,} comments, "
            f"{post.shares:,} shares, {post.saves:,} saves with {post.engagement_rate}% engagement rate ({performance_desc} performance)."
        )

        metadata = {
            "post_id": post.id,
            "platform": post.platform,
            "content_type": post.content_type,
            "topic": post.topic,
            "views": post.views,
            "engagement_rate": post.engagement_rate
        }

        return self.store_user_fact(db, post.user_id, content, category=category, metadata=metadata)

    def recall_context(self, user_id: int, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Recall relevant memories from Hindsight.
        """
        bank_id = f"socialmind_user_{user_id}"
        return self.hindsight.recall(query, top_k=top_k, bank_id=bank_id)

    def reflect_context(self, user_id: int, query: str) -> Dict[str, Any]:
        """
        Use Hindsight Reflect engine to synthesize mental model.
        """
        bank_id = f"socialmind_user_{user_id}"
        return self.hindsight.reflect(query, bank_id=bank_id)

    def auto_extract_and_retain(self, db: Session, user_id: int, user_message: str):
        """
        Analyzes user conversation to automatically retain durable facts (e.g. preferences, metrics, audience notes).
        """
        msg_lower = user_message.lower()
        
        # Heuristic detection for memorable user statements
        if any(keyword in msg_lower for keyword in ["audience", "followers", "subscribers", "college", "students", "beginners"]):
            self.store_user_fact(db, user_id, user_message, category="audience")
        elif any(keyword in msg_lower for keyword in ["prefer", "like", "focus", "want", "goal", "niche", "style"]):
            self.store_user_fact(db, user_id, user_message, category="user_profile")
        elif any(keyword in msg_lower for keyword in ["tried", "tested", "experiment", "failed", "worked"]):
            self.store_user_fact(db, user_id, user_message, category="strategy")
        elif any(keyword in msg_lower for keyword in ["views", "likes", "comments", "viral", "reel got"]):
            self.store_user_fact(db, user_id, user_message, category="performance")

agent_memory_manager = AgentMemoryManager()
