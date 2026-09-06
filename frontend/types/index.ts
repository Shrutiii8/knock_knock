export type ClassCode = '1A' | '2A' | '3A' | '3E' | 'CC' | 'EC' | 'SL' | '2S';

export type QuotaCode = 'GN' | 'TQ' | 'PT' | 'LD' | 'SS' | 'HP' | 'DP';

export interface Station {
  code: string;
  name: string;
  city: string;
  state: string;
}

export interface TrainClassAvailability {
  classCode: ClassCode;
  className: string;
  fare: number;
  status: 'AVAILABLE' | 'RAC' | 'WL' | 'NOT_AVAILABLE';
  seatsCount?: number;
  racCount?: number;
  wlCount?: number;
  confirmedProbability?: number;
  updatedTime?: string;
}

export interface RouteStop {
  stationCode: string;
  stationName: string;
  arrival: string;
  departure: string;
  haltMin: number;
  day: number;
  distanceKm: number;
  platform?: string;
}

export interface Train {
  trainNumber: string;
  trainName: string;
  trainType: 'Vande Bharat' | 'Rajdhani' | 'Shatabdi' | 'Duronto' | 'Superfast' | 'Express' | 'Garib Rath';
  sourceStation: string;
  destinationStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  distanceKm: number;
  runsOnDays: boolean[]; // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  classes: TrainClassAvailability[];
  route: RouteStop[];
}

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'T';
  berthPreference: 'LB' | 'MB' | 'UB' | 'SL' | 'SU' | 'WS' | 'NONE';
  foodPreference?: 'VEG' | 'NON_VEG' | 'NONE';
  concession?: string;
  allottedSeat?: {
    coach: string;
    berth: number;
    berthType: string;
    status: 'CNF' | 'RAC' | 'WL';
  };
}

export interface Booking {
  id: string;
  pnrNumber: string;
  trainNumber: string;
  trainName: string;
  fromStation: string;
  fromStationName: string;
  toStation: string;
  toStationName: string;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
  quota: QuotaCode;
  selectedClass: ClassCode;
  passengers: Passenger[];
  contactMobile: string;
  contactEmail: string;
  baseFare: number;
  reservationCharge: number;
  superfastCharge: number;
  tatkalCharge: number;
  insuranceCharge: number;
  gst: number;
  convenienceFee: number;
  totalFare: number;
  paymentMethod: string;
  bookingStatus: 'CONFIRMED' | 'RAC' | 'WL' | 'CANCELLED';
  chartStatus: 'CHART_PREPARED' | 'CHART_NOT_PREPARED';
  bookedAt: string;
  cancellationRefund?: number;
}

export interface PNRPassengerStatus {
  passengerNo: number;
  bookingStatus: string;
  currentStatus: string;
  coach?: string;
  berth?: number;
  berthType?: string;
}

export interface PNRRecord {
  pnrNumber: string;
  trainNumber: string;
  trainName: string;
  journeyDate: string;
  fromStation: string;
  fromStationName: string;
  toStation: string;
  toStationName: string;
  boardingStation: string;
  journeyClass: ClassCode;
  quota: QuotaCode;
  chartStatus: 'CHART_PREPARED' | 'CHART_NOT_PREPARED';
  passengers: PNRPassengerStatus[];
}

export interface LiveStationStop {
  stationCode: string;
  stationName: string;
  scheduledArrival: string;
  scheduledDeparture: string;
  actualArrival: string;
  actualDeparture: string;
  delayArrivalMin: number;
  delayDepartureMin: number;
  platform: string;
  status: 'PASSED' | 'CURRENT' | 'UPCOMING';
}

export interface LiveTrainStatus {
  trainNumber: string;
  trainName: string;
  lastUpdated: string;
  currentStation: string;
  statusText: string;
  delayMinutes: number;
  stations: LiveStationStop[];
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  mobile: string;
  gender: 'M' | 'F' | 'T';
  dob: string;
  occupation: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
}
