"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Region } from "@/types/weather";
import { DEFAULT_REGION, REGIONS } from "@/lib/regions";

type Lang = "en" | "sw";
type Theme = "light" | "dark";

interface AppContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  region: Region;
  setRegion: (r: Region) => void;
  unit: "C" | "F";
  setUnit: (u: "C" | "F") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function Providers({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [theme, setTheme] = useState<Theme>("light");
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem("anga-lang") as Lang | null;
    const savedTheme = localStorage.getItem("anga-theme") as Theme | null;
    const savedRegion = localStorage.getItem("anga-region");
    const savedUnit = localStorage.getItem("anga-unit") as "C" | "F" | null;

    if (savedLang) setLang(savedLang);
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
    if (savedRegion) {
      const r = REGIONS.find((x) => x.slug === savedRegion);
      if (r) setRegion(r);
    }
    if (savedUnit) setUnit(savedUnit);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("anga-lang", lang);
    document.documentElement.lang = lang === "sw" ? "sw" : "en";
  }, [lang, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("anga-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("anga-region", region.slug);
  }, [region, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("anga-unit", unit);
  }, [unit, mounted]);

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        theme,
        setTheme,
        region,
        setRegion,
        unit,
        setUnit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within Providers");
  return ctx;
}
