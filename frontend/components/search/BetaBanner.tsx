'use client';

import React, { useState } from 'react';
import { ArrowRight, X, Sparkles } from 'lucide-react';

export default function BetaBanner() {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div className="bg-[#EBF3FF] border border-[#D0E3FF] rounded-md px-4 py-2.5 mx-4 max-w-[1440px] lg:mx-auto mt-3 flex items-center justify-between gap-3 text-xs select-none shadow-2xs">
      <div className="flex items-center gap-3">
        {/* NEW Badge */}
        <div className="flex items-center gap-1 bg-[#005DAA] text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>NEW</span>
        </div>

        {/* Message */}
        <span className="font-bold text-[#003893] text-xs sm:text-sm">
          Explore the beta version of our new website and give your valuable suggestions
        </span>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="#beta-experience"
          className="bg-[#213D77] hover:bg-[#182F5D] text-white font-bold px-3.5 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors shadow-2xs whitespace-nowrap"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>Explore beta now</span>
        </a>

        <button
          type="button"
          onClick={() => setClosed(true)}
          className="text-gray-500 hover:text-gray-800 p-1 rounded"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
