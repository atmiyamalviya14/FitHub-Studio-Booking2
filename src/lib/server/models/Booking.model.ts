import "server-only";
import mongoose, { Schema, Model, Document } from "mongoose";
import { Booking, SERVICES, BOOKING_STATUSES } from "@/types/booking";

export interface IBookingDocument extends Document, Omit<Booking, "id"> {
  bookingId: string;
}

const BookingSchema = new Schema<IBookingDocument>(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      minlength: [2, "Customer name must be at least 2 characters"],
      maxlength: [50, "Customer name cannot exceed 50 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    service: {
      type: String,
      required: [true, "Service is required"],
      enum: SERVICES,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      index: true,
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    status: {
      type: String,
      enum: BOOKING_STATUSES,
      default: "pending",
      index: true,
    },
    notes: {
      type: String,
      maxlength: [200, "Notes cannot exceed 200 characters"],
      trim: true,
      default: "",
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Compound index for fast double-booking collision checking
BookingSchema.index({ service: 1, date: 1, time: 1 });

export const BookingModel: Model<IBookingDocument> =
  mongoose.models.Booking || mongoose.model<IBookingDocument>("Booking", BookingSchema);
