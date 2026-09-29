from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.database import get_db
from app.database.models import SocialPost
from app.schemas.posts import SocialPostCreate, SocialPostUpdate, SocialPostResponse
from app.services.analytics_service import analytics_service
from app.services.url_resolver_service import url_resolver_service
from app.agent.memory import agent_memory_manager
from pydantic import BaseModel

class PostUrlResolveRequest(BaseModel):
    url: str

router = APIRouter()

@router.post("/posts/resolve-url")
def resolve_post_url_endpoint(req: PostUrlResolveRequest):
    """
    Auto-extracts real video title, thumbnail, views, likes, comments, and publish date
    when a reel or post link is pasted.
    """
    return url_resolver_service.resolve_post_url(req.url)


@router.get("/posts", response_model=List[SocialPostResponse])
def get_posts(
    platform: Optional[str] = Query(None),
    topic: Optional[str] = Query(None),
    is_promotion: Optional[bool] = Query(None),
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    query = db.query(SocialPost).filter(SocialPost.user_id == user_id)
    if platform:
        query = query.filter(SocialPost.platform == platform)
    if topic:
        query = query.filter(SocialPost.topic == topic)
    if is_promotion is not None:
        query = query.filter(SocialPost.is_promotion == is_promotion)
    
    posts = query.order_by(SocialPost.published_at.desc()).all()
    
    # Calculate & save engagement rates
    for p in posts:
        p.engagement_rate = analytics_service.calculate_post_engagement(p)
    db.commit()

    return posts

@router.post("/posts", response_model=SocialPostResponse)
def create_post(post_in: SocialPostCreate, user_id: int = 1, db: Session = Depends(get_db)):
    # Generate automatic AI Reach & Performance Diagnosis
    views = post_in.views or 0
    likes = post_in.likes or 0
    saves = post_in.saves or 0
    comments = post_in.comments or 0
    shares = post_in.shares or 0
    
    save_ratio = (saves / views * 100) if views > 0 else 0
    like_ratio = (likes / views * 100) if views > 0 else 0
    share_ratio = (shares / views * 100) if views > 0 else 0

    reasons = []
    if save_ratio > 1.5:
        reasons.append(f"🔥 High Bookmark Velocity ({saves:,} saves / {save_ratio:.1f}% ratio) signals strong evergreen value to the algorithm.")
    if share_ratio > 0.8:
        reasons.append(f"🚀 High Share Rate ({shares:,} shares) pushed this {post_in.content_type} into Explore & Recommended feeds.")
    if comments > 50:
        reasons.append(f"💬 Active Discussion ({comments:,} comments) kept watch time retention high.")
    if views > 20000:
        reasons.append(f"📈 Strong Hook & Watch Duration converted initial impressions into viral momentum.")
    
    if not reasons:
        reasons.append(f"Steady audience engagement across {post_in.platform}. Standard distribution curve.")

    ai_reach_summary = " | ".join(reasons)

    # 1. Create structured DB post
    post = SocialPost(
        user_id=user_id,
        platform=post_in.platform,
        content_type=post_in.content_type,
        title=post_in.title,
        topic=post_in.topic,
        caption=post_in.caption,
        post_url=post_in.post_url,
        media_url=post_in.media_url,
        published_at=post_in.published_at or datetime.utcnow(),
        is_promotion=post_in.is_promotion,
        brand_name=post_in.brand_name,
        sponsorship_amount=post_in.sponsorship_amount,
        promotion_type=post_in.promotion_type,
        views=views,
        likes=likes,
        comments=comments,
        shares=shares,
        saves=saves,
        ai_analysis=ai_reach_summary
    )
    post.engagement_rate = analytics_service.calculate_post_engagement(post)
    
    db.add(post)
    db.commit()
    db.refresh(post)

    # 2. Extract performance insight & Retain memory in Hindsight!
    agent_memory_manager.store_post_performance_memory(db, post)
    
    # Also log reach breakdown into Hindsight memory bank
    fact_text = (
        f"Real {post.platform} {post.content_type} '{post.title}' achieved {post.views:,} views and {post.engagement_rate}% engagement. "
        f"Reach Driver: {ai_reach_summary}"
    )
    agent_memory_manager.store_user_fact(db, user_id, fact_text, category="performance")

    return post

@router.put("/posts/{post_id}", response_model=SocialPostResponse)
def update_post(post_id: int, post_in: SocialPostUpdate, db: Session = Depends(get_db)):
    post = db.query(SocialPost).filter(SocialPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    update_data = post_in.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(post, field, val)

    post.engagement_rate = analytics_service.calculate_post_engagement(post)
    db.commit()
    db.refresh(post)

    # Update memory in Hindsight
    agent_memory_manager.store_post_performance_memory(db, post)

    return post

@router.post("/posts/analyze-and-train")
def analyze_and_train_posts(user_id: int = Query(1), db: Session = Depends(get_db)):
    """
    AI Agent analyzes all reels and posts for the creator, categorizes content,
    extracts performance drivers, and trains the Hindsight AI memory bank.
    """
    posts = db.query(SocialPost).filter(SocialPost.user_id == user_id).all()
    if not posts:
        return {"status": "no_posts", "message": "No posts found to analyze.", "trained_count": 0}

    trained_insights = []
    
    for p in posts:
        p.engagement_rate = analytics_service.calculate_post_engagement(p)
        
        # Determine AI specific subcategory
        topic_lower = (p.topic or "").lower()
        title_lower = (p.title or "").lower()
        cap_lower = (p.caption or "").lower()
        
        if "agent" in title_lower or "ai" in title_lower or "tool" in title_lower:
            ai_category = "Tech & AI - Tool Breakdown"
            insight_note = "High save-to-like ratio indicates strong reference value for developers."
        elif "vlog" in title_lower or "day in the life" in title_lower or "lifestyle" in topic_lower:
            ai_category = "Lifestyle - Engineer Vlog"
            insight_note = "High comment engagement driven by relatable personal storytelling."
        elif "design" in title_lower or "architecture" in title_lower or "cheat sheet" in title_lower:
            ai_category = "Tech & AI - Educational Guide"
            insight_note = "Carousel format maximized bookmark/save rates."
        elif "tutorial" in title_lower or "course" in title_lower or "masterclass" in title_lower:
            ai_category = "Tech & AI - Deep Dive Tutorial"
            insight_note = "Longer watch duration correlated with strong subscriber conversions."
        elif "lesson" in title_lower or "startup" in title_lower or "thread" in title_lower:
            ai_category = "Tech & AI - Thought Leadership Thread"
            insight_note = "High viral share velocity across creator circles."
        else:
            ai_category = f"{p.topic or 'General'} - {p.content_type}"
            insight_note = f"Performance benchmarked at {p.engagement_rate}% engagement."

        # Retain post memory in Hindsight bank
        agent_memory_manager.store_post_performance_memory(db, p)
        
        fact_text = (
            f"AI Post Analysis: {p.platform} {p.content_type} '{p.title}' categorized as [{ai_category}]. "
            f"Metrics: {p.views:,} views, {p.likes:,} likes, {p.saves:,} saves ({p.engagement_rate}% engagement). {insight_note}"
        )
        agent_memory_manager.store_user_fact(db, user_id, fact_text, category="performance")
        
        trained_insights.append({
            "post_id": p.id,
            "title": p.title,
            "platform": p.platform,
            "content_type": p.content_type,
            "ai_category": ai_category,
            "engagement_rate": p.engagement_rate,
            "insight_note": insight_note
        })

    # Add overarching strategic memory fact
    best_post = max(posts, key=lambda x: x.engagement_rate if x.engagement_rate else 0)
    summary_fact = (
        f"AI Strategy Model Trained: Creator's top-performing format is {best_post.platform} {best_post.content_type} "
        f"('{best_post.title}') with {best_post.engagement_rate}% engagement rate. Primary audience affinity: Tech & AI and Lifestyle."
    )
    agent_memory_manager.store_user_fact(db, user_id, summary_fact, category="strategy")

    db.commit()

    return {
        "status": "success",
        "message": f"Successfully analyzed and trained AI on {len(posts)} posts and reels!",
        "analyzed_count": len(posts),
        "trained_insights": trained_insights,
        "best_performing_post": best_post.title
    }

from fastapi.responses import Response
import urllib.request

@router.get("/proxy-image")
def proxy_image(url: str = Query(...)):
    """
    Proxies remote images (Instagram CDN, YouTube, etc.) to bypass hotlinking,
    CORS, and referrer restrictions in browser clients.
    """
    if not url or not url.startswith("http"):
        raise HTTPException(status_code=400, detail="Invalid image URL")
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
    }
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            content_type = resp.headers.get("Content-Type", "image/jpeg")
            img_data = resp.read()
            return Response(
                content=img_data,
                media_type=content_type,
                headers={"Cache-Control": "public, max-age=86400"}
            )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch upstream image: {str(e)}")


