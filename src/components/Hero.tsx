import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { publicPath } from "@/lib/site";

/**
 * Obertura de la portada.
 *
 * Ja no és un hero amb foto. Era una imatge d'ambient genèrica, i una foto
 * genèrica en un negoci que ven feina a mida no diu res: sembla plantilla.
 * A més s'hi acumulaven dos problemes que no tenien sortida amb CSS. La
 * capçalera és fixa i OPACA i en tapava els 161px de dalt (el 25% del hero en
 * escriptori), de manera que el degradat gastava la seva part transparent en
 * píxels que no es veien: la franja neta i visible eren 20px mesurats. I amb
 * `object-cover` centrat, el retall es menjava 160px de dalt de la foto, que és
 * on hi havia els estors — el que quedava a la vista era la taula i el terra.
 *
 * Ara és una franja de text i prou: titular, subtítol i les dues accions, sobre
 * el fons càlid del lloc. Ocupa el mínim i deixa passar de seguida a les
 * categories, que és el que el visitant ha vingut a veure.
 *
 * El coixí de dalt segueix sent obligatori i no és decoració: és l'alçada real
 * de la capçalera fixa a cada breakpoint més aire (81px en mòbil, 117 a partir
 * de `sm` quan torna la franja blava, 161 a partir de `md` quan s'hi suma la
 * fila de navegació). Sense això el titular queda darrere la capçalera.
 */
export default async function Hero() {
  const t = await getTranslations("Hero");
  const locale = await getLocale();

  return (
    <section
      className="bg-canvas-warm pt-[97px] sm:pt-[133px] md:pt-[177px] pb-10 md:pb-14"
      aria-label={t("ariaLabel")}
    >
      <div className="max-w-layout mx-auto px-6 lg:px-12">
        <h1 className="font-serif text-display-lg text-ink max-w-4xl mb-3 md:mb-4">
          {t("headline")}
        </h1>
        <p className="font-sans text-body-lg text-ink-muted max-w-prose-editorial mb-6 md:mb-8">
          {t("subheadline")}
        </p>

        {/* En mòbil els dos CTA no poden anar en fila: les etiquetes són frases,
            no etiquetes de botó ("Descubre las colecciones", "Découvrir les
            collections"), i a 360px dos botons de 151px les parteixen en dues
            línies EN ELS QUATRE idiomes. Provat i mesurat.
            Per això en mòbil el primari és botó a tot l'ample i en una línia, i
            el secundari passa a enllaç subratllat a sota. A partir de `sm` els
            dos tornen a ser botons en fila. */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Link
            href={publicPath("/demana-pressupost", locale)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-sand text-ink font-sans text-body-md font-medium tracking-widest uppercase hover:bg-sand-dark transition-colors"
          >
            {t("ctaPrimary")}
          </Link>
          {/* El CTA secundari apunta a la graella de col·leccions, no a
              contacte: en es/en/fr el text diu literalment "Descubre las
              colecciones" / "Explore our collections" / "Découvrir les
              collections". NOMÉS el català diu "Contacta'ns" — la traducció
              catalana és la que se surt de to i caldria alinear-la.

              Els colors passen de clars a foscos: abans anaven sobre una foto
              amb degradat i ara van sobre el fons càlid del lloc. Amb
              `text-canvas` serien blancs sobre beix i no es veurien. */}
          <Link
            href={`${publicPath("/", locale)}#productes`}
            className="inline-flex items-center justify-center gap-2 py-2 text-body-sm underline underline-offset-4 sm:no-underline sm:px-8 sm:py-4 sm:text-body-md sm:border sm:border-ink/25 text-ink font-sans tracking-widest uppercase hover:text-accent-deep sm:hover:bg-ink sm:hover:text-canvas transition-colors"
          >
            {t("ctaSecondary")}
            {/* Fletxa decorativa, només en mòbil: allà el secundari ja no té
                caixa i la fletxa és el que el fa llegir com a acció i no com a
                text solt. `aria-hidden` perquè no s'afegeix res a l'etiqueta
                traduïda — el lector de pantalla llegeix el mateix de sempre. */}
            <span aria-hidden="true" className="sm:hidden">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
