import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import {
  MOBLES,
  mobleImage,
  type TipusMoble,
} from "@/lib/mobiliari";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import MobleGallery from "@/components/MobleGallery";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// mobiliari.ts no exporta cap helper de cerca; la resolem aquí sobre MOBLES.
const getMoble = (slug: string) => MOBLES.find((m) => m.slug === slug);

export function generateStaticParams() {
  return MOBLES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const moble = getMoble(slug);
  if (!moble) return {};
  const t = await getTranslations({ locale, namespace: "Mobles" });
  const prefix = locale === "ca" ? "" : `/${locale}`;
  const url = `${SITE_URL}${prefix}/mobiliari/${slug}`;
  const image = mobleImage(slug, moble.colors[0].slug);
  const tipusLabel = t(`tipus.${moble.tipus}` as Parameters<typeof t>[0]);
  const description = `${moble.nom} — ${tipusLabel}. ${t("madeBy")} ${t("madeByBrand")}. ${t("fromPrice")} ${moble.pvpDesde} €.`;
  return {
    title: `${moble.nom} — ${t("eyebrow")}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${moble.nom} — ${t("eyebrow")}`,
      description,
      images: [{ url: image, width: 1200, height: 1200, alt: moble.nom }],
    },
  };
}

export default async function MoblePage({ params }: Props) {
  const { slug } = await params;
  const moble = getMoble(slug);
  if (!moble) notFound();

  const t = await getTranslations("Mobles");
  const locale = await getLocale();
  const prefix = locale === "ca" ? "" : `/${locale}`;

  const tipusLabel = (tp: TipusMoble) =>
    t(`tipus.${tp}` as Parameters<typeof t>[0]);

  // Imatge principal (primer color) per al schema/OG; la galeria gestiona la
  // resta de colors al client.
  const image = mobleImage(slug, moble.colors[0].slug);
  const priceLabel = `${t("fromPrice")} ${moble.pvpDesde.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;

  const others = MOBLES.filter(
    (m) => m.slug !== slug && m.tipus === moble.tipus,
  ).slice(0, 4);
  const fallbackOthers = MOBLES.filter((m) => m.slug !== slug).slice(0, 4);
  const related = others.length > 0 ? others : fallbackOthers;

  const canonicalUrl = `${SITE_URL}${prefix}/mobiliari/${slug}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: moble.nom,
    image: `${SITE_URL}${image}`,
    category: "Mobiliari",
    brand: { "@type": "Brand", name: moble.marca },
    manufacturer: { "@type": "Organization", name: moble.marca },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: moble.pvpDesde,
      url: canonicalUrl,
      availability: "https://schema.org/MadeToOrder",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}${prefix || "/"}` },
      { "@type": "ListItem", position: 2, name: t("eyebrow"), item: `${SITE_URL}${prefix}/mobiliari` },
      { "@type": "ListItem", position: 3, name: moble.nom, item: canonicalUrl },
    ],
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="pt-40 md:pt-48 pb-section bg-canvas">
        <div className="max-w-layout mx-auto px-6 lg:px-12">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 font-sans text-body-sm text-ink-muted mb-8"
            aria-label="Breadcrumb"
          >
            <Link href={prefix || "/"} className="hover:text-ink transition-colors">
              {SITE_NAME}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={`${prefix}/mobiliari`} className="hover:text-ink transition-colors">
              {t("eyebrow")}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{moble.nom}</span>
          </nav>

          {/* Galeria interactiva per color (client). El bloc d'informació
              estàtica s'injecta com a children i es manté al servidor; només la
              foto, els swatches i l'afegir al cistell depenen del color actiu.
              El botó de compra el renderitza MobleGallery amb el color actiu. */}
          <MobleGallery
            moble={moble}
            footer={
              <div className="border border-linen p-8 bg-canvas-warm">
                <p className="font-serif text-display-md text-ink mb-3">
                  {t("ctaBlockHeadline")}
                </p>
                <p className="font-sans text-body-sm text-ink-muted mb-6">
                  {t("ctaBlockBody")}
                </p>
                <Link
                  href={`${prefix}/demana-pressupost`}
                  className="flex items-center justify-center w-full px-6 py-4 bg-ink text-canvas font-sans text-body-md font-semibold hover:bg-accent-deep transition-colors"
                >
                  {t("requestBudget")}
                </Link>
              </div>
            }
          >
            <p className="font-sans text-eyebrow text-accent-deep uppercase mb-4">
              {tipusLabel(moble.tipus)}
            </p>
            <h1 className="font-serif text-display-lg text-ink mb-4">{moble.nom}</h1>
            <p className="font-serif text-display-md text-ink mb-8">{priceLabel}</p>

            <dl className="border-t border-linen divide-y divide-linen mb-8">
              <div className="flex justify-between py-4">
                <dt className="font-sans text-body-sm text-ink-muted uppercase tracking-widest">
                  {t("typeLabel")}
                </dt>
                <dd className="font-sans text-body-md text-ink">
                  {tipusLabel(moble.tipus)}
                </dd>
              </div>
              {moble.colors.length > 1 && (
                <div className="flex justify-between py-4">
                  <dt className="font-sans text-body-sm text-ink-muted uppercase tracking-widest">
                    {t("colorLabel")}
                  </dt>
                  <dd className="font-sans text-body-md text-ink">
                    {t("colorsAvailable", { count: moble.colors.length })}
                  </dd>
                </div>
              )}
              <div className="flex justify-between py-4">
                <dt className="font-sans text-body-sm text-ink-muted uppercase tracking-widest">
                  {t("madeBy")}
                </dt>
                <dd className="font-serif text-body-md text-ink-faint italic">
                  {moble.marca}
                </dd>
              </div>
            </dl>
          </MobleGallery>

          {/* Mobles relacionats */}
          {related.length > 0 && (
            <section className="mt-section border-t border-linen pt-section">
              <div className="flex items-end justify-between mb-10">
                <h2 className="font-serif text-display-md text-ink">{t("eyebrow")}</h2>
                <Link
                  href={`${prefix}/mobiliari`}
                  className="font-sans text-body-sm text-accent-deep font-medium hover:text-ink transition-colors"
                >
                  {t("backToMobles")}
                </Link>
              </div>
              <ul className="grid grid-cols-2 lg:grid-cols-4 gap-6" role="list">
                {related.map((m) => (
                  <li key={m.slug}>
                    <Link
                      href={`${prefix}/mobiliari/${m.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-square overflow-hidden bg-linen mb-3">
                        <Image
                          src={mobleImage(m.slug, m.colors[0].slug)}
                          alt={m.nom}
                          fill
                          sizes="(min-width: 1024px) 25vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <p className="font-serif text-body-lg text-ink group-hover:text-accent-deep transition-colors">
                        {m.nom}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </section>
    </article>
  );
}
