import sys
from app.database import SessionLocal
from app.schemas.db_models import UserDB
import traceback
try:
    db = SessionLocal()
    user = db.query(UserDB).first()
    print("Query success. User:", user)
except Exception as e:
    traceback.print_exc()
