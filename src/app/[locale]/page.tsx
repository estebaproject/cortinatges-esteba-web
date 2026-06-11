import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ProductTileGrid from "@/components/ProductTileGrid";
import ArtisanBand from "@/components/ArtisanBand";
import ServicesGrid from "@/components/ServicesGrid";
import ReelsSection from "@/components/ReelsSection";
import ContentRows from "@/components/ContentRows";
import BrandsStrip from "@/components/BrandsStrip";
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
    <div className="pt-32 md:pt-40">
      <ProductTileGrid />
      <ArtisanBand />
      <ServicesGrid compact />
      <ReelsSection />
      <ContentRows />
      <BrandsStrip />
      <EspaisSection />
      <LocationsSection />
      <CtaVisita />
    </div>
  );
}
