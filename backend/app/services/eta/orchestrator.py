import logging
from typing import List, Dict, Any, Optional
from app.schemas.eta import ETAPrediction
from app.services.eta.base import ETAModel
from app.services.eta.aggregator import ETAAggregator

logger = logging.getLogger(__name__)

class ETAOrchestrator:
    """
    Coordinates ETA prediction across multiple registered models.
    """
    def __init__(self):
        self.models: List[ETAModel] = []
        self.aggregator = ETAAggregator()
        self._register_models()
        
    def _register_models(self):
        """
        Initializes and registers enabled ETA models.
        """
        # Register Historical ETA model (V2 default)
        try:
            from app.services.eta.models.historical import HistoricalETAModel
            self.models.append(HistoricalETAModel())
            logger.info("Registered HistoricalETAModel successfully.")
        except Exception as e:
            logger.error(f"Failed to load HistoricalETAModel: {str(e)}")
            
        # Register Weather ETA model (V2 fine-tuned default)
        try:
            from app.services.eta.models.weather import WeatherETAModel
            self.models.append(WeatherETAModel())
            logger.info("Registered WeatherETAModel successfully.")
        except Exception as e:
            logger.error(f"Failed to load WeatherETAModel: {str(e)}")
        
    def predict(self, context: Dict[str, Any]) -> Optional[ETAPrediction]:
        """
        Executes all registered models for the given context and aggregates their output.
        """
        contributions = []
        
        for model in self.models:
            try:
                contrib = model.predict(context)
                if contrib:
                    contributions.append(contrib)
            except Exception as e:
                import traceback
                traceback.print_exc()
                # Catch failures so one bad model doesn't crash the orchestrator
                logger.error(f"Model {model.name} failed during prediction: {str(e)}")
                
        if not contributions:
            # None of the models were able to produce an ETA
            return None
            
        try:
            return self.aggregator.aggregate(context, contributions)
        except Exception as e:
            logger.error(f"Aggregator failed to combine contributions: {str(e)}")
            return None
