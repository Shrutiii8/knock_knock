"""
TRETA - Excel Train Route Feature Engineering Pipeline
Extracts structured operational, locomotive, topological, geotechnical, and hazard features
from train_route_dataset.xlsx for machine learning delay and ETA models.
"""

import re
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Any, Optional


def parse_departure_time(time_str: Any) -> Tuple[int, int, int]:
    """Parses 'HH:MM' (24-hour) string into (hour, minute, total_minutes_from_midnight)."""
    if pd.isna(time_str):
        return 12, 0, 720
    m = re.match(r"^(\d{1,2}):(\d{2})$", str(time_str).strip())
    if m:
        h, mn = int(m.group(1)), int(m.group(2))
        return h, mn, h * 60 + mn
    return 12, 0, 720


def parse_arrival_and_duration(dep_str: Any, arr_str: Any) -> Tuple[int, int, int, int]:
    """
    Parses departure and arrival time with multi-day offset (e.g. '18:10 (Day 2)').
    Returns (arrival_hour, arrival_minute, arrival_day, scheduled_duration_minutes).
    """
    dep_h, dep_mn, dep_total_min = parse_departure_time(dep_str)
    
    if pd.isna(arr_str):
        return dep_h, dep_mn, 1, 180
        
    m = re.match(r"^(\d{1,2}):(\d{2})(?:\s*\(Day\s*(\d+)\))?$", str(arr_str).strip())
    if m:
        arr_h = int(m.group(1))
        arr_mn = int(m.group(2))
        day = int(m.group(3)) if m.group(3) else 1
    else:
        arr_h, arr_mn, day = dep_h, dep_mn, 1
        
    total_arr_min = (day - 1) * 1440 + arr_h * 60 + arr_mn
    if day == 1 and total_arr_min < dep_total_min:
        total_arr_min += 1440
        day = 2
        
    duration_min = max(30, total_arr_min - dep_total_min)
    return arr_h, arr_mn, day, duration_min


def parse_operating_days(days_str: Any) -> Tuple[int, int, int]:
    """
    Parses 'Days of Departure' into (days_per_week_frequency, is_daily_service, operates_on_weekend).
    """
    if pd.isna(days_str):
        return 7, 1, 1
    s = str(days_str).lower().strip()
    if "daily except" in s:
        return 6, 0, 1
    elif "daily" in s:
        return 7, 1, 1
    elif "weekly" in s:
        is_wknd = 1 if ("sun" in s or "sat" in s) else 0
        return 1, 0, is_wknd
    else:
        days = [d.strip() for d in s.split(",") if d.strip()]
        is_wknd = 1 if any("sat" in d or "sun" in d for d in days) else 0
        return max(1, len(days)), 0, is_wknd


def count_station_list(stn_str: Any) -> int:
    """Counts non-empty station items in a comma-separated string."""
    if pd.isna(stn_str):
        return 0
    return len([s.strip() for s in str(stn_str).split(",") if s.strip()])


def parse_train_type_priority(tt_str: Any) -> Tuple[int, int, int, int, float]:
    """
    Parses train type into (priority_rank, is_premium, is_ac, is_passenger, priority_weight).
    Ranks: 1=Vande Bharat, 2=Rajdhani/Shatabdi/Duronto, 3=Superfast/Garib Rath/Jan Shatabdi, 4=Mail/Express, 5=Passenger.
    """
    if pd.isna(tt_str):
        return 4, 0, 0, 0, 0.50
    s = str(tt_str).lower()
    if "vande bharat" in s:
        return 1, 1, 1, 0, 1.00
    elif "rajdhani" in s or "shatabdi" in s:
        return 2, 1, 1, 0, 0.85
    elif "duronto" in s:
        return 2, 1, 0, 0, 0.85
    elif "garib rath" in s:
        return 3, 0, 1, 0, 0.70
    elif "jan shatabdi" in s or "superfast" in s:
        return 3, 0, 0, 0, 0.65
    elif "passenger" in s:
        return 5, 0, 0, 1, 0.25
    else:
        return 4, 0, 0, 0, 0.50


def parse_locomotive_power(loco_str: Any) -> Tuple[int, int, int, int]:
    """
    Parses locomotive into (approx_horsepower, is_emu, is_electric, is_diesel_partial).
    """
    if pd.isna(loco_str):
        return 5000, 0, 1, 0
    s = str(loco_str).lower()
    if "multiple unit" in s or "emu" in s:
        return 12000, 1, 1, 0
    is_diesel = 1 if ("diesel" in s or "wdp" in s) else 0
    is_elec = 1 if ("electric" in s or "wap" in s or "wag" in s) else 0
    hp = 5000
    if "wap-7" in s:
        hp = 6000
    elif "wap-5" in s:
        hp = 5450
    elif "wap-4" in s:
        hp = 5000
    elif "wdp-4" in s:
        hp = 4500
    elif "wag-7" in s:
        hp = 5000
    elif "wag-9" in s:
        hp = 6120
    return hp, 0, is_elec, is_diesel


def parse_soil_types(soil_str: Any) -> Tuple[int, int, int, int, int, int]:
    """
    Extracts binary geotechnical indicators:
    (black_cotton, alluvial, laterite_red, deltaic_marshy, arid_desert, coastal).
    """
    if pd.isna(soil_str):
        return 0, 1, 0, 0, 0, 0
    s = str(soil_str).lower()
    return (
        1 if ("black cotton" in s or "basaltic" in s) else 0,
        1 if ("alluvial" in s or "alluvium" in s) else 0,
        1 if ("laterite" in s or "lateritic" in s or "red" in s) else 0,
        1 if ("deltaic" in s or "marshy" in s or "riverine" in s) else 0,
        1 if ("arid" in s or "sandy" in s or "desert" in s) else 0,
        1 if "coastal" in s else 0
    )


def parse_incline_gradient(inc_str: Any) -> Tuple[int, int]:
    """
    Extracts (gradient_severity_0_to_3, has_ghat_section).
    0 = Flat, 1 = Gentle/Plateau, 2 = Moderate/Rising, 3 = Ghat/Shivalik/1-1.5%.
    """
    if pd.isna(inc_str):
        return 0, 0
    s = str(inc_str).lower()
    has_ghat = 1 if "ghat" in s else 0
    if "ghat" in s or "1-1.5" in s or "1%" in s or "shivalik" in s:
        severity = 3
    elif "moderate" in s or "0.5" in s or "rising" in s:
        severity = 2
    elif "gentle" in s or "undulat" in s or "plateau" in s or "aravalli" in s:
        severity = 1
    else:
        severity = 0
    return severity, has_ghat


def parse_specific_hazards(haz_str: Any) -> Dict[str, int]:
    """
    Extracts individual and total hazard flags from 'Specific Delays Due to Geographic Conditions'.
    """
    if pd.isna(haz_str):
        return {
            "hazard_fog": 0, "hazard_monsoon_flood": 0, "hazard_landslide": 0,
            "hazard_heat_restriction": 0, "hazard_sandstorm": 0,
            "hazard_freight_coal_congestion": 0, "hazard_cyclone_wind": 0,
            "hazard_ghat_braking": 0, "total_hazard_count": 0
        }
    s = str(haz_str).lower()
    fog = 1 if "fog" in s else 0
    flood = 1 if ("flood" in s or "waterlog" in s or "monsoon" in s) else 0
    landslide = 1 if ("landslip" in s or "landslide" in s or "rockfall" in s) else 0
    heat = 1 if ("heat" in s or "expansion" in s or "drought" in s) else 0
    sandstorm = 1 if ("sandstorm" in s or "arid" in s) else 0
    congestion = 1 if ("congestion" in s or "freight" in s or "coal" in s) else 0
    cyclone = 1 if ("cyclone" in s or "coastal" in s or "wind" in s) else 0
    ghat_brake = 1 if ("ghat" in s or "braking" in s) else 0
    total = fog + flood + landslide + heat + sandstorm + congestion + cyclone + ghat_brake
    return {
        "hazard_fog": fog,
        "hazard_monsoon_flood": flood,
        "hazard_landslide": landslide,
        "hazard_heat_restriction": heat,
        "hazard_sandstorm": sandstorm,
        "hazard_freight_coal_congestion": congestion,
        "hazard_cyclone_wind": cyclone,
        "hazard_ghat_braking": ghat_brake,
        "total_hazard_count": total
    }


def extract_all_excel_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Transforms the raw DataFrame loaded from train_route_dataset.xlsx
    into a numerical, engineered feature matrix ready for machine learning models.
    """
    feats = pd.DataFrame(index=df.index)
    
    # 1. Timetable Features
    dep_parsed = [parse_departure_time(x) for x in df["Train Departure Time"]]
    feats["dep_hour"] = [p[0] for p in dep_parsed]
    feats["dep_minute"] = [p[1] for p in dep_parsed]
    feats["dep_time_min"] = [p[2] for p in dep_parsed]
    feats["hour_sin"] = np.sin(2 * np.pi * feats["dep_hour"] / 24.0)
    feats["hour_cos"] = np.cos(2 * np.pi * feats["dep_hour"] / 24.0)
    
    feats["is_morning_dep"] = ((feats["dep_hour"] >= 6) & (feats["dep_hour"] <= 11)).astype(int)
    feats["is_afternoon_dep"] = ((feats["dep_hour"] >= 12) & (feats["dep_hour"] <= 16)).astype(int)
    feats["is_evening_dep"] = ((feats["dep_hour"] >= 17) & (feats["dep_hour"] <= 21)).astype(int)
    feats["is_night_dep"] = ((feats["dep_hour"] >= 22) | (feats["dep_hour"] <= 5)).astype(int)
    
    # Duration Calculation
    dur_parsed = [parse_arrival_and_duration(dep, arr) for dep, arr in zip(df["Train Departure Time"], df["Train Arrival Time"])]
    feats["arr_hour"] = [p[0] for p in dur_parsed]
    feats["arr_minute"] = [p[1] for p in dur_parsed]
    feats["arrival_day_offset"] = [p[2] for p in dur_parsed]
    feats["scheduled_duration_min"] = [p[3] for p in dur_parsed]
    feats["scheduled_duration_hours"] = feats["scheduled_duration_min"] / 60.0
    
    # 2. Operating Days & Frequency
    days_parsed = [parse_operating_days(x) for x in df["Days of Departure"]]
    feats["days_frequency"] = [p[0] for p in days_parsed]
    feats["is_daily"] = [p[1] for p in days_parsed]
    feats["operates_on_weekend"] = [p[2] for p in days_parsed]
    
    # 3. Station Stop Analytics & Route Progress
    feats["total_stops"] = df["Stations at Which It Stops"].apply(count_station_list)
    feats["passed_stops"] = df["Passed Geographic Locations"].apply(count_station_list)
    feats["upcoming_stops"] = df["Upcoming Geographic Locations"].apply(count_station_list)
    feats["completion_ratio"] = (feats["passed_stops"] / feats["total_stops"].clip(lower=1)).clip(0.0, 1.0)
    feats["remaining_stops_ratio"] = (feats["upcoming_stops"] / feats["total_stops"].clip(lower=1)).clip(0.0, 1.0)
    feats["avg_stop_interval_min"] = feats["scheduled_duration_min"] / feats["total_stops"].clip(lower=1)
    feats["stops_per_hour"] = feats["total_stops"] / feats["scheduled_duration_hours"].clip(lower=0.5)
    
    # 4. Train Type & Operational Priority
    tt_parsed = [parse_train_type_priority(x) for x in df["Train Type"]]
    feats["train_priority_score"] = [p[0] for p in tt_parsed]
    feats["is_premium_train"] = [p[1] for p in tt_parsed]
    feats["is_ac_train"] = [p[2] for p in tt_parsed]
    feats["is_passenger_train"] = [p[3] for p in tt_parsed]
    feats["train_priority_weight"] = [p[4] for p in tt_parsed]
    
    # 5. Locomotive Traction & Speed Ratings
    feats["max_coach_speed_kmh"] = df["Max Speed of Coaches (km/h)"].astype(float)
    loco_parsed = [parse_locomotive_power(x) for x in df["Locomotive Power"]]
    feats["locomotive_hp"] = [p[0] for p in loco_parsed]
    feats["is_emu"] = [p[1] for p in loco_parsed]
    feats["is_electric"] = [p[2] for p in loco_parsed]
    feats["is_diesel_partial"] = [p[3] for p in loco_parsed]
    feats["power_to_speed_ratio"] = feats["locomotive_hp"] / feats["max_coach_speed_kmh"].clip(lower=50.0)
    
    # 6. Geotechnical & Soil Features
    soil_parsed = [parse_soil_types(x) for x in df["Soil Type (Along Route)"]]
    feats["soil_black_cotton"] = [p[0] for p in soil_parsed]
    feats["soil_alluvial"] = [p[1] for p in soil_parsed]
    feats["soil_laterite_red"] = [p[2] for p in soil_parsed]
    feats["soil_deltaic_marshy"] = [p[3] for p in soil_parsed]
    feats["soil_arid_desert"] = [p[4] for p in soil_parsed]
    feats["soil_coastal"] = [p[5] for p in soil_parsed]
    
    # 7. Incline & Gradient Features
    inc_parsed = [parse_incline_gradient(x) for x in df["Incline / Gradient"]]
    feats["gradient_severity"] = [p[0] for p in inc_parsed]
    feats["has_ghat_section"] = [p[1] for p in inc_parsed]
    
    # 8. Environmental Hazard Features
    haz_dicts = [parse_specific_hazards(x) for x in df["Specific Delays Due to Geographic Conditions"]]
    for k in haz_dicts[0].keys():
        feats[k] = [d[k] for d in haz_dicts]
        
    # 9. Cross-Feature Domain Interactions
    feats["hazard_terrain_interaction"] = (feats["gradient_severity"] + 1) * feats["total_hazard_count"]
    feats["speed_hazard_stress"] = (feats["max_coach_speed_kmh"] * feats["total_hazard_count"]) / 100.0
    feats["black_cotton_hazard_stress"] = feats["soil_black_cotton"] * (feats["hazard_heat_restriction"] + feats["hazard_monsoon_flood"])
    
    return feats.astype(float)


EXCEL_FEATURE_COLS = [
    "dep_hour",
    "dep_minute",
    "dep_time_min",
    "hour_sin",
    "hour_cos",
    "is_morning_dep",
    "is_afternoon_dep",
    "is_evening_dep",
    "is_night_dep",
    "arr_hour",
    "arr_minute",
    "arrival_day_offset",
    "scheduled_duration_min",
    "scheduled_duration_hours",
    "days_frequency",
    "is_daily",
    "operates_on_weekend",
    "total_stops",
    "passed_stops",
    "upcoming_stops",
    "completion_ratio",
    "remaining_stops_ratio",
    "avg_stop_interval_min",
    "stops_per_hour",
    "train_priority_score",
    "is_premium_train",
    "is_ac_train",
    "is_passenger_train",
    "train_priority_weight",
    "max_coach_speed_kmh",
    "locomotive_hp",
    "is_emu",
    "is_electric",
    "is_diesel_partial",
    "power_to_speed_ratio",
    "soil_black_cotton",
    "soil_alluvial",
    "soil_laterite_red",
    "soil_deltaic_marshy",
    "soil_arid_desert",
    "soil_coastal",
    "gradient_severity",
    "has_ghat_section",
    "hazard_fog",
    "hazard_monsoon_flood",
    "hazard_landslide",
    "hazard_heat_restriction",
    "hazard_sandstorm",
    "hazard_freight_coal_congestion",
    "hazard_cyclone_wind",
    "hazard_ghat_braking",
    "total_hazard_count",
    "hazard_terrain_interaction",
    "speed_hazard_stress",
    "black_cotton_hazard_stress"
]


class BlendedExcelDelayRegressor:
    """
    Blended Ensemble Regressor combining Regularized Linear Ridge,
    Random Forest, Gradient Boosting, and Tuned XGBoost.
    """
    def __init__(self, weights=(0.30, 0.25, 0.20, 0.25)):
        from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
        from sklearn.linear_model import Ridge
        from sklearn.preprocessing import RobustScaler
        from sklearn.pipeline import Pipeline
        import xgboost as xgb
        
        self.weights = weights
        self.model_ridge = Pipeline([("scaler", RobustScaler()), ("reg", Ridge(alpha=5.0))])
        self.model_rf = RandomForestRegressor(n_estimators=150, max_depth=5, min_samples_leaf=3, random_state=42)
        self.model_gb = GradientBoostingRegressor(n_estimators=70, max_depth=3, learning_rate=0.04, subsample=0.8, random_state=42)
        self.model_xgb = xgb.XGBRegressor(n_estimators=70, max_depth=3, learning_rate=0.04, subsample=0.8, colsample_bytree=0.8, random_state=42)

    def fit(self, X: pd.DataFrame, y: np.ndarray):
        self.model_ridge.fit(X, y)
        self.model_rf.fit(X, y)
        self.model_gb.fit(X, y)
        self.model_xgb.fit(X, y)
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        p_r = self.model_ridge.predict(X)
        p_rf = self.model_rf.predict(X)
        p_gb = self.model_gb.predict(X)
        p_xgb = self.model_xgb.predict(X)
        w = self.weights
        blend = w[0] * p_r + w[1] * p_rf + w[2] * p_gb + w[3] * p_xgb
        return np.clip(blend, 0.0, None)

    @property
    def feature_importances_(self) -> np.ndarray:
        imp_rf = self.model_rf.feature_importances_
        imp_gb = self.model_gb.feature_importances_
        imp_xgb = self.model_xgb.feature_importances_
        return (imp_rf * 0.35 + imp_gb * 0.30 + imp_xgb * 0.35)

"""
TRETA ETA - Real Historical Performance Repository
Access layer for train-level, station-level, and route-segment delay statistics.
"""

import os
import json
from typing import Dict, Any, Optional, List
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class TrainHistoricalProfile(BaseModel):
    train_number: int
    train_name: str
    sample_runs_observed: int
    train_avg_delay_7d: float = 0.0
    train_avg_delay_30d: float = 0.0
    train_avg_delay_90d: float = 0.0
    train_median_delay_30d: float = 0.0
    train_std_delay_30d: float = 0.0
    train_on_time_percentage_30d: float = 75.0
    train_on_time_percentage_90d: float = 75.0
    train_max_delay_30d: float = 0.0
    train_min_delay_30d: float = 0.0
    data_type: str = "REAL"

class StationHistoricalProfile(BaseModel):
    station_code: str
    station_name: str
    train_number: Optional[int] = None
    sample_stops_observed: int
    station_avg_arrival_delay: float = 0.0
    station_avg_departure_delay: float = 0.0
    station_median_delay: float = 0.0
    station_p90_delay: float = 0.0
    station_on_time_percentage: float = 75.0
    station_delay_variance: float = 0.0
    data_type: str = "REAL"

class SegmentHistoricalProfile(BaseModel):
    segment_id: str
    from_station: str
    to_station: str
    distance_km: float = 0.0
    scheduled_travel_time_min: float = 0.0
    historical_avg_travel_time: float = 0.0
    average_segment_delay: float = 0.0
    median_segment_delay: float = 0.0
    p90_segment_delay: float = 0.0
    delay_propagation_probability: float = 0.5
    sample_count: int = 1
    data_type: str = "REAL"


import os
FEATURES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), "ml_models", "eta", "historical", "features")


class HistoryRepository:
    """Provides querying across pre-computed real historical performance profiles."""

    def __init__(self):
        self._train_features: Dict[str, Any] = {}
        self._station_features: Dict[str, Any] = {}
        self._global_station_features: Dict[str, Any] = {}
        self._segment_features: Dict[str, Any] = {}
        self._temporal_profiles: Dict[str, Any] = {}
        self._load_features()

    def _load_features(self):
        t_path = os.path.join(FEATURES_DIR, "train_historical_features.json")
        s_path = os.path.join(FEATURES_DIR, "station_historical_features.json")
        gs_path = os.path.join(FEATURES_DIR, "global_station_historical_features.json")
        seg_path = os.path.join(FEATURES_DIR, "segment_historical_features.json")
        temp_path = os.path.join(FEATURES_DIR, "temporal_delay_profiles.json")

        for path, attr in [
            (t_path, "_train_features"),
            (s_path, "_station_features"),
            (gs_path, "_global_station_features"),
            (seg_path, "_segment_features"),
            (temp_path, "_temporal_profiles")
        ]:
            if os.path.exists(path):
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        setattr(self, attr, json.load(f))
                except Exception:
                    pass


    def get_train_profile(self, train_number: int) -> Optional[TrainHistoricalProfile]:
        """Returns dynamic train-level historical rolling metrics."""
        raw = self._train_features.get(str(train_number))
        if not raw:
            return None
        return TrainHistoricalProfile(**raw)

    def get_station_profile(self, station_code: str, train_number: Optional[int] = None) -> Optional[StationHistoricalProfile]:
        """Returns station-level delay distribution for a specific train or global station."""
        stn_upper = station_code.upper().strip()
        if train_number:
            key = f"{train_number}_{stn_upper}"
            raw = self._station_features.get(key)
            if raw:
                return StationHistoricalProfile(**raw)

        raw_global = self._global_station_features.get(stn_upper)
        if raw_global:
            return StationHistoricalProfile(
                station_code=raw_global["station_code"],
                station_name=raw_global["station_name"],
                sample_stops_observed=raw_global["sample_stops_observed"],
                station_avg_arrival_delay=raw_global["station_avg_arrival_delay"],
                station_avg_departure_delay=raw_global["station_avg_arrival_delay"],
                station_median_delay=raw_global["station_median_delay"],
                station_p90_delay=raw_global["station_p90_delay"],
                station_on_time_percentage=raw_global["station_on_time_percentage"],
                station_delay_variance=0.0,
                data_type="REAL"
            )
        return None

    def get_segment_profile(self, from_station: str, to_station: str) -> Optional[SegmentHistoricalProfile]:
        """Returns route-segment propagation probability and travel time stats."""
        seg_id = f"{from_station.upper().strip()}_{to_station.upper().strip()}"
        raw = self._segment_features.get(seg_id)
        if not raw:
            return None
        return SegmentHistoricalProfile(**raw)

    def get_temporal_benchmarks(self) -> Dict[str, Any]:
        """Returns global benchmark and day-of-week stats."""
        return self._temporal_profiles

# Map the module so that joblib can unpickle the BlendedExcelDelayRegressor
import sys
import types
sys.modules['treta_eta'] = type('treta_eta', (), {})()
sys.modules['treta_eta.src'] = type('treta_eta.src', (), {})()
sys.modules['treta_eta.src.excel_feature_engineering'] = sys.modules[__name__]

try:
    import sklearn._loss._loss as _loss
    class LeastSquaresError(_loss.CyHalfSquaredError):
        pass
    gb_losses = types.ModuleType('sklearn.ensemble._gb_losses')
    gb_losses.LeastSquaresError = LeastSquaresError
    sys.modules['sklearn.ensemble._gb_losses'] = gb_losses
except Exception:
    pass

