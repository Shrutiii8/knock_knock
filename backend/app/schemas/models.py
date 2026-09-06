from pydantic import BaseModel, Field
from typing import List, Optional

class Station(BaseModel):
    code: str
    name: str
    city: str
    state: Optional[str] = None

class TrainClassAvailability(BaseModel):
    classCode: str
    className: str
    fare: int
    status: str
    seatsCount: Optional[int] = None
    racCount: Optional[int] = None
    wlCount: Optional[int] = None
    confirmedProbability: Optional[int] = None
    updatedTime: Optional[str] = None

class RouteStop(BaseModel):
    stationCode: str
    stationName: str
    arrival: str
    departure: str
    haltMin: int
    day: int
    distanceKm: int
    platform: Optional[str] = None

class Train(BaseModel):
    trainNumber: str
    trainName: str
    trainType: str
    sourceStation: str
    destinationStation: str
    departureTime: str
    arrivalTime: str
    duration: str
    distanceKm: int
    runsOnDays: List[bool]
    classes: List[TrainClassAvailability]
    route: List[RouteStop]

class PNRPassengerStatus(BaseModel):
    passengerNo: int
    bookingStatus: str
    currentStatus: str
    coach: Optional[str] = None
    berth: Optional[int] = None
    berthType: Optional[str] = None

class PNRRecord(BaseModel):
    pnrNumber: str
    trainNumber: str
    trainName: str
    journeyDate: str
    fromStation: str
    fromStationName: str
    toStation: str
    toStationName: str
    boardingStation: str
    journeyClass: str
    quota: str
    chartStatus: str
    passengers: List[PNRPassengerStatus]

class LiveStationStop(BaseModel):
    stationCode: str
    stationName: str
    scheduledArrival: str
    scheduledDeparture: str
    actualArrival: str
    actualDeparture: str
    delayArrivalMin: int
    delayDepartureMin: int
    platform: str
    status: str

class LiveTrainStatus(BaseModel):
    trainNumber: str
    trainName: str
    lastUpdated: str
    currentStation: str
    statusText: str
    delayMinutes: int
    stations: List[LiveStationStop]
