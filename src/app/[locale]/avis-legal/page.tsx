import type { Metadata } from "next";
import LegalDocView from "@/components/LegalDoc";
import { AVIS_LEGAL } from "@/lib/legal";

export const metadata: Metadata = { title: AVIS_LEGAL.title };

export default function AvisLegalPage() {
  return <LegalDocView doc={AVIS_LEGAL} />;
}
