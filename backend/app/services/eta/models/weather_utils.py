"""
TRETA Weather Intelligence - Feature Extractor & Risk Engine Utilities (V2)
Extracts 28 quantitative hazard & spatial lookahead features for the
Fine-Tuned 7-Corridor HistGradientBoosting Weather Impact Model.
"""

import sys
import os
import re
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple, Optional

# Scikit-learn unpickling compatibility shim
try:
    import sklearn._loss._loss as _loss_mod
    if not hasattr(_loss_mod, 'CyHalfSquaredError'):
        _loss_mod.CyHalfSquaredError = getattr(_loss_mod, 'HalfSquaredError', None)
    sys.modules['_loss'] = _loss_mod
except Exception:
    pass


LANDSLIDE_PRONE_STATIONS = {"IGP", "KYN", "PUNE", "KOU", "RJP", "NJP", "NCB", "NOQ", "NBQ", "GHY"}
FLOOD_PRONE_STATIONS = {"PNBE", "KIR", "NJP", "GHY", "BWN", "HWH", "BZA", "RJY", "CTC", "BBS"}

WEATHER_V2_FEATURES = [
    "rainfall_1h",
    "rainfall_24h",
    "visibility_m",
    "wind_speed_kmh",
    "temperature_c",
    "humidity_pct",
    "pressure_hpa",
    "cloud_cover_pct",
    "weather_ahead_50km_sev",
    "weather_ahead_100km_sev",
    "weather_ahead_200km_sev",
    "distance_to_weather_zone_km",
    "rain_risk",
    "fog_risk",
    "visibility_risk",
    "wind_risk",
    "storm_risk",
    "flood_risk",
    "landslide_risk",
    "heat_risk",
    "overall_weather_risk",
    "weather_exposure_score",
    "distance_remaining_km",
    "corridor_fog_stress",
    "corridor_cyclone_stress",
    "corridor_flood_landslide_stress",
    "corridor_heat_stress",
    "physics_tsr_delay_min"
]


class WeatherRiskEngine:
    """Computes quantitative weather risk metrics [0.0 - 1.0]."""

    @classmethod
    def compute_rain_risk(cls, r1: float, r24: float) -> float:
        r1, r24 = max(0.0, float(r1)), max(0.0, float(r24))
        if r1 < 2.5:
            score = (r1 / 2.5) * 0.15
        elif r1 < 7.5:
            score = 0.15 + ((r1 - 2.5) / 5.0) * 0.25
        elif r1 < 25.0:
            score = 0.40 + ((r1 - 7.5) / 17.5) * 0.35
        elif r1 < 45.0:
            score = 0.75 + ((r1 - 25.0) / 20.0) * 0.20
        else:
            score = 0.95 + min(0.05, (r1 - 45.0) / 100.0)

        if r24 > 100.0:
            score = min(1.0, score + 0.15)
        elif r24 > 50.0:
            score = min(1.0, score + 0.08)

        return round(float(min(1.0, max(0.0, score))), 3)

    @classmethod
    def compute_visibility_and_fog_risk(cls, vis_m: float, cond_text: str = "") -> Tuple[float, float]:
        v = max(50.0, float(vis_m))
        cond_upper = str(cond_text).upper()

        if v >= 5000.0:
            vis_risk = 0.0
        elif v >= 2000.0:
            vis_risk = 0.10 + ((5000.0 - v) / 3000.0) * 0.25
        elif v >= 1000.0:
            vis_risk = 0.35 + ((2000.0 - v) / 1000.0) * 0.30
        elif v >= 300.0:
            vis_risk = 0.65 + ((1000.0 - v) / 700.0) * 0.25
        else:
            vis_risk = 0.90 + ((300.0 - v) / 300.0) * 0.10

        fog_risk = vis_risk
        if "FOG" in cond_upper or "MIST" in cond_upper or "HAZE" in cond_upper:
            fog_risk = max(fog_risk, 0.45)
        if "DENSE FOG" in cond_upper or v < 350.0:
            fog_risk = max(fog_risk, 0.85)

        return round(float(min(1.0, max(0.0, fog_risk))), 3), round(float(min(1.0, max(0.0, vis_risk))), 3)

    @classmethod
    def compute_wind_risk(cls, wind_kmh: float) -> float:
        w = max(0.0, float(wind_kmh))
        if w < 30.0:
            score = (w / 30.0) * 0.10
        elif w < 50.0:
            score = 0.10 + ((w - 30.0) / 20.0) * 0.30
        elif w < 70.0:
            score = 0.40 + ((w - 50.0) / 20.0) * 0.35
        elif w < 90.0:
            score = 0.75 + ((w - 70.0) / 20.0) * 0.20
        else:
            score = 0.95 + min(0.05, (w - 90.0) / 50.0)
        return round(float(min(1.0, max(0.0, score))), 3)

    @classmethod
    def compute_storm_risk(cls, cond_text: str, pressure_hpa: float = 1013.25, wind_speed: float = 10.0) -> float:
        cond = str(cond_text).upper()
        score = 0.0
        if "THUNDER" in cond or "STORM" in cond:
            score = 0.85 if ("HEAVY" in cond or "SEVERE" in cond) else 0.60
        elif "SQUALL" in cond or "HAIL" in cond:
            score = 0.80
        elif "LIGHTNING" in cond:
            score = 0.70
        elif "RAIN" in cond and wind_speed > 40.0:
            score = 0.45

        if pressure_hpa < 995.0:
            score = max(score, 0.75)
        elif pressure_hpa < 1002.0:
            score = max(score, 0.40)
        return round(float(min(1.0, max(0.0, score))), 3)

    @classmethod
    def compute_flood_risk(cls, r24: float, stn_code: Optional[str] = None) -> float:
        r24 = max(0.0, float(r24))
        base_risk = min(1.0, r24 / 150.0)
        if stn_code and str(stn_code).upper() in FLOOD_PRONE_STATIONS:
            base_risk = min(1.0, base_risk * 1.35 + 0.10 if r24 > 25.0 else base_risk)
        return round(float(min(1.0, max(0.0, base_risk))), 3)

    @classmethod
    def compute_landslide_risk(cls, r24: float, r1: float, stn_code: Optional[str] = None) -> float:
        stn = str(stn_code or "").upper()
        if stn not in LANDSLIDE_PRONE_STATIONS:
            return 0.05 if r24 > 100.0 else 0.0
        score = (max(0.0, r24) / 120.0) * 0.7 + (max(0.0, r1) / 40.0) * 0.3
        return round(float(min(1.0, max(0.0, score))), 3)

    @classmethod
    def compute_heat_risk(cls, temp_c: float) -> float:
        t = float(temp_c)
        if t < 35.0:
            return 0.0
        elif t < 40.0:
            score = ((t - 35.0) / 5.0) * 0.30
        elif t < 44.0:
            score = 0.30 + ((t - 40.0) / 4.0) * 0.40
        else:
            score = 0.70 + min(0.30, ((t - 44.0) / 6.0) * 0.30)
        return round(float(min(1.0, max(0.0, score))), 3)

    @classmethod
    def classify_risk_level(cls, score: float) -> str:
        if score < 0.20:
            return "LOW"
        elif score < 0.40:
            return "MODERATE"
        elif score < 0.70:
            return "HIGH"
        else:
            return "SEVERE"

    @classmethod
    def evaluate_all_risks(
        cls,
        weather_data: Dict[str, Any],
        station_code: Optional[str] = None,
        location_name: Optional[str] = None
    ) -> Dict[str, Any]:
        r1 = float(weather_data.get("rainfall_1h", weather_data.get("precipitation", 0.0)))
        r24 = float(weather_data.get("rainfall_24h", r1 * 5.0))
        vis = float(weather_data.get("visibility_m", weather_data.get("visibility", 10000.0)))
        wind = float(weather_data.get("wind_speed_kmh", weather_data.get("wind_speed", 10.0)))
        cond = str(weather_data.get("weather_condition", weather_data.get("condition", "Clear")))
        temp = float(weather_data.get("temperature_c", weather_data.get("temperature", 25.0)))
        pressure = float(weather_data.get("pressure_hpa", weather_data.get("pressure", 1013.25)))

        rain_r = cls.compute_rain_risk(r1, r24)
        fog_r, vis_r = cls.compute_visibility_and_fog_risk(vis, cond)
        wind_r = cls.compute_wind_risk(wind)
        storm_r = cls.compute_storm_risk(cond, pressure, wind)
        flood_r = cls.compute_flood_risk(r24, station_code)
        landslide_r = cls.compute_landslide_risk(r24, r1, station_code)
        heat_r = cls.compute_heat_risk(temp)

        weighted_avg = (
            0.30 * vis_r +
            0.25 * rain_r +
            0.15 * fog_r +
            0.10 * storm_r +
            0.08 * flood_r +
            0.06 * wind_r +
            0.03 * landslide_r +
            0.03 * heat_r
        )
        max_hazard = max(rain_r, vis_r, fog_r, storm_r, flood_r, wind_r, landslide_r, heat_r)
        overall_risk = round(float(min(1.0, 0.55 * weighted_avg + 0.45 * max_hazard)), 3)
        risk_level = cls.classify_risk_level(overall_risk)

        return {
            "location": location_name or station_code or "Track Location",
            "station_code": station_code,
            "rain_risk": rain_r,
            "fog_risk": fog_r,
            "visibility_risk": vis_r,
            "wind_risk": wind_r,
            "storm_risk": storm_r,
            "flood_risk": flood_r,
            "landslide_risk": landslide_r,
            "heat_risk": heat_r,
            "overall_weather_risk": overall_risk,
            "risk_level": risk_level
        }


def detect_corridor(context: Dict[str, Any]) -> str:
    """Identifies railway corridor name from context route, stations, or zone."""
    corr = str(context.get("corridor", "")).strip().upper()
    if corr in ["DELHI_HOWRAH", "DELHI_MUMBAI", "DELHI_CHENNAI", "DELHI_GUWAHATI", "MUMBAI_CHENNAI", "MUMBAI_HOWRAH", "CHENNAI_HOWRAH"]:
        return corr

    route = str(context.get("route_name", "")).upper()
    stns = str(context.get("stations_stopped", "")).upper()
    train_name = str(context.get("train_name", "")).upper()

    combined = f"{route} {stns} {train_name}"

    if ("NDLS" in combined or "DELHI" in combined) and ("HWH" in combined or "HOWRAH" in combined or "PATNA" in combined or "GAYA" in combined):
        return "DELHI_HOWRAH"
    elif ("NDLS" in combined or "DELHI" in combined) and ("BCT" in combined or "MMCT" in combined or "MUMBAI" in combined):
        return "DELHI_MUMBAI"
    elif ("NDLS" in combined or "DELHI" in combined) and ("MAS" in combined or "CHENNAI" in combined):
        return "DELHI_CHENNAI"
    elif ("NDLS" in combined or "DELHI" in combined) and ("GHY" in combined or "GUWAHATI" in combined):
        return "DELHI_GUWAHATI"
    elif ("MUMBAI" in combined or "CSMT" in combined or "LTT" in combined) and ("CHENNAI" in combined or "MAS" in combined):
        return "MUMBAI_CHENNAI"
    elif ("MUMBAI" in combined or "CSMT" in combined or "LTT" in combined) and ("HOWRAH" in combined or "HWH" in combined):
        return "MUMBAI_HOWRAH"
    elif ("CHENNAI" in combined or "MAS" in combined) and ("HOWRAH" in combined or "HWH" in combined):
        return "CHENNAI_HOWRAH"

    # Default fallback corridor
    return "DELHI_HOWRAH"


def extract_weather_v2_features(context: Dict[str, Any]) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Extracts and computes all 28 features required for Weather Model V2.
    Returns (X_dataframe, weather_metadata_dict).
    """
    # 1. Weather raw observations (from nested 'weather' dict or top-level keys)
    w_data = context.get("weather", {})
    if not isinstance(w_data, dict):
        w_data = {}

    rainfall_1h = float(w_data.get("rainfall_1h", context.get("rainfall_1h", 0.0)))
    rainfall_24h = float(w_data.get("rainfall_24h", context.get("rainfall_24h", rainfall_1h * 4.5)))
    visibility_m = float(w_data.get("visibility_m", w_data.get("visibility", context.get("visibility_m", context.get("visibility", 10000.0)))))
    wind_speed_kmh = float(w_data.get("wind_speed_kmh", w_data.get("wind_speed", context.get("wind_speed_kmh", 10.0))))
    temperature_c = float(w_data.get("temperature_c", w_data.get("temperature", context.get("temperature_c", 26.0))))
    humidity_pct = float(w_data.get("humidity_pct", w_data.get("humidity", context.get("humidity_pct", 65.0))))
    pressure_hpa = float(w_data.get("pressure_hpa", w_data.get("pressure", context.get("pressure_hpa", 1013.25))))
    cloud_cover_pct = float(w_data.get("cloud_cover_pct", w_data.get("cloud_cover", context.get("cloud_cover_pct", 25.0))))
    condition_text = str(w_data.get("weather_condition", w_data.get("condition", context.get("weather_condition", "Clear"))))

    station_code = str(context.get("current_station", context.get("station_code", ""))).upper()

    # 2. Sub-hazard risks computation
    rain_r = WeatherRiskEngine.compute_rain_risk(rainfall_1h, rainfall_24h)
    fog_r, vis_r = WeatherRiskEngine.compute_visibility_and_fog_risk(visibility_m, condition_text)
    wind_r = WeatherRiskEngine.compute_wind_risk(wind_speed_kmh)
    storm_r = WeatherRiskEngine.compute_storm_risk(condition_text, pressure_hpa, wind_speed_kmh)
    flood_r = WeatherRiskEngine.compute_flood_risk(rainfall_24h, station_code)
    landslide_r = WeatherRiskEngine.compute_landslide_risk(rainfall_24h, rainfall_1h, station_code)
    heat_r = WeatherRiskEngine.compute_heat_risk(temperature_c)

    weighted_avg = (
        0.30 * vis_r +
        0.25 * rain_r +
        0.15 * fog_r +
        0.10 * storm_r +
        0.08 * flood_r +
        0.06 * wind_r +
        0.03 * landslide_r +
        0.03 * heat_r
    )
    max_hazard = max(rain_r, vis_r, fog_r, storm_r, flood_r, wind_r, landslide_r, heat_r)
    overall_weather_risk = round(float(min(1.0, 0.55 * weighted_avg + 0.45 * max_hazard)), 3)
    risk_level = WeatherRiskEngine.classify_risk_level(overall_weather_risk)

    # 3. Spatial lookahead features
    if overall_weather_risk > 0.10:
        w_ahead_50 = round(min(1.0, overall_weather_risk * 1.1), 3)
        w_ahead_100 = round(min(1.0, overall_weather_risk * 1.05), 3)
        w_ahead_200 = round(min(1.0, overall_weather_risk * 0.95), 3)
        dist_to_zone = 25.0 if overall_weather_risk > 0.40 else (80.0 if overall_weather_risk > 0.25 else 200.0)
    else:
        w_ahead_50 = 0.0
        w_ahead_100 = 0.0
        w_ahead_200 = 0.0
        dist_to_zone = 999.0

    w_exposure = round(float(
        0.25 * overall_weather_risk +
        0.30 * w_ahead_50 +
        0.25 * w_ahead_100 +
        0.20 * (1.0 if dist_to_zone < 50.0 else 0.0)
    ), 3)

    # 4. Remaining journey distance km
    dist_rem = float(context.get("distance_remaining_km", context.get("distance_km", 350.0)))
    dist_rem = max(10.0, dist_rem)

    # 5. Corridor microclimate stress features
    corridor = detect_corridor(context)

    corr_fog_stress = round(float(
        fog_r * 1.5 + vis_r * 1.2 if corridor == "DELHI_HOWRAH" else fog_r
    ), 3)
    corr_cyclone_stress = round(float(
        wind_r * 1.6 + storm_r * 1.3 if corridor == "CHENNAI_HOWRAH" else wind_r
    ), 3)
    corr_flood_landslide_stress = round(float(
        flood_r * 1.5 + landslide_r * 1.4 if corridor == "DELHI_GUWAHATI" else flood_r
    ), 3)
    corr_heat_stress = round(float(
        heat_r * 1.5 if corridor == "DELHI_CHENNAI" else heat_r
    ), 3)

    # 6. Physics TSR delay calculation
    v_normal = 110.0
    if visibility_m < 300.0:
        v_restricted = 30.0
    elif rainfall_1h > 25.0:
        v_restricted = 45.0
    elif wind_speed_kmh > 70.0:
        v_restricted = 50.0
    else:
        v_restricted = v_normal

    if v_restricted < v_normal:
        physics_tsr_delay = max(0.0, round((dist_rem * 0.3) * (1.0 / v_restricted - 1.0 / v_normal) * 60.0, 2))
    else:
        physics_tsr_delay = 0.0

    row = {
        "rainfall_1h": rainfall_1h,
        "rainfall_24h": rainfall_24h,
        "visibility_m": visibility_m,
        "wind_speed_kmh": wind_speed_kmh,
        "temperature_c": temperature_c,
        "humidity_pct": humidity_pct,
        "pressure_hpa": pressure_hpa,
        "cloud_cover_pct": cloud_cover_pct,
        "weather_ahead_50km_sev": w_ahead_50,
        "weather_ahead_100km_sev": w_ahead_100,
        "weather_ahead_200km_sev": w_ahead_200,
        "distance_to_weather_zone_km": dist_to_zone,
        "rain_risk": rain_r,
        "fog_risk": fog_r,
        "visibility_risk": vis_r,
        "wind_risk": wind_r,
        "storm_risk": storm_r,
        "flood_risk": flood_r,
        "landslide_risk": landslide_r,
        "heat_risk": heat_r,
        "overall_weather_risk": overall_weather_risk,
        "weather_exposure_score": w_exposure,
        "distance_remaining_km": dist_rem,
        "corridor_fog_stress": corr_fog_stress,
        "corridor_cyclone_stress": corr_cyclone_stress,
        "corridor_flood_landslide_stress": corr_flood_landslide_stress,
        "corridor_heat_stress": corr_heat_stress,
        "physics_tsr_delay_min": physics_tsr_delay
    }

    df = pd.DataFrame([row])[WEATHER_V2_FEATURES]

    metadata = {
        "corridor": corridor,
        "weather_condition": condition_text,
        "rainfall_1h": rainfall_1h,
        "rainfall_24h": rainfall_24h,
        "visibility_m": visibility_m,
        "wind_speed_kmh": wind_speed_kmh,
        "temperature_c": temperature_c,
        "humidity_pct": humidity_pct,
        "overall_weather_risk": overall_weather_risk,
        "risk_level": risk_level,
        "weather_exposure_score": w_exposure,
        "physics_tsr_delay_min": physics_tsr_delay,
        "rain_risk": rain_r,
        "fog_risk": fog_r,
        "visibility_risk": vis_r,
        "wind_risk": wind_r,
        "storm_risk": storm_r,
        "flood_risk": flood_r,
        "landslide_risk": landslide_r,
        "heat_risk": heat_r
    }

    return df, metadata
