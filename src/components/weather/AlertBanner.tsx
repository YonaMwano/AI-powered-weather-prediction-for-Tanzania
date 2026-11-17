"use client";

import { Alert } from "@/types/weather";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function AlertBanner({
  alert,
  lang,
}: {
  alert: Alert;
  lang: "en" | "sw";
}) {
  const severityColor =
    alert.severity === "Severe" || alert.severity === "Extreme"
      ? "border-alert/40 bg-alert/10 text-alert"
      : alert.severity === "Warning"
      ? "border-warn/40 bg-warn/10 text-warn"
      : "border-sky/40 bg-sky/10 text-sky";

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3",
        severityColor
      )}
    >
      <AlertTriangle size={20} className="mt-0.5 shrink-0" strokeWidth={1.5} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{alert.event || alert.headline}</p>
        <p className="mt-0.5 line-clamp-2 text-xs opacity-90">
          {alert.description?.slice(0, 160) ||
            (lang === "sw" ? "Tahadhari inatumika" : "Active weather alert")}
        </p>
      </div>
    </div>
  );
}
