import type { Metadata } from "next";
import LegalDocView from "@/components/LegalDoc";
import { PRIVACITAT } from "@/lib/legal";

export const metadata: Metadata = { title: PRIVACITAT.title };

export default function PrivacitatPage() {
  return <LegalDocView doc={PRIVACITAT} />;
}
