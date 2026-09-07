'use client';

import React from 'react';
import { Train } from '@/types';
import { formatDate } from '@/lib/utils';
import { 
  Clock, 
  MapPin, 
  Calendar, 
  Train as TrainIcon, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  RefreshCw
} from 'lucide-react';

export interface EtaInfo {
  scheduledArrival: string;
  estimatedArrival: string;
  delayMinutes: number;
  status: 'ON_TIME' | 'DELAYED';
  platform: number | string;
  currentLocation: string;
  nextStop: string;
  speedKmH: number;
  lastUpdated: string;
  distanceRemainingKm: number;
}

interface EtaModalProps {
  isOpen: boolean;
  onClose: () => void;
  train: Train;
  fromStationName: string;
  toStationName: string;
  journeyDate: string;
  etaData: EtaInfo | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function EtaModal({
  isOpen,
  onClose,
  train,
  fromStationName,
  toStationName,
  journeyDate,
  etaData,
  onRefresh,
  isRefreshing
}: EtaModalProps) {
  if (!isOpen || !etaData) return null;

  const isOnTime = etaData.delayMinutes === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[1px] animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="eta-modal-title"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-lg shadow-2xl rounded-lg overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-150 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navy Header Bar matching BRCTC branding */}
        <div className="bg-[#0A3D62] text-white px-5 py-3.5 flex items-center justify-between select-none">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#FB792B]" />
            </div>
            <div>
              <h3 id="eta-modal-title" className="text-sm font-bold tracking-tight">
                Live Estimated Time of Arrival (ETA)
              </h3>
              <p className="text-[11px] text-blue-200">
                {train.trainNumber} - {train.trainName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs font-sans text-gray-800">
          
          {/* Main ETA Highlight Card */}
          <div className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isOnTime 
              ? 'bg-emerald-50/80 border-emerald-200' 
              : 'bg-amber-50/80 border-amber-200'
          }`}>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Estimated Time of Arrival (ETA)
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black font-mono text-gray-900">
                  {etaData.estimatedArrival}
                </span>
                <span className="text-xs font-bold text-gray-500">IST</span>
              </div>
              <div className="text-[11px] text-gray-600 mt-1 flex items-center gap-1.5">
                <span>Scheduled: <strong className="font-mono text-gray-800">{etaData.scheduledArrival} IST</strong></span>
                <span>•</span>
                <span>{toStationName}</span>
              </div>
            </div>

            {/* Delay status badge */}
            <div className={`self-start sm:self-center px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 border shadow-2xs ${
              isOnTime 
                ? 'bg-emerald-600 text-white border-emerald-700' 
                : 'bg-amber-600 text-white border-amber-700'
            }`}>
              {isOnTime ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Right Time (On Schedule)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Delayed by {etaData.delayMinutes} mins</span>
                </>
              )}
            </div>
          </div>

          {/* Expected Platform */}
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-100/70 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#0A3D62]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-gray-500">
                  Expected Arrival Platform
                </div>
                <div className="text-xs text-gray-600 mt-0.5">
                  At {toStationName}
                </div>
              </div>
            </div>
            <div className="text-sm font-extrabold text-gray-900 bg-white px-3 py-1.5 rounded border border-gray-200 shadow-2xs font-mono">
              Platform {etaData.platform}
            </div>
          </div>


          {/* Journey Date & Route summary */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>Journey Date: <strong>{formatDate(journeyDate)}</strong></span>
            </div>
            <span>Route: <strong>{fromStationName} ➔ {toStationName}</strong></span>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Status'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#0A3D62] hover:bg-[#182F5D] text-white rounded font-bold text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
