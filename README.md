# KHOJ 2026

The digital layer over KHOJ, our triennial school science fair. Visitors explore an
interactive campus map, scan project QR codes, collect team badges into a KHOJ
Passport, and vote in the People's Choice Award — while the Explorer Award tracks
who discovers the most of the fair.

This is a real, running Next.js application, not a mockup. It works end-to-end
right now against local demo data, and is structured so a real Supabase backend
can be dropped in without redesigning anything (see **Connecting Supabase** below).

---

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. No environment variables or Supabase project are
required to run the full visitor experience locally — badges, ratings, and your
Passport are stored in your browser's `localStorage` (key `khoj:visitor:v1`).

To try the admin dashboard, go to `/admin` and sign in with the password
`khoj-admin` (or whatever you set in `NEXT_PUBLIC_ADMIN_DEMO_PASSWORD`).

---

## What's implemented vs. what's stubbed

Built in the order the original brief prioritized:

**Tier 1 — Essential (fully working)**
- Navigation (desktop top bar + mobile bottom bar)
- Home, with live previews of the map, Passport, and People's Choice
- Interactive SVG campus map with floor switching, category/amenity filters,
  and a "you are here" marker
- Project directory with search, category/location filters, and sorting
- Full project detail pages, driven entirely by `lib/demo-data.ts`
- QR-code identity per project (`/project/<slug>?scan=1`), rendered as a real,
  scannable QR with the `qrcode` package
- Anonymous visitor identity (`KHOJ-####`), created and persisted client-side
- Badge collection with a "Project Discovered" transition, animated badge
  reveal, and duplicate-scan protection ("You've already discovered this project")
- KHOJ Passport: progress compass, stats, milestone path, badge grid
- Ratings, one per project, with duplicate protection

**Tier 2 — Awards (fully working against local/demo data)**
- People's Choice ranking using a configurable weighted (Bayesian) score —
  see `lib/ranking.ts` — so a project with 2 five-star votes can't outrank one
  with 500 ratings averaging 4.8
- Explorer Award leaderboard (mixes your real local progress with seeded demo
  explorers so the screen isn't empty on a fresh install)
- Achievements (First Discovery, Science Explorer, Deep Explorer, Khoj Master,
  Curious Mind, People's Scientist)

**Tier 3 — Admin (basic, demo-only auth)**
- `/admin` login gate and `/admin/dashboard` with event-wide stats, a project
  table, and a QR-code viewer/download per project
- Project/team/location **editing** is not wired to a database yet — the demo
  dashboard is read-mostly. The schema and RLS policies for full CRUD are
  already defined in `supabase/schema.sql`; wiring the admin forms to
  `supabase-js` `insert`/`update` calls is the remaining work once you have a
  Supabase project.

**Tier 4 — Advanced (deliberately out of scope for v1, architected for later)**
- Real indoor positioning (BLE/Wi-Fi) — the app currently uses **QR-based
  location checkpoints** (see `/explore`, "Simulate a location QR scan"),
  which is what a phone browser can actually do reliably. `Location.node`
  coordinates and `location_scans` are already shaped so BLE/Wi-Fi trilateration
  can populate the same `currentLocationId` state without any UI rewrite.
- Turn-by-turn routing ("Take me there") — `lib/demo-data.ts` locations are
  graph-ready (each has floor + x/y), but pathfinding across corridors isn't
  implemented; "Near You" currently uses straight-line distance as a stand-in.
- Drag-and-drop admin map editor
- Live analytics dashboard with charts

None of this requires re-architecting to add later — see the file-by-file
notes below.

---

## Architecture

```
app/
  page.tsx                 Home
  explore/page.tsx         Interactive map
  projects/page.tsx        Project directory
  project/[slug]/page.tsx  Project detail + QR scan flow + rating + badge
  passport/page.tsx        KHOJ Passport
  awards/page.tsx          People's Choice + Explorer Award
  info/page.tsx            Event information
  admin/page.tsx           Admin login (demo gate)
  admin/dashboard/page.tsx Admin dashboard
components/                Reusable UI: ProjectCard, BadgeCard, MapSvg, …
lib/
  types.ts                 Canonical data shapes — mirrors supabase/schema.sql
  demo-data.ts              ~24 seeded fictional projects/teams/locations
  demo-aggregates.ts        Simulated crowd ratings (stand-in for a Supabase view)
  visitor-store.tsx         Client-side visitor identity + Passport state
  ranking.ts                Configurable weighted People's Choice formula
supabase/schema.sql         Full production schema + RLS policies
```

Every page that needs interactivity is a client component (`"use client"`).
There is no server-rendered data fetching yet, by design — the moment you
connect Supabase, `lib/demo-data.ts` reads become `supabase.from(...).select()`
calls and the components above don't need to change shape, because they were
built against `lib/types.ts`, not against the demo data directly.

### Design system

- **Type:** Space Grotesk (display), Inter (body), JetBrains Mono (data/labels — project numbers, coordinates, stats)
- **Color:** deep indigo/navy (`ink` / `night`) as the anchor, with three accent
  families — gold (discovery), teal (science), coral (location/alerts) — rather
  than a single accent color, so categories and states stay visually distinct
- **Signature element:** the compass-dial progress ring (`components/CompassProgress.tsx`),
  used for Passport completion — a deliberate alternative to a generic circular
  progress bar, tying back to KHOJ's "exploration" identity
- Dark mode is supported via Tailwind's `class` strategy; wire a theme toggle
  to `document.documentElement.classList.toggle('dark')` when you're ready —
  one isn't mounted by default so the map's default readability is predictable

---

## Connecting Supabase

1. Create a Supabase project, then run `supabase/schema.sql` in the SQL editor.
2. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`
   and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Add a Supabase client (`lib/supabase.ts`):
   ```ts
   import { createClient } from "@supabase/supabase-js";
   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   );
   ```
4. On app load, call `supabase.auth.signInAnonymously()` once per visitor and
   upsert a row into `visitors` keyed by `auth.uid()` — this replaces the
   `randomExplorerId()` logic in `lib/visitor-store.tsx`. Everything downstream
   (badge collection, ratings, achievements) already has the right shape to
   become `supabase.from(...).insert(...)` calls guarded by the RLS policies
   already defined in `supabase/schema.sql`.
5. Replace `lib/demo-data.ts` reads with Supabase queries (or keep it as a
   `select *` fallback for offline/local development — your choice).
6. Wire the admin dashboard's table actions to `supabase.from('projects').insert/update/delete`,
   restricted to rows in `admin_users` (already enforced by RLS).

## Replacing the floor plan

`components/MapSvg.tsx` draws a placeholder floor plan on a `viewBox="0 0 100 100"`
grid. Every project/POI marker is positioned using `Location.node.x` / `.y`,
which are just percentages on that same grid — so you can either:
- **Replace the background shapes** in `MapSvg.tsx` with the real school SVG,
  keeping the `0–100` coordinate convention, or
- **Rescale marker coordinates** to match the real SVG's native `viewBox` and
  update the constant conversion in one place.

No other file needs to change — markers, filters, and the "you are here"
indicator are all driven by `Location` records, not by the background art.

## QR codes

Every project's QR encodes `${origin}/project/<slug>?scan=1`. The `?scan=1`
flag triggers the "Project Discovered" full-screen reveal before landing on
the normal project page; scanning the same code again just opens the project
page directly (no duplicate "discovery" animation), and the badge/rating
duplicate checks happen regardless of how the visitor arrives at the page.
The admin dashboard's QR viewer (`/admin/dashboard` → "View" on any row) can
be extended into a full printable sheet by rendering all `PROJECTS` through
`ProjectQrCode` on a print-styled page.

---

## Accessibility & performance notes

- All interactive elements are real `<button>`/`<a>` elements with visible
  focus states (see `app/globals.css`)
- Animations respect `prefers-reduced-motion`
- The map SVG has `role="img"` + a descriptive label, and markers are
  keyboard-operable (`tabIndex`, `Enter`/`Space` handling)
- Images/logos are referenced by URL (`Team.logoUrl`) rather than bundled, so
  the project directory doesn't have to download every team logo up front —
  point these at optimized, served assets (Supabase Storage works well) once
  real logos exist
