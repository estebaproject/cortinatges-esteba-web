import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import {
  MOBLES,
  MOBLE_SLUGS,
  getMoble,
  mobleImage,
  mobleImgFit,
  type MobleCat,
} from "@/lib/mobiliari";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import {
  getMobleDetall,
  moblefPriceRange,
} from "@/lib/mobiliari-detall";
import { getMobleSpec, type SpecLocale } from "@/lib/mobiliari-specs";
import { formatEur } from "@/lib/discount";
import MoblePurchasePanel from "@/components/mobiliari/MoblePurchasePanel";
import KaveAboutProduct, { type AboutSection } from "@/components/shop/KaveAboutProduct";
import ProductCarousel from "@/components/shop/ProductCarousel";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return MOBLE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const moble = getMoble(slug);
  if (!moble) return {};
  const t = await getTranslations({ locale, namespace: "Mobiliari" });
  const prefix = locale === "ca" ? "" : `/${locale}`;
  const url = `${SITE_URL}${prefix}/mobiliari/${slug}`;
  const image = mobleImage(slug);
  const catLabel = t(`tipus.${moble.cat}` as Parameters<typeof t>[0]);
  const description = `${moble.nom} — ${catLabel}. ${t("madeBy")} ${t("madeByBrand")}. ${t("fromPrice")} ${moble.pvp} €.`;
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

  const t = await getTranslations("Mobiliari");
  const ts = await getTranslations("Shop");
  const tp = await getTranslations("Producte");
  const locale = await getLocale();
  const prefix = locale === "ca" ? "" : `/${locale}`;

  const catLabel = (c: MobleCat) =>
    t(`tipus.${c}` as Parameters<typeof t>[0]);

  const image = mobleImage(slug);

  // Detall comercial (variants + PVP per variant + termini). Font de la fitxa
  // vendible. Si no hi ha detall (1 moble de 44: "arles-butaca"), caiem amb
  // elegancia al "des de" del registre base + CTA de pressupost.
  const detall = getMobleDetall(slug);
  const range = detall ? moblefPriceRange(detall) : null;

  // Especificacions tecniques (dimensions + material + acabats). Nomes info
  // publica del producte, mai cap cost. 42 mobles de 44 en tenen; els 2 sense
  // ("scandinave-ii", "mosa") retornen undefined i amaguem el bloc del tot.
  const spec = getMobleSpec(slug);
  // El text de material ja ve traduit als 4 idiomes; triem el de la pagina amb
  // fallback a "es" si l'idioma actual no fos un dels suportats.
  const materialText = spec
    ? spec.material[locale as SpecLocale] ?? spec.material.es
    : null;

  // Productes per als carrusels: "Combina'l amb" (mateixa categoria) i
  // "Et pot interessar" (la resta). Es mapegen a items de KaveProductCard.
  const combina = MOBLES.filter((m) => m.slug !== slug && m.cat === moble.cat).slice(0, 8);
  const interessar = MOBLES.filter((m) => m.slug !== slug && m.cat !== moble.cat).slice(0, 8);
  const toItem = (m: (typeof MOBLES)[number]) => ({
    href: `${prefix}/mobiliari/${m.slug}`,
    image: mobleImage(m.slug),
    title: m.nom,
    subtitle: catLabel(m.cat),
    pvp: m.pvp,
    pvpAbans: m.pvpAbans,
    pricePrefix: m.cat === "moble" ? t("fromPrice") : undefined,
    fit: mobleImgFit(m.slug),
  });

  // object-fit de la foto principal (cover per a escenes; contain per a retalls).
  const imgFit = mobleImgFit(moble.slug);

  // Bloc "Sobre el producte": bullets + seccions desplegables (slide-over).
  const aboutIntro: string[] = [
    `${catLabel(moble.cat)} · ${moble.marca}`,
    ...(materialText ? [materialText] : []),
    ...(detall ? [detall.termini] : []),
  ];
  const aboutSections: AboutSection[] = [
    spec && {
      id: "dimensions",
      title: ts("accDimensions"),
      rows: [{ label: t("dimensionsLabel"), value: spec.dimensions }],
    },
    spec && (materialText || spec.finishes.length > 0) && {
      id: "specs",
      title: ts("accSpecs"),
      rows: [
        ...(materialText ? [{ label: t("materialLabel"), value: materialText }] : []),
        ...(spec.finishes.length > 0
          ? [{ label: t("finishesLabel"), value: spec.finishes.join(" · ") }]
          : []),
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
        { label: t("typeLabel"), value: catLabel(moble.cat) },
        { label: t("madeBy"), value: moble.marca },
      ],
    },
  ].filter(Boolean) as AboutSection[];

  const canonicalUrl = `${SITE_URL}${prefix}/mobiliari/${slug}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: moble.nom,
    image: `${SITE_URL}${image}`,
    category: "Mobiliari",
    brand: { "@type": "Brand", name: moble.marca },
    manufacturer: { "@type": "Organization", name: moble.marca },
    // offers: rang real de preus de totes les variants (AggregateOffer) quan
    // tenim detall; fallback a Offer simple amb el pvp base si no.
    ...(range
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "EUR",
            lowPrice: range.min,
            highPrice: range.max,
            offerCount: detall ? detall.variants.length : undefined,
            url: canonicalUrl,
            availability: "https://schema.org/MadeToOrder",
            seller: { "@type": "Organization", name: SITE_NAME },
          },
        }
      : {
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: moble.pvp,
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
      { "@type": "ListItem", position: 2, name: t("eyebrow"), item: `${SITE_URL}${prefix}/mobiliari` },
      { "@type": "ListItem", position: 3, name: moble.nom, item: canonicalUrl },
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
            <Link href={`${prefix}/mobiliari`} className="hover:text-kave-ink transition-colors">
              {ts("navMobles")}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-kave-ink">{moble.nom}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
            {/* Galeria (mobiliari: una imatge). Retall → contain amb padding;
                escena → cover a sang (sense padding). */}
            <div className={`relative aspect-[4/5] overflow-hidden bg-kave-surface ${imgFit === "cover" ? "" : "p-8 lg:p-12"}`}>
              <Image
                src={image}
                alt={moble.nom}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={`object-${imgFit}`}
              />
            </div>

            {/* Columna dreta */}
            <div className="lg:sticky lg:top-32 self-start">
              <p className="text-sm text-kave-muted mb-2">{catLabel(moble.cat)}</p>
              <h1 className="font-display text-3xl md:text-4xl text-kave-ink mb-6 leading-tight">
                {moble.nom}
              </h1>

              {detall && detall.variants.length > 0 ? (
                <MoblePurchasePanel
                  slug={moble.slug}
                  nom={moble.nom}
                  variants={detall.variants}
                  termini={detall.termini}
                  image={image}
                  href={`/mobiliari/${moble.slug}`}
                />
              ) : (
                <div>
                  <p className="text-3xl font-semibold text-kave-ink mb-6">
                    {t("fromPrice")} {formatEur(moble.pvp, locale)}
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

      {/* Carrusels de relacionats */}
      <div className="max-w-layout mx-auto px-5 lg:px-10 py-16 lg:py-24 space-y-16">
        <ProductCarousel title={ts("combineWith")} items={combina.map(toItem)} />
        <ProductCarousel title={ts("youMayLike")} items={interessar.map(toItem)} />
      </div>
    </article>
  );
}
