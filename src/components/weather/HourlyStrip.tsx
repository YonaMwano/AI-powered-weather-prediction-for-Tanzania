"use client";

import { HourlyForecast } from "@/types/weather";
import { formatTemp } from "@/lib/utils";
import { CloudRain, Sun, Cloud, CloudSun } from "lucide-react";

function MiniIcon({ condition, isDay }: { condition: string; isDay: boolean }) {
  const c = condition.toLowerCase();
  if (c.includes("rain") || c.includes("drizzle"))
    return <CloudRain size={18} className="text-sky" strokeWidth={1.5} />;
  if (c.includes("clear"))
    return isDay ? <Sun size={18} className="text-sun" strokeWidth={1.5} /> : <Cloud size={18} strokeWidth={1.5} />;
  if (c.includes("cloud"))
    return isDay ? <CloudSun size={18} className="text-sky" strokeWidth={1.5} /> : <Cloud size={18} strokeWidth={1.5} />;
  return <Cloud size={18} className="text-ink-2" strokeWidth={1.5} />;
}

export function HourlyStrip({
  hourly,
  unit,
  lang,
}: {
  hourly: HourlyForecast[];
  unit: "C" | "F";
  lang: "en" | "sw";
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-soft">
      <h3 className="mb-3 text-sm font-medium text-ink-2">
        {lang === "sw" ? "Saa 24 zijazo" : "Next 24 hours"}
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {hourly.map((h, i) => {
          const time = new Date(h.time);
          const label =
            i === 0
              ? lang === "sw"
                ? "Sasa"
                : "Now"
              : time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return (
            <div
              key={h.time}
              className="flex min-w-[64px] flex-col items-center gap-1.5 rounded-md px-2 py-2"
            >
              <span className="text-xs text-ink-2">{label}</span>
              <MiniIcon condition={h.condition} isDay={h.isDay} />
              <span className="text-sm font-semibold">{formatTemp(h.temp, unit)}</span>
              {h.precipProb > 10 && (
                <span className="text-[10px] text-sky">{h.precipProb}%</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
