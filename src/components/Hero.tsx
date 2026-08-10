import Image from "next/image";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { publicPath } from "@/lib/site";

/**
 * Hero de la portada.
 *
 * El text (headline, subheadline i els dos CTA) ja estava redactat i traduït
 * als 4 idiomes al namespace `Hero` de messages/*.json des del commit inicial,
 * però CAP component el consumia: la portada començava directament amb la
 * graella de productes, sense titular ni crida a l'acció a la primera pantalla.
 * Aquest component només connecta contingut que ja existia.
 */
export default async function Hero() {
  const t = await getTranslations("Hero");
  const locale = await getLocale();

  return (
    <section
      className="relative h-[72vh] min-h-[480px] max-h-[760px] flex items-end overflow-hidden"
      aria-label={t("ariaLabel")}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Degradat CONFINAT a la meitat inferior, que és on hi ha el text.
            Abans anava de baix (80%) fins a dalt de tot (10%): tenyia la foto
            sencera per a protegir un text que només ocupa la part baixa, i
            just a la zona alta és on es veu el producte.
            Mesurat: el contrast del titular puja de 4,94:1 a 5,38:1 i el del
            subtítol de 4,68:1 a 5,19:1, i el 28% superior queda net del tot.
            NO es pot resoldre abaixant l'opacitat de tot: amb la capa fluixa
            el text cau a 3,7:1, per sota del mínim AA de 4,5. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 via-50% to-transparent to-72%" />
      </div>

      <div className="relative z-10 max-w-layout mx-auto px-6 lg:px-12 w-full pb-14 md:pb-20">
        <h1 className="font-serif text-display-lg text-canvas max-w-4xl mb-5">
          {t("headline")}
        </h1>
        <p className="font-sans text-body-lg text-canvas/85 max-w-prose-editorial mb-9">
          {t("subheadline")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={publicPath("/demana-pressupost", locale)}
            className="inline-flex items-center justify-center px-8 py-4 bg-sand text-ink font-sans text-body-md font-medium tracking-widest uppercase hover:bg-sand-dark transition-colors"
          >
            {t("ctaPrimary")}
          </Link>
          {/* El CTA secundari apunta a la graella de col·leccions, no a
              contacte: en es/en/fr el text diu literalment "Descubre las
              colecciones" / "Explore our collections" / "Découvrir les
              collections". NOMÉS el català diu "Contacta'ns" — la traducció
              catalana és la que se surt de to i caldria alinear-la. */}
          <Link
            href={`${publicPath("/", locale)}#productes`}
            className="inline-flex items-center justify-center px-8 py-4 border border-canvas/40 text-canvas font-sans text-body-md tracking-widest uppercase hover:bg-canvas hover:text-ink transition-colors"
          >
            {t("ctaSecondary")}
          </Link>
        </div>
      </div>
    </section>
  );
}
