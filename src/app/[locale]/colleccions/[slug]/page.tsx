import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import {
  PRODUCTS,
  PRODUCT_SLUGS,
  getProduct,
  productImages,
} from "@/lib/products";
import { whatsappUrl } from "@/lib/whatsapp";
import { SITE_URL, SITE_NAME, localizedAlternates } from "@/lib/site";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!getProduct(slug)) return {};
  const tp = await getTranslations({ locale, namespace: "Products" });
  const name = tp(`${slug}.name` as Parameters<typeof tp>[0]);
  const tagline = tp(`${slug}.tagline` as Parameters<typeof tp>[0]);
  const prefix = locale === "ca" ? "" : `/${locale}`;
  const url = `${SITE_URL}${prefix}/colleccions/${slug}`;
  const image = `/images/products/${slug}/1.jpg`;
  return {
    title: name,
    description: tagline,
    alternates: localizedAlternates(locale, "colleccions", slug),
    openGraph: {
      type: "website",
      url,
      title: name,
      description: tagline,
      images: [{ url: image, width: 1200, height: 630, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: tagline,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const t = await getTranslations("ProductPage");
  const tp = await getTranslations("Products");
  const locale = await getLocale();
  const prefix = locale === "ca" ? "" : `/${locale}`;

  const key = (k: string) => `${slug}.${k}` as Parameters<typeof tp>[0];
  const name = tp(key("name"));
  const tagline = tp(key("tagline"));
  const intro = tp(key("intro"));
  const paragraphs = tp.raw(key("paragraphs")) as string[];
  const featuresRaw = tp.has(key("features")) ? (tp.raw(key("features")) as string[]) : [];
  const images = productImages(product);
  const [hero, ...gallery] = images;

  const budgetMessage = `Hola! Voldria demanar pressupost:\n\nProducte: ${name}\nPoblació: `;
  const otherProducts = PRODUCTS.filter((p) => p.slug !== slug).slice(0, 4);

  const canonicalUrl = `${SITE_URL}${prefix}/colleccions/${slug}`;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: `${intro} ${paragraphs.join(" ")}`.trim(),
    image: images.map((i) => `${SITE_URL}${i}`),
    category: "Cortines i estors a mida",
    brand: { "@type": "Brand", name: SITE_NAME },
    ...(product.brands && product.brands.length > 0
      ? { material: product.brands.join(", ") }
      : {}),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("breadcrumbHome"), item: `${SITE_URL}${prefix || "/"}` },
      { "@type": "ListItem", position: 2, name: t("breadcrumbCollections"), item: `${SITE_URL}${prefix || "/"}#productes` },
      { "@type": "ListItem", position: 3, name, item: canonicalUrl },
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
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={hero}
            alt={name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent" />
        </div>
        <div className="relative z-10 max-w-layout mx-auto px-6 lg:px-12 w-full pb-12 md:pb-16">
          <nav
            className="flex items-center gap-2 font-sans text-body-sm text-canvas/70 mb-5"
            aria-label="Breadcrumb"
          >
            <Link href={prefix || "/"} className="hover:text-canvas transition-colors">
              {t("breadcrumbHome")}
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`${prefix || "/"}#productes`}
              className="hover:text-canvas transition-colors"
            >
              {t("breadcrumbCollections")}
            </Link>
          </nav>
          <h1 className="font-serif text-display-lg text-canvas max-w-3xl mb-4">
            {name}
          </h1>
          <p className="font-sans text-body-lg text-canvas/85 max-w-prose-editorial">
            {tagline}
          </p>
        </div>
      </section>

      {/* Descripció */}
      <section className="py-section bg-canvas">
        <div className="max-w-layout mx-auto px-6 lg:px-12 grid lg:grid-cols-[2fr,1fr] gap-12 lg:gap-20">
          <div className="max-w-prose-editorial">
            <p className="font-serif text-display-md text-ink mb-8 leading-snug">
              {intro}
            </p>
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="font-sans text-body-lg text-ink-muted mb-6 last:mb-0"
              >
                {p}
              </p>
            ))}

            {featuresRaw.length > 0 && (
              <div className="mt-12">
                <h2 className="font-sans text-eyebrow text-accent-deep uppercase mb-6">
                  {t("featuresHeading")}
                </h2>
                <ul className="flex flex-col gap-4" role="list">
                  {featuresRaw.map((f, i) => (
                    <li
                      key={i}
                      className="font-sans text-body-md text-ink-muted pl-5 border-l-2 border-linen-dark"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Aside accions */}
          <aside className="lg:sticky lg:top-28 self-start">
            <div className="border border-linen p-8 bg-canvas-warm">
              <p className="font-serif text-display-md text-ink mb-3">
                {t("ctaBlockHeadline")}
              </p>
              <p className="font-sans text-body-sm text-ink-muted mb-6">
                {t("ctaBlockBody")}
              </p>
              <a
                href={whatsappUrl(budgetMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#25D366] text-white font-sans text-body-md font-semibold hover:brightness-95 transition-all mb-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.518 5.26l-.999 3.648 3.97-1.042zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                {t("requestBudget")}
              </a>
              <Link
                href={`${prefix}/contacte`}
                className="flex items-center justify-center w-full px-6 py-4 border border-ink/20 text-ink font-sans text-body-md hover:bg-ink hover:text-canvas transition-colors"
              >
                {t("contactCta")}
              </Link>

              {product.brands && product.brands.length > 0 && (
                <div className="mt-8 pt-6 border-t border-linen">
                  <p className="font-sans text-body-sm text-ink-muted mb-3">
                    {t("brandsLabel")}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {product.brands.map((b) => (
                      <span key={b} className="font-serif text-body-md text-ink-faint italic">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Galeria */}
      {gallery.length > 0 && (
        <section className="pb-section bg-canvas" aria-label={t("galleryHeading")}>
          <div className="max-w-layout mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((src, i) => (
                <div
                  key={src}
                  className="relative aspect-[4/5] overflow-hidden bg-linen"
                >
                  <Image
                    src={src}
                    alt={`${name} — ${i + 2}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Altres colleccions */}
      <section className="py-section bg-canvas-warm border-t border-linen">
        <div className="max-w-layout mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-serif text-display-md text-ink">
              {t("otherCollections")}
            </h2>
            <Link
              href={`${prefix || "/"}#productes`}
              className="font-sans text-body-sm text-accent-deep font-medium hover:text-ink transition-colors"
            >
              {t("backToCollections")}
            </Link>
          </div>
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-6" role="list">
            {otherProducts.map((p) => (
              <li key={p.slug}>
                <Link href={`${prefix}/colleccions/${p.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-linen mb-3">
                    <Image
                      src={`/images/products/${p.slug}/1.jpg`}
                      alt={tp(`${p.slug}.name` as Parameters<typeof tp>[0])}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="font-serif text-body-lg text-ink group-hover:text-accent-deep transition-colors">
                    {tp(`${p.slug}.name` as Parameters<typeof tp>[0])}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
