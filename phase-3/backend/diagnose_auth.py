
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

try:
    print("Testing Bcrypt...")
    import bcrypt
    from src.core.security import hash_password, verify_password
    pw = "testpass"
    hashed = hash_password(pw)
    assert verify_password(pw, hashed)
    print("Bcrypt check: OK")
except Exception as e:
    print(f"Bcrypt check: FAILED - {e}")

try:
    print("Testing JWT...")
    from src.core.security import create_access_token, decode_access_token
    from src.core.config import settings
    # Ensure SECRET is valid string
    if not settings.JWT_SECRET:
        raise ValueError("JWT_SECRET is empty")
    token = create_access_token({"sub": "testuser"})
    payload = decode_access_token(token)
    assert payload["sub"] == "testuser"
    print("JWT check: OK")
except Exception as e:
    print(f"JWT check: FAILED - {e}")

try:
    print("Testing User Model...")
    from src.models.user import User
    u = User(email="test@example.com", hashed_password="hashed")
    print("User Model check: OK")
except Exception as e:
    print(f"User Model check: FAILED - {e}")
