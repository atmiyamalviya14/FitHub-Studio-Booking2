"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { bookingFormSchema } from "@/lib/validations/booking";
import {
  createBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
} from "@/lib/server/bookings";
import { Service, BookingStatus } from "@/types/booking";

export interface ActionState {
  success?: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  conflictError?: string;
}

/**
 * Server Action to create a new booking with Zod and double-booking conflict checks.
 */
export async function createBookingAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    customerName: formData.get("customerName") as string,
    email: formData.get("email") as string,
    service: formData.get("service") as Service,
    date: formData.get("date") as string,
    time: formData.get("time") as string,
    status: (formData.get("status") as BookingStatus) || "pending",
    notes: (formData.get("notes") as string) || "",
  };

  // 1. Server-side Zod validation
  const validation = bookingFormSchema.safeParse(rawData);
  if (!validation.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of validation.error.issues) {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return {
      success: false,
      message: "Please correct the errors in the form.",
      fieldErrors,
    };
  }

  // 2. Server storage creation with Double-Booking check
  const result = await createBooking(validation.data);

  if (!result.success) {
    return {
      success: false,
      conflictError: result.error,
      fieldErrors: {
        time: result.error,
      },
    };
  }

  // 3. Revalidate affected pages
  revalidatePath("/");
  revalidatePath("/bookings");

  // 4. Redirect to list with success query param
  redirect("/bookings?success=created");
}

/**
 * Server Action to update an existing booking.
 */
export async function updateBookingAction(
  id: string,
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    customerName: formData.get("customerName") as string,
    email: formData.get("email") as string,
    service: formData.get("service") as Service,
    date: formData.get("date") as string,
    time: formData.get("time") as string,
    status: (formData.get("status") as BookingStatus) || "pending",
    notes: (formData.get("notes") as string) || "",
  };

  const validation = bookingFormSchema.safeParse(rawData);
  if (!validation.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of validation.error.issues) {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return {
      success: false,
      message: "Please correct the errors in the form.",
      fieldErrors,
    };
  }

  const result = await updateBooking(id, validation.data);

  if (!result.success) {
    return {
      success: false,
      conflictError: result.error,
      fieldErrors: {
        time: result.error,
      },
    };
  }

  revalidatePath("/");
  revalidatePath("/bookings");
  revalidatePath(`/bookings/${id}`);

  redirect(`/bookings/${id}?success=updated`);
}

/**
 * Quick Action: update status (e.g. Confirm or Cancel).
 */
export async function quickUpdateStatusAction(
  id: string,
  status: BookingStatus
): Promise<{ success: boolean; error?: string }> {
  const res = await updateBookingStatus(id, status);
  if (res.success) {
    revalidatePath("/");
    revalidatePath("/bookings");
    revalidatePath(`/bookings/${id}`);
  }
  return res;
}

/**
 * Delete a booking permanently and redirect to /bookings.
 */
export async function deleteBookingAction(id: string): Promise<void> {
  await deleteBooking(id);
  revalidatePath("/");
  revalidatePath("/bookings");
  redirect("/bookings?success=deleted");
}
