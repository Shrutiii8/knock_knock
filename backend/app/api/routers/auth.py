from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import Optional
import os
import uuid
from jose import jwt, JWTError
from datetime import datetime, timedelta

from app.database import get_db
from app.schemas.db_models import UserDB

# Security configurations
SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter(prefix="/auth", tags=["Authentication"])

# Pydantic schemas for request/response
class RegisterRequest(BaseModel):
    username: str
    fullName: str
    email: str
    password: str
    mobile: str
    gender: Optional[str] = "M"
    dob: Optional[str] = "1990-01-01"
    occupation: Optional[str] = "Professional"
    address: Optional[str] = "India"
    city: Optional[str] = "Delhi"
    pincode: Optional[str] = "110001"
    state: Optional[str] = "Delhi"

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register")
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(UserDB).filter(
        (UserDB.username == req.username) | (UserDB.email == req.email)
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or Email already registered")
        
    user_id = f"usr_{uuid.uuid4().hex[:8]}"
    
    new_user = UserDB(
        id=user_id,
        username=req.username,
        email=req.email,
        password_hash=get_password_hash(req.password),
        full_name=req.fullName,
        mobile=req.mobile,
        gender=req.gender,
        dob=req.dob,
        address=req.address,
        city=req.city,
        state=req.state,
        pincode=req.pincode
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User registered successfully", "userId": user_id}

@router.post("/login", response_model=TokenResponse)
def login_user(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(
        (UserDB.username == req.username) | (UserDB.email == req.username)
    ).first()
    
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "user_id": user.id}, expires_delta=access_token_expires
    )
    
    user_dict = {
        "id": user.id,
        "username": user.username,
        "fullName": user.full_name,
        "email": user.email,
        "mobile": user.mobile,
        "gender": user.gender,
        "dob": user.dob,
        "address": user.address,
        "city": user.city,
        "state": user.state,
        "pincode": user.pincode,
        "walletBalance": user.wallet_balance
    }
    
    return {"access_token": access_token, "token_type": "bearer", "user": user_dict}

# Dependency to get current user from token
from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

@router.get("/me")
def get_me(current_user: UserDB = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "fullName": current_user.full_name,
        "email": current_user.email,
        "mobile": current_user.mobile,
        "walletBalance": current_user.wallet_balance,
        "gender": current_user.gender,
        "dob": current_user.dob,
        "address": current_user.address,
        "city": current_user.city,
        "state": current_user.state,
        "pincode": current_user.pincode
    }
