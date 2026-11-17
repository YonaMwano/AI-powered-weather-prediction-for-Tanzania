"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { useApp } from "@/components/Providers";
import { UnifiedWeather, AIInsight } from "@/types/weather";
import { WeatherHero } from "@/components/weather/WeatherHero";
import { AIInsightCard } from "@/components/weather/AIInsightCard";
import { HourlyStrip } from "@/components/weather/HourlyStrip";
import { DailyForecast } from "@/components/weather/DailyForecast";
import { MapPreview } from "@/components/weather/MapPreview";
import { SourceBadge } from "@/components/weather/SourceBadge";
import { HistoryCompare } from "@/components/weather/HistoryCompare";
import { AlertBanner } from "@/components/weather/AlertBanner";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { region, lang, unit } = useApp();
  const [weather, setWeather] = useState<UnifiedWeather | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/weather?region=${region.slug}&insight=1&lang=${lang}`
        );
        if (!res.ok) throw new Error("Failed to load weather");
        const data = await res.json();
        if (!cancelled) {
          setWeather(data.weather);
          setInsight(data.insight);
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [region.slug, lang]);

  return (
    <div className="min-h-screen">
      <Header alertCount={weather?.alerts?.length || 0} />

      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6">
        {weather?.alerts && weather.alerts.length > 0 && (
          <div className="mb-4">
            <AlertBanner alert={weather.alerts[0]} lang={lang} />
          </div>
        )}

        {loading && (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-ink-2">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <p className="text-sm">{lang === "sw" ? "Inapakia..." : "Loading weather..."}</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-alert/30 bg-alert/5 p-4 text-center text-sm text-alert">
            {error}
          </div>
        )}

        {!loading && weather && (
          <>
            {/* Hero + AI row */}
            <div className="mb-4 grid gap-4 md:grid-cols-2">
              <WeatherHero weather={weather} unit={unit} lang={lang} />
              <AIInsightCard insight={insight} lang={lang} loading={!insight} />
            </div>

            {/* Hourly */}
            <div className="mb-4">
              <HourlyStrip hourly={weather.hourly} unit={unit} lang={lang} />
            </div>

            {/* Bento lower */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="md:col-span-1 lg:col-span-2">
                <DailyForecast daily={weather.daily} unit={unit} lang={lang} />
              </div>
              <div className="md:col-span-1">
                <MapPreview region={weather.region} />
              </div>
              <div className="md:col-span-1 space-y-4">
                <HistoryCompare history={weather.history} />
                <div className="rounded-lg border border-border bg-surface p-4 shadow-soft">
                  <h3 className="mb-2 text-sm font-medium text-ink-2">
                    {lang === "sw" ? "Vyanzo" : "Sources"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {weather.sources.map((s) => (
                      <SourceBadge key={s} source={s} />
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-ink-2">
                    {lang === "sw"
                      ? `Ilisasishwa: ${new Date(weather.fetchedAt).toLocaleTimeString("sw-TZ")}`
                      : `Updated: ${new Date(weather.fetchedAt).toLocaleTimeString()}`}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
