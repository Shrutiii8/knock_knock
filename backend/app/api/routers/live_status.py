from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.schemas.models import LiveTrainStatus
from app.schemas.db_models import TrainDB
from app.database import get_db

router = APIRouter()

@router.get("/{train_number}", response_model=LiveTrainStatus)
def get_live_status(train_number: str, db: Session = Depends(get_db)):
    train = db.query(TrainDB).filter(TrainDB.train_number == train_number).first()
    if not train:
        train = db.query(TrainDB).first()
    
    stops_count = len(train.route) if train.route else 0
    current_idx = max(1, min(stops_count - 2, 1))
    delay_mins = (int(train.train_number[-1]) * 3 + 6) % 35
    
    station_stops = []
    for index, stop in enumerate(train.route):
        is_passed = index < current_idx
        is_current = index == current_idx
        stop_status = "PASSED" if is_passed else "CURRENT" if is_current else "UPCOMING"
        
        actual_arrival = "Source" if stop.get("arrival") == "Source" else f"{stop.get('arrival')} (+{delay_mins}m)" if is_passed or is_current else stop.get("arrival")
        actual_departure = "Destination" if stop.get("departure") == "Destination" else f"{stop.get('departure')} (+{delay_mins}m)" if is_passed else stop.get("departure")
        
        station_stops.append({
            "stationCode": stop.get("stationCode"),
            "stationName": stop.get("stationName"),
            "scheduledArrival": stop.get("arrival"),
            "scheduledDeparture": stop.get("departure"),
            "actualArrival": actual_arrival,
            "actualDeparture": actual_departure,
            "delayArrivalMin": delay_mins if is_passed or is_current else 0,
            "delayDepartureMin": delay_mins if is_passed else 0,
            "platform": stop.get("platform") or str((index % 4) + 1),
            "status": stop_status
        })
        
    current_station_name = station_stops[current_idx]["stationName"] if current_idx < len(station_stops) else "Unknown"
    
    status_text = f"Departed {station_stops[current_idx - 1]['stationName'] if current_idx > 0 else current_station_name} • Running {delay_mins} mins late" if delay_mins > 0 else f"Arrived on time at {current_station_name}"
    
    return {
        "trainNumber": train.train_number,
        "trainName": train.train_name,
        "lastUpdated": datetime.now().strftime("%I:%M %p"),
        "currentStation": current_station_name,
        "statusText": status_text,
        "delayMinutes": delay_mins,
        "stations": station_stops
    }
