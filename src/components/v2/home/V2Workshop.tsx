import Image from "next/image";
import { v2Path, v2Years } from "@/lib/v2/config";
import { getV2T } from "@/lib/v2/i18n";
import { ArrowRight, ButtonLink } from "../ui/V2Button";
import { Container, Eyebrow, Reveal, Section } from "../ui/primitives";

/**
 * El taller, en versió curta.
 *
 * A la portada actual la història de la casa ocupa DUES seccions seguides
 * (ArtisanBand i SectionOfici) que diuen gairebé el mateix, i totes dues pinten
 * la MATEIXA imatge —60_anys.webp—, que a més ja surt al mig de la graella de
 * productes. Tres aparicions del mateix segell a la mateixa pàgina.
 *
 * Aquí n'hi ha una, amb la foto del taller, i el relat llarg viu a la seva
 * pàgina.
 */
export default async function V2Workshop({ locale }: { locale: string }) {
  const t = await getV2T(locale, "V2.home.workshop");

  const stats = [
    { value: String(v2Years()), label: t("stats.years") },
    { value: "3", label: t("stats.stores") },
    { value: "3", label: t("stats.generations") },
  ];

  return (
    <Section tone="paper" id="la-casa">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal as="figure" className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden bg-v2-linen">
              <Image
                src="/images/serveis/confeccio.jpg"
                alt={t("imageAlt")}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <Eyebrow className="mb-4">{t("eyebrow")}</Eyebrow>
            <h2 className="font-v2-display text-v2-h2 text-balance text-v2-ink">
              {t("headline")}
            </h2>
            <p className="mt-6 font-v2-sans text-v2-body text-v2-ink-2">
              {t("paragraph1")}
            </p>
            <p className="mt-4 font-v2-sans text-v2-body text-v2-ink-2">
              {t("paragraph2")}
            </p>

            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-v2-bone pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-v2-display text-v2-h2 leading-none text-v2-brass-2">
                      {stat.value}
                    </span>
                    <span className="mt-2 block font-v2-sans text-v2-xs text-v2-ink-2">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <ButtonLink
              href={v2Path(locale, "el-taller")}
              variant="secondary"
              className="group mt-10"
            >
              {t("cta")}
              <ArrowRight />
            </ButtonLink>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
