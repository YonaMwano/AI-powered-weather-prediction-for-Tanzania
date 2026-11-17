import { NextRequest, NextResponse } from "next/server";
import { getUnifiedWeather } from "@/lib/weather-api";
import { generateInsight } from "@/lib/groq";

export const runtime = "nodejs"; // or edge if compatible

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region") || "dar-es-salaam";
  const includeInsight = searchParams.get("insight") === "1";
  const lang = (searchParams.get("lang") || "en") as "en" | "sw";

  try {
    const weather = await getUnifiedWeather(region);
    if (!weather) {
      return NextResponse.json({ error: "Region not found" }, { status: 404 });
    }

    let insight = null;
    if (includeInsight) {
      insight = await generateInsight(weather, lang);
    }

    return NextResponse.json(
      { weather, insight },
      {
        headers: {
          "Cache-Control": "s-maxage=900, stale-while-revalidate=1800",
        },
      }
    );
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message || "Failed to fetch weather" }, { status: 500 });
  }
}
