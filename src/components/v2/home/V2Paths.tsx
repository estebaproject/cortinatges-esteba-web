import Link from "next/link";
import { V2_FAMILIES, v2Path } from "@/lib/v2/config";
import { getV2T } from "@/lib/v2/i18n";
import { ArrowRight } from "../ui/V2Button";
import { Container, Reveal, Section, SectionHead } from "../ui/primitives";

/**
 * Les tres portes d'entrada.
 *
 * La portada actual llança catorze blocs idèntics de cop —onze fitxes més tres
 * enllaços externs— i deixa que el visitant els ordeni tot sol. Aquí primer es
 * tria la família (tres opcions) i només després la peça: dues decisions
 * petites en comptes d'una de catorze, que és com decideix la gent.
 */
export default async function V2Paths({ locale }: { locale: string }) {
  const t = await getV2T(locale, "V2.home.paths");
  const tc = await getV2T(locale, "V2.cta");

  return (
    <Section tone="paper" id="per-on-comences">
      <Container>
        <SectionHead eyebrow={t("eyebrow")} title={t("headline")} />

        <ul className="mt-14 grid gap-px bg-v2-bone md:grid-cols-3" role="list">
          {V2_FAMILIES.map((family, i) => (
            <Reveal as="li" key={family.key} delay={i * 90}>
              <Link
                href={`${v2Path(locale, "colleccions")}#${family.key}`}
                className="group flex h-full flex-col justify-between gap-10 bg-v2-paper p-8 transition-colors duration-500 hover:bg-v2-paper-2 lg:p-10"
              >
                <div>
                  <span
                    className="font-v2-sans text-v2-eyebrow font-semibold text-v2-brass-2"
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                  <h3 className="mt-5 font-v2-display text-v2-h3 text-v2-ink">
                    {t(`${family.key}.title`)}
                  </h3>
                  <p className="mt-4 font-v2-sans text-v2-body text-v2-ink-2">
                    {t(`${family.key}.desc`)}
                  </p>
                </div>
                <span className="inline-flex items-center gap-3 font-v2-sans text-v2-sm font-semibold text-v2-ink">
                  {tc("count", { n: family.slugs.length })}
                  <span className="h-px w-8 bg-v2-brass" aria-hidden="true" />
                  <ArrowRight />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
