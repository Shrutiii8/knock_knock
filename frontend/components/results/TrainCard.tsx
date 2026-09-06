'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Train, ClassCode } from '@/types';
import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/context/AuthContext';
import ClassAvailabilityPill from './ClassAvailabilityPill';
import { X } from 'lucide-react';

interface TrainCardProps {
  train: Train;
  searchDate?: string;
}

export default function TrainCard({ train, searchDate = 'Sun, 06 Sep' }: TrainCardProps) {
  const router = useRouter();
  const { selectTrainAndClass } = useBooking();
  const { isLoggedIn, openLoginModal } = useAuth();

  const [selectedClass, setSelectedClass] = useState<ClassCode | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showOtherDatesModal, setShowOtherDatesModal] = useState(false);

  const handleSelectClass = (cls: ClassCode) => {
    setSelectedClass(cls);
  };

  const handleBookNow = () => {
    if (!selectedClass) {
      alert('Please select a travel class (e.g. 2S, CC, 3A, SL) before booking.');
      return;
    }
    selectTrainAndClass(train, selectedClass);
    if (!isLoggedIn) {
      openLoginModal('/booking');
      return;
    }
    router.push('/booking');
  };

  // Determine if train is Vande Bharat for the blue bookmark corner tag
  const isVandeBharat = 
    train.trainName.toUpperCase().includes('VANDE BHARAT') || 
    train.trainNumber === '20897';

  // Format Departure & Arrival display
  const depTime = train.departureTime;
  const arrTime = train.arrivalTime;
  const depStation = train.sourceStation === 'HWH' ? 'HOWRAH JN' : (train.route[0]?.stationName?.toUpperCase() || train.sourceStation);
  const arrStation = train.destinationStation === 'RNC' ? 'RANCHI' : (train.route[train.route.length - 1]?.stationName?.toUpperCase() || train.destinationStation);

  // Check if arrival is next day (e.g., Kriya Yoga Exp arrives 05:40 on Mon, 07 Sep)
  const isNextDay = train.trainNumber === '18615' || (parseInt(arrTime.split(':')[0], 10) < parseInt(depTime.split(':')[0], 10));
  const arrDateStr = isNextDay ? 'Mon, 07 Sep' : searchDate;

  // Runs on days (M T W T F S S)
  const dayLetters = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="relative bg-white border border-gray-200 shadow-2xs hover:shadow-sm transition-shadow select-none mb-4">
      
      {/* Blue Bookmark Corner Tag for Vande Bharat */}
      {isVandeBharat && (
        <div 
          className="absolute top-0 left-0 w-0 h-0 border-t-[20px] border-t-[#0074D9] border-r-[20px] border-r-transparent z-10"
          title="Vande Bharat Flagship Express"
        />
      )}

      <div className="p-4 sm:p-5 space-y-4">
        
        {/* Row 1: Train Name & Number | Runs On | Train Schedule */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
          
          {/* Train Name and Number */}
          <h3 className="font-bold text-[14.5px] sm:text-[15.5px] text-gray-900 tracking-tight">
            {train.trainName.toUpperCase()} ({train.trainNumber})
          </h3>

          {/* Runs On Days: M T W T F S S */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-600 font-medium">Runs On:</span>
            <div className="flex items-center gap-1.5 font-mono text-[12px]">
              {dayLetters.map((letter, idx) => {
                const runs = train.runsOnDays ? train.runsOnDays[idx] : true;
                return (
                  <span
                    key={`${letter}-${idx}`}
                    className={`font-bold ${runs ? 'text-gray-900' : 'text-gray-300 font-normal'}`}
                  >
                    {letter}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Train Schedule Link */}
          <button
            type="button"
            onClick={() => setShowScheduleModal(true)}
            className="text-[#0074D9] hover:underline font-semibold text-xs transition-colors cursor-pointer"
          >
            Train Schedule
          </button>

        </div>

        {/* Row 2: Timing Row (Departure | Duration Line | Arrival) */}
        <div className="flex items-center justify-between gap-2 py-1">
          
          {/* Departure */}
          <div className="text-left flex items-baseline gap-2">
            <span className="font-bold text-[20px] sm:text-[22px] text-gray-900 font-sans tracking-tight">
              {depTime}
            </span>
            <span className="text-gray-400 font-light">|</span>
            <span className="text-[12.5px] sm:text-[13px] font-bold text-gray-900">
              {depStation}
            </span>
            <span className="text-gray-400 font-light">|</span>
            <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
              {searchDate}
            </span>
          </div>

          {/* Centered Duration Line: —— 10:05 —— */}
          <div className="hidden sm:flex items-center gap-2 text-gray-500 text-xs font-semibold">
            <div className="w-10 sm:w-16 h-[1px] bg-gray-300" />
            <span className="font-medium text-gray-700 tracking-wide text-xs">
              {train.duration.replace('h ', ':').replace('m', '')}
            </span>
            <div className="w-10 sm:w-16 h-[1px] bg-gray-300" />
          </div>

          {/* Arrival */}
          <div className="text-right flex items-baseline gap-2">
            <span className="font-bold text-[20px] sm:text-[22px] text-gray-900 font-sans tracking-tight">
              {arrTime}
            </span>
            <span className="text-gray-400 font-light">|</span>
            <span className="text-[12.5px] sm:text-[13px] font-bold text-gray-900">
              {arrStation}
            </span>
            <span className="text-gray-400 font-light">|</span>
            <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
              {arrDateStr}
            </span>
          </div>

        </div>

        {/* Row 3: Class Availability Box Pills */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          {train.classes.map(availability => (
            <ClassAvailabilityPill
              key={availability.classCode}
              availability={availability}
              isSelected={selectedClass === availability.classCode}
              onSelect={() => handleSelectClass(availability.classCode)}
              dateStr={searchDate}
            />
          ))}
        </div>

        {/* Row 4: NTES Disclaimer Notice */}
        <div className="text-xs text-gray-800 font-bold">
          <span>Please check </span>
          <a
            href="https://enquiry.indianrail.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0074D9] hover:underline font-bold"
          >
            NTES website
          </a>
          <span> or </span>
          <a
            href="https://enquiry.indianrail.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0074D9] hover:underline font-bold"
          >
            NTES app
          </a>
          <span> for actual time before boarding</span>
        </div>

        {/* Row 5: Action Buttons (Book Now & OTHER DATES) */}
        <div className="flex items-center gap-3 pt-1">
          {/* Book Now Button */}
          <button
            type="button"
            onClick={handleBookNow}
            disabled={!selectedClass}
            className={`px-5 py-2 rounded-xs font-bold text-xs tracking-wider transition-colors select-none ${
              selectedClass
                ? 'bg-[#FB792B] hover:bg-[#E65100] text-white cursor-pointer shadow-sm'
                : 'bg-[#FBC4A2] text-white cursor-not-allowed'
            }`}
          >
            Book Now
          </button>

          {/* OTHER DATES Button */}
          <button
            type="button"
            onClick={() => setShowOtherDatesModal(true)}
            className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 font-bold px-4 py-2 rounded-xs text-xs tracking-wider uppercase transition-colors shadow-2xs cursor-pointer"
          >
            OTHER DATES
          </button>
        </div>

      </div>

      {/* Train Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-md max-w-xl w-full p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-sm text-gray-900 uppercase">
                {train.trainName} ({train.trainNumber}) Timetable Schedule
              </h4>
              <button 
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 font-bold border-b">
                  <th className="p-2">Station</th>
                  <th className="p-2">Arr</th>
                  <th className="p-2">Dep</th>
                  <th className="p-2">Halt</th>
                  <th className="p-2">Day</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {train.route.map(r => (
                  <tr key={r.stationCode} className="hover:bg-gray-50">
                    <td className="p-2 font-bold">{r.stationName} ({r.stationCode})</td>
                    <td className="p-2">{r.arrival}</td>
                    <td className="p-2">{r.departure}</td>
                    <td className="p-2">{r.haltMin > 0 ? `${r.haltMin}m` : '-'}</td>
                    <td className="p-2">{r.day}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Other Dates Modal */}
      {showOtherDatesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-md max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-sm text-gray-900 uppercase">
                Availability on Alternate Dates ({train.trainNumber})
              </h4>
              <button 
                type="button"
                onClick={() => setShowOtherDatesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['Mon, 07 Sep', 'Tue, 08 Sep', 'Wed, 09 Sep', 'Thu, 10 Sep', 'Fri, 11 Sep', 'Sat, 12 Sep'].map((d, i) => (
                <div key={d} className="p-2.5 border rounded text-xs bg-gray-50 text-center hover:border-orange-500 cursor-pointer">
                  <div className="font-bold text-gray-900">{d}</div>
                  <div className="text-[11px] font-bold text-green-700 mt-1">AVAILABLE-{120 - i * 15}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
