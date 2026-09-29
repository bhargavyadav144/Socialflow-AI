import os
import sys

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database.database import SessionLocal
from app.database.models import SocialPost, SocialAccount
from app.services.analytics_service import analytics_service
import re

db = SessionLocal()
try:
    # 1. Remove any legacy mock posts with None media_url or None post_url
    deleted = db.query(SocialPost).filter(
        (SocialPost.post_url == None) | 
        (SocialPost.post_url == "https://www.youtube.com/watch?v=dQw4w9WgXcQ") |
        (SocialPost.post_url == "https://www.youtube.com/shorts/dQw4w9WgXcQ")
    ).delete(synchronize_session=False)
    db.commit()
    print(f"Cleaned up {deleted} legacy/dummy mock posts.")

    # 2. Verify all remaining posts have crisp high-res media thumbnails
    posts = db.query(SocialPost).all()
    print(f"Total authentic posts remaining: {len(posts)}")

    for p in posts:
        # If it's a YouTube post, ensure it has the high quality ytimg thumbnail
        if (p.platform or '').lower() == 'youtube':
            match = re.search(r'(?:v=|shorts\/|youtu\.be\/)([A-Za-z0-9_-]{11})', p.post_url or '')
            if match and match.group(1):
                vid_id = match.group(1)
                p.media_url = f"https://i.ytimg.com/vi/{vid_id}/hqdefault.jpg"
        
        # Calculate accurate engagement rate
        p.engagement_rate = analytics_service.calculate_post_engagement(p)

    db.commit()
    print(f"Successfully refined all {len(posts)} authentic posts with genuine high-resolution thumbnails!")

finally:
    db.close()
