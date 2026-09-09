import os
import json
import joblib
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, Any, List

from app.services.eta.base import ETAModel
from app.schemas.eta import ETAContribution
from app.services.eta.models.historical_utils import (
    extract_v2_features,
    extract_all_excel_features,
    parse_departure_time,
    parse_arrival_and_duration,
    HistoryRepository
)

BASE_ML_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))),
    "ml_models", "eta", "historical"
)


class HistoricalETAModel(ETAModel):
    """
    Adapter for the historical ETA prediction models (V2 Kaggle-trained default, V1 fallback).
    """
    name = "historical"

    def __init__(self, version: str = "v2"):
        self.version = version
        self.delay_model = None
        self.ontime_model = None
        self.metadata = None
        self.history_repo = HistoryRepository()
        self._load_artifacts()

    def _load_artifacts(self):
        target_dir = os.path.join(BASE_ML_DIR, self.version)
        if not os.path.exists(target_dir):
            # Fallback to legacy models dir if specific version dir not found
            target_dir = os.path.join(BASE_ML_DIR, "models")

        delay_path = os.path.join(target_dir, "excel_delay_model.pkl")
        ontime_path = os.path.join(target_dir, "excel_ontime_model.pkl")
        
        meta_path = os.path.join(target_dir, "historical_model_metadata.json")
        if not os.path.exists(meta_path):
            meta_path = os.path.join(target_dir, "excel_model_metrics.json")

        import warnings
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            if os.path.exists(delay_path):
                self.delay_model = joblib.load(delay_path)
                self._fix_model_loss(self.delay_model)
            if os.path.exists(ontime_path):
                self.ontime_model = joblib.load(ontime_path)
                self._fix_model_loss(self.ontime_model)

        if os.path.exists(meta_path):
            with open(meta_path, "r", encoding="utf-8") as f:
                self.metadata = json.load(f)

    def _fix_model_loss(self, model):
        try:
            from sklearn._loss.link import IdentityLink
            if hasattr(model, 'model_gb') and hasattr(model.model_gb, '_loss'):
                if not hasattr(model.model_gb._loss, 'link'):
                    model.model_gb._loss.link = IdentityLink()
        except Exception:
            pass

    def predict(self, context: Dict[str, Any]) -> ETAContribution:
        """
        Executes ML delay prediction for an identified train and its state.
        Expects context to contain necessary train and live status details.
        """
        if self.delay_model is None or self.ontime_model is None:
            self._load_artifacts()
            if self.delay_model is None:
                raise RuntimeError(f"Historical ETA model {self.version} is not loaded.")

        days_dep = context.get("days_of_departure", "Daily")
        if isinstance(days_dep, list):
            if len(days_dep) == 7:
                days_dep = "Daily"
            else:
                days_dep = ",".join(str(d) for d in days_dep)

        if self.version == "v2":
            X = extract_v2_features(context)
            base_ml_delay = float(self.delay_model.predict(X)[0])
            pred_ontime = float(self.ontime_model.predict(X)[0])
        else:
            row = {
                "Route": context.get("route_name", "UNKNOWN"),
                "Train Name": context.get("train_name", "UNKNOWN"),
                "Train Number": int(context.get("train_number", 0)),
                "Train Departure Time": context.get("departure_time", "00:00"),
                "Days of Departure": str(days_dep),
                "Train Arrival Time": context.get("arrival_time", "00:00"),
                "Stations at Which It Stops": context.get("stations_stopped", "A,B"),
                "Avg Delay (min) - Last 1 Month": float(context.get("historical_avg_delay_min", 0.0)),
                "On-Time Performance % - Last 1 Month": float(context.get("historical_ontime_pct", 75.0)),
                "Train Type": context.get("train_type", "EXPRESS"),
                "Locomotive Power": context.get("locomotive_power", "WAP4"),
                "Max Speed of Coaches (km/h)": float(context.get("max_coach_speed_kmh", 110.0)),
                "Current Geographic Location": context.get("current_station", "UNKNOWN"),
                "Upcoming Geographic Locations": context.get("upcoming_stations", "UNKNOWN"),
                "Passed Geographic Locations": context.get("passed_stations", "UNKNOWN"),
                "Soil Type (Along Route)": context.get("soil_type", "Alluvial"),
                "Incline / Gradient": context.get("incline_gradient", "Flat"),
                "Specific Delays Due to Geographic Conditions": context.get("geographic_hazard_delays", "None"),
                "Data Source": context.get("data_source", "search_api")
            }
            row_df = pd.DataFrame([row])
            X = extract_all_excel_features(row_df)
            base_ml_delay = float(self.delay_model.predict(X)[0])
            pred_ontime = float(self.ontime_model.predict(X)[0])

        pred_ontime = max(5.0, min(99.0, pred_ontime))

        curr_delay = float(context.get("current_delay_min", 0.0))
        if curr_delay > 0:
            total_pred_delay = max(curr_delay, 0.35 * base_ml_delay + 0.65 * curr_delay + (base_ml_delay * 0.15))
            pred_additional_delay = max(0.0, total_pred_delay - curr_delay)
        else:
            total_pred_delay = base_ml_delay
            pred_additional_delay = base_ml_delay

        metrics = self.metadata.get("metrics", {}) if self.metadata else {}
        margin_90 = float(metrics.get("delay_p90_minutes", metrics.get("uncertainty_calibration", {}).get("delay_residual_p90_minutes", 10.19)))

        confidence_val = round(max(0.60, min(0.95, (pred_ontime / 100.0) * 0.5 + 0.45)), 2)

        drivers = []
        curr_station = context.get("current_station", "UNKNOWN")
        if curr_delay > 5:
            drivers.append(f"Current accumulated delay (+{curr_delay:.0f} min at {curr_station})")

        soil = str(context.get("soil_type", "Alluvial")).lower()
        incline = str(context.get("incline_gradient", "Flat")).lower()
        hazards = str(context.get("geographic_hazard_delays", "None")).lower()
        tt = str(context.get("train_type", "EXPRESS")).lower()

        if "black cotton" in soil:
            drivers.append("Black cotton subgrade soil prone to track shifting")
        if "ghat" in incline or "1-1.5" in incline:
            drivers.append("Ghat incline section requiring banker locomotives")
        if "fog" in hazards:
            drivers.append("Gangetic plains winter fog requiring speed ceiling")
        if "flood" in hazards or "waterlog" in hazards:
            drivers.append("Monsoon riverine flood/waterlogging risk")
        if "heat" in hazards:
            drivers.append("Summer track expansion speed restrictions")
        if "congestion" in hazards or "freight" in hazards or "coal" in hazards:
            drivers.append("High-density freight/coal corridor")
        if "passenger" in tt:
            drivers.append("Lower operational priority subject to overtaking")

        train_num = int(context.get("train_number", 0))
        train_prof = self.history_repo.get_train_profile(train_num)
        hist_avg = float(context.get("historical_avg_delay_min", 15.0))
        drivers.append(f"Historical route delay pattern (average ~{hist_avg:.0f} min)")
        if train_prof:
            drivers.append(f"30-day historical train on-time reliability: {train_prof.train_on_time_percentage_30d:.0f}%")

        eval_metric = "R2"
        eval_value = float(metrics.get("delay_r2_score", 0.87 if self.version == "v2" else 0.84))
        mae_val = float(metrics.get("delay_mae_minutes", 5.34 if self.version == "v2" else 4.12))

        return ETAContribution(
            model_name=self.name,
            delay_minutes=total_pred_delay,
            confidence=confidence_val,
            reason=f"Historical running pattern ({self.version})",
            metadata={
                "model_version": self.version,
                "evaluation_metric": eval_metric,
                "evaluation_value": eval_value,
                "delay_mae_minutes": mae_val,
                "predicted_additional_delay": pred_additional_delay,
                "predicted_ontime_pct": pred_ontime,
                "major_delay_factors": drivers,
                "margin_minutes": margin_90,
                "is_live_data": context.get("is_live", False),
                "data_freshness": context.get("data_freshness", "")
            }
        )
