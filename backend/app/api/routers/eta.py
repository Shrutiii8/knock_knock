from fastapi import APIRouter, HTTPException
from typing import Optional
from app.schemas.eta import ETAContextRequest, ETAPrediction
from app.services.eta.orchestrator import ETAOrchestrator

# Initialize globally so models are loaded once
eta_orchestrator = ETAOrchestrator()

router = APIRouter()

@router.post("/predict", response_model=ETAPrediction)
def predict_eta(request: ETAContextRequest):
    """
    Stand-alone endpoint to get an ETA prediction for a specific train and route context.
    """
    try:
        context = request.model_dump()
        prediction = eta_orchestrator.predict(context)
        
        if not prediction:
            raise HTTPException(status_code=404, detail="Could not generate ETA prediction for the given context.")
            
        return prediction
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
