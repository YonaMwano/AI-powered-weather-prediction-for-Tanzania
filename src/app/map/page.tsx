"use client";

import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { useApp } from "@/components/Providers";
import { Loader2 } from "lucide-react";

const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-brand" />
    </div>
  ),
});

export default function MapPage() {
  const { lang } = useApp();

  return (
    <div className="min-h-screen">
      <Header />
      <div className="relative h-[calc(100vh-4rem)] w-full">
        <MapView />
        <div className="absolute right-4 top-4 z-[1000] rounded-lg border border-border bg-surface/95 px-3 py-2 text-sm shadow-soft backdrop-blur">
          {lang === "sw" ? "Ramani ya Tanzania" : "Tanzania Weather Map"}
        </div>
      </div>
    </div>
  );
}
