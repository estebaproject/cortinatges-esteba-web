import { V2_FAQ_KEYS } from "@/lib/v2/config";
import { getV2T } from "@/lib/v2/i18n";
import { PlusIcon } from "../ui/icons";
import { Container, Reveal, Section, SectionHead } from "../ui/primitives";

/**
 * Preguntes freqüents.
 *
 * Fa dues feines alhora i la web actual no en fa cap de les dues:
 *
 * · Mata les sis objeccions que arriben per telèfon cada dia (cost, termini,
 *   qui instal·la, fins on arribeu) abans que siguin motiu per no escriure.
 * · Emet dades estructurades FAQPage. El lloc actual no té ni un sol bloc de
 *   FAQ i, per tant, cap possibilitat de sortir com a resposta destacada a
 *   "quant es triga a fer unes cortines a mida".
 *
 * Fet amb <details>/<summary> natius: obre i tanca amb teclat, es pot cercar
 * amb Ctrl+F encara que estigui plegat i no costa ni un byte de JavaScript.
 * Un acordió fet a mà amb estat de React aquí seria feina de més i pitjor.
 */
export default async function V2Faq({ locale }: { locale: string }) {
  const t = await getV2T(locale, "V2.home.faq");

  const items = V2_FAQ_KEYS.map((key) => ({
    key,
    q: t(`items.${key}.q`),
    a: t(`items.${key}.a`),
  }));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <Section tone="paper" id="dubtes">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHead eyebrow={t("eyebrow")} title={t("headline")} />
          </div>

          <div className="lg:col-span-8">
            <ul className="border-t border-v2-bone" role="list">
              {items.map((item, i) => (
                <Reveal as="li" key={item.key} delay={i * 50}>
                  <details className="group border-b border-v2-bone">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                      <h3 className="font-v2-display text-v2-h3 text-v2-ink transition-colors group-open:text-v2-brass-2">
                        {item.q}
                      </h3>
                      <PlusIcon className="mt-1 h-5 w-5 shrink-0 text-v2-brass-2 transition-transform duration-300 group-open:rotate-45" />
                    </summary>
                    <p className="max-w-v2-prose pb-7 font-v2-sans text-v2-body text-v2-ink-2">
                      {item.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
