"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const ITEMS = [
  { href: "/", label: "Home", glyph: "◆" },
  { href: "/explore", label: "Explore", glyph: "⬡" },
  { href: "/projects", label: "Projects", glyph: "◈" },
  { href: "/passport", label: "Passport", glyph: "▣" },
  { href: "/awards", label: "Awards", glyph: "◉" },
];

export default function NavigationBar() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      {/* Desktop top nav */}
      <header className="sticky top-0 z-40 hidden border-b border-line bg-paper/90 backdrop-blur md:block dark:border-white/10 dark:bg-night/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-gold dark:bg-paper dark:text-ink">
              ⬡
            </span>
            KHOJ <span className="text-gold">2026</span>
          </Link>
          <nav className="flex items-center gap-1">
            {ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-ink text-paper dark:bg-paper dark:text-ink"
                    : "text-ink/70 hover:bg-mist dark:text-paper/70 dark:hover:bg-white/10"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/info"
              className="ml-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink/70 hover:bg-mist dark:border-white/15 dark:text-paper/70 dark:hover:bg-white/10"
            >
              Info
            </Link>
          </nav>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur md:hidden dark:border-white/10 dark:bg-night/95"
        aria-label="Primary"
      >
        <div className="flex items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)]">
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium"
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              <span
                className={clsx(
                  "flex h-8 w-8 items-center justify-center rounded-full text-base transition-colors",
                  isActive(item.href) ? "bg-gold text-ink" : "text-ink/50 dark:text-paper/50"
                )}
              >
                {item.glyph}
              </span>
              <span className={isActive(item.href) ? "text-ink dark:text-paper" : "text-ink/50 dark:text-paper/50"}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
