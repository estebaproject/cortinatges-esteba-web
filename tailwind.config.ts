import type { Config } from "tailwindcss";

/**
 * El gris blavós del text secundari. Un de sol, no dos.
 *
 * Fins ara n'hi havia DOS nivells, `ink-muted` (#67768E) i `ink-faint`
 * (#9AA3B2), i cap dels dos arribava a AA on més falta feia. Mesurat al DOM de
 * 23 pàgines de producció, aquests dos tokens només cauen sobre TRES fons, els
 * tres clars —blanc, `canvas-warm` i `sand`— i sobre cap fons fosc:
 *
 *     ink-faint sobre canvas-warm .... 2,32:1   ← els horaris de /botigues
 *     ink-faint sobre blanc .......... 2,54:1   ← els horaris de /contacte
 *     ink-muted sobre sand ........... 2,75:1
 *     ink-muted sobre canvas-warm .... 4,19:1
 *     ink-muted sobre blanc .......... 4,61:1   ← l'única que ja passava
 *
 * PER QUÈ ES COL·LAPSEN EN UN. Perquè `ink-faint` passés 4,5:1 sobre blanc
 * havia d'arribar a #707782, que és pràcticament l'`ink-muted` d'aleshores
 * (#67768E). Dos tokens que convergeixen al mateix valor no són dos nivells:
 * AA sobre fons clar no deixa prou recorregut de lluminositat per a dos grisos
 * que es distingeixin. En aquest web la jerarquia ja la fan la mida i les
 * majúscules, no el to del gris.
 *
 * SI ALGÚ VOL RECUPERAR DOS NIVELLS, que sigui per MIDA o per PES, no per
 * lluminositat. Per lluminositat ja s'ha provat i el resultat és aquest.
 *
 * EL SAND ÉS QUI MARCA EL MÍNIM. Aquest valor és el més clar que encara passa
 * 4,5:1 sobre els tres fons, i sobre el `sand` (#d3c7ad) es queda en 4,51 —
 * marge de 0,01. Sobre blanc dona 7,55 i sobre `canvas-warm` 6,87, o sigui que
 * els altres dos van sobradíssims i el beige és l'únic que aprieta. SI ES
 * TORNA A TOCAR EL `sand`, AQUEST VALOR S'HA DE RECALCULAR: no hi ha marge per
 * absorbir cap desplaçament del beige.
 *
 * (De passada: `accent-light` tenia el MATEIX hex que l'`ink-muted` vell i ara
 * divergeixen. No és un descuit. Aquell només pinta el fons de `::selection` a
 * globals.css, amb text blanc a sobre, i no té res a veure amb el text
 * secundari — que compartissin valor era casualitat.)
 */
const INK_MUTED = "#4a5566";

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
        // Paleta de la marca, presa de Colors.pdf de la guia d'Esteba.
        // Abans aquí hi havia els colors trets a ull del WordPress antic:
        // ink era #132C55 i sand #CBBBA0. Cap dels dos era el de la marca —
        // ΔE2000 de 7,77 al blau i 3,38 al beige. Per damunt de 5 ja no és
        // un matís, són colors diferents.
        ink: "#283649",          // BLAU · Pantone 2380 C
        sand: "#d3c7ad",         // BEIGE · Pantone Putty
        // La marca també té un TERRA (#724735, Pantone 7588 C) que aquí no
        // es fa servir enlloc. No s'afegeix com a token fins que tingui feina.

        // `accent-deep` ÉS l'ink, no un color a part: han d'anar sempre
        // junts o queden dos blaus gairebé iguals però diferents. (De pas:
        // com que valen el mateix, els `bg-accent-deep hover:bg-ink` que hi
        // ha per aquí no fan res. Ve d'abans; no es toca en aquesta ronda.)
        "accent-deep": "#283649",

        // Els dos beiges de hover, desplaçats el mateix que el sand perquè
        // el salt es mantingui: ΔE 8,5 cap al clar i 6,4 cap al fosc, contra
        // els 8,6 i 6,5 d'abans. Si es deixessin quiets, el hover clar es
        // quedava en 4,7 — la meitat de visible.
        "sand-dark": "#c4b699",
        "sand-light": "#e4dcc9",

        // Enfosquiment per al hover dels botons blaus. Era #1F2D52, que
        // contra l'ink vell donava ΔE 3,4 (gairebé invisible); contra el blau
        // nou en donaria 13,3, i cap a un blau MÉS saturat: es llegiria com
        // una errada de color, no com un estat. Ara és el blau de marca al
        // 80% de lluminositat: ΔE 5,4, i segueix sent un enfosquiment.
        "ink-deep": "#202B3A",

        // Gris blavós del text secundari. Els DOS nivells que hi havia s'han
        // col·lapsat en un: el perquè, els números i què fer si es torna a
        // tocar el `sand` són a la capçalera del fitxer, a INK_MUTED.
        //
        // `ink-faint` és un ÀLIES, no una còpia: apunta a la mateixa constant
        // perquè no puguin divergir mai. Es manté el nom viu a posta, per no
        // haver de tocar les 22 ocurrències repartides per 11 fitxers — i
        // perquè el dia que es vulgui tornar a tenir un segon nivell, el ganxo
        // ja hi és (però per mida o pes, no per to).
        "ink-muted": INK_MUTED,
        "ink-faint": INK_MUTED,
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
      },
      fontFamily: {
        // Els dos tokens apunten a la MATEIXA família, l'Archivo. Es conserven
        // els noms `serif` i `sans` per no haver de tocar les centenars de
        // classes `font-serif`/`font-sans` escampades pel projecte — però ja
        // no distingeixen família, sinó intenció: `font-serif` és titular i
        // `font-sans` és text corrent. La diferència la fan el pes i la mida.
        // (El nom `serif` ja mentia abans: hi havia una Archivo Narrow, que
        // de serif no en té res.)
        serif: ["var(--font-archivo)", "Archivo", "system-ui", "sans-serif"],
        sans: ["var(--font-archivo)", "Archivo", "system-ui", "sans-serif"],
        // Tipografies del tema Kave (carregades global, usades només a botiga).
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        grotesque: ["var(--font-hanken)", "system-ui", "sans-serif"],
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
      },
      transitionTimingFunction: {
        "editorial": "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
