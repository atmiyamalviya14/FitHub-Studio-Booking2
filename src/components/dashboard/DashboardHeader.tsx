import React from "react";
import Link from "next/link";
import { PlusCircle, CalendarDays, Database, HardDrive, Sparkles } from "lucide-react";

interface DashboardHeaderProps {
  storageType: "MongoDB" | "JSON File Store";
}

export function DashboardHeader({ storageType }: DashboardHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden mb-8">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Front-Desk System Active
            </span>

            {/* Storage indicator */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              {storageType === "MongoDB" ? (
                <>
                  <Database className="h-3 w-3 text-emerald-400" />
                  <span>Storage: MongoDB</span>
                </>
              ) : (
                <>
                  <HardDrive className="h-3 w-3 text-sky-400" />
                  <span>Storage: Server JSON</span>
                </>
              )}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            FitHub Studio Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Manage personal training and group sessions without double-bookings.
            Review today&apos;s sessions, confirm pending requests, or schedule new clients.
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href="/bookings/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Book New Session</span>
          </Link>

          <Link
            href="/bookings"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-colors"
          >
            <CalendarDays className="h-4 w-4" />
            <span>All Bookings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
