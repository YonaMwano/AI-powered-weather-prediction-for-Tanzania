"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useApp } from "./Providers";

export function FloatingAsk() {
  const pathname = usePathname();
  const { lang } = useApp();

  if (pathname === "/ask") return null;

  return (
    <Link
      href="/ask"
      className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-soft transition-transform hover:scale-105 active:scale-95 md:bottom-8 md:right-8"
      aria-label={lang === "sw" ? "Uliza Anga" : "Ask Anga"}
    >
      <MessageCircle size={24} strokeWidth={1.5} />
    </Link>
  );
}
