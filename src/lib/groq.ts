import OpenAI from "openai";
import { UnifiedWeather, AIInsight } from "@/types/weather";

const SYSTEM_PROMPT = `You are Anga, a Tanzania weather analyst. Reply in the requested language (en or sw). Be brief and practical for farmers, travellers and daily life. Use the supplied live weather and dated forecasts to answer directly, including tomorrow and weekly questions. Give times in Africa/Dar_es_Salaam (UTC+3). Cite sources and the observation time when using current weather. Never claim you lack access to live weather when data is supplied. Never invent observations, historical data, alerts or forecast values. If a requested fact is absent, explain the specific limitation and offer the closest supported information or a useful next step instead of a bare "I don't know". Forecasts are predictions, not guarantees. Use readable Markdown sparingly. Keep answers under 120 words unless more detail is requested.`;

async function callAI(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  maxTokens = 350
) {
  const client = new OpenAI({ timeout: 20000, maxRetries: 1 });
  const completion = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages,
    temperature: 0.3,
    max_tokens: maxTokens,
  });
  const text = completion.choices[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty AI response");
  return text;
}

export function weatherSummary(weather: UnifiedWeather | null, lang: "en" | "sw") {
  if (!weather) return lang === "sw"
    ? "Huduma ya hali ya hewa haipatikani kwa sasa. Jaribu tena baada ya muda mfupi kupata taarifa mpya. Kwa tahadhari rasmi, angalia Mamlaka ya Hali ya Hewa Tanzania (TMA)."
    : "The live weather service is temporarily unavailable. Please retry shortly for updated conditions. For official warnings, check the Tanzania Meteorological Authority (TMA).";
  const c = weather.current;
  const tomorrow = weather.daily[1];
  const observed = new Date(c.updatedAt).toLocaleString(lang === "sw" ? "sw-TZ" : "en-GB", { timeZone: "Africa/Dar_es_Salaam" });
  const forecast = tomorrow ? (lang === "sw"
    ? ` Utabiri wa ${tomorrow.date}: ${tomorrow.tempMin}–${tomorrow.tempMax}°C, uwezekano wa mvua ${tomorrow.precipProb}%.`
    : ` Forecast for ${tomorrow.date}: ${tomorrow.tempMin}–${tomorrow.tempMax}°C, rain chance ${tomorrow.precipProb}%.`) : "";
  return lang === "sw"
    ? `${weather.region.name}: ${c.temp}°C, ${c.condition}, unyevunyevu ${c.humidity}%, upepo ${c.windSpeed} km/h. Taarifa ya ${observed} EAT.${forecast} Chanzo: ${weather.sources.join(", ")}. Uchambuzi wa AI haupatikani kwa sasa; hizi ni taarifa za huduma ya hali ya hewa.`
    : `${weather.region.name}: ${c.temp}°C, ${c.condition}, humidity ${c.humidity}%, wind ${c.windSpeed} km/h. Observation: ${observed} EAT.${forecast} Source: ${weather.sources.join(", ")}. AI analysis is temporarily unavailable; this is a direct weather service summary.`;
}

export async function generateInsight(
  weather: UnifiedWeather,
  lang: "en" | "sw" = "en"
): Promise<AIInsight> {
  const payload = {
    region: weather.region.name,
    current: {
      temp: weather.current.temp,
      feelsLike: weather.current.feelsLike,
      humidity: weather.current.humidity,
      wind: weather.current.windSpeed,
      condition: weather.current.condition,
    },
    nextHours: weather.hourly.slice(0, 6).map((h) => ({
      time: h.time,
      temp: h.temp,
      precipProb: h.precipProb,
      condition: h.condition,
    })),
    nextDays: weather.daily.slice(0, 3).map((d) => ({
      date: d.date,
      max: d.tempMax,
      min: d.tempMin,
      precip: d.precipSum,
      prob: d.precipProb,
    })),
    alerts: weather.alerts.map((a) => a.event),
    sources: weather.sources,
  };

  const userPrompt =
    lang === "sw"
      ? `Toa ufahamu mfupi (max 40 maneno) kuhusu hali ya hewa ya sasa na saa zijazo kwa ${weather.region.name}. Eleza nini cha kufanya. Data: ${JSON.stringify(payload)}`
      : `Give a short insight (max 40 words) about current and near-term weather for ${weather.region.name}. Be actionable. Data: ${JSON.stringify(payload)}`;

  try {
    const text = await callAI([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ]);

    return {
      text,
      confidence: weather.sources.length > 1 ? "High" : "Medium",
      sources: weather.sources,
      generatedAt: new Date().toISOString(),
      lang,
    };
  } catch (e) {
    console.error("AI insight unavailable");
    const text = weatherSummary(weather, lang);
    return {
      text,
      confidence: "Low",
      sources: weather.sources,
      generatedAt: new Date().toISOString(),
      lang,
    };
  }
}

export async function chatWithAnga(
  message: string,
  weather: UnifiedWeather | null,
  lang: "en" | "sw",
  history: { role: "user" | "assistant"; content: string }[] = [],
  additionalWeather: UnifiedWeather[] = [],
  unavailableRegions: string[] = []
): Promise<{ content: string; sources: string[] }> {
  const context = weather
    ? JSON.stringify({ additionalRegions: additionalWeather, unavailableRegions, region: weather.region.name, current: weather.current, hourly: weather.hourly, daily: weather.daily, alerts: weather.alerts, sources: weather.sources, fetchedAt: weather.fetchedAt, timezone: "Africa/Dar_es_Salaam" })
    : "Live weather lookup failed. Explain the temporary outage; do not invent current conditions.";

  const messages = [
    {
      role: "system" as const,
      content: `${SYSTEM_PROMPT} Current context: ${context}. Always cite sources when using numbers. Reply in ${lang === "sw" ? "Kiswahili" : "English"}.`,
    },
    ...history.slice(-6).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: message },
  ];

  try {
    const content = await callAI(messages, 400);
    return {
      content,
      sources: Array.from(new Set([weather, ...additionalWeather].flatMap((w) => w?.sources || []))),
    };
  } catch (e) {
    console.error("AI chat unavailable");
    return { content: [weather, ...additionalWeather].map((w) => weatherSummary(w, lang)).join("\n\n"), sources: Array.from(new Set([weather, ...additionalWeather].flatMap((w) => w?.sources || []))) };
  }
}
