"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Booking, BookingFilters, BookingFormData } from "@/types/booking";
import { storage } from "@/lib/storage";
import { TRAINERS } from "@/lib/constants/trainers";

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filters, setFilters] = useState<BookingFilters>({
    search: "",
    sessionType: "all",
    status: "all",
    dateFilter: "all",
  });

  // Load from local storage on mount
  useEffect(() => {
    const data = storage.getBookings();
    setBookings(data);
    setIsLoaded(true);
  }, []);

  // Save changes to storage whenever bookings state changes (after initial load)
  const persistBookings = useCallback((newBookings: Booking[]) => {
    setBookings(newBookings);
    storage.saveBookings(newBookings);
  }, []);

  // Helper to convert date and HH:mm into minute timestamp for overlap calculation
  const getTimeWindow = (dateStr: string, timeStr: string, durationMinutes: number) => {
    const [h, m] = timeStr.split(":").map(Number);
    const startMinutes = h * 60 + m;
    const endMinutes = startMinutes + durationMinutes;
    return { date: dateStr, start: startMinutes, end: endMinutes };
  };

  // Conflict detection: checks if trainer or room is already booked at that time
  const checkConflict = useCallback(
    (
      trainerId: string,
      date: string,
      startTime: string,
      durationMinutes: number,
      excludeBookingId?: string
    ): { hasConflict: boolean; conflictingBooking?: Booking; message?: string } => {
      const targetWindow = getTimeWindow(date, startTime, durationMinutes);

      const conflict = bookings.find((b) => {
        if (excludeBookingId && b.id === excludeBookingId) return false;
        if (b.status === "cancelled") return false;
        if (b.date !== targetWindow.date) return false;
        if (b.trainerId !== trainerId) return false;

        const bookingWindow = getTimeWindow(b.date, b.startTime, b.durationMinutes);
        // Overlap condition: startA < endB && endA > startB
        return targetWindow.start < bookingWindow.end && targetWindow.end > bookingWindow.start;
      });

      if (conflict) {
        return {
          hasConflict: true,
          conflictingBooking: conflict,
          message: `Trainer ${conflict.trainerName} already has "${conflict.title}" scheduled from ${conflict.startTime} (${conflict.durationMinutes} mins).`,
        };
      }

      return { hasConflict: false };
    },
    [bookings]
  );

  // Add booking
  const addBooking = useCallback(
    (formData: BookingFormData) => {
      const conflictCheck = checkConflict(
        formData.trainerId,
        formData.date,
        formData.startTime,
        formData.durationMinutes
      );

      if (conflictCheck.hasConflict) {
        throw new Error(conflictCheck.message);
      }

      const trainer = TRAINERS.find((t) => t.id === formData.trainerId);
      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        sessionType: formData.sessionType,
        title: formData.title,
        trainerId: formData.trainerId,
        trainerName: trainer?.name ?? "Assigned Trainer",
        date: formData.date,
        startTime: formData.startTime,
        durationMinutes: formData.durationMinutes,
        capacity: formData.capacity,
        attendeesCount: formData.sessionType === "personal_training" ? 1 : 1,
        status: "confirmed",
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [newBooking, ...bookings];
      persistBookings(updated);
      return newBooking;
    },
    [bookings, checkConflict, persistBookings]
  );

  // Update booking
  const updateBooking = useCallback(
    (id: string, formData: BookingFormData) => {
      const conflictCheck = checkConflict(
        formData.trainerId,
        formData.date,
        formData.startTime,
        formData.durationMinutes,
        id
      );

      if (conflictCheck.hasConflict) {
        throw new Error(conflictCheck.message);
      }

      const trainer = TRAINERS.find((t) => t.id === formData.trainerId);
      const updated = bookings.map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientPhone: formData.clientPhone,
          sessionType: formData.sessionType,
          title: formData.title,
          trainerId: formData.trainerId,
          trainerName: trainer?.name ?? b.trainerName,
          date: formData.date,
          startTime: formData.startTime,
          durationMinutes: formData.durationMinutes,
          capacity: formData.capacity,
          notes: formData.notes,
          updatedAt: new Date().toISOString(),
        };
      });

      persistBookings(updated);
    },
    [bookings, checkConflict, persistBookings]
  );

  // Cancel booking
  const cancelBooking = useCallback(
    (id: string) => {
      const updated = bookings.map((b) =>
        b.id === id ? { ...b, status: "cancelled" as const, updatedAt: new Date().toISOString() } : b
      );
      persistBookings(updated);
    },
    [bookings, persistBookings]
  );

  // Reset to initial mock data
  const resetToDefault = useCallback(() => {
    const defaults = storage.resetToDefault();
    setBookings(defaults);
  }, []);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];

    return bookings.filter((b) => {
      // Search
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesClient = b.clientName.toLowerCase().includes(query);
        const matchesTrainer = b.trainerName.toLowerCase().includes(query);
        const matchesTitle = b.title.toLowerCase().includes(query);
        if (!matchesClient && !matchesTrainer && !matchesTitle) return false;
      }

      // Session Type
      if (filters.sessionType !== "all" && b.sessionType !== filters.sessionType) {
        return false;
      }

      // Status
      if (filters.status !== "all" && b.status !== filters.status) {
        return false;
      }

      // Date Filter
      if (filters.dateFilter === "today" && b.date !== todayStr) {
        return false;
      }
      if (filters.dateFilter === "upcoming" && b.date < todayStr) {
        return false;
      }
      if (filters.dateFilter === "past" && b.date >= todayStr) {
        return false;
      }

      return true;
    });
  }, [bookings, filters]);

  // Quick stats
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const todayBookings = bookings.filter((b) => b.date === todayStr && b.status !== "cancelled");
    const ptCount = bookings.filter((b) => b.sessionType === "personal_training" && b.status !== "cancelled").length;
    const groupCount = bookings.filter((b) => b.sessionType === "group_fitness" && b.status !== "cancelled").length;
    const activeCount = bookings.filter((b) => b.status === "confirmed").length;

    return {
      todayCount: todayBookings.length,
      activeCount,
      ptCount,
      groupCount,
      totalCount: bookings.length,
    };
  }, [bookings]);

  return {
    bookings,
    filteredBookings,
    stats,
    filters,
    setFilters,
    isLoaded,
    addBooking,
    updateBooking,
    cancelBooking,
    checkConflict,
    resetToDefault,
  };
}
