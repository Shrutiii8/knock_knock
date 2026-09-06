# IRCTC-Clone Frontend Engineering Portfolio Showcase

A pixel-faithful, frontend-only clone of the **IRCTC (Indian Railway Catering and Tourism Corporation)** web portal, engineered with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS**.

> **Note**: This is an educational/portfolio project demonstrating modern frontend architecture, form handling, state management, responsive design, and mock API orchestration. It is strictly not an official service. No copyrighted logos or trademarks are used, and all backend data/payment transitions are mocked locally. "Ask Disha" chatbot has been explicitly excluded.

---

## 🚀 Key Features & Complete User Flows

1. **Journey Search Engine (`/`)**:
   - Tabbed search widget: *Book Ticket*, *PNR Status*, *Train Schedule*, *Live Status*.
   - Debounced (300ms) station autocomplete with station code badges (50+ Indian railway stations).
   - Station swap button ($\leftrightarrow$) with smooth transition.
   - Date picker with past-date disabling and 120-day Advance Reservation Period (ARP).
   - Quota selection (General, Tatkal, Premium Tatkal, Ladies, Divyaang/Disability, Sr. Citizen).
   - Tatkal booking timing alerts (10:00 AM for AC, 11:00 AM for Non-AC).
   - Auto-rotating promotional carousel with arrows and indicator dots.
   - 9-card popular railway services grid and festive offers strip.

2. **Search Results & Filters (`/search-results`)**:
   - Multi-facet sidebar filters: Departure time slots (Early Morning, Morning, Afternoon, Night), Train types (Vande Bharat, Rajdhani, Shatabdi, etc.), Quotas, and Class pills.
   - Sort bar: Departure time, Arrival time, Duration (fastest first).
   - Realistic seat availability status badges matching authentic IRCTC color conventions:
     - **Green (`#2E7D32`)**: `AVAILABLE 45`
     - **Amber (`#F9A825`)**: `RAC 12`
     - **Orange/Amber (`#E65100`)**: `WL 24`
     - **Red (`#C62828`)**: `NOT AVAILABLE`
   - Detailed station-by-station itinerary modal per train.
   - Skeleton loaders (not blocking spinners) simulating ~600ms network fetch.

3. **Passenger Details & Booking (`/booking`)**:
   - Pinned collapsible train details banner.
   - Dynamic passenger list (Add/Remove rows, up to 6 passengers).
   - Autofill from saved Master Passenger List.
   - Berth preference choices (Lower, Middle, Upper, Side Lower, Side Upper, Window Seat).
   - Food preference choices for premium trains (Veg / Non-Veg).
   - Travel Insurance toggle (₹0.45/passenger) and Free Auto-Upgradation preference.
   - Sticky fare breakdown sidebar (Base fare, Reservation charge, Superfast charge, Tatkal surcharge, GST on AC, IRCTC convenience fee).

4. **Simulated Payment Gateway (`/payment`)**:
   - Tabbed payment methods: UPI (Dynamic QR Code scan & VPA ID), Credit/Debit Card, Net Banking (SBI, HDFC, ICICI, etc.), and IRCTC e-Wallet.
   - 2-second banking authorization delay simulation with progress spinner.

5. **Official Electronic Reservation Slip ERS (`/booking/confirmation`)**:
   - Confetti celebration upon payment success.
   - Generated 10-digit PNR Number.
   - Official Indian Railways e-ticket layout with coach & berth allocations (e.g. `B2-43 LB`), passenger details table, and inspection QR code.
   - Dedicated print view (`window.print()`) with custom print CSS hiding web navigation bars.

6. **PNR Status Enquiry (`/pnr-status`)**:
   - 10-digit PNR lookup with passenger-wise status transitions (`WL` / `RAC` $\rightarrow$ `CNF`).
   - Quick one-click demo PNR buttons.
   - Chart preparation indicator.

7. **Live Train GPS Tracking (`/live-status`)**:
   - Station-by-station progression stepper timeline.
   - Scheduled vs. actual arrival/departure timings.
   - Running delay indicator badge (e.g. *"Train is running 15 mins late"*).

8. **Train Timetable & Schedule (`/train-schedule`)**:
   - Station code, station name, arrival, departure, halt minutes, distance (km), and platform numbers.
   - In-table instant station filtering.

9. **My Account Dashboard (`/account`)**:
   - Profile overview with verified Aadhaar badge.
   - Booking history with "View Ticket" and simulated "Cancel Ticket" (with automatic clerkage fee & refund calculation).
   - IRCTC e-Wallet with top-up simulation and ledger.
   - Master Passenger List management (add/delete saved family travelers).

---

## 🎨 Design System Tokens

- **Primary Navy**: `#0A3D62` (Header, primary buttons, links)
- **Primary Hover**: `#072B45`
- **Secondary Blue**: `#1E5B94` (Secondary nav ribbon, subheadings)
- **Accent Orange**: `#FF6F00` (Search button, Book Now CTAs, highlighted active tabs)
- **Success Green**: `#2E7D32` (`AVAILABLE` status, confirmed tickets)
- **Warning Amber**: `#F9A825` (`RAC` status, Tatkal notices)
- **Error Red**: `#C62828` (`NOT AVAILABLE`, cancellations)
- **Background**: `#F5F7FA`
- **Cards**: `#FFFFFF`
- **Text Primary**: `#1A1A1A`
- **Text Secondary / Muted**: `#5F6368`
- **Borders**: `#D1D5DB`
- **Typography**: Dense, utilitarian information hierarchy with ~4-6px boxy rounded corners and uppercase micro-labels.

---

## ⚡ Performance & Optimization Architecture

- **App Router Route-Level Code Splitting**: All pages (`/search-results`, `/booking`, `/payment`, `/account`, `/pnr-status`, `/live-status`, `/train-schedule`) are independently split into discrete bundles.
- **Initial Bundle Budget**: Main bundle target $<150\text{ KB}$ gzipped.
- **Debounced Inputs**: Station autocomplete features a 300ms debounce with stale query cancellation to prevent unnecessary re-renders.
- **Perceived Performance**: Custom skeleton cards replace generic spinners for train results and PNR queries.
- **Accessible ARIA Live Regions**: Toasts and alert regions use `aria-live="polite"` and `role="dialog"` with focus trap and `Esc` key handling.
- **Target Lighthouse Scores**:
  - Performance $\ge 90$
  - Accessibility $\ge 95$
  - Best Practices $\ge 95$

---

## 🛠 Local Setup & Running

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run production build validation
npm run build

# Start production server
npm start
```
