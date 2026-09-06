'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Ticket, 
  FileText, 
  Search, 
  LayoutGrid, 
  Activity, 
  Calendar, 
  ArrowLeftRight, 
  CreditCard, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

const SERVICES = [
  { label: 'Book Ticket', desc: 'Reserve train seats', href: '/', icon: Ticket, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { label: 'PNR Status', desc: 'Track reservation status', href: '/pnr-status', icon: FileText, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { label: 'Train Vacancy', desc: 'Current berth chart', href: '/search-results', icon: Search, color: 'text-green-700 bg-green-50 border-green-200' },
  { label: 'Coach Position', desc: 'Platform coach layout', href: '#coach-position', icon: LayoutGrid, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  { label: 'Live Station', desc: 'Trains arriving in 2-4 hrs', href: '/live-status', icon: Activity, color: 'text-red-700 bg-red-50 border-red-200' },
  { label: 'Train Schedule', desc: 'Full station timetable', href: '/train-schedule', icon: Calendar, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
  { label: 'Trains Between Stations', desc: 'Route options & timings', href: '/search-results', icon: ArrowLeftRight, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  { label: 'Fare Enquiry', desc: 'Class & quota fares', href: '/search-results', icon: CreditCard, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { label: 'Refund Status', desc: 'Track cancelled tickets', href: '/account?tab=history', icon: RotateCcw, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
];

export default function QuickServicesGrid() {
  return (
    <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2.5">
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#FF6F00]" />
            <span>Popular Railway Services</span>
          </h2>
          <p className="text-[11px] text-gray-500">Quick access to essential passenger utilities and status enquiries</p>
        </div>
        <span className="text-[10px] font-bold text-[#0A3D62] uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">
          9 Services
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
        {SERVICES.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center text-center p-3 rounded-md border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all group bg-white"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border mb-2 group-hover:scale-105 transition-transform ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-gray-800 leading-tight group-hover:text-[#0A3D62] transition-colors line-clamp-2">
                {item.label}
              </span>
              <span className="text-[9px] text-gray-500 mt-1 line-clamp-1">
                {item.desc}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
