
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from core.database import engine
from sqlmodel import Session, text

try:
    with Session(engine) as session:
        # Postgres specific query to list columns
        result = session.exec(text(
            "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'"
        )).all()
        
        print("Columns in 'users' table:")
        for row in result:
            print(f"- {row[0]} ({row[1]})")
            
except Exception as e:
    print(f"Schema check FAILED: {e}")
