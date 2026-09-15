"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

/**
 * MAPA INTERACTIU DE LES BOTIGUES: carreteres reals, zoom i desplaçament.
 *
 * Es va demanar el 14/09/2026, després d'haver-lo dibuixat: amb el dibuix la
 * gent no s'ubicava, calien les carreteres i poder allunyar-se com a Google
 * Maps. Però sense tornar enrere en el que ja s'havia guanyat: ni franja amb
 * el nom de qui ha fet el mapa, ni pantalla completa, ni cookies.
 *
 * D'ON SURT CADA COSA — I CAP D'AQUESTES COSES ÉS DE FORA:
 *
 *   - LES DADES són d'OpenStreetMap, en l'extracte de Protomaps del
 *     14/09/2026, amb dos trams: la zona àmplia de Tarragona a la frontera
 *     francesa fins al zoom 9, per allunyar-se i ubicar-se, i les comarques
 *     gironines amb detall al 10 i l'11. Viuen a
 *     /public/mapa/mapa-botigues-20260914.pmtiles, 9,8 MB. El fitxer del món en
 *     fa 138 GB i se'n van baixar només aquestes tessel·les. El navegador en
 *     demana només els trossos que ensenya, per peticions de rang, o sigui que
 *     ningú no es baixa els 9,8 MB.
 *
 *   - EL DETALL arriba fins al zoom 11: autopistes, carreteres principals i
 *     secundàries i tots els pobles. El 12 hi afegia els carrers petits i
 *     doblava el pes. Per als carrers hi ha el pin, que obre Google Maps. A
 *     partir de l'11 el mapa amplia el que té i no perd nitidesa, perquè són
 *     vectors.
 *
 *   - LES LLETRES dels rètols (Noto Sans) són a /public/mapa/fonts.
 *
 *   - L'ESTIL és el "light" de @protomaps/basemaps amb els colors de la casa.
 *
 * Resultat: la pàgina no fa cap petició fora del nostre domini i no desa cap
 * cookie, igual que amb el mapa dibuixat. El rètol de cookies no ha de tornar.
 *
 * LLICÈNCIA. Les dades d'OpenStreetMap són ODbL i obliguen a dir-ho a la
 * vista: per això hi ha "© OpenStreetMap" petit a baix a la dreta. No és el
 * nom de qui ha fet el mapa —que era el que molestava de My Maps—, és una
 * condició de la llicència, i no es pot treure.
 *
 * ACTUALITZAR LES DADES: scripts/mapa/extreu-mapa-botigues.cjs llegeix l'arxiu
 * del món de Protomaps per peticions de rang, en treu només les dues zones i
 * escriu un PMTiles propi. Canviar la data del build, executar-lo, i canviar
 * DADES aquí sota pel nom nou. Un cop l'any n'hi ha prou: les carreteres no
 * canvien cada setmana.
 *
 * GESTOS. El mapa és dins d'una pàgina que es desplaça, i un mapa que es
 * queda el dit atrapa la pàgina. Per això va amb `cooperativeGestures`: al
 * mòbil es mou amb dos dits i a l'ordinador es fa zoom amb Ctrl i la roda,
 * que és el mateix que fa Google Maps quan va incrustat.
 */

export type PinBotiga = {
  key: string;
  ciutat: string;
  href: string;
  aria: string;
  lon: number;
  lat: number;
  etiqueta: "esquerra" | "dreta";
};

type Textos = {
  titol: string;
  apropa: string;
  allunya: string;
  credits: string;
  gestosWindows: string;
  gestosMac: string;
  gestosMobil: string;
};

/** Forma del pin, compartida amb el mapa dibuixat perquè tots dos siguin iguals. */
export const PIN_PATH = "M12 0C5.4 0 0 5.2 0 11.7 0 20.4 12 32 12 32s12-11.6 12-20.3C24 5.2 18.6 0 12 0z";

/**
 * FINS ON ES POT MOURE EL MAPA, I PER QUÈ HI HA DUES ZONES.
 *
 * Les dades tenen dos trams: la zona ÀMPLIA (de Tarragona a la frontera
 * francesa) fins al zoom 9, que és el que es veu en allunyar-se, i les
 * comarques GIRONINES amb detall al 10 i l'11. Si et deixés passejar amb el
 * zoom 11 per Tarragona, allà no hi ha tessel·les i veuries el mapa en blanc.
 * Per això, en passar del zoom 10 el mapa es tanca a la zona de Girona, i en
 * allunyar-te es torna a obrir.
 *
 * Totes dues zones s'estenen cap a l'est més enllà de les dades (fins a 3,9°):
 * allà només hi ha mar, i el fons del mapa és del mateix color que l'aigua, o
 * sigui que no es nota. Sense aquest marge, el mapa no podia centrar-se a les
 * botigues —que són a tocar de la costa— i s'enduia la vista cap a l'interior.
 */
const ZONA_AMPLIA: [[number, number], [number, number]] = [
  [0.4, 40.9],
  [3.9, 42.95],
];
const ZONA_GIRONA: [[number, number], [number, number]] = [
  [1.9, 41.35],
  [3.9, 42.55],
];
/** A partir d'aquí es fan servir les tessel·les del 10, que només hi són per a Girona. */
const ZOOM_DETALL = 9.95;

const DADES = "/mapa/mapa-botigues-20260914.pmtiles";

/**
 * Colors de la casa sobre l'estil "light" de Protomaps. Només es toquen els
 * que fan que el mapa sembli nostre (terra, aigua, rètols); la resta —boscos,
 * parcs, jerarquia de carreteres— es queda com l'ha resolt Protomaps, que està
 * pensat perquè es llegeixi.
 */
const COLORS_CASA = {
  // Terra i aigua. El fons és del color de l'aigua perquè, on no hi ha dades
  // (més enllà de la costa), sembli mar i no un forat.
  background: "#D6DFE8",
  earth: "#F4F1EA",
  water: "#D6DFE8",

  // MENYS VERD. L'estil de base pinta boscos i matolls en verds saturats, i
  // la comarca sencera quedava verda: ni s'assemblava a la casa ni deixava
  // veure les carreteres, que eren el que es buscava. Ara la vegetació és un
  // matís del beix, prou per saber on hi ha bosc i prou poc per no manar.
  wood_a: "#E6E8DA",
  wood_b: "#DCE0CE",
  scrub_a: "#E8E9DC",
  scrub_b: "#DFE2D2",
  park_a: "#E6E8DA",
  park_b: "#D9DECB",
  landcover: {
    grassland: "#EDEEE3",
    barren: "#F2EFE6",
    urban_area: "#ECE7DF",
    farmland: "#EFEEE4",
    glacier: "#FFFFFF",
    scrub: "#EAEBDF",
    forest: "#E3E6D6",
  },

  // CARRETERES QUE ES VEGIN. A la base, autopistes i carreteres són blanques
  // amb una vora gris clar, i sobre el beix gairebé desapareixien. Les
  // autopistes i autovies (AP-7, A-2, C-32) van en un to càlid amb vora
  // marcada, com al mapa de carreteres de tota la vida; les principals (C-65,
  // C-31) en blanc amb una vora que ara sí que es veu.
  highway: "#EDBF7C",
  highway_casing_early: "#C99A5B",
  highway_casing_late: "#C99A5B",
  major: "#FFFFFF",
  major_casing_early: "#BDB2A2",
  major_casing_late: "#BDB2A2",
  link: "#FFFFFF",
  link_casing: "#BDB2A2",
  minor_a: "#FAF8F3",
  minor_b: "#FFFFFF",
  minor_casing: "#D8CFC1",
  boundaries: "#B8AFA0",

  city_label: "#283649",
  city_label_halo: "#F4F1EA",
  subplace_label: "#4a5566",
  subplace_label_halo: "#F4F1EA",
  roads_label_major: "#4a5566",
  roads_label_major_halo: "#FFFFFF",
  roads_label_minor: "#4a5566",
  roads_label_minor_halo: "#FFFFFF",
  ocean_label: "#6B7D8F",
  state_label: "#6B7D8F",
  state_label_halo: "#F4F1EA",
  country_label: "#6B7D8F",
};

/** El pin del mapa interactiu: un enllaç, amb la punta a sota de tot i el rètol al costat. */
function elementPin(pin: PinBotiga, color: string): HTMLElement {
  const a = document.createElement("a");
  a.href = pin.href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.setAttribute("aria-label", pin.aria);
  a.className = "group relative block h-11 w-11";
  a.innerHTML = `
    <svg viewBox="0 0 24 32" class="absolute bottom-0 left-1/2 h-8 w-6 -translate-x-1/2 drop-shadow-[0_2px_2px_rgba(40,54,73,0.35)]" aria-hidden="true">
      <path d="${PIN_PATH}" fill="${color}"/>
      <circle cx="12" cy="11.5" r="4.2" fill="#FFFFFF"/>
    </svg>`;
  // El rètol va fora de la caixa del pin (absolut), perquè la caixa és la que
  // MapLibre ancora pel centre de baix: si hi entrés el rètol, la punta ja no
  // cauria sobre la botiga.
  const r = document.createElement("span");
  r.textContent = pin.ciutat;
  // SEMPRE A LA DRETA, que és on hi ha el mar: les tres botigues són a la
  // costa o a prop, i a l'est no hi ha rètols del mapa per tapar. A l'esquerra,
  // el de Palamós tapava "Cassà de la Selva". (Al mapa dibuixat cadascú té el
  // seu costat, perquè allà la caixa és fixa i s'ha de cabre; aquí no.)
  r.className =
    "pointer-events-none absolute bottom-2.5 left-full ml-0.5 whitespace-nowrap bg-canvas/90 px-1.5 py-0.5 font-sans text-[10px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-ink group-hover:underline underline-offset-2";
  a.appendChild(r);
  return a;
}

export default function StoresMapInteractiu({
  pins,
  lang,
  colorPin,
  textos,
  children,
}: {
  pins: PinBotiga[];
  lang: string;
  colorPin: string;
  textos: Textos;
  /** El mapa dibuixat: el que es veu mentre es carrega i si el navegador no pot pintar el mapa. */
  children: ReactNode;
}) {
  const contenidor = useRef<HTMLDivElement>(null);
  const [llest, setLlest] = useState(false);

  useEffect(() => {
    let cancellat = false;
    let mapa: import("maplibre-gl").Map | undefined;

    const arrenca = async () => {
      // Sense WebGL no hi ha mapa interactiu possible: es queda el dibuixat.
      try {
        const c = document.createElement("canvas");
        if (!(c.getContext("webgl2") || c.getContext("webgl"))) return;
      } catch {
        return;
      }

      const [maplibregl, { Protocol }, { layers, namedFlavor }] = await Promise.all([
        import("maplibre-gl"),
        import("pmtiles"),
        import("@protomaps/basemaps"),
      ]);
      if (cancellat || !contenidor.current) return;

      const origen = window.location.origin;

      // EL "WORKER" DE MAPLIBRE, SERVIT DES DE /public. La llibreria el busca
      // amb `new URL("./maplibre-gl-worker.mjs", import.meta.url)`, i Next no
      // l'empaqueta: la petició tornava un 404 en HTML, el navegador el
      // rebutjava per tipus MIME i el mapa no arribava a carregar mai.
      // Les dues peces (worker i shared) són a /public/mapa/maplibre-<versió>/,
      // copiades de node_modules. SI S'ACTUALITZA maplibre-gl, s'han de tornar
      // a copiar a la carpeta de la versió nova; si no, el mapa interactiu no
      // carrega i es queda el dibuixat, que funciona igual.
      maplibregl.setWorkerUrl(`${origen}/mapa/maplibre-${maplibregl.getVersion()}/maplibre-gl-worker.mjs`);
      maplibregl.addProtocol("pmtiles", new Protocol().tile);

      // Les capes que fan servir icones d'un "sprite" es treuen o s'hi treuen
      // les icones: el sprite viuria en un servidor de fora i no el volem.
      // Les fletxes de sentit únic i els punts d'interès no fan falta per
      // trobar una botiga; als números de carretera (AP-7, C-65) i als pobles
      // només se'ls treu el dibuix del fons i es queden amb el text.
      const capes = layers("protomaps", { ...namedFlavor("light"), ...COLORS_CASA }, { lang })
        .filter((l) => l.id !== "roads_oneway" && l.id !== "pois")
        .map((l) => {
          if (!("layout" in l) || !l.layout) return l;
          const layout = Object.fromEntries(Object.entries(l.layout).filter(([k]) => !k.startsWith("icon-")));
          if (l.id === "roads_shields") {
            return {
              ...l,
              layout: { ...layout, "text-size": 10 },
              paint: { "text-color": "#283649", "text-halo-color": "#FFFFFF", "text-halo-width": 1.6 },
            };
          }
          return { ...l, layout };
        }) as import("maplibre-gl").LayerSpecification[];

      const botigues: [[number, number], [number, number]] = [
        [Math.min(...pins.map((p) => p.lon)), Math.min(...pins.map((p) => p.lat))],
        [Math.max(...pins.map((p) => p.lon)), Math.max(...pins.map((p) => p.lat))],
      ];
      // Marge al voltant de les botigues en la vista inicial. Dalt n'hi ha més
      // perquè el pin fa 44px i sobresurt cap amunt del punt; a la dreta, perquè
      // hi van els rètols. Amb 56 a dalt, el pin de Girona tocava la vora.
      const MARGE = { top: 80, bottom: 44, left: 56, right: 120 };

      const m = new maplibregl.Map({
        container: contenidor.current,
        style: {
          version: 8,
          glyphs: `${origen}/mapa/fonts/{fontstack}/{range}.pbf`,
          sources: {
            protomaps: {
              type: "vector",
              url: `pmtiles://${origen}${DADES}`,
              attribution: '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap</a>',
            },
          },
          layers: capes,
        },
        bounds: botigues,
        fitBoundsOptions: { padding: MARGE },
        maxZoom: 14,
        renderWorldCopies: false,
        cooperativeGestures: true,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        attributionControl: false,
        locale: {
          "Map.Title": textos.titol,
          "NavigationControl.ZoomIn": textos.apropa,
          "NavigationControl.ZoomOut": textos.allunya,
          "AttributionControl.ToggleAttribution": textos.credits,
          "CooperativeGesturesHandler.WindowsHelpText": textos.gestosWindows,
          "CooperativeGesturesHandler.MacHelpText": textos.gestosMac,
          "CooperativeGesturesHandler.MobileHelpText": textos.gestosMobil,
        },
      });
      mapa = m;
      m.touchZoomRotate.disableRotation();

      // Només els botons de zoom. Ni brúixola (el mapa no gira), ni pantalla
      // completa, que és el que es va demanar treure.
      m.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      m.addControl(new maplibregl.AttributionControl({ compact: false }), "bottom-right");

      for (const pin of pins) {
        new maplibregl.Marker({ element: elementPin(pin, colorPin), anchor: "bottom" })
          .setLngLat([pin.lon, pin.lat])
          .addTo(m);
      }

      // En desenvolupament, que es vegi per què no carrega. En producció el
      // mapa que falla es queda amb el dibuixat, sense soroll a la consola.
      if (process.env.NODE_ENV !== "production") m.on("error", (e) => console.error("[mapa botigues]", e.error ?? e));

      // Es tanca a Girona en apropar-se i s'obre en allunyar-se (el perquè, a
      // ZONA_AMPLIA). Només es crida quan es creua el llindar, no a cada pas.
      let detall: boolean | null = null;
      const ajustaLimits = () => {
        const ara = m.getZoom() >= ZOOM_DETALL;
        if (ara === detall) return;
        detall = ara;
        m.setMaxBounds(ara ? ZONA_GIRONA : ZONA_AMPLIA);
      };
      m.on("zoom", ajustaLimits);

      m.once("load", () => {
        if (cancellat) return;
        // Es torna a encaixar la vista a les botigues un cop carregat, per
        // seguretat: si en construir el mapa la caixa encara no tenia la mida
        // definitiva, l'encaix del constructor queda malament. Fins que no
        // carrega el mapa és invisible (es veu el dibuixat), o sigui que aquí
        // no hi ha cap salt que ningú vegi. Els límits van després.
        m.resize();
        const camera = m.cameraForBounds(botigues, { padding: MARGE });
        if (camera) m.jumpTo(camera);
        ajustaLimits();
        setLlest(true);
      });
    };
    const arrencaSegur = () => {
      if (cancellat) return;
      arrenca().catch((e) => {
        // Si la llibreria o les dades fallen, es queda el dibuixat, que funciona.
        if (process.env.NODE_ENV !== "production") console.error("[mapa botigues]", e);
      });
    };

    // EL MAPA ARRENCA TARD, A POSTA. MapLibre pesa: en un mòbil, analitzar-lo i
    // posar-lo en marxa són més de mig segon de feina seguida al fil principal.
    // Si arrencava en muntar-se, aquesta feina queia just quan el navegador havia
    // de pintar el títol, i Lighthouse mesurava el títol de /botigues a 4,1 s
    // (3,4 s d'espera només per pintar) i un rendiment de 63. El títol no té res
    // a veure amb el mapa; simplement no li deixava lloc.
    //
    // Ara s'espera tres coses, per ordre: que la pàgina hagi acabat de
    // carregar, que el mapa sigui a prop de la pantalla i que el navegador
    // estigui lliure. Mentrestant es veu el mapa dibuixat, amb els pins que ja
    // funcionen, o sigui que ningú no espera res per trobar una botiga.
    let observador: IntersectionObserver | undefined;
    let idle: number | undefined;
    let temporitzador: ReturnType<typeof setTimeout> | undefined;
    const quanLliure = () => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) idle = ric(arrencaSegur, { timeout: 2500 });
      else temporitzador = setTimeout(arrencaSegur, 1200);
    };
    const despresDeCarregar = () => {
      if (cancellat || !contenidor.current) return;
      observador = new IntersectionObserver(
        (entrades) => {
          if (entrades.some((e) => e.isIntersecting)) {
            observador?.disconnect();
            quanLliure();
          }
        },
        { rootMargin: "300px" },
      );
      observador.observe(contenidor.current);
    };
    if (document.readyState === "complete") despresDeCarregar();
    else window.addEventListener("load", despresDeCarregar, { once: true });

    return () => {
      cancellat = true;
      observador?.disconnect();
      window.removeEventListener("load", despresDeCarregar);
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (idle !== undefined && cic) cic(idle);
      if (temporitzador) clearTimeout(temporitzador);
      mapa?.remove();
    };
  }, [pins, lang, colorPin, textos]);

  return (
    <div className="mapa-botigues relative w-full overflow-hidden border border-linen bg-[#F4F1EA] aspect-[4/3] sm:aspect-[16/9]">
      {!llest && <div className="absolute inset-0 flex items-center">{children}</div>}
      {/* DUES CAIXES, I CAL QUE SIGUIN DUES. MapLibre posa la classe
          `maplibregl-map` al contenidor, i el seu CSS hi posa
          `position: relative`. Si el contenidor fos directament l'`absolute
          inset-0`, aquell `relative` el trepitjava: la caixa es quedava amb 0
          píxels d'alt, el mapa calculava l'encaix amb aquesta mida i arrencava
          a zoom 8,6 i centrat a Santa Coloma de Farners en lloc de a les
          botigues (mesurat a Chrome: 1182x0 en carregar). La de fora la
          posicionem nosaltres; la de dins és de MapLibre i hi pot fer el que
          vulgui, perquè només demana ocupar-la tota. */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${llest ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div ref={contenidor} className="h-full w-full" />
      </div>
    </div>
  );
}
