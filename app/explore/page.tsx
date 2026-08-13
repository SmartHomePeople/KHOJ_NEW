"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PROJECTS, LOCATIONS, POINTS_OF_INTEREST, CATEGORIES } from "@/lib/demo-data";
import { useVisitor } from "@/lib/visitor-store";
import MapSvg from "@/components/MapSvg";
import { RatingStarsReadonly } from "@/components/RatingStars";
import { getAggregate } from "@/lib/demo-aggregates";
import type { Project } from "@/lib/types";
import clsx from "clsx";

const LOCATIONS_BY_ID = Object.fromEntries(LOCATIONS.map((l) => [l.id, l]));
const CATEGORY_COLOR_BY_PROJECT = Object.fromEntries(
  PROJECTS.map((p) => [
    p.id,
    (({ physics: "indigo", chemistry: "teal", biology: "teal", cs: "indigo", ai: "gold", robotics: "coral", environment: "teal", engineering: "indigo", other: "gold" } as Record<string, string>)[
      p.categoryId
    ] ?? "indigo"),
  ])
);

const TOP_FILTERS = ["All", "Projects", "My Location", "Food", "Restrooms", "Help", "First Aid", "Entrances"] as const;
type TopFilter = (typeof TOP_FILTERS)[number];

const FLOORS = [
  { id: 0, label: "Ground Floor" },
  { id: 1, label: "First Floor" },
];

function walkMinutes(fromId: string | null, toId: string): number {
  if (!fromId) return 3;
  const a = LOCATIONS_BY_ID[fromId]?.node;
  const b = LOCATIONS_BY_ID[toId]?.node;
  if (!a || !b) return 3;
  const floorPenalty = a.floor !== b.floor ? 2.5 : 0;
  const dist = Math.hypot(a.x - b.x, a.y - b.y);
  return Math.max(1, Math.round(dist / 12 + floorPenalty));
}

export default function ExplorePage() {
  const { state, isBadgeCollected, setCurrentLocation } = useVisitor();
  const [floor, setFloor] = useState(0);
  const [topFilter, setTopFilter] = useState<TopFilter>("All");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    if (topFilter !== "All" && topFilter !== "Projects" && topFilter !== "My Location") return [];
    if (categoryFilter) return PROJECTS.filter((p) => p.categoryId === categoryFilter);
    return PROJECTS;
  }, [topFilter, categoryFilter]);

  const filteredPois = useMemo(() => {
    const map: Partial<Record<TopFilter, string>> = {
      Food: "food",
      Restrooms: "restroom",
      Help: "help",
      "First Aid": "first-aid",
      Entrances: "entrance",
    };
    if (topFilter === "All") return POINTS_OF_INTEREST;
    if (map[topFilter]) return POINTS_OF_INTEREST.filter((p) => p.kind === map[topFilter]);
    return [];
  }, [topFilter]);

  const nearby = useMemo(() => {
    return [...PROJECTS]
      .map((p) => ({ project: p, minutes: walkMinutes(state.currentLocationId, p.locationId) }))
      .sort((a, b) => a.minutes - b.minutes)
      .slice(0, 4);
  }, [state.currentLocationId]);

  const checkpoints = LOCATIONS;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">KHOJ Map</h1>
          <p className="text-sm text-ink/60 dark:text-paper/60">Find projects, checkpoints, and amenities across campus.</p>
        </div>
        <div className="flex gap-1 rounded-full border border-line p-1 dark:border-white/10">
          {FLOORS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFloor(f.id)}
              className={clsx(
                "rounded-full px-3 py-1.5 text-xs font-semibold",
                floor === f.id ? "bg-ink text-paper dark:bg-paper dark:text-ink" : "text-ink/60 dark:text-paper/60"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top filters */}
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TOP_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setTopFilter(f)}
            className={clsx(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium",
              topFilter === f
                ? "border-ink bg-ink text-paper dark:border-paper dark:bg-paper dark:text-ink"
                : "border-line text-ink/70 dark:border-white/15 dark:text-paper/70"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {(topFilter === "All" || topFilter === "Projects") && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setCategoryFilter(null)}
            className={clsx("shrink-0 rounded-full px-3 py-1 text-xs font-medium", !categoryFilter ? "bg-mist" : "text-ink/50 dark:text-paper/50")}
          >
            All categories
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={clsx(
                "shrink-0 rounded-full px-3 py-1 text-xs font-medium",
                categoryFilter === c.id ? "bg-mist font-semibold" : "text-ink/50 dark:text-paper/50"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Map */}
        <div className="relative overflow-hidden rounded-xl2 border border-line bg-white shadow-card dark:border-white/10 dark:bg-white/5">
          <div className="aspect-[4/3] w-full md:aspect-[16/10]">
            <MapSvg
              floor={floor}
              projects={filteredProjects}
              pois={filteredPois}
              locationsById={LOCATIONS_BY_ID}
              categoryColorByProjectId={CATEGORY_COLOR_BY_PROJECT}
              currentLocationId={state.currentLocationId}
              selectedProjectId={selected?.id}
              onSelectProject={setSelected}
            />
          </div>

          {/* Location checkpoint simulator — stands in for scanning a location QR code */}
          <div className="border-t border-line bg-mist/40 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <label className="text-xs font-medium text-ink/60 dark:text-paper/60" htmlFor="checkpoint">
              📍 Simulate a location QR scan (until real checkpoints are wired up)
            </label>
            <select
              id="checkpoint"
              className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-white/10"
              value={state.currentLocationId ?? ""}
              onChange={(e) => e.target.value && setCurrentLocation(e.target.value)}
            >
              <option value="" disabled>
                Select a checkpoint…
              </option>
              {checkpoints.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.building} — {c.room}
                </option>
              ))}
            </select>
            {state.currentLocationId && (
              <p className="mt-2 text-sm">
                📍 You are now at{" "}
                <strong>
                  {LOCATIONS_BY_ID[state.currentLocationId]?.building} — {LOCATIONS_BY_ID[state.currentLocationId]?.room}
                </strong>
              </p>
            )}
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {selected ? (
            <ProjectPreviewCard project={selected} collected={isBadgeCollected(selected.id)} onClose={() => setSelected(null)} />
          ) : (
            <div className="rounded-xl2 border border-line bg-white p-4 shadow-card dark:border-white/10 dark:bg-white/5">
              <h2 className="font-display font-semibold">Near You</h2>
              <p className="mb-3 text-xs text-ink/50 dark:text-paper/50">
                {state.currentLocationId ? "Based on your last checkpoint scan." : "Scan a checkpoint for better estimates."}
              </p>
              <ul className="space-y-2">
                {nearby.map(({ project, minutes }) => (
                  <li key={project.id}>
                    <Link
                      href={`/project/${project.slug}`}
                      className="flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-mist dark:hover:bg-white/10"
                    >
                      <span>
                        🧪 Project {project.projectNumber} — {project.name}
                      </span>
                      <span className="shrink-0 font-mono text-xs text-ink/50 dark:text-paper/50">~{minutes} min walk</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl2 border border-line bg-white p-4 text-xs text-ink/50 shadow-card dark:border-white/10 dark:bg-white/5 dark:text-paper/50">
            Legend: colored dots are projects (color = category), small circles are amenities, and the pulsing coral dot
            is your last scanned checkpoint.
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectPreviewCard({ project, collected, onClose }: { project: Project; collected: boolean; onClose: () => void }) {
  const agg = getAggregate(project.id);
  const location = LOCATIONS_BY_ID[project.locationId];
  return (
    <div className="rounded-xl2 border border-line bg-white p-4 shadow-card dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between">
        <span className="font-mono text-xs text-ink/40 dark:text-paper/40">Project #{project.projectNumber}</span>
        <button onClick={onClose} aria-label="Close preview" className="text-ink/40 hover:text-ink dark:text-paper/40 dark:hover:text-paper">
          ✕
        </button>
      </div>
      <h2 className="mt-1 font-display text-lg font-semibold">{project.name}</h2>
      <p className="text-sm text-ink/60 dark:text-paper/60">{project.tagline}</p>
      <p className="mt-2 text-sm">📍 {location?.building} — {location?.room}</p>
      <div className="mt-2 flex items-center gap-2">
        <RatingStarsReadonly value={agg.average} />
        <span className="font-mono text-xs text-ink/50 dark:text-paper/50">({agg.count} ratings)</span>
      </div>
      {collected && (
        <p className="mt-2 text-xs font-semibold text-teal-deep dark:text-teal-soft">✓ Badge collected</p>
      )}
      <Link
        href={`/project/${project.slug}`}
        className="mt-4 block rounded-full bg-ink px-4 py-2.5 text-center text-sm font-semibold text-paper dark:bg-paper dark:text-ink"
      >
        View Project
      </Link>
    </div>
  );
}
