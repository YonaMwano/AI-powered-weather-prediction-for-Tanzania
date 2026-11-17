"use client";

import { DailyForecast as Daily } from "@/types/weather";
import { formatTemp } from "@/lib/utils";
import { CloudRain, Sun, Cloud, CloudSun } from "lucide-react";

function DayIcon({ condition }: { condition: string }) {
  const c = condition.toLowerCase();
  if (c.includes("rain") || c.includes("drizzle"))
    return <CloudRain size={18} className="text-sky" strokeWidth={1.5} />;
  if (c.includes("clear"))
    return <Sun size={18} className="text-sun" strokeWidth={1.5} />;
  if (c.includes("cloud"))
    return <CloudSun size={18} className="text-sky" strokeWidth={1.5} />;
  return <Cloud size={18} className="text-ink-2" strokeWidth={1.5} />;
}

export function DailyForecast({
  daily,
  unit,
  lang,
}: {
  daily: Daily[];
  unit: "C" | "F";
  lang: "en" | "sw";
}) {
  const days = daily.slice(0, 7);

  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-soft">
      <h3 className="mb-3 text-sm font-medium text-ink-2">
        {lang === "sw" ? "Siku 7 zijazo" : "7-day forecast"}
      </h3>
      <ul className="space-y-2">
        {days.map((d, i) => {
          const date = new Date(d.date);
          const dayLabel =
            i === 0
              ? lang === "sw"
                ? "Leo"
                : "Today"
              : date.toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", {
                  weekday: "short",
                });
          const range = d.tempMax - d.tempMin || 1;
          const barWidth = Math.min(100, Math.max(20, (range / 15) * 100));

          return (
            <li key={d.date} className="flex items-center gap-3 text-sm">
              <span className="w-12 shrink-0 font-medium">{dayLabel}</span>
              <DayIcon condition={d.condition} />
              <span className="w-10 text-ink-2">{formatTemp(d.tempMin, unit)}</span>
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-bg">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-sky/40 to-sun/60"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <span className="w-10 text-right font-medium">{formatTemp(d.tempMax, unit)}</span>
              {d.precipProb > 5 && (
                <span className="w-10 text-right text-xs text-sky">{d.precipProb}%</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
