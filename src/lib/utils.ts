import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTemp(temp: number, unit: "C" | "F" = "C"): string {
  if (unit === "F") {
    return `${Math.round((temp * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
}

export function windDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export function conditionToIcon(code: number, isDay: boolean): string {
  // WMO weather interpretation codes simplified
  if (code === 0) return isDay ? "sun" : "moon";
  if (code <= 3) return isDay ? "cloud-sun" : "cloud-moon";
  if (code <= 48) return "cloud-fog";
  if (code <= 67) return "cloud-rain";
  if (code <= 77) return "cloud-snow";
  if (code <= 82) return "cloud-drizzle";
  if (code <= 86) return "cloud-snow";
  if (code <= 99) return "cloud-lightning";
  return "cloud";
}
