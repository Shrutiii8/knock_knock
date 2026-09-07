from abc import ABC, abstractmethod
from typing import Any, Dict
from app.schemas.eta import ETAContribution


class ETAModel(ABC):
    """
    Abstract base class for all ETA prediction models.
    Each model must implement predict() to return its delay contribution.
    """
    name: str

    @abstractmethod
    def predict(self, context: Dict[str, Any]) -> ETAContribution:
        """
        Receives context about a train and returns a contribution to the ETA.
        """
        pass
