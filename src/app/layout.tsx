import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { BottomNav } from "@/components/BottomNav";
import { FloatingAsk } from "@/components/FloatingAsk";

export const metadata: Metadata = {
  title: "Anga — AI Weather for Tanzania",
  description:
    "Utabiri wa hali ya hewa, kwa akili bandia. Real-time weather, AI insights and alerts for all 31 regions of Tanzania.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Anga",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Anga — AI Weather Tanzania",
    description: "AI-powered weather for Tanzania. English & Kiswahili.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4B3FA8" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0D1C" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-bg text-ink antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
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
