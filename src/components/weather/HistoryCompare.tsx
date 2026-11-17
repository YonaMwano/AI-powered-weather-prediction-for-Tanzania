"use client";

import { HistoryMonth } from "@/types/weather";
import { useApp } from "@/components/Providers";
import { BarChart3 } from "lucide-react";

export function HistoryCompare({
  history,
  currentMonthPrecip,
}: {
  history?: HistoryMonth[];
  currentMonthPrecip?: number;
}) {
  const { lang } = useApp();

  // Scaffold: show message when no deep history (WeatherAPI history is rate-limited / paid for bulk)
  if (!history || history.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface p-4 shadow-soft">
        <div className="mb-2 flex items-center gap-2">
          <BarChart3 size={16} className="text-brand" strokeWidth={1.5} />
          <h3 className="text-sm font-medium text-ink-2">
            {lang === "sw" ? "Historia" : "History"}
          </h3>
        </div>
        <p className="text-sm text-ink-2">
          {lang === "sw"
            ? "Data ya miaka 10 inakuja. Kwa sasa angalia utabiri wa siku 16 kutoka Open-Meteo."
            : "10-year history coming soon. For now use the 16-day forecast from Open-Meteo."}
        </p>
        {typeof currentMonthPrecip === "number" && (
          <p className="mt-2 text-xs text-ink-2">
            {lang === "sw" ? "Mvua ya mwezi huu (makadirio):" : "This month precip (est.):"}{" "}
            {currentMonthPrecip.toFixed(1)} mm
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 flex items-center gap-2">
        <BarChart3 size={16} className="text-brand" strokeWidth={1.5} />
        <h3 className="text-sm font-medium">
          {lang === "sw" ? "Linganisha na mwaka jana" : "Compare with last year"}
        </h3>
      </div>
      <ul className="space-y-2 text-sm">
        {history.slice(-6).map((h) => (
          <li key={`${h.year}-${h.month}`} className="flex justify-between">
            <span className="text-ink-2">
              {h.year}-{String(h.month).padStart(2, "0")}
            </span>
            <span>
              {h.avgTemp.toFixed(1)}°C · {h.totalPrecip.toFixed(0)} mm
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
