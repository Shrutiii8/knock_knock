'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText, 
  Calendar, 
  Activity, 
  LayoutGrid, 
  XCircle, 
  HelpCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';

export default function SecondaryNav() {
  const pathname = usePathname();

  const links = [
    { label: 'PNR Status', href: '/pnr-status', icon: FileText },
    { label: 'Train Schedule', href: '/train-schedule', icon: Calendar },
    { label: 'Live Running Status', href: '/live-status', icon: Activity },
    { label: 'Search Trains', href: '/search-results', icon: MapPin },
    { label: 'Coach Position', href: '/#coach-position', icon: LayoutGrid },
    { label: 'Cancel Ticket', href: '/account?tab=history', icon: XCircle },
    { label: 'Help & Support', href: '/#help', icon: HelpCircle },
  ];

  return (
    <div className="bg-[#1E5B94] text-white text-[11px] font-semibold border-b border-[#0A3D62] hidden sm:block shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center overflow-x-auto scrollbar-none py-1 space-x-1">
        {links.map(link => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-[#0A3D62] text-amber-300 font-bold'
                  : 'text-blue-100 hover:bg-[#164673] hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 opacity-80" />
              <span>{link.label}</span>
            </Link>
          );
        })}

        <div className="ml-auto hidden xl:flex items-center gap-1 text-[10px] text-amber-300 bg-black/20 px-2.5 py-1 rounded">
          <TrendingUp className="w-3 h-3 text-green-400" />
          <span>Tatkal Booking opens 10:00 AM (AC) & 11:00 AM (Non-AC)</span>
        </div>
      </div>
    </div>
  );
}
