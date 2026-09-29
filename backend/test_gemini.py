import urllib.request
import urllib.error
import json
import os

api_key = os.getenv('GEMINI_API_KEY', '')
url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={api_key}'
payload = {"contents": [{"parts": [{"text": "hi"}]}]}

req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='POST')
try:
    print(urllib.request.urlopen(req).read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("ERROR:", e.read().decode('utf-8'))
