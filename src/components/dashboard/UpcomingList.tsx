import React from "react";
import Link from "next/link";
import { Booking } from "@/types/booking";
import { StatusBadge } from "@/components/bookings/StatusBadge";
import { ServiceBadge } from "@/components/bookings/ServiceBadge";
import { formatDate, formatTime } from "@/lib/utils";
import {
  CalendarClock,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  Clock,
} from "lucide-react";

interface UpcomingListProps {
  bookings: Booking[];
}

export function UpcomingList({ bookings }: UpcomingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center transition-colors">
        <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <CalendarClock className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          No upcoming sessions found
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-5">
          There are no upcoming sessions scheduled. Front-desk staff can add a new booking anytime.
        </p>
        <Link
          href="/bookings/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New Booking</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
            <CalendarClock className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Next 5 Upcoming Bookings
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sorted chronologically (soonest first)
            </p>
          </div>
        </div>

        <Link
          href="/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:underline"
        >
          <span>View all bookings</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/75 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold">
                Customer
              </th>
              <th scope="col" className="px-6 py-3 font-semibold">
                Service
              </th>
              <th scope="col" className="px-6 py-3 font-semibold">
                Date & Time
              </th>
              <th scope="col" className="px-6 py-3 font-semibold">
                Status
              </th>
              <th scope="col" className="px-6 py-3 font-semibold text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {booking.customerName}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{booking.email}</div>
                </td>
                <td className="px-6 py-4">
                  <ServiceBadge service={booking.service} />
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-900 dark:text-slate-200 font-medium text-xs">
                    {formatDate(booking.date)}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3 text-slate-400" />
                    {formatTime(booking.time)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/bookings/${booking.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <span>Details</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (Tested down to 375px) */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {bookings.map((booking) => (
          <div key={booking.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {booking.customerName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{booking.email}</p>
              </div>
              <StatusBadge status={booking.status} />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg">
              <ServiceBadge service={booking.service} />
              <div className="text-right">
                <span className="font-medium text-slate-800 dark:text-slate-200 block">
                  {formatDate(booking.date)}
                </span>
                <span className="text-slate-500 dark:text-slate-400">{formatTime(booking.time)}</span>
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <Link
                href={`/bookings/${booking.id}`}
                className="w-full text-center py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                View Details & Actions
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
