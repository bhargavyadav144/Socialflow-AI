import urllib.request
import re
import html
import json

def parse_number_str(s):
    if not s:
        return 0
    s = s.strip().upper().replace(',', '')
    try:
        if 'M' in s:
            return int(float(s.replace('M', '')) * 1_000_000)
        elif 'K' in s:
            return int(float(s.replace('K', '')) * 1_000)
        else:
            return int(float(re.sub(r'[^\d.]', '', s)))
    except:
        return 0

def test_extract(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        res = urllib.request.urlopen(req, timeout=10)
        html_text = res.read().decode('utf-8', errors='ignore')
        
        # Meta tags
        og_title = re.search(r'<meta\s+[^>]*property=["\']og:title["\'][^>]*content=["\']([^"\']*)["\']', html_text, re.I)
        if not og_title:
            og_title = re.search(r'<meta\s+[^>]*content=["\']([^"\']*)["\'][^>]*property=["\']og:title["\']', html_text, re.I)
            
        og_desc = re.search(r'<meta\s+[^>]*property=["\']og:description["\'][^>]*content=["\']([^"\']*)["\']', html_text, re.I)
        if not og_desc:
            og_desc = re.search(r'<meta\s+[^>]*content=["\']([^"\']*)["\'][^>]*property=["\']og:description["\']', html_text, re.I)
            
        og_img = re.search(r'<meta\s+[^>]*property=["\']og:image["\'][^>]*content=["\']([^"\']*)["\']', html_text, re.I)
        if not og_img:
            og_img = re.search(r'<meta\s+[^>]*content=["\']([^"\']*)["\'][^>]*property=["\']og:image["\']', html_text, re.I)
            
        title_val = html.unescape(og_title.group(1)) if og_title else ""
        desc_val = html.unescape(og_desc.group(1)) if og_desc else ""
        img_val = html.unescape(og_img.group(1)) if og_img else ""
        
        print(f"=== URL: {url} ===")
        print("Title:", title_val)
        print("Desc:", desc_val)
        print("Image:", img_val[:120] if img_val else "None")
        
        # Regex for Instagram
        ig_match = re.search(r'([\d.,KM]+)\s*Followers,\s*([\d.,KM]+)\s*Following,\s*([\d.,KM]+)\s*Posts', desc_val, re.I)
        if ig_match:
            print("-> Parsed IG Followers:", parse_number_str(ig_match.group(1)))
            print("-> Parsed IG Following:", parse_number_str(ig_match.group(2)))
            print("-> Parsed IG Posts:", parse_number_str(ig_match.group(3)))
            
    except Exception as e:
        print(f"Error for {url}: {e}")

if __name__ == '__main__':
    test_extract('https://www.instagram.com/bhargavofficial_/')
    test_extract('https://www.linkedin.com/in/bhargav-gandu-242030392')
    test_extract('https://x.com/gandubhargav004')
