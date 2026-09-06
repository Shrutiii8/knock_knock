'use client';

import React from 'react';
import { formatCurrency, calculateBreakdown } from '@/lib/utils';
import { ClassCode, QuotaCode } from '@/types';
import { CreditCard, ShieldCheck, ArrowRight, Tag } from 'lucide-react';

interface FareSummarySidebarProps {
  baseFarePerPerson: number;
  passengerCount: number;
  selectedClass: ClassCode;
  quota: QuotaCode;
  hasInsurance: boolean;
  onProceedToPay: () => void;
  isValidToProceed: boolean;
}

export default function FareSummarySidebar({
  baseFarePerPerson,
  passengerCount,
  selectedClass,
  quota,
  hasInsurance,
  onProceedToPay,
  isValidToProceed
}: FareSummarySidebarProps) {
  const breakdown = calculateBreakdown(
    baseFarePerPerson,
    passengerCount,
    selectedClass,
    quota,
    hasInsurance,
    'UPI'
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-4 text-xs sticky top-20">
      <div className="border-b border-gray-100 pb-3">
        <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#0A3D62]" />
          <span>Fare Summary</span>
        </h3>
        <p className="text-[11px] text-gray-500 mt-0.5">
          {passengerCount} Passenger{passengerCount > 1 ? 's' : ''} • Class {selectedClass}
        </p>
      </div>

      {/* Breakdown Items */}
      <div className="space-y-2 text-gray-700">
        <div className="flex justify-between items-center">
          <span>Ticket Base Fare ({passengerCount} × ₹{baseFarePerPerson})</span>
          <span className="font-semibold text-gray-900">{formatCurrency(breakdown.baseFare)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Reservation Charge</span>
          <span className="font-semibold text-gray-900">{formatCurrency(breakdown.reservationCharge)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Superfast Surcharge</span>
          <span className="font-semibold text-gray-900">{formatCurrency(breakdown.superfastCharge)}</span>
        </div>

        {breakdown.tatkalCharge > 0 && (
          <div className="flex justify-between items-center text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
            <span>Tatkal Quota Premium</span>
            <span className="font-bold">{formatCurrency(breakdown.tatkalCharge)}</span>
          </div>
        )}

        {breakdown.gst > 0 && (
          <div className="flex justify-between items-center">
            <span>GST (5% on AC Classes)</span>
            <span className="font-semibold text-gray-900">{formatCurrency(breakdown.gst)}</span>
          </div>
        )}

        {breakdown.insuranceCharge > 0 && (
          <div className="flex justify-between items-center text-blue-800">
            <span>Travel Insurance (₹0.45/pax)</span>
            <span className="font-semibold">{formatCurrency(breakdown.insuranceCharge)}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span>BRCTC Convenience Fee (UPI)</span>
          <span className="font-semibold text-gray-900">{formatCurrency(breakdown.convenienceFee)}</span>
        </div>
      </div>

      {/* Total Fare */}
      <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
        <div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            TOTAL PAYABLE AMOUNT
          </span>
          <span className="text-[10px] text-green-700 font-semibold">Inclusive of all railway taxes</span>
        </div>
        <div className="text-xl font-black text-[#0A3D62] font-mono">
          {formatCurrency(breakdown.totalFare)}
        </div>
      </div>

      {/* Proceed CTA */}
      <button
        type="button"
        onClick={onProceedToPay}
        disabled={!isValidToProceed}
        className="w-full py-3 bg-[#FF6F00] hover:bg-[#E65100] text-white font-extrabold text-xs uppercase tracking-wider rounded shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>PROCEED TO PAYMENT</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <div className="pt-2 text-[10px] text-gray-500 text-center flex items-center justify-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
        <span>Official BRCTC Safe Gateway Simulation</span>
      </div>
    </div>
  );
}
