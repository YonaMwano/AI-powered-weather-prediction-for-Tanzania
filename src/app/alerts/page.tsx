"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { useApp } from "@/components/Providers";
import { Alert } from "@/types/weather";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AlertsPage() {
  const { region, lang } = useApp();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/weather?region=${region.slug}`);
        const data = await res.json();
        setAlerts(data.weather?.alerts || []);
      } catch {
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [region.slug]);

  return (
    <div className="min-h-screen">
      <Header alertCount={alerts.length} />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-4 font-display text-xl font-semibold">
          {lang === "sw" ? "Kituo cha Tahadhari" : "Alerts Center"}
        </h1>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
          </div>
        )}

        {!loading && alerts.length === 0 && (
          <div className="rounded-lg border border-border bg-surface p-8 text-center">
            <AlertTriangle className="mx-auto mb-3 text-leaf" size={32} />
            <p className="font-medium">
              {lang === "sw" ? "Hakuna tahadhari zinazotumika" : "No active alerts"}
            </p>
            <p className="mt-1 text-sm text-ink-2">
              {lang === "sw"
                ? `Kwa ${region.name} kwa sasa`
                : `For ${region.name} right now`}
            </p>
          </div>
        )}

        <ul className="space-y-3">
          {alerts.map((a) => (
            <li
              key={a.id}
              className={cn(
                "rounded-lg border p-4",
                a.severity === "Severe" || a.severity === "Extreme"
                  ? "border-alert/40 bg-alert/5"
                  : "border-warn/40 bg-warn/5"
              )}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={20}
                  className={
                    a.severity === "Severe" ? "text-alert" : "text-warn"
                  }
                />
                <div>
                  <p className="font-semibold">{a.event}</p>
                  <p className="mt-1 text-sm text-ink-2 line-clamp-3">
                    {a.description}
                  </p>
                  <p className="mt-2 text-xs text-ink-2">
                    {a.source} · {new Date(a.start).toLocaleString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
