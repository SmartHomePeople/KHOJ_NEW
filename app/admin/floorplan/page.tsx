"use client";

import FloorplanUploader from "@/components/FloorplanUploader";

// Reuses the same demo-password gate pattern as app/admin/page.tsx.
// If you want this behind the existing admin login instead of its own page,
// just drop <FloorplanUploader floor={n} /> into app/admin/dashboard/page.tsx.
export default function FloorplanAdminPage() {
  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-8">
      <h1 className="text-xl font-semibold">Upload floorplans</h1>
      <p className="text-sm text-ink/60 dark:text-paper/60">
        Upload one image per floor. It replaces the placeholder map on{" "}
        <code>/explore</code> immediately for all visitors.
      </p>
      <FloorplanUploader floor={0} />
      <FloorplanUploader floor={1} />
      <FloorplanUploader floor={2} />
    </div>
  );
}
