import { V2_PROCESS_KEYS } from "@/lib/v2/config";
import { getV2T } from "@/lib/v2/i18n";
import { DocIcon, DrillIcon, RulerIcon, ScissorsIcon } from "../ui/icons";
import { Container, Reveal, Section, SectionHead } from "../ui/primitives";

const ICONS = {
  mides: RulerIcon,
  pressupost: DocIcon,
  taller: ScissorsIcon,
  installacio: DrillIcon,
} as const;

/**
 * Com treballem: quatre passos amb termini.
 *
 * Aquesta secció no existeix a la web actual, i és probablement el forat més
 * car que hi ha. Davant d'un producte a mida el fre no és el preu: és no saber
 * en què t'estàs ficant —quantes visites, quant s'hi triga, qui ve a casa, qui
 * penja la cortina. Posar el camí sencer amb terminis reals treu aquest fre
 * abans que s'arribi al formulari.
 *
 * El bloc va sobre fons fosc a propòsit: és el moment en què la pàgina para de
 * mostrar producte i explica com funciona la casa.
 */
export default async function V2Process({ locale }: { locale: string }) {
  const t = await getV2T(locale, "V2.home.process");

  return (
    <Section tone="ink" id="com-treballem" className="weave">
      <Container>
        <SectionHead
          eyebrow={t("eyebrow")}
          title={t("headline")}
          lead={t("lead")}
          tone="paper"
        />

        <ol className="mt-16 grid gap-px bg-v2-paper/12 md:grid-cols-2 lg:grid-cols-4" role="list">
          {V2_PROCESS_KEYS.map((key, i) => {
            const Icon = ICONS[key];
            return (
              <Reveal as="li" key={key} delay={i * 90}>
                <div className="flex h-full flex-col bg-v2-ink p-8 lg:p-9">
                  <div className="flex items-center justify-between">
                    <span className="font-v2-sans text-v2-eyebrow font-semibold uppercase text-v2-brass">
                      {t("stepLabel", { n: i + 1 })}
                    </span>
                    <Icon className="h-6 w-6 text-v2-paper/45" />
                  </div>

                  <h3 className="mt-7 font-v2-display text-v2-h3 text-v2-paper">
                    {t(`steps.${key}.title`)}
                  </h3>

                  <p className="mt-4 flex-1 font-v2-sans text-v2-sm text-v2-paper/65">
                    {t(`steps.${key}.desc`)}
                  </p>

                  <p className="mt-7 inline-flex w-fit items-center border border-v2-brass/45 px-3 py-1.5 font-v2-sans text-v2-xs font-semibold uppercase tracking-wider text-v2-brass">
                    {t(`steps.${key}.time`)}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ol>

        <p className="mt-8 font-v2-sans text-v2-xs text-v2-paper/45">{t("note")}</p>
      </Container>
    </Section>
  );
}
