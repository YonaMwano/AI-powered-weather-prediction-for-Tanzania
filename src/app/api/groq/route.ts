import { NextRequest, NextResponse } from "next/server";
import { chatWithAnga, weatherSummary } from "@/lib/groq";
import { getUnifiedWeather } from "@/lib/weather-api";
import { DEFAULT_REGION, getRegionBySlug, REGIONS } from "@/lib/regions";

export const runtime = "nodejs";

function mentionedRegions(text: string) {
  const normalized = ` ${text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ")} `;
  return REGIONS.filter((r) => [r.name, r.swName, r.slug, r.capital].some((alias) => {
    const name = alias.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ");
    return normalized.includes(` ${name} `);
  }));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, regionSlug } = body;
    const lang = body.lang === "sw" ? "sw" : "en";
    if (typeof message !== "string" || !message.trim() || message.length > 4000) {
      return NextResponse.json({ error: "A message of 1–4000 characters is required" }, { status: 400 });
    }
    const history: { role: "user" | "assistant"; content: string }[] = Array.isArray(body.history)
      ? body.history.filter((m: { role?: string; content?: unknown }) =>
          m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
        ).slice(-6).map((m: { role: "user" | "assistant"; content: string }) => ({ role: m.role, content: m.content.slice(0, 4000) }))
      : [];
    // Explicit locations override the header; follow-up questions retain the last named location.
    let regions = mentionedRegions(message);
    if (!regions.length) {
      for (const previous of [...history].reverse()) {
        if (previous.role !== "user") continue;
        regions = mentionedRegions(previous.content);
        if (regions.length) break;
      }
    }
    if (!regions.length) regions = [getRegionBySlug(typeof regionSlug === "string" ? regionSlug : "") || DEFAULT_REGION];
    if (regions.length > 4) {
      return NextResponse.json({ content: lang === "sw" ? "Tafadhali chagua mikoa isiyozidi minne kwa ulinganisho mmoja." : "Please choose up to four regions for one weather comparison.", sources: [] });
    }
    const results = await Promise.all(regions.map((r) => getUnifiedWeather(r.slug, true)));
    const weather = results.filter((w) => w !== null);
    if (!weather.length) return NextResponse.json({ content: weatherSummary(null, lang), sources: [] });
    const unavailable = regions.filter((_, i) => !results[i]).map((r) => r.name);
    const result = await chatWithAnga(message, weather[0], lang, history, weather.slice(1), unavailable);
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to process this chat request. Please retry." }, { status: 400 });
  }
}
