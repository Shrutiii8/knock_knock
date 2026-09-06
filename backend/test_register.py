from app.database import SessionLocal
from app.schemas.db_models import UserDB
import traceback
import uuid

def test_register():
    try:
        db = SessionLocal()
        user_id = f"usr_{uuid.uuid4().hex[:8]}"
        
        new_user = UserDB(
            id=user_id,
            username="testusr_2",
            email="test2@example.com",
            password_hash="fakehash",
            full_name="Test User",
            mobile="1234567890",
            gender="M",
            dob="1990-01-01",
            address="India",
            city="Delhi",
            state="Delhi",
            pincode="110001"
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print("User registered:", new_user.id)
    except Exception as e:
        traceback.print_exc()

if __name__ == "__main__":
    test_register()
