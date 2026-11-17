import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getBookings } from "@/lib/server/bookings";
import { BookingsDirectory } from "@/components/bookings/BookingsDirectory";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "Bookings Directory | FitHub Studio",
  description: "Browse, filter, and search studio bookings for FitHub Studio.",
};

async function BookingsData() {
  const bookings = await getBookings();
  return <BookingsDirectory initialBookings={bookings} />;
}

export default function BookingsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      <Suspense fallback={<Loading />}>
        <BookingsData />
      </Suspense>
    </main>
  );
}
