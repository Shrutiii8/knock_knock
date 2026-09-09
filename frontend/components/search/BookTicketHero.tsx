'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  BarChart3,
  RotateCcw,
  MapPin,
  Send,
  ArrowLeftRight,
  Calendar as CalendarIcon,
  Briefcase,
  LayoutGrid,
  ChevronDown,
  Check
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/context/AuthContext';
import { QUOTAS, CLASSES } from '@/lib/constants';
import { QuotaCode, ClassCode } from '@/types';
import stationsData from '@/data/stations.json';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function BookTicketHero() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const { searchParams, setSearchParams, bookings } = useBooking();
  const { t, language } = useLanguage();

  const defaultDateObj = new Date('2026-09-06T00:00:00');
  const journeyDateObj = bookings && bookings.length > 0 && bookings[0].journeyDate
    ? new Date(bookings[0].journeyDate)
    : defaultDateObj;

  const formattedDate = journeyDateObj.toLocaleDateString(language === 'HI' ? 'hi-IN' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const fallbackTxn = {
    id: '100006796029992',
    status: 'BOOKED',
    date: '27 Aug 2026',
    from: 'HWH',
    to: 'RNC',
    classCode: '3E'
  };

  const lastTxn = bookings && bookings.length > 0 && bookings[0].pnrNumber !== '2458921473' ? {
    id: bookings[0].pnrNumber || '100006796029992',
    status: bookings[0].bookingStatus === 'CONFIRMED' ? 'BOOKED' : (bookings[0].bookingStatus || 'BOOKED'),
    date: formattedDate,
    from: bookings[0].fromStation || 'HWH',
    to: bookings[0].toStation || 'RNC',
    classCode: bookings[0].selectedClass || '3E'
  } : fallbackTxn;

  // Filter for upcoming journeys (bookings made in this session with future travel dates)
  const upcomingJourneys = (bookings || []).filter(b => {
    if (b.pnrNumber === '100006796029992' || b.pnrNumber === '2458921473' || b.pnrNumber === '4521098472') {
      return false; // past demo records
    }
    return new Date(b.journeyDate) >= new Date('2026-09-06');
  });

  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [quotaOpen, setQuotaOpen] = useState(false);

  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');

  // Checkbox filters
  const [disabilityConcession, setDisabilityConcession] = useState(false);
  const [flexibleWithDate, setFlexibleWithDate] = useState(false);
  const [railwayPassConcession, setRailwayPassConcession] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const classRef = useRef<HTMLDivElement>(null);
  const quotaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) setFromOpen(false);
      if (toRef.current && !toRef.current.contains(e.target as Node)) setToOpen(false);
      if (classRef.current && !classRef.current.contains(e.target as Node)) setClassOpen(false);
      if (quotaRef.current && !quotaRef.current.contains(e.target as Node)) setQuotaOpen(false);
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

  const handleSearchTrains = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchParams.from || !searchParams.to) {
      alert(t('selectStationsAlert'));
      return;
    }
    const query = new URLSearchParams({
      from: searchParams.from,
      to: searchParams.to,
      date: searchParams.date,
      quota: searchParams.quota,
      classCode: searchParams.classCode || 'ALL',
      acOnly: searchParams.acOnly ? 'true' : 'false'
    });
    router.push(`/search-results?${query.toString()}`);
  };

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

  const selectedClassObj = CLASSES.find(c => c.code === searchParams.classCode);
  const currentQuotaObj = QUOTAS.find(q => q.code === searchParams.quota) || QUOTAS[0];

  return (
    <div className="relative w-full select-none overflow-hidden min-h-[600px] border-b border-gray-200">

      {/* Background Image: Vande Bharat White Train spanning full screen edge-to-edge */}
      <div
        className="absolute inset-0 bg-cover bg-right lg:bg-center"
        style={{ backgroundImage: "url('/images/vande_bharat_white.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Main Grid Content Centered within standard viewport max-width */}
      <div className="relative z-10 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* Left: Book Ticket Card (lg:col-span-7 xl:col-span-6) with Background Shadow Element */}
        <div className="relative lg:col-span-7 xl:col-span-6 max-w-[560px] w-full">
          {/* Background Ambient Shadow Element */}
          <div className="hero-ambient-glow" />
          <div className="hero-bottom-grounding-shadow" />

          {/* Main Card Container */}
          <div className="relative z-10 w-full hero-box-shadow rounded-md overflow-hidden bg-white">
            {/* Top 4 Dark Navy Tabs (2 Rows x 2 Columns) matching official IRCTC */}
            <div className="bg-[#213D77] text-white text-xs font-bold uppercase tracking-wider border-b border-[#325399]">
              {/* Row 1 */}
              <div className="grid grid-cols-2 divide-x divide-[#325399] border-b border-[#325399]">
                {/* Tab 1: PNR STATUS */}
                <Link
                  href="/pnr-status"
                  className="py-2.5 px-3 sm:px-4 flex items-center justify-center gap-2 hover:bg-[#182F5D] transition-colors text-center"
                >
                  <div className="w-3.5 h-3.5 rounded-xs border border-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold tracking-wider">{t('pnrStatus')}</span>
                </Link>

                {/* Tab 2: CHARTS / VACANCY */}
                <Link
                  href="/search-results"
                  className="py-2.5 px-3 sm:px-4 flex items-center justify-center gap-2 hover:bg-[#182F5D] transition-colors text-center"
                >
                  <BarChart3 className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold tracking-wider">{t('chartsVacancy')}</span>
                </Link>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 divide-x divide-[#325399]">
                {/* Tab 3: Refund Status */}
                <Link
                  href="/cancel-ticket"
                  className="py-2.5 px-3 sm:px-4 flex items-center justify-center gap-2 hover:bg-[#182F5D] transition-colors text-center"
                >
                  <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-[10px] font-bold leading-none">
                    ₹
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold tracking-wider normal-case sm:uppercase">{t('refundStatusTab')}</span>
                </Link>

                {/* Tab 4: Re-Book Favourite Journey */}
                <button
                  type="button"
                  onClick={() => {
                    setSearchParams({
                      from: 'HWH',
                      fromName: 'Howrah Junction',
                      to: 'RNC',
                      toName: 'Ranchi Junction'
                    });
                  }}
                  className="py-2.5 px-3 sm:px-4 flex items-center justify-center gap-2 hover:bg-[#182F5D] transition-colors text-center cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold tracking-wider normal-case sm:uppercase">{t('rebookFavouriteTab')}</span>
                </button>
              </div>
            </div>

            {/* White Card Container Flush Under Tabs */}
            <div className="bg-white p-5 sm:p-7 space-y-4">

              {/* Title: BOOK TICKET */}
              <h2 className="text-2xl sm:text-[26px] font-black text-[#213D77] text-center tracking-wider uppercase mb-5">
                {t('bookTicket')}
              </h2>

              <form onSubmit={handleSearchTrains} className="space-y-4 text-xs">

                {/* Row 1: From Station, Swap Button, To Station */}
                <div className="flex items-center gap-2">
                  {/* From Input */}
                  <div className="relative flex-1" ref={fromRef}>
                    <div
                      onClick={() => setFromOpen(true)}
                      className="flex items-center gap-2.5 px-3 py-2.5 border border-gray-300 rounded focus-within:border-[#213D77] bg-white cursor-pointer shadow-2xs hover:border-gray-400 transition-colors"
                    >
                      <Send className="w-4 h-4 text-[#213D77] -rotate-45 flex-shrink-0" />
                      <div className="flex-1 truncate">
                        <span className="font-semibold text-gray-800 text-xs">
                          {searchParams.from ? `${searchParams.fromName} (${searchParams.from})` : t('from')}
                        </span>
                      </div>
                    </div>

                    {fromOpen && (
                      <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-2xl z-50 p-2 max-h-56 overflow-y-auto">
                        <input
                          type="text"
                          autoFocus
                          value={fromQuery}
                          onChange={e => setFromQuery(e.target.value)}
                          placeholder={t('searchOrigin')}
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded outline-hidden text-xs font-medium mb-1"
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
                              className="p-1.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between text-xs"
                            >
                              <span className="font-bold text-gray-800">{stn.name}</span>
                              <span className="font-mono text-[10px] bg-[#213D77] text-white px-1 py-0.2 rounded font-bold">
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
                    className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-[#213D77] transition-all flex-shrink-0 group"
                    title="Swap stations"
                    aria-label="Swap stations"
                  >
                    <ArrowLeftRight className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  </button>

                  {/* To Input */}
                  <div className="relative flex-1" ref={toRef}>
                    <div
                      onClick={() => setToOpen(true)}
                      className="flex items-center gap-2.5 px-3 py-2.5 border border-gray-300 rounded focus-within:border-[#213D77] bg-white cursor-pointer shadow-2xs"
                    >
                      <MapPin className="w-4 h-4 text-[#213D77] flex-shrink-0" />
                      <div className="flex-1 truncate">
                        <span className="font-semibold text-gray-800 text-xs">
                          {searchParams.to ? `${searchParams.toName} (${searchParams.to})` : t('to')}
                        </span>
                      </div>
                    </div>

                    {toOpen && (
                      <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-2xl z-50 p-2 max-h-56 overflow-y-auto">
                        <input
                          type="text"
                          autoFocus
                          value={toQuery}
                          onChange={e => setToQuery(e.target.value)}
                          placeholder={t('searchDestination')}
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded outline-hidden text-xs font-medium mb-1"
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
                              className="p-1.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between text-xs"
                            >
                              <span className="font-bold text-gray-800">{stn.name}</span>
                              <span className="font-mono text-[10px] bg-[#213D77] text-white px-1 py-0.2 rounded font-bold">
                                {stn.code}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 2: Date with Label + Class Dropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  {/* Date Input with DD/MM/YYYY * label */}
                  <div>
                    <label className="text-[11px] font-bold text-[#213D77] block mb-1">
                      {t('date')}
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={searchParams.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setSearchParams({ date: e.target.value })}
                        className="w-full text-xs font-bold px-3 py-2.5 pl-9 border border-gray-300 rounded focus:border-[#213D77] outline-hidden bg-white text-gray-800 cursor-pointer shadow-2xs hover:border-gray-400 transition-colors"
                      />
                      <CalendarIcon className="w-4 h-4 text-[#213D77] absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Class Dropdown */}
                  <div>
                    <div className="relative" ref={classRef}>
                      <div
                        onClick={() => setClassOpen(!classOpen)}
                        className="flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded cursor-pointer bg-white shadow-2xs hover:border-gray-400 transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Briefcase className="w-4 h-4 text-[#213D77] flex-shrink-0" />
                          <span className="font-bold text-gray-800 text-xs truncate">
                            {selectedClassObj ? selectedClassObj.name : t('allClasses')}
                          </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>

                      {classOpen && (
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-xl z-50 py-1 text-xs max-h-56 overflow-y-auto">
                          <div
                            onClick={() => {
                              setSearchParams({ classCode: undefined });
                              setClassOpen(false);
                            }}
                            className="px-3 py-1.5 hover:bg-blue-50 cursor-pointer font-bold text-gray-800"
                          >
                            {t('allClasses')}
                          </div>
                          {CLASSES.map(c => (
                            <div
                              key={c.code}
                              onClick={() => {
                                setSearchParams({ classCode: c.code });
                                setClassOpen(false);
                              }}
                              className="px-3 py-1.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                            >
                              <span>{c.name}</span>
                              {searchParams.classCode === c.code && <Check className="w-3.5 h-3.5 text-[#213D77]" />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Row 3: Quota Dropdown */}
                <div className="relative" ref={quotaRef}>
                  <div
                    onClick={() => setQuotaOpen(!quotaOpen)}
                    className="flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded cursor-pointer bg-white shadow-2xs hover:border-gray-400 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <LayoutGrid className="w-4 h-4 text-[#213D77] flex-shrink-0" />
                      <span className="font-bold text-gray-800 text-xs truncate uppercase">
                        {currentQuotaObj.label}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>

                  {quotaOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-xl z-50 py-1 text-xs max-h-56 overflow-y-auto">
                      {QUOTAS.map(q => (
                        <div
                          key={q.code}
                          onClick={() => {
                            setSearchParams({ quota: q.code });
                            setQuotaOpen(false);
                          }}
                          className="px-3 py-1.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                        >
                          <span className="font-semibold">{q.label}</span>
                          {searchParams.quota === q.code && <Check className="w-3.5 h-3.5 text-[#213D77]" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Checkboxes Row - Exact 2-column layout matching Screenshot 1 */}
                <div className="pt-1 text-[11px] text-[#213D77] font-bold">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-y-2 gap-x-2">
                    {/* Left Column (sm:col-span-7) */}
                    <div className="sm:col-span-7 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={disabilityConcession}
                          onChange={e => {
                            setDisabilityConcession(e.target.checked);
                            setSearchParams({ disabledConcession: e.target.checked });
                          }}
                          className="w-4 h-4 rounded-xs border-2 border-[#90CAF9] bg-[#E3F2FD] text-[#213D77] focus:ring-0 cursor-pointer"
                        />
                        <span className="leading-tight">{t('disabilityConcession')}</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={railwayPassConcession}
                          onChange={e => setRailwayPassConcession(e.target.checked)}
                          className="w-4 h-4 rounded-xs border-2 border-[#90CAF9] bg-[#E3F2FD] text-[#213D77] focus:ring-0 cursor-pointer"
                        />
                        <span className="leading-tight">{t('railwayPassConcession')}</span>
                      </label>
                    </div>

                    {/* Right Column (sm:col-span-5) */}
                    <div className="sm:col-span-5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={flexibleWithDate}
                          onChange={e => setFlexibleWithDate(e.target.checked)}
                          className="w-4 h-4 rounded-xs border-2 border-[#90CAF9] bg-[#E3F2FD] text-[#213D77] focus:ring-0 cursor-pointer"
                        />
                        <span className="leading-tight">{t('flexibleWithDate')}</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Search Trains Button - Centered pill/rounded rectangle */}
                <div className="pt-3 flex justify-center">
                  <button
                    type="submit"
                    className="px-8 py-2.5 bg-[#FB792B] hover:bg-[#E65100] text-white font-bold text-xs sm:text-sm rounded cursor-pointer transition-all shadow-md active:scale-98 tracking-wide uppercase"
                  >
                    {t('searchTrains')}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>

        {/* Right Column: If Logged In -> Last Transaction Detail Card; Else -> BHARAT RAILWAYS Branding */}
        <div className="lg:col-span-5 xl:col-span-6 flex flex-col items-center lg:items-end justify-start select-none">
          {isLoggedIn ? (
            <div className="relative w-full max-w-[540px] space-y-4">

              {/* Card 1: Last Transaction Detail */}
              <div className="relative w-full">
                {/* Background Ambient Shadow Element */}
                <div className="hero-ambient-glow" />
                <div className="hero-bottom-grounding-shadow" />

                {/* Main Card Container */}
                <div className="relative z-10 w-full bg-white hero-box-shadow overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 text-left border border-gray-200/80">
                  {/* Card Header Bar */}
                  <div className="bg-[#213D77] text-white px-4 py-2 flex items-center justify-between">
                    <span className="font-bold text-[13px] sm:text-[14px] tracking-wide">
                      {t('lastTransactionDetail')}
                    </span>
                    <Link
                      href="/account?tab=bookings"
                      className="text-white hover:text-amber-300 font-bold text-[11px] sm:text-xs underline transition-colors cursor-pointer"
                    >
                      {t('viewDetails')}
                    </Link>
                  </div>

                  {/* Transaction Data Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#E5E7EB] text-gray-900 text-[11px] sm:text-[11.5px] font-bold border-b border-gray-300">
                          <th className="py-2.5 px-3 sm:px-4 font-bold">{t('transactionId')}</th>
                          <th className="py-2.5 px-3 sm:px-4 font-bold">{t('statusHeader')}</th>
                          <th className="py-2.5 px-3 sm:px-4 font-bold">{t('dateHeader')}</th>
                          <th className="py-2.5 px-3 sm:px-4 font-bold">{t('fromHeader')}</th>
                          <th className="py-2.5 px-3 sm:px-4 font-bold">{t('toHeader')}</th>
                          <th className="py-2.5 px-3 sm:px-4 font-bold">{t('classHeader')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-[12px] bg-white text-gray-900 border-b border-gray-100">
                          <td className="py-3 px-3 sm:px-4 font-mono font-bold text-gray-950">
                            {lastTxn.id}
                          </td>
                          <td className="py-3 px-3 sm:px-4">
                            <span className="text-[#008000] font-black tracking-wide">
                              {t('bookedStatus')}
                            </span>
                          </td>
                          <td className="py-3 px-3 sm:px-4 font-bold text-gray-900 whitespace-nowrap">
                            {lastTxn.date}
                          </td>
                          <td className="py-3 px-3 sm:px-4 font-bold text-gray-900">
                            {lastTxn.from}
                          </td>
                          <td className="py-3 px-3 sm:px-4 font-bold text-gray-900">
                            {lastTxn.to}
                          </td>
                          <td className="py-3 px-3 sm:px-4 font-bold text-gray-900">
                            {lastTxn.classCode}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Card 2: Upcoming Journey */}
              <div className="relative w-full">
                {/* Background Ambient Shadow Element */}
                <div className="hero-ambient-glow" />
                <div className="hero-bottom-grounding-shadow" />

                {/* Main Card Container */}
                <div className="relative z-10 w-full bg-white hero-box-shadow overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 text-left border border-gray-200/80">
                  {/* Card Header Bar */}
                  <div className="bg-[#213D77] text-white px-4 py-2 flex items-center justify-between">
                    <span className="font-bold text-[13px] sm:text-[14px] tracking-wide">
                      {t('upcomingJourney')}
                    </span>
                    <Link
                      href="/account?tab=bookings"
                      className="text-white hover:text-amber-300 font-bold text-[11px] sm:text-xs underline transition-colors cursor-pointer"
                    >
                      {t('viewAllJourneys')}
                    </Link>
                  </div>

                  {/* Upcoming Journey Body */}
                  {upcomingJourneys.length === 0 ? (
                    <div className="py-6 sm:py-7 text-center text-gray-900 font-bold text-[13px] sm:text-[14px] bg-white">
                      {t('noUpcomingJourneys')}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#E5E7EB] text-gray-900 text-[11px] sm:text-[11.5px] font-bold border-b border-gray-300">
                            <th className="py-2.5 px-3 sm:px-4 font-bold">{t('transactionId')}</th>
                            <th className="py-2.5 px-3 sm:px-4 font-bold">{t('statusHeader')}</th>
                            <th className="py-2.5 px-3 sm:px-4 font-bold">{t('dateHeader')}</th>
                            <th className="py-2.5 px-3 sm:px-4 font-bold">{t('fromHeader')}</th>
                            <th className="py-2.5 px-3 sm:px-4 font-bold">{t('toHeader')}</th>
                            <th className="py-2.5 px-3 sm:px-4 font-bold">{t('classHeader')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingJourneys.map(uj => (
                            <tr key={uj.id} className="text-[12px] bg-white text-gray-900 border-b border-gray-100">
                              <td className="py-3 px-3 sm:px-4 font-mono font-bold text-gray-950">
                                {uj.pnrNumber}
                              </td>
                              <td className="py-3 px-3 sm:px-4">
                                <span className="text-[#008000] font-black tracking-wide">
                                  {t('bookedStatus')}
                                </span>
                              </td>
                              <td className="py-3 px-3 sm:px-4 font-bold text-gray-900 whitespace-nowrap">
                                {new Date(uj.journeyDate).toLocaleDateString(language === 'HI' ? 'hi-IN' : 'en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </td>
                              <td className="py-3 px-3 sm:px-4 font-bold text-gray-900">
                                {uj.fromStation}
                              </td>
                              <td className="py-3 px-3 sm:px-4 font-bold text-gray-900">
                                {uj.toStation}
                              </td>
                              <td className="py-3 px-3 sm:px-4 font-bold text-gray-900">
                                {uj.selectedClass}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-start pt-4 sm:pt-8 lg:pt-10 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[56px] font-bold text-[#1C356C] tracking-wider uppercase font-sans leading-tight">
                {t('bharatRailways')}
              </h1>
              <div className="mt-2.5 sm:mt-3.5 flex items-center justify-center gap-3 sm:gap-4 text-sm sm:text-base md:text-lg lg:text-[20px] font-semibold text-[#1C356C] tracking-wide">
                <span>{t('safety')}</span>
                <span className="text-[#1C356C]/50 font-light">|</span>
                <span>{t('security')}</span>
                <span className="text-[#1C356C]/50 font-light">|</span>
                <span>{t('punctuality')}</span>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
