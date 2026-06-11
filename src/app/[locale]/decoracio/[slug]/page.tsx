import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { MANTES, mantaImage, mantaSlides } from "@/lib/decoracio";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductGallery from "@/components/shop/ProductGallery";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// decoracio.ts no exporta cap helper de cerca; la resolem aquí sobre MANTES.
const getManta = (slug: string) => MANTES.find((m) => m.slug === slug);

export function generateStaticParams() {
  return MANTES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const manta = getManta(slug);
  if (!manta) return {};
  const t = await getTranslations({ locale, namespace: "Decoracio" });
  const prefix = locale === "ca" ? "" : `/${locale}`;
  const url = `${SITE_URL}${prefix}/decoracio/${slug}`;
  const image = mantaImage(slug);
  const description = `${manta.nom} — ${t("midaLabel")} ${manta.mida}. ${t("madeBy")} ${t("madeByBrand")}. ${t("fromPrice")} ${manta.pvpDesde} €.`;
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

  const t = await getTranslations("Decoracio");
  const locale = await getLocale();
  const prefix = locale === "ca" ? "" : `/${locale}`;

  // ADR-7: imatge de producte (principal.png) per al JSON-LD i add-to-cart.
  const image = mantaImage(slug);
  // Slides per a la galeria: escena (cover) + principal (contain).
  const tGallery = await getTranslations("Gallery");
  const slides = mantaSlides(slug, manta.nom);

  const priceLabel = `${t("fromPrice")} ${manta.pvpDesde.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;

  const related = MANTES.filter((m) => m.slug !== slug).slice(0, 4);

  const canonicalUrl = `${SITE_URL}${prefix}/decoracio/${slug}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: manta.nom,
    image: `${SITE_URL}${image}`,
    category: "Decoració",
    brand: { "@type": "Brand", name: manta.marca },
    manufacturer: { "@type": "Organization", name: manta.marca },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: manta.pvpDesde,
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
      { "@type": "ListItem", position: 2, name: t("eyebrow"), item: `${SITE_URL}${prefix}/decoracio` },
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
            <Link href={`${prefix}/decoracio`} className="hover:text-ink transition-colors">
              {t("eyebrow")}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{manta.nom}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Galeria de producte: escena (cover) + principal (contain) */}
            <ProductGallery
              slides={slides}
              thumbsLabel={tGallery("thumbsLabel")}
            />

            {/* Informació */}
            <div className="lg:sticky lg:top-28 self-start">
              <p className="font-sans text-eyebrow text-accent-deep uppercase mb-4">
                {t("eyebrow")}
              </p>
              <h1 className="font-serif text-display-lg text-ink mb-4">{manta.nom}</h1>
              <p className="font-serif text-display-md text-ink mb-8">{priceLabel}</p>

              <dl className="border-t border-linen divide-y divide-linen mb-8">
                <div className="flex justify-between py-4">
                  <dt className="font-sans text-body-sm text-ink-muted uppercase tracking-widest">
                    {t("midaLabel")}
                  </dt>
                  <dd className="font-sans text-body-md text-ink">{manta.mida}</dd>
                </div>
                <div className="flex justify-between py-4">
                  <dt className="font-sans text-body-sm text-ink-muted uppercase tracking-widest">
                    {t("madeBy")}
                  </dt>
                  <dd className="font-serif text-body-md text-ink-faint italic">
                    {manta.marca}
                  </dd>
                </div>
              </dl>

              {/* Compra directa. Botó client que afegeix al cistell. */}
              <div className="mb-6">
                <AddToCartButton
                  slug={manta.slug}
                  href={`/decoracio/${manta.slug}`}
                  nom={manta.nom}
                  pvp={manta.pvpDesde}
                  image={image}
                />
              </div>

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
            </div>
          </div>

          {/* Mantes relacionades */}
          {related.length > 0 && (
            <section className="mt-section border-t border-linen pt-section">
              <div className="flex items-end justify-between mb-10">
                <h2 className="font-serif text-display-md text-ink">{t("eyebrow")}</h2>
                <Link
                  href={`${prefix}/decoracio`}
                  className="font-sans text-body-sm text-accent-deep font-medium hover:text-ink transition-colors"
                >
                  {t("backToMantes")}
                </Link>
              </div>
              <ul className="grid grid-cols-2 lg:grid-cols-4 gap-6" role="list">
                {related.map((m) => (
                  <li key={m.slug}>
                    <Link
                      href={`${prefix}/decoracio/${m.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-square overflow-hidden bg-linen mb-3">
                        <Image
                          src={mantaImage(m.slug)}
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
