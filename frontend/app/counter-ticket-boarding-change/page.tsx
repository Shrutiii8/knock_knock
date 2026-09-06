'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Clock, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function CounterTicketBoardingChangeContent() {
  const { language } = useLanguage();
  const isHi = language === 'HI';

  const [pnr, setPnr] = useState('');
  const [trainNumber, setTrainNumber] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [step, setStep] = useState<'search' | 'select' | 'otp' | 'success'>('search');
  const [selectedStation, setSelectedStation] = useState('CNB - Kanpur Central');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const eligibleStations = [
    { code: 'CNB', name: 'Kanpur Central', arr: '21:30', dep: '21:35', day: 'Day 1' },
    { code: 'PRYJ', name: 'Prayagraj Jn', arr: '23:45', dep: '23:50', day: 'Day 1' },
    { code: 'DDU', name: 'Pt. Deen Dayal Upadhyaya Jn', arr: '02:00', dep: '02:10', day: 'Day 2' },
    { code: 'GAYA', name: 'Gaya Jn', arr: '04:30', dep: '04:35', day: 'Day 2' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnr.length !== 10) {
      setErrorMsg(isHi ? 'कृपया 10-अंकीय PNR दर्ज करें।' : 'Please enter a valid 10-digit PNR.');
      return;
    }
    setErrorMsg('');
    setStep('select');
  };

  const handleConfirmSelect = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#213D77] via-[#1F3768] to-[#122244] text-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-white/10 rounded-lg">
            <MapPin className="w-7 h-7 text-[#FB792B]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wide">
              {isHi ? 'काउंटर टिकट बोर्डिंग स्टेशन परिवर्तन' : 'Change Boarding Point for Counter Ticket'}
            </h1>
            <p className="text-xs text-blue-100 mt-0.5">
              {isHi
                ? 'चार्ट बनने से कम से कम 4 घंटे पहले अपने काउंटर टिकट का बोर्डिंग स्टेशन ऑनलाइन बदलें'
                : 'Modify your journey boarding station online up to 4 hours prior to chart preparation'}
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Search Form */}
      {step === 'search' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xs font-bold text-[#213D77] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
            {isHi ? 'काउंटर टिकट विवरण दर्ज करें' : 'Enter Paper PRS Ticket Credentials'}
          </h2>

          <form onSubmit={handleSearch} className="space-y-4">
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
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#FB792B] font-mono tracking-widest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? 'ट्रेन नंबर' : 'Train Number'} *
                </label>
                <input
                  type="text"
                  maxLength={5}
                  required
                  placeholder="e.g. 12302"
                  value={trainNumber}
                  onChange={(e) => setTrainNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#FB792B] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? 'कैप्चा कोड' : 'Captcha Code'} *
                </label>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-gray-100 border border-gray-300 rounded font-mono font-bold tracking-widest text-sm text-gray-800 select-none">
                    9M4W
                  </div>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    placeholder="9M4W"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#FB792B] uppercase tracking-widest"
                  />
                </div>
              </div>
            </div>

            {errorMsg && <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FB792B] hover:bg-[#e66c23] text-white text-xs font-bold rounded shadow-sm transition-colors cursor-pointer"
              >
                {isHi ? 'स्टेशन विकल्प देखें' : 'Fetch Eligible Boarding Stations'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 2: Select New Boarding Point */}
      {step === 'select' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-5">
          <div className="border-b border-gray-200 pb-3">
            <span className="text-[10px] font-bold text-gray-500">PNR: {pnr || '2345678901'}</span>
            <h3 className="font-bold text-base text-[#213D77]">12302 / HOWRAH RAJDHANI EXP</h3>
            <p className="text-xs text-gray-600">
              Original Route: <span className="font-semibold text-gray-900">NDLS (New Delhi)</span> → HWH (Howrah)
            </p>
          </div>

          <form onSubmit={handleConfirmSelect} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                {isHi ? 'नया बोर्डिंग स्टेशन चुनें' : 'Select New En-Route Boarding Station'} *
              </label>
              <div className="space-y-2">
                {eligibleStations.map((stn) => (
                  <label
                    key={stn.code}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedStation === `${stn.code} - ${stn.name}`
                        ? 'border-[#FB792B] bg-orange-50/50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="boardingStation"
                        value={`${stn.code} - ${stn.name}`}
                        checked={selectedStation === `${stn.code} - ${stn.name}`}
                        onChange={(e) => setSelectedStation(e.target.value)}
                        className="text-[#FB792B]"
                      />
                      <div>
                        <p className="text-xs font-bold text-gray-900">
                          {stn.name} ({stn.code})
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Arr: {stn.arr} | Dep: {stn.dep} ({stn.day})
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                      Eligible
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>
                {isHi
                  ? 'चेतावनी: एक बार बोर्डिंग स्टेशन बदल जाने के बाद, यात्री मूल स्टेशन से यात्रा करने का अधिकार खो देता है।'
                  : 'Important Rule: Once boarding point is changed, passenger forfeits the right to board the train from original boarding point.'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('search')}
                className="text-xs text-gray-600 hover:text-gray-900 underline cursor-pointer"
              >
                {isHi ? 'वापस जाएं' : 'Go Back'}
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FB792B] hover:bg-[#e66c23] text-white text-xs font-bold rounded shadow-sm transition-colors cursor-pointer"
              >
                {isHi ? 'पुष्टि हेतु OTP भेजें' : 'Proceed to OTP Verification'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: OTP */}
      {step === 'otp' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm max-w-md mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-[#213D77] flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">
            {isHi ? 'OTP दर्ज कर बोर्डिंग परिवर्तन सत्यापित करें' : 'Verify Mobile OTP'}
          </h3>
          <p className="text-xs text-gray-600">
            {isHi
              ? `बोर्डिंग स्टेशन को बदलकर ${selectedStation} करने के लिए मोबाइल OTP दर्ज करें (डेमो: 123456)`
              : `Enter the 6-digit OTP sent to the registered mobile to confirm new boarding point at ${selectedStation} (Demo: 123456)`}
          </p>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-36 mx-auto px-3 py-2 border border-gray-300 rounded text-center font-mono text-base tracking-widest focus:ring-1 focus:ring-[#FB792B]"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-[#213D77] hover:bg-[#182F5D] text-white text-xs font-bold rounded shadow-sm transition-colors cursor-pointer"
            >
              {isHi ? 'बोर्डिंग स्टेशन परिवर्तन पूर्ण करें' : 'Confirm Boarding Change'}
            </button>
          </form>
        </div>
      )}

      {/* Step 4: Success Confirmation */}
      {step === 'success' && (
        <div className="bg-white rounded-lg border border-green-200 p-8 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {isHi ? 'बोर्डिंग स्टेशन सफलतापूर्वक परिवर्तित हो गया!' : 'Boarding Point Successfully Changed!'}
          </h3>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            {isHi
              ? `आपका नया बोर्डिंग स्टेशन अब "${selectedStation}" है। नया चार्ट आरक्षण चार्टिंग प्रणाली में अद्यतित कर दिया गया है।`
              : `Your new boarding point is officially updated to "${selectedStation}". Ticket examiner charts have been synchronized.`}
          </p>

          <div className="pt-3">
            <button
              type="button"
              onClick={() => {
                setStep('search');
                setPnr('');
                setCaptcha('');
              }}
              className="px-5 py-2 bg-[#213D77] hover:bg-[#182F5D] text-white text-xs font-bold rounded"
            >
              {isHi ? 'अन्य टिकट का बोर्डिंग बदलें' : 'Change Another Ticket Boarding'}
            </button>
          </div>
        </div>
      )}

      {/* Policy Box */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-5">
        <h3 className="text-xs font-bold text-[#213D77] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-[#213D77]" />
          {isHi ? 'बोर्डिंग स्टेशन परिवर्तन नियम' : 'Official Boarding Point Modification Rules'}
        </h3>
        <ul className="text-[11px] text-blue-950/90 space-y-1.5 list-disc pl-4">
          <li>
            {isHi
              ? 'एकमुश्त सुविधा: बोर्डिंग स्टेशन पूरे यात्रा आरक्षण में केवल एक बार ही बदला जा सकता है।'
              : 'One-Time Modification: Boarding point change is permitted only once per ticket reservation.'}
          </li>
          <li>
            {isHi
              ? 'समय सीमा: ट्रेन चार्ट बनने से कम से कम 4 घंटे पहले तक ही बोर्डिंग बिंदु में बदलाव संभव है।'
              : 'Time Limit: Request must be submitted at least 4 hours prior to the scheduled departure / chart preparation of the train.'}
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

export default function CounterTicketBoardingChangePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading Boarding Point Modification...</div>}>
      <CounterTicketBoardingChangeContent />
    </Suspense>
  );
}
