'use client';

import React from 'react';
import Link from 'next/link';
import { Booking } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import { 
  CheckCircle2, 
  Printer, 
  Download, 
  Train, 
  ArrowLeft, 
  Share2, 
  ShieldCheck, 
  QrCode,
  Calendar,
  Clock,
  MapPin,
  FileText
} from 'lucide-react';

interface ETicketViewProps {
  booking: Booking;
}

export default function ETicketView({ booking }: ETicketViewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-xs max-w-4xl mx-auto">
      {/* Celebration & Success Alert (Hidden in Print) */}
      <div className="no-print bg-green-50 border border-green-200 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 flex-shrink-0 animate-bounce">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-green-800 uppercase tracking-widest">
              BOOKING SUCCESSFUL • PAYMENT CONFIRMED
            </div>
            <h1 className="text-lg font-black text-gray-900 mt-0.5">
              Your Electronic Reservation Slip (ERS) is Confirmed
            </h1>
            <p className="text-gray-600 text-xs">
              SMS ticket has been sent to +91 {booking.contactMobile} and PDF to {booking.contactEmail}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-[#0A3D62] hover:bg-[#072B45] text-white font-bold rounded flex items-center gap-1.5 transition-colors uppercase tracking-wider text-xs shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Ticket</span>
          </button>
        </div>
      </div>

      {/* Official Electronic Reservation Slip (ERS) Printable Paper Layout */}
      <div className="bg-white rounded-lg border-2 border-gray-300 shadow-md p-6 sm:p-8 space-y-5 print:border-none print:shadow-none print:p-0">
        
        {/* Header Ribbon */}
        <div className="border-b-2 border-[#0A3D62] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded bg-[#0A3D62] text-white flex items-center justify-center">
              <Train className="w-6 h-6 text-[#FF6F00]" />
            </div>
            <div>
              <div className="font-extrabold text-base text-[#0A3D62] tracking-wider uppercase">
                Bharat Railway Catering & Tourism Corporation
              </div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Electronic Reservation Slip (ERS) • Valid with Original Photo ID
              </div>
            </div>
          </div>

          <div className="bg-gray-100 px-3 py-1.5 rounded border border-gray-300 text-center">
            <span className="text-[9px] font-bold text-gray-500 block uppercase">BOOKING REFERENCE (PNR)</span>
            <span className="font-mono text-base font-black text-[#0A3D62] tracking-widest">
              {booking.pnrNumber}
            </span>
          </div>
        </div>

        {/* Train & Journey Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded border border-gray-200">
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase block">Train No. & Name</span>
            <span className="font-extrabold text-gray-900 font-mono text-sm">{booking.trainNumber}</span>
            <div className="font-bold text-gray-800 text-[11px] truncate">{booking.trainName}</div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase block">Journey Date</span>
            <span className="font-extrabold text-gray-900 text-xs">{formatDate(booking.journeyDate)}</span>
            <div className="text-[10px] text-gray-500">Departure: {booking.departureTime} hrs</div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase block">Class & Quota</span>
            <span className="font-extrabold text-gray-900 text-xs">
              {booking.selectedClass} • {booking.quota}
            </span>
            <div className="text-[10px] text-gray-500">Distance: Direct Route</div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase block">Chart Status</span>
            <span className="font-extrabold text-green-700 text-xs bg-green-100 px-1.5 py-0.5 rounded inline-block">
              {booking.chartStatus.replace('_', ' ')}
            </span>
            <div className="text-[10px] text-gray-500 mt-0.5">Booked: {new Date(booking.bookedAt).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Boarding and Destination Route */}
        <div className="p-4 bg-blue-50/50 rounded border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left w-full sm:w-auto">
            <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wide block">FROM STATION (BOARDING)</span>
            <div className="text-sm font-black text-gray-900">{booking.fromStationName} ({booking.fromStation})</div>
            <div className="text-gray-600 text-[11px]">Scheduled Dep: {booking.departureTime}</div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-gray-400 font-mono text-xs">
            <span>━━━━━━━━━▶</span>
          </div>

          <div className="text-left sm:text-right w-full sm:w-auto">
            <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wide block">TO STATION (DESTINATION)</span>
            <div className="text-sm font-black text-gray-900">{booking.toStationName} ({booking.toStation})</div>
            <div className="text-gray-600 text-[11px]">Scheduled Arr: {booking.arrivalTime}</div>
          </div>
        </div>

        {/* Passenger Seat Allocation Table */}
        <div>
          <h3 className="font-extrabold text-xs text-[#0A3D62] uppercase tracking-wider mb-2">
            Passenger Details & Berth Allocations
          </h3>

          <div className="overflow-x-auto border border-gray-300 rounded">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px] border-b border-gray-300">
                  <th className="p-2.5">#</th>
                  <th className="p-2.5">Passenger Name</th>
                  <th className="p-2.5">Age</th>
                  <th className="p-2.5">Gender</th>
                  <th className="p-2.5">Booking Status</th>
                  <th className="p-2.5">Current Status</th>
                  <th className="p-2.5">Coach</th>
                  <th className="p-2.5">Berth / Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {booking.passengers.map((passenger, idx) => (
                  <tr key={passenger.id || `passenger-${idx}`} className="hover:bg-gray-50/50">
                    <td className="p-2.5 font-bold text-gray-500">{idx + 1}</td>
                    <td className="p-2.5 font-extrabold text-gray-900">{passenger.name}</td>
                    <td className="p-2.5">{passenger.age}</td>
                    <td className="p-2.5">{passenger.gender === 'M' ? 'Male' : passenger.gender === 'F' ? 'Female' : 'Trans'}</td>
                    <td className="p-2.5 font-bold text-green-700">CNF</td>
                    <td className="p-2.5 font-bold text-green-700">CONFIRMED</td>
                    <td className="p-2.5 font-mono font-black text-[#0A3D62] text-sm">
                      {passenger.allottedSeat?.coach || 'B2'}
                    </td>
                    <td className="p-2.5 font-mono font-black text-gray-900">
                      {passenger.allottedSeat?.berth || 34} ({passenger.allottedSeat?.berthType || 'LB'})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fare Details and QR Code Verification */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="sm:col-span-2 border border-gray-200 rounded p-3 space-y-1.5 bg-gray-50/60">
            <h4 className="font-bold text-gray-800 uppercase text-[10px] tracking-wider mb-2">Payment Breakdown</h4>
            <div className="flex justify-between text-gray-600">
              <span>Ticket Fare:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(booking.baseFare)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Reservation & Superfast Charges:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(booking.reservationCharge + booking.superfastCharge)}</span>
            </div>
            {booking.gst > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>GST:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(booking.gst)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>BRCTC Convenience Fee & Insurance:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(booking.convenienceFee + booking.insuranceCharge)}</span>
            </div>
            <div className="border-t border-gray-300 pt-1.5 flex justify-between font-black text-sm text-[#0A3D62]">
              <span>TOTAL FARE PAID:</span>
              <span className="font-mono">{formatCurrency(booking.totalFare)}</span>
            </div>
            <div className="text-[10px] text-gray-500 pt-1">Paid via: {booking.paymentMethod}</div>
          </div>

          {/* QR Code Inspection */}
          <div className="border border-gray-200 rounded p-3 flex flex-col items-center justify-center text-center bg-gray-50/60">
            <div className="w-24 h-24 bg-white border-2 border-gray-800 p-1 flex items-center justify-center">
              <QrCode className="w-20 h-20 text-gray-900" />
            </div>
            <span className="text-[9px] font-bold text-gray-600 mt-2 uppercase">Official PRS QR Code</span>
            <span className="text-[8px] text-gray-400">Scan for onboard verification</span>
          </div>
        </div>

        {/* Advisory Instructions */}
        <div className="border-t border-gray-200 pt-4 text-[10px] text-gray-600 space-y-1 leading-relaxed">
          <p className="font-bold text-gray-800 uppercase">Important Passenger Information:</p>
          <p>1. Prescribed original ID proofs: Voter ID, Passport, PAN Card, Driving License, Photo ID issued by Central/State Govt, or Aadhaar Card with DOB.</p>
          <p>2. Time indicated is as per 24-hour Indian Standard Time (IST) clock.</p>
          <p>3. In case of train cancellation due to natural calamity, full refund is credited automatically.</p>
        </div>
      </div>

      {/* Action Navigation Buttons (Hidden in print) */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <Link
          href="/"
          className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Plan Another Journey</span>
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/account?tab=history"
            className="w-full sm:w-auto px-5 py-2.5 bg-[#0A3D62] hover:bg-[#072B45] text-white font-bold rounded flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            <FileText className="w-4 h-4" />
            <span>View in Booking History</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
