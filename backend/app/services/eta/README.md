# Modular ETA Orchestrator Architecture

This module provides a scalable, modular architecture for predicting train Arrival Times (ETAs) by combining multiple machine learning models and operational rules.

## Architecture Overview

The system is built on a simple pipeline:
```
Search Request -> ETAOrchestrator -> [HistoricalModel, FutureModel1...] -> ETAAggregator -> ETA Prediction
```

- **`base.py`**: Defines `ETAModel`, an abstract interface. Any new model must inherit from this and return an `ETAContribution`.
- **`orchestrator.py`**: Handles initialization of enabled models, passes the context to them safely (catching model failures), and gathers their contributions.
- **`aggregator.py`**: Processes the gathered contributions and combines them into a single final ETA prediction (`ETAPrediction`). Currently uses an additive strategy for delay minutes.

## How to Add a New ETA Model (e.g., Weather, Speed Restrictions)

Adding a new model is designed to be easy and isolated:

1. **Create the Model File**: Create a new file in `app/services/eta/models/` (e.g., `weather.py`).
2. **Implement the Interface**: Inherit from `ETAModel` and implement the `predict()` method.
   ```python
   from app.services.eta.base import ETAModel
   from app.schemas.eta import ETAContribution

   class WeatherETAModel(ETAModel):
       name = "weather"
       def predict(self, context) -> ETAContribution:
           # Call weather API, compute additional delay...
           return ETAContribution(
               model_name=self.name,
               delay_minutes=5.0, # Additional delay
               confidence=0.8,
               reason="Heavy rain in upcoming sections"
           )
   ```
3. **Register the Model**: Open `orchestrator.py`, import your model, and add it to `self.models.append(WeatherETAModel())` inside `_register_models()`.

The Orchestrator and Aggregator will automatically pick up your model's contribution and include it in the final ETA response sent to the frontend.

## The Historical Model

The currently implemented `HistoricalETAModel` (`models/historical.py`) is adapted from the `treta_eta` research project.
- It loads exactly once during orchestrator initialization.
- It uses actual trained weights (`excel_delay_model.pkl`) stored in `ml_models/eta/historical/models/`.
- Preprocessing relies on `historical_utils.py` (which ports the original data repositories and excel feature engineering pipelines).
