import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { publicPath } from "@/lib/site";

/**
 * Franja d'obertura de la portada.
 *
 * Torna, però compacta. La primera versió tenia foto d'ambient genèrica i es
 * menjava el 52% de la pantalla en mòbil; la segona, ja sense foto, encara en
 * gastava 442px abans d'arribar a cap producte. Aquesta va a l'os: titular
 * i acció, res més.
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
        <div className="flex flex-col items-center text-center">
          <div className="max-w-3xl">
            {/* Sense subtítol. Deia "Prenem mides a casa teva i t'assessorem.
                Producte a mida, fabricat i instal·lat per nosaltres." — que és
                exactament el que expliquen, i millor, les quatre icones de just
                a sota: presa de mides, confecció pròpia, instal·lació pròpia.
                Dir-ho en prosa i tot seguit en icones és dir-ho dues vegades, i
                la primera empenyia la segona avall.
                La frase no es perd: segueix sent la meta-descripció de la
                portada, que és on treballa de debò.

                `text-balance` reparteix les paraules entre les dues línies en
                lloc d'omplir la primera i deixar-ne una de curta a sota. Amb el
                text centrat això es veu: sense equilibrar, el francès deixava
                "chez vous." sol a la segona línia. On el navegador no ho
                entengui, es parteix com sempre — no hi ha res a perdre. */}
            <h1 className="font-serif text-display-md text-ink text-balance">
              {t("headline")}
            </h1>
            {/* TORNA UN SUBTÍTOL, i el comentari de dalt explica per què n'hi
                havia hagut un i es va treure. Aquest no és aquell: allò eren
                dues frases de prosa que repetien el que diuen les quatre icones
                de sota i les empenyien avall. Això és la cua del titular
                d'abans —"instal·lat a casa teva"— separada perquè el titular
                es quedi amb la proposta i el detall vagi a part.

                Segueix el patró de subtítol de la casa (/serveis, /nosaltres i
                les fitxes): `font-sans text-body-lg text-ink-muted`. */}
            <p className="font-sans text-body-lg text-ink-muted mt-3 text-balance">
              {t("subheadline")}
            </p>
          </div>
          {/* El botó ara va SOTA el titular i centrat, no a la dreta.
              Això suma alçada a la franja — l'amplada de la fila la marcava el
              botó, i ara la marca la línia de text — i és el preu acceptat per
              tenir-ho tot en un eix.

              Conserva els 44px d'alçada tocable via `min-h` i s'ajusta al seu
              contingut: en mòbil era `w-full` i feia 272x59 a 320px, o sigui
              16.099px² contra els 4.358 del logo. El botó pesava 3,7 vegades
              més que la marca. */}
          <Link
            href={publicPath("/demana-pressupost", locale)}
            className="mt-5 md:mt-7 inline-flex min-h-[44px] items-center justify-center px-5 py-3 md:px-8 md:py-4 bg-sand text-ink font-sans text-xs md:text-body-md font-medium tracking-widest uppercase hover:bg-sand-dark transition-colors"
          >
            {t("ctaPrimary")}
          </Link>
        </div>
      </div>
    </section>
  );
}
