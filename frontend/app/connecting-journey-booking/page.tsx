'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { GitCommit, ArrowRight, ShieldCheck, AlertCircle, Clock, Search, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function ConnectingJourneyContent() {
  const { language } = useLanguage();
  const isHi = language === 'HI';

  const [leg1Pnr, setLeg1Pnr] = useState('');
  const [fromStation, setFromStation] = useState('GHY - Guwahati');
  const [transitStation, setTransitStation] = useState('HWH - Howrah Jn');
  const [destStation, setDestStation] = useState('MAS - MGR Chennai Central');
  const [travelDate, setTravelDate] = useState('2026-09-20');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#213D77] to-[#1C356C] text-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-white/10 rounded-lg">
            <GitCommit className="w-7 h-7 text-[#FB792B]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wide">
              {isHi ? 'कनेक्टिंग यात्रा बुकिंग (Connecting Journey)' : 'Connecting Journey Booking'}
            </h1>
            <p className="text-xs text-blue-100 mt-0.5">
              {isHi
                ? 'दो अलग-अलग ट्रेनों की यात्रा को एक साथ जोड़ें — पहली ट्रेन लेट होने पर दूसरी ट्रेन का पूरा रिफंड'
                : 'Link two connecting train journeys — Full refund on onward journey if primary train is delayed'}
            </p>
          </div>
        </div>
      </div>

      {/* Linking Mode Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option A: Link Existing First PNR */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#213D77] uppercase tracking-wider mb-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#213D77] flex items-center justify-center text-[10px]">1</span>
              {isHi ? 'विकल्प 1: पहला PNR लिंक करें' : 'Option A: Link Existing First Journey PNR'}
            </div>
            <p className="text-xs text-gray-600 mb-4">
              {isHi
                ? 'यदि आपने पहली यात्रा का टिकट पहले ही बुक कर लिया है, तो उसका 10-अंकीय PNR दर्ज करें और आगे की ट्रेन बुक करें।'
                : 'If you already booked Leg 1, enter your 10-digit PNR to link and reserve your onward connecting journey.'}
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? 'प्रथम यात्रा का 10-अंकीय PNR' : '10-Digit Primary Leg PNR'} *
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="e.g. 2345678901"
                  value={leg1Pnr}
                  onChange={(e) => setLeg1Pnr(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#FB792B] focus:border-[#FB792B] font-mono tracking-widest text-sm"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (leg1Pnr.length !== 10) {
                alert(isHi ? 'कृपया वैध 10-अंकीय PNR दर्ज करें।' : 'Please enter a valid 10-digit PNR.');
                return;
              }
              setHasSearched(true);
            }}
            className="mt-5 w-full py-2 bg-[#213D77] hover:bg-[#182F5D] text-white text-xs font-bold rounded transition-colors shadow-sm cursor-pointer"
          >
            {isHi ? 'PNR सत्यापित करें एवं कनेक्टिंग ट्रेन खोजें' : 'Validate PNR & Find Connecting Leg'}
          </button>
        </div>

        {/* Option B: Search New Connecting Pair */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#FB792B] uppercase tracking-wider mb-2">
              <span className="w-5 h-5 rounded-full bg-orange-100 text-[#FB792B] flex items-center justify-center text-[10px]">2</span>
              {isHi ? 'विकल्प 2: दोनों ट्रेनों की संयुक्त खोज' : 'Option B: Plan Complete Multi-Leg Journey'}
            </div>
            <p className="text-xs text-gray-600 mb-3">
              {isHi
                ? 'प्रस्थान, जंक्शन ट्रांजिट स्टेशन और अंतिम गंतव्य चुनें ताकि उचित लेओवर समय के साथ दोनों ट्रेनें मिलें।'
                : 'Select source, transit junction, and destination station to search synchronized train pairs.'}
            </p>

            <form onSubmit={handleSearch} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                    {isHi ? 'प्रस्थान स्टेशन' : 'Origin'}
                  </label>
                  <input
                    type="text"
                    value={fromStation}
                    onChange={(e) => setFromStation(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:border-[#FB792B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                    {isHi ? 'ट्रांजिट स्टेशन' : 'Transit Junction'}
                  </label>
                  <input
                    type="text"
                    value={transitStation}
                    onChange={(e) => setTransitStation(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:border-[#FB792B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                    {isHi ? 'अंतिम गंतव्य' : 'Final Destination'}
                  </label>
                  <input
                    type="text"
                    value={destStation}
                    onChange={(e) => setDestStation(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:border-[#FB792B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                    {isHi ? 'यात्रा तिथि' : 'Travel Date'}
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:border-[#FB792B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#FB792B] hover:bg-[#e66c23] text-white text-xs font-bold rounded transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <Search className="w-3.5 h-3.5" />
                {isHi ? 'कनेक्टिंग ट्रेनें खोजें' : 'Search Connecting Routes'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Suggested Connection Result */}
      {hasSearched && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                Synchronized Connection Found
              </span>
              <h3 className="font-bold text-sm text-[#213D77] mt-1">
                Guwahati (GHY) → Howrah (HWH) → Chennai Central (MAS)
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">Layover Buffer:</span>
              <p className="text-xs font-bold text-blue-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 3 hrs 25 mins
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Leg 1 Card */}
            <div className="border border-blue-200 bg-blue-50/40 rounded-lg p-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                Leg 1: Primary Journey
              </span>
              <h4 className="font-bold text-xs text-gray-900 mt-2">12346 / SARAIGHAT EXP</h4>
              <p className="text-xs text-gray-600 mt-1">GHY 12:20 PM → HWH 05:15 AM (+1 day)</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-green-700 font-semibold">AVAILABLE - 3A (28)</span>
                <span className="font-bold text-gray-800">₹1,430</span>
              </div>
            </div>

            {/* Leg 2 Card */}
            <div className="border border-orange-200 bg-orange-50/40 rounded-lg p-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-800 bg-orange-100 px-2 py-0.5 rounded">
                Leg 2: Connected Onward
              </span>
              <h4 className="font-bold text-xs text-gray-900 mt-2">12841 / COROMANDEL EXP</h4>
              <p className="text-xs text-gray-600 mt-1">HWH 08:40 AM → MAS 05:00 PM (+1 day)</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-green-700 font-semibold">AVAILABLE - 3A (42)</span>
                <span className="font-bold text-gray-800">₹1,820</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
            <span className="text-xs text-gray-600">
              Total Combined Fare: <strong className="text-gray-900 text-sm">₹3,250</strong>
            </span>
            <button
              type="button"
              onClick={() => alert('Proceeding to Passenger details with linked PNR protection.')}
              className="px-6 py-2 bg-[#FB792B] hover:bg-[#e66c23] text-white text-xs font-bold rounded shadow-sm cursor-pointer"
            >
              {isHi ? 'दोनों यात्राएं एक साथ बुक करें' : 'Book Linked Journey Both Legs'}
            </button>
          </div>
        </div>
      )}

      {/* Official Railway Linking Rules */}
      <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-5">
        <h3 className="text-xs font-bold text-[#213D77] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-[#213D77]" />
          {isHi ? 'कनेक्टिंग यात्रा रिफंड एवं लिंकिंग नियम' : 'Official Connecting Journey & Refund Rules'}
        </h3>
        <ul className="text-[11px] text-blue-950/90 space-y-1.5 list-disc pl-4">
          <li>
            {isHi
              ? 'ट्रेन देरी पर पूर्ण रिफंड: यदि पहली ट्रेन 3 घंटे या अधिक देरी से पहुंचती है और कनेक्टिंग ट्रेन छूट जाती है, तो कनेक्टिंग टिकट पर कोई रद्दीकरण शुल्क नहीं काटा जाएगा और 100% रिफंड मिलेगा।'
              : 'Full Refund on Missed Connection: If the primary train is delayed by >3 hours and passenger misses the onward connecting train, full refund without clerkage/cancellation charge is granted.'}
          </li>
          <li>
            {isHi
              ? 'यात्री विवरण की समानता: दोनों टिकटों में मुख्य यात्री का नाम, आयु और लिंग बिल्कुल एक समान होना अनिवार्य है।'
              : 'Exact Passenger Match: Passenger details (Name, Age, Gender) on both PNRs must be identical for linking eligibility.'}
          </li>
          <li>
            {isHi
              ? 'स्टेशन निकटता: पहली ट्रेन का आगमन स्टेशन और दूसरी ट्रेन का प्रस्थान स्टेशन एक ही होना चाहिए या एक ही ट्विन-सिटी क्लस्टर के तहत होना चाहिए।'
              : 'Station Proximity: The destination station of Leg 1 and source station of Leg 2 must be the same or within defined railway city clusters.'}
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

export default function ConnectingJourneyBookingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading Connecting Journey Booking...</div>}>
      <ConnectingJourneyContent />
    </Suspense>
  );
}
