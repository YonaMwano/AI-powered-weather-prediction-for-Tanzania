"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Globe, Bell, Search, Moon, Sun } from "lucide-react";
import { useApp } from "./Providers";
import { REGIONS, searchRegions } from "@/lib/regions";
import { Region } from "@/types/weather";
import { cn } from "@/lib/utils";

export function Header({ alertCount = 0 }: { alertCount?: number }) {
  const { lang, setLang, region, setRegion, theme, setTheme } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = searchRegions(query);

  function selectRegion(r: Region) {
    setRegion(r);
    setOpen(false);
    setQuery("");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 15h18M5 12h14M8 9h8" />
              <circle cx="12" cy="6" r="1.5" fill="currentColor" />
              <circle cx="9" cy="8" r="1" fill="currentColor" />
              <circle cx="15" cy="8" r="1" fill="currentColor" />
            </svg>
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">Anga</span>
        </Link>

        <div className="relative flex-1 max-w-xs">
          <button
            onClick={() => setOpen(!open)}
            className="flex w-full items-center justify-between gap-2 rounded-pill border border-border bg-bg px-3 py-2 text-sm transition hover:border-brand/40"
          >
            <span className="truncate font-medium">{region.name}</span>
            <ChevronDown size={16} className={cn("shrink-0 transition", open && "rotate-180")} />
          </button>

          {open && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-hidden rounded-lg border border-border bg-surface shadow-soft">
              <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                <Search size={16} className="text-ink-2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={lang === "sw" ? "Tafuta mkoa..." : "Search region..."}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-ink-2"
                  autoFocus
                />
              </div>
              <ul className="max-h-56 overflow-y-auto py-1">
                {filtered.map((r) => (
                  <li key={r.id}>
                    <button
                      onClick={() => selectRegion(r)}
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-bg",
                        r.id === region.id && "bg-brand/10 text-brand"
                      )}
                    >
                      <span>{r.name}</span>
                      <span className="text-xs text-ink-2">{r.swName}</span>
                    </button>
                  </li>
                ))}
                {filtered.length === 0 && (
                  <li className="px-3 py-4 text-center text-sm text-ink-2">
                    {lang === "sw" ? "Hakuna matokeo" : "No results"}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-2 transition hover:bg-bg hover:text-ink"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
          </button>
          <button
            onClick={() => setLang(lang === "en" ? "sw" : "en")}
            className="flex h-10 min-w-[44px] items-center justify-center gap-1 rounded-lg px-2 text-sm font-medium text-ink-2 transition hover:bg-bg hover:text-ink"
            aria-label="Toggle language"
          >
            <Globe size={18} strokeWidth={1.5} />
            <span className="hidden sm:inline">{lang === "en" ? "EN" : "SW"}</span>
          </button>

          <Link
            href="/alerts"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-ink-2 transition hover:bg-bg hover:text-ink"
            aria-label="Alerts"
          >
            <Bell size={18} strokeWidth={1.5} />
            {alertCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-alert text-[10px] font-bold text-white">
                {alertCount > 9 ? "9+" : alertCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
