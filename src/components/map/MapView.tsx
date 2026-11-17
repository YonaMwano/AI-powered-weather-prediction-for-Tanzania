"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { REGIONS } from "@/lib/regions";
import { useApp } from "@/components/Providers";
import Link from "next/link";

// Fix default marker icons
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
    const bounds = L.latLngBounds(REGIONS.map((r) => [r.lat, r.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map]);
  return null;
}

export default function MapView() {
  const { region, setRegion, lang } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <MapContainer
      center={[-6.5, 35.5]}
      zoom={6}
      className="h-full w-full"
      maxBounds={[
        [-12.5, 28.5],
        [-0.5, 41.5],
      ]}
      maxBoundsViscosity={0.8}
      minZoom={5}
      maxZoom={12}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
            <div className="min-w-[140px] text-sm">
              <p className="font-semibold">{r.name}</p>
              <p className="text-xs text-gray-500">{r.swName}</p>
              <Link
                href={`/region/${r.slug}`}
                className="mt-2 inline-block text-xs font-medium text-indigo-600"
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
