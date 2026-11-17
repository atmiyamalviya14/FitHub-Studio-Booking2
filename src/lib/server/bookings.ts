import "server-only";

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { Booking, CreateBookingInput, Service, BookingStatus } from "@/types/booking";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

// Default seed data in case file is ever missing
const SEED_BOOKINGS: Booking[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    customerName: "Sarah Jenkins",
    email: "sarah.jenkins@example.com",
    service: "Personal Training",
    date: "2026-11-17",
    time: "08:00",
    status: "confirmed",
    notes: "Focus on shoulder mobility and progressive barbell bench press.",
    createdAt: "2026-11-15T09:30:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    customerName: "Michael Chang",
    email: "m.chang@example.com",
    service: "HIIT",
    date: "2026-11-17",
    time: "09:30",
    status: "confirmed",
    notes: "Bringing guest pass for first-time trial.",
    createdAt: "2026-11-15T11:15:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    customerName: "Emma Watson",
    email: "emma.watson@example.com",
    service: "Pilates",
    date: "2026-11-17",
    time: "11:00",
    status: "pending",
    notes: "Requested reformer machine near window.",
    createdAt: "2026-11-16T14:20:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    customerName: "David Miller",
    email: "david.miller@example.com",
    service: "Yoga",
    date: "2026-11-17",
    time: "17:30",
    status: "confirmed",
    notes: "Gentle restorative flow after long work week.",
    createdAt: "2026-11-15T16:45:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    customerName: "Jessica Taylor",
    email: "jess.taylor@example.com",
    service: "Personal Training",
    date: "2026-11-18",
    time: "10:00",
    status: "pending",
    notes: "New client fitness assessment and baseline measurements.",
    createdAt: "2026-11-16T18:00:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    customerName: "Liam Davies",
    email: "liam.davies@example.com",
    service: "HIIT",
    date: "2026-11-18",
    time: "18:00",
    status: "confirmed",
    notes: "Prefers kettlebell circuit exercises.",
    createdAt: "2026-11-16T19:10:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    customerName: "Sophia Rodriguez",
    email: "sophia.r@example.com",
    service: "Yoga",
    date: "2026-11-19",
    time: "07:30",
    status: "confirmed",
    notes: "Early morning vinyasa flow session.",
    createdAt: "2026-11-16T20:05:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    customerName: "Alexander Wright",
    email: "a.wright@example.com",
    service: "Pilates",
    date: "2026-11-19",
    time: "14:00",
    status: "pending",
    notes: "Core stability focus, lower back rehab.",
    createdAt: "2026-11-17T08:15:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    customerName: "Olivia Brown",
    email: "olivia.b@example.com",
    service: "Personal Training",
    date: "2026-11-20",
    time: "15:30",
    status: "cancelled",
    notes: "Client cancelled due to business travel.",
    createdAt: "2026-11-14T10:00:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    customerName: "Lucas Green",
    email: "lucas.green@example.com",
    service: "HIIT",
    date: "2026-11-21",
    time: "10:30",
    status: "confirmed",
    notes: "Weekend endurance challenge.",
    createdAt: "2026-11-16T12:00:00.000Z",
  },
];

/**
 * Ensures data directory and bookings.json exist.
 */
async function ensureDataFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(SEED_BOOKINGS, null, 2), "utf-8");
    }
  } catch (error) {
    console.error("Error ensuring bookings file:", error);
    throw error;
  }
}

/**
 * Reads all bookings from the server-side JSON store.
 */
export async function getBookings(): Promise<Booking[]> {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const bookings = JSON.parse(raw) as Booking[];
    return bookings;
  } catch (error) {
    console.error("Failed to read bookings from JSON:", error);
    return SEED_BOOKINGS;
  }
}

/**
 * Saves all bookings to the server-side JSON store.
 */
async function saveBookings(bookings: Booking[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(bookings, null, 2), "utf-8");
}

/**
 * Gets a single booking by ID.
 */
export async function getBookingById(id: string): Promise<Booking | null> {
  const bookings = await getBookings();
  const found = bookings.find((b) => b.id === id);
  return found ?? null;
}

/**
 * Double-booking validation rule:
 * "The same service cannot be booked twice at the same date and time."
 * (Cancelled bookings do not cause conflicts).
 */
export async function checkDoubleBooking(
  service: Service,
  date: string,
  time: string,
  excludeId?: string
): Promise<{ hasConflict: boolean; message?: string }> {
  const bookings = await getBookings();

  const conflict = bookings.find((b) => {
    if (excludeId && b.id === excludeId) return false;
    if (b.status === "cancelled") return false;
    return b.service === service && b.date === date && b.time === time;
  });

  if (conflict) {
    return {
      hasConflict: true,
      message: `A "${service}" session is already booked on ${date} at ${time}.`,
    };
  }

  return { hasConflict: false };
}

/**
 * Creates a new booking with automatic ID generation and server-side conflict check.
 */
export async function createBooking(
  input: CreateBookingInput
): Promise<{ success: true; booking: Booking } | { success: false; error: string }> {
  // Check double-booking conflict
  const conflict = await checkDoubleBooking(input.service, input.date, input.time);
  if (conflict.hasConflict) {
    return { success: false, error: conflict.message || "Double booking conflict detected." };
  }

  const newBooking: Booking = {
    id: crypto.randomUUID(),
    customerName: input.customerName.trim(),
    email: input.email.trim(),
    service: input.service,
    date: input.date,
    time: input.time,
    status: input.status || "pending",
    notes: input.notes?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  const bookings = await getBookings();
  const updated = [newBooking, ...bookings];
  await saveBookings(updated);

  return { success: true, booking: newBooking };
}

/**
 * Updates an existing booking.
 */
export async function updateBooking(
  id: string,
  updates: Partial<CreateBookingInput>
): Promise<{ success: true; booking: Booking } | { success: false; error: string }> {
  const bookings = await getBookings();
  const index = bookings.findIndex((b) => b.id === id);

  if (index === -1) {
    return { success: false, error: "Booking not found." };
  }

  const existing = bookings[index];
  const targetService = updates.service ?? existing.service;
  const targetDate = updates.date ?? existing.date;
  const targetTime = updates.time ?? existing.time;

  // Conflict check if time, date, or service changed
  if (
    targetService !== existing.service ||
    targetDate !== existing.date ||
    targetTime !== existing.time
  ) {
    const conflict = await checkDoubleBooking(targetService, targetDate, targetTime, id);
    if (conflict.hasConflict) {
      return { success: false, error: conflict.message || "Double booking conflict detected." };
    }
  }

  const updatedBooking: Booking = {
    ...existing,
    ...updates,
    customerName: updates.customerName ? updates.customerName.trim() : existing.customerName,
    email: updates.email ? updates.email.trim() : existing.email,
    notes: updates.notes !== undefined ? updates.notes.trim() || undefined : existing.notes,
  };

  bookings[index] = updatedBooking;
  await saveBookings(bookings);

  return { success: true, booking: updatedBooking };
}

/**
 * Updates only the status of a booking (e.g. quick Confirm or Cancel).
 */
export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<{ success: boolean; error?: string }> {
  const bookings = await getBookings();
  const index = bookings.findIndex((b) => b.id === id);

  if (index === -1) {
    return { success: false, error: "Booking not found." };
  }

  bookings[index].status = status;
  await saveBookings(bookings);
  return { success: true };
}

/**
 * Deletes a booking from the store.
 */
export async function deleteBooking(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const bookings = await getBookings();
  const initialLength = bookings.length;
  const filtered = bookings.filter((b) => b.id !== id);

  if (filtered.length === initialLength) {
    return { success: false, error: "Booking not found." };
  }

  await saveBookings(filtered);
  return { success: true };
}

/**
 * Resets bookings back to the original 10 seed entries.
 */
export async function resetBookingsToSeed(): Promise<Booking[]> {
  await ensureDataFile();
  await saveBookings(SEED_BOOKINGS);
  return SEED_BOOKINGS;
}
