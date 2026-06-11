import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MANTES } from "@/lib/decoracio";
import { SITE_URL } from "@/lib/site";
import MantesCatalog from "@/components/MantesCatalog";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Decoracio" });
  const prefix = locale === "ca" ? "" : `/${locale}`;
  const url = `${SITE_URL}${prefix}/decoracio`;
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

export default async function DecoracioPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("Decoracio");
  const prefix = locale === "ca" ? "" : `/${locale}`;

  // Dades estructurades: llista de productes (mantes) per a SEO local.
  // Sempre el set complet, per consistència del JSON-LD.
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("metaTitle"),
    itemListElement: MANTES.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.nom,
      url: `${SITE_URL}${prefix}/decoracio/${m.slug}`,
    })),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Capçalera */}
      <section className="pt-40 md:pt-48 pb-section bg-canvas">
        <div className="max-w-layout mx-auto px-6 lg:px-12">
          <header className="mb-12 max-w-prose-editorial">
            <p className="font-sans text-eyebrow text-accent-deep uppercase mb-4">
              {t("eyebrow")}
            </p>
            <h1 className="font-serif text-display-lg text-ink mb-5 leading-snug">
              {t("headline")}
            </h1>
            <p className="font-sans text-body-lg text-ink-muted">{t("intro")}</p>
          </header>

          {/* Catàleg (client). Categoria petita: només graella + ordenació. */}
          <MantesCatalog mantes={MANTES} prefix={prefix} locale={locale} />
        </div>
      </section>
    </article>
  );
}
