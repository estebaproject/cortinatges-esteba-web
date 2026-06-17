import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MANTES } from "@/lib/mantes";
import { SITE_URL } from "@/lib/site";
import MantesCatalog from "@/components/MantesCatalog";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Mantes" });
  const prefix = locale === "ca" ? "" : `/${locale}`;
  const url = `${SITE_URL}${prefix}/mantes`;
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    // Secció oculta de moment (només Mobiliari publicat). No indexar.
    robots: { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

export default async function MantesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("Mantes");
  const prefix = locale === "ca" ? "" : `/${locale}`;

  // Dades estructurades: llista de productes (mantes) per a SEO local.
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("metaTitle"),
    itemListElement: MANTES.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.nom,
      url: `${SITE_URL}${prefix}/mantes/${m.slug}`,
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
          <header className="mb-14 max-w-prose-editorial">
            <p className="font-sans text-body-sm text-ink-muted mb-3">
              {t("eyebrow")}
            </p>
            <h1 className="font-serif text-display-md text-ink mb-4 leading-tight">
              {t("headline")}
            </h1>
            <p className="font-sans text-body-md text-ink-muted">{t("intro")}</p>
          </header>

          {/* Catàleg (client). Rep el set complet per props i gestiona cerca i
              ordenació sense recarregar. */}
          <MantesCatalog mantes={MANTES} prefix={prefix} locale={locale} />
        </div>
      </section>
    </article>
  );
}
