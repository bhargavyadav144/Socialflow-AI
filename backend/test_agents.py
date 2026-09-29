import urllib.request
import re
import html

def test_user_agents(url):
    agents = [
        ('facebookexternalhit', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.html)'),
        ('googlebot', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'),
        ('twitterbot', 'Twitterbot/1.0'),
        ('bingbot', 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'),
        ('whatsapp', 'WhatsApp/2.21.12.21 A')
    ]
    for name, ua in agents:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': ua, 'Accept-Language': 'en-US,en;q=0.9'})
            res = urllib.request.urlopen(req, timeout=8)
            html_text = res.read().decode('utf-8', errors='ignore')
            
            og_title = re.search(r'<meta\s+[^>]*property=["\']og:title["\'][^>]*content=["\']([^"\']*)["\']', html_text, re.I)
            if not og_title:
                og_title = re.search(r'<meta\s+[^>]*content=["\']([^"\']*)["\'][^>]*property=["\']og:title["\']', html_text, re.I)
            og_desc = re.search(r'<meta\s+[^>]*property=["\']og:description["\'][^>]*content=["\']([^"\']*)["\']', html_text, re.I)
            if not og_desc:
                og_desc = re.search(r'<meta\s+[^>]*content=["\']([^"\']*)["\'][^>]*property=["\']og:description["\']', html_text, re.I)
            og_img = re.search(r'<meta\s+[^>]*property=["\']og:image["\'][^>]*content=["\']([^"\']*)["\']', html_text, re.I)
            if not og_img:
                og_img = re.search(r'<meta\s+[^>]*content=["\']([^"\']*)["\'][^>]*property=["\']og:image["\']', html_text, re.I)

            print(f"[{name}] Title: {og_title.group(1) if og_title else 'None'} | Desc: {og_desc.group(1) if og_desc else 'None'} | Img: {bool(og_img)}")
        except Exception as e:
            print(f"[{name}] Error: {e}")

print("=== Instagram ===")
test_user_agents('https://www.instagram.com/bhargavofficial_/')

print("\n=== LinkedIn ===")
test_user_agents('https://www.linkedin.com/in/bhargav-gandu-242030392')
