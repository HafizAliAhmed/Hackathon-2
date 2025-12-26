
import urllib.request
import json

url = "http://localhost:8000/api/auth/login"
data = {"email": "nonexistent@debug.com", "password": "debugpassword"}
headers = {"Content-Type": "application/json"}

print(f"Sending POST to {url}...")
req = urllib.request.Request(url, data=json.dumps(data).encode(), headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        print(f"Status: {response.getcode()}")
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"Status: {e.code}")
    print(e.read().decode())
except Exception as e:
    print(f"Error: {e}")
