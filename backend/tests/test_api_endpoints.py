import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_eta_predict_endpoint():
    payload = {
        "route_name": "NDLS-HWH",
        "train_name": "Howrah Rajdhani Express",
        "train_number": 12302,
        "departure_time": "16:50",
        "arrival_time": "09:55",
        "stations_stopped": "NDLS,CNB,PRYJ,DDU,GAYA,DHN,HWH",
        "historical_avg_delay_min": 15.0,
        "historical_ontime_pct": 75.0,
        "train_type": "RAJDHANI",
        "locomotive_power": "WAP-7 6000 HP",
        "max_coach_speed_kmh": 130.0,
        "current_station": "NDLS",
        "upcoming_stations": "HWH",
        "passed_stations": "",
        "soil_type": "Alluvial",
        "incline_gradient": "Flat",
        "geographic_hazard_delays": "None",
        "data_source": "api",
        "current_delay_min": 0.0,
        "is_live": False,
        "data_freshness": "12:00:00",
        "departure_date": "2026-09-10"
    }

    response = client.post("/api/eta/predict", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert "predicted_arrival" in data
    assert "delay_minutes" in data
    assert "confidence" in data
    assert len(data["components"]) > 0

    hist_component = next((c for c in data["components"] if c["model"] == "historical"), None)
    assert hist_component is not None
    assert hist_component["delay_minutes"] > 0


def test_search_endpoint_with_v2_eta():
    response = client.get("/api/search?from=NDLS&to=HWH")
    assert response.status_code == 200

    data = response.json()
    assert "trains" in data
    assert len(data["trains"]) > 0

    first_train = data["trains"][0]
    assert "eta_prediction" in first_train
    eta = first_train["eta_prediction"]
    assert "predicted_arrival" in eta
    assert "delay_minutes" in eta
    assert len(eta["components"]) > 0
    hist_comp = next((c for c in eta["components"] if c["model"] == "historical"), None)
    assert hist_comp is not None
