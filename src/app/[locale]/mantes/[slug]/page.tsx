import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import {
  MANTES,
  MANTA_SLUGS,
  getManta,
  mantaImage,
} from "@/lib/mantes";
import { getMantaDetall, mantaPriceRange } from "@/lib/mantes-detall";
import MantaPurchasePanel from "@/components/mantes/MantaPurchasePanel";
import { SITE_URL, SITE_NAME } from "@/lib/site";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return MANTA_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const manta = getManta(slug);
  if (!manta) return {};
  const t = await getTranslations({ locale, namespace: "Mantes" });
  const prefix = locale === "ca" ? "" : `/${locale}`;
  const url = `${SITE_URL}${prefix}/mantes/${slug}`;
  const image = mantaImage(slug);
  const detall = getMantaDetall(slug);
  const range = detall ? mantaPriceRange(detall) : null;
  const fromPriceValue = range?.min ?? manta.pvp;
  const description = `${manta.nom} — ${t("eyebrow")}. ${t("madeBy")} ${t("madeByBrand")}. ${t("fromPrice")} ${fromPriceValue} €.`;
  return {
    title: `${manta.nom} — ${t("eyebrow")}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${manta.nom} — ${t("eyebrow")}`,
      description,
      images: [{ url: image, width: 1200, height: 1200, alt: manta.nom }],
    },
  };
}

export default async function MantaPage({ params }: Props) {
  const { slug } = await params;
  const manta = getManta(slug);
  if (!manta) notFound();

  const t = await getTranslations("Mantes");
  const locale = await getLocale();
  const prefix = locale === "ca" ? "" : `/${locale}`;

  const image = mantaImage(slug);

  // Detall comercial (mesura + PVP per mesura + termini). Font de la fitxa
  // vendible. Si no hi ha detall, caiem amb elegancia al "des de" del registre
  // base + CTA de pressupost.
  const detall = getMantaDetall(slug);
  const range = detall ? mantaPriceRange(detall) : null;

  // El preu "des de" surt del rang real de mesures quan tenim detall; si no,
  // del pvp base del registre.
  const fromPriceValue = range?.min ?? manta.pvp;
  const priceLabel = `${t("fromPrice")} ${fromPriceValue.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;

  const related = MANTES.filter((m) => m.slug !== slug).slice(0, 4);

  const canonicalUrl = `${SITE_URL}${prefix}/mantes/${slug}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: manta.nom,
    image: `${SITE_URL}${image}`,
    category: "Mantes",
    brand: { "@type": "Brand", name: manta.marca },
    manufacturer: { "@type": "Organization", name: manta.marca },
    // offers: AggregateOffer amb el rang real quan tenim detall amb mes d'una
    // mesura; Offer simple altrament (cas habitual: 1 mesura per manta).
    ...(range && detall && detall.variants.length > 1
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "EUR",
            lowPrice: range.min,
            highPrice: range.max,
            offerCount: detall.variants.length,
            url: canonicalUrl,
            availability: "https://schema.org/MadeToOrder",
            seller: { "@type": "Organization", name: SITE_NAME },
          },
        }
      : {
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: fromPriceValue,
            url: canonicalUrl,
            availability: "https://schema.org/MadeToOrder",
            seller: { "@type": "Organization", name: SITE_NAME },
          },
        }),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}${prefix || "/"}` },
      { "@type": "ListItem", position: 2, name: t("eyebrow"), item: `${SITE_URL}${prefix}/mantes` },
      { "@type": "ListItem", position: 3, name: manta.nom, item: canonicalUrl },
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
            <Link href={`${prefix}/mantes`} className="hover:text-ink transition-colors">
              {t("eyebrow")}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{manta.nom}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Foto gran (object-cover, igual que mobiliari/catifes) */}
            <div className="relative aspect-[4/5] overflow-hidden bg-canvas-warm">
              <Image
                src={image}
                alt={manta.nom}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Informació */}
            <div className="lg:sticky lg:top-28 self-start">
              <p className="font-sans text-body-sm text-ink-faint mb-3">
                {t("eyebrow")}
              </p>
              <h1 className="font-serif text-display-md text-ink mb-3 leading-tight">
                {manta.nom}
              </h1>
              <p className="font-sans text-body-lg text-ink mb-10">{priceLabel}</p>

              <dl className="divide-y divide-sand-dark/25 border-t border-b border-sand-dark/25 mb-10">
                <div className="flex justify-between gap-6 py-3.5">
                  <dt className="font-sans text-body-sm text-ink-muted">
                    {t("madeBy")}
                  </dt>
                  <dd className="font-sans text-body-sm text-ink">{manta.marca}</dd>
                </div>
              </dl>

              {/* Compra directa: selector de mesura + PVP + termini d'entrega
                  (requisit legal, visible abans de comprar) + afegir a la
                  cistella. Nomes si tenim detall comercial amb mesures. */}
              {detall && detall.variants.length > 0 && (
                <div className="mb-8">
                  <MantaPurchasePanel
                    slug={manta.slug}
                    nom={manta.nom}
                    variants={detall.variants}
                    termini={detall.termini}
                    image={image}
                    href={`/mantes/${manta.slug}`}
                  />
                </div>
              )}

              <div className="pt-8 border-t border-sand-dark/25">
                <p className="font-serif text-display-md text-ink mb-2 leading-tight">
                  {t("ctaBlockHeadline")}
                </p>
                <p className="font-sans text-body-sm text-ink-muted mb-6 max-w-prose-editorial">
                  {t("ctaBlockBody")}
                </p>
                <Link
                  href={`${prefix}/demana-pressupost`}
                  className="inline-flex items-center justify-center px-8 py-4 bg-ink text-canvas font-sans text-body-md font-medium hover:bg-accent-deep transition-colors"
                >
                  {t("requestBudget")}
                </Link>
              </div>
            </div>
          </div>

          {/* Mantes relacionades */}
          {related.length > 0 && (
            <section className="mt-section border-t border-sand-dark/25 pt-section">
              <div className="flex items-end justify-between mb-10">
                <h2 className="font-serif text-display-md text-ink">{t("eyebrow")}</h2>
                <Link
                  href={`${prefix}/mantes`}
                  className="font-sans text-body-sm text-accent-deep font-medium hover:text-ink transition-colors"
                >
                  {t("backToMantes")}
                </Link>
              </div>
              <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10" role="list">
                {related.map((m) => (
                  <li key={m.slug}>
                    <Link
                      href={`${prefix}/mantes/${m.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-canvas-warm mb-3">
                        <Image
                          src={mantaImage(m.slug)}
                          alt={m.nom}
                          fill
                          sizes="(min-width: 1024px) 25vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <p className="font-sans text-body-md font-medium text-ink group-hover:text-accent-deep transition-colors">
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
