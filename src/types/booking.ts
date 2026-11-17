export type Service = "Personal Training" | "Yoga" | "HIIT" | "Pilates";

export const SERVICES: Service[] = [
  "Personal Training",
  "Yoga",
  "HIIT",
  "Pilates",
];

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export const BOOKING_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "cancelled",
];

export interface Booking {
  id: string; // Generated automatically (e.g. crypto.randomUUID())
  customerName: string; // Required, 2 to 50 characters
  email: string; // Required, must be a valid email
  service: Service; // "Personal Training" | "Yoga" | "HIIT" | "Pilates"
  date: string; // ISO date string (YYYY-MM-DD), cannot be in the past when creating
  time: string; // Required, between 07:00 and 21:00 (HH:mm)
  status: BookingStatus; // "pending" | "confirmed" | "cancelled" (default: pending)
  notes?: string; // Optional, max 200 characters
  createdAt: string; // ISO string, set automatically
}

export type CreateBookingInput = Omit<Booking, "id" | "createdAt">;

export type UpdateBookingInput = Partial<CreateBookingInput>;
