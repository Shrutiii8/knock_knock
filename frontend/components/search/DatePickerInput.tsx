'use client';

import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { QuotaCode } from '@/types';

interface DatePickerInputProps {
  label: string;
  value: string;
  onChange: (dateStr: string) => void;
  quota?: QuotaCode;
}

export default function DatePickerInput({
  label,
  value,
  onChange,
  quota = 'GN'
}: DatePickerInputProps) {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

  // 120 days advance reservation period
  const maxDate = new Date(Date.now() + 86400000 * 120).toISOString().split('T')[0];

  const isTatkal = quota === 'TQ' || quota === 'PT';

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
          {label}
        </label>
        {/* Quick Date Pills */}
        <div className="flex items-center space-x-1 text-[10px]">
          <button
            type="button"
            onClick={() => onChange(today)}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              value === today ? 'bg-[#0A3D62] text-white font-bold' : 'text-[#0A3D62] hover:bg-gray-100'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => onChange(tomorrow)}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              value === tomorrow ? 'bg-[#0A3D62] text-white font-bold' : 'text-[#0A3D62] hover:bg-gray-100'
            }`}
          >
            Tomorrow
          </button>
        </div>
      </div>

      <div className="relative">
        <input
          type="date"
          min={today}
          max={maxDate}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full text-xs font-semibold px-3 py-2.5 pl-9 border border-gray-300 rounded focus:ring-2 focus:ring-[#0A3D62] focus:border-[#0A3D62] outline-hidden bg-white text-gray-900 transition-all shadow-2xs"
        />
        <Calendar className="w-4 h-4 text-[#0A3D62] absolute left-3 top-3 pointer-events-none" />
      </div>

      {isTatkal && (
        <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-700 font-medium">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span>Tatkal opens 10:00 AM (AC) & 11:00 AM (Non-AC) 1 day prior</span>
        </div>
      )}
    </div>
  );
}
