import urllib.request
import json

req = urllib.request.Request('http://localhost:8000/api/posts?platform=Instagram')
with urllib.request.urlopen(req) as res:
    posts = json.loads(res.read().decode('utf-8'))
    print(f"Total Instagram posts returned by API: {len(posts)}")
    for p in posts:
        print(f"ID {p['id']} | {p['content_type']} | Views: {p['views']} | Likes: {p['likes']} | Eng: {p['engagement_rate']}% | Published: {p['published_at']} | URL: {p['post_url']}")
