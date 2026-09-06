'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Train, Zap, Award, Compass, ShieldCheck, ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function BrctcTrainsContent() {
  const { language } = useLanguage();
  const isHi = language === 'HI';

  const [activeTab, setActiveTab] = useState<'all' | 'vande' | 'tejas' | 'gaurav' | 'maharaja'>('all');

  const trainsList = [
    {
      id: 'vande-bharat',
      tab: 'vande',
      name: isHi ? 'वंदे भारत एक्सप्रेस' : 'Vande Bharat Express',
      tagline: isHi ? 'भारत की सेमी हाई-स्पीड प्रीमियम ट्रेन' : "India's Flagship Semi High-Speed Train",
      speed: '160 km/h',
      features: isHi
        ? ['कवच सुरक्षा प्रणाली', '180° घूमने वाली सीटें', 'स्वचालित स्लाइडिंग दरवाजे', 'हॉट ऑन-बोर्ड केटरिंग']
        : ['Kavach Anti-Collision Shield', '180° Revolving Executive Seats', 'Automated Plug Doors', 'Gourmet Regional Catering'],
      routes: ['New Delhi - Varanasi', 'New Delhi - SMVD Katra', 'Mumbai Central - Gandhinagar', 'Howrah - Puri'],
      badge: 'SPEED & COMFORT',
      badgeColor: 'bg-orange-500',
      heroImage: '/vande-bharat.png'
    },
    {
      id: 'tejas-express',
      tab: 'tejas',
      name: isHi ? 'तेजस एक्सप्रेस' : 'Tejas Express',
      tagline: isHi ? 'अत्याधुनिक स्मार्ट ट्रेन अनुभव' : 'Smart High-Speed Corporate Train Experience',
      speed: '130 km/h',
      features: isHi
        ? ['स्मार्ट ऑन-बोर्ड इंफोटेनमेंट', 'ट्रेन परिचारक सेवा', 'मुफ्त यात्रा बीमा', 'विलंब पर मुआवजा गारंटी']
        : ['Smart Seat Infotainment Screens', 'Train Hostess Hospitality', 'Complimentary ₹25L Travel Insurance', 'Delay Compensation Guarantee'],
      routes: ['Lucknow - New Delhi', 'Mumbai Central - Ahmedabad', 'Chennai Egmore - Madurai'],
      badge: 'SMART CORPORATE',
      badgeColor: 'bg-blue-600',
      heroImage: '/train-banner.jpg'
    },
    {
      id: 'bharat-gaurav',
      tab: 'gaurav',
      name: isHi ? 'भारत गौरव पर्यटक ट्रेनें' : 'Bharat Gaurav Tourist Trains',
      tagline: isHi ? 'देखो अपना देश — सांस्कृतिक एवं तीर्थ परिपथ' : 'Dekho Apna Desh — Cultural & Spiritual Rail Circuits',
      speed: '110 km/h',
      features: isHi
        ? ['सर्व-समावेशी टूर पैकेज', 'होटल एवं दर्शनीय स्थलों का भ्रमण', 'धार्मिक भजन एवं सुरक्षा गार्ड', 'शाकाहारी सात्विक भोजन']
        : ['All-Inclusive Tourist Packages', 'Hotel Stays & Monument Sightseeing', 'CCTV & Dedicated Tour Escorts', 'Pure Vegetarian Satvik Dining'],
      routes: ['Shri Ramayana Yatra', 'Jyotirlinga Darshan Circuit', 'Buddhist Circuit Tourist Train', 'Dakshin Bharat Yatra'],
      badge: 'CULTURAL HERITAGE',
      badgeColor: 'bg-amber-600',
      heroImage: '/international_buddha_1788635251750.jpg'
    },
    {
      id: 'maharajas-express',
      tab: 'maharaja',
      name: isHi ? 'महाराजा एक्सप्रेस' : "Maharajas' Express",
      tagline: isHi ? 'विश्व की अग्रणी विलासिता ट्रेन' : "World's Leading Ultra-Luxury Train",
      speed: '110 km/h',
      features: isHi
        ? ['प्रेसिडेंशियल सुइट एवं बटलर सेवा', 'मयूर महल एवं रंग महल फाइन डाइनिंग', 'शाही महल एवं सफारी अनुभव', 'विलासिता बार लाउंज']
        : ['Presidential Suite with Personal Butler', 'Mayur Mahal & Rang Mahal Fine Dining', 'Royal Palaces & Tiger Safaris', 'Rajah Club & Safari Bar Lounges'],
      routes: ['The Heritage of India (Mumbai-Delhi)', 'Treasures of India (Delhi-Agra-Ranthambore)', 'The Indian Panorama'],
      badge: 'ROYAL LUXURY',
      badgeColor: 'bg-purple-700',
      heroImage: '/maharajas_express_1788635193787.jpg'
    }
  ];

  const filteredTrains = activeTab === 'all' ? trainsList : trainsList.filter(t => t.tab === activeTab);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#213D77] via-[#1C356C] to-[#0E1E40] text-white p-7 rounded-xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#FB792B] bg-white/10 px-3 py-1 rounded-full border border-[#FB792B]/40 inline-block mb-3">
            BRCTC FLAGSHIP FLEET
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isHi ? 'भारत रेलवे की प्रमुख एवं विशेष ट्रेनें' : 'Bharat Railways Premier & Heritage Fleet'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
            {isHi
              ? 'अत्याधुनिक हाई-स्पीड वंदे भारत से लेकर राजसी महाराजा एक्सप्रेस तक — भारतीय रेल की विश्वस्तरीय सेवा एवं सुविधा का अनुभव करें।'
              : 'From next-gen semi-high-speed Vande Bharat to the regal opulence of Maharajas Express — experience world-class rail transit across India.'}
          </p>
        </div>
      </div>

      {/* Filter Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200 text-xs font-bold scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-t-lg transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#213D77] text-white'
              : 'text-gray-600 hover:text-[#213D77] hover:bg-gray-100'
          }`}
        >
          {isHi ? 'सभी ट्रेनें (All Trains)' : 'All Fleet'}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('vande')}
          className={`px-4 py-2 rounded-t-lg transition-colors cursor-pointer ${
            activeTab === 'vande'
              ? 'bg-[#FB792B] text-white'
              : 'text-gray-600 hover:text-[#FB792B] hover:bg-gray-100'
          }`}
        >
          Vande Bharat Express
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tejas')}
          className={`px-4 py-2 rounded-t-lg transition-colors cursor-pointer ${
            activeTab === 'tejas'
              ? 'bg-[#213D77] text-white'
              : 'text-gray-600 hover:text-[#213D77] hover:bg-gray-100'
          }`}
        >
          Tejas Express
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gaurav')}
          className={`px-4 py-2 rounded-t-lg transition-colors cursor-pointer ${
            activeTab === 'gaurav'
              ? 'bg-amber-600 text-white'
              : 'text-gray-600 hover:text-amber-600 hover:bg-gray-100'
          }`}
        >
          Bharat Gaurav
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('maharaja')}
          className={`px-4 py-2 rounded-t-lg transition-colors cursor-pointer ${
            activeTab === 'maharaja'
              ? 'bg-purple-700 text-white'
              : 'text-gray-600 hover:text-purple-700 hover:bg-gray-100'
          }`}
        >
          Maharajas' Express
        </button>
      </div>

      {/* Train Cards Grid */}
      <div className="space-y-6">
        {filteredTrains.map((train) => (
          <div
            key={train.id}
            id={train.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-0"
          >
            {/* Visual Cover Column */}
            <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-blue-950 p-6 flex flex-col justify-between text-white relative min-h-[220px]">
              <div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded text-white ${train.badgeColor}`}>
                  {train.badge}
                </span>
                <h3 className="text-xl font-black mt-3">{train.name}</h3>
                <p className="text-xs text-blue-200 mt-1">{train.tagline}</p>
              </div>

              <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs">
                <span className="text-gray-300">Max Design Speed:</span>
                <span className="font-mono font-bold text-amber-300 text-sm">{train.speed}</span>
              </div>
            </div>

            {/* Content & Specifications Column */}
            <div className="lg:col-span-8 p-6 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-xs font-bold text-[#213D77] uppercase tracking-wider mb-2">
                  {isHi ? 'मुख्य विशेषताएं एवं ऑन-बोर्ड सुविधाएं' : 'Key Highlights & On-Board Experience'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {train.features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FB792B]" />
                  {isHi ? 'लोकप्रिय परिचालन मार्ग' : 'Popular Operating Routes'}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {train.routes.map((r, idx) => (
                    <span key={idx} className="text-[11px] bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md font-medium">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link
                  href={`/train-schedule?train=22436`}
                  className="text-xs text-[#213D77] font-bold hover:underline flex items-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5" />
                  {isHi ? 'ट्रेन समय सारणी एवं रूट मैप देखें' : 'View Timetable & Route Schedule'}
                </Link>

                <Link
                  href="/"
                  className="w-full sm:w-auto px-5 py-2 bg-[#FB792B] hover:bg-[#e66c23] text-white text-xs font-bold rounded shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>{isHi ? 'टिकट बुक करें' : 'Book Tickets Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-2">
        <Link href="/" className="text-xs font-bold text-[#213D77] hover:underline">
          {isHi ? '← मुख्य टिकट बुकिंग पृष्ठ पर वापस जाएं' : '← Back to Home Ticket Booking'}
        </Link>
      </div>
    </div>
  );
}

export default function BrctcTrainsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading BRCTC Trains Fleet...</div>}>
      <BrctcTrainsContent />
    </Suspense>
  );
}
