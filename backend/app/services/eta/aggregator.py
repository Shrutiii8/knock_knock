from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.schemas.eta import ETAContribution, ETAPrediction, ETAPredictionComponent, PredictionConfidenceInterval


class ETAAggregator:
    """
    Aggregates contributions from multiple models into a final ETAPrediction.
    """
    
    def aggregate(self, context: Dict[str, Any], contributions: List[ETAContribution]) -> ETAPrediction:
        """
        Combines delay contributions. Currently uses an additive strategy for delay minutes.
        """
        total_delay = 0.0
        weighted_confidence_sum = 0.0
        factors = []
        components = []
        
        active_count = 0
        for c in contributions:
            total_delay += c.delay_minutes
            if c.metadata.get("available", True):
                weighted_confidence_sum += c.confidence
                active_count += 1
            else:
                # Still include confidence if no active models count
                weighted_confidence_sum += c.confidence
                
            if c.reason:
                factors.append(f"[{c.model_name}] {c.reason}")
                
            components.append(ETAPredictionComponent(
                model=c.model_name,
                delay_minutes=round(c.delay_minutes, 1),
                confidence=round(c.confidence, 2)
            ))
            
            # Extract additional factors from metadata if present
            if c.metadata and "major_delay_factors" in c.metadata:
                factors.extend(c.metadata["major_delay_factors"])
                
        # Average confidence across available models
        denom = active_count if active_count > 0 else max(len(contributions), 1)
        final_confidence = weighted_confidence_sum / denom
        
        # Calculate predicted arrival times
        # Context must contain scheduled departure, scheduled arrival, and departure_date
        sch_arr_raw = str(context.get("scheduled_arrival") or context.get("arrival_time") or "00:00").strip()
        sch_arr_str = sch_arr_raw.split()[0] if sch_arr_raw else "00:00"
        dep_date_str = context.get("departure_date", datetime.now().strftime("%Y-%m-%d"))
        
        try:
            base_dt = datetime.fromisoformat(dep_date_str)
        except ValueError:
            base_dt = datetime.now()
            
        # Try to parse scheduled arrival. (Assuming format like "14:20")
        try:
            parts = sch_arr_str.split(":")
            arr_h, arr_m = int(parts[0]), int(parts[1])
            sch_arrival_dt = base_dt.replace(hour=arr_h, minute=arr_m, second=0, microsecond=0)
            day_offset = context.get("arrival_day_offset", 0)
            sch_arrival_dt += timedelta(days=day_offset)
        except Exception:
            sch_arrival_dt = base_dt
            
        pred_arrival_dt = sch_arrival_dt + timedelta(minutes=total_delay)
        
        # Calculate margins from historical metadata if provided
        margin_90 = 15.0 # fallback default
        for c in contributions:
            if "margin_minutes" in c.metadata:
                margin_90 = c.metadata["margin_minutes"]
                break
                
        eta_lower = pred_arrival_dt - timedelta(minutes=margin_90)
        eta_upper = pred_arrival_dt + timedelta(minutes=margin_90)
        
        # Deduplicate factors
        factors = list(dict.fromkeys(factors))
        
        # Live data status (extract from context or metadata)
        is_live = context.get("is_live", False)
        for c in contributions:
            if c.metadata.get("is_live_data"):
                is_live = True
                
        freshness = datetime.now().strftime("%H:%M:%S")
        for c in contributions:
            if "data_freshness" in c.metadata:
                freshness = c.metadata["data_freshness"]
                break

        return ETAPrediction(
            predicted_arrival=pred_arrival_dt.strftime("%H:%M"),
            predicted_arrival_iso=pred_arrival_dt.strftime("%Y-%m-%d %H:%M"),
            scheduled_arrival=sch_arr_str,
            delay_minutes=round(total_delay, 1),
            confidence=round(final_confidence, 2),
            components=components,
            major_delay_factors=factors,
            confidence_interval=PredictionConfidenceInterval(
                eta_lower=eta_lower.strftime("%H:%M"),
                eta_upper=eta_upper.strftime("%H:%M"),
                margin_minutes=round(margin_90, 1)
            ),
            data_freshness=freshness,
            is_live_data=is_live
        )
