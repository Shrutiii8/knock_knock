from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.schemas.models import PNRRecord
from app.schemas.db_models import PNRRecordDB, TrainDB
from app.database import get_db

router = APIRouter()

@router.get("/{pnr_number}", response_model=PNRRecord)
def get_pnr(pnr_number: str, db: Session = Depends(get_db)):
    if not pnr_number or len(pnr_number) != 10:
        raise HTTPException(status_code=400, detail="Invalid PNR number. PNR must be exactly 10 digits.")
        
    existing = db.query(PNRRecordDB).filter(PNRRecordDB.pnr_number == pnr_number).first()
    if existing:
        return existing
        
    trains = db.query(TrainDB).all()
    if not trains:
        raise HTTPException(status_code=404, detail="No trains available to generate PNR")
        
    train = trains[int(pnr_number[-1]) % len(trains)]
    is_confirmed = int(pnr_number[-2]) % 2 == 0
    
    journey_date = (datetime.now() + timedelta(days=4)).strftime("%Y-%m-%d")
    
    return {
        "pnrNumber": pnr_number,
        "trainNumber": train.train_number,
        "trainName": train.train_name,
        "journeyDate": journey_date,
        "fromStation": train.source_station,
        "fromStationName": train.route[0].get("stationName", train.source_station) if train.route else train.source_station,
        "toStation": train.destination_station,
        "toStationName": train.route[-1].get("stationName", train.destination_station) if train.route else train.destination_station,
        "boardingStation": train.source_station,
        "journeyClass": "3A",
        "quota": "GN",
        "chartStatus": "CHART_PREPARED" if is_confirmed else "CHART_NOT_PREPARED",
        "passengers": [
            {
                "passengerNo": 1,
                "bookingStatus": "RAC 4" if is_confirmed else "WL 24",
                "currentStatus": "CNF" if is_confirmed else "WL 8",
                "coach": "B3" if is_confirmed else None,
                "berth": 38 if is_confirmed else None,
                "berthType": "UB" if is_confirmed else None
            },
            {
                "passengerNo": 2,
                "bookingStatus": "RAC 5" if is_confirmed else "WL 25",
                "currentStatus": "CNF" if is_confirmed else "WL 9",
                "coach": "B3" if is_confirmed else None,
                "berth": 39 if is_confirmed else None,
                "berthType": "SL" if is_confirmed else None
            }
        ]
    }
