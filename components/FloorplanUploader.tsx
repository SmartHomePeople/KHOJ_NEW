"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * Admin-only. Uploads a floorplan image (PNG/JPG/SVG export of the real
 * school map) to the `floorplans` Supabase Storage bucket and upserts a row
 * in `floorplans` pointing at it for a given floor number.
 *
 * Drop this into app/admin/dashboard, or the standalone app/admin/floorplan
 * page included in this patch.
 */
export default function FloorplanUploader({ floor }: { floor: number }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleUpload() {
    if (!file) return;
    if (!isSupabaseConfigured) {
      setStatus("error");
      setMessage("Supabase isn't configured yet — set NEXT_PUBLIC_SUPABASE_URL / ANON_KEY first.");
      return;
    }
    setStatus("uploading");
    setMessage(null);

    const ext = file.name.split(".").pop();
    const path = `floor-${floor}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("floorplans")
      .upload(path, file, { upsert: true, cacheControl: "3600" });

    if (uploadError) {
      setStatus("error");
      setMessage(uploadError.message);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("floorplans").getPublicUrl(path);

    const { error: dbError } = await supabase
      .from("floorplans")
      .upsert({ floor, image_url: publicUrlData.publicUrl, updated_at: new Date().toISOString() });

    if (dbError) {
      setStatus("error");
      setMessage(dbError.message);
      return;
    }

    setStatus("done");
    setMessage("Floorplan uploaded. It'll show up on /explore next load.");
  }

  return (
    <div className="rounded-xl border border-line bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink/50 dark:text-paper/50">
        Floor {floor + 1} floorplan
      </p>
      <input
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mb-3 block w-full text-sm"
      />
      <button
        onClick={handleUpload}
        disabled={!file || status === "uploading"}
        className="rounded-lg bg-indigo px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
      >
        {status === "uploading" ? "Uploading..." : "Upload floorplan"}
      </button>
      {message && (
        <p className={`mt-2 text-sm ${status === "error" ? "text-coral" : "text-teal"}`}>{message}</p>
      )}
      <p className="mt-3 text-xs text-ink/50 dark:text-paper/50">
        Tip: export the floorplan so its outer bounds line up with a 0–100 x 0–100 grid (the same
        convention `Location.node.x/y` already use) — that way existing project markers don't need
        recalibrating. A quick way: open your plan in any image editor, note its pixel width/height,
        and place markers as (pixelX / width * 100, pixelY / height * 100).
      </p>
    </div>
  );
}
