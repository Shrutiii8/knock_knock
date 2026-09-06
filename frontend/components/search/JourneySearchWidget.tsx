'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Circle, 
  MapPin, 
  Calendar as CalendarIcon, 
  ArrowLeftRight, 
  Search, 
  ChevronDown, 
  Moon, 
  Share2, 
  Ticket, 
  Compass, 
  Activity,
  X,
  Check
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { QUOTAS } from '@/lib/constants';
import { QuotaCode, Station } from '@/types';
import stationsData from '@/data/stations.json';

export default function JourneySearchWidget() {
  const router = useRouter();
  const { searchParams, setSearchParams } = useBooking();

  // Dropdown visibility states
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [quotaOpen, setQuotaOpen] = useState(false);
  const [concessionOpen, setConcessionOpen] = useState(false);

  // Search queries for autocomplete
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const quotaRef = useRef<HTMLDivElement>(null);
  const concessionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) setFromOpen(false);
      if (toRef.current && !toRef.current.contains(e.target as Node)) setToOpen(false);
      if (quotaRef.current && !quotaRef.current.contains(e.target as Node)) setQuotaOpen(false);
      if (concessionRef.current && !concessionRef.current.contains(e.target as Node)) setConcessionOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwap = () => {
    setSearchParams({
      from: searchParams.to,
      fromName: searchParams.toName,
      to: searchParams.from,
      toName: searchParams.fromName
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchParams.from || !searchParams.to) {
      alert('Please select both departure and destination stations.');
      return;
    }
    const query = new URLSearchParams({
      from: searchParams.from,
      to: searchParams.to,
      date: searchParams.date,
      quota: searchParams.quota,
      acOnly: searchParams.acOnly ? 'true' : 'false'
    });
    router.push(`/search-results?${query.toString()}`);
  };

  // Filter stations
  const filteredFromStations = stationsData.filter(s =>
    !fromQuery ||
    s.code.toUpperCase().includes(fromQuery.toUpperCase()) ||
    s.name.toUpperCase().includes(fromQuery.toUpperCase()) ||
    s.city.toUpperCase().includes(fromQuery.toUpperCase())
  ).slice(0, 10);

  const filteredToStations = stationsData.filter(s =>
    !toQuery ||
    s.code.toUpperCase().includes(toQuery.toUpperCase()) ||
    s.name.toUpperCase().includes(toQuery.toUpperCase()) ||
    s.city.toUpperCase().includes(toQuery.toUpperCase())
  ).slice(0, 10);

  // Format display date: e.g. "05 Sep 2026"
  const formattedDate = (() => {
    if (!searchParams.date) return 'Select Date';
    const d = new Date(searchParams.date);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  })();

  const currentQuotaObj = QUOTAS.find(q => q.code === searchParams.quota) || QUOTAS[0];

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 p-4 sm:p-6 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        
        {/* Left Form: 2 Rows */}
        <div className="lg:col-span-8 space-y-3">
          
          {/* Row 1: From, Swap, To, Date */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            
            {/* From Input Card */}
            <div className="relative flex-1 w-full" ref={fromRef}>
              <div
                onClick={() => setFromOpen(true)}
                className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50/80 border border-gray-200 rounded-xl cursor-pointer transition-all shadow-2xs group"
              >
                <div className="w-6 h-6 rounded-full border-2 border-[#005DAA] flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#005DAA]" />
                </div>
                <div className="flex-1 overflow-hidden text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">From</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-800 truncate block">
                    {searchParams.from ? `${searchParams.fromName} (${searchParams.from})` : 'Select Source'}
                  </span>
                </div>
              </div>

              {/* From Station Dropdown */}
              {fromOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-2 max-h-60 overflow-y-auto animate-in fade-in duration-100 text-xs">
                  <input
                    type="text"
                    autoFocus
                    value={fromQuery}
                    onChange={e => setFromQuery(e.target.value)}
                    placeholder="Search origin station or code..."
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-hidden focus:border-[#005DAA] font-semibold text-xs mb-1"
                  />
                  <div className="divide-y divide-gray-100">
                    {filteredFromStations.map(stn => (
                      <div
                        key={stn.code}
                        onClick={() => {
                          setSearchParams({ from: stn.code, fromName: stn.name });
                          setFromOpen(false);
                          setFromQuery('');
                        }}
                        className="p-2 hover:bg-blue-50 cursor-pointer rounded flex items-center justify-between transition-colors"
                      >
                        <div>
                          <span className="font-bold text-gray-800">{stn.name}</span>
                          <span className="text-[10px] text-gray-500 ml-1">({stn.city})</span>
                        </div>
                        <span className="font-mono font-extrabold text-[10px] bg-[#005DAA] text-white px-1.5 py-0.5 rounded">
                          {stn.code}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="w-10 h-10 rounded-xl bg-[#0B3B82] hover:bg-[#002D62] text-white flex items-center justify-center shadow-md transition-all active:scale-90 flex-shrink-0 group"
              title="Swap From and To"
              aria-label="Swap Stations"
            >
              <ArrowLeftRight className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            </button>

            {/* To Input Card */}
            <div className="relative flex-1 w-full" ref={toRef}>
              <div
                onClick={() => setToOpen(true)}
                className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50/80 border border-gray-200 rounded-xl cursor-pointer transition-all shadow-2xs group"
              >
                <MapPin className="w-5 h-5 text-[#005DAA] flex-shrink-0" />
                <div className="flex-1 overflow-hidden text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">To</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-800 truncate block">
                    {searchParams.to ? `${searchParams.toName} (${searchParams.to})` : 'Select Destination'}
                  </span>
                </div>
              </div>

              {/* To Station Dropdown */}
              {toOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-2 max-h-60 overflow-y-auto animate-in fade-in duration-100 text-xs">
                  <input
                    type="text"
                    autoFocus
                    value={toQuery}
                    onChange={e => setToQuery(e.target.value)}
                    placeholder="Search destination station or code..."
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-hidden focus:border-[#005DAA] font-semibold text-xs mb-1"
                  />
                  <div className="divide-y divide-gray-100">
                    {filteredToStations.map(stn => (
                      <div
                        key={stn.code}
                        onClick={() => {
                          setSearchParams({ to: stn.code, toName: stn.name });
                          setToOpen(false);
                          setToQuery('');
                        }}
                        className="p-2 hover:bg-blue-50 cursor-pointer rounded flex items-center justify-between transition-colors"
                      >
                        <div>
                          <span className="font-bold text-gray-800">{stn.name}</span>
                          <span className="text-[10px] text-gray-500 ml-1">({stn.city})</span>
                        </div>
                        <span className="font-mono font-extrabold text-[10px] bg-[#005DAA] text-white px-1.5 py-0.5 rounded">
                          {stn.code}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Date Input Card */}
            <div className="relative w-full sm:w-48">
              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-2xs">
                <div className="text-left overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Date</span>
                  <input
                    type="date"
                    value={searchParams.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setSearchParams({ date: e.target.value })}
                    className="text-xs sm:text-sm font-bold text-gray-800 bg-transparent outline-hidden cursor-pointer"
                  />
                </div>
                <CalendarIcon className="w-4 h-4 text-[#005DAA] pointer-events-none flex-shrink-0" />
              </div>
            </div>

          </div>

          {/* Row 2: Quota, Concession, Search Button */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            
            {/* Quota Selector */}
            <div className="relative flex-1 w-full" ref={quotaRef}>
              <div
                onClick={() => setQuotaOpen(!quotaOpen)}
                className="flex items-center justify-between p-3 bg-white hover:bg-gray-50/80 border border-gray-200 rounded-xl cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <Moon className="w-4 h-4 text-[#005DAA] flex-shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Quota</span>
                    <span className="text-xs sm:text-sm font-bold text-gray-800 block truncate">
                      {currentQuotaObj.label}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>

              {quotaOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-1 divide-y divide-gray-100 text-xs animate-in fade-in duration-100">
                  {QUOTAS.map(q => (
                    <div
                      key={q.code}
                      onClick={() => {
                        setSearchParams({ quota: q.code });
                        setQuotaOpen(false);
                      }}
                      className={`p-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between ${
                        searchParams.quota === q.code ? 'bg-blue-50/80 font-bold text-[#005DAA]' : 'text-gray-800'
                      }`}
                    >
                      <span>{q.label}</span>
                      {searchParams.quota === q.code && <Check className="w-3.5 h-3.5 text-[#005DAA]" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Concession Selector */}
            <div className="relative flex-1 w-full" ref={concessionRef}>
              <div
                onClick={() => setConcessionOpen(!concessionOpen)}
                className="flex items-center justify-between p-3 bg-white hover:bg-gray-50/80 border border-gray-200 rounded-xl cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <Share2 className="w-4 h-4 text-[#005DAA] flex-shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Concession</span>
                    <span className="text-xs sm:text-sm font-bold text-gray-800 block truncate">
                      {searchParams.disabledConcession ? 'Divyaang Concession' : searchParams.acOnly ? 'AC Only' : 'Regular'}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>

              {concessionOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-2 text-xs animate-in fade-in duration-100 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={searchParams.acOnly}
                      onChange={e => setSearchParams({ acOnly: e.target.checked })}
                      className="rounded text-[#005DAA] focus:ring-[#005DAA]"
                    />
                    <span className="font-semibold text-gray-800">AC Classes Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={searchParams.disabledConcession}
                      onChange={e => setSearchParams({ disabledConcession: e.target.checked })}
                      className="rounded text-[#005DAA] focus:ring-[#005DAA]"
                    />
                    <span className="font-semibold text-gray-800">Person with Disability Concession</span>
                  </label>
                </div>
              )}
            </div>

            {/* Search Button (Royal Blue Pill) */}
            <button
              type="button"
              onClick={handleSearch}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0038A8] hover:bg-[#002B82] text-white font-extrabold text-sm rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 flex-shrink-0"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Search</span>
            </button>

          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden lg:block lg:col-span-1 h-full py-2 flex justify-center">
          <div className="w-[1px] h-28 bg-gray-200 mx-auto" />
        </div>

        {/* Right Section: Quick Action Cards */}
        <div className="lg:col-span-3 space-y-2.5 w-full">
          
          {/* Card 1: Check PNR Status */}
          <button
            type="button"
            onClick={() => router.push('/pnr-status')}
            className="w-full p-3.5 bg-white hover:bg-blue-50/50 border border-gray-200 hover:border-blue-300 rounded-xl flex items-center gap-3 transition-all shadow-2xs group text-left"
          >
            <div className="w-9 h-9 rounded-full bg-blue-50 text-[#005DAA] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xs sm:text-sm text-gray-900 block leading-tight group-hover:text-[#005DAA] transition-colors">
                Check PNR Status
              </span>
              <span className="text-[10px] text-gray-400 font-medium">Real-time confirmation tracking</span>
            </div>
          </button>

          {/* Card 2: Track Your Train */}
          <button
            type="button"
            onClick={() => router.push('/live-status')}
            className="w-full p-3.5 bg-white hover:bg-blue-50/50 border border-gray-200 hover:border-blue-300 rounded-xl flex items-center gap-3 transition-all shadow-2xs group text-left"
          >
            <div className="w-9 h-9 rounded-full bg-blue-50 text-[#005DAA] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xs sm:text-sm text-gray-900 block leading-tight group-hover:text-[#005DAA] transition-colors">
                Track Your Train
              </span>
              <span className="text-[10px] text-gray-400 font-medium">Live GPS spotting & delays</span>
            </div>
          </button>

        </div>

      </div>
    </div>
  );
}
