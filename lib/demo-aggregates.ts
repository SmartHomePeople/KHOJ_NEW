import { PROJECTS } from "./demo-data";

// In production this data comes from a Supabase view aggregating the
// `ratings` and `location_scans` / `visitor_badges` tables (see
// /supabase/schema.sql). For the local/offline demo we seed believable
// crowd numbers so the Awards and Directory pages aren't empty on first run.

type Aggregate = { average: number; count: number; explorers: number };

function seededRandom(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const DEMO_AGGREGATES: Record<string, Aggregate> = Object.fromEntries(
  PROJECTS.map((p, i) => {
    const r1 = seededRandom(i + 1);
    const r2 = seededRandom(i + 91);
    const r3 = seededRandom(i + 191);
    const count = Math.floor(6 + r1 * 140);
    const average = Math.round((3.6 + r2 * 1.35) * 100) / 100;
    const explorers = Math.floor(count * (0.7 + r3 * 0.3));
    return [p.id, { average: Math.min(average, 5), count, explorers }];
  })
);

export function getAggregate(projectId: string): Aggregate {
  return DEMO_AGGREGATES[projectId] ?? { average: 0, count: 0, explorers: 0 };
}
