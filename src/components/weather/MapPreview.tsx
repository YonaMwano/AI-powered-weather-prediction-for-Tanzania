"use client";

import Link from "next/link";
import { Region } from "@/types/weather";
import { Map } from "lucide-react";
import { useApp } from "@/components/Providers";

export function MapPreview({ region }: { region: Region }) {
  const { lang } = useApp();

  return (
    <Link
      href="/map"
      className="flex h-full min-h-[140px] flex-col justify-between rounded-lg border border-border bg-surface p-4 shadow-soft transition hover:border-brand/40"
    >
      <div className="flex items-center gap-2">
        <Map size={18} className="text-brand" strokeWidth={1.5} />
        <h3 className="text-sm font-medium">
          {lang === "sw" ? "Ramani" : "Map"}
        </h3>
      </div>
      <div className="mt-3 flex flex-1 items-center justify-center rounded-md bg-bg">
        <div className="text-center">
          <p className="text-xs text-ink-2">{region.name}</p>
          <p className="mt-1 font-mono text-[10px] text-ink-2">
            {region.lat.toFixed(2)}, {region.lng.toFixed(2)}
          </p>
        </div>
      </div>
      <p className="mt-2 text-xs text-brand">
        {lang === "sw" ? "Fungua ramani →" : "Open map →"}
      </p>
    </Link>
  );
}
