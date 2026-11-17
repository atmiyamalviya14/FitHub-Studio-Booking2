# FitHub Studio — Front-Desk Booking Dashboard

An internal session management web dashboard built for **FitHub Studio**, a boutique fitness studio delivering 1-on-1 personal training and group sessions.

Replacing spreadsheet chaos with a fast, conflict-guarded scheduling system for front-desk staff.

---

## ⚡ Quick Start (Run in under 2 minutes)

### Prerequisites
- Node.js 18.17+ or 20+ installed
- npm (or pnpm / yarn / bun)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 🛠 Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Validation:** Zod
- **Icons:** Lucide React
- **Utility:** clsx, tailwind-merge
- **Data Persistence:** Client-side LocalStorage engine with zero backend dependency (no database or auth needed for v1)

---

## 📁 Project Architecture

```text
src/
├── app/
│   ├── globals.css          # Tailwind CSS v4 setup & custom tokens
│   ├── layout.tsx           # Studio root layout & metadata
│   └── page.tsx             # Main dashboard entrypoint
├── components/
│   ├── dashboard/           # Studio dashboard domain components
│   ├── layout/              # Shared layout components (Header, Nav)
│   └── ui/                  # Reusable UI primitives (Button, Card, Badge)
├── hooks/
│   └── useBookings.ts       # Booking lifecycle, conflict guard & local state
├── lib/
│   ├── constants/
│   │   ├── mock-data.ts     # Initial seed bookings
│   │   └── trainers.ts      # FitHub trainer roster
│   ├── validations/
│   │   └── booking.schema.ts# Zod schemas for booking add/edit
│   ├── storage.ts           # LocalStorage synchronization manager
│   └── utils.ts             # Date/time formatters and Tailwind merger
└── types/
    └── booking.ts           # Domain models and TypeScript contracts
```

---

## 💡 Key Design Highlights
- **Conflict Prevention Engine**: Prevents double-booking trainers in overlapping time windows.
- **Zero Database Hassle**: Fully functional out of the box with realistic seed data and live client persistence.
- **Type Safety**: Strictly typed models with Zod validation.
