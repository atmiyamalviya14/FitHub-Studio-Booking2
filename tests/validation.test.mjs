import { test, describe } from "node:test";
import assert from "node:assert/strict";

// Helper functions copied from validation module for standalone unit testing
function isPastDate(dateString, referenceDate = new Date()) {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const inputDate = new Date(dateString + "T00:00:00");
  return inputDate < today;
}

function isValidOperatingTime(timeString) {
  const match = timeString.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) return false;

  const [hours, minutes] = timeString.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;

  const minMinutes = 7 * 60; // 07:00
  const maxMinutes = 21 * 60; // 21:00

  return totalMinutes >= minMinutes && totalMinutes <= maxMinutes;
}

function checkConflict(bookings, service, date, time, excludeId) {
  const conflict = bookings.find((b) => {
    if (excludeId && b.id === excludeId) return false;
    if (b.status === "cancelled") return false;
    return b.service === service && b.date === date && b.time === time;
  });

  return Boolean(conflict);
}

describe("FitHub Studio - Edge Cases & Validation Rules", () => {
  describe("1. Operating Hours Validation (07:00 to 21:00)", () => {
    test("rejects 06:59 (1 minute before studio opens)", () => {
      assert.equal(isValidOperatingTime("06:59"), false);
    });

    test("allows 07:00 (exact opening time)", () => {
      assert.equal(isValidOperatingTime("07:00"), true);
    });

    test("allows mid-day session times (09:30, 14:00, 18:30)", () => {
      assert.equal(isValidOperatingTime("09:30"), true);
      assert.equal(isValidOperatingTime("14:00"), true);
      assert.equal(isValidOperatingTime("18:30"), true);
    });

    test("allows 21:00 (exact studio closing time)", () => {
      assert.equal(isValidOperatingTime("21:00"), true);
    });

    test("rejects 21:01 (1 minute after studio closes)", () => {
      assert.equal(isValidOperatingTime("21:01"), false);
    });

    test("rejects invalid formats like '25:00' or 'not-a-time'", () => {
      assert.equal(isValidOperatingTime("25:00"), false);
      assert.equal(isValidOperatingTime("12:65"), false);
      assert.equal(isValidOperatingTime("morning"), false);
    });
  });

  describe("2. Date Past/Future Validation", () => {
    const fixedNow = new Date("2026-11-17T12:00:00");

    test("allows today's date (2026-11-17)", () => {
      assert.equal(isPastDate("2026-11-17", fixedNow), false);
    });

    test("allows future dates (2026-11-18, 2026-12-01)", () => {
      assert.equal(isPastDate("2026-11-18", fixedNow), false);
      assert.equal(isPastDate("2026-12-01", fixedNow), false);
    });

    test("rejects yesterday's date (2026-11-16)", () => {
      assert.equal(isPastDate("2026-11-16", fixedNow), true);
    });

    test("rejects past year dates (2025-11-17)", () => {
      assert.equal(isPastDate("2025-11-17", fixedNow), true);
    });
  });

  describe("3. Double-Booking Conflict Engine", () => {
    const sampleBookings = [
      {
        id: "b-1",
        service: "Yoga",
        date: "2026-11-17",
        time: "17:30",
        status: "confirmed",
      },
      {
        id: "b-2",
        service: "Personal Training",
        date: "2026-11-17",
        time: "08:00",
        status: "pending",
      },
      {
        id: "b-3",
        service: "HIIT",
        date: "2026-11-18",
        time: "10:00",
        status: "cancelled",
      },
    ];

    test("detects conflict for identical service + date + time", () => {
      const hasConflict = checkConflict(sampleBookings, "Yoga", "2026-11-17", "17:30");
      assert.equal(hasConflict, true);
    });

    test("allows different service at the exact same time (PT vs Yoga at 17:30)", () => {
      const hasConflict = checkConflict(sampleBookings, "Personal Training", "2026-11-17", "17:30");
      assert.equal(hasConflict, false);
    });

    test("allows same service at a different time (Yoga at 18:30 instead of 17:30)", () => {
      const hasConflict = checkConflict(sampleBookings, "Yoga", "2026-11-17", "18:30");
      assert.equal(hasConflict, false);
    });

    test("allows same service at same time if existing session was CANCELLED", () => {
      // b-3 is HIIT at 2026-11-18 10:00, but cancelled!
      const hasConflict = checkConflict(sampleBookings, "HIIT", "2026-11-18", "10:00");
      assert.equal(hasConflict, false);
    });

    test("allows updating a booking to its own current time slot (excludeId)", () => {
      const hasConflict = checkConflict(sampleBookings, "Yoga", "2026-11-17", "17:30", "b-1");
      assert.equal(hasConflict, false);
    });
  });
});
