import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Hero from "@/components/Hero";
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
      {/* La franja d'obertura porta el seu propi coixí superior, calculat sobre
          l'alçada real de la capçalera fixa a cada breakpoint. Per això va fora
          del `pt` de sota: si hi entrés, el coixí es comptaria dues vegades. */}
      <Hero />
      <div className="pt-10 md:pt-12">
        <ProductTileGrid />
        <ServicesGrid compact />
        <ContentRows />
        <LocationsSection />
      </div>
    </div>
  );
}
