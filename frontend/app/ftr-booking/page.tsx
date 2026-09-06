'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { Train, Users, ShieldCheck, Building2, Calendar, Calculator, CheckCircle2, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function FtrBookingContent() {
  const { language } = useLanguage();
  const isHi = language === 'HI';

  const [bookingType, setBookingType] = useState<'coach' | 'train'>('coach');
  const [purpose, setPurpose] = useState('marriage');
  const [coachClass, setCoachClass] = useState('3A');
  const [coachCount, setCoachCount] = useState(1);
  const [fromStation, setFromStation] = useState('NDLS - New Delhi');
  const [toStation, setToStation] = useState('JP - Jaipur Jn');
  const [journeyDate, setJourneyDate] = useState('2026-11-20');
  const [submitted, setSubmitted] = useState(false);

  // Security Deposit: ₹50,000 per coach on FTR
  const depositPerCoach = 50000;
  const totalDeposit = bookingType === 'coach' ? coachCount * depositPerCoach : 18 * depositPerCoach;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#213D77] via-[#1A315F] to-[#0A1A36] text-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-white/10 rounded-lg">
            <Users className="w-7 h-7 text-[#FB792B]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wide">
              {isHi ? 'फुल टैरिफ रेट (FTR) कोच / ट्रेन चार्टर बुकिंग' : 'Full Tariff Rate (FTR) Coach & Special Train Charter'}
            </h1>
            <p className="text-xs text-blue-100 mt-0.5">
              {isHi
                ? 'विवाह बारात, शैक्षिक भ्रमण, कॉर्पोरेट प्रतिनिधिमंडल एवं धार्मिक यात्राओं के लिए संपूर्ण कोच या विशेष ट्रेन आरक्षित करें'
                : 'Charter full railway coaches or entire special passenger trains on Full Tariff Rate for weddings, corporate, or tours'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Request Form */}
      {!submitted ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Booking Type Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                {isHi ? 'बुकिंग का प्रकार चुनें' : 'Select Charter Type'} *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => {
                    setBookingType('coach');
                    setCoachCount(1);
                  }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    bookingType === 'coach'
                      ? 'border-[#FB792B] bg-orange-50/40 text-[#213D77]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Train className="w-5 h-5 text-[#FB792B]" />
                    <span>{isHi ? 'एक या अधिक व्यक्तिगत कोच (Single / Multi Coach)' : 'Single / Multi Dedicated Coach'}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {isHi
                      ? 'नियमित ट्रेन में 1 से 4 अतिरिक्त कोच जोड़ें। सुरक्षा जमा ₹50,000 प्रति कोच।'
                      : 'Attach 1 to 4 reserved coaches to an existing scheduled train. Deposit ₹50,000/coach.'}
                  </p>
                </div>

                <div
                  onClick={() => {
                    setBookingType('train');
                    setCoachCount(18);
                  }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    bookingType === 'train'
                      ? 'border-[#FB792B] bg-orange-50/40 text-[#213D77]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Building2 className="w-5 h-5 text-[#FB792B]" />
                    <span>{isHi ? 'संपूर्ण विशेष ट्रेन (Full Special Train Charter)' : 'Complete Special Train Charter'}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {isHi
                      ? 'कस्टम रूट एवं समय पर 18 से 24 कोचों की पूरी ट्रेन। सुरक्षा जमा ₹9,00,000 (18 कोच हेतु)।'
                      : 'Charter an entire customized train (18-24 coaches) with dedicated itinerary & stops.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Travel Purpose & Class */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? 'यात्रा का उद्देश्य' : 'Purpose of Travel'} *
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#FB792B]"
                >
                  <option value="marriage">{isHi ? 'विवाह बारात / शादी' : 'Wedding / Barat Movement'}</option>
                  <option value="education">{isHi ? 'स्कूल / कॉलेज शैक्षिक दौरा' : 'Educational / School Study Tour'}</option>
                  <option value="corporate">{isHi ? 'कॉर्पोरेट सम्मेलन / प्रतिनिधिमंडल' : 'Corporate / Official Delegation'}</option>
                  <option value="pilgrimage">{isHi ? 'धार्मिक तीर्थ यात्रा समूह' : 'Spiritual / Pilgrimage Group'}</option>
                  <option value="film">{isHi ? 'फिल्म / वृत्तचित्र शूटिंग' : 'Film / Commercial Shooting'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? 'कोच श्रेणी (Class)' : 'Coach Class'} *
                </label>
                <select
                  value={coachClass}
                  onChange={(e) => setCoachClass(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#FB792B]"
                >
                  <option value="1A">AC First Class (1A) - 24 Berths</option>
                  <option value="2A">AC 2-Tier (2A) - 48 Berths</option>
                  <option value="3A">AC 3-Tier (3A) - 64 Berths</option>
                  <option value="SL">Sleeper Class (SL) - 72 Berths</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? 'कोचों की संख्या' : 'Number of Coaches'} *
                </label>
                {bookingType === 'coach' ? (
                  <input
                    type="number"
                    min={1}
                    max={4}
                    value={coachCount}
                    onChange={(e) => setCoachCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#FB792B]"
                  />
                ) : (
                  <input
                    type="number"
                    min={18}
                    max={24}
                    value={coachCount}
                    onChange={(e) => setCoachCount(parseInt(e.target.value) || 18)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#FB792B]"
                  />
                )}
              </div>
            </div>

            {/* Route & Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? 'प्रस्थान स्टेशन' : 'Origin Station'} *
                </label>
                <input
                  type="text"
                  value={fromStation}
                  onChange={(e) => setFromStation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#FB792B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? 'गंतव्य स्टेशन' : 'Destination Station'} *
                </label>
                <input
                  type="text"
                  value={toStation}
                  onChange={(e) => setToStation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#FB792B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? 'प्रस्थान तिथि (कम से कम 30 दिन पूर्व)' : 'Departure Date (>30 Days Prior)'} *
                </label>
                <input
                  type="date"
                  value={journeyDate}
                  onChange={(e) => setJourneyDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#FB792B]"
                />
              </div>
            </div>

            {/* Deposit Summary Box */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <span className="text-xs text-gray-500">
                  {isHi ? 'अनिवार्य सुरक्षा जमा (रिफंडेबल):' : 'Mandatory Registration Security Deposit (Refundable):'}
                </span>
                <p className="text-lg font-black text-[#213D77]">
                  ₹{totalDeposit.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-normal text-gray-500">
                    ({coachCount} Coach{coachCount > 1 ? 'es' : ''} × ₹50,000)
                  </span>
                </p>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FB792B] hover:bg-[#e66c23] text-white text-xs font-bold rounded shadow-sm transition-colors cursor-pointer"
              >
                {isHi ? 'FTR चार्टर आवेदन सबमिट करें' : 'Submit FTR Charter Application'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Submitted Confirmation */
        <div className="bg-white rounded-lg border border-green-200 p-8 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {isHi ? 'FTR चार्टर आवेदन सफलतापूर्वक दर्ज किया गया!' : 'FTR Charter Application Registered!'}
          </h3>
          <p className="text-xs text-gray-600 max-w-lg mx-auto">
            {isHi
              ? `आपकी FTR संदर्भ संख्या FTR-2026-98124 है। मुख्य वाणिज्यिक प्रबंधक (CCM / CPTM) द्वारा परिचालन व्यवहार्यता की जांच के उपरांत 48 घंटे में संपर्क किया जाएगा।`
              : `Your FTR Reference Number is FTR-2026-98124. Chief Commercial Manager (CCM) office will review operational feasibility and send formal payment advice within 48 hours.`}
          </p>

          <div className="pt-3">
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="px-5 py-2 bg-[#213D77] hover:bg-[#182F5D] text-white text-xs font-bold rounded"
            >
              {isHi ? 'नया FTR आवेदन दर्ज करें' : 'Submit Another Request'}
            </button>
          </div>
        </div>
      )}

      {/* Guidelines Box */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-5">
        <h3 className="text-xs font-bold text-[#213D77] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-[#213D77]" />
          {isHi ? 'FTR बुकिंग महत्वपूर्ण नियम एवं शर्तें' : 'FTR Booking Important Rules & Timelines'}
        </h3>
        <ul className="text-[11px] text-blue-950 space-y-1.5 list-disc pl-4">
          <li>
            {isHi
              ? 'अग्रिम समय सीमा: यात्रा तिथि से कम से कम 30 दिन पहले और अधिकतम 6 माह पहले तक FTR आवेदन स्वीकार किया जाता है।'
              : 'Advance Booking Timeline: Applications must be lodged at least 30 days and up to 6 months prior to travel.'}
          </li>
          <li>
            {isHi
              ? 'सुरक्षा जमा: ₹50,000 प्रति कोच (रिफंडेबल यात्रा समाप्ति उपरांत बिना किसी क्षति के)।'
              : 'Registration Cum Security Deposit: ₹50,000 per coach, refundable post-journey completion subject to zero damage clearance.'}
          </li>
          <li>
            {isHi
              ? 'विशेष ट्रेन न्यूनतम संरचना: विशेष ट्रेन चार्टर के लिए न्यूनतम 18 कोच (जिसमें 2 एसएलआर शामिल) का किराया देय होता है।'
              : 'Minimum Train Composition: Full special train charters must have a minimum charge composition of 18 coaches including 2 SLRs.'}
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

export default function FtrBookingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading FTR Booking...</div>}>
      <FtrBookingContent />
    </Suspense>
  );
}
