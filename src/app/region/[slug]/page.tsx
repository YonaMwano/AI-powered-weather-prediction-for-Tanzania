"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { useApp } from "@/components/Providers";
import { getRegionBySlug } from "@/lib/regions";
import { UnifiedWeather, AIInsight } from "@/types/weather";
import { WeatherHero } from "@/components/weather/WeatherHero";
import { AIInsightCard } from "@/components/weather/AIInsightCard";
import { HourlyStrip } from "@/components/weather/HourlyStrip";
import { DailyForecast } from "@/components/weather/DailyForecast";
import { Loader2 } from "lucide-react";

export default function RegionPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { lang, unit, setRegion } = useApp();
  const [weather, setWeather] = useState<UnifiedWeather | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const r = getRegionBySlug(slug);
    if (r) setRegion(r);
  }, [slug, setRegion]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/weather?region=${slug}&insight=1&lang=${lang}`);
        const data = await res.json();
        setWeather(data.weather);
        setInsight(data.insight);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, lang]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-6">
        {loading && (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
          </div>
        )}
        {!loading && weather && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <WeatherHero weather={weather} unit={unit} lang={lang} />
              <AIInsightCard insight={insight} lang={lang} />
            </div>
            <HourlyStrip hourly={weather.hourly} unit={unit} lang={lang} />
            <DailyForecast daily={weather.daily} unit={unit} lang={lang} />
          </div>
        )}
      </div>
    </div>
  );
}
