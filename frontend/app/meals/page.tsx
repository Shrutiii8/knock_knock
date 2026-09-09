'use client';

import React from 'react';
import Link from 'next/link';
import { UtensilsCrossed, Clock, ChevronRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function MealsPage() {
  const { language } = useLanguage();
  const isHi = language === 'HI';

  return (
    <div className="w-full bg-[#F4F7FB] py-8 sm:py-12 px-3 sm:px-6 min-h-[70vh]">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-[#213D77] transition-colors">
            {isHi ? 'होम' : 'Home'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[#213D77] font-semibold">
            {isHi ? 'भोजन (MEALS)' : 'MEALS'}
          </span>
        </div>

        {/* Page Container */}
        <div className="bg-white border border-gray-300 shadow-sm overflow-hidden">
          
          {/* Header Bar */}
          <div className="bg-[#02235E] text-white px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <UtensilsCrossed className="w-5 h-5 text-[#FB792B]" />
              <h1 className="text-sm sm:text-base font-bold tracking-tight">
                {isHi ? 'भोजन एवं ई-खानपान सेवाएं (e-Catering & Meals)' : 'e-Catering & Meal Services'}
              </h1>
            </div>
          </div>

          {/* Body with Work in Progress banner */}
          <div className="p-8 sm:p-14 text-center space-y-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-50 text-[#FB792B] rounded-full flex items-center justify-center mx-auto border-2 border-amber-200">
              <Clock className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <div className="inline-block bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                {isHi ? 'कार्य प्रगति पर है' : 'Work in Progress'}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                {isHi ? 'यह सेवा वर्तमान में निर्माणाधीन है' : 'Work in Progress'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {isHi
                  ? 'ऑनलाइन भोजन बुकिंग और ट्रेन सीट पर डिलीवरी की सुविधा जल्द ही शुरू होगी। हमारे साथ बने रहें!'
                  : 'Our e-Catering & train meal ordering platform is currently under active development. You will soon be able to book hot, hygienic meals delivered directly to your berth at upcoming stations!'}
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-6 py-2 text-xs sm:text-sm font-bold bg-[#FB792B] hover:bg-[#E65100] text-white rounded transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isHi ? 'मुख्य पृष्ठ पर वापस जाएं' : 'Back to Home'}</span>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
