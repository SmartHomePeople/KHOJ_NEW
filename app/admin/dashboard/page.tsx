"use client";

import { useState } from "react";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { PROJECTS, TEAMS, CATEGORIES, LOCATIONS } from "@/lib/demo-data";
import { DEMO_AGGREGATES, getAggregate } from "@/lib/demo-aggregates";
import { rankProjects } from "@/lib/ranking";
import StatsCard from "@/components/StatsCard";
import ProjectQrCode from "@/components/ProjectQrCode";

export default function AdminDashboard() {
  const router = useRouter();
  const ready = useAdminGuard();
  const [qrProjectId, setQrProjectId] = useState<string | null>(null);

  if (!ready) return null;

  const totalRatings = Object.values(DEMO_AGGREGATES).reduce((s, a) => s + a.count, 0);
  const avgRating = Object.values(DEMO_AGGREGATES).reduce((s, a) => s + a.average, 0) / PROJECTS.length;
  const ranked = rankProjects(PROJECTS.map((p) => ({ id: p.id, ...getAggregate(p.id) })));
  const choiceLeader = PROJECTS.find((p) => p.id === ranked[0]?.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold md:text-3xl">KHOJ Admin</h1>
        <button
          onClick={async () => {
	    await supabase.auth.signOut();
            router.push("/admin");
          }}
          className="text-sm text-ink/50 underline dark:text-paper/50"
        >
          Sign out
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatsCard label="Total Projects" value={PROJECTS.length} />
        <StatsCard label="Total Teams" value={TEAMS.length} />
        <StatsCard label="Total Ratings" value={totalRatings} />
        <StatsCard label="Average Rating" value={avgRating.toFixed(2)} />
        <StatsCard label="People's Choice Leader" value={choiceLeader?.name ?? "—"} />
        <StatsCard label="Explorer Leader" value="Team Curious" hint="47 badges" />
        <StatsCard label="Categories" value={CATEGORIES.length} />
        <StatsCard label="Locations" value={LOCATIONS.length} />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Projects</h2>
        <p className="text-xs text-ink/50 dark:text-paper/50">
          Editing writes here go nowhere in the demo — wire this table to Supabase to persist changes.
        </p>
      </div>

      <div className="mt-3 overflow-x-auto rounded-xl2 border border-line shadow-card dark:border-white/10">
        <table className="min-w-full divide-y divide-line text-sm dark:divide-white/10">
          <thead className="bg-mist/60 text-left text-xs uppercase tracking-wide text-ink/50 dark:bg-white/5 dark:text-paper/50">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Team</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Rating</th>
              <th className="px-4 py-2">QR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white dark:divide-white/10 dark:bg-white/5">
            {PROJECTS.map((p) => {
              const location = LOCATIONS.find((l) => l.id === p.locationId);
              const category = CATEGORIES.find((c) => c.id === p.categoryId);
              const agg = getAggregate(p.id);
              return (
                <tr key={p.id}>
                  <td className="px-4 py-2 font-mono text-xs">{p.projectNumber}</td>
                  <td className="px-4 py-2 font-medium">{p.name}</td>
                  <td className="px-4 py-2">{p.team.name}</td>
                  <td className="px-4 py-2">{category?.name}</td>
                  <td className="px-4 py-2">{location?.room}</td>
                  <td className="px-4 py-2 font-mono">{agg.average.toFixed(2)} ({agg.count})</td>
                  <td className="px-4 py-2">
                    <button onClick={() => setQrProjectId(p.id)} className="text-teal-deep underline dark:text-teal-soft">
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {qrProjectId && (
        <QrModal projectId={qrProjectId} onClose={() => setQrProjectId(null)} />
      )}
    </div>
  );
}

function QrModal({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  const project = PROJECTS.find((p) => p.id === projectId)!;
  const url = typeof window !== "undefined" ? `${window.location.origin}/project/${project.slug}?scan=1` : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-6" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl2 bg-white p-6 text-center dark:bg-night"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-mono text-xs uppercase tracking-widest text-ink/50 dark:text-paper/50">KHOJ</p>
        <h3 className="font-display text-lg font-semibold">{project.name}</h3>
        <p className="text-sm text-ink/60 dark:text-paper/60">{project.team.name} · Project #{project.projectNumber}</p>
        <div className="mt-4 flex justify-center">
          <ProjectQrCode url={url} size={220} />
        </div>
        <p className="mt-3 break-all font-mono text-[10px] text-ink/40 dark:text-paper/40">{url}</p>
        <button onClick={onClose} className="mt-4 rounded-full border border-line px-4 py-2 text-sm dark:border-white/15">
          Close
        </button>
      </div>
    </div>
  );
}
