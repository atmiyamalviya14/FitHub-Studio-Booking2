"use client";

import React, { useState } from "react";
import { Search, X, RotateCcw, Share2, Check } from "lucide-react";
import { SERVICES, BOOKING_STATUSES } from "@/types/booking";

interface BookingsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  service: string;
  onServiceChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onReset: () => void;
  totalFiltered: number;
  totalAll: number;
}

export function BookingsFilters({
  search,
  onSearchChange,
  service,
  onServiceChange,
  status,
  onStatusChange,
  onReset,
  totalFiltered,
  totalAll,
}: BookingsFiltersProps) {
  const [copied, setCopied] = useState(false);

  const hasActiveFilters = Boolean(
    search.trim() !== "" || service !== "all" || status !== "all"
  );

  const handleCopyShareLink = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      // Fallback if clipboard API is restricted
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-4 sm:p-5 space-y-4 mb-6 transition-colors">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by customer name or email..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 dark:bg-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Service Dropdown */}
          <div className="w-full sm:w-auto min-w-[160px]">
            <select
              value={service}
              onChange={(e) => onServiceChange(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <option value="all">All Services</option>
              {SERVICES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="w-full sm:w-auto min-w-[150px]">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-700 dark:text-slate-200 capitalize cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {BOOKING_STATUSES.map((st) => (
                <option key={st} value={st} className="capitalize">
                  {st.charAt(0).toUpperCase() + st.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg border border-rose-200 dark:border-rose-900/50 transition-colors cursor-pointer shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Status Summary bar & Share Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{totalFiltered}</span>{" "}
            of <span className="font-semibold text-slate-800 dark:text-slate-200">{totalAll}</span> bookings
          </span>
          {hasActiveFilters && (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              (Filtered)
            </span>
          )}

          {/* Share Filtered View Link Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer ml-1"
              title="Copy shareable link with current filters"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3 w-3 text-slate-400" />
                  <span>Share Filtered View</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="text-[11px] text-slate-400 dark:text-slate-500">
          Sorted chronologically (soonest first)
        </div>
      </div>
    </div>
  );
}
