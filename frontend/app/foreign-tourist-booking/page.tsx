'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { Globe, Plane, ShieldCheck, AlertCircle, Search, Calendar, User, CreditCard } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function ForeignTouristBookingContent() {
  const { language } = useLanguage();
  const isHi = language === 'HI';

  const [passport, setPassport] = useState('');
  const [country, setCountry] = useState('USA');
  const [fromStation, setFromStation] = useState('NDLS - New Delhi');
  const [toStation, setToStation] = useState('BCT - Mumbai Central');
  const [travelDate, setTravelDate] = useState('2026-10-15');
  const [travelClass, setTravelClass] = useState('1A');
  const [searched, setSearched] = useState(false);

  const countries = [
    { code: 'USA', name: 'United States of America' },
    { code: 'GBR', name: 'United Kingdom' },
    { code: 'CAN', name: 'Canada' },
    { code: 'AUS', name: 'Australia' },
    { code: 'DEU', name: 'Germany' },
    { code: 'FRA', name: 'France' },
    { code: 'JPN', name: 'Japan' },
    { code: 'SGP', name: 'Singapore' },
    { code: 'UAE', name: 'United Arab Emirates' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#213D77] to-[#1C356C] text-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-white/10 rounded-lg">
            <Globe className="w-7 h-7 text-[#FB792B]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wide">
              {isHi ? 'विदेशी पर्यटक कोटा बुकिंग (FTQ)' : 'Foreign Tourist Quota (FTQ) Booking'}
            </h1>
            <p className="text-xs text-blue-100 mt-0.5">
              {isHi
                ? 'विदेशी नागरिकों और अनिवासी भारतीयों (NRI) के लिए 365 दिन पहले तक अग्रिम आरक्षण की सुविधा'
                : '365 Days Advance Reservation Period (ARP) dedicated for Foreign Tourists and Non-Resident Indians (NRIs)'}
            </p>
          </div>
        </div>
      </div>

      {/* Booking Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-[#213D77] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
          <Plane className="w-4 h-4 text-[#FB792B]" />
          {isHi ? 'विदेशी यात्री विवरण एवं यात्रा खोज' : 'Foreign Passenger Details & Train Search'}
        </h2>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {isHi ? 'पासपोर्ट संख्या' : 'Passport Number'} *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. A12345678"
                  value={passport}
                  onChange={(e) => setPassport(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#FB792B] focus:border-[#FB792B] uppercase tracking-wider"
                />
                <User className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {isHi ? 'नागरिकता / देश' : 'Nationality / Country of Citizenship'} *
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#FB792B] focus:border-[#FB792B]"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {isHi ? 'प्रस्थान स्टेशन' : 'From Station'}
              </label>
              <input
                type="text"
                value={fromStation}
                onChange={(e) => setFromStation(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#FB792B] focus:border-[#FB792B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {isHi ? 'गंतव्य स्टेशन' : 'To Station'}
              </label>
              <input
                type="text"
                value={toStation}
                onChange={(e) => setToStation(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#FB792B] focus:border-[#FB792B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {isHi ? 'यात्रा तिथि (365 दिन तक)' : 'Journey Date (Up to 365 Days)'}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#FB792B] focus:border-[#FB792B]"
                />
                <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <CreditCard className="w-4 h-4 text-[#213D77]" />
              <span>
                {isHi
                  ? 'अंतर्राष्ट्रीय क्रेडिट/डेबिट कार्ड (Visa, Mastercard, Amex) स्वीकार्य हैं'
                  : 'International Cards accepted (Visa, Mastercard, Amex with 3D Secure)'}
              </span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#FB792B] hover:bg-[#e66c23] text-white font-bold text-xs rounded transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              {isHi ? 'उपलब्ध FTQ ट्रेनें खोजें' : 'Search FTQ Trains'}
            </button>
          </div>
        </form>
      </div>

      {/* Search Results Preview */}
      {searched && (
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-sm text-[#213D77]">12952 / TEJAS RAJDHANI EXP</h3>
              <p className="text-[11px] text-gray-500">NDLS (16:55) → BCT (08:35) | 15h 40m</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-green-50 border border-green-200 text-green-700 text-xs font-bold">
              FTQ Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="border border-[#213D77] rounded p-3 bg-blue-50/50">
              <div className="flex justify-between items-center text-xs font-bold text-[#213D77]">
                <span>Executive / 1A</span>
                <span>₹4,850 + $20 (FTQ Fee)</span>
              </div>
              <p className="text-[11px] text-green-600 font-semibold mt-1">AVAILABLE - 08 Seats</p>
              <button
                type="button"
                onClick={() => alert('Redirecting to secure Foreign Tourist Booking Gateway with verified Passport credentials.')}
                className="mt-3 w-full py-1.5 bg-[#213D77] hover:bg-[#182F5D] text-white text-[11px] font-bold rounded cursor-pointer transition-colors"
              >
                {isHi ? 'अभी बुक करें (FTQ)' : 'Book Now (FTQ)'}
              </button>
            </div>

            <div className="border border-gray-200 rounded p-3 hover:border-gray-300">
              <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                <span>2nd AC (2A)</span>
                <span>₹3,150 + $20 (FTQ Fee)</span>
              </div>
              <p className="text-[11px] text-green-600 font-semibold mt-1">AVAILABLE - 14 Seats</p>
              <button
                type="button"
                onClick={() => alert('Redirecting to secure Foreign Tourist Booking Gateway with verified Passport credentials.')}
                className="mt-3 w-full py-1.5 bg-[#FB792B] hover:bg-[#e66c23] text-white text-[11px] font-bold rounded cursor-pointer transition-colors"
              >
                {isHi ? 'अभी बुक करें (FTQ)' : 'Book Now (FTQ)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules & Guidelines */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-5">
        <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-700" />
          {isHi ? 'विदेशी पर्यटक कोटा (FTQ) दिशानिर्देश' : 'Foreign Tourist Quota (FTQ) Important Rules'}
        </h3>
        <ul className="text-[11px] text-amber-900/90 space-y-1.5 list-disc pl-4">
          <li>
            {isHi
              ? 'अग्रिम आरक्षण अवधि: विदेशी पर्यटकों और एनआरआई के लिए यात्रा तिथि से 365 दिन पहले तक।'
              : 'Advance Reservation Period: Up to 365 days prior to journey date for valid foreign passport and NRI passport holders.'}
          </li>
          <li>
            {isHi
              ? 'सत्यापन: यात्रा के दौरान वैध मूल पासपोर्ट और भारतीय वीजा / ओसीआई कार्ड साथ रखना अनिवार्य है।'
              : 'Mandatory Verification: Original valid Passport with Indian Visa / OCI card must be presented to ticket examiners during journey.'}
          </li>
          <li>
            {isHi
              ? 'पंजीकरण शुल्क: विदेशी उपयोगकर्ताओं के लिए मोबाइल/ईमेल सत्यापन हेतु ₹100 + जीएसटी का एकमुश्त पंजीकरण शुल्क लागू होता है।'
              : 'Registration Fee: A one-time International mobile verification registration fee of ₹100 + GST applies for foreign nationals.'}
          </li>
          <li>
            {isHi
              ? 'भुगतान: केवल अंतरराष्ट्रीय कार्ड (3डी सिक्योर अधिकृत) अथवा विदेशी नेटबैंकिंग से।'
              : 'Payment Gateway: International Credit/Debit cards processed securely through international multi-currency gateways.'}
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

export default function ForeignTouristBookingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading Foreign Tourist Booking...</div>}>
      <ForeignTouristBookingContent />
    </Suspense>
  );
}
