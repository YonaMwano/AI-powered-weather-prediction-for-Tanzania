"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { REGIONS } from "@/lib/regions";
import { useApp } from "@/components/Providers";
import Link from "next/link";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(REGIONS.map((r) => [r.lat, r.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map]);
  return null;
}

export default function MapView() {
  const { region, setRegion, lang, theme } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Carto dark / light tiles. Token can be used for higher rate limits / proprietary styles.
  const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY || "";
  const isDark = theme === "dark";

  // High-quality Carto basemaps (key improves quotas when present)
  const base = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  const tileUrl = cartoKey ? `${base}?api_key=${cartoKey}` : base;

  return (
    <MapContainer
      center={[-6.5, 35.5]}
      zoom={6}
      className="h-full w-full rounded-none"
      maxBounds={[
        [-12.5, 28.5],
        [-0.5, 41.5],
      ]}
      maxBoundsViscosity={0.85}
      minZoom={5}
      maxZoom={13}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url={tileUrl}
        subdomains="abcd"
        maxZoom={19}
      />
      <FitBounds />
      {REGIONS.map((r) => (
        <Marker
          key={r.id}
          position={[r.lat, r.lng]}
          icon={icon}
          eventHandlers={{
            click: () => setRegion(r),
          }}
        >
          <Popup>
            <div className="min-w-[150px] p-1 text-sm">
              <p className="font-semibold text-gray-900">{r.name}</p>
              <p className="text-xs text-gray-500">{r.swName}</p>
              <p className="mt-1 font-mono text-[10px] text-gray-400">
                {r.lat.toFixed(3)}, {r.lng.toFixed(3)}
              </p>
              <Link
                href={`/region/${r.slug}`}
                className="mt-2 inline-block text-xs font-medium text-indigo-600 hover:underline"
              >
                {lang === "sw" ? "Angalia undani →" : "View details →"}
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
