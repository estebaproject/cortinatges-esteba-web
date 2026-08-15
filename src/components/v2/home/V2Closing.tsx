import {
  V2_EMAIL,
  V2_PHONE_DISPLAY,
  V2_PHONE_TEL,
  V2_STORES,
} from "@/lib/v2/config";
import { publicPath } from "@/lib/site";
import { getV2T } from "@/lib/v2/i18n";
import V2LeadForm from "../V2LeadForm";
import { MailIcon, PhoneIcon } from "../ui/icons";
import { Container, Eyebrow, Reveal, Section } from "../ui/primitives";

/**
 * Tancament de la portada.
 *
 * UN SOL tancament. La portada actual n'encadena dos: LocationsSection acaba
 * amb "troba la botiga més propera" i tot seguit CtaVisita torna a demanar
 * "concerta una cita" i "troba la botiga més propera" un altre cop. Dues crides
 * seguides que demanen el mateix es fan nosa entre elles.
 *
 * I sobretot: aquí hi ha el FORMULARI, no un enllaç cap al formulari. Cada salt
 * de pàgina abans d'escriure es menja una part dels que hi anaven.
 */
export default async function V2Closing({ locale }: { locale: string }) {
  const t = await getV2T(locale, "V2.home.closing");

  return (
    <Section tone="ink" className="weave" id="pressupost">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <Eyebrow tone="paper" className="mb-4">
              {t("eyebrow")}
            </Eyebrow>
            <h2 className="font-v2-display text-v2-h1 text-balance text-v2-paper">
              {t("headline")}
            </h2>
            <p className="mt-6 max-w-v2-prose font-v2-sans text-v2-lead text-v2-paper/70">
              {t("lead")}
            </p>

            <div className="mt-10 border-t border-v2-paper/15 pt-8">
              <p className="font-v2-sans text-v2-sm text-v2-paper/55">{t("orCall")}</p>
              <a
                href={`tel:${V2_PHONE_TEL}`}
                className="mt-3 inline-flex items-center gap-3 font-v2-display text-v2-h3 text-v2-paper transition-colors hover:text-v2-brass"
              >
                <PhoneIcon className="h-5 w-5 text-v2-brass" />
                {V2_PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${V2_EMAIL}`}
                className="mt-4 flex items-center gap-3 font-v2-sans text-v2-sm text-v2-paper/60 transition-colors hover:text-v2-paper"
              >
                <MailIcon className="h-4 w-4 text-v2-brass" />
                {V2_EMAIL}
              </a>

              <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2" role="list">
                {V2_STORES.filter((s) => s.key !== "matalasseria").map((store) => (
                  <li key={store.key}>
                    <a
                      href={`tel:${store.phoneTel}`}
                      className="font-v2-sans text-v2-sm text-v2-paper/55 transition-colors hover:text-v2-brass"
                    >
                      <span className="text-v2-paper/80">{store.city}</span>{" "}
                      {store.phoneDisplay}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-7">
            <V2LeadForm privacyHref={publicPath("/privacitat", locale)} tone="dark" />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
