from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import uuid
import random
import string

from app.database import get_db
from app.schemas.db_models import BookingDB, UserDB, TrainDB, PNRRecordDB
from app.api.routers.auth import get_current_user

router = APIRouter(prefix="/bookings", tags=["Bookings"])

# Pydantic schemas
class PassengerSchema(BaseModel):
    name: str
    age: int
    gender: str
    berthPreference: str
    foodPreference: str
    allottedSeat: Optional[dict] = None

class CreateBookingRequest(BaseModel):
    trainNumber: str
    trainName: str
    fromStation: str
    fromStationName: str
    toStation: str
    toStationName: str
    journeyDate: str
    departureTime: str
    arrivalTime: str
    quota: str
    selectedClass: str
    passengers: List[PassengerSchema]
    contactMobile: str
    contactEmail: str
    baseFare: float
    reservationCharge: float
    superfastCharge: float
    tatkalCharge: float
    insuranceCharge: float
    gst: float
    convenienceFee: float
    totalFare: float
    paymentMethod: str

def generate_pnr():
    return "".join(random.choices(string.digits, k=10))

@router.post("", status_code=status.HTTP_201_CREATED)
def create_booking(req: CreateBookingRequest, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    pnr = generate_pnr()
    booking_id = f"bkg_{uuid.uuid4().hex[:10]}"
    
    # Store the booking in DB
    new_booking = BookingDB(
        id=booking_id,
        user_id=current_user.id,
        pnr_number=pnr,
        train_number=req.trainNumber,
        train_name=req.trainName,
        from_station=req.fromStation,
        from_station_name=req.fromStationName,
        to_station=req.toStation,
        to_station_name=req.toStationName,
        journey_date=req.journeyDate,
        departure_time=req.departureTime,
        arrival_time=req.arrivalTime,
        quota=req.quota,
        selected_class=req.selectedClass,
        passengers=[p.dict() for p in req.passengers],
        contact_mobile=req.contactMobile,
        contact_email=req.contactEmail,
        base_fare=req.baseFare,
        reservation_charge=req.reservationCharge,
        superfast_charge=req.superfastCharge,
        tatkal_charge=req.tatkalCharge,
        insurance_charge=req.insuranceCharge,
        gst=req.gst,
        convenience_fee=req.convenienceFee,
        total_fare=req.totalFare,
        payment_method=req.paymentMethod
    )
    
    db.add(new_booking)
    
    # Also add a generic PNR record for the /api/pnr lookup endpoint to work globally
    pnr_record = PNRRecordDB(
        pnr_number=pnr,
        train_number=req.trainNumber,
        train_name=req.trainName,
        journey_date=req.journeyDate,
        from_station=req.fromStation,
        from_station_name=req.fromStationName,
        to_station=req.toStation,
        to_station_name=req.toStationName,
        boarding_station=req.fromStation,
        journey_class=req.selectedClass,
        quota=req.quota,
        chart_status="CHART_NOT_PREPARED",
        passengers=[{
            "passengerNo": i+1,
            "bookingStatus": "CNF",
            "currentStatus": "CNF",
            "coach": p.allottedSeat.get("coach") if p.allottedSeat else "A1",
            "berth": p.allottedSeat.get("berth") if p.allottedSeat else (i+1)*2,
            "berthType": p.allottedSeat.get("berthType") if p.allottedSeat else "LB"
        } for i, p in enumerate(req.passengers)]
    )
    db.add(pnr_record)
    
    db.commit()
    db.refresh(new_booking)
    
    # Return it in the shape the frontend BookingContext expects
    return {
        "id": new_booking.id,
        "pnrNumber": new_booking.pnr_number,
        "trainNumber": new_booking.train_number,
        "trainName": new_booking.train_name,
        "fromStation": new_booking.from_station,
        "fromStationName": new_booking.from_station_name,
        "toStation": new_booking.to_station,
        "toStationName": new_booking.to_station_name,
        "journeyDate": new_booking.journey_date,
        "departureTime": new_booking.departure_time,
        "arrivalTime": new_booking.arrival_time,
        "quota": new_booking.quota,
        "selectedClass": new_booking.selected_class,
        "passengers": new_booking.passengers,
        "contactMobile": new_booking.contact_mobile,
        "contactEmail": new_booking.contact_email,
        "baseFare": new_booking.base_fare,
        "reservationCharge": new_booking.reservation_charge,
        "superfastCharge": new_booking.superfast_charge,
        "tatkalCharge": new_booking.tatkal_charge,
        "insuranceCharge": new_booking.insurance_charge,
        "gst": new_booking.gst,
        "convenienceFee": new_booking.convenience_fee,
        "totalFare": new_booking.total_fare,
        "paymentMethod": new_booking.payment_method,
        "bookingStatus": new_booking.booking_status,
        "chartStatus": new_booking.chart_status,
        "bookedAt": new_booking.booked_at.isoformat() if new_booking.booked_at else None
    }

@router.get("")
def get_my_bookings(db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    bookings = db.query(BookingDB).filter(BookingDB.user_id == current_user.id).order_by(BookingDB.booked_at.desc()).all()
    
    result = []
    for b in bookings:
        result.append({
            "id": b.id,
            "pnrNumber": b.pnr_number,
            "trainNumber": b.train_number,
            "trainName": b.train_name,
            "fromStation": b.from_station,
            "fromStationName": b.from_station_name,
            "toStation": b.to_station,
            "toStationName": b.to_station_name,
            "journeyDate": b.journey_date,
            "departureTime": b.departure_time,
            "arrivalTime": b.arrival_time,
            "quota": b.quota,
            "selectedClass": b.selected_class,
            "passengers": b.passengers,
            "totalFare": b.total_fare,
            "cancellationRefund": b.cancellation_refund,
            "bookingStatus": b.booking_status,
            "bookedAt": b.booked_at.isoformat() if b.booked_at else None
        })
    return result

@router.delete("/{pnr_number}")
def cancel_booking(pnr_number: str, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    booking = db.query(BookingDB).filter(BookingDB.pnr_number == pnr_number, BookingDB.user_id == current_user.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    if booking.booking_status == "CANCELLED":
        raise HTTPException(status_code=400, detail="Booking already cancelled")
        
    clerkage_fee = 180 * len(booking.passengers)
    refund = max(0, booking.total_fare - clerkage_fee)
    
    booking.booking_status = "CANCELLED"
    booking.cancellation_refund = refund
    
    # Also update global PNR record if exists
    pnr_rec = db.query(PNRRecordDB).filter(PNRRecordDB.pnr_number == pnr_number).first()
    if pnr_rec:
        db.delete(pnr_rec) # Or mark as cancelled
        
    db.commit()
    
    return {"message": "Cancelled", "refund": refund, "pnr": pnr_number}
