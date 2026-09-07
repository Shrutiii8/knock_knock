'use client';

import React from 'react';
import { Train } from '@/types';
import { formatDate } from '@/lib/utils';
import { 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  RefreshCw,
  Sparkles,
  Info,
  ShieldCheck
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
  confidence?: number;
  confidenceInterval?: {
    eta_lower: string;
    eta_upper: string;
    margin_minutes: number;
  };
  majorDelayFactors?: string[];
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
  const confidencePct = etaData.confidence ? Math.round(etaData.confidence * 100) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[1px] animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="eta-modal-title"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-lg shadow-2xl rounded-lg overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navy Header Bar matching BRCTC branding */}
        <div className="bg-[#0A3D62] text-white px-5 py-3.5 flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#FB792B]" />
            </div>
            <div>
              <h3 id="eta-modal-title" className="text-sm font-bold tracking-tight flex items-center gap-1.5">
                Live Estimated Time of Arrival (ETA)
                <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold px-1.5 py-0.2 rounded inline-flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 fill-slate-900" /> ML Powered
                </span>
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
        <div className="p-5 sm:p-6 space-y-4 text-xs font-sans text-gray-800 overflow-y-auto">
          
          {/* Main ETA Highlight Card */}
          <div className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isOnTime 
              ? 'bg-emerald-50/80 border-emerald-200' 
              : 'bg-amber-50/80 border-amber-200'
          }`}>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                <span>Estimated Time of Arrival (ETA)</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black font-mono text-gray-900">
                  {etaData.estimatedArrival}
                </span>
                <span className="text-xs font-bold text-gray-500">IST</span>
              </div>
              <div className="text-[11px] text-gray-600 mt-1 flex items-center gap-1.5 flex-wrap">
                <span>Scheduled: <strong className="font-mono text-gray-800">{etaData.scheduledArrival} IST</strong></span>
                <span>•</span>
                <span>{toStationName}</span>
              </div>
            </div>

            {/* Delay status badge */}
            <div className="flex flex-col items-start sm:items-end gap-1">
              <div className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 border shadow-2xs ${
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

              {confidencePct !== null && (
                <div className="text-[10px] font-bold text-gray-600 bg-white/80 px-2 py-0.5 rounded border border-gray-200 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  <span>{confidencePct}% Model Confidence</span>
                </div>
              )}
            </div>
          </div>

          {/* Model Confidence Interval Range (if present) */}
          {etaData.confidenceInterval && (
            <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-md flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-700 shrink-0" />
                <div>
                  <span className="font-bold text-blue-950">Predicted Arrival Window:</span>
                  <span className="text-blue-900 font-mono ml-1 font-semibold">
                    {etaData.confidenceInterval.eta_lower} – {etaData.confidenceInterval.eta_upper} IST
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded border border-blue-200 font-mono">
                ±{Math.round(etaData.confidenceInterval.margin_minutes)}m margin
              </span>
            </div>
          )}

          {/* Major Delay Factors & ML Drivers */}
          {etaData.majorDelayFactors && etaData.majorDelayFactors.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-2">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>ML Model Delay Insights & Factors</span>
              </div>
              <ul className="space-y-1.5">
                {etaData.majorDelayFactors.map((factor, idx) => {
                  // Clean up category prefixes like [historical]
                  const cleanFactor = factor.replace(/^\[.*?\]\s*/, '');
                  return (
                    <li key={idx} className="flex items-start gap-2 text-[11px] text-slate-700 leading-snug">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                      <span>{cleanFactor}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

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

