from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSONB
from app.database import Base

class StationDB(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=True)

class TrainDB(Base):
    __tablename__ = "trains"

    id = Column(Integer, primary_key=True, index=True)
    train_number = Column(String, unique=True, index=True, nullable=False)
    train_name = Column(String, nullable=False)
    train_type = Column(String, nullable=False)
    source_station = Column(String, nullable=False)
    destination_station = Column(String, nullable=False)
    departure_time = Column(String, nullable=False)
    arrival_time = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    distance_km = Column(Integer, nullable=False)
    
    # Store complex nested data as JSONB for scalability without complex joins
    runs_on_days = Column(JSONB, nullable=False)
    classes = Column(JSONB, nullable=False)
    route = Column(JSONB, nullable=False)

class PNRRecordDB(Base):
    __tablename__ = "pnr_records"

    id = Column(Integer, primary_key=True, index=True)
    pnr_number = Column(String, unique=True, index=True, nullable=False)
    train_number = Column(String, index=True, nullable=False)
    train_name = Column(String, nullable=False)
    journey_date = Column(String, nullable=False)
    from_station = Column(String, nullable=False)
    from_station_name = Column(String, nullable=False)
    to_station = Column(String, nullable=False)
    to_station_name = Column(String, nullable=False)
    boarding_station = Column(String, nullable=False)
    journey_class = Column(String, nullable=False)
    quota = Column(String, nullable=False)
    chart_status = Column(String, nullable=False)
    
    # Store passengers as JSONB
    passengers = Column(JSONB, nullable=False)

class UserDB(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    mobile = Column(String, nullable=False)
    gender = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    pincode = Column(String, nullable=True)
    wallet_balance = Column(Float, default=2500.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class BookingDB(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    pnr_number = Column(String, unique=True, index=True, nullable=False)
    train_number = Column(String, nullable=False)
    train_name = Column(String, nullable=False)
    from_station = Column(String, nullable=False)
    from_station_name = Column(String, nullable=False)
    to_station = Column(String, nullable=False)
    to_station_name = Column(String, nullable=False)
    journey_date = Column(String, nullable=False)
    departure_time = Column(String, nullable=False)
    arrival_time = Column(String, nullable=False)
    quota = Column(String, nullable=False)
    selected_class = Column(String, nullable=False)
    
    passengers = Column(JSONB, nullable=False)
    
    contact_mobile = Column(String, nullable=False)
    contact_email = Column(String, nullable=False)
    
    base_fare = Column(Float, nullable=False)
    reservation_charge = Column(Float, nullable=False)
    superfast_charge = Column(Float, nullable=False)
    tatkal_charge = Column(Float, nullable=False)
    insurance_charge = Column(Float, nullable=False)
    gst = Column(Float, nullable=False)
    convenience_fee = Column(Float, nullable=False)
    total_fare = Column(Float, nullable=False)
    cancellation_refund = Column(Float, nullable=True)
    
    payment_method = Column(String, nullable=False)
    booking_status = Column(String, default="CONFIRMED")
    chart_status = Column(String, default="CHART_NOT_PREPARED")
    
    booked_at = Column(DateTime(timezone=True), server_default=func.now())
