'use client';

import React from 'react';
import Link from 'next/link';
import PaymentGateway from '@/components/payment/PaymentGateway';
import { useBooking } from '@/context/BookingContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeft, Train, Users, ShieldCheck } from 'lucide-react';

export default function PaymentPage() {
  const { selectedTrain, selectedClass, passengers, searchParams, travelInsurance } = useBooking();

  const classObj = selectedTrain?.classes.find(c => c.classCode === selectedClass);
  const baseRate = classObj?.fare || 1750;
  const subtotal = baseRate * passengers.length;
  const grandTotal = subtotal + 40 * passengers.length + 45 * passengers.length + 11.80 + (travelInsurance ? 0.45 * passengers.length : 0);

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <Link
          href="/booking"
          className="text-xs font-bold text-[#0A3D62] hover:text-[#FF6F00] flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Passenger Details</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Step 3 of 3: Secure Payment Authorization
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Payment Methods Gateway */}
        <div className="lg:col-span-8">
          <PaymentGateway />
        </div>

        {/* Right Column: Order Recap Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm text-xs space-y-3">
            <div className="border-b border-gray-100 pb-2.5">
              <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">
                Booking Summary
              </h3>
              <p className="text-[11px] text-gray-500">Please verify journey details before paying</p>
            </div>

            <div className="space-y-2 text-gray-700">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Train className="w-4 h-4 text-[#0A3D62]" />
                <span>{selectedTrain?.trainNumber || '12302'} - {selectedTrain?.trainName || 'Howrah Rajdhani'}</span>
              </div>

              <div className="text-[11px] text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                <div>Route: <strong>{searchParams.fromName || searchParams.from}</strong> to <strong>{searchParams.toName || searchParams.to}</strong></div>
                <div>Date: <strong>{formatDate(searchParams.date)}</strong></div>
                <div>Class: <strong>{selectedClass || '3A'}</strong> • Quota: <strong>{searchParams.quota}</strong></div>
              </div>

              <div className="flex items-center gap-1.5 pt-1 text-[11px] font-semibold text-gray-800">
                <Users className="w-3.5 h-3.5 text-[#0A3D62]" />
                <span>{passengers.length} Passenger{passengers.length > 1 ? 's' : ''}:</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-gray-600 pl-1 space-y-0.5">
                {passengers.map((p, idx) => (
                  <li key={idx} className="truncate">
                    {p.name || `Passenger ${idx + 1}`} ({p.age} yrs, {p.gender})
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                  AMOUNT TO BE CHARGED
                </span>
                <span className="text-[10px] text-green-700 font-semibold">Zero gateway surcharge</span>
              </div>
              <div className="text-xl font-black text-[#0A3D62] font-mono">
                {formatCurrency(Math.round(grandTotal))}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 text-amber-900 text-xs flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <span className="text-[11px]">
              Upon payment confirmation, your PNR will be immediately generated and your confirmed seat numbers will be locked in the railway PRS system.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
