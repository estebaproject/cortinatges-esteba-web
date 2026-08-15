import type { Metadata } from "next";
import Image from "next/image";
import { SITE_URL } from "@/lib/site";
import {
  V2_PROCESS_KEYS,
  V2_SERVICE_KEYS,
  V2_SERVICE_PHOTOS,
  v2Path,
} from "@/lib/v2/config";
import { getV2T } from "@/lib/v2/i18n";
import V2PageHeader, { V2Breadcrumb } from "@/components/v2/V2PageHeader";
import { ArrowRight, ButtonLink } from "@/components/v2/ui/V2Button";
import {
  DocIcon,
  DrillIcon,
  RulerIcon,
  ScissorsIcon,
} from "@/components/v2/ui/icons";
import {
  Container,
  Reveal,
  Section,
  SectionHead,
} from "@/components/v2/ui/primitives";

const PROCESS_ICONS = {
  mides: RulerIcon,
  pressupost: DocIcon,
  taller: ScissorsIcon,
  installacio: DrillIcon,
} as const;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getV2T(locale, "V2.services");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

/**
 * Serveis.
 *
 * La pàgina equivalent de la web actual llista els cinc serveis com cinc blocs
 * de text solts, sense dir mai en quin ORDRE passen ni què ha de fer el client
 * a continuació. Aquí els cinc serveis segueixen sent els mateixos —el copy es
 * llegeix del namespace `Serveis`, que ja existeix i no es duplica— però a sota
 * s'hi enganxa el camí de quatre passos amb terminis: "què fem" i "com va" no
 * són dues pàgines diferents per a qui està decidint.
 */
export default async function V2ServicesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getV2T(locale, "V2.services");
  // Els noms i descripcions dels serveis viuen al namespace de la web actual:
  // són dades de fet, no copy nou de la v2, i duplicar-los seria condemnar-los
  // a divergir en quatre idiomes.
  const ts = await getV2T(locale, "Serveis");
  const tp = await getV2T(locale, "V2.home.process");
  const tb = await getV2T(locale, "V2.ctaBlock");
  const tc = await getV2T(locale, "V2.cta");

  return (
    <>
      <V2Breadcrumb
        locale={locale}
        siteUrl={SITE_URL}
        items={[{ name: t("eyebrow"), path: v2Path(locale, "serveis") }]}
      />

      <V2PageHeader eyebrow={t("eyebrow")} title={t("headline")} lead={t("lead")} />

      {/* Sense capçalera de secció: el titular de la pàgina ja ha dit què és
          això, i repetir-ho aquí seria el mateix pronunciament dues vegades.
          La secció es nomena per a lectors de pantalla amb `label`. */}
      <Section tone="paper" label={t("eyebrow")}>
        <Container>
          <ul
            className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {V2_SERVICE_KEYS.map((key, i) => (
              <Reveal as="li" key={key} delay={(i % 3) * 80}>
                {/* `group` al contenidor i no a un enllaç: aquestes targetes no
                    porten enlloc, així que el zoom és només un senyal de vida en
                    passar-hi per sobre, no la promesa d'un clic que no existeix. */}
                <article className="group flex h-full flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden bg-v2-linen">
                    <Image
                      src={V2_SERVICE_PHOTOS[key]}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 92vw"
                      className="object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.04]"
                    />
                  </div>

                  <h2 className="mt-5 font-v2-display text-v2-h3 text-v2-ink">
                    {ts(`items.${key}.name`)}
                  </h2>

                  <p className="mt-2.5 font-v2-sans text-v2-body text-v2-ink-2">
                    {ts(`items.${key}.desc`)}
                  </p>
                </article>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* El mateix bloc de procés que la portada, repetit a propòsit: qui entra
          a Serveis des d'un cercador no ha passat mai per la portada, i el que
          frena la petició no és el catàleg de serveis sinó no saber quantes
          visites, quant s'hi triga i qui ve a casa. NO s'importa V2Process
          perquè aquell component ja porta el seu <Section> amb ancoratge propi
          de portada; aquí es torna a compondre amb els mateixos ingredients. */}
      <Section tone="ink" className="weave">
        <Container>
          <SectionHead
            eyebrow={tp("eyebrow")}
            title={tp("headline")}
            lead={tp("lead")}
            tone="paper"
          />

          <ol
            className="mt-16 grid gap-px bg-v2-paper/12 md:grid-cols-2 lg:grid-cols-4"
            role="list"
          >
            {V2_PROCESS_KEYS.map((key, i) => {
              const Icon = PROCESS_ICONS[key];
              return (
                <Reveal as="li" key={key} delay={i * 90}>
                  <div className="flex h-full flex-col bg-v2-ink p-8 lg:p-9">
                    <div className="flex items-center justify-between">
                      <span className="font-v2-sans text-v2-eyebrow font-semibold uppercase text-v2-brass">
                        {tp("stepLabel", { n: i + 1 })}
                      </span>
                      <Icon className="h-6 w-6 text-v2-paper/45" />
                    </div>

                    <h3 className="mt-7 font-v2-display text-v2-h3 text-v2-paper">
                      {tp(`steps.${key}.title`)}
                    </h3>

                    <p className="mt-4 flex-1 font-v2-sans text-v2-sm text-v2-paper/65">
                      {tp(`steps.${key}.desc`)}
                    </p>

                    <p className="mt-7 inline-flex w-fit items-center border border-v2-brass/45 px-3 py-1.5 font-v2-sans text-v2-xs font-semibold uppercase tracking-wider text-v2-brass">
                      {tp(`steps.${key}.time`)}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </ol>

          <p className="mt-8 font-v2-sans text-v2-xs text-v2-paper/45">
            {tp("note")}
          </p>
        </Container>
      </Section>

      {/* El tancament ve just després d'un altre bloc fosc: sense el filet
          superior els dos es fondrien en una sola taca i la crida perdria el
          seu propi pes. */}
      <Section tone="ink" size="sm" className="weave border-t border-v2-paper/12">
        <Container>
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-v2-prose">
              <p className="font-v2-display text-v2-h3 text-v2-paper">
                {tb("headline")}
              </p>
              <p className="mt-3 font-v2-sans text-v2-sm text-v2-paper/65">
                {tb("lead")}
              </p>
            </div>
            <ButtonLink
              href={v2Path(locale, "pressupost")}
              variant="onDark"
              size="lg"
              className="group shrink-0"
            >
              {tc("budget")}
              <ArrowRight />
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
