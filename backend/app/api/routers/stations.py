from fastapi import APIRouter, Query, Depends
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.schemas.models import Station
from app.schemas.db_models import StationDB
from app.database import get_db

router = APIRouter()

@router.get("", response_model=List[Station])
def get_stations(q: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = q.strip() if q else ""
    
    if not query:
        return db.query(StationDB).limit(15).all()
        
    filtered = db.query(StationDB).filter(
        or_(
            StationDB.code.ilike(f"%{query}%"),
            StationDB.name.ilike(f"%{query}%"),
            StationDB.city.ilike(f"%{query}%")
        )
    ).limit(20).all()
    
    return filtered

