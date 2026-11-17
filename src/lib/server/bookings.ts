import "server-only";

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { Booking, CreateBookingInput, Service, BookingStatus } from "@/types/booking";
import { connectToDatabase, isMongoConfigured } from "./mongodb";
import { BookingModel } from "./models/Booking.model";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

// Default seed data
export const SEED_BOOKINGS: Booking[] = [
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
 * Reports active storage backend (MongoDB vs JSON File Store).
 */
export async function getStorageInfo(): Promise<{ type: "MongoDB" | "JSON File Store"; isConnected: boolean }> {
  if (isMongoConfigured()) {
    const conn = await connectToDatabase();
    if (conn) {
      return { type: "MongoDB", isConnected: true };
    }
  }
  return { type: "JSON File Store", isConnected: true };
}

/**
 * Ensures data directory and bookings.json exist for JSON store.
 */
async function ensureJsonFile(): Promise<void> {
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
 * Reads bookings from JSON file.
 */
async function readJsonBookings(): Promise<Booking[]> {
  await ensureJsonFile();
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Booking[];
  } catch (error) {
    console.error("Failed to read bookings from JSON:", error);
    return SEED_BOOKINGS;
  }
}

/**
 * Writes bookings to JSON file.
 */
async function writeJsonBookings(bookings: Booking[]): Promise<void> {
  await ensureJsonFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(bookings, null, 2), "utf-8");
}

/**
 * Seed MongoDB if collection is currently empty.
 */
async function seedMongoIfEmpty(): Promise<void> {
  const count = await BookingModel.countDocuments();
  if (count === 0) {
    const docs = SEED_BOOKINGS.map((b) => ({
      bookingId: b.id,
      customerName: b.customerName,
      email: b.email,
      service: b.service,
      date: b.date,
      time: b.time,
      status: b.status,
      notes: b.notes || "",
      createdAt: b.createdAt,
    }));
    await BookingModel.insertMany(docs);
  }
}

/**
 * Reads all bookings from active store (MongoDB or JSON file).
 */
export async function getBookings(): Promise<Booking[]> {
  const mongo = await connectToDatabase();
  if (mongo) {
    try {
      await seedMongoIfEmpty();
      const docs = await BookingModel.find().lean();
      return docs.map((doc) => ({
        id: doc.bookingId,
        customerName: doc.customerName,
        email: doc.email,
        service: doc.service as Service,
        date: doc.date,
        time: doc.time,
        status: doc.status as BookingStatus,
        notes: doc.notes || undefined,
        createdAt: doc.createdAt,
      }));
    } catch (e) {
      console.error("MongoDB query error, falling back to JSON:", e);
      return readJsonBookings();
    }
  }

  return readJsonBookings();
}

/**
 * Gets a single booking by ID.
 */
export async function getBookingById(id: string): Promise<Booking | null> {
  const mongo = await connectToDatabase();
  if (mongo) {
    try {
      const doc = await BookingModel.findOne({ bookingId: id }).lean();
      if (!doc) return null;
      return {
        id: doc.bookingId,
        customerName: doc.customerName,
        email: doc.email,
        service: doc.service as Service,
        date: doc.date,
        time: doc.time,
        status: doc.status as BookingStatus,
        notes: doc.notes || undefined,
        createdAt: doc.createdAt,
      };
    } catch (e) {
      console.error("MongoDB find error, falling back to JSON:", e);
    }
  }

  const bookings = await readJsonBookings();
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

  const mongo = await connectToDatabase();
  if (mongo) {
    try {
      await BookingModel.create({
        bookingId: newBooking.id,
        customerName: newBooking.customerName,
        email: newBooking.email,
        service: newBooking.service,
        date: newBooking.date,
        time: newBooking.time,
        status: newBooking.status,
        notes: newBooking.notes || "",
        createdAt: newBooking.createdAt,
      });
      return { success: true, booking: newBooking };
    } catch (e) {
      console.error("MongoDB create error, fallback to JSON:", e);
    }
  }

  const bookings = await readJsonBookings();
  const updated = [newBooking, ...bookings];
  await writeJsonBookings(updated);

  return { success: true, booking: newBooking };
}

/**
 * Updates an existing booking.
 */
export async function updateBooking(
  id: string,
  updates: Partial<CreateBookingInput>
): Promise<{ success: true; booking: Booking } | { success: false; error: string }> {
  const existing = await getBookingById(id);
  if (!existing) {
    return { success: false, error: "Booking not found." };
  }

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

  const mongo = await connectToDatabase();
  if (mongo) {
    try {
      await BookingModel.updateOne(
        { bookingId: id },
        {
          customerName: updatedBooking.customerName,
          email: updatedBooking.email,
          service: updatedBooking.service,
          date: updatedBooking.date,
          time: updatedBooking.time,
          status: updatedBooking.status,
          notes: updatedBooking.notes || "",
        }
      );
      return { success: true, booking: updatedBooking };
    } catch (e) {
      console.error("MongoDB update error, fallback to JSON:", e);
    }
  }

  const bookings = await readJsonBookings();
  const index = bookings.findIndex((b) => b.id === id);
  if (index !== -1) {
    bookings[index] = updatedBooking;
    await writeJsonBookings(bookings);
  }

  return { success: true, booking: updatedBooking };
}

/**
 * Updates only the status of a booking (e.g. quick Confirm or Cancel).
 */
export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<{ success: boolean; error?: string }> {
  const mongo = await connectToDatabase();
  if (mongo) {
    try {
      const res = await BookingModel.updateOne({ bookingId: id }, { status });
      if (res.matchedCount > 0) return { success: true };
    } catch (e) {
      console.error("MongoDB status update error, fallback to JSON:", e);
    }
  }

  const bookings = await readJsonBookings();
  const index = bookings.findIndex((b) => b.id === id);

  if (index === -1) {
    return { success: false, error: "Booking not found." };
  }

  bookings[index].status = status;
  await writeJsonBookings(bookings);
  return { success: true };
}

/**
 * Deletes a booking from the store.
 */
export async function deleteBooking(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const mongo = await connectToDatabase();
  if (mongo) {
    try {
      const res = await BookingModel.deleteOne({ bookingId: id });
      if (res.deletedCount > 0) return { success: true };
    } catch (e) {
      console.error("MongoDB delete error, fallback to JSON:", e);
    }
  }

  const bookings = await readJsonBookings();
  const initialLength = bookings.length;
  const filtered = bookings.filter((b) => b.id !== id);

  if (filtered.length === initialLength) {
    return { success: false, error: "Booking not found." };
  }

  await writeJsonBookings(filtered);
  return { success: true };
}

/**
 * Resets bookings back to original seed entries.
 */
export async function resetBookingsToSeed(): Promise<Booking[]> {
  const mongo = await connectToDatabase();
  if (mongo) {
    try {
      await BookingModel.deleteMany({});
      await seedMongoIfEmpty();
    } catch (e) {
      console.error("MongoDB reset error:", e);
    }
  }

  await ensureJsonFile();
  await writeJsonBookings(SEED_BOOKINGS);
  return SEED_BOOKINGS;
}
