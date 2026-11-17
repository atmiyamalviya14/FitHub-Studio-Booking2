import { z } from "zod";

export const bookingFormSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(2, { message: "Client name must be at least 2 characters." })
    .max(60, { message: "Client name cannot exceed 60 characters." }),
  clientEmail: z
    .string()
    .trim()
    .email({ message: "Please provide a valid email address." }),
  clientPhone: z
    .string()
    .trim()
    .min(7, { message: "Phone number must be at least 7 digits." })
    .regex(/^[+0-9\s\-()]+$/, { message: "Invalid phone number format." }),
  sessionType: z.enum(["personal_training", "group_fitness"], {
    message: "Please select a valid session type.",
  }),
  title: z
    .string()
    .trim()
    .min(3, { message: "Session title must be at least 3 characters." }),
  trainerId: z.string().min(1, { message: "Please select a trainer." }),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be YYYY-MM-DD." }),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, { message: "Time must be HH:MM in 24-hr format." }),
  durationMinutes: z.coerce
    .number()
    .min(15, { message: "Duration must be at least 15 minutes." })
    .max(180, { message: "Duration cannot exceed 180 minutes." }),
  capacity: z.coerce
    .number()
    .min(1, { message: "Capacity must be at least 1." })
    .max(50, { message: "Capacity cannot exceed 50." }),
  notes: z.string().max(300, { message: "Notes cannot exceed 300 characters." }).optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
