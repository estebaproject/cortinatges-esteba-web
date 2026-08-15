import { V2_DECORESTEBA, V2_FAMILIES, v2Path } from "@/lib/v2/config";
import { getV2T } from "@/lib/v2/i18n";
import V2CollectionCard from "../V2CollectionCard";
import { ArrowRight, ButtonLink } from "../ui/V2Button";
import { Container, Reveal, Section, SectionHead } from "../ui/primitives";

/**
 * Les onze col·leccions, agrupades per família.
 *
 * La v1 les pinta totes seguides en una graella de tres columnes barrejades amb
 * tres enllaços externs a decoresteba.com i una imatge del segell dels 60 anys
 * al mig. Resultat: quinze caselles del mateix pes visual, tres de les quals
 * te'n treuen del web sense avisar.
 *
 * Aquí els enllaços externs surten de la graella i tenen el seu propi bloc, ben
 * etiquetat: qui hi clica sap que canvia de marca.
 */
export default async function V2Families({ locale }: { locale: string }) {
  const t = await getV2T(locale, "V2.home.families");
  const tc = await getV2T(locale, "V2.cta");
  const tp = await getV2T(locale, "Products");

  return (
    <Section tone="paper" id="colleccions">
      <Container>
        <SectionHead
          eyebrow={t("eyebrow")}
          title={t("headline")}
          lead={t("lead")}
          action={
            <ButtonLink
              href={v2Path(locale, "colleccions")}
              variant="secondary"
              className="group"
            >
              {tc("seeAll")}
              <ArrowRight />
            </ButtonLink>
          }
        />

        <div className="mt-16 flex flex-col gap-16">
          {V2_FAMILIES.map((family) => (
            <div key={family.key} id={family.key} className="scroll-mt-28">
              <div className="mb-8 flex items-baseline gap-5">
                <h3 className="font-v2-sans text-v2-eyebrow font-semibold uppercase text-v2-ink">
                  {t(family.key)}
                </h3>
                <span className="h-px flex-1 bg-v2-bone" aria-hidden="true" />
              </div>

              <ul
                className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
                role="list"
              >
                {family.slugs.map((slug, i) => (
                  <Reveal as="li" key={slug} delay={(i % 3) * 80}>
                    <V2CollectionCard
                      locale={locale}
                      slug={slug}
                      name={tp(`${slug}.name`)}
                      tagline={tp(`${slug}.tagline`)}
                      className="h-full"
                    />
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Exterior: marca germana. Es diu clarament, en comptes de barrejar-ho
            amb el catàleg propi com fa la portada actual. */}
        <Reveal className="mt-16 flex flex-col gap-6 border-t border-v2-bone pt-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-v2-prose">
            <h3 className="font-v2-display text-v2-h3 text-v2-ink">
              {t("exterior.title")}
            </h3>
            <p className="mt-2.5 font-v2-sans text-v2-body text-v2-ink-2">
              {t("exterior.desc")}
            </p>
          </div>
          <ButtonLink
            href={V2_DECORESTEBA}
            external
            variant="secondary"
            className="group shrink-0"
          >
            {t("exterior.cta")}
            <ArrowRight />
          </ButtonLink>
        </Reveal>
      </Container>
    </Section>
  );
}
