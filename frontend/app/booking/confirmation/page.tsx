'use client';

import React from 'react';
import { useBooking } from '@/context/BookingContext';
import ETicketView from '@/components/confirmation/ETicketView';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BookingConfirmationPage() {
  const { currentBooking, bookings } = useBooking();

  // If page reloaded or navigated directly, pick current or latest booking
  const bookingToDisplay = currentBooking || bookings[0];

  if (!bookingToDisplay) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-base font-bold text-gray-800">No Booking Found</h2>
        <p className="text-xs text-gray-500">
          You do not have an active reservation in progress. Please search and select a train to book your ticket.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0A3D62] text-white text-xs font-bold rounded uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go to Train Search</span>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ETicketView booking={bookingToDisplay} />
    </div>
  );
}
