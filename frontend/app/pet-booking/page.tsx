'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { HeartHandshake, ShieldCheck, AlertCircle, FileCheck, CheckCircle2, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function PetBookingContent() {
  const { language } = useLanguage();
  const isHi = language === 'HI';

  const [petType, setPetType] = useState('dog');
  const [breed, setBreed] = useState('Golden Retriever');
  const [petAge, setPetAge] = useState('3');
  const [pnr, setPnr] = useState('');
  const [bookingMode, setBookingMode] = useState<'coupe' | 'dogbox'>('coupe');
  const [hasVetCert, setHasVetCert] = useState(false);
  const [booked, setBooked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasVetCert) {
      alert(
        isHi
          ? 'कृपया पशु चिकित्सक स्वास्थ्य प्रमाण पत्र की पुष्टि करें।'
          : 'Please confirm possession of a valid Veterinary Health & Vaccination Certificate.'
      );
      return;
    }
    setBooked(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#213D77] to-[#1C356C] text-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-white/10 rounded-lg">
            <span className="text-2xl">🐕</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wide">
              {isHi ? 'कुत्ते / बिल्ली (पालतू पशु) बुकिंग पोर्टल' : 'Dogs & Cats (Pet Travel) Booking Portal'}
            </h1>
            <p className="text-xs text-blue-100 mt-0.5">
              {isHi
                ? 'प्रथम श्रेणी वातानुकूलित (1st AC Coupe) या ब्रेक वैन डॉग-बॉक्स में अपने पालतू पशुओं के साथ यात्रा करें'
                : 'Travel with your beloved pets in AC First Class (1A Coupe/Cabin) or Brake Van Dog Box'}
            </p>
          </div>
        </div>
      </div>

      {/* Booking Modes Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => setBookingMode('coupe')}
          className={`p-5 rounded-lg border-2 cursor-pointer transition-all ${
            bookingMode === 'coupe'
              ? 'border-[#FB792B] bg-orange-50/40'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#213D77]">
              {isHi ? '1st AC कूपे / केबिन (यात्री के साथ)' : '1st AC Coupe / Cabin (With Passenger)'}
            </h3>
            <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded">RECOMMENDED</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {isHi
              ? 'पूरा 2-बर्थ कूपे या 4-बर्थ केबिन एक ही PNR पर बुक होना चाहिए। पालतू पशु आपके साथ कोच में रहेगा।'
              : 'Entire 2-berth Coupe or 4-berth Cabin must be booked under single PNR. Pet travels inside compartment with you.'}
          </p>
          <p className="text-xs font-bold text-gray-800 mt-3">Tariff: Luggage Scale Rate (~₹400 - ₹600)</p>
        </div>

        <div
          onClick={() => setBookingMode('dogbox')}
          className={`p-5 rounded-lg border-2 cursor-pointer transition-all ${
            bookingMode === 'dogbox'
              ? 'border-[#FB792B] bg-orange-50/40'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-800">
              {isHi ? 'एसएलआर ब्रेक वैन डॉग-बॉक्स (गार्ड वैन)' : 'Brake Van Dog Box (SLR Guard Van)'}
            </h3>
            <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">ECONOMY</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {isHi
              ? 'ट्रेन के गार्ड डिब्बे (SLR) में विशेष वेंटिलेटेड डॉग बॉक्स। आप किसी भी श्रेणी (2A, 3A, SL) में यात्रा कर सकते हैं।'
              : 'Specially ventilated secure steel dog-box located in the Guard Brake Van (SLR). Passenger can travel in any class.'}
          </p>
          <p className="text-xs font-bold text-gray-800 mt-3">Tariff: Scale L Freight Rate (~₹120 - ₹250)</p>
        </div>
      </div>

      {/* Booking Form */}
      {!booked ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xs font-bold text-[#213D77] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-[#FB792B]" />
            {isHi ? 'पालतू पशु विवरण एवं यात्रा आरक्षण' : 'Pet Details & Reservation Form'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? 'पालतू पशु का प्रकार' : 'Pet Category'} *
                </label>
                <select
                  value={petType}
                  onChange={(e) => setPetType(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#FB792B]"
                >
                  <option value="dog">{isHi ? 'कुत्ता (Dog)' : 'Dog'}</option>
                  <option value="cat">{isHi ? 'बिल्ली (Cat)' : 'Cat'}</option>
                  <option value="bird">{isHi ? 'पक्षी (Bird in Cage)' : 'Pet Bird (In Secure Cage)'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? 'प्रजाति (Breed)' : 'Breed / Description'} *
                </label>
                <input
                  type="text"
                  required
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#FB792B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? 'आयु (वर्ष)' : 'Pet Age (Years)'} *
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={petAge}
                  onChange={(e) => setPetAge(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#FB792B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? 'पुष्ट यात्रा का 10-अंकीय PNR' : '10-Digit Confirmed Travel PNR'} *
                </label>
                <input
                  type="text"
                  maxLength={10}
                  required
                  placeholder="e.g. 2345678901"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#FB792B] font-mono tracking-wider"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHi ? 'यात्रा का माध्यम (Selected Mode)' : 'Travel Arrangement'}
                </label>
                <input
                  type="text"
                  disabled
                  value={
                    bookingMode === 'coupe'
                      ? 'AC First Class Coupe/Cabin'
                      : 'Brake Van Dog Box (SLR)'
                  }
                  className="w-full px-3 py-2 text-xs border border-gray-200 bg-gray-50 rounded text-gray-700 font-semibold"
                />
              </div>
            </div>

            {/* Mandatory Veterinary Declaration */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 p-3 rounded-lg border border-blue-200 bg-blue-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasVetCert}
                  onChange={(e) => setHasVetCert(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-[#FB792B] rounded"
                />
                <span className="text-xs text-blue-950 leading-relaxed">
                  <strong>{isHi ? 'पशु चिकित्सक घोषणा:' : 'Veterinary Health Declaration:'}</strong>{' '}
                  {isHi
                    ? 'मैं पुष्टि करता/करती हूँ कि मेरे पास यात्रा से 24-48 घंटे पूर्व अधिकृत पशु चिकित्सक द्वारा जारी वैध स्वास्थ्य, रेबीज टीकाकरण एवं फिटनेस प्रमाण पत्र है।'
                    : 'I certify that my pet is vaccinated against rabies and I possess a valid Veterinary Doctor Health Certificate issued within 24-48 hours before train departure.'}
                </span>
              </label>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FB792B] hover:bg-[#e66c23] text-white text-xs font-bold rounded shadow-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>{isHi ? 'पालतू टिकट आरक्षित करें' : 'Generate Pet Boarding Pass'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Confirmation Receipt */
        <div className="bg-white rounded-lg border border-green-200 p-8 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {isHi ? 'पालतू पशु यात्रा रसीद सफलतापूर्वक दर्ज!' : 'Pet Travel Token Generated!'}
          </h3>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            {isHi
              ? `पालतू टोकन: PET-2026-64218। कृपया प्रस्थान से 1 घंटा पहले स्टेशन के पार्सल कार्यालय पर अपने पालतू को ले जाकर भौतिक वजन एवं टिकट स्टैंप करवाएं।`
              : `Token: PET-2026-64218 for ${breed} (${petType}). Present this digital token with your Veterinary Certificate at the Station Parcel Office 1 hour before train departure.`}
          </p>

          <div className="pt-3">
            <button
              type="button"
              onClick={() => setBooked(false)}
              className="px-5 py-2 bg-[#213D77] hover:bg-[#182F5D] text-white text-xs font-bold rounded"
            >
              {isHi ? 'अन्य पालतू बुक करें' : 'Book Another Pet'}
            </button>
          </div>
        </div>
      )}

      {/* Rules Notice */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-5">
        <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-amber-700" />
          {isHi ? 'भारतीय रेल पालतू पशु यात्रा नियम' : 'Indian Railways Pet Carriage Guidelines'}
        </h3>
        <ul className="text-[11px] text-amber-950/90 space-y-1.5 list-disc pl-4">
          <li>
            {isHi
              ? 'सह-यात्रियों की सहमति: यदि कूपे में अन्य यात्री आपत्ति जताते हैं, तो पालतू को तुरंत गार्ड के डॉग-बॉक्स में स्थानांतरित किया जाएगा।'
              : 'Co-Passenger Consideration: If co-passengers object to the presence of the pet in AC First Class, the pet will be shifted to the Brake Van Dog Box immediately without refund.'}
          </li>
          <li>
            {isHi
              ? 'भोजन एवं पानी: रास्ते में पालतू के भोजन एवं पानी का प्रबंध पूरी तरह स्वामी का उत्तरदायित्व होगा।'
              : 'Pet Feed & Water: The passenger is entirely responsible for feeding and watering their pet during halts.'}
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

export default function PetBookingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading Pet Booking...</div>}>
      <PetBookingContent />
    </Suspense>
  );
}
