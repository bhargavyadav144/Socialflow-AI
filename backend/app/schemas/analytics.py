from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class AnalyticsOverview(BaseModel):
    total_posts: int
    total_views: int
    total_likes: int
    total_comments: int
    average_engagement: float
    best_performing_post: Optional[Dict[str, Any]] = None
    worst_performing_post: Optional[Dict[str, Any]] = None
    best_content_type: Optional[str] = None
    best_topic: Optional[str] = None
    performance_trend: List[Dict[str, Any]] = []
    top_posts: List[Dict[str, Any]] = []
    ai_insights: List[str] = []
