'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { Station } from '@/types';
import stationsData from '@/data/stations.json';

interface StationAutocompleteProps {
  label: string;
  value: string; // station code
  stationName: string;
  onChange: (station: Station) => void;
  placeholder?: string;
  iconColor?: string;
}

export default function StationAutocomplete({
  label,
  value,
  stationName,
  onChange,
  placeholder = 'Type station name or code',
  iconColor = 'text-[#0A3D62]'
}: StationAutocompleteProps) {
  const [query, setQuery] = useState(value ? `${value} - ${stationName}` : '');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Station[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  // Sync display with props
  useEffect(() => {
    if (value && stationName) {
      setQuery(`${value} - ${stationName}`);
    }
  }, [value, stationName]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced station search (300ms)
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const q = query.split('-')[0].trim().toUpperCase();
      if (!q) {
        setResults(stationsData.slice(0, 10));
      } else {
        const matches = stationsData.filter(
          s =>
            s.code.toUpperCase().includes(q) ||
            s.name.toUpperCase().includes(q) ||
            s.city.toUpperCase().includes(q)
        );
        setResults(matches.slice(0, 12));
      }
      setHighlightedIndex(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleSelect = (station: Station) => {
    setQuery(`${station.code} - ${station.name}`);
    onChange(station);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[highlightedIndex]) {
        handleSelect(results[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <label htmlFor={inputId} className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          id={inputId}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setResults(stationsData.slice(0, 10));
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full text-xs font-semibold px-3 py-2.5 pl-9 pr-7 border border-gray-300 rounded focus:ring-2 focus:ring-[#0A3D62] focus:border-[#0A3D62] outline-hidden bg-white text-gray-900 transition-all shadow-2xs"
        />

        <MapPin className={`w-4 h-4 ${iconColor} absolute left-3 top-3 pointer-events-none`} />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(true);
            }}
            className="absolute right-2.5 top-3 text-gray-400 hover:text-gray-600"
            aria-label="Clear station"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded shadow-xl z-50 divide-y divide-gray-100 text-xs animate-in fade-in duration-100"
        >
          {results.map((stn, index) => {
            const isSelected = index === highlightedIndex;
            return (
              <li
                key={stn.code}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(stn)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-3 py-2 cursor-pointer flex items-center justify-between transition-colors ${
                  isSelected ? 'bg-blue-50 text-[#0A3D62]' : 'hover:bg-gray-50 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold bg-[#0A3D62] text-white text-[10px] px-1.5 py-0.5 rounded tracking-wider">
                    {stn.code}
                  </span>
                  <div>
                    <span className="font-semibold">{stn.name}</span>
                    <span className="text-[10px] text-gray-500 ml-1.5 font-normal">({stn.city})</span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 hidden sm:inline">{stn.state}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
