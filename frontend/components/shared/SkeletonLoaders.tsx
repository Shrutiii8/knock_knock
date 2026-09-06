'use client';

import React from 'react';

export function TrainCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 bg-gray-200 rounded" />
          <div className="h-5 w-44 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>

      <div className="grid grid-cols-3 gap-4 items-center py-2">
        <div className="space-y-1.5">
          <div className="h-6 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-1 w-full max-w-[150px] bg-gray-200 rounded" />
        </div>
        <div className="space-y-1.5 flex flex-col items-end">
          <div className="h-6 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-16 flex-1 bg-gray-100 rounded border border-gray-200" />
        ))}
      </div>
    </div>
  );
}

export function PnrResultSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm animate-pulse space-y-4 max-w-3xl mx-auto">
      <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-5 w-28 bg-gray-300 rounded" />
          </div>
        ))}
      </div>
      <div className="h-32 w-full bg-gray-100 rounded mt-4" />
    </div>
  );
}

export function ScheduleTableSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm animate-pulse space-y-3">
      <div className="h-6 w-60 bg-gray-200 rounded mb-4" />
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="h-8 w-full bg-gray-100 rounded" />
      ))}
    </div>
  );
}
