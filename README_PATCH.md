# KHOJ patch: real floorplan upload + live compass "you are here" + Supabase

`@supabase/supabase-js` is already in your package.json, so no install step
needed there.

## Files in this patch

```
lib/supabase.ts              Supabase browser client
lib/useFloorplan.ts          fetches the uploaded floorplan URL for a floor
lib/useCompassHeading.ts     live device compass heading (0-360, handles iOS permission)
components/FloorplanUploader.tsx   admin upload UI -> Supabase Storage
components/MapSvg.tsx        UPDATED: renders uploaded floorplan + heading arrow
app/admin/floorplan/page.tsx new admin page to upload floorplans per floor
supabase/floorplan_migration.sql   new table + storage bucket + RLS policies
EXPLORE_PAGE_CHANGES.md      the 3 small edits needed in app/explore/page.tsx
```

## Setup, in order

1. **Copy these files into your repo**, preserving paths. `components/MapSvg.tsx`
   replaces your existing one (it's backward compatible — `floorplanUrl` and
   `heading` are optional, so nothing breaks if you don't pass them yet).

2. **Create the Supabase project** (if you haven't) and run, in order, in the
   SQL editor:
   - `supabase/schema.sql` (your existing one)
   - `supabase/floorplan_migration.sql` (new, from this patch)

3. **Env vars**: copy `.env.example` → `.env.local`, fill in
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
   Supabase → Settings → API. Add the same two vars in Vercel's project
   settings (Settings → Environment Variables) so the deployed site picks
   them up too.

4. **Admin auth**: `floorplan_migration.sql` restricts uploads to rows in
   your `admin_users` table, keyed by `auth.uid()`. That means you need a
   real Supabase Auth user, not the demo `khoj-admin` password gate, before
   `/admin/floorplan` will let an upload through. Simplest path: create a
   user in Supabase Auth → Users, then insert their id into `admin_users`.

5. **Wire the explore page** — follow `EXPLORE_PAGE_CHANGES.md` (3 small edits).

6. **Upload the floorplan**: visit `/admin/floorplan`, pick the image for
   each floor. It shows up on `/explore` immediately, replacing the
   placeholder art.

7. **Coordinate calibration**: your existing markers use a 0–100 grid
   (`Location.node.x/y`). If your uploaded image's important area (the parts
   with rooms) doesn't fill the whole image edge-to-edge, either crop the
   image so it does, or add simple offset/scale constants where markers are
   rendered — same approach the original README already describes for
   "Replacing the floor plan."

## On the "walking around" behavior

Position (the dot's location) still updates at checkpoints — QR scans,
same as your existing `/explore` "simulate a location QR scan" flow — not
continuously via GPS. Continuous indoor GPS-accurate tracking isn't
something a phone browser can do reliably without BLE beacon hardware in
the building (your README already notes this as Tier 4 / future work).
What's new here is the compass heading cone on the dot, which rotates live
as the visitor turns — that's what gives it the "you are here, looking
that way" feel between checkpoint scans.

If later you do install BLE beacons, nothing above needs to change: you'd
just call `setCurrentLocation(nearestBeaconLocationId)` automatically
instead of via the manual dropdown, exactly as the original README
describes for that Tier 4 path.
