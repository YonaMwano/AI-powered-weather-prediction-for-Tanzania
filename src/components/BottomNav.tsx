"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, MessageCircle, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "./Providers";

const items = [
  { href: "/", icon: Home, labelEn: "Home", labelSw: "Nyumbani" },
  { href: "/map", icon: Map, labelEn: "Map", labelSw: "Ramani" },
  { href: "/ask", icon: MessageCircle, labelEn: "Ask", labelSw: "Uliza" },
  { href: "/alerts", icon: Bell, labelEn: "Alerts", labelSw: "Tahadhari" },
  { href: "/settings", icon: Settings, labelEn: "Settings", labelSw: "Mipangilio" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { lang } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-1.5 text-xs transition-colors",
                active ? "text-brand" : "text-ink-2 hover:text-ink"
              )}
            >
              <Icon size={20} strokeWidth={1.5} />
              <span>{lang === "sw" ? item.labelSw : item.labelEn}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
