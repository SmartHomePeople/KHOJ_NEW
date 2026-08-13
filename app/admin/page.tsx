"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// DEMO-ONLY authentication. In production, replace this entirely with
// Supabase Auth (email/password or magic link) + a `role = 'admin'` check
// enforced by Row Level Security — never trust a client-side password check
// for real admin access. See /supabase/schema.sql and the README.
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_DEMO_PASSWORD || "khoj-admin";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === DEMO_PASSWORD) {
      window.sessionStorage.setItem("khoj:admin-demo", "1");
      router.push("/admin/dashboard");
    } else {
      setError(true);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
      <h1 className="font-display text-2xl font-bold">KHOJ Admin</h1>
      <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">
        Demo login only. Password: <code className="font-mono">khoj-admin</code> (or your <code>NEXT_PUBLIC_ADMIN_DEMO_PASSWORD</code>).
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          placeholder="Admin password"
          className="w-full rounded-lg border border-line px-4 py-3 text-sm dark:border-white/15 dark:bg-white/5"
        />
        {error && <p className="text-sm text-coral">Incorrect password.</p>}
        <button type="submit" className="w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper dark:bg-paper dark:text-ink">
          Sign In
        </button>
      </form>
    </div>
  );
}
