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

        // --- Tema "Kave" (només dins la botiga) -------------------------
        // Clon de la paleta de Kave Home. Prefix kave- per no tocar mai la
        // marca Esteba (ink/sand) de la resta del lloc. La pàgina de tenda
        // és blanca; els "tiles" de foto van sobre gris càlid; els blocs
        // editorials (Sobre el producte) sobre verd sàlvia.
        "kave-bg": "#FFFFFF",       // fons de pàgina de la botiga
        "kave-surface": "#EDEBE6",  // bloc de foto (card media) gris càlid
        "kave-promo": "#E9E6DD",    // barra promo beige
        "kave-sage": "#C7CBB4",     // bloc "Sobre el producte"
        "kave-ink": "#1D1D1B",      // text i botons (gairebé negre)
        "kave-muted": "#6E6E68",    // text secundari
        "kave-faint": "#9A968C",    // text terciari / desactivat
        "kave-line": "#E2DFD8",     // hairlines i vores
        "kave-red": "#C8102E",      // preu rebaixat (vermell)
        "kave-tag": "#C2A468",      // accent (daurat beix clar)

        // --- Tema "v2" (prototip de la web nova, només sota /v2) -----------
        // Prefix v2- per no tocar CAP token de la web actual. La paleta surt
        // dels materials del negoci: lli cru (fons), llana i fusta (superfícies),
        // llautó de les barres de cortina (accent) i el blau Esteba portat a un
        // to més profund perquè aguanti blocs sencers de color.
        "v2-paper": "#FBF8F3",      // fons de pàgina — lli cru, mai blanc pur
        "v2-paper-2": "#F3EDE3",    // seccions alternes
        "v2-linen": "#EAE1D4",      // superfícies i cards
        "v2-bone": "#DAD0C0",       // hairlines i vores
        "v2-ink": "#131E33",        // blau profund — text i blocs foscos
        "v2-ink-2": "#3A4661",      // text secundari
        "v2-ink-3": "#78839A",      // text terciari
        "v2-brass": "#A98A4F",      // accent — llautó de les barres
        "v2-brass-2": "#8B7040",    // accent hover
        "v2-clay": "#96513A",       // alerta / rebaixes, ús molt puntual
        "v2-green": "#25D366",      // WhatsApp
      },
      fontFamily: {
        serif: ["var(--font-archivo-narrow)", "Archivo Narrow", "sans-serif"],
        sans: ["var(--font-roboto)", "Roboto", "system-ui", "sans-serif"],
        // Tipografies del tema Kave (carregades global, usades només a botiga).
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        grotesque: ["var(--font-hanken)", "system-ui", "sans-serif"],
        // Tema v2. Fraunces (serif editorial amb eix òptic) per als titulars i
        // Hanken Grotesk per al text. Substitueix Archivo Narrow + Roboto, que
        // és el pack per defecte de qualsevol plantilla i no diu res de l'ofici.
        "v2-display": ["var(--font-fraunces)", "Georgia", "serif"],
        "v2-sans": ["var(--font-hanken)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.25rem, 3.5vw, 3.5rem)", { lineHeight: "1.12", letterSpacing: "-0.01em" }],
        "display-lg": ["clamp(1.875rem, 2.6vw, 2.75rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(1.375rem, 1.8vw, 1.875rem)", { lineHeight: "1.25", letterSpacing: "-0.005em" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.75" }],
        "body-md": ["1rem", { lineHeight: "1.7" }],
        "body-sm": ["0.875rem", { lineHeight: "1.65" }],
        "eyebrow": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.18em" }],

        // --- Escala del tema v2 --------------------------------------------
        // Molt més contrastada que l'actual (que va de 1,375rem a 3,5rem i fa
        // que titulars i cos es confonguin). Aquí el titular d'obertura arriba
        // a 5,75rem en desktop: la jerarquia es veu abans de llegir.
        "v2-hero": ["clamp(2.75rem, 6.2vw, 5.75rem)", { lineHeight: "0.98", letterSpacing: "-0.025em" }],
        "v2-h1": ["clamp(2.25rem, 4.6vw, 4rem)", { lineHeight: "1.04", letterSpacing: "-0.02em" }],
        "v2-h2": ["clamp(1.75rem, 3.2vw, 2.875rem)", { lineHeight: "1.1", letterSpacing: "-0.018em" }],
        "v2-h3": ["clamp(1.25rem, 1.9vw, 1.625rem)", { lineHeight: "1.22", letterSpacing: "-0.01em" }],
        "v2-lead": ["clamp(1.0625rem, 1.35vw, 1.3125rem)", { lineHeight: "1.6" }],
        "v2-body": ["1.0625rem", { lineHeight: "1.72" }],
        "v2-sm": ["0.9375rem", { lineHeight: "1.6" }],
        "v2-xs": ["0.8125rem", { lineHeight: "1.5" }],
        "v2-eyebrow": ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.22em" }],
      },
      spacing: {
        "section": "6rem",
        "section-sm": "4rem",
        // Tema v2: ritme vertical fluid. La web actual usa 6rem fixos, que en
        // mòbil és massa i en un monitor gran es queda curt.
        "v2-section": "clamp(4.5rem, 9vw, 9rem)",
        "v2-section-sm": "clamp(3rem, 6vw, 5.5rem)",
      },
      maxWidth: {
        "prose-editorial": "68ch",
        // Tope de contingut. Amb `100%` (full width, com estava des de
        // 5189bf4) el contingut s'estirava fins a l'ample del monitor: a
        // 2560px les targetes de categoria feien 813px cadascuna, més amples
        // que TOT el contingut del WordPress que substituïm (que topa a
        // 1200px). No eren només les targetes: ContentRows i ServicesGrid
        // s'estiraven igual.
        //
        // 1280 menys el padding lateral (px-6 lg:px-12 = 96px) deixa 1184px
        // de contingut, pràcticament el mateix que el WordPress.
        "layout": "1280px",

        // Tema v2: més ample que la web actual (1280) perquè la graella
        // editorial necessita aire lateral, però amb gutters grans perquè el
        // text mai s'acosti a la vora.
        "v2-layout": "1440px",
        "v2-prose": "62ch",
        "v2-narrow": "46ch",
      },
      transitionTimingFunction: {
        "editorial": "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
