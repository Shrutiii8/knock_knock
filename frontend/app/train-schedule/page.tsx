'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Train, RouteStop } from '@/types';
import { Calendar, Search, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

function TrainScheduleContent() {
  const searchParams = useSearchParams();
  const urlTrain = searchParams.get('train') || '';

  const [trainNumber, setTrainNumber] = useState(urlTrain || '12302');
  const [loading, setLoading] = useState(false);
  const [trainData, setTrainData] = useState<Train | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  const fetchSchedule = (num: string) => {
    if (!num) return;
    setLoading(true);

    setTimeout(() => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      fetch(`${apiUrl}/api/schedule/${num}`)
        .then(res => res.json())
        .then(data => {
          setTrainData(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }, 400);
  };

  useEffect(() => {
    fetchSchedule(trainNumber);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSchedule(trainNumber);
  };

  // Filter stops by text
  const filteredStops = useMemo(() => {
    if (!trainData) return [];
    if (!filterQuery) return trainData.route;
    const q = filterQuery.toLowerCase();
    return trainData.route.filter(
      r => r.stationName.toLowerCase().includes(q) || r.stationCode.toLowerCase().includes(q)
    );
  }, [trainData, filterQuery]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-xs">
      {/* Search Header Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="text-center max-w-md mx-auto mb-5">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0A3D62] flex items-center justify-center mx-auto mb-2 border border-blue-200">
            <Calendar className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-black text-gray-900 uppercase tracking-wide">
            Train Schedule & Station Timetable
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Complete station-by-station itinerary, halt durations, distance and platform numbers
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
          <input
            type="text"
            value={trainNumber}
            onChange={e => setTrainNumber(e.target.value)}
            placeholder="Enter Train Number (e.g. 12302, 22436, 12952)"
            className="flex-1 text-xs font-semibold px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#0A3D62] outline-hidden bg-white text-gray-900"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#0A3D62] hover:bg-[#072B45] text-white font-extrabold text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Fetching...' : 'GET SCHEDULE'}</span>
          </button>
        </form>

        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-gray-500">
          <span>Quick search:</span>
          {['12302', '22436', '12952', '12004', '12801'].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => {
                setTrainNumber(num);
                fetchSchedule(num);
              }}
              className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded font-mono font-bold text-blue-800"
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Table View */}
      {!loading && trainData && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4 animate-in fade-in duration-200">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold bg-[#0A3D62] text-white px-2 py-0.5 rounded text-xs">
                  {trainData.trainNumber}
                </span>
                <h2 className="font-extrabold text-base text-gray-900">{trainData.trainName}</h2>
                <span className="bg-blue-100 text-[#0A3D62] font-bold text-[10px] px-2 py-0.5 rounded">
                  {trainData.trainType}
                </span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                Runs between <strong>{trainData.sourceStation}</strong> and <strong>{trainData.destinationStation}</strong> • Distance: {trainData.distanceKm} km
              </div>
            </div>

            {/* In-table search filter */}
            <div className="w-full sm:w-60">
              <input
                type="text"
                value={filterQuery}
                onChange={e => setFilterQuery(e.target.value)}
                placeholder="Filter stations..."
                className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#0A3D62] outline-hidden"
              />
            </div>
          </div>

          {/* Timetable Station by Station */}
          <div className="border border-gray-300 rounded overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px] border-b border-gray-300">
                  <th className="p-2.5">S.No</th>
                  <th className="p-2.5">Station Code</th>
                  <th className="p-2.5">Station Name</th>
                  <th className="p-2.5">Route</th>
                  <th className="p-2.5">Arrival</th>
                  <th className="p-2.5">Departure</th>
                  <th className="p-2.5">Halt Time</th>
                  <th className="p-2.5">Distance</th>
                  <th className="p-2.5">Day</th>
                  <th className="p-2.5">Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStops.map((stop, idx) => (
                  <tr key={stop.stationCode} className="hover:bg-blue-50/40 transition-colors">
                    <td className="p-2.5 font-bold text-gray-500">{idx + 1}</td>
                    <td className="p-2.5 font-mono font-bold text-[#0A3D62]">{stop.stationCode}</td>
                    <td className="p-2.5 font-bold text-gray-900">{stop.stationName}</td>
                    <td className="p-2.5 text-gray-500">Main</td>
                    <td className="p-2.5 font-mono font-semibold">{stop.arrival}</td>
                    <td className="p-2.5 font-mono font-semibold">{stop.departure}</td>
                    <td className="p-2.5">{stop.haltMin > 0 ? `${stop.haltMin} mins` : '-'}</td>
                    <td className="p-2.5">{stop.distanceKm} km</td>
                    <td className="p-2.5 font-bold">{stop.day}</td>
                    <td className="p-2.5 font-mono font-bold text-gray-700">{stop.platform || '1'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-[11px] text-gray-500 flex items-center gap-1.5 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
            <span>Timings are as per Bharat Railways public working time-table. Platform numbers are indicative and subject to change by station controller.</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrainSchedulePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading Train Schedule...</div>}>
      <TrainScheduleContent />
    </Suspense>
  );
}
