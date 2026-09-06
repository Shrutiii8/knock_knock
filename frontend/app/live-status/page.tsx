'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LiveTrainStatus } from '@/types';
import { Activity, Search, Clock, MapPin, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

function LiveStatusContent() {
  const searchParams = useSearchParams();
  const urlTrain = searchParams.get('train') || '';

  const [trainNumber, setTrainNumber] = useState(urlTrain || '22436');
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState<LiveTrainStatus | null>(null);

  const fetchLiveStatus = (tNum: string) => {
    if (!tNum) return;
    setLoading(true);

    setTimeout(() => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      fetch(`${apiUrl}/api/live-status/${tNum}`)
        .then(res => res.json())
        .then(data => {
          setStatusData(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }, 400);
  };

  useEffect(() => {
    fetchLiveStatus(trainNumber);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLiveStatus(trainNumber);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-xs">
      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="text-center max-w-md mx-auto mb-5">
          <div className="w-10 h-10 rounded-full bg-green-50 text-green-700 flex items-center justify-center mx-auto mb-2 border border-green-200">
            <Activity className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-black text-gray-900 uppercase tracking-wide">
            Live Train Running Status (GPS Spotting)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time station tracking, platform numbers, and delay updates
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
          <input
            type="text"
            value={trainNumber}
            onChange={e => setTrainNumber(e.target.value)}
            placeholder="Enter Train Number (e.g. 22436, 12302)"
            className="flex-1 text-xs font-semibold px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#0A3D62] outline-hidden bg-white text-gray-900"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#2E7D32] hover:bg-green-800 text-white font-extrabold text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Locating...' : 'TRACK LIVE'}</span>
          </button>
        </form>

        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-gray-500">
          <span>Popular:</span>
          {['22436', '12302', '12952', '12004'].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => {
                setTrainNumber(num);
                fetchLiveStatus(num);
              }}
              className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded font-mono font-bold text-blue-800"
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Live Status Content */}
      {!loading && statusData && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-5 animate-in fade-in duration-200">
          {/* Header & Delay Indicator Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold bg-[#0A3D62] text-white px-2 py-0.5 rounded text-xs">
                  {statusData.trainNumber}
                </span>
                <h2 className="font-extrabold text-base text-gray-900">{statusData.trainName}</h2>
              </div>
              <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Last updated at {statusData.lastUpdated} IST via National Train Enquiry System (NTES)</span>
              </p>
            </div>

            {/* Delay Badge */}
            <div className={`px-4 py-2 rounded-md font-bold text-xs flex items-center gap-2 border ${
              statusData.delayMinutes > 0
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-green-50 text-green-900 border-green-300'
            }`}>
              {statusData.delayMinutes > 0 ? (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              )}
              <span>
                {statusData.delayMinutes > 0
                  ? `Train is running ${statusData.delayMinutes} mins late`
                  : 'Train is running on time'}
              </span>
            </div>
          </div>

          {/* Stepper Timeline UI */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider">
              Station Progression Timeline
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[3px] before:bg-gray-200">
              {statusData.stations.map((stop, idx) => {
                const isPassed = stop.status === 'PASSED';
                const isCurrent = stop.status === 'CURRENT';
                const isUpcoming = stop.status === 'UPCOMING';

                return (
                  <div key={stop.stationCode} className="relative flex items-start justify-between gap-4">
                    {/* Stepper Dot */}
                    <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-bold ${
                      isPassed
                        ? 'bg-green-600 border-green-600 text-white'
                        : isCurrent
                        ? 'bg-[#FF6F00] border-[#FF6F00] text-white animate-pulse'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {isPassed ? '✓' : idx + 1}
                    </div>

                    {/* Station info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-gray-900">{stop.stationName}</span>
                        <span className="font-mono text-gray-500 font-bold">({stop.stationCode})</span>
                        {isCurrent && (
                          <span className="bg-[#FF6F00] text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                            CURRENT LOCATION
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        Platform {stop.platform} • Scheduled: {stop.scheduledArrival} - {stop.scheduledDeparture}
                      </div>
                    </div>

                    {/* Arrival/Departure Status */}
                    <div className="text-right flex-shrink-0">
                      <div className={`font-mono font-bold text-xs ${
                        isPassed ? 'text-green-700' : isCurrent ? 'text-[#FF6F00]' : 'text-gray-700'
                      }`}>
                        {stop.actualArrival}
                      </div>
                      <span className={`text-[10px] font-semibold block ${
                        isPassed ? 'text-gray-500' : isCurrent ? 'text-amber-700 font-bold' : 'text-gray-400'
                      }`}>
                        {isPassed ? 'Departed' : isCurrent ? 'At Platform' : 'Expected'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LiveStatusPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading Live Train Status...</div>}>
      <LiveStatusContent />
    </Suspense>
  );
}
