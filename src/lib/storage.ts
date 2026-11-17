import { Booking } from "@/types/booking";
import { INITIAL_BOOKINGS } from "./constants/mock-data";

const STORAGE_KEY = "fithub_studio_bookings_v1";

export const storage = {
  getBookings: (): Booking[] => {
    if (typeof window === "undefined") {
      return INITIAL_BOOKINGS;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
        return INITIAL_BOOKINGS;
      }
      return JSON.parse(stored) as Booking[];
    } catch (error) {
      console.error("Failed to read bookings from localStorage:", error);
      return INITIAL_BOOKINGS;
    }
  },

  saveBookings: (bookings: Booking[]): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (error) {
      console.error("Failed to save bookings to localStorage:", error);
    }
  },

  resetToDefault: (): Booking[] => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
    }
    return INITIAL_BOOKINGS;
  },
};
