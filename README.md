# DormIQ — The Intelligence Layer for Modern Hostel Living
> **"Your hostel. Under control."** • **"Smarter spaces. Better living."**

DormIQ is a smart hostel operating and resident experience platform designed with the aesthetic of **"The Dorm Control Room"**. It brings residents, maintenance technicians, wardens, and infrastructure administrators into a single unified operating system.

---

## 🎨 Visual Identity ("The Dorm Control Room")
- **Obsidian Black**: `#0C0E0D`
- **Deep Graphite**: `#171B19`
- **Forest Green**: `#183D31`
- **Electric Lime**: `#C8FF62`
- **Soft Sage**: `#A4B99E`
- **Warm Ivory**: `#F4F2E9`
- **Muted Grey**: `#929B94`
- **Warning Amber**: `#F2B84B`
- **Alert Coral**: `#FF756E`
- **Cool Blue**: `#8BAEFF`
- Typography: **Space Grotesk** (display), **JetBrains Mono** (telemetry & data), **Plus Jakarta Sans** (UI interface)
- Design Language: Architectural digital blueprints, glowing telemetry nodes, asymmetric data layouts, and micro-interactions.

---

## 🚀 Application Routes

| Route | View | Description |
|---|---|---|
| `/` | **Landing Page** | Cinematic showcase with interactive hero, problem analysis, live control room preview, and feature showcases |
| `/auth` | **Authentication** | Sign in / Registration with 1-click quick-switching between Resident, Staff, Warden, and Admin roles |
| `/onboarding` | **Space Allocation** | Select hostel block (A, B, C), floor level, room ID, and notification protocols |
| `/app` | **Control Room (Dashboard)** | Signature **Hostel Health Index (HHI)** widget with formula modal, room status, infrastructure grid, quick actions |
| `/app/hostel` | **Hostel Overview** | Nexus Residences master profile, capacity rates, block architectures, and 24/7 emergency dispatch directory |
| `/app/floorplan` | **Spatial Floor Plan** | Interactive SVG digital blueprint across Blocks A/B/C and floors 0-3 with status highlights and room details drawer |
| `/app/maintenance` | **Maintenance Hub** | Full ticket index with filters (My vs All, status, priority, category) and 2-step issue reporting modal |
| `/app/maintenance/:id` | **Ticket Details** | Lifecycle tracker (Submitted → Acknowledged → Assigned → In Progress → Waiting for Parts → Resolved), technician notes, materials logging, resident 5-star rating |
| `/app/facilities` | **Amenities & Bookings** | Real-time directory for Laundry, Study pods, Gym, Lounges, and Dining + **conflict-free time slot reservation** |
| `/app/utilities` | **Utility Telemetry** | Recharts visualizations for Power draw, Water distribution, Wi-Fi latency, and **Rule-Based Anomaly Detection** (+18.4% night surge) |
| `/app/announcements` | **Announcements Bulletin** | Verified notices with Critical alert banners and unread tracking |
| `/app/community` | **Resident Quad** | Community peer support, questions, lost-and-found, and discussion threads |
| `/app/profile` | **Resident Profile** | Space credentials, notification preferences, and demo reset button |
| `/staff` | **Staff Console** | Technician workbench to accept tickets, update progress, log hardware parts, and certify repairs |
| `/warden` | **Warden Deck** | Bird's-eye governance, triage board to allocate technicians, complaints distribution charts, and Smart Insights Engine |
| `/admin` | **Hostel Operations Intelligence** | Campus operations KPIs, room inventory, staff management, and CSV audit report export |

---

## 🧠 Smart Features

1. **Hostel Health Index (HHI)**:
   - Evaluated dynamically via `calculateHostelHealthIndex()` in `src/lib/formula.ts`.
   - Formula: `Overall = (0.40 × Maintenance) + (0.35 × Utility) + (0.25 × Facility)`.
2. **Duplicate Issue Detection**:
   - Analyzes unresolved reports in the same room, floor, or category to surface matching tickets and prevent duplicate clutter.
3. **Collision-Free Facility Bookings**:
   - `bookFacility()` validates existing reservations for selected equipment/slot and prevents double-booking.
4. **Smart Insights Engine**:
   - Rule-based operational intelligence in `src/lib/smartInsights.ts` flagging category clusters, assignment bottlenecks, and preventive maintenance.
5. **Database & Persistence**:
   - Full PostgreSQL schema with Row Level Security (RLS) located in `supabase/schema.sql`.
   - LocalStorage Zustand persistence for 100% functionality without external credentials.

---

## 🛠️ Tech Stack
- **Framework**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **State Management**: Zustand with `persist`
- **Charts**: Recharts
- **Icons**: Lucide React
- **Validation**: React Hook Form + Zod
- **Backend Ready**: Supabase Client Abstraction + PostgreSQL RLS schema

---

## 💻 Development & Build Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production TypeScript and Vite build
npm run build

# Run local production preview server
npm run preview
```

