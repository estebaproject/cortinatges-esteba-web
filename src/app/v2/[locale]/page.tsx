import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { v2Path } from "@/lib/v2/config";
import { getV2T } from "@/lib/v2/i18n";
import V2Hero from "@/components/v2/home/V2Hero";
import V2TrustBar from "@/components/v2/home/V2TrustBar";
import V2Paths from "@/components/v2/home/V2Paths";
import V2Rooms from "@/components/v2/home/V2Rooms";
import V2Families from "@/components/v2/home/V2Families";
import V2Process from "@/components/v2/home/V2Process";
import V2Proof from "@/components/v2/home/V2Proof";
import V2Brands from "@/components/v2/home/V2Brands";
import V2Workshop from "@/components/v2/home/V2Workshop";
import V2ShopTeaser from "@/components/v2/home/V2ShopTeaser";
import V2Stores from "@/components/v2/home/V2Stores";
import V2Faq from "@/components/v2/home/V2Faq";
import V2Closing from "@/components/v2/home/V2Closing";
import V2LocalBusinessSchema from "@/components/v2/V2LocalBusinessSchema";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getV2T(locale, "V2.meta");
  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
  };
}

/**
 * Portada del prototip v2.
 *
 * L'ordre de les seccions és el recorregut de qui compra, no l'organigrama de
 * l'empresa:
 *
 *   què hi ha  →  què encaixa al meu espai  →  quines peces  →  com funciona
 *   →  us puc creure?  →  qui sou  →  on sou  →  em queden dubtes  →  escric
 *
 * La portada actual va per l'altre camí: catàleg, relat de l'empresa, relat de
 * l'empresa un altre cop, serveis, més catàleg, ciutats i dues crides finals
 * que demanen el mateix.
 */
export default async function V2HomePage({ params }: Props) {
  const { locale } = await params;

  return (
    <>
      <V2LocalBusinessSchema url={`${SITE_URL}${v2Path(locale)}`} />

      <V2Hero locale={locale} />
      <V2TrustBar locale={locale} />
      <V2Paths locale={locale} />
      <V2Rooms locale={locale} />
      <V2Families locale={locale} />
      <V2Process locale={locale} />
      <V2Proof locale={locale} />
      <V2Brands locale={locale} />
      <V2Workshop locale={locale} />
      <V2ShopTeaser locale={locale} />
      <V2Stores locale={locale} />
      <V2Faq locale={locale} />
      <V2Closing locale={locale} />
    </>
  );
}
