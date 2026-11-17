"use client";

import { MarkdownText } from "@/components/MarkdownText";
import { useState } from "react";
import { AIInsight } from "@/types/weather";
import { Sparkles, ChevronDown, MessageCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function AIInsightCard({
  insight,
  lang,
  loading,
}: {
  insight: AIInsight | null;
  lang: "en" | "sw";
  loading?: boolean;
}) {
  const [showWhy, setShowWhy] = useState(false);

  if (loading || !insight) {
    return (
      <div className="rounded-lg border border-border bg-surface p-5 shadow-soft">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-brand" />
          <span className="text-sm font-medium">AI Insight</span>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded ai-shimmer" />
          <div className="h-4 w-4/5 rounded ai-shimmer" />
          <div className="h-4 w-3/5 rounded ai-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-5 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-brand" strokeWidth={1.5} />
          <span className="text-sm font-medium">
            {lang === "sw" ? "Ufahamu wa AI" : "AI Insight"}
          </span>
        </div>
        <span className="text-xs text-ink-2">
          {new Date(insight.generatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="text-base leading-relaxed text-ink"><MarkdownText>{insight.text}</MarkdownText></div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded-pill px-2 py-0.5 text-xs font-medium",
            insight.confidence === "High" && "bg-leaf/15 text-leaf",
            insight.confidence === "Medium" && "bg-warn/15 text-warn",
            insight.confidence === "Low" && "bg-ink-2/15 text-ink-2"
          )}
        >
          {insight.confidence} confidence
        </span>
        {insight.sources.map((s) => (
          <span key={s} className="rounded-pill bg-bg px-2 py-0.5 text-xs text-ink-2">
            {s}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setShowWhy(!showWhy)}
          className="flex items-center gap-1 rounded-pill border border-border px-3 py-1.5 text-xs font-medium transition hover:bg-bg"
        >
          {lang === "sw" ? "Kwa nini?" : "Why?"}
          <ChevronDown size={14} className={cn("transition", showWhy && "rotate-180")} />
        </button>
        <Link
          href="/ask"
          className="flex items-center gap-1 rounded-pill bg-brand px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
        >
          <MessageCircle size={14} />
          {lang === "sw" ? "Uliza Anga" : "Ask Anga"}
        </Link>
      </div>

      {showWhy && (
        <div className="mt-3 rounded-md bg-bg p-3 text-sm text-ink-2">
          <p>
            {lang === "sw"
              ? "Utabiri huu unatokana na data kutoka vyanzo vilivyoonyeshwa. AI inachambua mwenendo wa saa zijazo na hali ya sasa."
              : "This forecast is derived from the listed data sources. The AI analyses near-term trends and current conditions."}
          </p>
        </div>
      )}
    </div>
  );
}
