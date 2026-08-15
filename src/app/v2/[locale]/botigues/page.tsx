import type { Metadata } from "next";
import clsx from "clsx";
import { SITE_URL } from "@/lib/site";
import { V2_STORES, type V2Store, mapsUrl, v2Path } from "@/lib/v2/config";
import { getV2T } from "@/lib/v2/i18n";
import { whatsappUrl } from "@/lib/whatsapp";
import V2PageHeader, { V2Breadcrumb } from "@/components/v2/V2PageHeader";
import { ArrowRight, ButtonLink } from "@/components/v2/ui/V2Button";
import { ClockIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/v2/ui/icons";
import { Container, Eyebrow, Reveal, Section } from "@/components/v2/ui/primitives";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getV2T(locale, "V2.stores");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

/**
 * Coordenades en format llegible. No és decoració gratuïta: és el detall que
 * converteix una placa de color en una fitxa de lloc real, i surt de dades que
 * ja hi ha a config.ts (les mateixes que alimenten l'schema).
 */
function formatGeo({ lat, lng }: V2Store["geo"]): string {
  const ns = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`;
  const ew = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "O"}`;
  return `${ns} · ${ew}`;
}

/**
 * Pàgina de botigues.
 *
 * Dues decisions que la separen de la pàgina equivalent de la web actual:
 *
 * 1. CAP IFRAME DE GOOGLE MAPS. A la web viva el mapa viu darrere del
 *    consentiment de cookies (StoresMap.tsx) perquè l'iframe carrega cookies de
 *    Google en muntar-se. El prototip no té banner propi, així que un iframe
 *    aquí les carregaria sense consentiment de ningú. Cada botiga porta enllaç
 *    "com arribar" que obre Maps a part: zero cookies i, en mòbil, obre l'app
 *    nativa — que és exactament el que vol qui està a punt de venir.
 *
 * 2. UNA BANDA PER BOTIGA, NO QUATRE TARGETES IGUALS. Quatre fitxes idèntiques
 *    apilades es llegeixen com una taula i no es llegeixen: l'ull salta. Aquí
 *    cada botiga ocupa una franja sencera amb el fons alternat i la placa de
 *    color canviant de banda, de manera que baixar per la pàgina obliga a
 *    aturar-se a cada punt de venda.
 *
 * El nom de cada punt es llegeix de `Locations.stores.*.city`, que ja existeix
 * traduït als quatre idiomes. Important per a la matalasseria: allà la ciutat
 * segueix sent Girona, i posar dos <h2> que diguin "Girona" seria il·legible.
 */
export default async function V2StoresPage({ params }: Props) {
  const { locale } = await params;
  const t = await getV2T(locale, "V2.stores");
  const th = await getV2T(locale, "V2.home.stores");
  const tb = await getV2T(locale, "V2.ctaBlock");
  const tc = await getV2T(locale, "V2.cta");
  const tn = await getV2T(locale, "V2.nav");
  const tl = await getV2T(locale, "Locations");
  const tw = await getV2T(locale, "Whatsapp");

  return (
    <>
      <V2Breadcrumb
        locale={locale}
        siteUrl={SITE_URL}
        items={[{ name: t("eyebrow"), path: v2Path(locale, "botigues") }]}
      />

      <V2PageHeader eyebrow={t("eyebrow")} title={t("headline")} lead={t("lead")} />

      {/* L'ordre de V2_STORES ja deixa la matalasseria l'última: és un local
          annex de Girona, no un quart punt de venda amb el mateix pes. */}
      {V2_STORES.map((store, i) => {
        const alt = i % 2 === 1;
        const name = tl(`stores.${store.key}.city`);

        return (
          <Section
            key={store.key}
            id={store.key}
            tone={alt ? "paper-2" : "paper"}
            size="sm"
          >
            <Container>
              <Reveal className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                {/* La fitxa va PRIMERA al DOM sempre: qui llegeix amb lector de
                    pantalla o sense CSS ha de trobar l'adreça abans que l'ornament.
                    El bescanvi de bandes és només visual, amb `order` en lg. */}
                <div className={alt ? "lg:order-2" : "lg:order-1"}>
                  <h2 className="rule-brass font-v2-display text-v2-h2 text-v2-ink">
                    {name}
                  </h2>

                  <p className="mt-8 flex items-start gap-3.5 font-v2-sans text-v2-body text-v2-ink-2">
                    <PinIcon className="mt-1 h-5 w-5 shrink-0 text-v2-brass-2" />
                    <span>
                      {store.street}
                      <br />
                      {store.zip} {store.city}
                    </span>
                  </p>

                  <div className="mt-5 flex items-start gap-3.5">
                    <ClockIcon className="mt-1 h-5 w-5 shrink-0 text-v2-brass-2" />
                    <div>
                      <p className="font-v2-sans text-v2-xs font-semibold uppercase tracking-wider text-v2-ink-3">
                        {th("scheduleLabel")}
                      </p>
                      <p className="mt-1 font-v2-sans text-v2-body text-v2-ink-2">
                        {th("schedule")}
                      </p>
                    </div>
                  </div>

                  {store.key === "matalasseria" && (
                    <p className="mt-6 border-l-2 border-v2-brass py-1 pl-5 font-v2-sans text-v2-sm text-v2-ink-2">
                      {th("mattressNote")}
                    </p>
                  )}

                  {/* El telèfon és la conversió real d'un negoci local: es
                      compon com un titular, no com una línia de peu de pàgina. */}
                  <a
                    href={`tel:${store.phoneTel}`}
                    className="mt-9 inline-flex min-h-[48px] items-center gap-3.5 font-v2-display text-v2-h3 text-v2-ink transition-colors hover:text-v2-brass-2"
                  >
                    <PhoneIcon className="h-5 w-5 shrink-0 text-v2-brass-2" />
                    {store.phoneDisplay}
                  </a>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <ButtonLink
                      href={whatsappUrl(tw("storeInfo", { city: store.city }))}
                      external
                      variant="whatsapp"
                      icon={<WhatsAppIcon className="h-4 w-4" />}
                    >
                      {tc("whatsapp")}
                    </ButtonLink>
                    <ButtonLink
                      href={mapsUrl(store)}
                      external
                      variant="secondary"
                      className="group"
                    >
                      {tc("directions")}
                      <ArrowRight />
                    </ButtonLink>
                  </div>
                </div>

                {/* Placa. És ornament pur —repeteix el nom que ja diu l'<h2>—,
                    per això va sencera amb aria-hidden: al lector de pantalla no
                    hi guanya res i el faria escoltar la mateixa ciutat dos cops. */}
                <div
                  aria-hidden="true"
                  className={clsx(
                    "flex min-h-[18rem] flex-col justify-between p-9 lg:min-h-[24rem] lg:p-12",
                    alt ? "lg:order-1" : "lg:order-2",
                    alt ? "bg-v2-linen" : "weave bg-v2-ink",
                  )}
                >
                  <Eyebrow tone={alt ? "brass" : "paper"}>
                    {String(i + 1).padStart(2, "0")} / {String(V2_STORES.length).padStart(2, "0")}
                  </Eyebrow>

                  <p
                    className={clsx(
                      "mt-10 font-v2-display text-v2-h1 text-balance",
                      alt ? "text-v2-ink" : "text-v2-paper",
                    )}
                  >
                    {name}
                  </p>

                  <p
                    className={clsx(
                      "mt-8 font-v2-sans text-v2-xs uppercase tracking-wider",
                      alt ? "text-v2-ink-3" : "text-v2-paper/45",
                    )}
                  >
                    {formatGeo(store.geo)}
                  </p>
                </div>
              </Reveal>
            </Container>
          </Section>
        );
      })}

      <Section tone="ink" size="sm" className="weave">
        <Container>
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-v2-prose">
              <p className="font-v2-display text-v2-h2 text-balance text-v2-paper">
                {tb("headline")}
              </p>
              <p className="mt-4 font-v2-sans text-v2-body text-v2-paper/70">
                {tb("lead")}
              </p>
            </div>
            <ButtonLink
              href={v2Path(locale, "pressupost")}
              variant="onDark"
              size="lg"
              className="group shrink-0"
            >
              {tn("cta")}
              <ArrowRight />
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
