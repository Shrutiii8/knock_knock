import os
import json
import joblib
import pandas as pd
from typing import Dict, Any, List

from app.services.eta.base import ETAModel
from app.schemas.eta import ETAContribution
from app.services.eta.models.weather_utils import (
    extract_weather_v2_features,
    WEATHER_V2_FEATURES
)

BASE_ML_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))),
    "ml_models", "eta", "weather"
)


class WeatherETAModel(ETAModel):
    """
    Adapter for the Weather ETA ML impact model (V2 7-Corridor Fine-Tuned default, V1 fallback).
    Predicts expected_weather_delay_minutes (incremental weather-induced delay).
    """
    name = "weather"

    def __init__(self, version: str = "v2"):
        self.version = version
        self.model = None
        self.metadata = None
        self._load_artifacts()

    def _load_artifacts(self):
        target_dir = os.path.join(BASE_ML_DIR, self.version)
        if not os.path.exists(target_dir):
            target_dir = os.path.join(BASE_ML_DIR, "v1")

        if self.version == "v2":
            model_path = os.path.join(target_dir, "weather_impact_model_finetuned_7corridors.pkl")
            meta_path = os.path.join(target_dir, "corridor_finetuned_benchmark.json")
        else:
            model_path = os.path.join(target_dir, "weather_impact_model.pkl")
            meta_path = os.path.join(target_dir, "weather_feature_schema.json")

        import warnings
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            if os.path.exists(model_path):
                self.model = joblib.load(model_path)
                self._fix_model_loss(self.model)

        if os.path.exists(meta_path):
            with open(meta_path, "r", encoding="utf-8") as f:
                self.metadata = json.load(f)

    def _fix_model_loss(self, model):
        try:
            from sklearn._loss.link import IdentityLink
            if hasattr(model, '_loss') and not hasattr(model._loss, 'link'):
                model._loss.link = IdentityLink()
        except Exception:
            pass

    def predict(self, context: Dict[str, Any]) -> ETAContribution:
        """
        Executes ML weather delay prediction for train context.
        Predicts incremental weather delay in minutes.
        Gracefully handles missing or invalid weather data without throwing errors.
        """
        try:
            if self.model is None:
                self._load_artifacts()
                if self.model is None:
                    return self._fallback_response("Weather ML model artifact not found")

            X, w_meta = extract_weather_v2_features(context)
            pred_weather_delay = max(0.0, float(self.model.predict(X)[0]))

            # Determine explainable delay factors
            factors = []
            r1 = w_meta.get("rainfall_1h", 0.0)
            vis = w_meta.get("visibility_m", 10000.0)
            wind = w_meta.get("wind_speed_kmh", 10.0)
            temp = w_meta.get("temperature_c", 25.0)
            cond = w_meta.get("weather_condition", "Clear")
            corridor = w_meta.get("corridor", "OTHER")

            if vis < 1000.0:
                factors.append(f"Visibility restricted ({vis:.0f}m) - IR Fog signal rule speed limit applied")
            elif vis < 2500.0:
                factors.append(f"Moderate haze/mist ({vis:.0f}m visibility)")

            if r1 > 25.0:
                factors.append(f"Torrential heavy rainfall ({r1:.1f} mm/h) causing speed restriction")
            elif r1 > 7.5:
                factors.append(f"Moderate rain ({r1:.1f} mm/h) along corridor")

            if wind > 70.0:
                factors.append(f"High wind gust ({wind:.0f} km/h) - Pantograph overhead line advisory")

            if w_meta.get("flood_risk", 0.0) > 0.35:
                factors.append("Low elevation riverine track waterlogging risk")

            if w_meta.get("landslide_risk", 0.0) > 0.35:
                factors.append("Ghat section landslide/slope instability warning")

            if w_meta.get("heat_risk", 0.0) > 0.35:
                factors.append(f"High track temperature ({temp:.1f}°C) expansion speed cap")

            tsr_min = w_meta.get("physics_tsr_delay_min", 0.0)
            if tsr_min > 2.0:
                factors.append(f"Physics Temporary Speed Restriction (TSR) loss: +{tsr_min:.1f} min")

            # Confidence calculation based on weather data availability & model MAE
            risk_lvl = w_meta.get("risk_level", "LOW")
            confidence = 0.92 if risk_lvl == "LOW" else (0.88 if risk_lvl == "MODERATE" else 0.82)

            mae_val = 0.08 if self.version == "v2" else 1.25

            return ETAContribution(
                model_name=self.name,
                delay_minutes=round(pred_weather_delay, 2),
                confidence=confidence,
                reason=f"Weather Impact Model ({self.version} - {corridor})",
                metadata={
                    "available": True,
                    "model_version": self.version,
                    "corridor": corridor,
                    "weather_condition": cond,
                    "risk_level": risk_lvl,
                    "overall_weather_risk": w_meta.get("overall_weather_risk", 0.0),
                    "weather_exposure_score": w_meta.get("weather_exposure_score", 0.0),
                    "delay_mae_minutes": mae_val,
                    "major_delay_factors": factors,
                    "rainfall_1h": r1,
                    "visibility_m": vis,
                    "wind_speed_kmh": wind,
                    "temperature_c": temp,
                    "physics_tsr_delay_min": tsr_min
                }
            )

        except Exception as e:
            return self._fallback_response(f"Weather prediction error: {str(e)}")

    def _fallback_response(self, reason_msg: str) -> ETAContribution:
        return ETAContribution(
            model_name=self.name,
            delay_minutes=0.0,
            confidence=0.50,
            reason=reason_msg,
            metadata={
                "available": False,
                "model_version": self.version,
                "overall_weather_risk": 0.0,
                "risk_level": "LOW",
                "major_delay_factors": []
            }
        )
