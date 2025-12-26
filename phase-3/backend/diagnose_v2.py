
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

try:
    print("Testing User Model...")
    from models.user import User
    u = User(email="test@example.com", hashed_password="hashed")
    print("User Model check: OK")
except Exception as e:
    print(f"User Model check: FAILED - {e}")
    # Print traceback if needed
    import traceback
    traceback.print_exc()

try:
    print("Testing Table Existence...")
    from core.database import engine
    from sqlmodel import Session, text
    with Session(engine) as session:
        # Check if users table exists
        try:
            session.exec(text("SELECT count(*) FROM users"))
            print("Table 'users': EXISTS")
        except Exception as e:
            print(f"Table 'users': MISSING or Error - {e}")
            
except Exception as e:
    print(f"DB check: FAILED - {e}")
