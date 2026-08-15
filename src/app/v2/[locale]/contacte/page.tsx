import type { Metadata } from "next";
import { SITE_URL, publicPath } from "@/lib/site";
import {
  V2_EMAIL,
  V2_PHONE_DISPLAY,
  V2_PHONE_TEL,
  V2_STORES,
  v2Path,
} from "@/lib/v2/config";
import { getV2T } from "@/lib/v2/i18n";
import { whatsappUrl } from "@/lib/whatsapp";
import V2PageHeader, { V2Breadcrumb } from "@/components/v2/V2PageHeader";
import V2LeadForm from "@/components/v2/V2LeadForm";
import { ArrowRight, ButtonLink } from "@/components/v2/ui/V2Button";
import {
  ClockIcon,
  MailIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/v2/ui/icons";
import { Container, Reveal, Section } from "@/components/v2/ui/primitives";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getV2T(locale, "V2.contact");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

/**
 * Pàgina de contacte.
 *
 * La pàgina equivalent de la web actual posa el formulari primer i amaga el
 * telèfon en una columna lateral discreta. En un negoci local això va al revés
 * del que fa la gent: qui té pressa truca, i qui no la té escriu. Per això aquí
 * els canals directes ocupen una columna sencera i el telèfon es compon com un
 * titular, no com una línia de peu.
 *
 * Les dues columnes conviuen a la MATEIXA pantalla: obligar a triar entre
 * "truca" i "escriu" en dues pàgines diferents només afegeix un clic al camí.
 */
export default async function V2ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getV2T(locale, "V2.contact");
  const tc = await getV2T(locale, "V2.cta");
  const tn = await getV2T(locale, "V2.nav");
  const th = await getV2T(locale, "V2.home.stores");
  const tl = await getV2T(locale, "Locations");
  const tw = await getV2T(locale, "Whatsapp");

  // Només els tres punts de venda. La matalasseria comparteix telèfon amb
  // Girona: repetir-lo aquí faria pensar que hi ha quatre números diferents.
  const shops = V2_STORES.filter((s) => s.key !== "matalasseria");

  return (
    <>
      <V2Breadcrumb
        locale={locale}
        siteUrl={SITE_URL}
        items={[{ name: t("eyebrow"), path: v2Path(locale, "contacte") }]}
      />

      <V2PageHeader eyebrow={t("eyebrow")} title={t("headline")} lead={t("lead")} />

      <Section tone="paper">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            {/* --- Canals directes --------------------------------------- */}
            <Reveal className="lg:col-span-5">
              <h2 className="rule-brass font-v2-display text-v2-h2 text-v2-ink">
                {t("directTitle")}
              </h2>

              <a
                href={`tel:${V2_PHONE_TEL}`}
                className="mt-10 inline-flex min-h-[48px] items-center gap-3.5 font-v2-display text-v2-h2 text-v2-ink transition-colors hover:text-v2-brass-2"
              >
                <PhoneIcon className="h-6 w-6 shrink-0 text-v2-brass-2" />
                {V2_PHONE_DISPLAY}
              </a>

              <a
                href={`mailto:${V2_EMAIL}`}
                className="mt-4 flex min-h-[48px] items-center gap-3.5 font-v2-sans text-v2-body text-v2-ink-2 transition-colors hover:text-v2-brass-2"
              >
                <MailIcon className="h-5 w-5 shrink-0 text-v2-brass-2" />
                {V2_EMAIL}
              </a>

              {/* El WhatsApp va amb el missatge ja escrit i traduït: qui obre
                  l'app no ha de pensar com començar la conversa. */}
              <ButtonLink
                href={whatsappUrl(tw("budgetIntro"))}
                external
                variant="whatsapp"
                size="lg"
                className="mt-8"
                icon={<WhatsAppIcon className="h-5 w-5" />}
              >
                {tc("whatsapp")}
              </ButtonLink>

              <div className="mt-12 border-t border-v2-bone pt-9">
                <p className="font-v2-sans text-v2-xs font-semibold uppercase tracking-wider text-v2-ink-3">
                  {tn("stores")}
                </p>

                {/* Cada botiga amb el SEU telèfon. La centraleta única de la web
                    actual fa que qui vol Blanes acabi trucant a Girona. */}
                <ul className="mt-5 flex flex-col divide-y divide-v2-bone" role="list">
                  {shops.map((store) => (
                    <li key={store.key}>
                      <a
                        href={`tel:${store.phoneTel}`}
                        className="flex min-h-[48px] items-center justify-between gap-4 py-3 transition-colors hover:text-v2-brass-2"
                      >
                        <span className="font-v2-sans text-v2-body font-semibold text-v2-ink">
                          {tl(`stores.${store.key}.city`)}
                        </span>
                        <span className="font-v2-sans text-v2-body text-v2-ink-2">
                          {store.phoneDisplay}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex items-start gap-3.5">
                  <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-v2-brass-2" />
                  <div>
                    <p className="font-v2-sans text-v2-xs font-semibold uppercase tracking-wider text-v2-ink-3">
                      {th("scheduleLabel")}
                    </p>
                    <p className="mt-1 font-v2-sans text-v2-sm text-v2-ink-2">
                      {th("schedule")}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* --- Formulari ---------------------------------------------- */}
            <Reveal delay={120} className="lg:col-span-7">
              <h2 className="rule-brass font-v2-display text-v2-h2 text-v2-ink">
                {t("formTitle")}
              </h2>
              {/* Mateix formulari i mateix backend que la portada: /api/lead amb
                  el seu esquer antispam. Aquí en to clar perquè va sobre paper. */}
              <div className="mt-10">
                <V2LeadForm privacyHref={publicPath("/privacitat", locale)} />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Tancament curt cap a les botigues, NO cap a pressupost: el formulari de
          pressupost és just aquí sobre i repetir-hi la crida seria demanar dos
          cops el mateix. El que encara no s'ha ofert en aquesta pàgina és venir
          a tocar el teixit. */}
      <Section tone="paper-2" size="sm">
        <Container>
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-v2-prose">
              <p className="font-v2-display text-v2-h3 text-balance text-v2-ink">
                {th("headline")}
              </p>
              <p className="mt-3 font-v2-sans text-v2-body text-v2-ink-2">
                {th("lead")}
              </p>
            </div>
            <ButtonLink
              href={v2Path(locale, "botigues")}
              variant="secondary"
              size="lg"
              className="group shrink-0"
            >
              {tc("stores")}
              <ArrowRight />
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
