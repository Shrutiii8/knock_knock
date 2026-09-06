'use client';

import React, { useState } from 'react';
import { Train, ClassCode, QuotaCode } from '@/types';
import { formatDate } from '@/lib/utils';
import { Train as TrainIcon, ChevronDown, ChevronUp, Clock, Calendar, ShieldCheck } from 'lucide-react';
import { QUOTAS } from '@/lib/constants';

interface SelectedTrainBannerProps {
  train: Train;
  selectedClass: ClassCode;
  quota: QuotaCode;
  journeyDate: string;
  fromStationName: string;
  toStationName: string;
}

export default function SelectedTrainBanner({
  train,
  selectedClass,
  quota,
  journeyDate,
  fromStationName,
  toStationName
}: SelectedTrainBannerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const quotaObj = QUOTAS.find(q => q.code === quota);
  const classObj = train.classes.find(c => c.classCode === selectedClass);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-5">
      <div className="bg-[#0A3D62] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <TrainIcon className="w-5 h-5 text-amber-400" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold bg-white/20 px-1.5 py-0.5 rounded text-xs">
                {train.trainNumber}
              </span>
              <h2 className="font-extrabold text-sm sm:text-base leading-tight">
                {train.trainName}
              </h2>
            </div>
            <div className="text-[11px] text-blue-200 mt-0.5 flex items-center gap-2">
              <span>{train.trainType}</span>
              <span>•</span>
              <span>Class: <strong className="text-white">{selectedClass} ({classObj?.className})</strong></span>
              <span>•</span>
              <span>Quota: <strong className="text-white">{quotaObj?.label || quota}</strong></span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white/80 hover:text-white p-1 rounded transition-colors text-xs font-semibold flex items-center gap-1"
        >
          <span className="hidden sm:inline">{isCollapsed ? 'Show Details' : 'Hide Details'}</span>
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4 bg-gray-50/70 border-t border-gray-200 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Origin */}
            <div>
              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">BOARDING AT</div>
              <div className="text-base font-extrabold text-gray-900 font-mono mt-0.5">
                {train.departureTime}
              </div>
              <div className="font-bold text-gray-800">{fromStationName}</div>
              <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#0A3D62]" />
                <span>{formatDate(journeyDate)}</span>
              </div>
            </div>

            {/* Middle Duration */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-[10px] font-bold text-gray-500 uppercase">TRAVEL DURATION</div>
              <div className="flex items-center gap-1 font-bold text-gray-800 text-xs mt-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>{train.duration}</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">{train.distanceKm} km direct route</div>
            </div>

            {/* Destination */}
            <div className="md:text-right">
              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">DESTINATION</div>
              <div className="text-base font-extrabold text-gray-900 font-mono mt-0.5">
                {train.arrivalTime}
              </div>
              <div className="font-bold text-gray-800">{toStationName}</div>
              <div className="text-[11px] text-gray-500 mt-0.5 md:justify-end flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#0A3D62]" />
                <span>Next Day Arrival</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
