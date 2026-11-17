import { Region, CurrentWeather, HourlyForecast, DailyForecast, Alert, UnifiedWeather, HistoryMonth } from "@/types/weather";
import { REGIONS, getRegionBySlug } from "./regions";

const OPEN_METEO_BASE = "https://api.open-meteo.com/v1/forecast";
const OPENWEATHER_BASE = "https://api.openweathermap.org/data/2.5";
const WEATHERAPI_BASE = "https://api.weatherapi.com/v1";

function getOWKey() {
  return process.env.OPENWEATHER_API_KEY || "";
}
function getWAKey() {
  return process.env.WEATHERAPI_KEY || "";
}

// Map WMO codes to simple condition strings
function wmoToCondition(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 55) return "Drizzle";
  if (code <= 65) return "Rain";
  if (code <= 67) return "Freezing rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Rain showers";
  if (code <= 86) return "Snow showers";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}

export async function fetchOpenMeteo(region: Region, fresh = false): Promise<{
  current: Partial<CurrentWeather>;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}> {
  const url = new URL(OPEN_METEO_BASE);
  url.searchParams.set("latitude", region.lat.toString());
  url.searchParams.set("longitude", region.lng.toString());
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,is_day"
  );
  url.searchParams.set(
    "hourly",
    "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,is_day"
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,sunrise,sunset,wind_speed_10m_max"
  );
  url.searchParams.set("timezone", "Africa/Dar_es_Salaam");
  url.searchParams.set("forecast_days", "16");
  url.searchParams.set("forecast_hours", "24");

  const res = await fetch(url.toString(), {
    ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: 900 } }),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);

  const data = await res.json();

  const current: Partial<CurrentWeather> = {
    temp: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windDir: String(data.current.wind_direction_10m),
    condition: wmoToCondition(data.current.weather_code),
    conditionCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    updatedAt: `${data.current.time}+03:00`,
    source: "Open-Meteo",
  };

  const hourly: HourlyForecast[] = (data.hourly.time || []).slice(0, 24).map((t: string, i: number) => ({
    time: `${t}+03:00`,
    temp: data.hourly.temperature_2m[i],
    feelsLike: data.hourly.apparent_temperature?.[i],
    precipitation: data.hourly.precipitation[i],
    precipProb: data.hourly.precipitation_probability[i],
    humidity: data.hourly.relative_humidity_2m?.[i],
    windSpeed: data.hourly.wind_speed_10m?.[i],
    condition: wmoToCondition(data.hourly.weather_code[i]),
    conditionCode: data.hourly.weather_code[i],
    icon: "",
    isDay: data.hourly.is_day[i] === 1,
  }));

  const daily: DailyForecast[] = (data.daily.time || []).map((d: string, i: number) => ({
    date: d,
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    precipSum: data.daily.precipitation_sum[i],
    precipProb: data.daily.precipitation_probability_max[i],
    condition: wmoToCondition(data.daily.weather_code[i]),
    conditionCode: data.daily.weather_code[i],
    icon: "",
    sunrise: data.daily.sunrise?.[i],
    sunset: data.daily.sunset?.[i],
    windSpeedMax: data.daily.wind_speed_10m_max?.[i],
  }));

  return { current, hourly, daily };
}

export async function fetchOpenWeatherCurrent(region: Region, fresh = false): Promise<Partial<CurrentWeather> & { alerts?: Alert[] }> {
  const key = getOWKey();
  if (!key) return {};

  const url = `${OPENWEATHER_BASE}/weather?lat=${region.lat}&lon=${region.lng}&appid=${key}&units=metric`;
  const res = await fetch(url, { ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: 600 } }), signal: AbortSignal.timeout(8000) });
  if (!res.ok) return {};

  const data = await res.json();

  const alertsUrl = `${OPENWEATHER_BASE}/onecall?lat=${region.lat}&lon=${region.lng}&exclude=minutely,hourly,daily&appid=${key}&units=metric`;
  let alerts: Alert[] = [];
  try {
    const aRes = await fetch(alertsUrl, { ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: 600 } }), signal: AbortSignal.timeout(8000) });
    if (aRes.ok) {
      const aData = await aRes.json();
      if (aData.alerts) {
        alerts = aData.alerts.map((a: any, idx: number) => ({
          id: `ow-${idx}-${a.start}`,
          event: a.event,
          severity: mapSeverity(a.tags?.[0] || a.event),
          headline: a.event,
          description: a.description,
          regions: [region.name],
          start: new Date(a.start * 1000).toISOString(),
          end: new Date(a.end * 1000).toISOString(),
          source: "OpenWeather / TMA",
        }));
      }
    }
  } catch {
    // ignore alerts failure
  }

  return {
    temp: data.main?.temp,
    feelsLike: data.main?.feels_like,
    humidity: data.main?.humidity,
    windSpeed: data.wind?.speed != null ? data.wind.speed * 3.6 : undefined, // m/s to km/h
    windDir: data.wind?.deg?.toString(),
    condition: data.weather?.[0]?.main || "Unknown",
    conditionCode: data.weather?.[0]?.id || 0,
    pressure: data.main?.pressure,
    visibility: data.visibility ? data.visibility / 1000 : undefined,
    isDay: data.sys?.sunrise && data.sys?.sunset
      ? Date.now() / 1000 > data.sys.sunrise && Date.now() / 1000 < data.sys.sunset
      : true,
    updatedAt: new Date(data.dt * 1000).toISOString(),
    source: "OpenWeather",
    alerts,
  };
}

function mapSeverity(tag: string): Alert["severity"] {
  const t = (tag || "").toLowerCase();
  if (t.includes("extreme") || t.includes("severe")) return "Severe";
  if (t.includes("warning")) return "Warning";
  if (t.includes("watch") || t.includes("advisory")) return "Watch";
  return "Unknown";
}

export async function fetchWeatherAPIHistory(region: Region): Promise<HistoryMonth[]> {
  const key = getWAKey();
  if (!key) return [];

  // For demo we fetch last year monthly approx via current + history endpoint limited
  // WeatherAPI history is day by day; for production use a daily cron + KV
  // Here we return a lightweight mock-like structure based on current year averages if limited
  try {
    // Fetch a few recent months summary via forecast history if available, else skip heavy calls
    // To avoid rate limits in this scaffold we return empty and note in UI
    return [];
  } catch {
    return [];
  }
}

export async function getUnifiedWeather(slugOrId: string, fresh = false): Promise<UnifiedWeather | null> {
  const region = getRegionBySlug(slugOrId) || REGIONS.find((r) => r.id === slugOrId);
  if (!region) return null;

  try {
    const [omResult, owResult] = await Promise.allSettled([
      fetchOpenMeteo(region, fresh),
      fetchOpenWeatherCurrent(region, fresh),
    ]);
    const om = omResult.status === "fulfilled" ? omResult.value : null;
    const ow = owResult.status === "fulfilled" ? owResult.value : {};
    if (!Number.isFinite(ow.temp) && !Number.isFinite(om?.current.temp)) return null;

    // Reject incomplete observations rather than substituting invented conditions.
    for (const field of ["temp", "feelsLike", "humidity", "windSpeed"] as const) {
      if (!Number.isFinite(ow[field] ?? om?.current[field])) return null;
    }
    const current: CurrentWeather = {
      temp: (ow.temp ?? om?.current.temp)!,
      feelsLike: (ow.feelsLike ?? om?.current.feelsLike)!,
      humidity: (ow.humidity ?? om?.current.humidity)!,
      windSpeed: (ow.windSpeed ?? om?.current.windSpeed)!,
      windDir: ow.windDir ?? om?.current.windDir ?? "N",
      condition: ow.condition ?? om?.current.condition ?? "Unavailable",
      conditionCode: ow.conditionCode ?? om?.current.conditionCode ?? 0,
      icon: "",
      pressure: ow.pressure,
      visibility: ow.visibility,
      isDay: ow.isDay ?? om?.current.isDay ?? true,
      updatedAt: ow.updatedAt ?? om?.current.updatedAt ?? new Date().toISOString(),
      source: [ow.source, om?.current.source].filter(Boolean).join(" + ") || "Open-Meteo",
    };

    const sources = Array.from(
      new Set([om ? "Open-Meteo" : null, ow.source ? "OpenWeather" : null].filter(Boolean) as string[])
    );

    return {
      region,
      current,
      hourly: om?.hourly || [],
      daily: om?.daily || [],
      alerts: ow.alerts || [],
      history: [],
      sources,
      fetchedAt: new Date().toISOString(),
    };
  } catch (e) {
    console.error("Weather providers unavailable");
    return null;
  }
}
