"use client";

import { UnifiedWeather } from "@/types/weather";
import { formatTemp } from "@/lib/utils";
import { Cloud, CloudRain, Sun, CloudSun, Wind, Droplets, Thermometer } from "lucide-react";

function WeatherIcon({ condition, isDay }: { condition: string; isDay: boolean }) {
  const c = condition.toLowerCase();
  if (c.includes("rain") || c.includes("drizzle") || c.includes("shower"))
    return <CloudRain size={40} strokeWidth={1.5} className="text-sky" />;
  if (c.includes("clear") || c.includes("sunny"))
    return isDay ? <Sun size={40} strokeWidth={1.5} className="text-sun" /> : <Cloud size={40} strokeWidth={1.5} />;
  if (c.includes("cloud") || c.includes("overcast"))
    return isDay ? <CloudSun size={40} strokeWidth={1.5} className="text-sky" /> : <Cloud size={40} strokeWidth={1.5} />;
  return <Cloud size={40} strokeWidth={1.5} className="text-ink-2" />;
}

export function WeatherHero({
  weather,
  unit,
  lang,
}: {
  weather: UnifiedWeather;
  unit: "C" | "F";
  lang: "en" | "sw";
}) {
  const { current, region } = weather;

  return (
    <div className="rounded-lg border border-border bg-surface p-5 shadow-soft">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded-pill bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
          {region.name}
        </span>
        <span className="text-xs text-ink-2">
          {lang === "sw" ? "Sasa" : "Now"}
        </span>
      </div>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-[4.5rem] font-light leading-none tracking-tighter md:text-[5.5rem]">
              {formatTemp(current.temp, unit).replace("°C", "").replace("°F", "")}
            </span>
            <span className="text-3xl font-light text-ink-2 md:text-4xl">
              {unit === "C" ? "°C" : "°F"}
            </span>
          </div>
          <p className="mt-1 text-lg font-medium capitalize text-ink">
            {current.condition}
          </p>
          <p className="text-sm text-ink-2">
            {lang === "sw" ? "Inahisi" : "Feels"} {formatTemp(current.feelsLike, unit)}
          </p>
        </div>
        <WeatherIcon condition={current.condition} isDay={current.isDay} />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <Droplets size={16} className="text-sky" strokeWidth={1.5} />
          <div>
            <p className="text-xs text-ink-2">{lang === "sw" ? "Unyevu" : "Humidity"}</p>
            <p className="text-sm font-medium">{current.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind size={16} className="text-ink-2" strokeWidth={1.5} />
          <div>
            <p className="text-xs text-ink-2">{lang === "sw" ? "Upepo" : "Wind"}</p>
            <p className="text-sm font-medium">
              {Math.round(current.windSpeed)} km/h
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Thermometer size={16} className="text-sun" strokeWidth={1.5} />
          <div>
            <p className="text-xs text-ink-2">{lang === "sw" ? "Chanzo" : "Source"}</p>
            <p className="truncate text-sm font-medium">{current.source.split(" ")[0]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
