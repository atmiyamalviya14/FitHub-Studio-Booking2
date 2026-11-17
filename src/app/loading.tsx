import React from "react";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-6">
      {/* Top Banner Skeleton */}
      <div className="h-32 bg-slate-200/80 rounded-2xl w-full" />

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-200/70 rounded-xl" />
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 w-48 bg-slate-200 rounded-md" />
          <div className="h-9 w-32 bg-slate-200 rounded-md" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-lg w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
