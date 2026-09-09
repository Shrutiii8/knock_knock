'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import SelectedTrainBanner from '@/components/booking/SelectedTrainBanner';
import PassengerForm from '@/components/booking/PassengerForm';
import ContactDetailsForm from '@/components/booking/ContactDetailsForm';
import FareSummarySidebar from '@/components/booking/FareSummarySidebar';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { getLocalTodayDate } from '@/lib/utils';

export default function BookingPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const {
    selectedTrain,
    selectedClass,
    searchParams,
    passengers,
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
    setGstin
  } = useBooking();

  // If user navigates directly without selecting a train, provide sensible fallback
  const trainToUse = selectedTrain || {
    trainNumber: '12302',
    trainName: 'Howrah Rajdhani Express',
    trainType: 'Rajdhani' as const,
    sourceStation: searchParams.from || 'NDLS',
    destinationStation: searchParams.to || 'HWH',
    departureTime: '16:50',
    arrivalTime: '09:55',
    duration: '17h 05m',
    distanceKm: 1451,
    runsOnDays: [true, true, true, true, true, true, true],
    classes: [
      { classCode: '3A' as const, className: 'AC 3 Tier', fare: 2150, status: 'AVAILABLE' as const, seatsCount: 42 }
    ],
    route: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrival: 'Source', departure: '16:50', haltMin: 0, day: 1, distanceKm: 0, platform: '12' },
      { stationCode: 'HWH', stationName: 'Howrah Junction', arrival: '09:55', departure: 'Destination', haltMin: 0, day: 2, distanceKm: 1451, platform: '9' }
    ]
  };

  const classCodeToUse = selectedClass || '3A';
  const classObj = trainToUse.classes.find(c => c.classCode === classCodeToUse) || trainToUse.classes[0];

  const handleProceedToPayment = () => {
    // Validate passengers
    const invalidPassenger = passengers.find(p => !p.name.trim() || p.age < 1);
    if (invalidPassenger) {
      showToast('error', 'Missing Information', 'Please provide a valid name and age for all passengers.');
      return;
    }

    if (!contactMobile || contactMobile.length !== 10) {
      showToast('error', 'Invalid Mobile Number', 'Please provide a valid 10-digit mobile number for ticket updates.');
      return;
    }

    if (!contactEmail || !contactEmail.includes('@')) {
      showToast('error', 'Invalid Email', 'Please enter a valid email address for your electronic reservation slip.');
      return;
    }

    router.push('/payment');
  };

  const { isLoggedIn, isAuthLoading, openLoginModal } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      router.replace('/');
      openLoginModal('/booking');
    }
  }, [isAuthLoading, isLoggedIn, openLoginModal, router]);

  if (isAuthLoading) {
    return (
      <div className="py-20 text-center select-none space-y-3 max-w-md mx-auto">
        <div className="w-8 h-8 border-3 border-[#0A3D62] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-gray-500">Verifying session...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="py-16 text-center select-none space-y-4 max-w-md mx-auto bg-white rounded-lg p-8 border border-gray-200 shadow-sm mt-8">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#213D77] flex items-center justify-center mx-auto border border-blue-200">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-gray-900">Sign In to Continue Ticket Booking</h2>
        <p className="text-xs text-gray-500">
          Booking train tickets requires an active BRCTC account. Please sign in via the login popup to complete passenger details and secure your reservation.
        </p>
        <button
          type="button"
          onClick={() => openLoginModal('/booking')}
          className="w-full py-2.5 bg-[#213D77] hover:bg-[#182F5D] text-white font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-xs cursor-pointer"
        >
          SIGN IN TO BOOK TICKET
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <Link
          href="/search-results"
          className="text-xs font-bold text-[#0A3D62] hover:text-[#FF6F00] flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Train Results</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Step 2 of 3: Passenger Information
        </span>
      </div>

      {/* Pinned Train Banner */}
      <SelectedTrainBanner
        train={trainToUse}
        selectedClass={classCodeToUse}
        quota={searchParams.quota}
        journeyDate={searchParams.date || getLocalTodayDate()}
        fromStationName={
          trainToUse.route?.[0]?.stationName 
            ? `${trainToUse.route[0].stationName.toUpperCase()} (${trainToUse.sourceStation})`
            : (searchParams.fromName || searchParams.from)
        }
        toStationName={
          trainToUse.route?.[trainToUse.route.length - 1]?.stationName
            ? `${trainToUse.route[trainToUse.route.length - 1].stationName.toUpperCase()} (${trainToUse.destinationStation})`
            : (searchParams.toName || searchParams.to)
        }
      />

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-8 space-y-5">
          <PassengerForm
            passengers={passengers}
            onAddPassenger={addPassenger}
            onUpdatePassenger={updatePassenger}
            onRemovePassenger={removePassenger}
            selectedClass={classCodeToUse}
          />

          <ContactDetailsForm
            mobile={contactMobile}
            onChangeMobile={setContactMobile}
            email={contactEmail}
            onChangeEmail={setContactEmail}
            travelInsurance={travelInsurance}
            onChangeInsurance={setTravelInsurance}
            autoUpgrade={autoUpgrade}
            onChangeAutoUpgrade={setAutoUpgrade}
            gstin={gstin}
            onChangeGstin={setGstin}
          />

          {/* Mobile Bottom Bar for Book Now */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 shadow-2xl z-30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-500 uppercase block">Total Payable:</span>
              <span className="text-base font-black text-[#0A3D62] font-mono">
                ₹{classObj.fare * passengers.length + 120}
              </span>
            </div>
            <button
              type="button"
              onClick={handleProceedToPayment}
              className="px-6 py-2.5 bg-[#FF6F00] hover:bg-[#E65100] text-white font-extrabold text-xs uppercase tracking-wider rounded shadow-md"
            >
              PROCEED TO PAY
            </button>
          </div>
        </div>

        {/* Right Sticky Fare Summary Sidebar */}
        <div className="lg:col-span-4">
          <FareSummarySidebar
            baseFarePerPerson={classObj.fare}
            passengerCount={passengers.length}
            selectedClass={classCodeToUse}
            quota={searchParams.quota}
            hasInsurance={travelInsurance}
            onProceedToPay={handleProceedToPayment}
            isValidToProceed={passengers.length > 0}
          />
        </div>
      </div>
    </div>
  );
}
