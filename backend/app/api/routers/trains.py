from fastapi import APIRouter, Query, HTTPException, Depends
from typing import List, Optional, Union
from sqlalchemy.orm import Session
from app.schemas.models import Train
from app.schemas.db_models import TrainDB
from app.database import get_db

router = APIRouter()

@router.get("", response_model=Union[Train, List[Train]])
def get_trains(number: Optional[str] = Query(None), db: Session = Depends(get_db)):
    if number:
        train = db.query(TrainDB).filter(TrainDB.train_number == number).first()
        if not train:
            raise HTTPException(status_code=404, detail="Train not found")
        return train
    
    return db.query(TrainDB).all()
