import type { Metadata } from "next";
import LegalDocView from "@/components/LegalDoc";
import { AVIS_LEGAL } from "@/lib/legal";
import { localizedAlternatesFor, openGraphFor } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: AVIS_LEGAL.title,
    description: AVIS_LEGAL.description,
    // FORA DE L'ÍNDEX EN CASTELLÀ, ANGLÈS I FRANCÈS. El text legal és en
    // català als quatre idiomes, però cada idioma té la seva URL i el seu
    // hreflang: per a Google eren quatre còpies del mateix document declarades
    // en quatre llengües diferents. S'indexa només la catalana, que és l'única
    // on l'idioma declarat i el del text coincideixen. "follow" es queda, perquè
    // els enllaços de dins sí que valen.
    ...(locale !== "ca" ? { robots: { index: false, follow: true } } : {}),
    alternates: localizedAlternatesFor("/avis-legal", locale),
    openGraph: openGraphFor("/avis-legal", locale, AVIS_LEGAL.title),
  };
}

export default async function AvisLegalPage({ params }: Props) {
  const { locale } = await params;
  return <LegalDocView doc={AVIS_LEGAL} locale={locale} />;
}
