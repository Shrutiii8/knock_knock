'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Train, ClassCode, QuotaCode } from '@/types';
import { useBooking } from '@/context/BookingContext';
import SearchResultsTopBar from '@/components/results/SearchResultsTopBar';
import FilterSidebar, { FilterState } from '@/components/results/FilterSidebar';
import SortBar, { SortOption } from '@/components/results/SortBar';
import TrainCard from '@/components/results/TrainCard';
import { TrainCardSkeleton } from '@/components/shared/SkeletonLoaders';
import { QUOTAS } from '@/lib/constants';

function SearchResultsContent() {
  const router = useRouter();
  const searchParamsFromUrl = useSearchParams();
  const { setSearchParams } = useBooking();

  // Defaults match the user's search
  const from = searchParamsFromUrl.get('from') || 'HWH';
  const to = searchParamsFromUrl.get('to') || 'RNC';
  const date = searchParamsFromUrl.get('date') || '2026-09-06';
  const quota = (searchParamsFromUrl.get('quota') || 'GN') as QuotaCode;
  const classCode = searchParamsFromUrl.get('classCode') || 'ALL';

  const [loading, setLoading] = useState(true);
  const [trains, setTrains] = useState<Train[]>([]);
  const [fromStationName, setFromStationName] = useState('HOWRAH JN');
  const [toStationName, setToStationName] = useState('RANCHI');

  // Filter and Sort states
  const [filters, setFilters] = useState<FilterState>({
    timeSlots: [],
    arrivalTimeSlots: [],
    trainTypes: [],
    classes: [],
    quota: quota
  });

  const [currentSort, setCurrentSort] = useState<SortOption>('DEPARTURE_ASC');

  // Fetch results from API
  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams({
      from,
      to,
      date,
      quota
    });

    const timer = setTimeout(() => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      fetch(`${apiUrl}/api/search?${query.toString()}`)
        .then(res => res.json())
        .then(data => {
          setTrains(data.trains || []);
          if (data.from?.name) setFromStationName(data.from.name);
          if (data.to?.name) setToStationName(data.to.name);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [from, to, date, quota]);

  // Handle Modify Search from Top Bar
  const handleTopBarSearch = (newFrom: string, newTo: string, newDate: string, newQuota: QuotaCode, newClass: string) => {
    const query = new URLSearchParams({
      from: newFrom,
      to: newTo,
      date: newDate,
      quota: newQuota,
      classCode: newClass
    });
    router.push(`/search-results?${query.toString()}`);
  };

  // Day navigation
  const handlePreviousDay = () => {
    const cur = new Date(date);
    cur.setDate(cur.getDate() - 1);
    const nextDateStr = cur.toISOString().split('T')[0];
    handleTopBarSearch(from, to, nextDateStr, quota, classCode);
  };

  const handleNextDay = () => {
    const cur = new Date(date);
    cur.setDate(cur.getDate() + 1);
    const nextDateStr = cur.toISOString().split('T')[0];
    handleTopBarSearch(from, to, nextDateStr, quota, classCode);
  };

  // Extract available train types
  const availableTrainTypes = useMemo(() => {
    const set = new Set<string>();
    trains.forEach(t => set.add(t.trainType));
    return Array.from(set);
  }, [trains]);

  // Apply filters and sorting
  const filteredAndSortedTrains = useMemo(() => {
    let list = [...trains];

    // Departure Time filter
    if (filters.timeSlots.length > 0) {
      list = list.filter(train => {
        const hour = parseInt(train.departureTime.split(':')[0], 10);
        return filters.timeSlots.some(slot => {
          if (slot === 'EARLY_MORNING') return hour >= 0 && hour < 6;
          if (slot === 'MORNING') return hour >= 6 && hour < 12;
          if (slot === 'AFTERNOON') return hour >= 12 && hour < 18;
          if (slot === 'NIGHT') return hour >= 18 && hour < 24;
          return false;
        });
      });
    }

    // Arrival Time filter
    if (filters.arrivalTimeSlots && filters.arrivalTimeSlots.length > 0) {
      list = list.filter(train => {
        const hour = parseInt(train.arrivalTime.split(':')[0], 10);
        return filters.arrivalTimeSlots!.some(slot => {
          if (slot === 'EARLY_MORNING') return hour >= 0 && hour < 6;
          if (slot === 'MORNING') return hour >= 6 && hour < 12;
          if (slot === 'AFTERNOON') return hour >= 12 && hour < 18;
          if (slot === 'NIGHT') return hour >= 18 && hour < 24;
          return false;
        });
      });
    }

    // Train type filter
    if (filters.trainTypes.length > 0) {
      list = list.filter(train => filters.trainTypes.includes(train.trainType));
    }

    // Class filter
    if (filters.classes.length > 0) {
      list = list.filter(train =>
        train.classes.some(c => filters.classes.includes(c.classCode))
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (currentSort === 'DEPARTURE_ASC') {
        return a.departureTime.localeCompare(b.departureTime);
      }
      if (currentSort === 'DEPARTURE_DESC') {
        return b.departureTime.localeCompare(a.departureTime);
      }
      return 0;
    });

    return list;
  }, [trains, filters, currentSort]);

  const handleResetFilters = () => {
    setFilters({
      timeSlots: [],
      arrivalTimeSlots: [],
      trainTypes: [],
      classes: [],
      quota: quota
    });
  };

  // Format date display: Sun, 06 Sep 2026
  const dateObj = new Date(date + 'T00:00:00');
  const dateFormattedDisplay = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
    : 'Sun, 06 Sep 2026';

  const dateFormattedShort = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })
    : 'Sun, 06 Sep';

  const quotaObj = QUOTAS.find(q => q.code === quota) || QUOTAS[0];

  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen select-none font-sans">
      
      {/* 1. Top Search / Filter Header Bar */}
      <SearchResultsTopBar
        from={from}
        to={to}
        date={date}
        quota={quota}
        classCode={classCode}
        fromStationName={fromStationName}
        toStationName={toStationName}
        onSearch={handleTopBarSearch}
      />

      {/* 2. Main 2-Column Content Container */}
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left Sidebar: Refine Results */}
          <aside className="lg:col-span-3 xl:col-span-3">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              availableTrainTypes={availableTrainTypes}
              fromStationName={fromStationName}
              toStationName={toStationName}
            />
          </aside>

          {/* Right Main Column: Sort & Train Cards */}
          <section className="lg:col-span-9 xl:col-span-9 space-y-3">
            
            {/* Sort & Results Banner */}
            <SortBar
              totalTrains={filteredAndSortedTrains.length}
              fromStationName={fromStationName}
              toStationName={toStationName}
              dateStr={dateFormattedDisplay}
              quotaName={(quotaObj?.label || 'GENERAL').split(' ')[0]}
              currentSort={currentSort}
              onSortChange={setCurrentSort}
              onPreviousDay={handlePreviousDay}
              onNextDay={handleNextDay}
            />

            {/* Loading Skeletons */}
            {loading && (
              <div className="space-y-3">
                <TrainCardSkeleton />
                <TrainCardSkeleton />
                <TrainCardSkeleton />
              </div>
            )}

            {/* Train Cards List */}
            {!loading && filteredAndSortedTrains.length > 0 && (
              <div>
                {filteredAndSortedTrains.map(train => (
                  <TrainCard 
                    key={train.trainNumber} 
                    train={train} 
                    searchDate={dateFormattedShort}
                  />
                ))}
              </div>
            )}

            {/* No Results Fallback */}
            {!loading && filteredAndSortedTrains.length === 0 && (
              <div className="bg-white border border-gray-200 p-10 text-center shadow-2xs space-y-3">
                <h3 className="text-sm font-bold text-gray-800">No Trains Found Matching Your Filters</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Try unchecking some filters or changing your travel date.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-1.5 bg-[#213D77] text-white text-xs font-bold rounded-xs cursor-pointer"
                >
                  Remove All Filters
                </button>
              </div>
            )}

          </section>

        </div>
      </div>

    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-gray-500 font-bold">Loading Train Search Results...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
