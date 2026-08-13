"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { PROJECTS, computeStats } from "@/lib/demo-data";
import { getAggregate } from "@/lib/demo-aggregates";
import { rankProjects } from "@/lib/ranking";
import { useVisitor } from "@/lib/visitor-store";
import Leaderboard, { LeaderboardRow } from "@/components/Leaderboard";
import CompassProgress from "@/components/CompassProgress";

// Simulated explorer leaderboard — in production this comes from a Supabase
// view counting DISTINCT visitor_badges rows per visitor.
const DEMO_EXPLORERS = [
  { id: "KHOJ-4821", name: "Team Curious", badges: 47 },
  { id: "KHOJ-1092", name: null, badges: 43 },
  { id: "KHOJ-7734", name: "The Wanderers", badges: 39 },
  { id: "KHOJ-2200", name: null, badges: 34 },
  { id: "KHOJ-5561", name: "Lab Coats", badges: 31 },
];

export default function AwardsPage() {
  const { state } = useVisitor();
  const [tab, setTab] = useState<"choice" | "explorer">("choice");
  const stats = computeStats(state.badges, state.ratings, PROJECTS.length);

  const ranked = rankProjects(PROJECTS.map((p) => ({ id: p.id, ...getAggregate(p.id) })));
  const choiceRows: LeaderboardRow[] = ranked.slice(0, 15).map((r, i) => {
    const project = PROJECTS.find((p) => p.id === r.id)!;
    return {
      key: r.id,
      rank: i + 1,
      title: project.name,
      subtitle: `${project.team.name} · ${getAggregate(project.id).count} ratings`,
      value: `${getAggregate(project.id).average.toFixed(2)} ★`,
    };
  });

  const explorerEntries = [...DEMO_EXPLORERS, { id: state.explorerId, name: state.displayName, badges: state.badges.length }].sort(
    (a, b) => b.badges - a.badges
  );
  const explorerRows: LeaderboardRow[] = explorerEntries.slice(0, 10).map((e, i) => ({
    key: e.id,
    rank: i + 1,
    title: e.name ?? `Explorer ${e.id}`,
    subtitle: e.id,
    value: `${e.badges} badges`,
    highlight: e.id === state.explorerId,
  }));

  const hasRankings = ranked.some((r) => r.count > 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
      <h1 className="font-display text-2xl font-bold md:text-3xl">Awards</h1>
      <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">
        Your ratings power the People&apos;s Choice Award. Your exploring powers the Explorer Award.
      </p>

      <div className="mt-4 flex gap-1 rounded-full border border-line p-1 dark:border-white/10">
        <TabButton active={tab === "choice"} onClick={() => setTab("choice")}>
          🏆 People&apos;s Choice
        </TabButton>
        <TabButton active={tab === "explorer"} onClick={() => setTab("explorer")}>
          🧭 Explorer Award
        </TabButton>
      </div>

      {tab === "choice" ? (
        <div className="mt-5">
          <p className="mb-3 text-xs text-ink/50 dark:text-paper/50">
            Ranked by a weighted score that accounts for the number of ratings — not raw averages alone.{" "}
            <Link href="/projects" className="underline">
              Rate a project →
            </Link>
          </p>
          {hasRankings ? <Leaderboard rows={choiceRows} /> : (
            <EmptyState text="Rankings will appear once visitors start exploring KHOJ." />
          )}
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          <div className="flex flex-col items-center gap-4 rounded-xl2 border border-line bg-white p-6 shadow-card dark:border-white/10 dark:bg-white/5 md:flex-row">
            <CompassProgress value={stats.projectsExplored} total={PROJECTS.length} label="explored" />
            <div className="text-center md:text-left">
              <p className="font-display text-lg font-semibold">Your Progress</p>
              <p className="text-sm text-ink/60 dark:text-paper/60">{stats.projectsExplored} Projects Explored</p>
              <Link href="/explore" className="mt-3 inline-block rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink">
                Discover more
              </Link>
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs text-ink/50 dark:text-paper/50">
              Discover the most of KHOJ. Leaderboard uses Explorer IDs or optional nicknames only — never personal info.
            </p>
            <Leaderboard rows={explorerRows} />
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex-1 rounded-full px-4 py-2 text-sm font-semibold",
        active ? "bg-ink text-paper dark:bg-paper dark:text-ink" : "text-ink/60 dark:text-paper/60"
      )}
    >
      {children}
    </button>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl2 border border-dashed border-line p-10 text-center dark:border-white/15">
      <p className="text-sm text-ink/50 dark:text-paper/50">{text}</p>
    </div>
  );
}
