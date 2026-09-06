'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PNRRecord } from '@/types';
import { formatDate } from '@/lib/utils';
import { PnrResultSkeleton } from '@/components/shared/SkeletonLoaders';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  Clock, 
  Train, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

function PNRStatusContent() {
  const searchParams = useSearchParams();
  const urlPnr = searchParams.get('pnr') || '';

  const [pnrInput, setPnrInput] = useState(urlPnr || '2458921473');
  const [loading, setLoading] = useState(false);
  const [pnrRecord, setPnrRecord] = useState<PNRRecord | null>(null);
  const [error, setError] = useState('');

  const fetchPnrStatus = (pnrToFetch: string) => {
    if (!pnrToFetch || pnrToFetch.length !== 10) {
      setError('Please enter a valid 10-digit PNR number.');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      fetch(`${apiUrl}/api/pnr/${pnrToFetch}`)
        .then(res => {
          if (!res.ok) throw new Error('PNR not found');
          return res.json();
        })
        .then(data => {
          setPnrRecord(data);
          setLoading(false);
        })
        .catch(err => {
          setError('Could not find reservation records for this PNR.');
          setLoading(false);
        });
    }, 500);
  };

  useEffect(() => {
    if (urlPnr && urlPnr.length === 10) {
      setPnrInput(urlPnr);
      fetchPnrStatus(urlPnr);
    } else {
      // Auto-fetch demo PNR for instant preview
      fetchPnrStatus('2458921473');
    }
  }, [urlPnr]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPnrStatus(pnrInput);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-xs">
      {/* Search Input Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="text-center max-w-md mx-auto mb-5">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0A3D62] flex items-center justify-center mx-auto mb-2 border border-blue-200">
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-black text-gray-900 uppercase tracking-wide">
            Passenger Name Record (PNR) Status
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Check real-time booking confirmation, coach/berth numbers, and chart status
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              maxLength={10}
              value={pnrInput}
              onChange={e => setPnrInput(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 10-Digit PNR Number"
              className="flex-1 font-mono tracking-widest text-sm font-bold px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#0A3D62] outline-hidden text-center sm:text-left bg-white text-gray-900"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#0A3D62] hover:bg-[#072B45] text-white font-extrabold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Checking...' : 'GET STATUS'}</span>
            </button>
          </div>

          {error && (
            <div className="text-red-600 text-xs font-semibold flex items-center gap-1.5 justify-center">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo PNRs */}
          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-gray-500 flex-wrap">
            <span className="font-semibold">Try sample PNRs:</span>
            {[
              { pnr: '2458921473', label: 'Confirmed (Rajdhani)' },
              { pnr: '4521098472', label: 'Vande Bharat' },
              { pnr: '8145920147', label: 'Waitlist (WL 12)' }
            ].map(sample => (
              <button
                key={sample.pnr}
                type="button"
                onClick={() => {
                  setPnrInput(sample.pnr);
                  fetchPnrStatus(sample.pnr);
                }}
                className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded font-mono font-bold text-blue-800 transition-colors"
              >
                {sample.pnr} ({sample.label})
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Loading Skeleton */}
      {loading && <PnrResultSkeleton />}

      {/* PNR Status Result View */}
      {!loading && pnrRecord && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden space-y-4 p-6 animate-in fade-in duration-200">
          {/* Top Status Header */}
          <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase block">PNR NUMBER</span>
              <span className="font-mono text-xl font-black text-[#0A3D62] tracking-wider">
                {pnrRecord.pnrNumber}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-600 font-semibold">Chart Status:</span>
              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                pnrRecord.chartStatus === 'CHART_PREPARED'
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {pnrRecord.chartStatus === 'CHART_PREPARED' ? 'Chart Prepared' : 'Chart Not Prepared'}
              </span>
            </div>
          </div>

          {/* Journey Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-md border border-gray-200">
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Train Details</span>
              <span className="font-mono font-extrabold text-gray-900 text-xs">{pnrRecord.trainNumber}</span>
              <div className="font-bold text-gray-800 text-[11px] truncate">{pnrRecord.trainName}</div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Date of Journey</span>
              <span className="font-extrabold text-gray-900">{formatDate(pnrRecord.journeyDate)}</span>
              <div className="text-[10px] text-gray-500">Scheduled Travel</div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Route Stations</span>
              <span className="font-bold text-gray-800">
                {pnrRecord.fromStation} → {pnrRecord.toStation}
              </span>
              <div className="text-[10px] text-gray-500 truncate">{pnrRecord.fromStationName} to {pnrRecord.toStationName}</div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Class & Quota</span>
              <span className="font-extrabold text-gray-900">
                Class: {pnrRecord.journeyClass} • {pnrRecord.quota}
              </span>
              <div className="text-[10px] text-gray-500">General Quota</div>
            </div>
          </div>

          {/* Passenger Status Breakdown Table */}
          <div>
            <h3 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider mb-2">
              Passenger-Wise Current Status
            </h3>

            <div className="border border-gray-200 rounded overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px] border-b border-gray-200">
                    <th className="p-2.5">Passenger #</th>
                    <th className="p-2.5">Booking Status</th>
                    <th className="p-2.5">Current Status</th>
                    <th className="p-2.5">Coach</th>
                    <th className="p-2.5">Berth / Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pnrRecord.passengers.map(p => (
                    <tr key={p.passengerNo} className="hover:bg-gray-50">
                      <td className="p-2.5 font-bold text-gray-600">Passenger {p.passengerNo}</td>
                      <td className="p-2.5 font-semibold text-gray-700">{p.bookingStatus}</td>
                      <td className="p-2.5 font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          p.currentStatus === 'CNF'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.currentStatus}
                        </span>
                      </td>
                      <td className="p-2.5 font-mono font-bold text-[#0A3D62]">
                        {p.coach || '-'}
                      </td>
                      <td className="p-2.5 font-mono font-bold text-gray-900">
                        {p.berth ? `${p.berth} (${p.berthType || 'LB'})` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-[11px] text-gray-500 flex items-center gap-1.5 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
            <span>Chart status updates automatically 4 hours before scheduled train departure from origin station.</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PnrStatusPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading PNR Status...</div>}>
      <PNRStatusContent />
    </Suspense>
  );
}
