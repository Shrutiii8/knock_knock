'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { Luggage, Scale, ShieldCheck, AlertCircle, Calculator, CheckCircle2, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function LuggageBookingContent() {
  const { language } = useLanguage();
  const isHi = language === 'HI';

  const [pnr, setPnr] = useState('');
  const [travelClass, setTravelClass] = useState('3A');
  const [totalWeight, setTotalWeight] = useState(65);
  const [distanceKm, setDistanceKm] = useState(1400);
  const [isCalculated, setIsCalculated] = useState(false);
  const [booked, setBooked] = useState(false);

  // Free allowances (in kg)
  const freeAllowances: Record<string, number> = {
    '1A': 70,
    '2A': 50,
    '3A': 40,
    'CC': 40,
    'SL': 40,
    '2S': 35
  };

  const freeLimit = freeAllowances[travelClass] || 40;
  const excessWeight = Math.max(0, totalWeight - freeLimit);
  // Scale rates: ~₹3.5 per kg per 500km
  const estimatedRate = excessWeight > 0 ? Math.round(excessWeight * (distanceKm / 500) * 35) : 0;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculated(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#213D77] to-[#1B3260] text-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-white/10 rounded-lg">
            <Luggage className="w-7 h-7 text-[#FB792B]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wide">
              {isHi ? 'सामान (लगेज) एवं पार्सल अग्रिम बुकिंग' : 'Advance Luggage & Excess Baggage Booking'}
            </h1>
            <p className="text-xs text-blue-100 mt-0.5">
              {isHi
                ? 'निःशुल्क सीमा से अधिक सामान की ऑनलाइन अग्रिम बुकिंग करें और स्टेशन पर 6 गुना जुर्माने से बचें'
                : 'Pre-book excess baggage in advance to avoid 6x penal freight charges during platform inspection'}
            </p>
          </div>
        </div>
      </div>

      {/* Free Allowance Matrix Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <h2 className="text-xs font-bold text-[#213D77] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#FB792B]" />
          {isHi ? 'यात्रा श्रेणी अनुसार निःशुल्क सामान सीमा (Free Allowance Matrix)' : 'Indian Railways Free Baggage Allowances by Travel Class'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700 border-b border-gray-200">
                <th className="py-2 px-3 font-bold">Class of Travel</th>
                <th className="py-2 px-3 font-bold">Free Allowance (KG)</th>
                <th className="py-2 px-3 font-bold">Marginal Allowance</th>
                <th className="py-2 px-3 font-bold">Max Weight in Compartment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600">
              <tr>
                <td className="py-2 px-3 font-semibold text-gray-900">AC First Class (1A / Executive)</td>
                <td className="py-2 px-3 text-green-700 font-bold">70 KG</td>
                <td className="py-2 px-3">15 KG</td>
                <td className="py-2 px-3 font-mono">150 KG</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-gray-900">AC 2-Tier (2A / First Class)</td>
                <td className="py-2 px-3 text-green-700 font-bold">50 KG</td>
                <td className="py-2 px-3">10 KG</td>
                <td className="py-2 px-3 font-mono">100 KG</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-gray-900">AC 3-Tier (3A / 3E) & Chair Car (CC)</td>
                <td className="py-2 px-3 text-green-700 font-bold">40 KG</td>
                <td className="py-2 px-3">10 KG</td>
                <td className="py-2 px-3 font-mono">40 KG</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-gray-900">Sleeper Class (SL)</td>
                <td className="py-2 px-3 text-green-700 font-bold">40 KG</td>
                <td className="py-2 px-3">10 KG</td>
                <td className="py-2 px-3 font-mono">80 KG</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-gray-900">Second Class (2S)</td>
                <td className="py-2 px-3 text-green-700 font-bold">35 KG</td>
                <td className="py-2 px-3">10 KG</td>
                <td className="py-2 px-3 font-mono">70 KG</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Luggage Booking & Freight Calculator */}
      {!booked ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xs font-bold text-[#213D77] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#FB792B]" />
            {isHi ? 'अतिरिक्त सामान भाड़ा कैलकुलेटर एवं बुकिंग' : 'Excess Luggage Freight Estimator & Booking'}
          </h2>

          <form onSubmit={handleCalculate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? '10-अंकीय PNR (वैकल्पिक)' : '10-Digit PNR'}
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="e.g. 2345678901"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#FB792B] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? 'यात्रा श्रेणी (Class)' : 'Travel Class'} *
                </label>
                <select
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#FB792B]"
                >
                  <option value="1A">AC First Class (70 KG Free)</option>
                  <option value="2A">AC 2-Tier (50 KG Free)</option>
                  <option value="3A">AC 3-Tier (40 KG Free)</option>
                  <option value="CC">AC Chair Car (40 KG Free)</option>
                  <option value="SL">Sleeper Class (40 KG Free)</option>
                  <option value="2S">Second Class (35 KG Free)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? 'कुल सामान का वजन (KG)' : 'Total Luggage Weight (KG)'} *
                </label>
                <input
                  type="number"
                  min={1}
                  max={150}
                  value={totalWeight}
                  onChange={(e) => setTotalWeight(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#FB792B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? 'यात्रा दूरी (KM)' : 'Journey Distance (KM)'} *
                </label>
                <input
                  type="number"
                  min={50}
                  max={4000}
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(parseInt(e.target.value) || 500)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#FB792B]"
                />
              </div>
            </div>

            {/* Calculations Display */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Free Baggage Allowance for {travelClass}:</span>
                <span className="font-bold text-green-700">{freeLimit} KG</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Excess Chargeable Luggage Weight:</span>
                <span className="font-bold text-amber-700">{excessWeight} KG</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#213D77] pt-2 border-t border-gray-200">
                <span>Estimated Excess Luggage Advance Fee:</span>
                <span>{excessWeight > 0 ? `₹${estimatedRate}` : '₹0 (Within Free Limits)'}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setBooked(true)}
                className="px-6 py-2.5 bg-[#FB792B] hover:bg-[#e66c23] text-white text-xs font-bold rounded shadow-sm transition-colors cursor-pointer"
              >
                {isHi ? 'सामान बुकिंग रसीद जनरेट करें' : 'Generate Advance Luggage Receipt'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Booking Confirmation Receipt */
        <div className="bg-white rounded-lg border border-green-200 p-8 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {isHi ? 'सामान अग्रिम बुकिंग रसीद सफलतापूर्वक जनरेट हुई!' : 'Luggage Advance Booking Slip Generated!'}
          </h3>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            {isHi
              ? `लगेज टोकन संख्या: LUG-2026-87429। कृपया प्रस्थान से 30 मिनट पहले पार्सल/लगेज कार्यालय पर सामान की तुलाई करवा कर यह रसीद प्रस्तुत करें।`
              : `Luggage Token No: LUG-2026-87429. Total Charge: ₹${estimatedRate}. Present this digital receipt at the Parcel Weighment Office 30 minutes before departure.`}
          </p>

          <div className="pt-3">
            <button
              type="button"
              onClick={() => setBooked(false)}
              className="px-5 py-2 bg-[#213D77] hover:bg-[#182F5D] text-white text-xs font-bold rounded"
            >
              {isHi ? 'दूसरा सामान बुक करें' : 'Book Another Luggage'}
            </button>
          </div>
        </div>
      )}

      {/* Guidelines */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-5">
        <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-700" />
          {isHi ? 'सामान ले जाने संबंधी महत्वपूर्ण सावधानियां' : 'Prohibited & Dangerous Goods Warning'}
        </h3>
        <ul className="text-[11px] text-amber-950/90 space-y-1.5 list-disc pl-4">
          <li>
            {isHi
              ? 'ज्वलनशील पदार्थ (गैस सिलेंडर, पटाखे, पेट्रोल, एसिड) ट्रेन में ले जाना गैर-कानूनी और दंडनीय अपराध है।'
              : 'Strict Prohibition: Carrying inflammable goods (gas cylinders, crackers, petrol, acid) is a cognizable offence under Section 164 of the Railways Act.'}
          </li>
          <li>
            {isHi
              ? 'स्कूटर/मोटरसाइकिल: दोपहिया वाहनों को केवल पार्सल वैन में पूरी तरह से पेट्रोल खाली करवाकर ही बुक कराया जा सकता है।'
              : 'Two-Wheelers & Scooters: Must have petrol tank completely emptied before parcel registration in brake vans.'}
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

export default function LuggageBookingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading Luggage Booking...</div>}>
      <LuggageBookingContent />
    </Suspense>
  );
}
