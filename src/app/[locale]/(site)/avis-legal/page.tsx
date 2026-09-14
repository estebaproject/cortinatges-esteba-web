import type { Metadata } from "next";
import LegalDocView from "@/components/LegalDoc";
import { AVIS_LEGAL } from "@/lib/legal";
import { localizedAlternatesFor, openGraphFor } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: AVIS_LEGAL.title,
    alternates: localizedAlternatesFor("/avis-legal", locale),
    openGraph: openGraphFor("/avis-legal", locale, AVIS_LEGAL.title),
  };
}

export default async function AvisLegalPage({ params }: Props) {
  const { locale } = await params;
  return <LegalDocView doc={AVIS_LEGAL} locale={locale} />;
}
