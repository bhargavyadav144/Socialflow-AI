from app.database.database import SessionLocal
from app.database.models import SocialAccount, SocialPost, User
from app.services.youtube_sync_service import youtube_sync_service
from app.services.analytics_service import analytics_service
from app.agent.memory import agent_memory_manager
from datetime import datetime

db = SessionLocal()

user = db.query(User).filter(User.id == 1).first()
if user:
    user.connected_platforms = ['YouTube', 'Instagram', 'X / Twitter', 'LinkedIn', 'Facebook']
    user.platform_urls = {
        'YouTube': 'https://youtube.com/@bhargavtalks',
        'Instagram': 'https://instagram.com/bhargavofficial_',
        'X / Twitter': 'https://x.com/gandubhargav004',
        'LinkedIn': 'https://linkedin.com/in/bhargav-gandu-242030392',
        'Facebook': 'https://facebook.com/kindkart'
    }
    db.commit()

yt_data = youtube_sync_service.fetch_channel_telemetry('bhargavtalks')

accounts_config = [
    {
        'platform': 'YouTube',
        'name': yt_data['title'] if yt_data else 'Bhargav Talks',
        'handle': '@bhargavtalks',
        'followers': yt_data['subscribers'] if yt_data else 9460,
        'posts_count': yt_data['total_videos'] if yt_data else 350,
        'bio': yt_data['description'] if yt_data else 'Entertainment, dance and comedy creator.',
        'profile_pic_url': yt_data['avatar_url'] if yt_data else None
    },
    {
        'platform': 'Instagram',
        'name': 'Bhargav Official',
        'handle': '@bhargavofficial_',
        'followers': 14200,
        'posts_count': 18,
        'bio': 'Content Creator | Tech & Lifestyle Vlogs | Daily Stories',
        'profile_pic_url': None
    },
    {
        'platform': 'X / Twitter',
        'name': 'Bhargav Gandu',
        'handle': '@gandubhargav004',
        'followers': 1250,
        'posts_count': 45,
        'bio': 'Building AI workflows, developer tools, and sharing creator insights.',
        'profile_pic_url': None
    },
    {
        'platform': 'LinkedIn',
        'name': 'Bhargav Gandu',
        'handle': 'bhargav-gandu-242030392',
        'followers': 2850,
        'posts_count': 22,
        'bio': 'Software Engineer & AI Researcher | Sharing tech system design and career lessons.',
        'profile_pic_url': None
    },
    {
        'platform': 'Facebook',
        'name': 'Bhargav Official / Kind Kart',
        'handle': 'kindkart',
        'followers': 3400,
        'posts_count': 15,
        'bio': 'Official Creator Community & Video Hub.',
        'profile_pic_url': None
    }
]

db.query(SocialAccount).filter(~SocialAccount.platform.in_(['YouTube', 'Instagram', 'X / Twitter', 'LinkedIn', 'Facebook'])).delete(synchronize_session=False)

for cfg in accounts_config:
    acc = db.query(SocialAccount).filter(SocialAccount.platform == cfg['platform']).first()
    if not acc:
        acc = SocialAccount(user_id=1, platform=cfg['platform'])
        db.add(acc)
    acc.account_name = cfg['name']
    acc.handle_or_id = cfg['handle']
    acc.followers_count = cfg['followers']
    acc.posts_count = cfg['posts_count']
    acc.bio = cfg['bio']
    if cfg.get('profile_pic_url'):
        acc.profile_pic_url = cfg['profile_pic_url']
    acc.connected = True
    acc.last_synced_at = datetime.utcnow()

db.commit()

# Retain overall creator profile memory
fact = "Creator Bhargav operates 5 connected channels: YouTube (@bhargavtalks - 9,460 subs, 9.47M views), Instagram (@bhargavofficial_), X (@gandubhargav004), LinkedIn (Bhargav Gandu), and Facebook (Kind Kart)."
agent_memory_manager.store_user_fact(db, 1, fact, category='strategy')

db.commit()
print('SYNC_SUCCESS')
db.close()
