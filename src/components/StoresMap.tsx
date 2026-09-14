import { getLocale, getTranslations } from "next-intl/server";
import { BOTIGUES_AL_MAPA, urlIndicacions } from "@/lib/botigues";
import StoresMapInteractiu, { PIN_PATH, type PinBotiga } from "@/components/StoresMapInteractiu";

/**
 * MAPA DE LES BOTIGUES.
 *
 * DUES FASES, EL MATEIX DIA (14/09/2026):
 *
 * 1. Fora el Google My Maps incrustat, per coses que Google no deixa canviar:
 *    una franja negra amb el nom del compte que havia fet el mapa, un botó de
 *    pantalla completa i un de compartir, i cookies de Google que obligaven a
 *    demanar permís (i qui el negava es quedava sense mapa). Es va substituir
 *    per un dibuix fix de la costa amb tres pins vermells.
 *
 * 2. Amb el dibuix la gent no s'ubicava: calien les carreteres i poder
 *    allunyar-se. Ara el mapa de debò és l'interactiu
 *    (src/components/StoresMapInteractiu.tsx), amb dades d'OpenStreetMap
 *    servides des del nostre domini, zoom i els mateixos pins.
 *
 * El dibuix NO s'ha llençat: és el que es veu mentre l'interactiu carrega i
 * el que es queda si el navegador no el pot pintar. En tots dos casos cada pin
 * obre la ruta a Google Maps igual.
 *
 * EL DIBUIX ÉS ORIENTATIU. La costa són uns trenta punts reals suavitzats. Els
 * pins van en HTML a sobre, en percentatge, perquè a 375px un pin dibuixat a
 * l'SVG quedaria de nou píxels: per això la caixa del dibuix HA DE TENIR la
 * mateixa proporció que el `viewBox`.
 */

/**
 * Finestra geogràfica del mapa: longitud i latitud de les vores.
 *
 * El nord és 42,10 i no 42,08 per Girona: amb 42,08, en un mòbil la zona de
 * toc del pin de Girona (44px) sortia tres píxels per dalt del mapa i quedava
 * retallada. Es mou tota la finestra i no només el pin, perquè el pin ha de
 * caure on és la ciutat.
 */
const OEST = 2.35;
const EST = 3.45;
const SUD = 41.64;
const NORD = 42.1;

/**
 * A 42° de latitud, un grau de longitud és el 74% d'un de latitud. Sense
 * aquesta correcció el dibuix sortiria estirat de costat i la costa semblaria
 * més plana del que és.
 */
const COS_LAT = Math.cos((((NORD + SUD) / 2) * Math.PI) / 180);
const AMPLE = 1000;
const ALT = Math.round((AMPLE * (NORD - SUD)) / ((EST - OEST) * COS_LAT));

const x = (lon: number) => ((lon - OEST) / (EST - OEST)) * AMPLE;
const y = (lat: number) => ((NORD - lat) / (NORD - SUD)) * ALT;

/**
 * La costa, de sud-oest a nord-est: [longitud, latitud]. El primer i l'últim
 * punt cauen fora del marc a posta, perquè la línia entri i surti per la vora
 * i no s'acabi a mig mapa.
 */
const COSTA: [number, number][] = [
  [2.64, 41.608],
  [2.69, 41.626], // Pineda de Mar
  [2.713, 41.636], // Santa Susanna
  [2.741, 41.646], // Malgrat de Mar
  [2.776, 41.657], // la Tordera
  [2.795, 41.673], // Blanes
  [2.806, 41.671], // punta de Santa Anna
  [2.82, 41.683],
  [2.846, 41.699], // Lloret de Mar
  [2.884, 41.707], // Canyelles
  [2.905, 41.708],
  [2.933, 41.719], // Tossa de Mar
  [2.96, 41.735],
  [2.99, 41.755],
  [3.03, 41.78], // Sant Feliu de Guíxols
  [3.056, 41.793], // s'Agaró
  [3.069, 41.817], // Platja d'Aro
  [3.095, 41.838], // Sant Antoni de Calonge
  [3.13, 41.845], // Palamós
  [3.143, 41.855], // la Fosca
  [3.16, 41.87],
  [3.185, 41.888], // Calella de Palafrugell
  [3.194, 41.893], // Llafranc
  [3.207, 41.918], // Tamariu
  [3.218, 41.936], // Aiguablava
  [3.232, 41.957], // cap de Begur
  [3.223, 41.966], // sa Riera
  [3.206, 41.99], // platja de Pals
  [3.197, 42.03],
  [3.2, 42.053], // l'Estartit
  [3.185, 42.12],
];

/**
 * Corba suau per uns punts (Catmull-Rom passada a Bézier cúbiques). Amb
 * segments rectes la costa sortia en dents de serra, i es notava que eren
 * trenta punts; amb la corba es llegeix com una costa.
 */
function corba(punts: [number, number][]): string {
  const p = punts.map(([lon, lat]) => [x(lon), y(lat)] as const);
  const r = (n: number) => Math.round(n * 10) / 10;
  let d = `M${r(p[0][0])},${r(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(i - 1, 0)];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[Math.min(i + 2, p.length - 1)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${r(c1[0])},${r(c1[1])} ${r(c2[0])},${r(c2[1])} ${r(p2[0])},${r(p2[1])}`;
  }
  return d;
}

const LINIA_COSTA = corba(COSTA);
/** La terra: la costa i, per l'altre costat, les dues cantonades de l'oest. */
const TERRA = `${LINIA_COSTA} L${x(2.3)},${y(42.12)} L${x(2.3)},${y(41.58)} Z`;

/** On cau cada botiga. Una mica terra endins de la línia de costa, perquè el pin no quedi al mar. */
const POSICIO: Record<(typeof BOTIGUES_AL_MAPA)[number], { lon: number; lat: number; etiqueta: "esquerra" | "dreta" }> = {
  girona: { lon: 2.8214, lat: 41.9794, etiqueta: "dreta" },
  blanes: { lon: 2.792, lat: 41.679, etiqueta: "esquerra" },
  palamos: { lon: 3.121, lat: 41.852, etiqueta: "esquerra" },
};

/** Vermell dels pins. No és cap token de la marca a posta: un pin ha de destacar sobre el beix. */
const VERMELL_PIN = "#C4312B";

/**
 * EL MAPA DIBUIXAT, ARA COM A RESERVA.
 *
 * Des del 14/09/2026 el mapa de debò és l'interactiu (StoresMapInteractiu), amb
 * carreteres i zoom. Aquest dibuix es queda per a dues coses: és el que es veu
 * mentre l'interactiu es carrega —la llibreria pesa, i en una connexió lenta
 * triga un moment— i és el que es queda si el navegador no pot pintar mapes
 * (sense WebGL, que passa en alguns ordinadors vells o amb l'acceleració
 * gràfica desactivada). En tots dos casos els pins ja funcionen.
 */
function MapaDibuixat({ pins, mar }: { pins: PinBotiga[]; mar: string }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: `${AMPLE} / ${ALT}`, backgroundColor: "#E4E9EE" }}>
      <svg viewBox={`0 0 ${AMPLE} ${ALT}`} className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
        {/* Línies de mar paral·leles a la costa, com a les cartes nàutiques.
            Van ABANS de la terra perquè, si alguna s'hi fica en un cap, la
            terra la tapi. */}
        {[
          { dx: 14, dy: 11, op: 0.16 },
          { dx: 30, dy: 24, op: 0.1 },
          { dx: 50, dy: 40, op: 0.06 },
        ].map((l) => (
          <path key={l.dx} d={LINIA_COSTA} transform={`translate(${l.dx},${l.dy})`} fill="none" stroke="#283649" strokeOpacity={l.op} strokeWidth={1.2} />
        ))}
        <path d={TERRA} fill="#F6F4F0" />
        <path d={LINIA_COSTA} fill="none" stroke="#283649" strokeOpacity={0.45} strokeWidth={1.4} />
        <text
          x={x(3.3)}
          y={y(41.7)}
          textAnchor="middle"
          fill="#283649"
          fillOpacity={0.45}
          fontSize={15}
          letterSpacing={4}
          style={{ fontFamily: "var(--font-archivo), Archivo, system-ui, sans-serif", textTransform: "uppercase" }}
        >
          {mar}
        </text>
      </svg>

      <ul role="list" className="absolute inset-0">
        {pins.map((pin) => (
          <li key={pin.key} className="absolute" style={{ left: `${(x(pin.lon) / AMPLE) * 100}%`, top: `${(y(pin.lat) / ALT) * 100}%` }}>
            <a
              href={pin.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={pin.aria}
              // LA PUNTA DEL PIN HA DE CAURE SOBRE LA BOTIGA, no el centre del
              // conjunt pin + rètol: l'enllaç surt de baix de tot i queda
              // desplaçat mitja zona de toc (22px) cap al costat contrari del
              // rètol, que així creix cap a fora.
              className={`group absolute bottom-0 flex items-end gap-1 ${pin.etiqueta === "esquerra" ? "flex-row-reverse" : "flex-row"}`}
              style={pin.etiqueta === "esquerra" ? { right: "-22px" } : { left: "-22px" }}
            >
              <span className="relative flex h-11 w-11 items-end justify-center">
                <svg viewBox="0 0 24 32" className="h-8 w-6 drop-shadow-[0_2px_2px_rgba(40,54,73,0.35)]" aria-hidden="true">
                  <path d={PIN_PATH} fill={VERMELL_PIN} />
                  <circle cx="12" cy="11.5" r="4.2" fill="#FFFFFF" />
                </svg>
              </span>
              <span className="mb-2.5 whitespace-nowrap bg-canvas/85 px-1.5 py-0.5 font-sans text-[10px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-ink group-hover:underline underline-offset-2">
                {pin.ciutat}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function StoresMap({ className = "" }: { className?: string }) {
  const t = await getTranslations("Locations");
  const locale = await getLocale();

  const pins: PinBotiga[] = BOTIGUES_AL_MAPA.map((key) => {
    const ciutat = t(`stores.${key}.city` as Parameters<typeof t>[0]);
    return { key, ciutat, href: urlIndicacions(key), aria: t("mapaComArribar", { ciutat }), ...POSICIO[key] };
  });

  return (
    <figure className={className}>
      <StoresMapInteractiu
        pins={pins}
        lang={locale}
        colorPin={VERMELL_PIN}
        textos={{
          titol: t("mapaTitol"),
          apropa: t("mapaApropa"),
          allunya: t("mapaAllunya"),
          credits: t("mapaCredits"),
          gestosWindows: t("mapaGestosWindows"),
          gestosMac: t("mapaGestosMac"),
          gestosMobil: t("mapaGestosMobil"),
        }}
      >
        <MapaDibuixat pins={pins} mar={t("mapaMar")} />
      </StoresMapInteractiu>
      <figcaption className="mt-3 font-sans text-body-sm text-ink-muted">{t("mapaPeu")}</figcaption>
    </figure>
  );
}
