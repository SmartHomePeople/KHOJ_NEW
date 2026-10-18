"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { VisitorState, BadgeRecord, RatingRecord } from "./types";
import { ACHIEVEMENTS, PROJECTS, computeStats } from "./demo-data";
import { supabase, isSupabaseConfigured } from "./supabase";

const STORAGE_KEY = "khoj:visitor:v1";

function randomExplorerId() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `KHOJ-${n}`;
}

function emptyState(): VisitorState {
  return {
    // Stable placeholder for the very first render (server + client must
    // match exactly, or React throws a hydration error). The real random id
    // gets assigned client-side only, in the mount effect below.
    explorerId: "",
    displayName: null,
    badges: [],
    ratings: [],
    unlockedAchievements: [],
    currentLocationId: null,
    lastScannedAt: null,
  };
}

function loadState(): VisitorState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as VisitorState;
    if (!parsed.explorerId) return emptyState();
    return parsed;
  } catch {
    return emptyState();
  }
}

type ScanResult =
  | { status: "new"; badge: BadgeRecord }
  | { status: "already-collected" }
  | { status: "invalid" };

type VisitorContextValue = {
  state: VisitorState;
  hydrated: boolean;
  isBadgeCollected: (projectId: string) => boolean;
  hasRated: (projectId: string) => boolean;
  collectBadge: (projectId: string) => ScanResult;
  submitRating: (projectId: string, rating: number) => { status: "saved" | "already-rated" };
  setCurrentLocation: (locationId: string) => void;
  setDisplayName: (name: string) => void;
  newlyUnlockedAchievements: string[];
  clearNewlyUnlocked: () => void;
};

// Best-effort sync to Supabase so an admin can see cross-device activity.
// Never blocks or throws into the caller — if Supabase isn't configured or
// the request fails (e.g. offline), the local badge/rating still saved fine;
// we just log a warning.
async function syncVisitor(explorerId: string, displayName: string) {
  if (!isSupabaseConfigured || !explorerId) return;
  try {
    await supabase
      .from("visitors")
      .upsert({ explorer_id: explorerId, display_name: displayName, last_seen_at: new Date().toISOString() });
  } catch (err) {
    console.warn("[khoj] visitor sync failed", err);
  }
}

async function syncBadge(explorerId: string, projectId: string, collectedAt: string) {
  if (!isSupabaseConfigured || !explorerId) return;
  try {
    await supabase
      .from("badge_logs")
      .upsert({ explorer_id: explorerId, project_id: projectId, collected_at: collectedAt });
  } catch (err) {
    console.warn("[khoj] badge sync failed", err);
  }
}

async function syncRating(explorerId: string, projectId: string, rating: number, ratedAt: string) {
  if (!isSupabaseConfigured || !explorerId) return;
  try {
    await supabase
      .from("rating_logs")
      .upsert({ explorer_id: explorerId, project_id: projectId, rating, rated_at: ratedAt });
  } catch (err) {
    console.warn("[khoj] rating sync failed", err);
  }
}

const VisitorContext = createContext<VisitorContextValue | null>(null);

export function VisitorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VisitorState>(emptyState);
  const [hydrated, setHydrated] = useState(false);
  const [newlyUnlockedAchievements, setNewlyUnlocked] = useState<string[]>([]);

  useEffect(() => {
    const loaded = loadState();
    // First-ever visit: loadState() returned the placeholder empty id.
    // Assign the real random id now, client-side only, so it never has to
    // match anything the server rendered.
    setState(loaded.explorerId ? loaded : { ...loaded, explorerId: randomExplorerId() });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const isBadgeCollected = (projectId: string) => state.badges.some((b) => b.projectId === projectId);
  const hasRated = (projectId: string) => state.ratings.some((r) => r.projectId === projectId);

  function checkAchievements(nextBadges: BadgeRecord[], nextRatings: RatingRecord[]) {
    const stats = computeStats(nextBadges, nextRatings, PROJECTS.length);
    const unlocked: string[] = [];
    for (const a of ACHIEVEMENTS) {
      if (a.check(stats) && !state.unlockedAchievements.includes(a.id)) {
        unlocked.push(a.id);
      }
    }
    return unlocked;
  }

  function collectBadge(projectId: string): ScanResult {
    const project = PROJECTS.find((p) => p.id === projectId);
    if (!project) return { status: "invalid" };
    if (isBadgeCollected(projectId)) return { status: "already-collected" };

    const badge: BadgeRecord = { projectId, collectedAt: new Date().toISOString() };
    const nextBadges = [...state.badges, badge];
    const unlocked = checkAchievements(nextBadges, state.ratings);

    setState((s) => ({
      ...s,
      badges: nextBadges,
      unlockedAchievements: [...s.unlockedAchievements, ...unlocked],
      lastScannedAt: badge.collectedAt,
    }));
    if (unlocked.length) setNewlyUnlocked((prev) => [...prev, ...unlocked]);
    syncBadge(state.explorerId, projectId, badge.collectedAt);
    return { status: "new", badge };
  }

  function submitRating(projectId: string, rating: number) {
    if (hasRated(projectId)) return { status: "already-rated" as const };
    const record: RatingRecord = { projectId, rating, ratedAt: new Date().toISOString() };
    const nextRatings = [...state.ratings, record];
    const unlocked = checkAchievements(state.badges, nextRatings);
    setState((s) => ({
      ...s,
      ratings: nextRatings,
      unlockedAchievements: [...s.unlockedAchievements, ...unlocked],
    }));
    if (unlocked.length) setNewlyUnlocked((prev) => [...prev, ...unlocked]);
    syncRating(state.explorerId, projectId, rating, record.ratedAt);
    return { status: "saved" as const };
  }

  function setCurrentLocation(locationId: string) {
    setState((s) => ({ ...s, currentLocationId: locationId }));
  }

  function setDisplayName(name: string) {
    const trimmed = name.slice(0, 24);
    setState((s) => ({ ...s, displayName: trimmed }));
    syncVisitor(state.explorerId, trimmed);
  }

  const value = useMemo(
    () => ({
      state,
      hydrated,
      isBadgeCollected,
      hasRated,
      collectBadge,
      submitRating,
      setCurrentLocation,
      setDisplayName,
      newlyUnlockedAchievements,
      clearNewlyUnlocked: () => setNewlyUnlocked([]),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, hydrated, newlyUnlockedAchievements]
  );

  return <VisitorContext.Provider value={value}>{children}</VisitorContext.Provider>;
}

export function useVisitor() {
  const ctx = useContext(VisitorContext);
  if (!ctx) throw new Error("useVisitor must be used within VisitorProvider");
  return ctx;
}
