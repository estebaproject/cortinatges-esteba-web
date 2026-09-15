import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Slider from "@/components/Slider";
import { MIDES_LOGOS } from "@/lib/marques-mides";

/**
 * LA MATEIXA ÀREA PER A TOTS, NO LA MATEIXA CAIXA.
 *
 * Abans cada logo anava dins una caixa de 140x56 amb object-contain. Els
 * fitxers venen del WordPress i cada un porta el seu marge blanc (la tinta
 * ocupa del 8% al 100% del fitxer), i les proporcions van de gairebé quadrat
 * (Ma Salgueiro, 0,8) a tretze vegades més ample que alt (Designers Guild).
 * Resultat: els quadrats semblaven gegants i els allargats, un segell.
 *
 * Ara els logos van retallats fins a la tinta (scripts/marques/retalla-logos.cjs)
 * i cada un es pinta amb la MATEIXA ÀREA: alçada = arrel(ÀREA / proporció).
 * Un logo allargat queda més baix i un de quadrat, més estret, i a la vista
 * pesen igual. Els límits només actuen als extrems: que un quadrat no passi de
 * l'alçada de la franja i que un allargat no surti de la seva columna.
 */
const AREA = 2400;
const ALCADA_MIN = 16;
const ALCADA_MAX = 52;
const AMPLADA_MAX = 140;

function midaVisual(amplada: number, alcada: number) {
  const proporcio = amplada / alcada;
  let h = Math.min(ALCADA_MAX, Math.max(ALCADA_MIN, Math.sqrt(AREA / proporcio)));
  let w = h * proporcio;
  if (w > AMPLADA_MAX) {
    w = AMPLADA_MAX;
    h = w / proporcio;
  }
  return { w: Math.round(w), h: Math.round(h) };
}

// Logos reals de les marques col·laboradores (de la web actual).
const BRANDS = [
  { name: "Aldeco", file: "aldeco.jpg" },
  { name: "Designers Guild", file: "designers_guild.jpg" },
  { name: "Romo", file: "romo.jpg" },
  { name: "Bandalux", file: "bandalux.jpg" },
  { name: "Vertisol", file: "VERTISOL.png" },
  { name: "Froca", file: "froca.jpg" },
  { name: "Graccioza", file: "Graccioza.png" },
  { name: "Kas", file: "kas.jpg" },
  { name: "Sorema", file: "Sorema.jpg" },
  { name: "Bassols", file: "bassols.jpg" },
  { name: "Velfont", file: "velfont.jpg" },
  { name: "Coucke", file: "COUCKE.jpg" },
  { name: "Vivaraise", file: "vivaraise.jpg" },
  { name: "Winkler", file: "WINKLER.jpg" },
  { name: "Universal", file: "UNIVERSAL.png" },
  { name: "Astral", file: "astral.png" },
  { name: "Armura", file: "armura.jpg" },
  { name: "Klinun", file: "klinun.jpg" },
  { name: "Linen-Silk", file: "Linen-Silk.jpg" },
  { name: "Nici", file: "nici.png" },
  { name: "Pepa Pastor", file: "pepa-pastor.jpg" },
  { name: "Piubell", file: "piubell.jpg" },
  { name: "Scenes", file: "scenes.jpg" },
  { name: "B·Sensible", file: "Visensible.png" },
  { name: "Yutes", file: "yutes.jpg" },
  // Recuperada del WordPress: era l'única marca de la seva secció que no
  // teníem al projecte.
  { name: "Ma Salgueiro", file: "ma-salgueiro.jpg" },
];

export default async function BrandsStrip() {
  const t = await getTranslations("HomeGrid");

  return (
    <section className="py-12 md:py-16 bg-canvas border-t border-linen" aria-label={t("brandsHeading")}>
      <div className="max-w-layout mx-auto px-6 lg:px-12">
        <h2 className="text-center font-sans text-eyebrow text-ink-muted uppercase mb-8 md:mb-10">
          {t("brandsHeading")}
        </h2>
        <Slider
          ariaLabel={t("brandsHeading")}
          slideClassName="w-36 sm:w-44"
          items={BRANDS.map((brand) => {
            const m = MIDES_LOGOS[brand.file];
            const { w, h } = midaVisual(m.amplada, m.alcada);
            return (
              <div key={brand.file} className="flex h-14 w-full items-center justify-center">
                <Image
                  src={m.src}
                  alt={brand.name}
                  // Al doble de la mida pintada, perquè a pantalles de retina
                  // el logo no surti borrós.
                  width={w * 2}
                  height={h * 2}
                  style={{ width: w, height: h }}
                  sizes={`${w}px`}
                />
              </div>
            );
          })}
        />
      </div>
    </section>
  );
}
