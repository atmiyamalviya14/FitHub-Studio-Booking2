import React from "react";
import { getBookings, getStorageInfo } from "@/lib/server/bookings";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { UpcomingList } from "@/components/dashboard/UpcomingList";
import { Booking } from "@/types/booking";

import { connection } from "next/server";

export default async function HomePage() {
  await connection();
  const [bookings, storageInfo] = await Promise.all([
    getBookings(),
    getStorageInfo(),
  ]);

  // Compute Today's ISO date string (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split("T")[0];

  // 1. KPI Calculations
  const total = bookings.length;
  const todayCount = bookings.filter((b) => b.date === todayStr && b.status !== "cancelled").length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;

  // 2. Next 5 Upcoming Bookings:
  // Filter for upcoming/today sessions that are not cancelled, sorted soonest first
  const upcomingBookings = [...bookings]
    .filter((b) => b.date >= todayStr && b.status !== "cancelled")
    .sort((a, b) => {
      const aKey = `${a.date}T${a.time}`;
      const bKey = `${b.date}T${b.time}`;
      return aKey.localeCompare(bKey);
    })
    .slice(0, 5);

  // If there are fewer than 5 upcoming sessions, fallback to all active non-cancelled bookings sorted soonest first
  const displayUpcoming: Booking[] =
    upcomingBookings.length > 0
      ? upcomingBookings
      : [...bookings]
          .filter((b) => b.status !== "cancelled")
          .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
          .slice(0, 5);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      {/* Top Welcome & CTA Banner */}
      <DashboardHeader storageType={storageInfo.type} />

      {/* 4 Summary Metric KPI Cards */}
      <section className="mb-8" aria-label="Key Performance Indicators">
        <StatsCards
          total={total}
          todayCount={todayCount}
          pendingCount={pendingCount}
          confirmedCount={confirmedCount}
        />
      </section>

      {/* Next 5 Upcoming Bookings Section */}
      <section aria-label="Upcoming Bookings">
        <UpcomingList bookings={displayUpcoming} />
      </section>
    </main>
  );
}
