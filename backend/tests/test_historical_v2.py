import pytest
import os
import joblib
import pandas as pd
import numpy as np

from app.services.eta.models.historical import HistoricalETAModel, BASE_ML_DIR
from app.services.eta.models.historical_utils import extract_v2_features
from app.services.eta.orchestrator import ETAOrchestrator


@pytest.fixture
def sample_context():
    return {
        "route_name": "NDLS-HWH",
        "train_name": "Howrah Rajdhani Express",
        "train_number": 12302,
        "departure_time": "16:50",
        "arrival_time": "09:55",
        "stations_stopped": "NDLS,CNB,PRYJ,DDU,GAYA,DHN,HWH",
        "distance_km": 1447.0,
        "days_of_departure": "Daily",
        "train_type": "RAJDHANI",
        "locomotive_power": "WAP-7 6000 HP",
        "max_coach_speed_kmh": 130.0,
        "soil_type": "Alluvial",
        "incline_gradient": "Flat",
        "current_delay_min": 0.0,
        "is_live": False,
        "departure_date": "2026-09-10"
    }


def test_v2_model_loading():
    model = HistoricalETAModel(version="v2")
    assert model.version == "v2"
    assert model.delay_model is not None
    assert model.ontime_model is not None
    assert model.metadata is not None
    assert model.metadata.get("model_version") == "v1.0-historical-gtfs-excel"
    assert model.metadata.get("metrics", {}).get("delay_r2_score") == 0.87


def test_v2_predict(sample_context):
    model = HistoricalETAModel(version="v2")
    contrib = model.predict(sample_context)

    assert contrib is not None
    assert contrib.model_name == "historical"
    assert contrib.delay_minutes > 0
    assert 0.0 <= contrib.confidence <= 1.0

    meta = contrib.metadata
    assert meta["model_version"] == "v2"
    assert meta["evaluation_metric"] == "R2"
    assert meta["evaluation_value"] == 0.87
    assert meta["delay_mae_minutes"] == 5.34
    assert "predicted_ontime_pct" in meta


def test_standalone_vs_backend_equivalence(sample_context):
    # Direct raw model inference
    v2_dir = os.path.join(BASE_ML_DIR, "v2")
    delay_model = joblib.load(os.path.join(v2_dir, "excel_delay_model.pkl"))
    ontime_model = joblib.load(os.path.join(v2_dir, "excel_ontime_model.pkl"))

    X = extract_v2_features(sample_context)
    raw_delay = float(delay_model.predict(X)[0])
    raw_ontime = float(ontime_model.predict(X)[0])

    # Backend adapter inference
    model = HistoricalETAModel(version="v2")
    contrib = model.predict(sample_context)

    assert pytest.approx(contrib.delay_minutes, abs=1e-4) == raw_delay
    assert pytest.approx(contrib.metadata["predicted_ontime_pct"], abs=1e-4) == raw_ontime


def test_v1_fallback(sample_context):
    model_v1 = HistoricalETAModel(version="v1")
    assert model_v1.version == "v1"
    assert model_v1.delay_model is not None

    contrib = model_v1.predict(sample_context)
    assert contrib is not None
    assert contrib.metadata["model_version"] == "v1"


def test_orchestrator_integration(sample_context):
    orchestrator = ETAOrchestrator()
    prediction = orchestrator.predict(sample_context)

    assert prediction is not None
    assert prediction.delay_minutes > 0
    assert len(prediction.components) > 0

    hist_component = next((c for c in prediction.components if c.model == "historical"), None)
    assert hist_component is not None
    assert hist_component.delay_minutes > 0
