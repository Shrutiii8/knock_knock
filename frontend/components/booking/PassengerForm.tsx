'use client';

import React from 'react';
import { Passenger, ClassCode } from '@/types';
import { BERTH_PREFERENCES } from '@/lib/constants';
import { UserPlus, Trash2, Users, BookmarkCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface PassengerFormProps {
  passengers: Passenger[];
  onAddPassenger: () => void;
  onUpdatePassenger: (index: number, updated: Partial<Passenger>) => void;
  onRemovePassenger: (index: number) => void;
  selectedClass?: ClassCode;
}

export default function PassengerForm({
  passengers,
  onAddPassenger,
  onUpdatePassenger,
  onRemovePassenger,
  selectedClass
}: PassengerFormProps) {
  const { savedPassengers } = useAuth();

  const handleSelectFromSaved = (saved: Omit<Passenger, 'id'>) => {
    // If first passenger is empty, populate it; otherwise add new
    const firstEmptyIndex = passengers.findIndex(p => !p.name.trim());
    if (firstEmptyIndex !== -1) {
      onUpdatePassenger(firstEmptyIndex, saved);
    } else if (passengers.length < 6) {
      onAddPassenger();
      setTimeout(() => {
        onUpdatePassenger(passengers.length, saved);
      }, 50);
    }
  };

  const isChairCar = selectedClass === 'CC' || selectedClass === 'EC';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0A3D62]" />
            <span>Passenger Details ({passengers.length} of 6 max)</span>
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Names must match photo ID cards (Aadhaar, Voter ID, Passport) to be shown during journey.
          </p>
        </div>

        {/* Master List Quick Fill */}
        {savedPassengers && savedPassengers.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
              <BookmarkCheck className="w-3 h-3 text-green-600" />
              Quick Add:
            </span>
            {savedPassengers.slice(0, 3).map((saved, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectFromSaved(saved)}
                className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-[#0A3D62] text-[10px] font-bold rounded border border-blue-200 transition-colors"
              >
                + {saved.name.split(' ')[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Passenger Input Rows */}
      <div className="space-y-3">
        {passengers.map((passenger, index) => (
          <div
            key={passenger.id}
            className="p-3.5 bg-gray-50/80 rounded-md border border-gray-200 space-y-2.5 relative"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0A3D62] text-[11px] uppercase tracking-wider">
                Passenger #{index + 1}
              </span>

              {passengers.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemovePassenger(index)}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1 text-[11px] transition-colors p-1"
                  title="Remove this passenger"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Name */}
              <div className="sm:col-span-4">
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={passenger.name}
                  onChange={e => onUpdatePassenger(index, { name: e.target.value })}
                  placeholder="Enter Name as per Govt ID"
                  className="w-full text-xs font-semibold px-2.5 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#0A3D62] outline-hidden bg-white text-gray-900"
                />
              </div>

              {/* Age */}
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={passenger.age || ''}
                  onChange={e => onUpdatePassenger(index, { age: parseInt(e.target.value) || 0 })}
                  placeholder="Age"
                  className="w-full text-xs font-semibold px-2.5 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#0A3D62] outline-hidden bg-white text-gray-900"
                />
              </div>

              {/* Gender */}
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={passenger.gender}
                  onChange={e => onUpdatePassenger(index, { gender: e.target.value as 'M' | 'F' | 'T' })}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#0A3D62] outline-hidden bg-white text-gray-900"
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="T">Transgender</option>
                </select>
              </div>

              {/* Berth Preference */}
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  Berth Choice
                </label>
                <select
                  value={passenger.berthPreference}
                  onChange={e => onUpdatePassenger(index, { berthPreference: e.target.value as any })}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#0A3D62] outline-hidden bg-white text-gray-900"
                >
                  {isChairCar ? (
                    <>
                      <option value="NONE">No Preference</option>
                      <option value="WS">Window Seat (WS)</option>
                    </>
                  ) : (
                    BERTH_PREFERENCES.map(b => (
                      <option key={b.code} value={b.code}>
                        {b.label}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Food Choice */}
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  Food Choice
                </label>
                <select
                  value={passenger.foodPreference || 'VEG'}
                  onChange={e => onUpdatePassenger(index, { foodPreference: e.target.value as any })}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#0A3D62] outline-hidden bg-white text-gray-900"
                >
                  <option value="VEG">Veg Meal</option>
                  <option value="NON_VEG">Non-Veg Meal</option>
                  <option value="NONE">No Food</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Passenger Action */}
      {passengers.length < 6 && (
        <button
          type="button"
          onClick={onAddPassenger}
          className="w-full py-2.5 border-2 border-dashed border-[#0A3D62]/40 hover:border-[#0A3D62] bg-blue-50/50 hover:bg-blue-50 text-[#0A3D62] font-bold rounded-md flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider text-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ ADD PASSENGER</span>
        </button>
      )}
    </div>
  );
}
