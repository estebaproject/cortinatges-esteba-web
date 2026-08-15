import type { Metadata } from "next";
import { SITE_URL, publicPath } from "@/lib/site";
import {
  V2_PHONE_DISPLAY,
  V2_PHONE_TEL,
  v2Path,
  v2Years,
} from "@/lib/v2/config";
import { getV2T } from "@/lib/v2/i18n";
import { whatsappUrl } from "@/lib/whatsapp";
import V2PageHeader, { V2Breadcrumb } from "@/components/v2/V2PageHeader";
import V2LeadForm from "@/components/v2/V2LeadForm";
import { ButtonLink } from "@/components/v2/ui/V2Button";
import { PhoneIcon, WhatsAppIcon } from "@/components/v2/ui/icons";
import { Container, Reveal, Section } from "@/components/v2/ui/primitives";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getV2T(locale, "V2.budget");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

/**
 * Pàgina de pressupost — la pàgina de conversió del lloc.
 *
 * La web actual tracta el pressupost com un formulari de contacte més: camps,
 * botó i cap explicació del que passa quan el premes. Aquest és exactament el
 * moment on més gent abandona, perquè enviar unes dades a un desconegut sense
 * saber si t'atabalaran a trucades fa més por que el preu.
 *
 * Per això la columna lateral no és decoració: és la resposta a "i ara què".
 * Els tres passos, el termini i la nota de "sense compromís" van AL COSTAT del
 * formulari, no en una pàgina de FAQ que ningú obrirà amb el cursor ja dins del
 * primer camp.
 *
 * NO hi ha el bloc fosc de tancament amb la crida a pressupost que porten la
 * resta de pàgines: aquí ja hi ets. Repetir-hi el botó seria enviar-te al lloc
 * on ja ets. El que sí té sentit al final és tornar a posar les garanties.
 */
export default async function V2BudgetPage({ params }: Props) {
  const { locale } = await params;
  const t = await getV2T(locale, "V2.budget");
  const tc = await getV2T(locale, "V2.cta");
  const tt = await getV2T(locale, "V2.home.trust");
  const tw = await getV2T(locale, "Whatsapp");

  const steps = [t("asideSteps.one"), t("asideSteps.two"), t("asideSteps.three")];

  const guarantees = [
    { value: tt("yearsValue", { years: v2Years() }), label: tt("yearsLabel") },
    { value: tt("workshopValue"), label: tt("workshopLabel") },
    { value: tt("storesValue"), label: tt("storesLabel") },
    { value: tt("quoteValue"), label: tt("quoteLabel") },
  ];

  return (
    <>
      <V2Breadcrumb
        locale={locale}
        siteUrl={SITE_URL}
        items={[{ name: t("eyebrow"), path: v2Path(locale, "pressupost") }]}
      />

      <V2PageHeader eyebrow={t("eyebrow")} title={t("headline")} lead={t("lead")} />

      <Section tone="paper" label={t("eyebrow")}>
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            {/* --- Formulari ---------------------------------------------- */}
            {/* Va primer en el DOM a propòsit: en mòbil les dues columnes es
                converteixen en dues files, i qui ha arribat fins aquí ja ha
                decidit escriure. Fer-lo baixar per sota d'una llista de passos
                seria posar-li un peatge just abans del primer camp.

                Sense h2 propi: el titular de la capçalera JA diu què fa aquesta
                pàgina i el subtítol diu quants camps són. Un segon titular
                repetiria la mateixa frase amb altres paraules. */}
            <Reveal className="lg:col-span-7">
              {/* Mateix component i mateix backend (/api/lead) que la portada i
                  la pàgina de contacte: aquí no es duplica ni una validació. */}
              <V2LeadForm privacyHref={publicPath("/privacitat", locale)} />
            </Reveal>

            {/* --- Què passa després -------------------------------------- */}
            {/* L'enganxat és el motiu de ser d'aquesta columna: el formulari és
                llarg i, quan arribes al camp del missatge, els passos ja no es
                veurien. `self-start` és imprescindible — sense ell l'ítem de la
                graella s'estira a tota l'alçada de la fila i no li queda marge
                per enganxar-se. El <Reveal> va A DINS i no a fora perquè la seva
                animació aplica un `transform`, i un ancestre transformat fa
                saltar l'element enganxat mentre s'anima. */}
            <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
              <Reveal delay={120}>
                <div className="border border-v2-bone bg-v2-paper-2 p-8 lg:p-9">
                  <h2 className="rule-brass font-v2-display text-v2-h3 text-v2-ink">
                    {t("asideTitle")}
                  </h2>

                  <ol className="mt-9 flex flex-col gap-7" role="list">
                    {steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center border border-v2-brass/50 font-v2-sans text-v2-xs font-semibold text-v2-brass-2"
                          aria-hidden="true"
                        >
                          {i + 1}
                        </span>
                        <p className="font-v2-sans text-v2-sm text-v2-ink-2">{step}</p>
                      </li>
                    ))}
                  </ol>

                  <p className="mt-9 border-t border-v2-bone pt-6 font-v2-sans text-v2-xs text-v2-ink-3">
                    {t("asideNote")}
                  </p>
                </div>

                {/* --- Tens pressa? ------------------------------------- */}
                {/* La sortida per als que NO volen omplir res. A la web actual
                    aquesta gent no té on anar des del formulari: o escriu o
                    tanca. Un telèfon i un WhatsApp al costat recuperen la
                    conversa en comptes de perdre-la. */}
                <div className="mt-8 border border-v2-ink/15 p-8 lg:p-9">
                  <h2 className="font-v2-display text-v2-h3 text-v2-ink">
                    {t("urgentTitle")}
                  </h2>

                  <p className="mt-6 font-v2-sans text-v2-xs font-semibold uppercase tracking-wider text-v2-ink-3">
                    {tc("call")}
                  </p>
                  <a
                    href={`tel:${V2_PHONE_TEL}`}
                    className="mt-1 flex min-h-[48px] items-center gap-3 font-v2-display text-v2-h3 text-v2-ink transition-colors hover:text-v2-brass-2"
                  >
                    <PhoneIcon className="h-5 w-5 shrink-0 text-v2-brass-2" />
                    {V2_PHONE_DISPLAY}
                  </a>

                  {/* Missatge ja escrit i traduït: qui obre WhatsApp no ha de
                      pensar com comença la conversa. */}
                  <ButtonLink
                    href={whatsappUrl(tw("budgetIntro"))}
                    external
                    variant="whatsapp"
                    className="mt-6 w-full"
                    icon={<WhatsAppIcon className="h-5 w-5" />}
                  >
                    {tc("whatsapp")}
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Les quatre garanties, repetides al peu del formulari. Són les mateixes
          de la barra de la portada, i van aquí perquè qui baixa fins al final
          sense enviar res sol ser qui encara dubta de amb qui parla. */}
      <Section tone="ink" size="sm" className="weave">
        <Container>
          <ul
            className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4"
            role="list"
          >
            {guarantees.map((item) => (
              <li key={item.label}>
                <p className="font-v2-display text-v2-h3 text-v2-paper">
                  {item.value}
                </p>
                <p className="mt-1.5 font-v2-sans text-v2-sm text-v2-paper/60">
                  {item.label}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
