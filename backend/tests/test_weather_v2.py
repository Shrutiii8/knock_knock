import pytest
import pandas as pd
from app.services.eta.models.weather_utils import (
    WeatherRiskEngine,
    extract_weather_v2_features,
    detect_corridor,
    WEATHER_V2_FEATURES
)
from app.services.eta.models.weather import WeatherETAModel
from app.services.eta.orchestrator import ETAOrchestrator


def test_weather_risk_engine():
    # Clear weather
    r_clear = WeatherRiskEngine.compute_rain_risk(0.0, 0.0)
    assert r_clear == 0.0

    # Heavy rain
    r_heavy = WeatherRiskEngine.compute_rain_risk(30.0, 60.0)
    assert r_heavy > 0.70

    # Fog & visibility
    fog_r, vis_r = WeatherRiskEngine.compute_visibility_and_fog_risk(250.0, "Dense Fog")
    assert vis_r >= 0.85
    assert fog_r >= 0.85

    # Overall synthesis
    w_dict = {
        "rainfall_1h": 35.0,
        "rainfall_24h": 80.0,
        "visibility": 400.0,
        "wind_speed": 45.0,
        "weather_condition": "Heavy Rain and Fog",
        "temperature": 28.0
    }
    risks = WeatherRiskEngine.evaluate_all_risks(w_dict)
    assert risks["overall_weather_risk"] > 0.60
    assert risks["risk_level"] in ["HIGH", "SEVERE"]


def test_corridor_detection():
    ctx_hwh = {"route_name": "NDLS-HWH", "train_name": "Howrah Rajdhani", "current_station": "NDLS"}
    assert detect_corridor(ctx_hwh) == "DELHI_HOWRAH"

    ctx_mas = {"route_name": "MAS-HWH", "train_name": "Coromandel Express"}
    assert detect_corridor(ctx_mas) == "CHENNAI_HOWRAH"


def test_extract_weather_v2_features():
    ctx = {
        "route_name": "NDLS-HWH",
        "train_name": "Howrah Rajdhani",
        "distance_km": 1447.0,
        "current_station": "NDLS",
        "weather": {
            "rainfall_1h": 12.0,
            "rainfall_24h": 40.0,
            "visibility_m": 800.0,
            "wind_speed_kmh": 22.0,
            "temperature_c": 31.0,
            "humidity_pct": 82.0,
            "pressure_hpa": 1008.0,
            "cloud_cover_pct": 75.0,
            "weather_condition": "Moderate Rain & Fog"
        }
    }

    df, meta = extract_weather_v2_features(ctx)
    assert isinstance(df, pd.DataFrame)
    assert len(df.columns) == 28
    assert list(df.columns) == WEATHER_V2_FEATURES
    assert not df.isna().any().any()
    assert meta["corridor"] == "DELHI_HOWRAH"
    assert meta["risk_level"] in ["MODERATE", "HIGH"]


def test_weather_eta_model_clear_weather():
    model = WeatherETAModel(version="v2")
    assert model.model is not None

    clear_ctx = {
        "route_name": "NDLS-HWH",
        "train_name": "Rajdhani Express",
        "distance_km": 1447.0,
        "current_station": "NDLS",
        "weather": {
            "rainfall_1h": 0.0,
            "rainfall_24h": 0.0,
            "visibility_m": 10000.0,
            "wind_speed_kmh": 10.0,
            "temperature_c": 25.0,
            "weather_condition": "Clear"
        }
    }

    contrib = model.predict(clear_ctx)
    assert contrib.model_name == "weather"
    assert contrib.delay_minutes < 2.0  # Clear weather should predict minimal/zero weather delay
    assert contrib.confidence >= 0.85
    assert contrib.metadata["available"] is True


def test_weather_eta_model_adverse_weather():
    model = WeatherETAModel(version="v2")

    fog_ctx = {
        "route_name": "NDLS-HWH",
        "train_name": "Rajdhani Express",
        "distance_km": 1447.0,
        "current_station": "NDLS",
        "weather": {
            "rainfall_1h": 28.0,
            "rainfall_24h": 90.0,
            "visibility_m": 200.0,
            "wind_speed_kmh": 35.0,
            "temperature_c": 28.0,
            "weather_condition": "Dense Fog & Torrential Rain"
        }
    }

    contrib = model.predict(fog_ctx)
    assert contrib.model_name == "weather"
    assert contrib.delay_minutes > 5.0  # Adverse weather predicts significant weather delay
    assert len(contrib.metadata["major_delay_factors"]) > 0


def test_orchestrator_multi_factor_aggregation():
    orchestrator = ETAOrchestrator()
    assert len(orchestrator.models) == 2

    model_names = [m.name for m in orchestrator.models]
    assert "historical" in model_names
    assert "weather" in model_names

    test_ctx = {
        "route_name": "NDLS-HWH",
        "train_name": "Howrah Rajdhani Express",
        "train_number": 12302,
        "departure_time": "16:50",
        "arrival_time": "09:55",
        "days_of_departure": "Daily",
        "distance_km": 1447.0,
        "train_type": "RAJDHANI",
        "current_station": "NDLS",
        "current_delay_min": 10.0,
        "weather": {
            "rainfall_1h": 15.0,
            "rainfall_24h": 50.0,
            "visibility_m": 500.0,
            "weather_condition": "Fog and Rain"
        }
    }

    pred = orchestrator.predict(test_ctx)
    assert pred is not None
    assert len(pred.components) == 2
    assert any(c.model == "historical" for c in pred.components)
    assert any(c.model == "weather" for c in pred.components)

    hist_comp = next(c for c in pred.components if c.model == "historical")
    weat_comp = next(c for c in pred.components if c.model == "weather")

    # Aggregated delay must equal historical baseline + weather incremental delay
    assert round(pred.delay_minutes, 1) == round(hist_comp.delay_minutes + weat_comp.delay_minutes, 1)
