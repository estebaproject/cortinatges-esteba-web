import type { Metadata } from "next";
import LegalDocView from "@/components/LegalDoc";
import { COOKIES } from "@/lib/legal";
import { localizedAlternatesFor, openGraphFor } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: COOKIES.title,
    alternates: localizedAlternatesFor("/cookies", locale),
    openGraph: openGraphFor("/cookies", locale, COOKIES.title),
  };
}

export default function CookiesPage() {
  return <LegalDocView doc={COOKIES} />;
}
