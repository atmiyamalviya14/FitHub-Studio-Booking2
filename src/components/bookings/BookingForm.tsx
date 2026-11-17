"use client";

import React, { useState, useActionState } from "react";
import Link from "next/link";
import { Booking, SERVICES, BOOKING_STATUSES, Service, BookingStatus } from "@/types/booking";
import { createBookingAction, updateBookingAction } from "@/lib/actions/booking-actions";
import {
  User,
  Dumbbell,
  FileText,
  AlertTriangle,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  initialData?: Booking;
  mode: "create" | "edit";
}

export function BookingForm({ initialData, mode }: BookingFormProps) {
  // Bind ID if in edit mode
  const boundAction =
    mode === "edit" && initialData
      ? updateBookingAction.bind(null, initialData.id)
      : createBookingAction;

  const [state, formAction, isPending] = useActionState(boundAction, null);

  // Today's ISO date string for default value and min date boundary
  const todayStr = new Date().toISOString().split("T")[0];

  // Controlled states for quick interactions & live feedback
  const [customerName, setCustomerName] = useState(initialData?.customerName || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [service, setService] = useState<Service>(initialData?.service || "Personal Training");
  const [date, setDate] = useState(initialData?.date || todayStr);
  const [time, setTime] = useState(initialData?.time || "09:00");
  const [status, setStatus] = useState<BookingStatus>(initialData?.status || "pending");
  const [notes, setNotes] = useState(initialData?.notes || "");

  // Common studio time slots for quick front-desk selection
  const commonTimeSlots = ["08:00", "09:30", "11:00", "14:00", "17:30", "18:30"];

  return (
    <form action={formAction} className="space-y-6">
      {/* Double-Booking / Conflict Alert Box */}
      {state?.conflictError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 flex items-start gap-3 animate-slide-down">
          <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-900 dark:text-rose-100">
              Double-Booking Conflict Detected
            </h4>
            <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300">
              {state.conflictError}
            </p>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium pt-1">
              Tip: FitHub Studio allows only one session per service at any specific date and time slot. Please adjust the time or service.
            </p>
          </div>
        </div>
      )}

      {/* General Validation Error Alert */}
      {state?.message && !state?.conflictError && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-200 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100">Validation Notice</h4>
            <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300">{state.message}</p>
          </div>
        </div>
      )}

      {/* Section 1: Customer Details */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Customer Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Customer Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="customerName"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Customer Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="customerName"
                name="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Sarah Connor"
                maxLength={50}
                required
                className={cn(
                  "w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border rounded-lg outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400",
                  state?.fieldErrors?.customerName
                    ? "border-rose-400 focus:ring-2 focus:ring-rose-400/20"
                    : "border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                )}
              />
            </div>
            {state?.fieldErrors?.customerName ? (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {state.fieldErrors.customerName}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Between 2 and 50 characters</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sarah@example.com"
                required
                className={cn(
                  "w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border rounded-lg outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400",
                  state?.fieldErrors?.email
                    ? "border-rose-400 focus:ring-2 focus:ring-rose-400/20"
                    : "border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                )}
              />
            </div>
            {state?.fieldErrors?.email ? (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {state.fieldErrors.email}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Used for booking confirmations</p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Session Schedule & Service */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Dumbbell className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Service & Schedule</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Service Selection */}
          <div className="space-y-1.5">
            <label
              htmlFor="service"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Studio Service <span className="text-rose-500">*</span>
            </label>
            <select
              id="service"
              name="service"
              value={service}
              onChange={(e) => setService(e.target.value as Service)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-900 dark:text-slate-100 cursor-pointer"
            >
              {SERVICES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {state?.fieldErrors?.service && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {state.fieldErrors.service}
              </p>
            )}
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label
              htmlFor="date"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Session Date <span className="text-rose-500">*</span>
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={date}
              min={mode === "create" ? todayStr : undefined}
              onChange={(e) => setDate(e.target.value)}
              required
              className={cn(
                "w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border rounded-lg outline-none transition-all text-slate-900 dark:text-slate-100 cursor-pointer",
                state?.fieldErrors?.date
                  ? "border-rose-400 focus:ring-2 focus:ring-rose-400/20"
                  : "border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              )}
            />
            {state?.fieldErrors?.date ? (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {state.fieldErrors.date}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Defaults to today</p>
            )}
          </div>

          {/* Time Picker */}
          <div className="space-y-1.5">
            <label
              htmlFor="time"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Session Time <span className="text-rose-500">*</span>
            </label>
            <input
              id="time"
              name="time"
              type="time"
              min="07:00"
              max="21:00"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className={cn(
                "w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border rounded-lg outline-none transition-all text-slate-900 dark:text-slate-100 cursor-pointer",
                state?.fieldErrors?.time
                  ? "border-rose-400 focus:ring-2 focus:ring-rose-400/20"
                  : "border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              )}
            />
            {state?.fieldErrors?.time ? (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {state.fieldErrors.time}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Hours: 07:00 to 21:00</p>
            )}
          </div>
        </div>

        {/* Quick Time Slot Buttons */}
        <div className="pt-2">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1.5">
            Quick Time Slots:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {commonTimeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={cn(
                  "px-2.5 py-1 text-xs rounded-md border font-mono transition-colors cursor-pointer",
                  time === slot
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Status Dropdown (Shown in Edit mode or defaults to pending) */}
        {mode === "edit" && (
          <div className="pt-2 max-w-xs space-y-1.5">
            <label
              htmlFor="status"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Session Status
            </label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as BookingStatus)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 capitalize text-slate-900 dark:text-slate-100 cursor-pointer"
            >
              {BOOKING_STATUSES.map((st) => (
                <option key={st} value={st} className="capitalize">
                  {st.charAt(0).toUpperCase() + st.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Section 3: Notes (Optional) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <label
            htmlFor="notes"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
          >
            <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Session Notes (Optional)</span>
          </label>
          <span
            className={cn(
              "text-[11px]",
              notes.length > 180 ? "text-amber-600 font-semibold" : "text-slate-400 dark:text-slate-500"
            )}
          >
            {notes.length} / 200 characters
          </span>
        </div>

        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={200}
          placeholder="e.g. First session baseline assessment; customer requested low-impact warmup."
          className={cn(
            "w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border rounded-lg outline-none transition-all resize-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400",
            state?.fieldErrors?.notes
              ? "border-rose-400 focus:ring-2 focus:ring-rose-400/20"
              : "border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          )}
        />
        {state?.fieldErrors?.notes && (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            {state.fieldErrors.notes}
          </p>
        )}
      </div>

      {/* Form Submission Actions */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
        <Link
          href={mode === "edit" && initialData ? `/bookings/${initialData.id}` : "/bookings"}
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-colors text-center"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 text-white text-sm font-semibold shadow-xs shadow-emerald-600/30 transition-all cursor-pointer"
        >
          {isPending ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Saving Booking...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{mode === "create" ? "Confirm & Schedule Booking" : "Save Changes"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
