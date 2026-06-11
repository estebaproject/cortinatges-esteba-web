import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FFFFFF",
        "canvas-warm": "#F6F4F0",
        // Paleta real de cortinatgesesteba.com
        ink: "#132C55",          // blau marí (capçalera, peu, titulars)
        "ink-deep": "#1F2D52",
        "ink-muted": "#67768E",  // gris blavós (text secundari)
        "ink-faint": "#9AA3B2",
        sand: "#CBBBA0",         // bloc arena dels productes
        "sand-dark": "#BCAA8C",
        "sand-light": "#DCD0BC",
        "accent-deep": "#132C55",
        "accent-light": "#67768E",
        "linen": "#E8E3DA",
        "linen-dark": "#D5CDBF",
        "stone-warm": "#BCAA8C",
      },
      fontFamily: {
        serif: ["var(--font-archivo-narrow)", "Archivo Narrow", "sans-serif"],
        sans: ["var(--font-roboto)", "Roboto", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.25rem, 3.5vw, 3.5rem)", { lineHeight: "1.12", letterSpacing: "-0.01em" }],
        "display-lg": ["clamp(1.875rem, 2.6vw, 2.75rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(1.375rem, 1.8vw, 1.875rem)", { lineHeight: "1.25", letterSpacing: "-0.005em" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.75" }],
        "body-md": ["1rem", { lineHeight: "1.7" }],
        "body-sm": ["0.875rem", { lineHeight: "1.65" }],
        "eyebrow": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.18em" }],
      },
      spacing: {
        "section": "6rem",
        "section-sm": "4rem",
      },
      maxWidth: {
        "prose-editorial": "68ch",
        "layout": "1440px",
      },
      transitionTimingFunction: {
        "editorial": "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
