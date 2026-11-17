import React, { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBookingById } from "@/lib/server/bookings";
import { BookingDetailsView } from "@/components/bookings/BookingDetailsView";
import Loading from "@/app/loading";

interface BookingPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BookingPageProps): Promise<Metadata> {
  const { id } = await params;
  const booking = await getBookingById(id);

  if (!booking) {
    return {
      title: "Booking Not Found | FitHub Studio",
      description: "The requested booking does not exist.",
    };
  }

  return {
    title: `${booking.customerName} (${booking.service}) | FitHub Studio`,
    description: `Booking details for ${booking.customerName} - ${booking.service} on ${booking.date}`,
  };
}

async function BookingDataFetcher({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBookingById(id);

  if (!booking) {
    notFound();
  }

  return <BookingDetailsView booking={booking} />;
}

export default function BookingDetailPage({ params }: BookingPageProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      <Suspense fallback={<Loading />}>
        <BookingDataFetcher params={params} />
      </Suspense>
    </main>
  );
}
