export type SessionType = "personal_training" | "group_fitness";

export type BookingStatus = "confirmed" | "completed" | "cancelled";

export interface Trainer {
  id: string;
  name: string;
  specialty: string;
  avatarColor: string;
}

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  sessionType: SessionType;
  title: string;
  trainerId: string;
  trainerName: string;
  date: string; // ISO date format YYYY-MM-DD
  startTime: string; // HH:mm format (24-hour)
  durationMinutes: number; // e.g., 45, 60
  capacity: number; // 1 for PT, up to 15 for group
  attendeesCount: number; // for group sessions
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  sessionType: SessionType;
  title: string;
  trainerId: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  capacity: number;
  notes?: string;
}

export interface BookingFilters {
  search: string;
  sessionType: "all" | SessionType;
  status: "all" | BookingStatus;
  dateFilter: "all" | "today" | "upcoming" | "past";
}
