import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { BottomNav } from "@/components/BottomNav";
import { FloatingAsk } from "@/components/FloatingAsk";

export const metadata: Metadata = {
  title: "Anga — AI Weather for Tanzania",
  description: "Utabiri wa hali ya hewa, kwa akili bandia. Weather prediction powered by AI for all 31 regions of Tanzania.",
  manifest: "/manifest.json",
  themeColor: "#4B3FA8",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Anga",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
      </head>
      <body className="min-h-screen bg-bg text-ink antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1 pb-20 md:pb-6">{children}</main>
            <BottomNav />
            <FloatingAsk />
          </div>
        </Providers>
      </body>
    </html>
  );
}
