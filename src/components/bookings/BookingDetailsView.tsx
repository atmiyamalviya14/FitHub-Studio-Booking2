"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Booking, BookingStatus } from "@/types/booking";
import { StatusBadge } from "./StatusBadge";
import { ServiceBadge } from "./ServiceBadge";
import { BookingForm } from "./BookingForm";
import { quickUpdateStatusAction, deleteBookingAction } from "@/lib/actions/booking-actions";
import { formatDate, formatTime } from "@/lib/utils";
import {
  ChevronRight,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Mail,
  FileText,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  AlertTriangle,
  Info,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingDetailsViewProps {
  booking: Booking;
}

export function BookingDetailsView({ booking }: BookingDetailsViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"details" | "edit">("details");
  const [isUpdatingStatus, startStatusTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const isUpdated = searchParams.get("success") === "updated";

  const handleStatusChange = (newStatus: BookingStatus) => {
    startStatusTransition(async () => {
      const res = await quickUpdateStatusAction(booking.id, newStatus);
      if (res.success) {
        setStatusMessage(
          newStatus === "confirmed"
            ? "Session confirmed successfully!"
            : "Session marked as cancelled."
        );
        setTimeout(() => setStatusMessage(null), 4000);
      }
    });
  };

  const handleDelete = () => {
    startDeleteTransition(async () => {
      await deleteBookingAction(booking.id);
    });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <Link href="/bookings" className="hover:text-slate-900 transition-colors">
          Bookings
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="font-semibold text-slate-900 truncate max-w-[200px]">
          {booking.customerName}
        </span>
      </nav>

      {/* Success Notice if just updated */}
      {isUpdated && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-xs animate-slide-down">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">
              Booking details have been updated successfully!
            </p>
          </div>
        </div>
      )}

      {/* Quick Action Status Toast */}
      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between shadow-lg animate-slide-down">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <ServiceBadge service={booking.service} className="text-xs py-1 px-3" />
            <StatusBadge status={booking.status} className="text-xs py-1 px-3" />
            <span className="text-[11px] text-slate-400 font-mono">
              ID: {booking.id.slice(0, 8)}...
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {booking.customerName}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{formatDate(booking.date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold text-slate-700">{formatTime(booking.time)}</span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start md:self-center">
          <button
            onClick={() => setActiveTab("details")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              activeTab === "details"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              activeTab === "edit"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Booking</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "details" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Booking Details & Notes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Card */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span>Session Overview</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block mb-1">Service Type</span>
                  <span className="font-bold text-slate-900">{booking.service}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block mb-1">Scheduled Time</span>
                  <span className="font-bold text-slate-900">
                    {formatDate(booking.date)} at {formatTime(booking.time)}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block mb-1">Current Status</span>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block mb-1">Recorded In System</span>
                  <span className="text-xs text-slate-700 font-medium">
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(booking.createdAt))}
                  </span>
                </div>
              </div>

              {/* Notes Section */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  <span>Session Notes & Requests</span>
                </span>
                {booking.notes ? (
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 text-slate-800 text-sm leading-relaxed">
                    &ldquo;{booking.notes}&rdquo;
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 text-xs italic">
                    No notes provided for this booking.
                  </div>
                )}
              </div>
            </div>

            {/* Customer Details Card */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-600" />
                <span>Customer Contact Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">Full Name</span>
                  <span className="font-semibold text-slate-900">{booking.customerName}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">Email Address</span>
                  <a
                    href={`mailto:${booking.email}`}
                    className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1.5"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>{booking.email}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Actions & Management */}
          <div className="space-y-6">
            {/* Quick Actions Panel */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Front-Desk Quick Actions
              </h3>
              <p className="text-xs text-slate-500">
                Instantly update customer attendance status without opening the full editor.
              </p>

              <div className="space-y-2.5 pt-1">
                {/* Confirm Button */}
                <button
                  onClick={() => handleStatusChange("confirmed")}
                  disabled={booking.status === "confirmed" || isUpdatingStatus}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                    booking.status === "confirmed"
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shadow-emerald-600/20"
                  )}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    {booking.status === "confirmed" ? "Session Confirmed" : "Confirm Session"}
                  </span>
                </button>

                {/* Cancel Button */}
                <button
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={booking.status === "cancelled" || isUpdatingStatus}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                    booking.status === "cancelled"
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                      : "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                  )}
                >
                  <XCircle className="h-4 w-4" />
                  <span>
                    {booking.status === "cancelled" ? "Session Cancelled" : "Cancel Session"}
                  </span>
                </button>

                {/* Edit Full Form Button */}
                <button
                  onClick={() => setActiveTab("edit")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit All Details</span>
                </button>
              </div>
            </div>

            {/* Danger Zone: Delete Booking */}
            <div className="bg-white rounded-xl border border-rose-200 p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Danger Zone</span>
              </h3>
              <p className="text-xs text-slate-500">
                Permanently delete this booking record from the studio database.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Booking</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Mode: Reuses BookingForm.tsx */
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Edit Booking Details
              </h2>
              <p className="text-xs text-slate-500">
                Update customer info, session time, or special instructions.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("details")}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline"
            >
              Cancel & Return
            </button>
          </div>

          <BookingForm mode="edit" initialData={booking} />
        </div>
      )}

      {/* Delete Confirmation Modal (Phase 7 Integrated) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-modal-in">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="h-12 w-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                Delete Booking Confirmation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Are you sure you want to delete the booking for{" "}
                <strong className="text-slate-900">{booking.customerName}</strong> ({booking.service} on {booking.date})?
              </p>
              <p className="text-xs text-rose-600 font-medium">
                This action is permanent and cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                type="button"
                className="flex-1 py-2.5 px-4 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                type="button"
                className="flex-1 py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
