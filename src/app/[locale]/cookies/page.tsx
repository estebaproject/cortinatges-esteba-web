import type { Metadata } from "next";
import LegalDocView from "@/components/LegalDoc";
import { COOKIES } from "@/lib/legal";

export const metadata: Metadata = { title: COOKIES.title };

export default function CookiesPage() {
  return <LegalDocView doc={COOKIES} />;
}
