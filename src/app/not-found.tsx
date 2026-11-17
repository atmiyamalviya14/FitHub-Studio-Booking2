import React from "react";
import Link from "next/link";
import { SearchX, CalendarDays, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 text-center space-y-5">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
          <SearchX className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            404 Error
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Booking or Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            The booking record you are looking for does not exist, may have been deleted, or the URL is incorrect.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/bookings"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium transition-colors"
          >
            <CalendarDays className="h-4 w-4" />
            <span>Browse All Bookings</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
