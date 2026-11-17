# FitHub Studio — Front-Desk Booking Dashboard

An internal session-scheduling web dashboard built for **FitHub Studio**, a boutique fitness studio delivering 1-on-1 personal training and group sessions (Yoga, HIIT, Pilates).

Replaces spreadsheet chaos with a high-speed, conflict-guarded internal scheduling workspace for front-desk staff.

---

## ⚡ Quick Start (Run in under 2 minutes)

### Prerequisites
- **Node.js** 18.17+ or 20+ installed
- **npm** (or pnpm / yarn / bun)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Run Automated Unit Tests (15 Passing Tests)
```bash
npm test
```
Runs the automated test suite testing past date rejection, operating hours boundaries (06:59 vs 07:00, 21:00 vs 21:01), and double-booking conflict prevention.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🛠 Tech Stack
* **Framework:** Next.js 16 (App Router with Partial Prerendering)
* **Language:** TypeScript (Strict mode, **zero use of `any`**)
* **Styling:** Tailwind CSS v4
* **Validation:** Zod (Client-side feedback & Server Action enforcement)
* **Icons:** Lucide React
* **Persistence:** Dual-engine data layer:
  * **Default (Zero Setup):** Server-side JSON storage in `data/bookings.json` (seeded with 10 sample bookings).
  * **Optional MongoDB:** If `MONGODB_URI` is provided in `.env.local`, the system automatically connects to MongoDB via Mongoose.

---

## 📊 Data Model & Validation Rules

Each booking record strictly conforms to the client brief:

| Field | Type | Rules & Constraints |
| :--- | :--- | :--- |
| `id` | `string` | Generated automatically with `crypto.randomUUID()` |
| `customerName` | `string` | **Required**, 2 to 50 characters, trimmed |
| `email` | `string` | **Required**, RFC-compliant valid email address |
| `service` | `enum` | `"Personal Training"` \| `"Yoga"` \| `"HIIT"` \| `"Pilates"` |
| `date` | `string (ISO)` | **Required**, `YYYY-MM-DD`, cannot be in the past |
| `time` | `string` | **Required**, operating hours between `07:00` and `21:00` |
| `status` | `enum` | `"pending"` \| `"confirmed"` \| `"cancelled"` (Default: `pending`) |
| `notes` | `string` | Optional, max 200 characters with live character counter |
| `createdAt` | `string (ISO)` | Set automatically via server timestamp |

---

## 📁 Project Architecture

```text
D:\Atrosot\
├── data/
│   └── bookings.json             # Seeded JSON data store (10 bookings)
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Global layout with Suspense-wrapped Navbar & footer
│   │   ├── loading.tsx           # Instant animated skeleton loader
│   │   ├── error.tsx             # Client error boundary with "Try Again"
│   │   ├── not-found.tsx         # Custom 404 page for missing or deleted IDs
│   │   ├── page.tsx              # / Dashboard (4 KPIs + Next 5 upcoming sessions)
│   │   └── bookings/
│   │       ├── page.tsx          # /bookings Directory (Search, filters, table/cards)
│   │       ├── new/
│   │       │   └── page.tsx      # /bookings/new Create booking page
│   │       └── [id]/
│   │           └── page.tsx      # /bookings/[id] Dynamic details & edit page
│   ├── components/
│   │   ├── bookings/
│   │   │   ├── BookingForm.tsx   # Reusable form component (Create & Edit modes)
│   │   │   ├── BookingsDirectory.tsx # Client directory wrapper with URL params
│   │   │   ├── BookingsFilters.tsx   # Search bar & Service/Status dropdowns
│   │   │   ├── BookingsTable.tsx     # Desktop table + Mobile touch cards (375px)
│   │   │   ├── BookingDetailsView.tsx# Details card + Quick Confirm/Cancel + Delete modal
│   │   │   ├── ServiceBadge.tsx  # Service badge styling (Personal Training, Yoga, HIIT, Pilates)
│   │   │   └── StatusBadge.tsx   # Status badge styling (pending, confirmed, cancelled)
│   │   ├── dashboard/
│   │   │   ├── DashboardHeader.tsx   # Welcome banner, storage indicator & CTAs
│   │   │   ├── StatsCards.tsx        # 4 KPI cards (Total, Today's, Pending, Confirmed)
│   │   │   └── UpcomingList.tsx      # Next 5 upcoming sessions (chronological sort)
│   │   ├── layout/
│   │   │   └── Navbar.tsx        # Responsive header with mobile drawer (375px)
│   │   └── ui/                   # Reusable UI primitives (Button, Card, Badge)
│   ├── lib/
│   │   ├── actions/
│   │   │   └── booking-actions.ts# Server Actions (Create, Update, Quick Status, Delete)
│   │   ├── server/
│   │   │   ├── bookings.ts       # Server repository with Double-Booking check
│   │   │   ├── mongodb.ts        # Cached MongoDB connection manager
│   │   │   └── models/
│   │   │       └── Booking.model.ts # Mongoose schema with compound indexes
│   │   ├── validations/
│   │   │   └── booking.ts        # Zod schema enforcing operating hours & dates
│   │   └── utils.ts              # Date/time formatters and Tailwind merger
│   └── types/
│       └── booking.ts            # Strict domain types and enums
└── tests/
    └── validation.test.mjs       # Unit test suite (15 automated tests)
```

---

## 🎯 Required Features Walkthrough

### 1. Dashboard Overview (`/`)
* **4 Summary KPI Cards**:
  * **Total Bookings**: Count of all sessions recorded in the studio.
  * **Today's Sessions**: Filtered for sessions matching today's date (`YYYY-MM-DD`).
  * **Pending Confirmation**: Sessions needing front-desk review.
  * **Confirmed Sessions**: Active, ready-to-go sessions.
* **Next 5 Upcoming Bookings**:
  * Sorted chronologically (soonest first).
  * Displays customer name, email, service badge, date & time, status badge, and "Details" shortcut.
  * Includes a friendly empty state if no upcoming sessions exist.

### 2. Bookings Directory (`/bookings`)
* **Responsive Presentation**:
  * **Desktop Table**: Columns for Customer, Service, Date & Time, Status, Notes preview, and Actions.
  * **Mobile Cards (375px)**: Touch-friendly cards designed for single-hand phone usage.
* **Search & Filters**:
  * Real-time search by customer name or email.
  * Filter by Service (`Personal Training`, `Yoga`, `HIIT`, `Pilates`).
  * Filter by Status (`pending`, `confirmed`, `cancelled`).
  * One-click "Reset" button when filters are active.
* **Bonus Feature — Shareable Filtered URLs**:
  * All search queries and filters sync to the URL (e.g. `/bookings?service=Yoga&status=confirmed`). Staff can copy and send links to colleagues.

### 3. Create Booking (`/bookings/new`)
* Form with client-side feedback and server-side Zod validation.
* Date picker defaults to **today's date** and blocks past dates (`min={today}`).
* Time picker enforces studio operating hours (**07:00 to 21:00**) with quick-pick time pills (`08:00`, `09:30`, `11:00`, `14:00`, `17:30`, `18:30`).
* **Double-Booking Collision Guard**: Prevents scheduling the same service twice at the identical date and time. Shows an explicit red conflict alert banner if collision occurs.
* On successful submission: Redirects to `/bookings` with an animated green success confirmation banner.

### 4. Booking Details & Edit (`/bookings/[id]`)
* **Dynamic Route**: Fetches booking by ID; triggers Next.js `notFound()` if ID is invalid or deleted.
* **Overview Card**: Complete customer details, service type, schedule, creation timestamp, and notes.
* **Quick Actions**: One-click **Confirm** and **Cancel** buttons with instant status toast updates.
* **Component Reuse**: "Edit Booking" tab reuses `BookingForm.tsx` in edit mode pre-populated with existing data.

### 5. Safe Deletion Flow
* Accessible delete confirmation modal: *"Are you sure you want to delete the booking for [Customer Name]? This action cannot be undone."*
* Executes `deleteBookingAction` via Server Action, purges the record, and redirects to `/bookings` with confirmation.

---

## 💡 Key Architectural Decisions

1. **Server Components vs. Client Components Boundary**:
   * Pages (`/`, `/bookings`, `/bookings/[id]`, `/bookings/new`) are **Server Components**. They fetch data directly on the server without client waterfall requests.
   * Interactive components (`BookingForm`, `BookingsFilters`, `BookingsDirectory`, `Navbar`) are **Client Components** (`"use client"`) to handle user input, URL sync, and transitions.

2. **Server Actions for All Mutations**:
   * Instead of legacy API Route boilerplate, all write operations use **Next.js Server Actions** (`createBookingAction`, `updateBookingAction`, `quickUpdateStatusAction`, `deleteBookingAction`).
   * Benefits: Progressive enhancement, type safety, automatic cache revalidation via `revalidatePath`, and zero client API exposure.

3. **Dual-Persistence Adapter (JSON File + MongoDB)**:
   * By default, reads and writes from `data/bookings.json` with Node `fs/promises`.
   * If `MONGODB_URI` is provided, transparently persists to MongoDB with Mongoose.

4. **Streaming with Suspense & Partial Prerendering (PPR)**:
   * Dynamic data fetches are isolated within `<Suspense fallback={<Loading />}>` boundaries so the static app shell loads in under 50ms while data streams in smoothly.

---

## 🗄️ Database Migration Guide (Moving to Production)

To migrate from the local JSON file to a production database (e.g. PostgreSQL with Prisma, Supabase, or MongoDB Atlas):

### Option A: MongoDB Atlas (Already Built-in!)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/fithub?retryWrites=true&w=majority
   ```
3. Restart the dev server (`npm run dev`). FitHub Studio will automatically detect MongoDB, seed the collection, and store all bookings in the cloud.

### Option B: PostgreSQL + Prisma
1. Install Prisma: `npm install @prisma/client` and `npm install -D prisma`.
2. Initialize: `npx prisma init --datasource-provider postgresql`.
3. Define the Booking schema in `prisma/schema.prisma`:
   ```prisma
   model Booking {
     id           String   @id @default(uuid())
     customerName String
     email        String
     service      String
     date         String
     time         String
     status       String   @default("pending")
     notes        String?
     createdAt    DateTime @default(now())

     @@unique([service, date, time]) // Database-level double-booking constraint!
   }
   ```
4. Replace the functions inside `src/lib/server/bookings.ts` with Prisma queries:
   * `prisma.booking.findMany()`
   * `prisma.booking.create()`
   * `prisma.booking.update()`
   * `prisma.booking.delete()`

---

## 🚀 Future Roadmap (With More Time)
* **Weekly Calendar / Timetable View**: Interactive drag-and-drop grid view for visual front-desk scheduling.
* **Email Confirmations**: Automated client confirmation and cancellation emails via Resend or SendGrid.
* **Dark Mode**: High-contrast theme toggle for early morning or late night front-desk shifts.
* **Capacity Tracking for Group Classes**: Track remaining slots (e.g. 10/12 spots booked for Yoga).

---

## 🎙️ Section 8: Review Call Walkthrough & Cheat Sheet

Use this cheat sheet to answer all questions during the code review call:

### Q1: Which components are Server Components and which are Client Components, and why?
* **Server Components:**
  * `src/app/page.tsx` (Dashboard home)
  * `src/app/bookings/page.tsx` (Bookings list page)
  * `src/app/bookings/[id]/page.tsx` (Booking details page)
  * `src/app/bookings/new/page.tsx` (New booking page wrapper)
  * **Why:** They run on the server, fetch data directly from disk/database without client network roundtrips, reduce JavaScript bundle size, and render initial HTML instantly for fast Largest Contentful Paint (LCP).
* **Client Components (`"use client"`):**
  * `BookingForm.tsx`: Needs form state (`useState`), live character counter, quick time-slot buttons, and `useActionState`.
  * `BookingsDirectory.tsx` & `BookingsFilters.tsx`: Need user interaction for live debounced text filtering, dropdown events, and `useSearchParams`.
  * `Navbar.tsx`: Needs mobile hamburger drawer state (`useState`) and active link detection (`usePathname`).
  * **Why:** Any component that requires browser events, React state, or interactive UI hooks must be a Client Component.

### Q2: Where does validation run, and why do it on the server as well as the client?
* **Where:**
  * **Client validation:** Inside HTML5 inputs (`required`, `min="07:00"`, `max="21:00"`, `min={today}`) and before submission for instant user feedback.
  * **Server validation:** Inside `createBookingAction` and `updateBookingAction` using the **Zod schema** (`src/lib/validations/booking.ts`).
* **Why both?**
  * Client validation gives users **instant feedback** without waiting for network requests.
  * Server validation is **mandatory for security and data integrity**: client checks can easily be bypassed (e.g. via curl, Postman, or disabling JavaScript). The server is the single source of truth that guarantees no past dates or out-of-hours bookings enter the system.

### Q3: How does the list page get fresh data after a booking is created?
* After `createBooking(data)` succeeds inside the Server Action, we call:
  ```ts
  revalidatePath("/");
  revalidatePath("/bookings");
  redirect("/bookings?success=created");
  ```
* `revalidatePath` instructs Next.js to purge its server-side cache for those routes. When the user is redirected to `/bookings`, Next.js automatically re-fetches the latest bookings from the data store, rendering the newly created booking immediately.

### Q4: How did you prevent double bookings? What would break if two people saved at the same moment?
* **How it is prevented:**
  * In `src/lib/server/bookings.ts`, `checkDoubleBooking()` checks if a non-cancelled booking with the identical `service`, `date`, and `time` already exists.
  * If found, the Server Action aborts and returns a user-friendly error message that is displayed under the date/time inputs.
* **Race Condition (If two people save at the exact same millisecond):**
  * With a simple JSON file, a race condition could occur if two requests read the file simultaneously before either writes back.
  * **The Fix for Production:** In a real database (PostgreSQL/MongoDB), we enforce this at the database engine level with a **Unique Compound Index** (`@@unique([service, date, time])`). The database will atomically reject the second transaction with a unique constraint violation error, making double-booking physically impossible even under high concurrency.

### Q5: What would you change to move from a JSON file to a real database?
1. Replace Node `fs/promises` read/write calls with an ORM like **Prisma** or query builder like **Drizzle**.
2. Define a migration schema with a unique compound index on `(service, date, time)`.
3. Set connection pooling (e.g. PgBouncer or Prisma Accelerate) to manage database connections during serverless invocations.
4. *(Note: Our project already includes a working MongoDB adapter in `src/lib/server/mongodb.ts` that activates automatically when `MONGODB_URI` is provided!)*

### Q6: Live Change Request (Adding a new service like "Boxing" or a new field)
* **To add "Boxing":**
  1. Open `src/types/booking.ts`: Add `"Boxing"` to `Service` type and `SERVICES` array:
     ```ts
     export type Service = "Personal Training" | "Yoga" | "HIIT" | "Pilates" | "Boxing";
     ```
  2. Open `src/lib/validations/booking.ts`: Add `"Boxing"` to the Zod enum.
  3. Open `src/components/bookings/ServiceBadge.tsx`: Add a color style for Boxing (e.g. `bg-red-50 text-red-700 border-red-200`).
  * Done! The dropdowns in `BookingForm`, filter dropdowns in `BookingsFilters`, and badges across the app will immediately support Boxing with zero other changes.
