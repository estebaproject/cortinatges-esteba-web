import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CATIFES } from "@/lib/catifes";
import { SITE_URL } from "@/lib/site";
import CatifesCatalog from "@/components/CatifesCatalog";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Catifes" });
  const prefix = locale === "ca" ? "" : `/${locale}`;
  const url = `${SITE_URL}${prefix}/catifes`;
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

export default async function CatifesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("Catifes");
  const prefix = locale === "ca" ? "" : `/${locale}`;

  // Dades estructurades: llista de productes (catifes) per a SEO local.
  // Sempre el set complet (no el filtrat), per consistència del JSON-LD.
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("metaTitle"),
    itemListElement: CATIFES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.nom,
      url: `${SITE_URL}${prefix}/catifes/${c.slug}`,
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

          {/* Catàleg filtrable (client). Rep el set complet per props i gestiona
              filtres, cerca i ordenació sense recarregar. */}
          <CatifesCatalog catifes={CATIFES} prefix={prefix} locale={locale} />
        </div>
      </section>
    </article>
  );
}
