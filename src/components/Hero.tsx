import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { publicPath } from "@/lib/site";

/**
 * Franja d'obertura de la portada.
 *
 * Torna, però compacta. La primera versió tenia foto d'ambient genèrica i es
 * menjava el 52% de la pantalla en mòbil; la segona, ja sense foto, encara en
 * gastava 442px abans d'arribar a cap producte. Aquesta va a l'os: titular,
 * una línia i una acció.
 *
 * Té dues feines que abans estaven repartides:
 *
 * 1. El TITULAR torna a ser visible. Quan es va treure la franja, l'h1 va
 *    quedar amagat amb `sr-only` dins de la graella, i el titular és
 *    justament on es diu que aquí es fa més que cortines — tendals, tapisseria,
 *    tèxtil de la llar. Amagat el llegia Google i no el client.
 *
 * 2. Porta el CONTACTE a dalt de tot. Fins ara la primera manera de contactar
 *    apareixia al final de la pàgina, a 6.000px de scroll en mòbil, o al menú
 *    darrere d'un toc.
 *
 * El coixí superior no és decoració: és l'alçada real de la capçalera fixa i
 * opaca a cada breakpoint més aire (81px en mòbil, 117 des de `sm` quan torna
 * la franja blava, 161 des de `md` amb la fila de navegació). Aquesta feina la
 * feia la graella mentre la franja no hi era.
 */
export default async function Hero() {
  const t = await getTranslations("Hero");
  const locale = await getLocale();

  return (
    <section
      className="bg-canvas-warm pt-[97px] sm:pt-[133px] md:pt-[177px] pb-8 md:pb-10"
      aria-label={t("ariaLabel")}
    >
      <div className="max-w-layout mx-auto px-6 lg:px-12">
        <div className="md:flex md:items-end md:justify-between md:gap-10">
          <div className="md:max-w-3xl">
            <h1 className="font-serif text-display-md text-ink mb-2">
              {t("headline")}
            </h1>
            <p className="font-sans text-body-md text-ink-muted max-w-prose-editorial">
              {t("subheadline")}
            </p>
          </div>
          {/* En escriptori el botó va a la dreta, a la mateixa línia de base que
              el text: així la franja es queda en una sola banda i no suma
              alçada. En mòbil cau a sota, a tot l'ample. */}
          <Link
            href={publicPath("/demana-pressupost", locale)}
            className="mt-5 md:mt-0 w-full md:w-auto shrink-0 inline-flex items-center justify-center px-8 py-4 bg-sand text-ink font-sans text-body-md font-medium tracking-widest uppercase hover:bg-sand-dark transition-colors"
          >
            {t("ctaPrimary")}
          </Link>
        </div>
      </div>
    </section>
  );
}
