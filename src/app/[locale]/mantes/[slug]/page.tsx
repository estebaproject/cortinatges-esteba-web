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
import {
  getMantaDetall,
  mantaPriceRange,
  formatMantaMidaLabel,
} from "@/lib/mantes-detall";
import { formatEur } from "@/lib/discount";
import { productSku } from "@/lib/sku";
import MantaPurchasePanel from "@/components/mantes/MantaPurchasePanel";
import KaveAboutProduct, { type AboutSection } from "@/components/shop/KaveAboutProduct";
import ProductCarousel from "@/components/shop/ProductCarousel";
import { SITE_URL, SITE_NAME, localizedAlternates } from "@/lib/site";

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
    alternates: localizedAlternates(locale, "mantes", slug),
    openGraph: {
      type: "website",
      url,
      title: `${manta.nom} — ${t("eyebrow")}`,
      description,
      images: [{ url: image, width: 1200, height: 1200, alt: manta.nom }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${manta.nom} — ${t("eyebrow")}`,
      description,
      images: [image],
    },
  };
}

export default async function MantaPage({ params }: Props) {
  const { slug } = await params;
  const manta = getManta(slug);
  if (!manta) notFound();

  const t = await getTranslations("Mantes");
  const ts = await getTranslations("Shop");
  const tp = await getTranslations("Producte");
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

  // Productes per al carrusel "Et pot interessar" (la resta de mantes). Es
  // mapegen a items de KaveProductCard (fit cover: foto tèxtil a sang).
  const interessar = MANTES.filter((m) => m.slug !== slug).slice(0, 8);
  const toItem = (m: (typeof MANTES)[number]) => ({
    href: `${prefix}/mantes/${m.slug}`,
    image: mantaImage(m.slug),
    title: m.nom,
    subtitle: t("eyebrow"),
    pvp: m.pvp,
    pvpAbans: m.pvpAbans,
    pricePrefix: t("fromPrice"),
    fit: "cover" as const,
  });

  // SKU propi DERIVAT (no desat): prefix de catàleg + slug. Vegeu src/lib/sku.ts.
  const sku = productSku("manta", slug);

  // Bloc "Sobre el producte": bullets + seccions desplegables (slide-over).
  const aboutIntro: string[] = [
    `${t("eyebrow")} · ${manta.marca}`,
    ...(detall ? [detall.termini] : []),
  ];
  const aboutSections: AboutSection[] = [
    detall && detall.variants.length > 0 && {
      id: "dimensions",
      title: ts("accDimensions"),
      rows: [
        {
          label: tp("measures"),
          value: detall.variants.map((v) => formatMantaMidaLabel(v.mida)).join(" · "),
        },
      ],
    },
    detall && {
      id: "delivery",
      title: ts("accDelivery"),
      rows: [{ label: tp("deliveryTime"), value: detall.termini }],
    },
    {
      id: "more",
      title: ts("accMoreDetails"),
      rows: [
        { label: t("madeBy"), value: manta.marca },
        { label: ts("reference"), value: sku },
      ],
    },
  ].filter(Boolean) as AboutSection[];

  const canonicalUrl = `${SITE_URL}${prefix}/mantes/${slug}`;

  // Mateixa descripció que generateMetadata (reusada al JSON-LD Product).
  const schemaDescription = `${manta.nom} — ${t("eyebrow")}. ${t("madeBy")} ${t("madeByBrand")}. ${t("fromPrice")} ${fromPriceValue} €.`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: manta.nom,
    description: schemaDescription,
    image: `${SITE_URL}${image}`,
    category: "Mantes",
    sku,
    // mpn = referència del proveïdor quan existeixi (de moment buida).
    ...(manta.supplierRef ? { mpn: manta.supplierRef } : {}),
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
    <article className="bg-kave-bg font-grotesque text-kave-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="pt-32 md:pt-36 pb-16 lg:pb-24">
        <div className="max-w-layout mx-auto px-5 lg:px-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-kave-muted mb-8" aria-label="Breadcrumb">
            <Link href={`${prefix}/botiga`} className="hover:text-kave-ink transition-colors">
              {ts("navBotiga")}
            </Link>
            <span aria-hidden>/</span>
            <Link href={`${prefix}/mantes`} className="hover:text-kave-ink transition-colors">
              {ts("navMantes")}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-kave-ink">{manta.nom}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
            {/* Galeria — foto tèxtil a sang (object-cover) sobre gris càlid */}
            <div className="relative aspect-[4/5] overflow-hidden bg-kave-surface p-8 lg:p-12">
              <Image
                src={image}
                alt={manta.nom}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain"
              />
            </div>

            {/* Columna dreta */}
            <div className="lg:sticky lg:top-32 self-start">
              <p className="text-sm text-kave-muted mb-2">{t("eyebrow")}</p>
              <h1 className="font-display text-3xl md:text-4xl text-kave-ink mb-6 leading-tight">
                {manta.nom}
              </h1>

              {detall && detall.variants.length > 0 ? (
                <MantaPurchasePanel
                  slug={manta.slug}
                  nom={manta.nom}
                  variants={detall.variants}
                  termini={detall.termini}
                  image={image}
                  href={`/mantes/${manta.slug}`}
                />
              ) : (
                <div>
                  <p className="text-3xl font-semibold text-kave-ink mb-6">
                    {t("fromPrice")} {formatEur(fromPriceValue, locale)}
                  </p>
                  <Link
                    href={`${prefix}/demana-pressupost`}
                    className="inline-flex items-center justify-center px-8 py-3.5 bg-kave-ink text-white text-sm font-semibold hover:bg-kave-ink/90 transition-colors"
                  >
                    {t("requestBudget")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sobre el producte (banda verd sàlvia + acordeó/slide-over) */}
      <KaveAboutProduct intro={aboutIntro} sections={aboutSections} />

      {/* Carrusel de relacionats */}
      <div className="max-w-layout mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <ProductCarousel title={ts("youMayLike")} items={interessar.map(toItem)} />
      </div>
    </article>
  );
}
