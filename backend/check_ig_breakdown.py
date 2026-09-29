import urllib.request
import re
import json
import sys
import os

sys.path.insert(0, os.path.abspath('backend'))
sys.path.insert(0, os.path.abspath('.'))

from app.database.database import SessionLocal
from app.database.models import SocialPost, SocialAccount

print("=== 1. LIVE INSTAGRAM PROFILE CHECK (@bhargavofficial_) ===")
req = urllib.request.Request(
    'https://www.instagram.com/bhargavofficial_/',
    headers={'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'}
)
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        desc_match = re.search(r'<meta (?:property|name)="og:description" content="([^"]*)"', html)
        title_match = re.search(r'<meta (?:property|name)="og:title" content="([^"]*)"', html)
        if desc_match:
            print(f"Live Description: {desc_match.group(1)}")
        if title_match:
            print(f"Live Title: {title_match.group(1)}")
except Exception as e:
    print(f"Live IG fetch notice: {e}")

print("\n=== 2. APPLICATION DATABASE CONTENT BREAKDOWN ===")
db = SessionLocal()
try:
    ig_posts = db.query(SocialPost).filter(SocialPost.platform == "Instagram").all()
    print(f"Total Instagram Content Synced: {len(ig_posts)} items")
    
    reels = [p for p in ig_posts if (p.content_type or '').lower() == 'reel']
    carousels = [p for p in ig_posts if (p.content_type or '').lower() == 'carousel']
    posts = [p for p in ig_posts if (p.content_type or '').lower() == 'post']
    videos = [p for p in ig_posts if (p.content_type or '').lower() == 'video']

    total_views = sum(p.views or 0 for p in ig_posts)
    total_likes = sum(p.likes or 0 for p in ig_posts)
    total_comments = sum(p.comments or 0 for p in ig_posts)
    total_saves = sum(p.saves or 0 for p in ig_posts)
    
    print(f" - Reels (Short Videos): {len(reels)}")
    print(f" - Carousels (Multi-slide Photos): {len(carousels)}")
    print(f" - Standard Posts / Single Photos: {len(posts)}")
    print(f" - Long Videos / IGTV: {len(videos)}")
    print(f"\nTotal Accumulated Views: {total_views:,}")
    print(f"Total Accumulated Likes: {total_likes:,}")
    print(f"Total Comments: {total_comments:,}")
    print(f"Total Saves / Bookmarks: {total_saves:,}")

finally:
    db.close()
