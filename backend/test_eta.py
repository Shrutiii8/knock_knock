import asyncio
from app.database import SessionLocal
from app.api.routers.search import search_trains

def test_search():
    db = SessionLocal()
    try:
        res = search_trains(from_code="NDLS", to_code="HWH", date="2024-10-15", quota="GN", classCode=None, db=db)
        print("Search successful, found", len(res["trains"]), "trains.")
        for t in res["trains"]:
            if "eta_prediction" in t:
                eta = t["eta_prediction"]
                print(f"Train {t['trainNumber']} ETA: {eta['predicted_arrival']} (Delay: {eta['delay_minutes']} min, Conf: {eta['confidence']})")
                print(f"Factors: {eta.get('major_delay_factors')}")
            else:
                print(f"Train {t['trainNumber']} has NO ETA PREDICTION!")
    finally:
        db.close()

if __name__ == "__main__":
    test_search()
