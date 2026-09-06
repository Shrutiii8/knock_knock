'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { Ticket, ShieldAlert, CheckCircle2, FileText, AlertCircle, Clock, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function CounterTicketCancellationContent() {
  const { language } = useLanguage();
  const isHi = language === 'HI';

  const [pnr, setPnr] = useState('');
  const [trainNumber, setTrainNumber] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFetch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnr.length !== 10) {
      setErrorMsg(isHi ? 'कृपया 10-अंकीय PNR दर्ज करें।' : 'Please enter a valid 10-digit PNR.');
      return;
    }
    if (captcha.toUpperCase() !== '7K9P') {
      setErrorMsg(isHi ? 'अमान्य कैप्चा कोड (7K9P दर्ज करें)' : 'Invalid Captcha code (Enter 7K9P for demo)');
      return;
    }
    setErrorMsg('');
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#8B0000] to-[#A52A2A] text-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-white/10 rounded-lg">
            <Ticket className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wide">
              {isHi ? 'काउंटर टिकट ऑनलाइन रद्दीकरण (PRS Counter Cancellation)' : 'PRS Counter Ticket Online Cancellation'}
            </h1>
            <p className="text-xs text-red-100 mt-0.5">
              {isHi
                ? 'रेलवे स्टेशन आरक्षण काउंटर से खरीदे गए भौतिक पेपर टिकट को ऑनलाइन रद्द करें एवं स्टेशन से नकद रिफंड पाएं'
                : 'Cancel physical PRS station counter paper tickets online and collect cash refund at any PRS counter'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Step */}
      {step === 'form' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xs font-bold text-[#213D77] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
            {isHi ? 'काउंटर टिकट विवरण दर्ज करें' : 'Enter PRS Paper Ticket Credentials'}
          </h2>

          <form onSubmit={handleFetch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? '10-अंकीय PNR नंबर (काउंटर टिकट पर छपा)' : '10-Digit PNR Number (Printed on Paper Ticket)'} *
                </label>
                <input
                  type="text"
                  maxLength={10}
                  required
                  placeholder="e.g. 2345678901"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-red-500 font-mono tracking-widest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? '5-अंकीय ट्रेन नंबर' : '5-Digit Train Number'} *
                </label>
                <input
                  type="text"
                  maxLength={5}
                  required
                  placeholder="e.g. 12302"
                  value={trainNumber}
                  onChange={(e) => setTrainNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-red-500 font-mono"
                />
              </div>
            </div>

            {/* Captcha */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? 'कैप्चा कोड' : 'Captcha Code'} *
                </label>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-gray-100 border border-gray-300 rounded font-mono font-bold tracking-widest text-sm text-gray-800 select-none">
                    7K9P
                  </div>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    placeholder="Enter 7K9P"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-red-500 uppercase tracking-widest"
                  />
                </div>
              </div>
            </div>

            {errorMsg && <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded shadow-sm transition-colors cursor-pointer"
              >
                {isHi ? 'OTP भेजें एवं विवरण जांचें' : 'Submit & Request OTP'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* OTP Step */}
      {step === 'otp' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm max-w-md mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">
            {isHi ? 'काउंटर मोबाइल OTP सत्यापन' : 'Verify Mobile OTP'}
          </h3>
          <p className="text-xs text-gray-600">
            {isHi
              ? 'आरक्षण फॉर्म भरते समय दिए गए मोबाइल नंबर पर 6-अंकीय OTP भेजा गया है (डेमो: 123456 दर्ज करें)'
              : 'An OTP has been dispatched to the mobile number given at the reservation counter requisition slip.'}
          </p>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-36 mx-auto px-3 py-2 border border-gray-300 rounded text-center font-mono text-base tracking-widest focus:ring-1 focus:ring-red-500"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded shadow-sm transition-colors cursor-pointer"
            >
              {isHi ? 'रद्दीकरण की पुष्टि करें' : 'Confirm Cancellation'}
            </button>
          </form>
        </div>
      )}

      {/* Success Step */}
      {step === 'success' && (
        <div className="bg-white rounded-lg border border-green-200 p-8 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {isHi ? 'काउंटर टिकट सफलतापूर्वक रद्द किया गया!' : 'PRS Counter Ticket Cancelled Online!'}
          </h3>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-left max-w-lg mx-auto space-y-2">
            <p className="text-xs font-bold text-amber-900">
              {isHi ? 'नकद रिफंड प्राप्त करने के निर्देश:' : 'Mandatory Instructions for Cash Refund Collection:'}
            </p>
            <p className="text-xs text-amber-950">
              1. <strong>Surrender Original Paper Ticket:</strong> You MUST hand over your original physical PRS paper ticket at any PRS booking counter.
            </p>
            <p className="text-xs text-amber-950">
              2. <strong>Time Window:</strong> Cash refund must be collected within 4 hours prior to scheduled departure (or within first 2 hours of counter opening for morning trains).
            </p>
          </div>

          <div className="pt-3">
            <button
              type="button"
              onClick={() => {
                setStep('form');
                setPnr('');
                setCaptcha('');
              }}
              className="px-5 py-2 bg-[#213D77] hover:bg-[#182F5D] text-white text-xs font-bold rounded"
            >
              {isHi ? 'अन्य काउंटर टिकट रद्द करें' : 'Cancel Another Counter Ticket'}
            </button>
          </div>
        </div>
      )}

      {/* Official PRS Counter Rules */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-5">
        <h3 className="text-xs font-bold text-[#213D77] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-[#213D77]" />
          {isHi ? 'काउंटर टिकट रद्दीकरण दिशानिर्देश' : 'Important Terms for PRS Counter Ticket Cancellation'}
        </h3>
        <ul className="text-[11px] text-blue-950/90 space-y-1.5 list-disc pl-4">
          <li>
            {isHi
              ? 'केवल वे काउंटर टिकट ऑनलाइन रद्द हो सकते हैं जिनके लिए बुकिंग के समय वैध मोबाइल नंबर दिया गया था।'
              : 'Only counter tickets where a valid Indian mobile number was furnished at the counter requisition form can be cancelled online.'}
          </li>
          <li>
            {isHi
              ? 'रिफंड केवल रेलवे स्टेशन काउंटर पर मूल पेपर टिकट जमा करने पर ही नकद दिया जाएगा।'
              : 'Physical Ticket Required: Refund amount will be disbursed exclusively in cash across PRS counters upon physical surrender of the paper ticket.'}
          </li>
        </ul>
      </div>

      <div className="text-center pt-2">
        <Link href="/" className="text-xs font-bold text-[#213D77] hover:underline">
          {isHi ? '← मुख्य पृष्ठ पर वापस जाएं' : '← Back to Home Ticket Booking'}
        </Link>
      </div>
    </div>
  );
}

export default function CounterTicketCancellationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading Counter Cancellation...</div>}>
      <CounterTicketCancellationContent />
    </Suspense>
  );
}
