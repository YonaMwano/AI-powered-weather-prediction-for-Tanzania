import Groq from "groq-sdk";
import { UnifiedWeather, AIInsight } from "@/types/weather";

// Reliable models on Groq (fallback chain)
const MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant",
  "mixtral-8x7b-32768",
];

function getClient() {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    console.error("GROQ_API_KEY is missing");
    throw new Error("GROQ_API_KEY missing");
  }
  return new Groq({ apiKey: key });
}

const SYSTEM_PROMPT = `You are Anga, a Tanzania weather analyst. Reply in the language requested (en or sw). Be brief, actionable, mention region names, cite data sources you were given. Never invent numbers not in the payload. Focus on practical advice for farmers, travellers and daily life in Tanzania. Keep answers under 80 words unless asked for more detail.`;

async function callGroq(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  maxTokens = 250
) {
  const client = getClient();
  let lastError: any = null;

  for (const model of MODELS) {
    try {
      const completion = await client.chat.completions.create({
        model,
        messages,
        temperature: 0.45,
        max_tokens: maxTokens,
      });
      const text = completion.choices[0]?.message?.content?.trim();
      if (text) return text;
    } catch (e: any) {
      lastError = e;
      console.warn(`Groq model ${model} failed:`, e?.message || e);
      continue;
    }
  }
  throw lastError || new Error("All Groq models failed");
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
    const text = await callGroq([
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
    console.error("Groq insight error", e);
    const rainProb = weather.hourly[0]?.precipProb ?? 0;
    const text =
      lang === "sw"
        ? `Hali ya sasa ${Math.round(weather.current.temp)}°C, ${weather.current.condition}. Uwezekano wa mvua ~${rainProb}%.`
        : `Currently ${Math.round(weather.current.temp)}°C, ${weather.current.condition}. Rain chance ~${rainProb}%.`;
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
  history: { role: "user" | "assistant"; content: string }[] = []
): Promise<{ content: string; sources: string[] }> {
  const context = weather
    ? `Current data for ${weather.region.name}: temp ${weather.current.temp}°C, ${weather.current.condition}, humidity ${weather.current.humidity}%, wind ${weather.current.windSpeed} km/h. Sources: ${weather.sources.join(", ")}. Next 6h precip probs: ${weather.hourly
        .slice(0, 6)
        .map((h) => h.precipProb)
        .join("% , ")}%.`
    : "No specific region data loaded.";

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
    const content = await callGroq(messages, 400);
    return {
      content,
      sources: weather?.sources || [],
    };
  } catch (e) {
    console.error("Groq chat error", e);
    return {
      content:
        lang === "sw"
          ? "Samahani, kuna tatizo la muunganisho na AI. Hakikisha GROQ_API_KEY ipo kwenye environment variables na jaribu tena."
          : "Sorry, AI connection issue. Please verify GROQ_API_KEY is set in environment variables and try again.",
      sources: [],
    };
  }
}
