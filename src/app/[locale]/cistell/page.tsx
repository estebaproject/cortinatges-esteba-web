import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CartView from "@/components/cart/CartView";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Cart" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    // El cistell és privat (estat per usuari): no s'indexa.
    robots: { index: false, follow: false },
  };
}

export default async function CistellPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Cart" });

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

          <CartView />
        </div>
      </section>
    </article>
  );
}
