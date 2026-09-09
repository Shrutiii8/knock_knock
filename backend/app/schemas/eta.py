from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field


class ETAContribution(BaseModel):
    model_name: str
    delay_minutes: float
    confidence: float
    reason: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ETAPredictionComponent(BaseModel):
    model: str
    delay_minutes: float
    confidence: float


class PredictionConfidenceInterval(BaseModel):
    eta_lower: str
    eta_upper: str
    margin_minutes: float


class ETAPrediction(BaseModel):
    """The final aggregated ETA prediction returned by the Orchestrator."""
    predicted_arrival: str
    predicted_arrival_iso: str
    scheduled_arrival: str
    delay_minutes: float
    confidence: float
    components: List[ETAPredictionComponent] = Field(default_factory=list)
    major_delay_factors: List[str] = Field(default_factory=list)
    confidence_interval: Optional[PredictionConfidenceInterval] = None
    data_freshness: str = ""
    is_live_data: bool = False

class ETAContextRequest(BaseModel):
    route_name: str = "UNKNOWN"
    train_name: str = "UNKNOWN"
    train_number: int = 0
    departure_time: str = "00:00"
    days_of_departure: str = "Daily"
    arrival_time: str = "00:00"
    stations_stopped: str = ""
    historical_avg_delay_min: float = 15.0
    historical_ontime_pct: float = 75.0
    train_type: str = "EXPRESS"
    locomotive_power: str = "WAP4"
    max_coach_speed_kmh: float = 110.0
    current_station: str = "UNKNOWN"
    upcoming_stations: str = "UNKNOWN"
    passed_stations: str = ""
    soil_type: str = "Alluvial"
    incline_gradient: str = "Flat"
    geographic_hazard_delays: str = "None"
    data_source: str = "api"
    current_delay_min: float = 0.0
    is_live: bool = False
    data_freshness: str = ""
    departure_date: str = ""
    weather: Optional[Dict[str, Any]] = None

    model_config = {"extra": "allow"}
