import type { Metadata } from "next";
import LegalDocView from "@/components/LegalDoc";
import { PRIVACITAT } from "@/lib/legal";
import { localizedAlternatesFor, openGraphFor } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: PRIVACITAT.title,
    alternates: localizedAlternatesFor("/privacitat", locale),
    openGraph: openGraphFor("/privacitat", locale, PRIVACITAT.title),
  };
}

export default async function PrivacitatPage({ params }: Props) {
  const { locale } = await params;
  return <LegalDocView doc={PRIVACITAT} locale={locale} />;
}
