import { Region } from "@/types/weather";

export const REGIONS: Region[] = [
  { id: "arusha", name: "Arusha", swName: "Arusha", slug: "arusha", lat: -3.3869, lng: 36.6830, capital: "Arusha" },
  { id: "dar-es-salaam", name: "Dar es Salaam", swName: "Dar es Salaam", slug: "dar-es-salaam", lat: -6.7924, lng: 39.2083, capital: "Dar es Salaam" },
  { id: "dodoma", name: "Dodoma", swName: "Dodoma", slug: "dodoma", lat: -6.1630, lng: 35.7516, capital: "Dodoma" },
  { id: "geita", name: "Geita", swName: "Geita", slug: "geita", lat: -2.8725, lng: 32.2325, capital: "Geita" },
  { id: "iringa", name: "Iringa", swName: "Iringa", slug: "iringa", lat: -7.7681, lng: 35.6861, capital: "Iringa" },
  { id: "kagera", name: "Kagera", swName: "Kagera", slug: "kagera", lat: -1.3312, lng: 31.8126, capital: "Bukoba" },
  { id: "katavi", name: "Katavi", swName: "Katavi", slug: "katavi", lat: -6.3436, lng: 31.0695, capital: "Mpanda" },
  { id: "kigoma", name: "Kigoma", swName: "Kigoma", slug: "kigoma", lat: -4.8769, lng: 29.6267, capital: "Kigoma" },
  { id: "kilimanjaro", name: "Kilimanjaro", swName: "Kilimanjaro", slug: "kilimanjaro", lat: -3.3500, lng: 37.3333, capital: "Moshi" },
  { id: "lindi", name: "Lindi", swName: "Lindi", slug: "lindi", lat: -9.9970, lng: 39.7165, capital: "Lindi" },
  { id: "manyara", name: "Manyara", swName: "Manyara", slug: "manyara", lat: -4.2167, lng: 35.7500, capital: "Babati" },
  { id: "mara", name: "Mara", swName: "Mara", slug: "mara", lat: -1.5000, lng: 33.8000, capital: "Musoma" },
  { id: "mbeya", name: "Mbeya", swName: "Mbeya", slug: "mbeya", lat: -8.9000, lng: 33.4500, capital: "Mbeya" },
  { id: "morogoro", name: "Morogoro", swName: "Morogoro", slug: "morogoro", lat: -6.8278, lng: 37.6591, capital: "Morogoro" },
  { id: "mtwara", name: "Mtwara", swName: "Mtwara", slug: "mtwara", lat: -10.3112, lng: 40.1760, capital: "Mtwara" },
  { id: "mwanza", name: "Mwanza", swName: "Mwanza", slug: "mwanza", lat: -2.5167, lng: 32.9000, capital: "Mwanza" },
  { id: "njombe", name: "Njombe", swName: "Njombe", slug: "njombe", lat: -9.3333, lng: 34.7667, capital: "Njombe" },
  { id: "pwani", name: "Pwani", swName: "Pwani", slug: "pwani", lat: -6.7667, lng: 38.9167, capital: "Kibaha" },
  { id: "rukwa", name: "Rukwa", swName: "Rukwa", slug: "rukwa", lat: -7.9667, lng: 31.6167, capital: "Sumbawanga" },
  { id: "ruvuma", name: "Ruvuma", swName: "Ruvuma", slug: "ruvuma", lat: -10.6833, lng: 35.6500, capital: "Songea" },
  { id: "shinyanga", name: "Shinyanga", swName: "Shinyanga", slug: "shinyanga", lat: -3.6667, lng: 33.4333, capital: "Shinyanga" },
  { id: "simiyu", name: "Simiyu", swName: "Simiyu", slug: "simiyu", lat: -2.8000, lng: 33.9833, capital: "Bariadi" },
  { id: "singida", name: "Singida", swName: "Singida", slug: "singida", lat: -4.8167, lng: 34.7500, capital: "Singida" },
  { id: "songwe", name: "Songwe", swName: "Songwe", slug: "songwe", lat: -9.1000, lng: 32.9000, capital: "Vwawa" },
  { id: "tabora", name: "Tabora", swName: "Tabora", slug: "tabora", lat: -5.0167, lng: 32.8000, capital: "Tabora" },
  { id: "tanga", name: "Tanga", swName: "Tanga", slug: "tanga", lat: -5.0667, lng: 39.1000, capital: "Tanga" },
  { id: "pemba-north", name: "Pemba North", swName: "Pemba Kaskazini", slug: "pemba-north", lat: -5.0555, lng: 39.7292, capital: "Wete" },
  { id: "pemba-south", name: "Pemba South", swName: "Pemba Kusini", slug: "pemba-south", lat: -5.2459, lng: 39.7666, capital: "Chake Chake" },
  { id: "zanzibar-north", name: "Zanzibar North", swName: "Unguja Kaskazini", slug: "zanzibar-north", lat: -5.8800, lng: 39.2700, capital: "Mkokotoni" },
  { id: "zanzibar-south", name: "Zanzibar South", swName: "Unguja Kusini", slug: "zanzibar-south", lat: -6.2000, lng: 39.3000, capital: "Koani" },
  { id: "zanzibar-urban", name: "Zanzibar Urban West", swName: "Mjini Magharibi", slug: "zanzibar-urban", lat: -6.1659, lng: 39.2026, capital: "Zanzibar City" },
];

export function getRegionBySlug(slug: string): Region | undefined {
  return REGIONS.find((r) => r.slug === slug || r.id === slug);
}

export function getRegionById(id: string): Region | undefined {
  return REGIONS.find((r) => r.id === id);
}

export function searchRegions(query: string): Region[] {
  const q = query.toLowerCase().trim();
  if (!q) return REGIONS;
  return REGIONS.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.swName.toLowerCase().includes(q) ||
      r.capital.toLowerCase().includes(q) ||
      r.slug.includes(q)
  );
}

export const DEFAULT_REGION = REGIONS.find((r) => r.slug === "dar-es-salaam")!;
