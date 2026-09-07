from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from app.schemas.db_models import StationDB, TrainDB
from app.database import get_db
from app.services.eta.orchestrator import ETAOrchestrator

eta_orchestrator = ETAOrchestrator()


router = APIRouter()

@router.get("")
def search_trains(
    from_code: str = Query("NDLS", alias="from"),
    to_code: str = Query("HWH", alias="to"),
    date: str = Query(default_factory=lambda: datetime.now().strftime("%Y-%m-%d")),
    quota: str = Query("GN"),
    classCode: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    from_code = from_code.upper()
    to_code = to_code.upper()
    
    from_station_db = db.query(StationDB).filter(StationDB.code == from_code).first()
    to_station_db = db.query(StationDB).filter(StationDB.code == to_code).first()
    
    from_station_obj = {"code": from_station_db.code, "name": from_station_db.name, "city": from_station_db.city} if from_station_db else {"code": from_code, "name": from_code, "city": from_code}
    to_station_obj = {"code": to_station_db.code, "name": to_station_db.name, "city": to_station_db.city} if to_station_db else {"code": to_code, "name": to_code, "city": to_code}
    
    all_trains = db.query(TrainDB).all()
    
    matched_trains = []
    for db_train in all_trains:
        # We need a dict to modify safely and pass to JSON response
        train = {
            "trainNumber": db_train.train_number,
            "trainName": db_train.train_name,
            "trainType": db_train.train_type,
            "sourceStation": db_train.source_station,
            "destinationStation": db_train.destination_station,
            "departureTime": db_train.departure_time,
            "arrivalTime": db_train.arrival_time,
            "duration": db_train.duration,
            "distanceKm": db_train.distance_km,
            "runsOnDays": db_train.runs_on_days,
            "classes": db_train.classes,
            "route": db_train.route
        }
        
        route = train.get("route", [])
        from_index = next((i for i, r in enumerate(route) if r.get("stationCode") == from_code), -1)
        to_index = next((i for i, r in enumerate(route) if r.get("stationCode") == to_code), -1)
        
        if from_index != -1 and to_index != -1 and from_index < to_index:
            matched_trains.append(train)
            
    if not matched_trains:
        fallback_trains = db.query(TrainDB).limit(4).all()
        for i, db_t in enumerate(fallback_trains):
            departure = "06:00" if i == 0 else "11:30" if i == 1 else "16:50" if i == 2 else "22:15"
            arrival = "14:20" if i == 0 else "20:45" if i == 1 else "08:30" if i == 2 else "11:40"
            duration = "08h 20m" if i == 0 else "09h 15m" if i == 1 else "15h 40m" if i == 2 else "13h 25m"
            
            t = {
                "trainNumber": str(12000 + i * 142 + 1),
                "trainName": f"{from_station_obj.get('city', from_code)} - {to_station_obj.get('city', to_code)} {db_t.train_type}",
                "trainType": db_t.train_type,
                "sourceStation": from_code,
                "destinationStation": to_code,
                "departureTime": departure,
                "arrivalTime": arrival,
                "duration": duration,
                "distanceKm": db_t.distance_km,
                "runsOnDays": db_t.runs_on_days,
                "classes": db_t.classes,
                "route": [
                    {"stationCode": from_code, "stationName": from_station_obj.get("name"), "arrival": "Source", "departure": departure, "haltMin": 0, "day": 1, "distanceKm": 0, "platform": "1"},
                    {"stationCode": to_code, "stationName": to_station_obj.get("name"), "arrival": arrival, "departure": "Destination", "haltMin": 0, "day": (2 if i > 1 else 1), "distanceKm": 850, "platform": "2"}
                ]
            }
            matched_trains.append(t)

    enriched_trains = []
    for train_idx, train in enumerate(matched_trains):
        enriched_classes = []
        for cls_idx, cls in enumerate(train.get("classes", [])):
            seed = (train_idx * 7 + cls_idx * 13 + len(date)) % 10
            status = "AVAILABLE"
            seats_count = None
            rac_count = None
            wl_count = None
            
            if quota in ("TQ", "PT"):
                if seed > 6:
                    status = "AVAILABLE"
                    seats_count = 12 + seed
                elif seed > 3:
                    status = "WL"
                    wl_count = seed * 3
                else:
                    status = "NOT_AVAILABLE"
            else:
                if seed > 2:
                    status = "AVAILABLE"
                    seats_count = (seed * 8) + 14
                elif seed == 2:
                    status = "RAC"
                    rac_count = seed * 6 + 4
                else:
                    status = "WL"
                    wl_count = seed * 8 + 12
                    
            cls["status"] = status
            if seats_count is not None: cls["seatsCount"] = seats_count
            if rac_count is not None: cls["racCount"] = rac_count
            if wl_count is not None: cls["wlCount"] = wl_count
            cls["confirmedProbability"] = 95 + (seed % 5) if status == "AVAILABLE" else 75 + (seed % 15) if status == "RAC" else 40 + (seed % 30)
            
            enriched_classes.append(cls)
            
        train["classes"] = enriched_classes
        
        # Build ETA context from available train data
        eta_context = {
            "route_name": "UNKNOWN",
            "train_name": train.get("trainName", "UNKNOWN"),
            "train_number": train.get("trainNumber", 0),
            "departure_time": train.get("departureTime", "00:00"),
            "days_of_departure": train.get("runsOnDays", "Daily"),
            "arrival_time": train.get("arrivalTime", "00:00"),
            "stations_stopped": ",".join([r.get("stationCode", "") for r in train.get("route", [])]),
            "historical_avg_delay_min": 15.0,
            "historical_ontime_pct": 75.0,
            "train_type": train.get("trainType", "EXPRESS"),
            "locomotive_power": "WAP4",
            "max_coach_speed_kmh": 110.0,
            "current_station": from_code,
            "upcoming_stations": to_code,
            "passed_stations": "",
            "soil_type": "Alluvial",
            "incline_gradient": "Flat",
            "geographic_hazard_delays": "None",
            "data_source": "search_api",
            "current_delay_min": 0.0,
            "is_live": False,
            "data_freshness": datetime.now().strftime("%H:%M:%S"),
            "departure_date": date
        }
        
        try:
            eta_prediction = eta_orchestrator.predict(eta_context)
            if eta_prediction:
                train["eta_prediction"] = eta_prediction.model_dump()
        except Exception as e:
            # Fallback if ETA orchestration fails unexpectedly
            print(f"Error predicting ETA for train {train.get('trainNumber')}: {e}")
            
        enriched_trains.append(train)
        
    return {
        "from": from_station_obj,
        "to": to_station_obj,
        "date": date,
        "quota": quota,
        "classCode": classCode,
        "totalTrains": len(enriched_trains),
        "trains": enriched_trains
    }
