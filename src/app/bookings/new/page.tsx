import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BookingForm } from "@/components/bookings/BookingForm";
import { ChevronRight, CalendarPlus, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "New Booking | FitHub Studio",
  description: "Schedule a new personal training or group session at FitHub Studio.",
};

export default function NewBookingPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <Link href="/bookings" className="hover:text-slate-900 transition-colors">
          Bookings
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="font-semibold text-slate-900">New Booking</span>
      </nav>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CalendarPlus className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Schedule New Booking
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Enter customer details and assign an available studio session slot.
            </p>
          </div>
        </div>

        {/* Studio Guidelines Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-xs text-emerald-900 flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Front-Desk Collision Guard Active</span>
            <span>
              Operating hours are between <strong>07:00 and 21:00</strong>. The system will automatically check and prevent double-booking the same service at the selected date and time.
            </span>
          </div>
        </div>
      </div>

      {/* Booking Form (Create Mode) */}
      <BookingForm mode="create" />
    </main>
  );
}
