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

  // Alçada partida entre mòbil i escriptori. Amb `h-[72vh] min-h-[480px]` per
  // a tothom, en un mòbil el hero es menjava el 72% de la pantalla, i el que
  // manava de debò era el `min-h`: en un iPhone amb la barra de Safari visible
  // (390x664) el 72vh són 478px, o sigui que el terra de 480px decidia
  // l'alçada i abaixar el percentatge sol no hauria fet res.
  //
  // En mòbil ara és `min-h`, no `h`: alçada objectiu del 56%, però la secció
  // pot CRÉIXER si el contingut ho demana. Amb alçada fixa, el titular llarg
  // (francès a 360px, tres línies) sortia per dalt i quedava tapat per la
  // capçalera opaca — mesurat, -70px. Val més un hero una mica més alt en el
  // pitjor cas que un titular mig amagat.
  return (
    <section
      className="relative min-h-[56vh] md:h-[72vh] md:min-h-[480px] md:max-h-[760px] flex items-end overflow-hidden"
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

      {/* El coixí de dalt és el que impedeix que el titular quedi ENDARRERE de
          la capçalera, que és fixa i opaca. No és decoració: és l'alçada real
          de la capçalera a cada breakpoint més 16px d'aire — 81px en mòbil
          (només barra blanca) i 117px a partir de `sm` (hi torna la franja
          blava). A `md` ja no cal, perquè allà el hero té alçada fixa i sobra
          espai de sobres (187px mesurats a 1440).
          Amb això, si el titular creix (el francès passa a tres línies a
          360px), la secció s'estira en lloc de retallar-lo. */}
      <div className="relative z-10 max-w-layout mx-auto px-6 lg:px-12 w-full pt-[97px] sm:pt-[133px] md:pt-0 pb-8 md:pb-20">
        <h1 className="font-serif text-display-lg text-canvas max-w-4xl mb-3 md:mb-5">
          {t("headline")}
        </h1>
        <p className="font-sans text-body-lg text-canvas/85 max-w-prose-editorial mb-6 md:mb-9">
          {t("subheadline")}
        </p>
        {/* En mòbil els dos CTA eren dos botons apilats: 132px a 390px i 160px
            a 360px, el bloc més gros del hero — més que el titular i el
            subtítol junts.
            No es poden posar en fila: les etiquetes són frases, no etiquetes de
            botó ("Descubre las colecciones", "Découvrir les collections"), i a
            360px dos botons de 151px les parteixen en dues línies EN ELS QUATRE
            idiomes. Provat i mesurat.
            Per això en mòbil només el primari és botó, a tot l'ample i en una
            línia; el secundari passa a enllaç subratllat a sota (24px en lloc
            de 64px). No es perd cap de les dues accions. A partir de `sm` els
            dos tornen a ser botons en fila, com sempre. */}
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
              catalana és la que se surt de to i caldria alinear-la. */}
          <Link
            href={`${publicPath("/", locale)}#productes`}
            className="inline-flex items-center justify-center gap-2 py-2 text-body-sm underline underline-offset-4 sm:no-underline sm:px-8 sm:py-4 sm:text-body-md sm:border sm:border-canvas/40 text-canvas font-sans tracking-widest uppercase hover:text-sand sm:hover:bg-canvas sm:hover:text-ink transition-colors"
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
