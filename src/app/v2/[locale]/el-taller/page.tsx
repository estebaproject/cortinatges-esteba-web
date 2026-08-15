import type { Metadata } from "next";
import Image from "next/image";
import { SITE_URL } from "@/lib/site";
import { v2Path, v2Years } from "@/lib/v2/config";
import { getV2T } from "@/lib/v2/i18n";
import V2PageHeader, { V2Breadcrumb } from "@/components/v2/V2PageHeader";
import { ArrowRight, ButtonLink } from "@/components/v2/ui/V2Button";
import {
  Container,
  Reveal,
  Section,
  SectionHead,
} from "@/components/v2/ui/primitives";

/**
 * Ordre explícit de la cronologia.
 *
 * Les claus de `V2.about.timeline` són anys, i tot i que un motor de JS ordena
 * les claus numèriques de manera ascendent, aquí l'ordre és narratiu, no
 * alfabètic: el dia que s'hi afegeixi una fita que no sigui un any rodó
 * («2010-2015») la iteració sobre `Object.keys` deixaria de tenir sentit. La
 * llista es declara, no s'endevina.
 */
const TIMELINE_YEARS = ["1961", "1990", "2005", "2021", "2026"] as const;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getV2T(locale, "V2.about");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

/**
 * El taller.
 *
 * La pàgina "Nosaltres" de la web actual és una columna centrada de tres
 * paràgrafs i una graella de quatre valors: explica QUI som però no demostra
 * res. Aquí el mateix relat —el copy es llegeix del namespace `About`, que ja
 * existeix i no es duplica en quatre idiomes— va acompanyat de les tres coses
 * que sí que es poden comprovar: la cronologia de la casa, les xifres i el que
 * ens diferencia.
 *
 * NO s'hi fa servir /images/60_anys.webp tot i estar disponible: és una imatge
 * amb el número 60 imprès a dins, és a dir, un text que va caducar el 2022 i
 * que ningú pot corregir sense obrir el Photoshop. Precisament el problema que
 * aquesta pàgina intenta no repetir.
 */
export default async function V2AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getV2T(locale, "V2.about");
  const ta = await getV2T(locale, "About");
  const tw = await getV2T(locale, "V2.home.workshop");
  const tb = await getV2T(locale, "V2.ctaBlock");
  const tc = await getV2T(locale, "V2.cta");

  // Els quatre valors venien del namespace `About` de la web actual, però el
  // quart hi diu literalment "60 anys d'experiència": es va redactar el 2021 i
  // ha quedat congelat. A la mateixa pantalla, les xifres de sota calculen 65 i
  // la pàgina es contradeia a si mateixa. Per això la v2 té els seus,
  // redactats sense cap número dins del text.
  const VALUE_KEYS = ["confeccio", "atencio", "installacio", "generacions"] as const;

  // Les xifres es CALCULEN. Escriure "60" aquí seria repetir l'error que té la
  // web actual a mitja dotzena de llocs: un número correcte el dia que es va
  // escriure i fals des de l'endemà.
  const stats = [
    { value: String(v2Years()), label: tw("stats.years") },
    { value: "3", label: tw("stats.stores") },
    { value: "3", label: tw("stats.generations") },
  ];

  return (
    <>
      <V2Breadcrumb
        locale={locale}
        siteUrl={SITE_URL}
        items={[{ name: t("eyebrow"), path: v2Path(locale, "el-taller") }]}
      />

      <V2PageHeader eyebrow={t("eyebrow")} title={t("headline")} lead={t("lead")} />

      {/* El relat, en dues columnes asimètriques: el text no s'ha d'estirar fins
          als 1440px de la graella —a partir d'uns 62 caràcters l'ull perd la
          línia— i la resta de l'ample se'l queden les fotos. La web actual
          resol això centrant-ho tot, que és una altra manera d'aconseguir el
          mateix però sense donar-li protagonisme a cap de les dues coses. */}
      <Section tone="paper" label={t("eyebrow")}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <p className="max-w-v2-prose font-v2-sans text-v2-lead text-v2-ink">
                {ta("story1")}
              </p>
              <p className="mt-6 max-w-v2-prose font-v2-sans text-v2-body text-v2-ink-2">
                {ta("story2")}
              </p>
              <p className="mt-4 max-w-v2-prose font-v2-sans text-v2-body text-v2-ink-2">
                {ta("story3")}
              </p>
            </Reveal>

            {/* Fotos amb alt="" a consciència: no aporten cap dada que el text
                del costat no doni ja, i un alt descriptiu aquí només faria que
                el lector de pantalla repetís la mateixa frase dues vegades. */}
            <Reveal delay={120} className="lg:col-span-7">
              <div className="relative aspect-[4/3] overflow-hidden bg-v2-linen">
                <Image
                  src="/images/serveis/confeccio.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
              </div>

              {/* La segona foto va desplaçada i més petita: dues imatges del
                  mateix pes, una sota l'altra, es llegeixen com una graella i
                  no com un relat. */}
              <div className="relative mt-6 aspect-[16/10] overflow-hidden bg-v2-linen lg:ml-24 lg:mt-8">
                <Image
                  src="/images/serveis/mides.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 44vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Xifres. Van soles en una banda pròpia i no amagades dins del relat:
          són el resum que llegeix qui no llegirà els tres paràgrafs. */}
      <Section tone="linen" size="sm">
        <Container>
          <dl className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 90}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-v2-display text-v2-h1 leading-none text-v2-brass-2">
                    {stat.value}
                  </span>
                  <span className="mt-4 block font-v2-sans text-v2-sm text-v2-ink-2">
                    {stat.label}
                  </span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </Container>
      </Section>

      {/* Cronologia. És el que converteix "tres generacions" —una frase que pot
          escriure qualsevol— en una cosa comprovable: quatre dates i què va
          passar a cadascuna. */}
      <Section tone="paper">
        <Container>
          <SectionHead title={t("timelineTitle")} />

          {/* La línia de connexió és un element a part, absolut, i NO un
              `border-l` a cada element: així recorre la llista sencera sense
              deixar el tall que quedaria entre element i element amb el `gap`
              pel mig. Va amb aria-hidden perquè no diu res, només dibuixa. */}
          <div className="relative mt-14 max-w-3xl">
            <span
              aria-hidden="true"
              className="absolute bottom-8 left-[5px] top-4 w-px bg-v2-bone"
            />

            <ol className="flex flex-col gap-12" role="list">
              {TIMELINE_YEARS.map((year, i) => (
                <Reveal as="li" key={year} delay={i * 70} className="relative pl-10">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full bg-v2-brass ring-4 ring-v2-paper"
                  />
                  <p className="font-v2-display text-v2-h2 leading-none text-v2-brass-2">
                    {year}
                  </p>
                  <p className="mt-4 max-w-v2-prose font-v2-sans text-v2-body text-v2-ink-2">
                    {t(`timeline.${year}`)}
                  </p>
                </Reveal>
              ))}
            </ol>

            {/* Els anys de 1990, 2005 i 2021 estan pendents de confirmar amb la
                família. Es diu aquí, a la vista, en comptes de publicar-los com
                si fossin certs: una data inventada en una pàgina d'història és
                exactament el que fa que no et creguin la resta. */}
            <p className="mt-12 max-w-v2-prose font-v2-sans text-v2-xs text-v2-ink-3">
              {t("timelineNote")}
            </p>
          </div>
        </Container>
      </Section>

      {/* Valors. Quatre, en una sola fila en desktop: són un tancament del
          relat, no el contingut principal de la pàgina, i per això no porten
          ni icona ni caixa. El filet de llautó ja els separa prou. */}
      <Section tone="paper-2">
        <Container>
          <SectionHead title={t("valuesTitle")} />

          <ul
            className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
            role="list"
          >
            {VALUE_KEYS.map((key, i) => (
              <Reveal as="li" key={key} delay={(i % 4) * 80}>
                <div className="border-t border-v2-bone pt-6">
                  <span className="font-v2-sans text-v2-eyebrow font-semibold uppercase text-v2-brass-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-v2-display text-v2-h3 text-v2-ink">
                    {t(`values.${key}.title`)}
                  </h3>
                  <p className="mt-3 font-v2-sans text-v2-sm text-v2-ink-2">
                    {t(`values.${key}.desc`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="ink" size="sm" className="weave">
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
