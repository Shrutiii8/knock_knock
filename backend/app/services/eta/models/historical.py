import os
import json
import joblib
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, Any, List

from app.services.eta.base import ETAModel
from app.schemas.eta import ETAContribution
from app.services.eta.models.historical_utils import (
    extract_all_excel_features,
    parse_departure_time,
    parse_arrival_and_duration,
    HistoryRepository
)

# Relative to this file: backend/app/services/eta/models/historical.py
# Models dir is: backend/ml_models/eta/historical/models/
MODELS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))),
    "ml_models", "eta", "historical", "models"
)


class HistoricalETAModel(ETAModel):
    """
    Adapter for the historical ETA prediction models.
    """
    name = "historical"

    def __init__(self):
        self.delay_model = None
        self.ontime_model = None
        self.metrics = None
        self.history_repo = HistoryRepository()
        self._load_artifacts()

    def _load_artifacts(self):
        delay_path = os.path.join(MODELS_DIR, "excel_delay_model.pkl")
        ontime_path = os.path.join(MODELS_DIR, "excel_ontime_model.pkl")
        metrics_path = os.path.join(MODELS_DIR, "excel_model_metrics.json")

        import warnings
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            if os.path.exists(delay_path):
                self.delay_model = joblib.load(delay_path)
                self._fix_model_loss(self.delay_model)
            if os.path.exists(ontime_path):
                self.ontime_model = joblib.load(ontime_path)
                self._fix_model_loss(self.ontime_model)
        if os.path.exists(metrics_path):
            with open(metrics_path, "r", encoding="utf-8") as f:
                self.metrics = json.load(f)

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
                # If still none, fail gracefully
                raise RuntimeError("Excel model is not loaded. Ensure excel_delay_model.pkl exists.")

        # Ensure defaults for required fields
        # Note: 'stations_stopped' is a comma-separated string, same for others.
        days_dep = context.get("days_of_departure", "Daily")
        if isinstance(days_dep, list):
            if len(days_dep) == 7:
                days_dep = "Daily"
            else:
                days_dep = ",".join(str(d) for d in days_dep)
                
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

        margin_90 = self.metrics.get("uncertainty_calibration", {}).get("delay_residual_p90_minutes", 21.8) if self.metrics else 21.8

        confidence_val = round(max(0.60, min(0.95, (pred_ontime / 100.0) * 0.5 + 0.45)), 2)

        drivers = []
        if curr_delay > 5:
            drivers.append(f"Current accumulated delay (+{curr_delay:.0f} min at {row['Current Geographic Location']})")

        soil = row["Soil Type (Along Route)"].lower()
        incline = row["Incline / Gradient"].lower()
        hazards = row["Specific Delays Due to Geographic Conditions"].lower()
        tt = row["Train Type"].lower()

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

        stn_prof = self.history_repo.get_station_profile(row["Current Geographic Location"], train_number=row["Train Number"])
        train_prof = self.history_repo.get_train_profile(row["Train Number"])
        
        drivers.append(f"Historical route delay pattern (average ~{row['Avg Delay (min) - Last 1 Month']:.0f} min)")
        if train_prof:
            drivers.append(f"30-day historical train on-time reliability: {train_prof.train_on_time_percentage_30d:.0f}%")

        # The delay returned by the model is the *total* delay.
        # But ETAContribution is conceptually the *additional* delay contribution for models that are stacked.
        # However, historical is the baseline, so its contribution is the total delay.
        return ETAContribution(
            model_name=self.name,
            delay_minutes=total_pred_delay,
            confidence=confidence_val,
            reason="Historical running pattern",
            metadata={
                "predicted_additional_delay": pred_additional_delay,
                "predicted_ontime_pct": pred_ontime,
                "major_delay_factors": drivers,
                "margin_minutes": margin_90,
                "is_live_data": context.get("is_live", False),
                "data_freshness": context.get("data_freshness", "")
            }
        )
