'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type SortOption = 'DEPARTURE_ASC' | 'ARRIVAL_ASC' | 'DURATION_ASC' | 'DEPARTURE_DESC';

interface SortBarProps {
  totalTrains: number;
  fromStationName: string;
  toStationName: string;
  dateStr: string;
  quotaName: string;
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  onPreviousDay?: () => void;
  onNextDay?: () => void;
}

export default function SortBar({
  totalTrains,
  fromStationName,
  toStationName,
  dateStr,
  quotaName,
  currentSort,
  onSortChange,
  onPreviousDay,
  onNextDay
}: SortBarProps) {
  return (
    <div className="space-y-2 text-xs select-none">
      
      {/* 1. Results Info Strip */}
      <div className="bg-white border border-gray-300 px-3.5 py-2.5 shadow-2xs">
        <span className="font-bold text-gray-900 text-[13px] sm:text-[13.5px]">
          {totalTrains} Results for <strong className="text-black font-extrabold">{fromStationName.toUpperCase()} ➔ {toStationName.toUpperCase()}</strong> | <span className="font-bold">{dateStr}</span> For Quota | {quotaName}
        </span>
      </div>

      {/* 2. Sort Button and Day Navigators */}
      <div className="flex items-center justify-between gap-3 pt-1">
        
        {/* Left: Sort By Button */}
        <div>
          <button
            type="button"
            onClick={() => onSortChange(currentSort === 'DEPARTURE_ASC' ? 'DEPARTURE_DESC' : 'DEPARTURE_ASC')}
            className="bg-[#213D77] hover:bg-[#182F5D] text-white font-bold text-xs px-3.5 py-1.5 rounded-xs transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <span>Sort By | Departure</span>
          </button>
        </div>

        {/* Right: Previous Day & Next Day Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onPreviousDay}
            className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold text-xs px-3 py-1.5 rounded-xs transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Previous Day</span>
          </button>

          <button
            type="button"
            onClick={onNextDay}
            className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold text-xs px-3 py-1.5 rounded-xs transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <span>Next Day</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

      </div>

    </div>
  );
}
