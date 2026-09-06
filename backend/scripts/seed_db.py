import os
import sys
import json

# Add the parent directory to sys.path so we can import 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, Base, SessionLocal
from app.schemas.db_models import StationDB, TrainDB, PNRRecordDB

def load_json_file(filename: str):
    filepath = os.path.join(os.path.dirname(os.path.dirname(__file__)), "app", "data", filename)
    with open(filepath, "r") as f:
        return json.load(f)

def seed_database():
    print("Creating tables in database...")
    Base.metadata.drop_all(bind=engine) # Clear existing tables for fresh seed
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        print("Loading data from JSON files...")
        stations_data = load_json_file("stations.json")
        trains_data = load_json_file("trains.json")
        pnr_data = load_json_file("pnrData.json")
        
        print("Inserting Stations...")
        for s in stations_data:
            station = StationDB(
                code=s.get("code"),
                name=s.get("name"),
                city=s.get("city"),
                state=s.get("state")
            )
            db.add(station)
            
        print("Inserting Trains...")
        for t in trains_data:
            train = TrainDB(
                train_number=t.get("trainNumber"),
                train_name=t.get("trainName"),
                train_type=t.get("trainType"),
                source_station=t.get("sourceStation"),
                destination_station=t.get("destinationStation"),
                departure_time=t.get("departureTime"),
                arrival_time=t.get("arrivalTime"),
                duration=t.get("duration"),
                distance_km=t.get("distanceKm"),
                runs_on_days=t.get("runsOnDays", []),
                classes=t.get("classes", []),
                route=t.get("route", [])
            )
            db.add(train)
            
        print("Inserting PNR Records...")
        for p in pnr_data:
            pnr = PNRRecordDB(
                pnr_number=p.get("pnrNumber"),
                train_number=p.get("trainNumber"),
                train_name=p.get("trainName"),
                journey_date=p.get("journeyDate"),
                from_station=p.get("fromStation"),
                from_station_name=p.get("fromStationName"),
                to_station=p.get("toStation"),
                to_station_name=p.get("toStationName"),
                boarding_station=p.get("boardingStation"),
                journey_class=p.get("journeyClass"),
                quota=p.get("quota"),
                chart_status=p.get("chartStatus"),
                passengers=p.get("passengers", [])
            )
            db.add(pnr)
            
        db.commit()
        print("Successfully seeded all data to the database!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
