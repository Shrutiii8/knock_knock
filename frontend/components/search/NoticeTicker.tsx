'use client';

import React, { useState } from 'react';
import { Megaphone, AlertCircle, X } from 'lucide-react';

const NOTICES = [
  'Passengers can now book up to 24 tickets a month with Aadhaar linked BRCTC User ID.',
  'Tatkal booking opens daily at 10:00 AM for AC classes & 11:00 AM for Non-AC classes.',
  'Never share your BRCTC password, OTP, or UPI PIN with anyone posing as railway officials.',
  'Special Vande Bharat & festival special trains running on major routes for the upcoming holiday season.',
  'Senior citizen lower berth allotment is available under Ladies / Lower Berth Quota during booking.'
];

export default function NoticeTicker() {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div className="bg-amber-50 border-y border-amber-200 text-amber-950 px-4 py-2 text-xs flex items-center justify-between shadow-2xs select-none">
      <div className="max-w-7xl mx-auto w-full flex items-center overflow-hidden">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded flex-shrink-0 mr-3">
          <Megaphone className="w-3.5 h-3.5 text-amber-800" />
          <span>Notice:</span>
        </div>

        {/* Marquee ticker */}
        <div className="relative overflow-hidden whitespace-nowrap flex-1">
          <div className="inline-block animate-marquee hover:pause-animation text-gray-800 font-medium">
            {NOTICES.join('  •  ')}
          </div>
        </div>

        <button
          onClick={() => setClosed(true)}
          className="text-amber-700 hover:text-amber-950 ml-3 p-0.5 rounded"
          aria-label="Dismiss announcements"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
