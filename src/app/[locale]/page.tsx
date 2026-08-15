import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ProductTileGrid from "@/components/ProductTileGrid";
import ArtisanBand from "@/components/ArtisanBand";
import SectionOfici from "@/components/SectionOfici";
import ServicesGrid from "@/components/ServicesGrid";
import ContentRows from "@/components/ContentRows";
import EspaisSection from "@/components/EspaisSection";
import LocationsSection from "@/components/LocationsSection";
import CtaVisita from "@/components/CtaVisita";

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

export default async function HomePage() {
  return (
    <div>
      {/* La franja d'obertura porta el seu propi coixí superior, calculat sobre
          l'alçada real de la capçalera fixa a cada breakpoint. Per això va fora
          del `pt` de sota: si hi entrés, el coixí es comptaria dues vegades. */}
      <Hero />
      <div className="pt-12 md:pt-16">
        <ProductTileGrid />
        <ArtisanBand />
        <SectionOfici />
        <ServicesGrid compact />
        <ContentRows />
        <EspaisSection />
        <LocationsSection />
        <CtaVisita />
      </div>
    </div>
  );
}
