import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        brand: "var(--brand)",
        "brand-2": "var(--brand-2)",
        sky: "var(--sky)",
        sun: "var(--sun)",
        leaf: "var(--leaf)",
        alert: "var(--alert)",
        warn: "var(--warn)",
        border: "var(--border)",
      },
      fontFamily: {
        display: ["Instrument Sans", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06)",
      },
      maxWidth: {
        "7xl": "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
