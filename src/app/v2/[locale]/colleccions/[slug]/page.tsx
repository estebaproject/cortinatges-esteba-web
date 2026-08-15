import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { PRODUCT_SLUGS, getProduct, productImages } from "@/lib/products";
import { V2_LOCALES, V2_PHONE_DISPLAY, V2_PHONE_TEL, v2Path } from "@/lib/v2/config";
import { getV2Messages, getV2T } from "@/lib/v2/i18n";
import { whatsappUrl } from "@/lib/whatsapp";
import V2PageHeader, { V2Breadcrumb } from "@/components/v2/V2PageHeader";
import V2CollectionCard from "@/components/v2/V2CollectionCard";
import { ArrowRight, ButtonLink } from "@/components/v2/ui/V2Button";
import { PhoneIcon, WhatsAppIcon } from "@/components/v2/ui/icons";
import { Container, Reveal, Section, SectionHead } from "@/components/v2/ui/primitives";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return V2_LOCALES.flatMap((locale) =>
    PRODUCT_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!getProduct(slug)) return {};
  const tp = await getV2T(locale, "Products");
  return {
    title: tp(`${slug}.name`),
    description: tp(`${slug}.tagline`),
  };
}

/**
 * Fitxa de col·lecció.
 *
 * Reutilitza ÍNTEGRAMENT el contingut que ja existeix al namespace `Products`
 * de messages/*.json: nom, reclam, introducció, paràgrafs, característiques i
 * consells del taller, ja traduïts als quatre idiomes. Aquí no es reescriu res
 * de producte — el que canvia és com es presenta.
 *
 * Tres diferències amb la fitxa actual:
 * · La galeria va a dalt, no al final. És un producte visual.
 * · Les característiques i els consells són dues llistes separades i marcades,
 *   no un bloc de text seguit.
 * · La crida a l'acció s'enganxa al lateral en desktop: es pot demanar
 *   pressupost des de qualsevol punt de la lectura, no només al final.
 */
export default async function V2CollectionPage({ params }: Props) {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const tp = await getV2T(locale, "Products");
  const t = await getV2T(locale, "V2.collection");
  const tc = await getV2T(locale, "V2.cta");
  const tw = await getV2T(locale, "Whatsapp");

  // Els arrays (paragraphs / features / notes) no es poden llegir amb t(): cal
  // anar al missatge cru. Algunes fitxes no en tenen, i és correcte que no en
  // tinguin — per això tot va amb ?? [].
  const messages = await getV2Messages(locale);
  const products = messages.Products as unknown as Record<
    string,
    Record<string, string[]>
  >;
  const raw = products[slug] ?? {};
  const paragraphs = raw.paragraphs ?? [];
  const features = raw.features ?? [];
  const notes = raw.notes ?? [];

  const images = productImages(product);
  const [hero, ...gallery] = images;

  const related = PRODUCT_SLUGS.filter((s) => s !== slug).slice(0, 3);
  const budgetMessage = `${tw("productIntro")} ${tp(`${slug}.name`)}`;

  return (
    <>
      <V2Breadcrumb
        locale={locale}
        siteUrl={SITE_URL}
        items={[
          { name: t("backToAll"), path: v2Path(locale, "colleccions") },
          { name: tp(`${slug}.name`), path: v2Path(locale, `colleccions/${slug}`) },
        ]}
      />

      <V2PageHeader
        title={tp(`${slug}.name`)}
        lead={tp(`${slug}.tagline`)}
        breadcrumb={{ href: v2Path(locale, "colleccions"), label: t("backToAll") }}
      />

      {/* Imatge principal a sang: el producte primer. */}
      <div className="relative aspect-[16/10] w-full bg-v2-linen md:aspect-[21/9]">
        <Image
          src={hero}
          alt={tp(`${slug}.name`)}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Section tone="paper">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            {/* Text */}
            <div className="lg:col-span-7">
              <p className="font-v2-sans text-v2-lead text-v2-ink">
                {tp(`${slug}.intro`)}
              </p>

              {paragraphs.filter(Boolean).map((p, i) => (
                <p key={i} className="mt-5 font-v2-sans text-v2-body text-v2-ink-2">
                  {p}
                </p>
              ))}

              {features.filter(Boolean).length > 0 && (
                <div className="mt-12">
                  <h2 className="font-v2-sans text-v2-eyebrow font-semibold uppercase text-v2-ink">
                    {t("featuresTitle")}
                  </h2>
                  <ul className="mt-5 border-t border-v2-bone" role="list">
                    {features.filter(Boolean).map((f, i) => (
                      <li
                        key={i}
                        className="flex gap-4 border-b border-v2-bone py-4 font-v2-sans text-v2-body text-v2-ink-2"
                      >
                        <span
                          className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-v2-brass"
                          aria-hidden="true"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {notes.filter(Boolean).length > 0 && (
                <div className="mt-12 border-l-2 border-v2-brass bg-v2-paper-2 p-7">
                  <h2 className="font-v2-sans text-v2-eyebrow font-semibold uppercase text-v2-brass-2">
                    {t("notesTitle")}
                  </h2>
                  <ul className="mt-4 space-y-3" role="list">
                    {notes.filter(Boolean).map((n, i) => (
                      <li key={i} className="font-v2-sans text-v2-sm text-v2-ink-2">
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Panell de contacte enganxat */}
            <aside className="lg:col-span-5">
              <div className="sticky top-28 border border-v2-bone bg-v2-paper-2 p-8">
                <h2 className="font-v2-display text-v2-h3 text-v2-ink">
                  {t("ctaTitle")}
                </h2>
                <p className="mt-4 font-v2-sans text-v2-sm text-v2-ink-2">
                  {t("ctaLead")}
                </p>

                {product.brands?.length ? (
                  <p className="mt-6 border-t border-v2-bone pt-5 font-v2-sans text-v2-xs uppercase tracking-wider text-v2-ink-3">
                    {product.brands.join(" · ")}
                  </p>
                ) : null}

                <div className="mt-7 flex flex-col gap-3">
                  <ButtonLink
                    href={v2Path(locale, "pressupost")}
                    variant="primary"
                    size="lg"
                    className="group w-full"
                  >
                    {tc("budgetShort")}
                    <ArrowRight />
                  </ButtonLink>
                  <a
                    href={whatsappUrl(budgetMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 bg-v2-green px-5 font-v2-sans text-v2-sm font-semibold text-white transition-all hover:brightness-95"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${V2_PHONE_TEL}`}
                    className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 border border-v2-ink/20 px-5 font-v2-sans text-v2-sm font-semibold text-v2-ink transition-colors hover:border-v2-ink"
                  >
                    <PhoneIcon className="h-4 w-4" />
                    {V2_PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {gallery.length > 0 && (
        <Section tone="paper-2" size="sm">
          <Container>
            <h2 className="font-v2-sans text-v2-eyebrow font-semibold uppercase text-v2-ink">
              {t("galleryTitle")}
            </h2>
            <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3" role="list">
              {gallery.map((src) => (
                <Reveal as="li" key={src}>
                  <div className="relative aspect-[4/5] overflow-hidden bg-v2-linen">
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="object-cover transition-transform duration-[900ms] ease-editorial hover:scale-[1.03]"
                    />
                  </div>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <Section tone="paper">
        <Container>
          <SectionHead title={t("relatedTitle")} as="h2" />
          <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-3" role="list">
            {related.map((s, i) => (
              <Reveal as="li" key={s} delay={i * 80}>
                <V2CollectionCard
                  locale={locale}
                  slug={s}
                  name={tp(`${s}.name`)}
                  tagline={tp(`${s}.tagline`)}
                  className="h-full"
                />
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
