import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { V2_DECORESTEBA, V2_FAMILIES, v2Path } from "@/lib/v2/config";
import { getV2T } from "@/lib/v2/i18n";
import { getProduct } from "@/lib/products";
import V2PageHeader, { V2Breadcrumb } from "@/components/v2/V2PageHeader";
import V2CollectionCard from "@/components/v2/V2CollectionCard";
import { ArrowRight, ButtonLink } from "@/components/v2/ui/V2Button";
import { Container, Reveal, Section } from "@/components/v2/ui/primitives";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getV2T(locale, "V2.collections");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

/**
 * Índex de col·leccions, agrupat per família.
 *
 * La pàgina equivalent de la web actual llista les onze fitxes seguides sense
 * cap agrupació i amb la foto tapada pel mateix vel arena de la portada. Aquí
 * cada família té la seva àncora (#cortines, #estors, #complements) perquè els
 * blocs de la portada hi puguin apuntar directament.
 */
export default async function V2CollectionsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getV2T(locale, "V2.collections");
  const th = await getV2T(locale, "V2.home.families");
  const tp = await getV2T(locale, "Products");
  const tn = await getV2T(locale, "V2.nav");

  return (
    <>
      <V2Breadcrumb
        locale={locale}
        siteUrl={SITE_URL}
        items={[{ name: t("eyebrow"), path: v2Path(locale, "colleccions") }]}
      />

      <V2PageHeader eyebrow={t("eyebrow")} title={t("headline")} lead={t("lead")} />

      <Section tone="paper">
        <Container>
          <div className="flex flex-col gap-20">
            {V2_FAMILIES.map((family) => (
              <div key={family.key} id={family.key} className="scroll-mt-28">
                <div className="mb-9 flex items-baseline gap-5">
                  <h2 className="font-v2-display text-v2-h2 text-v2-ink">
                    {th(family.key)}
                  </h2>
                  <span className="h-px flex-1 bg-v2-bone" aria-hidden="true" />
                </div>

                <ul
                  className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
                  role="list"
                >
                  {family.slugs.map((slug, i) => {
                    const product = getProduct(slug);
                    return (
                      <Reveal as="li" key={slug} delay={(i % 3) * 80}>
                        <V2CollectionCard
                          locale={locale}
                          slug={slug}
                          name={tp(`${slug}.name`)}
                          tagline={tp(`${slug}.tagline`)}
                          className="h-full"
                        />
                        {product?.brands?.length ? (
                          <p className="mt-3 font-v2-sans text-v2-xs uppercase tracking-wider text-v2-ink-3">
                            {t("brandsLabel")}: {product.brands.join(" · ")}
                          </p>
                        ) : null}
                      </Reveal>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <Reveal className="mt-20 flex flex-col gap-6 border-t border-v2-bone pt-10 md:flex-row md:items-center md:justify-between">
            <div className="max-w-v2-prose">
              <h2 className="font-v2-display text-v2-h3 text-v2-ink">
                {th("exterior.title")}
              </h2>
              <p className="mt-2.5 font-v2-sans text-v2-body text-v2-ink-2">
                {th("exterior.desc")}
              </p>
            </div>
            <ButtonLink href={V2_DECORESTEBA} external variant="secondary" className="group shrink-0">
              {th("exterior.cta")}
              <ArrowRight />
            </ButtonLink>
          </Reveal>
        </Container>
      </Section>

      <Section tone="ink" size="sm" className="weave">
        <Container>
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-v2-prose font-v2-display text-v2-h3 text-v2-paper">
              {th("headline")}
            </p>
            <ButtonLink
              href={v2Path(locale, "pressupost")}
              variant="onDark"
              size="lg"
              className="group shrink-0"
            >
              {tn("cta")}
              <ArrowRight />
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
