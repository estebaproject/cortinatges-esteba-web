import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CheckoutView from "@/components/checkout/CheckoutView";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Checkout" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    // El checkout és privat (depèn del cistell de l'usuari): no s'indexa.
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage({ params }: Props) {
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
              {t("title")}
            </h1>
          </header>

          <CheckoutView />
        </div>
      </section>
    </article>
  );
}
