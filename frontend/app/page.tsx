'use client';

import React from 'react';
import BookTicketHero from '@/components/search/BookTicketHero';
import ServicesCircleGrid from '@/components/search/ServicesCircleGrid';
import HolidaysSection from '@/components/search/HolidaysSection';
import { ShieldCheck, Award, CreditCard } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      
      {/* 1. Main Full-Screen Hero: Train background stretches edge-to-edge */}
      <BookTicketHero />

      {/* 2. 10 Circular Outlined Service Icons Section */}
      <div className="max-w-[1440px] mx-auto px-4">
        <ServicesCircleGrid />
      </div>

      {/* 3. Holidays Section matching user screenshot */}
      <div className="max-w-[1440px] mx-auto px-4">
        <HolidaysSection />
      </div>

      {/* 4. Trust & Safety Highlights */}
      <div className="max-w-[1440px] mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-blue-50 text-[#213D77] border border-blue-100 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 mb-1">{t('aadhaarTitle')}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {t('aadhaarDesc')}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-green-50 text-green-700 border border-green-100 flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 mb-1">{t('refundTitle')}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {t('refundDesc')}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 mb-1">{t('paymentTitle')}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {t('paymentDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
