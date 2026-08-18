import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { publicPath } from "@/lib/site";

const TOWN_KEYS = ["girona", "blanes", "palamos"] as const;

/**
 * Secció de tancament de la portada: botigues i crida a l'acció, juntes.
 *
 * Abans eren dues seccions seguides que deien el mateix. Aquesta obria amb
 * "Vine a veure'ns. Parlem del teu espai." i acabava amb un botó cap a
 * /botigues; la de sota (`CtaVisita`, 806px per a 66 paraules, la tercera més
 * gran de la portada) obria amb "Demana la teva visita. T'assessorem a casa o a
 * la botiga." i acabava amb DOS botons, un d'ells el mateix cap a /botigues.
 * De fet aquesta secció ja tirava del namespace `CtaVisita` per al seu botó.
 *
 * Ara és una sola secció: el titular de la crida, els tres pobles com a prova
 * que hi ha botiga de veritat, i les dues accions. El titular de `Locations`
 * no es perd: segueix encapçalant la pàgina /botigues.
 */
export default async function LocationsSection() {
  const t = await getTranslations("Locations");
  const tv = await getTranslations("CtaVisita");
  const locale = await getLocale();

  const towns = TOWN_KEYS.map((k) =>
    t(`stores.${k}.city` as Parameters<typeof t>[0]),
  ).join(" · ");

  return (
    <section className="py-section bg-accent-deep text-center" aria-label={tv("ariaLabel")}>
      <div className="max-w-layout mx-auto px-6 lg:px-12">
        <p className="font-sans text-body-sm text-accent-light tracking-widest uppercase mb-4">
          {tv("eyebrow")}
        </p>
        <h2 className="font-serif text-display-lg text-canvas max-w-2xl mx-auto mb-5">
          {tv("headline")}
        </h2>
        <p className="font-sans text-body-lg text-canvas/70 max-w-prose-editorial mx-auto mb-6">
          {tv("body")}
        </p>
        {/* Els tres pobles: no és decoració, és la prova que hi ha botiga on
            anar. Va en serif i amb separadors per a llegir-se d'un cop, no com
            una llista. */}
        <p className="font-serif text-display-md text-canvas/90 mb-10">{towns}</p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href={publicPath("/contacte", locale)}
            className="inline-flex items-center justify-center px-10 py-4 bg-canvas text-ink font-sans text-body-md font-medium hover:bg-accent-light transition-colors"
          >
            {tv("ctaPrimary")}
          </Link>
          <Link
            href={publicPath("/botigues", locale)}
            className="inline-flex items-center justify-center px-10 py-4 border border-canvas/40 text-canvas font-sans text-body-md hover:border-canvas hover:bg-canvas/10 transition-colors"
          >
            {tv("ctaSecondary")}
          </Link>
        </div>

        <p className="mt-8 font-sans text-body-sm text-canvas/50">{tv("disclaimer")}</p>
      </div>
    </section>
  );
}
