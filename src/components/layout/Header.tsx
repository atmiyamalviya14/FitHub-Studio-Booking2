import React from "react";
import { Dumbbell, Calendar, Users, Sparkles } from "lucide-react";

interface HeaderProps {
  onOpenNewBooking?: () => void;
  onResetData?: () => void;
}

export function Header({ onOpenNewBooking, onResetData }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  FitHub<span className="text-emerald-600">.</span>
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Front Desk
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Personal Training & Group Session Dispatch
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {onResetData && (
              <button
                onClick={onResetData}
                type="button"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Reset mock data to default sample"
              >
                <Sparkles className="h-3.5 w-3.5 text-slate-500" />
                Reset Sample Data
              </button>
            )}

            {onOpenNewBooking && (
              <button
                onClick={onOpenNewBooking}
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
                <span>New Booking</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
