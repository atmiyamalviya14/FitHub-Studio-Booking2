"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Booking } from "@/types/booking";
import { ServiceBadge } from "./ServiceBadge";
import { StatusBadge } from "./StatusBadge";
import { formatTime, formatLocalDate } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Plus,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarWeekViewProps {
  bookings: Booking[];
}

export function CalendarWeekView({ bookings }: CalendarWeekViewProps) {
  // Current anchor date (defaults to today)
  const today = useMemo(() => new Date(), []);
  const todayIso = formatLocalDate(today);

  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);
  const [selectedMobileDay, setSelectedMobileDay] = useState<string>(todayIso);

  // Calculate Monday of the selected week offset
  const weekDays = useMemo(() => {
    const baseDate = new Date(today);
    baseDate.setDate(baseDate.getDate() + currentWeekOffset * 7);

    // Get Monday of that week (0 = Sunday, 1 = Monday)
    const dayOfWeek = baseDate.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() + diffToMonday);

    const days: { dateStr: string; dayName: string; dayNum: number; fullDate: Date }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = formatLocalDate(d);
      const dayName = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(d);
      const dayNum = d.getDate();
      days.push({ dateStr, dayName, dayNum, fullDate: d });
    }
    return days;
  }, [today, currentWeekOffset]);

  // Week range label e.g. "Nov 16 – Nov 22, 2026"
  const weekLabel = useMemo(() => {
    if (weekDays.length === 0) return "";
    const first = weekDays[0].fullDate;
    const last = weekDays[6].fullDate;
    const firstFormatted = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(first);
    const lastFormatted = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(last);
    return `${firstFormatted} – ${lastFormatted}`;
  }, [weekDays]);

  // Map bookings to dates for instant lookup
  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of bookings) {
      if (!map.has(b.date)) {
        map.set(b.date, []);
      }
      map.get(b.date)!.push(b);
    }
    // Sort each day's sessions by time
    map.forEach((list) => {
      list.sort((a, b) => a.time.localeCompare(b.time));
    });
    return map;
  }, [bookings]);

  return (
    <div className="space-y-4">
      {/* Week Navigation Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              {weekLabel}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Weekly studio timetable & session distribution
            </p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
            type="button"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Previous Week"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={() => {
              setCurrentWeekOffset(0);
              setSelectedMobileDay(todayIso);
            }}
            type="button"
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Today
          </button>

          <button
            onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
            type="button"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Next Week"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Day Selector Bar (Optimized for 375px screens) */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {weekDays.map((day) => {
          const isSelected = selectedMobileDay === day.dateStr;
          const isToday = day.dateStr === todayIso;
          const dayBookingsCount = bookingsByDate.get(day.dateStr)?.length || 0;

          return (
            <button
              key={day.dateStr}
              type="button"
              onClick={() => setSelectedMobileDay(day.dateStr)}
              className={cn(
                "flex-1 min-w-[50px] py-2 px-1.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer",
                isSelected
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : isToday
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
              )}
            >
              <span className="text-[10px] font-semibold uppercase">{day.dayName}</span>
              <span className="text-sm font-extrabold">{day.dayNum}</span>
              {dayBookingsCount > 0 && (
                <span
                  className={cn(
                    "text-[9px] font-bold px-1.5 rounded-full mt-0.5",
                    isSelected
                      ? "bg-emerald-700 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  )}
                >
                  {dayBookingsCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Selected Day View */}
      <div className="md:hidden">
        {(() => {
          const day = weekDays.find((d) => d.dateStr === selectedMobileDay) || weekDays[0];
          const sessions = bookingsByDate.get(day.dateStr) || [];

          return (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {day.dayName}, {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(day.fullDate)}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {sessions.length} {sessions.length === 1 ? "session" : "sessions"} scheduled
                  </p>
                </div>

                <Link
                  href={`/bookings/new`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Book</span>
                </Link>
              </div>

              {sessions.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                  No sessions scheduled for this day.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {sessions.map((b) => (
                    <Link
                      key={b.id}
                      href={`/bookings/${b.id}`}
                      className="block p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {formatTime(b.time)}
                        </span>
                        <StatusBadge status={b.status} />
                      </div>
                      <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                        {b.customerName}
                      </div>
                      <div className="mt-1">
                        <ServiceBadge service={b.service} />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Desktop 7-Day Grid View */}
      <div className="hidden md:grid md:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const isToday = day.dateStr === todayIso;
          const sessions = bookingsByDate.get(day.dateStr) || [];

          return (
            <div
              key={day.dateStr}
              className={cn(
                "rounded-xl border flex flex-col min-h-[380px] bg-white dark:bg-slate-900 transition-colors",
                isToday
                  ? "border-emerald-500/80 dark:border-emerald-500/80 shadow-xs ring-1 ring-emerald-500/30"
                  : "border-slate-200/90 dark:border-slate-800"
              )}
            >
              {/* Day Column Header */}
              <div
                className={cn(
                  "p-3 border-b text-center rounded-t-xl transition-colors",
                  isToday
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80"
                    : "bg-slate-50/75 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800"
                )}
              >
                <span
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-wider block",
                    isToday ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  {day.dayName}
                </span>
                <span
                  className={cn(
                    "text-lg font-extrabold block leading-none mt-0.5",
                    isToday ? "text-emerald-900 dark:text-white" : "text-slate-800 dark:text-slate-200"
                  )}
                >
                  {day.dayNum}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                  {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
                </span>
              </div>

              {/* Day Sessions List */}
              <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                {sessions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-3 text-center">
                    <span className="text-[11px] text-slate-400 dark:text-slate-600 block mb-2">
                      No sessions
                    </span>
                    <Link
                      href="/bookings/new"
                      className="p-1.5 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-emerald-600 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                      title="Add booking on this date"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ) : (
                  sessions.map((b) => (
                    <Link
                      key={b.id}
                      href={`/bookings/${b.id}`}
                      className="block p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group"
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-900 dark:text-white mb-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {formatTime(b.time)}
                        </span>
                        <ExternalLink className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mb-1">
                        {b.customerName}
                      </div>
                      <div className="flex items-center justify-between gap-1 mt-1">
                        <ServiceBadge service={b.service} className="text-[10px] py-0 px-1.5" />
                        <StatusBadge status={b.status} className="text-[10px] py-0 px-1.5" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
