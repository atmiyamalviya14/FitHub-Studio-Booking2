"use client";

import React, { useState, useMemo, useTransition, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Booking } from "@/types/booking";
import { BookingsFilters } from "./BookingsFilters";
import { BookingsTable } from "./BookingsTable";
import Link from "next/link";
import { PlusCircle, CheckCircle2, X } from "lucide-react";

interface BookingsDirectoryProps {
  initialBookings: Booking[];
}

export function BookingsDirectory({ initialBookings }: BookingsDirectoryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Read initial filter values from URL search params (Bonus Feature: Shareable URLs)
  const initialSearch = searchParams.get("q") || "";
  const initialService = searchParams.get("service") || "all";
  const initialStatus = searchParams.get("status") || "all";
  const successType = searchParams.get("success");

  const [search, setSearch] = useState(initialSearch);
  const [service, setService] = useState(initialService);
  const [status, setStatus] = useState(initialStatus);
  const [showNotification, setShowNotification] = useState(Boolean(successType));

  // Sync state to URL search parameters smoothly
  const updateUrlParams = (newSearch: string, newService: string, newStatus: string) => {
    const params = new URLSearchParams();
    if (newSearch.trim()) params.set("q", newSearch.trim());
    if (newService !== "all") params.set("service", newService);
    if (newStatus !== "all") params.set("status", newStatus);

    startTransition(() => {
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    updateUrlParams(val, service, status);
  };

  const handleServiceChange = (val: string) => {
    setService(val);
    updateUrlParams(search, val, status);
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    updateUrlParams(search, service, val);
  };

  const handleResetFilters = () => {
    setSearch("");
    setService("all");
    setStatus("all");
    updateUrlParams("", "all", "all");
  };

  const dismissNotification = () => {
    setShowNotification(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("success");
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  // Filter & Sort Bookings
  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return initialBookings
      .filter((booking) => {
        // Customer Name & Email search
        if (query) {
          const matchName = booking.customerName.toLowerCase().includes(query);
          const matchEmail = booking.email.toLowerCase().includes(query);
          if (!matchName && !matchEmail) return false;
        }

        // Service filter
        if (service !== "all" && booking.service !== service) {
          return false;
        }

        // Status filter
        if (status !== "all" && booking.status !== status) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Chronological sort: soonest date & time first
        const aKey = `${a.date}T${a.time}`;
        const bKey = `${b.date}T${b.time}`;
        return aKey.localeCompare(bKey);
      });
  }, [initialBookings, search, service, status]);

  const hasActiveFilters = Boolean(
    search.trim() !== "" || service !== "all" || status !== "all"
  );

  return (
    <div className="space-y-6">
      {/* Success Notification Banner */}
      {showNotification && successType && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-xs animate-slide-down">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-full bg-emerald-200 text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold">
                {successType === "created"
                  ? "Booking Scheduled Successfully!"
                  : successType === "deleted"
                  ? "Booking Removed"
                  : "Action Completed"}
              </p>
              <p className="text-xs text-emerald-700">
                {successType === "created"
                  ? "The new session has been scheduled and recorded in the studio directory."
                  : "The booking record was permanently removed."}
              </p>
            </div>
          </div>
          <button
            onClick={dismissNotification}
            className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors"
            title="Dismiss notice"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Bookings Directory
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {initialBookings.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse, search, and manage all studio sessions and front-desk reservations.
          </p>
        </div>

        <Link
          href="/bookings/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Booking</span>
        </Link>
      </div>

      {/* Filter and Search Controls */}
      <BookingsFilters
        search={search}
        onSearchChange={handleSearchChange}
        service={service}
        onServiceChange={handleServiceChange}
        status={status}
        onStatusChange={handleStatusChange}
        onReset={handleResetFilters}
        totalFiltered={filteredBookings.length}
        totalAll={initialBookings.length}
      />

      {/* Results Table & Mobile Cards */}
      <div className={isPending ? "opacity-70 transition-opacity" : ""}>
        <BookingsTable
          bookings={filteredBookings}
          hasFilters={hasActiveFilters}
          onClearFilters={handleResetFilters}
        />
      </div>
    </div>
  );
}
