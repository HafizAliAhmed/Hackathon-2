
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

try:
    from pydantic import EmailStr, BaseModel
    class TestModel(BaseModel):
        email: EmailStr
    print("EmailStr check: OK")
except Exception as e:
    print(f"EmailStr check: FAILED - {e}")

try:
    from src.core.config import settings
    print(f"Config loaded. DB URL starts with: {settings.DATABASE_URL[:10]}...")
except Exception as e:
    print(f"Config check: FAILED - {e}")

try:
    from src.core.database import engine
    from sqlmodel import Session, select, text
    with Session(engine) as session:
        session.exec(text("SELECT 1"))
    print("DB Connection: OK")
except Exception as e:
    print(f"DB Connection: FAILED - {e}")
