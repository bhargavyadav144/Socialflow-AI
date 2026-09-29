import urllib.request
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9'
}

def parse_count(num_str):
    if not num_str:
        return 0
    clean = num_str.replace(',', '').strip().upper()
    try:
        if clean.endswith('K'):
            return int(float(clean[:-1]) * 1000)
        if clean.endswith('M'):
            return int(float(clean[:-1]) * 1000000)
        return int(float(clean))
    except Exception:
        return 0

def resolve_url(url):
    clean_url = url.strip()
    if not clean_url.startswith('http'):
        clean_url = 'https://' + clean_url

    res_data = {
        'url': clean_url,
        'platform': 'Unknown',
        'handle': '',
        'name': '',
        'followers': 0,
        'following': 0,
        'posts_count': 0,
        'bio': '',
        'avatar_url': ''
    }

    # YouTube
    if 'youtube.com' in clean_url or 'youtu.be' in clean_url:
        from app.services.youtube_sync_service import youtube_sync_service
        handle = clean_url.split('@')[-1].split('/')[0].split('?')[0] if '@' in clean_url else clean_url.split('/')[-1]
        yt_info = youtube_sync_service.fetch_channel_telemetry(handle)
        if yt_info:
            return {
                'url': clean_url,
                'platform': 'YouTube',
                'handle': yt_info.get('custom_url') or f'@{handle}',
                'name': yt_info.get('title'),
                'followers': yt_info.get('subscribers', 0),
                'following': 0,
                'posts_count': yt_info.get('total_videos', 0),
                'bio': yt_info.get('description', ''),
                'avatar_url': yt_info.get('avatar_url', '')
            }

    # Instagram, X, LinkedIn, Facebook via metadata extraction
    try:
        req = urllib.request.Request(clean_url, headers=headers)
        html = urllib.request.urlopen(req, timeout=8).read().decode('utf-8', errors='ignore')
        
        og_desc = re.search(r'<meta\s+(?:property|name)=["\']og:description["\']\s+content=["\']([^"\']+)["\']', html)
        og_title = re.search(r'<meta\s+(?:property|name)=["\']og:title["\']\s+content=["\']([^"\']+)["\']', html)
        og_image = re.search(r'<meta\s+(?:property|name)=["\']og:image["\']\s+content=["\']([^"\']+)["\']', html)
        
        desc = og_desc.group(1) if og_desc else ''
        title = og_title.group(1) if og_title else ''
        image = og_image.group(1) if og_image else ''

        if 'instagram.com' in clean_url:
            res_data['platform'] = 'Instagram'
            handle_match = clean_url.split('instagram.com/')[-1].split('/')[0].split('?')[0]
            res_data['handle'] = f'@{handle_match}'
            res_data['name'] = title.split('•')[0].split('(@')[0].strip() or handle_match
            res_data['avatar_url'] = image
            
            # Match '12K Followers, 340 Following, 45 Posts'
            stats = re.search(r'([\d,\.]+[KMkm]?)\s*Followers,\s*([\d,\.]+[KMkm]?)\s*Following,\s*([\d,\.]+[KMkm]?)\s*Posts', desc, re.IGNORECASE)
            if stats:
                res_data['followers'] = parse_count(stats.group(1))
                res_data['following'] = parse_count(stats.group(2))
                res_data['posts_count'] = parse_count(stats.group(3))
            
            # Extract bio from desc
            if 'photos and videos from' in desc:
                res_data['bio'] = desc.split('photos and videos from')[-1].replace('...', '').strip()

        elif 'linkedin.com' in clean_url:
            res_data['platform'] = 'LinkedIn'
            res_data['name'] = title.split('|')[0].split('-')[0].strip()
            res_data['bio'] = desc
            res_data['avatar_url'] = image

        elif 'x.com' in clean_url or 'twitter.com' in clean_url:
            res_data['platform'] = 'X / Twitter'
            handle_match = clean_url.split('.com/')[-1].split('/')[0].split('?')[0]
            res_data['handle'] = f'@{handle_match}'
            res_data['name'] = title.split('(')[0].strip() or handle_match
            res_data['bio'] = desc
            res_data['avatar_url'] = image

    except Exception as e:
        res_data['error'] = str(e)

    return res_data

if __name__ == '__main__':
    urls = [
        'https://youtube.com/@bhargavtalks',
        'https://www.instagram.com/bhargavofficial_?utm_source=qr&igsh=Z2NuNzk4em9xMWww',
        'https://x.com/gandubhargav004',
        'https://www.linkedin.com/in/bhargav-gandu-242030392'
    ]
    for u in urls:
        print(f'Testing {u}:')
        print(json.dumps(resolve_url(u), indent=2))
        print('-'*50)
