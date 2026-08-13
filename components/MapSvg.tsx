"use client";

import clsx from "clsx";
import type { Project, PointOfInterest, Location } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────
// This is a high-quality PLACEHOLDER floor plan. It is intentionally built
// from simple rects/paths on a 0–100 coordinate grid so that:
//   1) it can be swapped for the school's real SVG floor plan later, and
//   2) `Location.node.x` / `Location.node.y` (also 0–100) line up with any
//      replacement plan without changing marker logic.
// To replace it: drop in the real <svg> shapes below (keep the same
// viewBox="0 0 100 100" convention, or rescale marker coordinates).
// ─────────────────────────────────────────────────────────────────────────

const POI_GLYPH: Record<string, string> = {
  food: "🍽️",
  restroom: "🚻",
  help: "❓",
  "first-aid": "✚",
  entrance: "➜",
  stairs: "▲",
  lift: "⬍",
};

const CATEGORY_DOT: Record<string, string> = {
  gold: "fill-gold",
  teal: "fill-teal",
  indigo: "fill-indigo",
  coral: "fill-coral",
};

export default function MapSvg({
  floor,
  projects,
  pois,
  locationsById,
  categoryColorByProjectId,
  currentLocationId,
  selectedProjectId,
  onSelectProject,
}: {
  floor: number;
  projects: Project[];
  pois: PointOfInterest[];
  locationsById: Record<string, Location>;
  categoryColorByProjectId: Record<string, string>;
  currentLocationId: string | null;
  selectedProjectId?: string | null;
  onSelectProject: (project: Project) => void;
}) {
  const floorProjects = projects.filter((p) => locationsById[p.locationId]?.floor === floor);
  const floorPois = pois.filter((p) => locationsById[p.locationId]?.floor === floor);
  const currentLoc = currentLocationId ? locationsById[currentLocationId] : null;
  const currentNode = currentLoc?.floor === floor ? currentLoc.node : null;

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full select-none" role="img" aria-label={`KHOJ floor plan, floor ${floor + 1}`}>
      {/* Background */}
      <rect x="0" y="0" width="100" height="100" className="fill-mist dark:fill-white/5" rx="2" />

      {/* Blocks (illustrative) */}
      <g className="fill-white stroke-line dark:fill-white/10 dark:stroke-white/15" strokeWidth="0.4">
        <rect x="10" y="14" width="42" height="30" rx="2" />
        <rect x="58" y="10" width="34" height="20" rx="2" />
        <rect x="58" y="32" width="34" height="20" rx="2" />
        <rect x="14" y="48" width="34" height="14" rx="2" />
        <rect x="42" y="60" width="42" height="30" rx="2" />
        <rect x="6" y="68" width="20" height="18" rx="2" />
        <rect x="10" y="48" width="80" height="0" />
      </g>

      {/* Corridors */}
      <g className="stroke-line dark:stroke-white/15" strokeWidth="0.6" strokeDasharray="1.4 1.4">
        <line x1="30" y1="44" x2="30" y2="60" />
        <line x1="10" y1="55" x2="42" y2="55" />
        <line x1="52" y1="30" x2="58" y2="30" />
        <line x1="75" y1="30" x2="75" y2="32" />
        <line x1="63" y1="75" x2="26" y2="75" />
      </g>

      {/* Block labels */}
      <g className="fill-ink/35 dark:fill-paper/35" style={{ fontSize: "3px", fontFamily: "var(--font-body)" }}>
        <text x="14" y="19">BLOCK A</text>
        <text x="61" y="15">BLOCK B</text>
        <text x="46" y="65">BLOCK C</text>
        <text x="8" y="72">GYMNASIUM</text>
      </g>

      {/* Points of interest */}
      {floorPois.map((poi) => {
        const node = locationsById[poi.locationId]?.node;
        if (!node) return null;
        return (
          <g key={poi.id} transform={`translate(${node.x} ${node.y})`}>
            <circle r="2.6" className="fill-white stroke-ink/20 dark:fill-ink dark:stroke-paper/20" strokeWidth="0.3" />
            <text textAnchor="middle" dominantBaseline="central" style={{ fontSize: "3px" }}>
              {POI_GLYPH[poi.kind] ?? "•"}
            </text>
          </g>
        );
      })}

      {/* Project markers */}
      {floorProjects.map((project) => {
        const node = locationsById[project.locationId]?.node;
        if (!node) return null;
        const isSelected = selectedProjectId === project.id;
        const colorKey = categoryColorByProjectId[project.id] ?? "indigo";
        return (
          <g
            key={project.id}
            transform={`translate(${node.x} ${node.y})`}
            className="cursor-pointer"
            onClick={() => onSelectProject(project)}
            tabIndex={0}
            role="button"
            aria-label={`${project.name}, project ${project.projectNumber}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelectProject(project);
            }}
          >
            {isSelected && (
              <circle r="4.5" className={clsx("opacity-40", CATEGORY_DOT[colorKey])} style={{ animation: "pulse-ring 1.8s ease-out infinite" }} />
            )}
            <circle
              r={isSelected ? "3.2" : "2.6"}
              className={clsx(CATEGORY_DOT[colorKey], "stroke-white dark:stroke-night")}
              strokeWidth="0.5"
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-white font-mono font-semibold"
              style={{ fontSize: "2.2px" }}
            >
              {project.projectNumber}
            </text>
          </g>
        );
      })}

      {/* You are here */}
      {currentNode && (
        <g transform={`translate(${currentNode.x} ${currentNode.y})`}>
          <circle r="3.4" className="fill-coral/30" style={{ animation: "pulse-ring 1.6s ease-out infinite" }} />
          <circle r="1.8" className="fill-coral stroke-white dark:stroke-night" strokeWidth="0.5" />
        </g>
      )}
    </svg>
  );
}
