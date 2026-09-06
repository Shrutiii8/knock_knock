'use client';

import React, { useState } from 'react';
import { TrainClassAvailability } from '@/types';
import { RotateCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ClassAvailabilityPillProps {
  availability: TrainClassAvailability;
  isSelected: boolean;
  onSelect: () => void;
  dateStr?: string;
}

export default function ClassAvailabilityPill({
  availability,
  isSelected,
  onSelect,
  dateStr = 'Sun, 06 Sep'
}: ClassAvailabilityPillProps) {
  const { classCode, className, fare, status, seatsCount } = availability;
  const [refreshed, setRefreshed] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRefreshed(true);
    onSelect();
  };

  const fullClassName = className.includes('(') ? className : `${className} (${classCode})`;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`relative text-left p-3 rounded-md transition-all flex-shrink-0 min-w-[145px] sm:min-w-[155px] cursor-pointer select-none ${
        isSelected
          ? 'border-2 border-[#FB792B] bg-[#FFF8F4] shadow-xs'
          : 'border border-gray-300 bg-[#F8F9FA] hover:bg-gray-100 hover:border-gray-400'
      }`}
    >
      {/* Class Name */}
      <div className="font-bold text-[12.5px] text-gray-900 tracking-tight leading-snug truncate">
        {fullClassName}
      </div>

      {/* Status or Refresh row */}
      <div className="mt-1.5 flex items-center justify-between gap-1 text-xs">
        {!refreshed ? (
          <div className="flex items-center gap-1.5 text-gray-800 font-bold text-[11.5px] hover:text-[#0074D9]">
            <span>Refresh</span>
            <RotateCw className="w-3.5 h-3.5 stroke-[2.5] text-black" />
          </div>
        ) : (
          <div className="flex flex-col">
            <span className="text-[11.5px] font-extrabold text-[#2E7D32]">
              {status === 'AVAILABLE' ? `AVAILABLE-${seatsCount ?? 142}` : status}
            </span>
            <span className="text-[10.5px] font-bold text-gray-700 mt-0.5">
              {formatCurrency(fare)}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
