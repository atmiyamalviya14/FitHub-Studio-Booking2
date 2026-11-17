import React from "react";
import Link from "next/link";
import { Booking } from "@/types/booking";
import { StatusBadge } from "./StatusBadge";
import { ServiceBadge } from "./ServiceBadge";
import { formatDate, formatTime } from "@/lib/utils";
import {
  CalendarDays,
  Clock,
  ExternalLink,
  SearchX,
  PlusCircle,
  FileText,
  RotateCcw,
} from "lucide-react";

interface BookingsTableProps {
  bookings: Booking[];
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function BookingsTable({
  bookings,
  hasFilters,
  onClearFilters,
}: BookingsTableProps) {
  // Empty State
  if (bookings.length === 0) {
    if (hasFilters) {
      return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4 transition-colors">
          <div className="h-12 w-12 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 mx-auto flex items-center justify-center">
            <SearchX className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No matching bookings found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We couldn&apos;t find any bookings matching your active search or filters.
            </p>
          </div>
          <div>
            <button
              onClick={onClearFilters}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear All Filters</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4 transition-colors">
        <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <CalendarDays className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No bookings recorded yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Get started by scheduling your studio&apos;s first personal training or group session.
          </p>
        </div>
        <div>
          <Link
            href="/bookings/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create First Booking</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3.5 font-semibold">
                Customer
              </th>
              <th scope="col" className="px-6 py-3.5 font-semibold">
                Service
              </th>
              <th scope="col" className="px-6 py-3.5 font-semibold">
                Date & Time
              </th>
              <th scope="col" className="px-6 py-3.5 font-semibold">
                Status
              </th>
              <th scope="col" className="px-6 py-3.5 font-semibold">
                Notes
              </th>
              <th scope="col" className="px-6 py-3.5 font-semibold text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
              >
                {/* Customer */}
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {booking.customerName}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{booking.email}</div>
                </td>

                {/* Service */}
                <td className="px-6 py-4">
                  <ServiceBadge service={booking.service} />
                </td>

                {/* Date & Time */}
                <td className="px-6 py-4">
                  <div className="text-slate-900 dark:text-slate-200 font-medium text-xs">
                    {formatDate(booking.date)}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3 text-slate-400" />
                    {formatTime(booking.time)}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <StatusBadge status={booking.status} />
                </td>

                {/* Notes Preview */}
                <td className="px-6 py-4 max-w-xs">
                  {booking.notes ? (
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 truncate" title={booking.notes}>
                      {booking.notes}
                    </p>
                  ) : (
                    <span className="text-xs text-slate-400 italic">None</span>
                  )}
                </td>

                {/* Action */}
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/bookings/${booking.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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

      {/* Mobile Card View (Optimized for 375px screens) */}
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

            <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg">
              <ServiceBadge service={booking.service} />
              <div className="text-right">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  {formatDate(booking.date)}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {formatTime(booking.time)}
                </span>
              </div>
            </div>

            {booking.notes && (
              <div className="text-xs text-slate-600 dark:text-slate-300 bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded-md border border-amber-100 dark:border-amber-900/50 flex items-start gap-1.5">
                <FileText className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{booking.notes}</span>
              </div>
            )}

            <div className="pt-1">
              <Link
                href={`/bookings/${booking.id}`}
                className="w-full block text-center py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 transition-colors"
              >
                View Details & Manage
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
