'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Sparkles, Building, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const OFFERS = [
  {
    id: 1,
    category: 'TOURISM PACKAGES',
    title: 'Divine Varanasi & Prayagraj Tour',
    duration: '4 Days / 3 Nights',
    price: '₹ 11,490',
    icon: Compass,
    color: 'from-amber-600 to-orange-700',
    description: 'Includes 3-star hotel stay, confirmed train transfers, VIP Darshan & guided sightseeing.'
  },
  {
    id: 2,
    category: 'LUXURY RAILS',
    title: 'Heritage of India - Maharajas',
    duration: '7 Days / 6 Nights',
    price: '₹ 3,45,000',
    icon: Sparkles,
    color: 'from-purple-800 to-indigo-900',
    description: 'World-renowned royal journey through Delhi, Agra, Ranthambore, Jaipur, Bikaner & Mumbai.'
  },
  {
    id: 3,
    category: 'STATION STAY',
    title: 'BRCTC Executive Retiring Rooms',
    duration: '3 / 6 / 12 / 24 Hours',
    price: 'From ₹ 499',
    icon: Building,
    color: 'from-blue-700 to-cyan-800',
    description: 'Book sanitized AC rooms & modern sleeping pods at 400+ major railway stations across India.'
  },
  {
    id: 4,
    category: 'FOOD AT SEAT',
    title: 'Order Fresh Meals via e-Catering',
    duration: 'Live Train Delivery',
    price: '₹ 50 Off Coupon',
    icon: UtensilsCrossed,
    color: 'from-emerald-700 to-teal-800',
    description: 'Domino’s, Haldiram’s, Saravana Bhavan and 500+ restaurants delivered straight to your coach.'
  }
];

export default function PromotionalStrip() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            {t('popularDestinations')}
          </h2>
          <p className="text-[11px] text-gray-500">{t('popularDestinationsSub')}</p>
        </div>
        <a
          href="#all-packages"
          className="text-xs font-bold text-[#0A3D62] hover:text-[#FF6F00] flex items-center gap-1 transition-colors"
        >
          <span>{t('viewAllPackages')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {OFFERS.map(offer => {
          const Icon = offer.icon;
          return (
            <div
              key={offer.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className={`bg-gradient-to-r ${offer.color} text-white p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-black/30 px-2 py-0.5 rounded text-amber-300">
                    {offer.category}
                  </span>
                  <Icon className="w-4 h-4 text-white/80 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-bold text-sm leading-tight text-white">{offer.title}</h3>
                <div className="text-[11px] text-white/80 mt-1">{offer.duration}</div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  {offer.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">{t('startingFrom')}</span>
                    <div className="text-sm font-extrabold text-[#0A3D62]">{offer.price}</div>
                  </div>
                  <button className="text-xs font-bold px-3 py-1.5 bg-gray-100 hover:bg-[#0A3D62] hover:text-white rounded transition-colors">
                    {t('cardBookNow')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
