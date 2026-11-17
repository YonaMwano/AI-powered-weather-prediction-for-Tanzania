import { NextRequest, NextResponse } from "next/server";
import { chatWithAnga } from "@/lib/groq";
import { getUnifiedWeather } from "@/lib/weather-api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, regionSlug, lang = "en", history = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    let weather = null;
    if (regionSlug) {
      weather = await getUnifiedWeather(regionSlug);
    }

    const result = await chatWithAnga(message, weather, lang, history);

    return NextResponse.json(result);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message || "Chat failed" }, { status: 500 });
  }
}
