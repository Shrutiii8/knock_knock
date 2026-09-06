'use client';

import React, { useState } from 'react';
import { 
  Send, 
  MapPin, 
  Calendar as CalendarIcon, 
  Briefcase, 
  LayoutGrid, 
  ArrowLeftRight, 
  ChevronDown 
} from 'lucide-react';
import { QUOTAS, CLASSES } from '@/lib/constants';
import { QuotaCode, ClassCode } from '@/types';
import stationsData from '@/data/stations.json';

interface SearchResultsTopBarProps {
  from: string;
  to: string;
  date: string;
  quota: QuotaCode;
  classCode?: ClassCode | string;
  fromStationName: string;
  toStationName: string;
  onSearch: (from: string, to: string, date: string, quota: QuotaCode, classCode: string) => void;
}

export default function SearchResultsTopBar({
  from,
  to,
  date,
  quota,
  classCode = 'ALL',
  fromStationName,
  toStationName,
  onSearch
}: SearchResultsTopBarProps) {
  const [currentFrom, setCurrentFrom] = useState(from);
  const [currentTo, setCurrentTo] = useState(to);
  const [currentDate, setCurrentDate] = useState(date || '2026-09-06');
  const [currentQuota, setCurrentQuota] = useState<QuotaCode>(quota || 'GN');
  const [currentClass, setCurrentClass] = useState<string>(classCode || 'ALL');

  // Checkbox filters in top bar
  const [flexibleWithDate, setFlexibleWithDate] = useState(false);
  const [disabilityConcession, setDisabilityConcession] = useState(false);
  const [railwayPassConcession, setRailwayPassConcession] = useState(false);

  // Dropdown states
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [quotaOpen, setQuotaOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);

  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');

  const handleSwap = () => {
    const temp = currentFrom;
    setCurrentFrom(currentTo);
    setCurrentTo(temp);
  };

  const handleModifySearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(currentFrom, currentTo, currentDate, currentQuota, currentClass);
  };

  const fromStation = stationsData.find(s => s.code === currentFrom);
  const toStation = stationsData.find(s => s.code === currentTo);

  const fromDisplay = fromStation ? `${fromStation.name.toUpperCase()} - ${fromStation.code}` : currentFrom;
  const toDisplay = toStation ? `${toStation.name.toUpperCase()} - ${toStation.code}` : currentTo;

  // Format date for display like 06/09/2026
  const dateFormatted = currentDate.includes('-') 
    ? currentDate.split('-').reverse().join('/') 
    : currentDate;

  const currentQuotaObj = QUOTAS.find(q => q.code === currentQuota) || QUOTAS[0];
  const currentClassObj = CLASSES.find(c => c.code === currentClass);

  const filteredFromStations = stationsData.filter(s =>
    !fromQuery ||
    s.code.toUpperCase().includes(fromQuery.toUpperCase()) ||
    s.name.toUpperCase().includes(fromQuery.toUpperCase())
  ).slice(0, 8);

  const filteredToStations = stationsData.filter(s =>
    !toQuery ||
    s.code.toUpperCase().includes(toQuery.toUpperCase()) ||
    s.name.toUpperCase().includes(toQuery.toUpperCase())
  ).slice(0, 8);

  return (
    <div className="bg-[#213D77] text-white py-3 px-4 sm:px-6 shadow-md select-none">
      <form onSubmit={handleModifySearch} className="max-w-[1380px] mx-auto space-y-2.5">
        
        {/* Top Controls Row */}
        <div className="flex items-center gap-2 flex-wrap xl:flex-nowrap">
          
          {/* From Station Input */}
          <div className="relative flex-1 min-w-[200px]">
            <div 
              onClick={() => { setFromOpen(!fromOpen); setToOpen(false); setQuotaOpen(false); setClassOpen(false); }}
              className="bg-white text-gray-900 px-3 py-2 rounded-xs flex items-center gap-2 cursor-pointer shadow-2xs border border-gray-200"
            >
              <Send className="w-3.5 h-3.5 text-gray-700 -rotate-45 flex-shrink-0" />
              <span className="text-[12.5px] font-bold truncate">
                {fromDisplay}
              </span>
            </div>

            {fromOpen && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-white text-gray-800 rounded-sm shadow-xl border border-gray-200 z-50 p-2">
                <input
                  type="text"
                  placeholder="Search station..."
                  value={fromQuery}
                  onChange={e => setFromQuery(e.target.value)}
                  className="w-full text-xs p-1.5 border border-gray-300 rounded mb-2 text-gray-900 focus:outline-none focus:border-[#213D77]"
                  autoFocus
                />
                <div className="max-h-48 overflow-y-auto divide-y divide-gray-100">
                  {filteredFromStations.map(stn => (
                    <div
                      key={stn.code}
                      onClick={() => { setCurrentFrom(stn.code); setFromOpen(false); }}
                      className="p-1.5 hover:bg-blue-50 text-xs font-semibold cursor-pointer flex justify-between"
                    >
                      <span>{stn.name}</span>
                      <span className="text-gray-500 font-mono">({stn.code})</span>
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
            title="Swap Origin and Destination"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <ArrowLeftRight className="w-4 h-4 text-white" />
          </button>

          {/* To Station Input */}
          <div className="relative flex-1 min-w-[200px]">
            <div 
              onClick={() => { setToOpen(!toOpen); setFromOpen(false); setQuotaOpen(false); setClassOpen(false); }}
              className="bg-white text-gray-900 px-3 py-2 rounded-xs flex items-center gap-2 cursor-pointer shadow-2xs border border-gray-200"
            >
              <MapPin className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
              <span className="text-[12.5px] font-bold truncate">
                {toDisplay}
              </span>
            </div>

            {toOpen && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-white text-gray-800 rounded-sm shadow-xl border border-gray-200 z-50 p-2">
                <input
                  type="text"
                  placeholder="Search station..."
                  value={toQuery}
                  onChange={e => setToQuery(e.target.value)}
                  className="w-full text-xs p-1.5 border border-gray-300 rounded mb-2 text-gray-900 focus:outline-none focus:border-[#213D77]"
                  autoFocus
                />
                <div className="max-h-48 overflow-y-auto divide-y divide-gray-100">
                  {filteredToStations.map(stn => (
                    <div
                      key={stn.code}
                      onClick={() => { setCurrentTo(stn.code); setToOpen(false); }}
                      className="p-1.5 hover:bg-blue-50 text-xs font-semibold cursor-pointer flex justify-between"
                    >
                      <span>{stn.name}</span>
                      <span className="text-gray-500 font-mono">({stn.code})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Journey Date Input */}
          <div className="relative w-[140px] flex-shrink-0">
            <div className="bg-white text-gray-900 px-3 py-2 rounded-xs flex items-center gap-2 shadow-2xs border border-gray-200">
              <CalendarIcon className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
              <input
                type="date"
                value={currentDate}
                onChange={e => setCurrentDate(e.target.value)}
                className="text-[12.5px] font-bold text-gray-900 w-full focus:outline-none bg-transparent cursor-pointer"
              />
            </div>
          </div>

          {/* Classes Dropdown */}
          <div className="relative w-[150px] flex-shrink-0">
            <div
              onClick={() => { setClassOpen(!classOpen); setFromOpen(false); setToOpen(false); setQuotaOpen(false); }}
              className="bg-white text-gray-900 px-3 py-2 rounded-xs flex items-center justify-between gap-1 cursor-pointer shadow-2xs border border-gray-200"
            >
              <div className="flex items-center gap-2 truncate">
                <Briefcase className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
                <span className="text-[12.5px] font-bold truncate">
                  {currentClassObj ? currentClassObj.name : 'All Classes'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            </div>

            {classOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-white text-gray-800 rounded-sm shadow-xl border border-gray-200 z-50 p-1 divide-y divide-gray-100 max-h-60 overflow-y-auto">
                <div
                  onClick={() => { setCurrentClass('ALL'); setClassOpen(false); }}
                  className="p-2 hover:bg-blue-50 text-xs font-bold cursor-pointer"
                >
                  All Classes
                </div>
                {CLASSES.map(cls => (
                  <div
                    key={cls.code}
                    onClick={() => { setCurrentClass(cls.code); setClassOpen(false); }}
                    className="p-2 hover:bg-blue-50 text-xs font-semibold cursor-pointer flex justify-between"
                  >
                    <span>{cls.name}</span>
                    <span className="font-mono text-gray-500 font-bold">({cls.code})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quota Dropdown */}
          <div className="relative w-[150px] flex-shrink-0">
            <div
              onClick={() => { setQuotaOpen(!quotaOpen); setFromOpen(false); setToOpen(false); setClassOpen(false); }}
              className="bg-white text-gray-900 px-3 py-2 rounded-xs flex items-center justify-between gap-1 cursor-pointer shadow-2xs border border-gray-200"
            >
              <div className="flex items-center gap-2 truncate">
                <LayoutGrid className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
                <span className="text-[12.5px] font-bold truncate uppercase">
                  {(currentQuotaObj?.label || 'GENERAL').split(' ')[0]}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            </div>

            {quotaOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-white text-gray-800 rounded-sm shadow-xl border border-gray-200 z-50 p-1 divide-y divide-gray-100">
                {QUOTAS.map(q => (
                  <div
                    key={q.code}
                    onClick={() => { setCurrentQuota(q.code); setQuotaOpen(false); }}
                    className="p-2 hover:bg-blue-50 text-xs font-semibold cursor-pointer flex justify-between"
                  >
                    <span>{q.label}</span>
                    <span className="font-mono text-gray-500 font-bold">({q.code})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modify Search Button: Bright Orange */}
          <button
            type="submit"
            className="bg-[#FB792B] hover:bg-[#E65100] text-white font-bold text-[13px] sm:text-sm px-6 py-2 rounded-xs transition-colors flex-shrink-0 shadow-sm"
          >
            Modify Search
          </button>

        </div>

        {/* Bottom Options Row with Checkboxes matching screenshot */}
        <div className="flex items-center gap-6 text-xs text-white/95 pt-0.5 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={flexibleWithDate}
              onChange={e => setFlexibleWithDate(e.target.checked)}
              className="w-3.5 h-3.5 rounded-xs accent-[#FB792B] cursor-pointer"
            />
            <span className="font-semibold text-[11.5px] sm:text-xs">Flexible With Date</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={disabilityConcession}
              onChange={e => setDisabilityConcession(e.target.checked)}
              className="w-3.5 h-3.5 rounded-xs accent-[#FB792B] cursor-pointer"
            />
            <span className="font-semibold text-[11.5px] sm:text-xs">Person With Disability Concession</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={railwayPassConcession}
              onChange={e => setRailwayPassConcession(e.target.checked)}
              className="w-3.5 h-3.5 rounded-xs accent-[#FB792B] cursor-pointer"
            />
            <span className="font-semibold text-[11.5px] sm:text-xs">Railway Pass Concession</span>
          </label>
        </div>

      </form>
    </div>
  );
}
