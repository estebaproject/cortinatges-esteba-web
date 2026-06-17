import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import ConfirmacioView from "@/components/checkout/ConfirmacioView";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Checkout" });
  return {
    title: t("confMetaTitle"),
    description: t("confMetaDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function ConfirmacioPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Checkout" });

  return (
    <article>
      <section className="pt-40 md:pt-48 pb-section bg-canvas">
        <div className="max-w-layout mx-auto px-6 lg:px-12">
          <header className="mb-12 max-w-prose-editorial">
            <p className="font-sans text-eyebrow text-accent-deep uppercase mb-4">
              {t("eyebrow")}
            </p>
            <h1 className="font-serif text-display-lg text-ink leading-snug">
              {t("confPageTitle")}
            </h1>
          </header>

          {/* useSearchParams requereix un límit de Suspense (Next 15). */}
          <Suspense fallback={null}>
            <ConfirmacioView />
          </Suspense>
        </div>
      </section>
    </article>
  );
}
