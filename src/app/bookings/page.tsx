import React, { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { getBookings } from "@/lib/server/bookings";
import { BookingsDirectory } from "@/components/bookings/BookingsDirectory";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "Bookings Directory | FitHub Studio",
  description: "Browse, filter, and search studio bookings for FitHub Studio.",
};

export default async function BookingsPage() {
  await connection();
  const bookings = await getBookings();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      <Suspense fallback={<Loading />}>
        <BookingsDirectory initialBookings={bookings} />
      </Suspense>
    </main>
  );
}
