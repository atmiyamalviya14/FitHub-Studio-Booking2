import { z } from "zod";
import { SERVICES, BOOKING_STATUSES } from "@/types/booking";

// Helper function to check if a date string (YYYY-MM-DD) is in the past
export function isPastDate(dateString: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inputDate = new Date(dateString + "T00:00:00");
  return inputDate < today;
}

// Helper to check if a time string (HH:mm) is between 07:00 and 21:00
export function isValidOperatingTime(timeString: string): boolean {
  const match = timeString.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) return false;

  const [hours, minutes] = timeString.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;

  const minMinutes = 7 * 60; // 07:00
  const maxMinutes = 21 * 60; // 21:00

  return totalMinutes >= minMinutes && totalMinutes <= maxMinutes;
}

export const bookingFormSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, { message: "Customer name must be at least 2 characters." })
    .max(50, { message: "Customer name cannot exceed 50 characters." }),

  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),

  service: z.enum(SERVICES as [string, ...string[]], {
    message: "Please select a valid service.",
  }),

  date: z
    .string()
    .min(1, { message: "Date is required." })
    .refine((val) => !isPastDate(val), {
      message: "Booking date cannot be in the past.",
    }),

  time: z
    .string()
    .min(1, { message: "Time is required." })
    .refine((val) => isValidOperatingTime(val), {
      message: "Time must be within operating hours (between 07:00 and 21:00).",
    }),

  status: z.enum(BOOKING_STATUSES as [string, ...string[]]).default("pending"),

  notes: z
    .string()
    .max(200, { message: "Notes cannot exceed 200 characters." })
    .optional()
    .or(z.literal("")),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
