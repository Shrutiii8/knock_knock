'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Plane, 
  Hotel, 
  TrendingUp, 
  UtensilsCrossed, 
  Bus, 
  Palmtree, 
  Train, 
  Mountain, 
  Sparkles, 
  Image as ImageIcon 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { TranslationKey } from '@/lib/translations';

interface ServiceItem {
  key: TranslationKey;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SERVICES_CIRCLES: ServiceItem[] = [
  { key: 'flights', href: '#flights', icon: Plane },
  { key: 'hotels', href: '#hotels', icon: Hotel },
  { key: 'railDrishti', href: '#rail-drishti', icon: TrendingUp },
  { key: 'eCatering', href: '#e-catering', icon: UtensilsCrossed },
  { key: 'bus', href: '#bus', icon: Bus },
  { key: 'holidayPackages', href: '#holidays', icon: Palmtree },
  { key: 'touristTrain', href: '#tourist-train', icon: Train },
  { key: 'hillRailways', href: '#hill-railways', icon: Mountain },
  { key: 'charterTrain', href: '#charter-train', icon: Sparkles },
  { key: 'gallery', href: '#gallery', icon: ImageIcon }
];

export default function ServicesCircleGrid() {
  const { t } = useLanguage();

  return (
    <div className="py-12 text-center select-none">
      
      {/* Title */}
      <h2 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight leading-tight">
        {t('notRightOne')}
      </h2>
      <p className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight leading-tight mt-1">
        {t('findSuitable')}
      </p>

      {/* Exactly 2 Rows of 5 Circular Outlined Icons as in Screenshot 2 */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-5 gap-x-6 sm:gap-x-12 gap-y-8 sm:gap-y-10 justify-center max-w-[960px] mx-auto px-4">
        {SERVICES_CIRCLES.map((svc) => {
          const Icon = svc.icon;
          return (
            <a
              key={svc.key}
              href={svc.href}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Thin outlined circle ~80px */}
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full border border-black flex items-center justify-center bg-white group-hover:border-[#FB792B] group-hover:scale-105 transition-all shadow-xs">
                <Icon className="w-8 h-8 text-black group-hover:text-[#FB792B] transition-colors stroke-[1.25]" />
              </div>
              
              {/* Label */}
              <span className="text-[11px] sm:text-xs font-bold text-gray-900 uppercase tracking-wider mt-3 text-center leading-tight group-hover:text-[#FB792B] transition-colors max-w-[100px]">
                {t(svc.key)}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
