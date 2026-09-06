'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { XCircle, ShieldCheck, AlertTriangle, RefreshCw, CheckCircle2, DollarSign, Calculator, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function CancelTicketContent() {
  const { language } = useLanguage();
  const isHi = language === 'HI';

  const [pnr, setPnr] = useState('');
  const [mobile, setMobile] = useState('');
  const [ticketDetails, setTicketDetails] = useState<any | null>(null);
  const [selectedPassengers, setSelectedPassengers] = useState<number[]>([1, 2]);
  const [cancellationStep, setCancellationStep] = useState<'search' | 'review' | 'otp' | 'success'>('search');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFetchTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnr.length !== 10) {
      setErrorMsg(isHi ? 'कृपया 10-अंकीय PNR दर्ज करें।' : 'Please enter a valid 10-digit PNR.');
      return;
    }
    setErrorMsg('');

    // Simulated Ticket Fetch
    setTicketDetails({
      pnr,
      trainNo: '12302',
      trainName: 'HOWRAH RAJDHANI EXP',
      from: 'NDLS - New Delhi',
      to: 'HWH - Howrah Jn',
      date: '18-Sep-2026',
      travelClass: '3A',
      totalFare: 4260,
      perPassengerFare: 2130,
      passengers: [
        { id: 1, name: 'Sanjay Kumar', age: 34, gender: 'M', berth: 'B3 - 21 (LB)', status: 'CNF' },
        { id: 2, name: 'Anita Sharma', age: 31, gender: 'F', berth: 'B3 - 22 (MB)', status: 'CNF' }
      ]
    });
    setCancellationStep('review');
  };

  const togglePassenger = (id: number) => {
    if (selectedPassengers.includes(id)) {
      if (selectedPassengers.length === 1) {
        alert(isHi ? 'कम से कम एक यात्री को रद्द करने के लिए चुनना आवश्यक है।' : 'At least one passenger must be selected for cancellation.');
        return;
      }
      setSelectedPassengers(selectedPassengers.filter((p) => p !== id));
    } else {
      setSelectedPassengers([...selectedPassengers, id]);
    }
  };

  // Cancellation Fare Calculation (3A flat cancellation charge = ₹180 per passenger >48h)
  const clerkagePerPassenger = 180;
  const numSelected = selectedPassengers.length;
  const totalCancellationCharge = numSelected * clerkagePerPassenger;
  const refundAmount = numSelected * (ticketDetails?.perPassengerFare || 2130) - totalCancellationCharge;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#8B0000] to-[#B22222] text-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-white/10 rounded-lg">
            <XCircle className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wide">
              {isHi ? 'ई-टिकट रद्दीकरण पोर्टल (Cancel E-Ticket)' : 'Online E-Ticket Cancellation Portal'}
            </h1>
            <p className="text-xs text-red-100 mt-0.5">
              {isHi
                ? 'बीआरसीटीसी अधिकृत ई-टिकट रद्द करें एवं भारतीय रेल नियमों के अनुसार तत्काल रिफंड प्राप्त करें'
                : 'Cancel BRCTC e-tickets and initiate instant refund to original source payment method'}
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Search Form */}
      {cancellationStep === 'search' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xs font-bold text-[#213D77] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
            {isHi ? 'टिकट विवरण खोजें' : 'Enter Booking Credentials to Retrieve Ticket'}
          </h2>

          <form onSubmit={handleFetchTicket} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? '10-अंकीय PNR नंबर' : '10-Digit PNR Number'} *
                </label>
                <input
                  type="text"
                  maxLength={10}
                  required
                  placeholder="e.g. 2345678901"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500 font-mono tracking-widest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? 'पंजीकृत मोबाइल नंबर' : 'Registered Mobile Number'} *
                </label>
                <input
                  type="text"
                  maxLength={10}
                  required
                  placeholder="e.g. 9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500 font-mono"
                />
              </div>
            </div>

            {errorMsg && <p className="text-xs text-red-600 font-medium">{errorMsg}</p>}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded shadow-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>{isHi ? 'टिकट विवरण प्राप्त करें' : 'Fetch Ticket Details'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 2: Passenger Checklist & Refund Calculation */}
      {cancellationStep === 'review' && ticketDetails && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-gray-200 gap-2">
            <div>
              <span className="text-[10px] font-bold text-gray-500">PNR: {ticketDetails.pnr}</span>
              <h3 className="font-bold text-base text-[#213D77]">
                {ticketDetails.trainNo} - {ticketDetails.trainName}
              </h3>
              <p className="text-xs text-gray-600">
                {ticketDetails.from} → {ticketDetails.to} | Date: {ticketDetails.date} | Class: {ticketDetails.travelClass}
              </p>
            </div>
            <span className="self-start sm:self-auto px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
              CONFIRMED (CNF)
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              {isHi ? 'रद्द करने हेतु यात्री चुनें (Select Passengers to Cancel)' : 'Select Passengers to Cancel'}
            </h4>
            <div className="space-y-2">
              {ticketDetails.passengers.map((p: any) => {
                const isSelected = selectedPassengers.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => togglePassenger(p.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected ? 'border-red-400 bg-red-50/60' : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 text-red-600 rounded cursor-pointer"
                      />
                      <div>
                        <p className="text-xs font-bold text-gray-900">
                          {p.name} ({p.gender}, {p.age} yrs)
                        </p>
                        <p className="text-[11px] text-gray-500">Berth: {p.berth}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">₹{ticketDetails.perPassengerFare}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Refund Breakdown Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-gray-200">
              <Calculator className="w-4 h-4 text-[#213D77]" />
              {isHi ? 'रिफंड गणना विवरण (Estimated Refund Breakdown)' : 'Estimated Refund Breakdown'}
            </h4>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Original Fare for {numSelected} passenger(s):</span>
              <span>₹{numSelected * ticketDetails.perPassengerFare}</span>
            </div>
            <div className="flex justify-between text-xs text-red-600">
              <span>Railways Cancellation / Clerkage Charge (3A - ₹180 x {numSelected}):</span>
              <span>- ₹{totalCancellationCharge}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-green-700 pt-2 border-t border-gray-200">
              <span>Total Refund to Original Payment Source:</span>
              <span>₹{refundAmount}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCancellationStep('search')}
              className="text-xs text-gray-600 hover:text-gray-900 underline cursor-pointer"
            >
              {isHi ? 'रद्द करें एवं वापस जाएं' : 'Cancel & Go Back'}
            </button>

            <button
              type="button"
              onClick={() => setCancellationStep('otp')}
              className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded shadow-sm transition-colors cursor-pointer"
            >
              {isHi ? 'रद्दीकरण की पुष्टि करें (OTP भेजें)' : 'Confirm Cancellation & Send OTP'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: OTP Verification */}
      {cancellationStep === 'otp' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4 max-w-md mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">
            {isHi ? 'सुरक्षा OTP दर्ज करें' : 'Authorize Cancellation with OTP'}
          </h3>
          <p className="text-xs text-gray-500">
            {isHi
              ? 'आपके पंजीकृत मोबाइल नंबर पर 6-अंकीय OTP भेजा गया है (डेमो: 123456 दर्ज करें)'
              : 'A 6-digit OTP has been dispatched to your registered mobile (Demo: enter 123456)'}
          </p>

          <input
            type="text"
            maxLength={6}
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-40 mx-auto px-4 py-2 border border-gray-300 rounded text-center font-mono text-lg tracking-widest focus:ring-1 focus:ring-red-500"
          />

          <button
            type="button"
            onClick={() => setCancellationStep('success')}
            className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded shadow-sm cursor-pointer transition-colors"
          >
            {isHi ? 'सत्यापित करें एवं टिकट रद्द करें' : 'Verify OTP & Execute Cancellation'}
          </button>
        </div>
      )}

      {/* Step 4: Success Message */}
      {cancellationStep === 'success' && (
        <div className="bg-white rounded-lg border border-green-200 p-8 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {isHi ? 'ई-टिकट सफलतापूर्वक रद्द कर दिया गया!' : 'E-Ticket Cancelled Successfully!'}
          </h3>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            {isHi
              ? `रिफंड राशि ₹${refundAmount} आपके मूल भुगतान खाते में 3-5 कार्य दिवसों में जमा कर दी जाएगी। रद्दीकरण आईडी: CAN-9842103`
              : `Refund amount of ₹${refundAmount} has been initiated to your original payment mode (Credit Card/UPI) within 3-5 bank business days. Cancellation ID: CAN-9842103`}
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/"
              className="px-5 py-2 bg-[#213D77] hover:bg-[#182F5D] text-white text-xs font-bold rounded"
            >
              {isHi ? 'होम पेज पर जाएं' : 'Return to Home'}
            </Link>
            <button
              type="button"
              onClick={() => {
                setCancellationStep('search');
                setPnr('');
                setTicketDetails(null);
              }}
              className="px-5 py-2 border border-gray-300 text-gray-700 text-xs font-bold rounded hover:bg-gray-50"
            >
              {isHi ? 'दूसरा टिकट रद्द करें' : 'Cancel Another Ticket'}
            </button>
          </div>
        </div>
      )}

      {/* Official Railway Cancellation Rules Slab */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <h3 className="text-xs font-bold text-[#213D77] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-[#213D77]" />
          {isHi ? 'भारतीय रेल रद्दीकरण शुल्क नियम (Official Cancellation Slabs)' : 'Indian Railways Official Refund Slabs'}
        </h3>
        <div className="text-[11px] text-gray-600 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white p-2.5 rounded border border-gray-200">
              <span className="font-bold text-gray-900 block">{isHi ? '48 घंटे से अधिक पूर्व' : '> 48 Hours Before Departure'}</span>
              <span className="text-[10px] text-gray-500">Flat Clerkage Deduction:</span>
              <p className="text-[11px] font-semibold text-[#213D77] mt-0.5">
                1AC/EC: ₹240 | 2AC: ₹200 | 3AC/CC: ₹180 | SL: ₹120 | 2S: ₹60
              </p>
            </div>

            <div className="bg-white p-2.5 rounded border border-gray-200">
              <span className="font-bold text-gray-900 block">{isHi ? '48 से 12 घंटे पूर्व' : '48 to 12 Hours Before Departure'}</span>
              <span className="text-[10px] text-gray-500">Percentage deduction:</span>
              <p className="text-[11px] font-semibold text-[#213D77] mt-0.5">
                25% of fare (subject to minimum clerkage per class)
              </p>
            </div>

            <div className="bg-white p-2.5 rounded border border-gray-200">
              <span className="font-bold text-gray-900 block">{isHi ? '12 से 4 घंटे पूर्व' : '12 to 4 Hours Before Departure'}</span>
              <span className="text-[10px] text-gray-500">Percentage deduction:</span>
              <p className="text-[11px] font-semibold text-[#213D77] mt-0.5">
                50% of fare (subject to minimum clerkage per class)
              </p>
            </div>
          </div>
          <p className="text-[10px] text-red-600 pt-1">
            * Chart Preparation: Confirmed tickets cancelled less than 4 hours before scheduled departure or after chart preparation are not eligible for online refund. File TDR for eligible special conditions.
          </p>
        </div>
      </div>

      <div className="text-center pt-2">
        <Link href="/" className="text-xs font-bold text-[#213D77] hover:underline">
          {isHi ? '← मुख्य टिकट बुकिंग पृष्ठ पर वापस जाएं' : '← Back to Home Ticket Booking'}
        </Link>
      </div>
    </div>
  );
}

export default function CancelTicketPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading Ticket Cancellation...</div>}>
      <CancelTicketContent />
    </Suspense>
  );
}
