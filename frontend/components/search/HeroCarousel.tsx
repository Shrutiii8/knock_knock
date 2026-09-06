'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Train, Utensils, Compass } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    badge: 'NEW GENERATION',
    title: 'Experience Vande Bharat Express',
    subtitle: '160 km/h speed, panoramic windows, rotating executive seats & GPS passenger information.',
    icon: Train,
    cta: 'Explore Routes',
    bgGradient: 'from-[#0A3D62] via-[#164673] to-[#0D5287]',
    accentColor: 'text-cyan-300'
  },
  {
    id: 2,
    badge: 'RELIGIOUS TOURISM',
    title: 'Bharat Gaurav Tourist Circuit',
    subtitle: 'All-inclusive spiritual pilgrimages covering Ayodhya Dham, Varanasi, Puri & Rameswaram.',
    icon: Compass,
    cta: 'View Packages',
    bgGradient: 'from-[#6E2A0C] via-[#943D15] to-[#BF5318]',
    accentColor: 'text-amber-300'
  },
  {
    id: 3,
    badge: 'E-CATERING SERVICE',
    title: 'Food on Track: Deliver to Seat',
    subtitle: 'Order delicious meals from 500+ top FSSAI approved restaurants straight to your train berth.',
    icon: Utensils,
    cta: 'Order Food',
    bgGradient: 'from-[#1B4D3E] via-[#246A55] to-[#2E856B]',
    accentColor: 'text-emerald-300'
  },
  {
    id: 4,
    badge: 'LUXURY HERITAGE',
    title: "Maharajas' Express Royal Sojourn",
    subtitle: "Experience royalty on India's most opulent luxury tourist train across Golden Triangle & Rajasthan.",
    icon: Sparkles,
    cta: 'Discover Royalty',
    bgGradient: 'from-[#4A154B] via-[#611F69] to-[#7B2884]',
    accentColor: 'text-fuchsia-300'
  }
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % BANNERS.length);
  };

  const current = BANNERS[currentIndex];
  const Icon = current.icon;

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
      {/* Banner Card */}
      <div className={`bg-gradient-to-r ${current.bgGradient} text-white p-6 sm:p-8 min-h-[190px] sm:min-h-[220px] flex flex-col justify-between transition-all duration-500`}>
        <div className="flex items-start justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-amber-300 border border-white/10 mb-2.5">
              <Icon className="w-3.5 h-3.5" />
              <span>{current.badge}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2 leading-tight">
              {current.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-lg">
              {current.subtitle}
            </p>
          </div>

          <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-full bg-white/10 border border-white/20 backdrop-blur-xs shadow-inner">
            <Icon className={`w-12 h-12 ${current.accentColor}`} />
          </div>
        </div>

        {/* Action & Indicators */}
        <div className="mt-4 flex items-center justify-between">
          <button className="bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs px-4 py-2 rounded uppercase tracking-wider transition-all shadow hover:shadow-md">
            {current.cta}
          </button>

          {/* Indicator Dots */}
          <div className="flex items-center space-x-2">
            {BANNERS.map((banner, index) => (
              <button
                key={banner.id}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-6 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Prev / Next Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white/90 transition-colors backdrop-blur-xs"
        aria-label="Previous banner"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white/90 transition-colors backdrop-blur-xs"
        aria-label="Next banner"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
