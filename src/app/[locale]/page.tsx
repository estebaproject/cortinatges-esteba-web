import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ProductTileGrid from "@/components/ProductTileGrid";
import ServicesGrid from "@/components/ServicesGrid";
import ContentRows from "@/components/ContentRows";
import LocationsSection from "@/components/LocationsSection";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

/**
 * Portada.
 *
 * De nou seccions a sis. Les tres que han marxat i per què:
 *
 * - `ArtisanBand`: 217px per a dues frases, i una era LITERALMENT la mateixa que
 *   `SectionOfici.paragraph2` — el visitant la llegia dues vegades seguides,
 *   perquè les dues seccions anaven una darrere l'altra. El bloc s'ha fos dins
 *   de "El nostre ofici", que ara és qui porta el blau.
 *
 * - `CtaVisita`: 806px, la tercera secció més gran de la portada, per a 66
 *   paraules. Deia el mateix que `LocationsSection`, just a sobre: "vine a
 *   veure'ns" i "demana la teva visita", i totes dues acabaven amb el mateix
 *   botó cap a /botigues. Ara són una sola secció de tancament.
 *
 * - `EspaisSection`: era una fitxa de producte disfressada de secció. El seu
 *   tema, la motorització, ja té pàgina pròpia amb intro, dos paràgrafs i cinc
 *   característiques — molt més del que deien aquí les seves vint paraules.
 *
 * L'ordre també canvia: l'ofici passa DAVANT dels serveis. Abans es deia què
 * fem abans de dir qui som, i costa més comprar un servei a mida de qui encara
 * no saps qui és.
 */
export default async function HomePage() {
  return (
    <div>
      {/* El coixí de dalt és obligatori i no és decoració: la capçalera és fixa
          i OPACA, i sense això la primera fila de categories li quedaria
          al darrere. És la seva alçada real a cada breakpoint més aire — 81px
          en mòbil, 117 a partir de `sm` (hi torna la franja blava) i 161 a
          partir de `md` (s'hi suma la fila de navegació).
          Abans aquesta feina la feia la franja d'obertura amb el seu propi
          coixí; en marxar, passa aquí. */}
      <div className="pt-[97px] sm:pt-[133px] md:pt-[177px]">
        <ProductTileGrid />
        <ServicesGrid compact />
        <ContentRows />
        <LocationsSection />
      </div>
    </div>
  );
}
