"use client";

import clsx from "clsx";
import { CATEGORIES } from "@/lib/demo-data";

export default function CategoryFilter({
  active,
  onChange,
}: {
  active: string | null;
  onChange: (id: string | null) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Chip label="All" isActive={active === null} onClick={() => onChange(null)} />
      {CATEGORIES.map((c) => (
        <Chip key={c.id} label={c.name} isActive={active === c.id} onClick={() => onChange(c.id)} />
      ))}
    </div>
  );
}

function Chip({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={clsx(
        "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        isActive
          ? "border-ink bg-ink text-paper dark:border-paper dark:bg-paper dark:text-ink"
          : "border-line text-ink/70 hover:bg-mist dark:border-white/15 dark:text-paper/70 dark:hover:bg-white/10"
      )}
    >
      {label}
    </button>
  );
}
