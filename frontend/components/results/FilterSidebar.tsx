'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { ClassCode, QuotaCode } from '@/types';

export interface FilterState {
  timeSlots: string[]; // Departure: 'EARLY_MORNING' | 'MORNING' | 'AFTERNOON' | 'NIGHT'
  arrivalTimeSlots?: string[];
  trainTypes: string[];
  classes: ClassCode[];
  fromStations?: string[];
  toStations?: string[];
  quota: QuotaCode;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (updated: FilterState) => void;
  onReset: () => void;
  availableTrainTypes: string[];
  fromStationName?: string;
  toStationName?: string;
}

const ALL_JOURNEY_CLASSES: { code: ClassCode; name: string }[] = [
  { code: '1A', name: 'AC First Class (1A)' },
  { code: '2A', name: 'AC 2 Tier (2A)' },
  { code: '2S', name: 'Second Sitting (2S)' },
  { code: '3A', name: 'AC 3 Tier (3A)' },
  { code: '3E', name: 'AC 3 Economy (3E)' },
  { code: 'CC', name: 'AC Chair car (CC)' },
  { code: 'EC', name: 'Exec. Chair Car (EC)' },
  { code: 'SL', name: 'Sleeper (SL)' }
];

export default function FilterSidebar({
  filters,
  onChange,
  onReset,
  availableTrainTypes,
  fromStationName = 'HOWRAH JN',
  toStationName = 'RANCHI'
}: FilterSidebarProps) {
  // Collapsible sections
  const [classCollapsed, setClassCollapsed] = useState(false);
  const [typeCollapsed, setTypeCollapsed] = useState(false);
  const [depTimeCollapsed, setDepTimeCollapsed] = useState(false);
  const [arrTimeCollapsed, setArrTimeCollapsed] = useState(false);
  const [fromCollapsed, setFromCollapsed] = useState(false);
  const [toCollapsed, setToCollapsed] = useState(false);

  // Time sliders state
  const [depSlider, setDepSlider] = useState(24);
  const [arrSlider, setArrSlider] = useState(24);

  const toggleClass = (code: ClassCode) => {
    const isSelected = filters.classes.includes(code);
    const next = isSelected
      ? filters.classes.filter(c => c !== code)
      : [...filters.classes, code];
    onChange({ ...filters, classes: next });
  };

  const handleSelectAllClasses = () => {
    if (filters.classes.length === ALL_JOURNEY_CLASSES.length) {
      onChange({ ...filters, classes: [] });
    } else {
      onChange({ ...filters, classes: ALL_JOURNEY_CLASSES.map(c => c.code) });
    }
  };

  const toggleTrainType = (type: string) => {
    const isSelected = filters.trainTypes.includes(type);
    const next = isSelected
      ? filters.trainTypes.filter(t => t !== type)
      : [...filters.trainTypes, type];
    onChange({ ...filters, trainTypes: next });
  };

  const toggleDepTimeSlot = (slot: string) => {
    const isSelected = filters.timeSlots.includes(slot);
    const next = isSelected
      ? filters.timeSlots.filter(s => s !== slot)
      : [...filters.timeSlots, slot];
    onChange({ ...filters, timeSlots: next });
  };

  const toggleArrTimeSlot = (slot: string) => {
    const arr = filters.arrivalTimeSlots || [];
    const isSelected = arr.includes(slot);
    const next = isSelected
      ? arr.filter(s => s !== slot)
      : [...arr, slot];
    onChange({ ...filters, arrivalTimeSlots: next });
  };

  return (
    <div className="bg-white rounded-none border border-gray-200 shadow-2xs divide-y divide-gray-200 text-gray-800 text-xs select-none">

      {/* Top Header: Refine Results & Remove Filter */}
      <div className="p-3.5 flex items-center justify-between">
        <h3 className="font-bold text-[13px] text-gray-900 tracking-tight">Refine Results</h3>
        <button
          type="button"
          onClick={onReset}
          className="text-[#FB792B] hover:text-[#E65100] font-bold text-[12px] cursor-pointer transition-colors"
        >
          Remove Filter
        </button>
      </div>

      {/* 1. JOURNEY CLASS */}
      <div className="p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[11px] text-gray-800 tracking-wider uppercase">JOURNEY CLASS</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAllClasses}
              className="bg-[#E6F4FA] hover:bg-[#D4EDF9] text-[#0074D9] font-bold text-[10.5px] px-2.5 py-0.5 rounded-xs transition-colors"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => setClassCollapsed(!classCollapsed)}
              className="text-gray-400 hover:text-gray-600"
            >
              {classCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {!classCollapsed && (
          <div className="grid grid-cols-2 gap-x-2 gap-y-2 pt-1">
            {ALL_JOURNEY_CLASSES.map(item => {
              const isChecked = filters.classes.length === 0 || filters.classes.includes(item.code);
              return (
                <label key={item.code} className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-gray-800 truncate">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleClass(item.code)}
                    className="w-3.5 h-3.5 rounded-xs accent-[#213D77] cursor-pointer flex-shrink-0"
                  />
                  <span className="truncate">{item.name}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. TRAIN TYPE */}
      <div className="p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[11px] text-gray-800 tracking-wider uppercase">TRAIN TYPE</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChange({ ...filters, trainTypes: [] })}
              className="bg-[#E6F4FA] hover:bg-[#D4EDF9] text-[#0074D9] font-bold text-[10.5px] px-2.5 py-0.5 rounded-xs transition-colors"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => setTypeCollapsed(!typeCollapsed)}
              className="text-gray-400 hover:text-gray-600"
            >
              {typeCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {!typeCollapsed && (
          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[11px] font-semibold text-gray-800">
              <input
                type="checkbox"
                checked={filters.trainTypes.length === 0 || filters.trainTypes.includes('OTHER')}
                onChange={() => toggleTrainType('OTHER')}
                className="w-3.5 h-3.5 rounded-xs accent-[#213D77] cursor-pointer"
              />
              <span className="w-3 h-3 border border-gray-300 rounded-2xs inline-block bg-white" />
              <span>OTHER</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-[11px] font-semibold text-gray-800">
              <input
                type="checkbox"
                checked={filters.trainTypes.length === 0 || filters.trainTypes.includes('SHATABDI')}
                onChange={() => toggleTrainType('SHATABDI')}
                className="w-3.5 h-3.5 rounded-xs accent-[#213D77] cursor-pointer"
              />
              <span className="w-3 h-3 rounded-2xs inline-block bg-[#0074D9]" />
              <span>SHATABDI</span>
            </label>
          </div>
        )}
      </div>

      {/* 3. DEPARTURE TIME */}
      <div className="p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[11px] text-gray-800 tracking-wider uppercase">DEPARTURE TIME</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChange({ ...filters, timeSlots: [] })}
              className="bg-[#E6F4FA] hover:bg-[#D4EDF9] text-[#0074D9] font-bold text-[10.5px] px-2.5 py-0.5 rounded-xs transition-colors"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => setDepTimeCollapsed(!depTimeCollapsed)}
              className="text-gray-400 hover:text-gray-600"
            >
              {depTimeCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {!depTimeCollapsed && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'EARLY_MORNING', time: '00:00 - 06:00', label: 'Early Morning' },
                { id: 'MORNING', time: '06:00 - 12:00', label: 'Morning' },
                { id: 'AFTERNOON', time: '12:00 - 18:00', label: 'Mid Day' },
                { id: 'NIGHT', time: '18:00 - 24:00', label: 'Night' }
              ].map(slot => {
                const isSelected = filters.timeSlots.includes(slot.id);
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => toggleDepTimeSlot(slot.id)}
                    className={`py-2 px-1 text-center rounded-xs transition-colors ${isSelected
                        ? 'bg-[#1C356C] text-white'
                        : 'bg-[#1C356C] text-white hover:bg-[#152954]'
                      }`}
                  >
                    <div className="text-[10px] font-bold tracking-tight">{slot.time}</div>
                    <div className="text-[11px] font-bold mt-0.5">{slot.label}</div>
                  </button>
                );
              })}
            </div>

            {/* Orange slider line */}
            <div className="pt-2">
              <input
                type="range"
                min="0"
                max="24"
                value={depSlider}
                onChange={e => setDepSlider(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FB792B]"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-semibold mt-1">
                <span>00:00 Hrs</span>
                <span>24:00 Hrs</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. ARRIVAL TIME */}
      <div className="p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[11px] text-gray-800 tracking-wider uppercase">ARRIVAL TIME</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChange({ ...filters, arrivalTimeSlots: [] })}
              className="bg-[#E6F4FA] hover:bg-[#D4EDF9] text-[#0074D9] font-bold text-[10.5px] px-2.5 py-0.5 rounded-xs transition-colors"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => setArrTimeCollapsed(!arrTimeCollapsed)}
              className="text-gray-400 hover:text-gray-600"
            >
              {arrTimeCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {!arrTimeCollapsed && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'EARLY_MORNING', time: '00:00 - 06:00', label: 'Early Morning' },
                { id: 'MORNING', time: '06:00 - 12:00', label: 'Morning' },
                { id: 'AFTERNOON', time: '12:00 - 18:00', label: 'Mid Day' },
                { id: 'NIGHT', time: '18:00 - 24:00', label: 'Night' }
              ].map(slot => {
                const isSelected = (filters.arrivalTimeSlots || []).includes(slot.id);
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => toggleArrTimeSlot(slot.id)}
                    className={`py-2 px-1 text-center rounded-xs transition-colors ${isSelected
                        ? 'bg-[#1C356C] text-white'
                        : 'bg-[#1C356C] text-white hover:bg-[#152954]'
                      }`}
                  >
                    <div className="text-[10px] font-bold tracking-tight">{slot.time}</div>
                    <div className="text-[11px] font-bold mt-0.5">{slot.label}</div>
                  </button>
                );
              })}
            </div>

            {/* Orange slider line */}
            <div className="pt-2">
              <input
                type="range"
                min="0"
                max="24"
                value={arrSlider}
                onChange={e => setArrSlider(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FB792B]"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-semibold mt-1">
                <span>00:00 Hrs</span>
                <span>24:00 Hrs</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. FROM STATIONS */}
      <div className="p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[11px] text-gray-800 tracking-wider uppercase">FROM STATIONS</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="bg-[#E6F4FA] text-[#0074D9] font-bold text-[10.5px] px-2.5 py-0.5 rounded-xs"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => setFromCollapsed(!fromCollapsed)}
              className="text-gray-400 hover:text-gray-600"
            >
              {fromCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {!fromCollapsed && (
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[11px] font-semibold text-gray-800">
              <input
                type="checkbox"
                defaultChecked
                className="w-3.5 h-3.5 rounded-xs accent-[#213D77] cursor-pointer"
              />
              <span className="font-bold">{fromStationName.toUpperCase()}</span>
            </label>
          </div>
        )}
      </div>

      {/* 6. TO STATIONS */}
      <div className="p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[11px] text-gray-800 tracking-wider uppercase">TO STATIONS</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="bg-[#E6F4FA] text-[#0074D9] font-bold text-[10.5px] px-2.5 py-0.5 rounded-xs"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => setToCollapsed(!toCollapsed)}
              className="text-gray-400 hover:text-gray-600"
            >
              {toCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {!toCollapsed && (
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[11px] font-semibold text-gray-800">
              <input
                type="checkbox"
                defaultChecked
                className="w-3.5 h-3.5 rounded-xs accent-[#213D77] cursor-pointer"
              />
              <span className="font-bold">{toStationName.toUpperCase()}</span>
            </label>
          </div>
        )}
      </div>

    </div>
  );
}
