"use client";

import { useState } from "react";
import { useVisitor } from "@/lib/visitor-store";

/**
 * Blocking modal shown once per device, the first time someone opens the
 * site, until they type a name. After that `state.displayName` is set and
 * this never shows again on that device (it's saved in localStorage).
 */
export default function NamePrompt() {
  const { state, hydrated, setDisplayName } = useVisitor();
  const [name, setName] = useState("");

  // Don't render anything until we know, post-hydration, whether a name is
  // already saved — avoids a flash of the modal for returning visitors.
  if (!hydrated || state.displayName) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setDisplayName(trimmed);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 backdrop-blur-sm dark:bg-black/70">
      <div className="w-full max-w-sm rounded-xl2 bg-white p-6 shadow-card dark:bg-night">
        <h2 className="font-display text-xl font-bold">Welcome to KHOJ 👋</h2>
        <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">
          What's your name? This is how you'll show up on the explorer leaderboard as you visit
          and rate projects.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            placeholder="Your name"
            className="w-full rounded-lg border border-line px-4 py-3 text-sm dark:border-white/15 dark:bg-white/5"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper disabled:opacity-40 dark:bg-paper dark:text-ink"
          >
            Start exploring
          </button>
        </form>
      </div>
    </div>
  );
}
