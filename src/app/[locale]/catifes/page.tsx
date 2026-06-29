import type { Metadata } from "next";
import { Suspense } from "react";
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

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i}>
          <div className="aspect-square bg-kave-surface mb-3" />
          <div className="h-4 bg-kave-surface rounded mb-2 w-3/4" />
          <div className="h-3 bg-kave-surface rounded w-1/2" />
        </div>
      ))}
    </div>
  );
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

      {/* Capçalera — tema Kave */}
      <section className="pt-32 md:pt-36 pb-24 bg-kave-bg">
        <div className="max-w-layout mx-auto px-5 lg:px-10">
          <header className="mb-10 max-w-2xl">
            <h1 className="font-display text-4xl md:text-5xl text-kave-ink mb-4 leading-[1.05]">
              {t("headline")}
            </h1>
            <p className="font-grotesque text-base text-kave-muted">{t("intro")}</p>
          </header>

          {/* Catàleg filtrable (client). Rep el set complet per props i gestiona
              filtres, cerca i ordenació sense recarregar.
              Suspense obligatori perquè CatifesCatalog usa useSearchParams() (Next 15). */}
          <Suspense fallback={<CatalogSkeleton />}>
            <CatifesCatalog catifes={CATIFES} prefix={prefix} locale={locale} />
          </Suspense>
        </div>
      </section>
    </article>
  );
}
