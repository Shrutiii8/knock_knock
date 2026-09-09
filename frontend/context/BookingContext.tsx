'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Train, ClassCode, QuotaCode, Passenger, Booking } from '@/types';
import { generatePNR, generateSeatAllocation, calculateBreakdown, getLocalTodayDate } from '@/lib/utils';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface BookingSearchParams {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  date: string;
  quota: QuotaCode;
  classCode?: ClassCode;
  acOnly: boolean;
  disabledConcession: boolean;
}

interface BookingContextType {
  searchParams: BookingSearchParams;
  setSearchParams: (params: Partial<BookingSearchParams>) => void;
  selectedTrain: Train | null;
  selectedClass: ClassCode | null;
  selectTrainAndClass: (train: Train, cls: ClassCode, journeyDate?: string) => void;
  passengers: Passenger[];
  setPassengers: React.Dispatch<React.SetStateAction<Passenger[]>>;
  addPassenger: (passenger?: Partial<Passenger>) => void;
  updatePassenger: (index: number, updated: Partial<Passenger>) => void;
  removePassenger: (index: number) => void;
  contactMobile: string;
  setContactMobile: (m: string) => void;
  contactEmail: string;
  setContactEmail: (e: string) => void;
  travelInsurance: boolean;
  setTravelInsurance: (val: boolean) => void;
  autoUpgrade: boolean;
  setAutoUpgrade: (val: boolean) => void;
  gstin: string;
  setGstin: (val: string) => void;
  currentBooking: Booking | null;
  bookings: Booking[];
  createBooking: (paymentMethod: string) => Promise<Booking | null>;
  cancelBooking: (pnrNumber: string) => Promise<boolean>;
  getBookingByPNR: (pnrNumber: string) => Booking | undefined;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const INITIAL_PASSENGER: Passenger = {
  id: 'p_1',
  name: '',
  age: 28,
  gender: 'M',
  berthPreference: 'NONE',
  foodPreference: 'VEG'
};

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParamsState] = useState<BookingSearchParams>({
    from: 'HWH',
    fromName: 'HOWRAH JN - HWH',
    to: 'RNC',
    toName: 'RANCHI - RNC (HATI)',
    date: getLocalTodayDate(),
    quota: 'GN',
    acOnly: false,
    disabledConcession: false
  });

  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassCode | null>(null);

  const [passengers, setPassengers] = useState<Passenger[]>([INITIAL_PASSENGER]);
  const [contactMobile, setContactMobile] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [travelInsurance, setTravelInsurance] = useState(true);
  const [autoUpgrade, setAutoUpgrade] = useState(true);
  const [gstin, setGstin] = useState('');

  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const { showToast } = useToast();
  const { isLoggedIn, user } = useAuth();

  // Populate contact fields from user profile if available
  useEffect(() => {
    if (user) {
      setContactMobile(user.mobile || '');
      setContactEmail(user.email || '');
    }
  }, [user]);

  // Fetch bookings when user logs in
  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('irctc_token');
      if (!token) return;
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${apiUrl}/api/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (e) {
        console.error("Failed to fetch bookings");
      }
    };
    
    if (isLoggedIn) {
      fetchBookings();
    } else {
      setBookings([]);
    }
  }, [isLoggedIn]);

  // Restore selected train, class, and search params on reload
  useEffect(() => {
    try {
      const storedTrain = localStorage.getItem('irctc_selected_train');
      if (storedTrain) {
        setSelectedTrain(JSON.parse(storedTrain));
      }
      const storedClass = localStorage.getItem('irctc_selected_class') as ClassCode | null;
      if (storedClass) {
        setSelectedClass(storedClass);
      }
      const storedParams = localStorage.getItem('irctc_search_params');
      if (storedParams) {
        setSearchParamsState(JSON.parse(storedParams));
      }
    } catch (e) {
      console.error("Failed to restore booking state from localStorage", e);
    }
  }, []);

  const setSearchParams = (params: Partial<BookingSearchParams>) => {
    setSearchParamsState(prev => {
      const updated = { ...prev, ...params };
      try {
        localStorage.setItem('irctc_search_params', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const selectTrainAndClass = (train: Train, cls: ClassCode, journeyDate?: string) => {
    setSelectedTrain(train);
    setSelectedClass(cls);
    try {
      localStorage.setItem('irctc_selected_train', JSON.stringify(train));
      localStorage.setItem('irctc_selected_class', cls);
    } catch (e) {}

    const firstStop = train.route?.[0];
    const lastStop = train.route?.[train.route.length - 1];

    const fromCode = train.sourceStation || 'HWH';
    const fromName = firstStop?.stationName 
      ? `${firstStop.stationName.toUpperCase()} (${firstStop.stationCode})`
      : fromCode;

    const toCode = train.destinationStation || 'PNBE';
    const toName = lastStop?.stationName 
      ? `${lastStop.stationName.toUpperCase()} (${lastStop.stationCode})`
      : toCode;

    setSearchParamsState(prev => {
      const updated = {
        ...prev,
        from: fromCode,
        fromName: fromName,
        to: toCode,
        toName: toName,
        ...(journeyDate ? { date: journeyDate } : {})
      };
      try {
        localStorage.setItem('irctc_search_params', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const addPassenger = (passenger?: Partial<Passenger>) => {
    if (passengers.length >= 6) {
      showToast('warning', 'Limit Reached', 'Maximum 6 passengers allowed in a single reservation.');
      return;
    }
    const newPassenger: Passenger = {
      id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: passenger?.name || '',
      age: passenger?.age || 28,
      gender: passenger?.gender || 'M',
      berthPreference: passenger?.berthPreference || 'NONE',
      foodPreference: passenger?.foodPreference || 'VEG'
    };
    setPassengers(prev => [...prev, newPassenger]);
    showToast('info', 'Passenger Added', `Added row for passenger #${passengers.length + 1}`);
  };

  const updatePassenger = (index: number, updated: Partial<Passenger>) => {
    setPassengers(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updated };
      return copy;
    });
  };

  const removePassenger = (index: number) => {
    if (passengers.length <= 1) {
      showToast('warning', 'Minimum Required', 'At least one passenger is required.');
      return;
    }
    setPassengers(prev => prev.filter((_, i) => i !== index));
    showToast('info', 'Passenger Removed', 'Passenger removed from booking.');
  };

  const createBooking = async (paymentMethod: string): Promise<Booking | null> => {
    if (!isLoggedIn) {
      showToast('error', 'Authentication Required', 'Please login to book tickets.');
      return null;
    }

    const token = localStorage.getItem('irctc_token');
    if (!token) return null;

    const classObj = selectedTrain?.classes.find(c => c.classCode === selectedClass);
    const baseRate = classObj?.fare || 1500;
    const paymentType = paymentMethod.includes('UPI') ? 'UPI' : 'CARDS_NETBANKING';

    const breakdown = calculateBreakdown(
      baseRate,
      passengers.length,
      selectedClass || '3A',
      searchParams.quota,
      travelInsurance,
      paymentType
    );

    // Allocate seats on frontend (for simulation, ideally backend should do this)
    const allocatedPassengers: Passenger[] = passengers.map((p, idx) => ({
      ...p,
      allottedSeat: generateSeatAllocation(selectedClass || '3A', idx)
    }));

    const payload = {
      trainNumber: selectedTrain?.trainNumber || '12302',
      trainName: selectedTrain?.trainName || 'Howrah Rajdhani Express',
      fromStation: searchParams.from,
      fromStationName: searchParams.fromName,
      toStation: searchParams.to,
      toStationName: searchParams.toName,
      journeyDate: searchParams.date,
      departureTime: selectedTrain?.departureTime || '16:50',
      arrivalTime: selectedTrain?.arrivalTime || '09:55',
      quota: searchParams.quota,
      selectedClass: selectedClass || '3A',
      passengers: allocatedPassengers,
      contactMobile,
      contactEmail,
      baseFare: breakdown.baseFare,
      reservationCharge: breakdown.reservationCharge,
      superfastCharge: breakdown.superfastCharge,
      tatkalCharge: breakdown.tatkalCharge,
      insuranceCharge: breakdown.insuranceCharge,
      gst: breakdown.gst,
      convenienceFee: breakdown.convenienceFee,
      totalFare: breakdown.totalFare,
      paymentMethod
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${apiUrl}/api/bookings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const newBooking = await res.json();
      
      if (!res.ok) {
        showToast('error', 'Booking Failed', newBooking.detail || 'Could not complete booking.');
        return null;
      }

      setBookings(prev => [newBooking, ...prev]);
      setCurrentBooking(newBooking);
      return newBooking;
      
    } catch (e) {
      showToast('error', 'Network Error', 'Failed to connect to the server');
      return null;
    }
  };

  const cancelBooking = async (pnrNumber: string): Promise<boolean> => {
    const token = localStorage.getItem('irctc_token');
    if (!token) return false;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${apiUrl}/api/bookings/${pnrNumber}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        showToast('error', 'Cancellation Failed', data.detail || 'Could not cancel booking.');
        return false;
      }

      const updatedBookings = bookings.map(b => {
        if (b.pnrNumber === pnrNumber) {
          return {
            ...b,
            bookingStatus: 'CANCELLED' as const,
            cancellationRefund: data.refund
          };
        }
        return b;
      });

      setBookings(updatedBookings);
      showToast('info', 'Ticket Cancelled', `PNR ${pnrNumber} cancelled. Refund of ₹${data.refund} will be credited.`);
      return true;
      
    } catch (e) {
      showToast('error', 'Network Error', 'Failed to connect to the server');
      return false;
    }
  };

  const getBookingByPNR = (pnrNumber: string) => {
    return bookings.find(b => b.pnrNumber === pnrNumber);
  };

  return (
    <BookingContext.Provider
      value={{
        searchParams,
        setSearchParams,
        selectedTrain,
        selectedClass,
        selectTrainAndClass,
        passengers,
        setPassengers,
        addPassenger,
        updatePassenger,
        removePassenger,
        contactMobile,
        setContactMobile,
        contactEmail,
        setContactEmail,
        travelInsurance,
        setTravelInsurance,
        autoUpgrade,
        setAutoUpgrade,
        gstin,
        setGstin,
        currentBooking,
        bookings,
        createBooking,
        cancelBooking,
        getBookingByPNR
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
