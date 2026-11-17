"use client";

import { Header } from "@/components/Header";
import { useApp } from "@/components/Providers";
import { REGIONS } from "@/lib/regions";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { lang, setLang, theme, setTheme, unit, setUnit, region, setRegion } =
    useApp();

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-lg px-4 py-6">
        <h1 className="mb-6 font-display text-xl font-semibold">
          {lang === "sw" ? "Mipangilio" : "Settings"}
        </h1>

        <section className="mb-6 rounded-lg border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-medium text-ink-2">
            {lang === "sw" ? "Lugha" : "Language"}
          </h2>
          <div className="flex gap-2">
            {(["en", "sw"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  "rounded-pill px-4 py-2 text-sm font-medium transition",
                  lang === l
                    ? "bg-brand text-white"
                    : "border border-border hover:bg-bg"
                )}
              >
                {l === "en" ? "English" : "Kiswahili"}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-6 rounded-lg border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-medium text-ink-2">
            {lang === "sw" ? "Mandhari" : "Theme"}
          </h2>
          <div className="flex gap-2">
            {(["light", "dark"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  "rounded-pill px-4 py-2 text-sm font-medium capitalize transition",
                  theme === t
                    ? "bg-brand text-white"
                    : "border border-border hover:bg-bg"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-6 rounded-lg border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-medium text-ink-2">
            {lang === "sw" ? "Kitengo" : "Units"}
          </h2>
          <div className="flex gap-2">
            {(["C", "F"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={cn(
                  "rounded-pill px-4 py-2 text-sm font-medium transition",
                  unit === u
                    ? "bg-brand text-white"
                    : "border border-border hover:bg-bg"
                )}
              >
                °{u}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-6 rounded-lg border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-medium text-ink-2">
            {lang === "sw" ? "Mkoa wa nyumbani" : "Home region"}
          </h2>
          <select
            value={region.slug}
            onChange={(e) => {
              const r = REGIONS.find((x) => x.slug === e.target.value);
              if (r) setRegion(r);
            }}
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-brand"
          >
            {REGIONS.map((r) => (
              <option key={r.id} value={r.slug}>
                {r.name} ({r.swName})
              </option>
            ))}
          </select>
        </section>

        <section className="rounded-lg border border-border bg-surface p-4">
          <h2 className="mb-2 text-sm font-medium text-ink-2">
            {lang === "sw" ? "Vyanzo vya data" : "Data sources"}
          </h2>
          <ul className="space-y-1 text-sm text-ink-2">
            <li>Open-Meteo — forecast backbone</li>
            <li>OpenWeather — current + alerts</li>
            <li>WeatherAPI — historical context</li>
            <li>Groq — AI interpretation</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
