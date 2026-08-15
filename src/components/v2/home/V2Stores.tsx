import { V2_STORES, mapsUrl, v2Path } from "@/lib/v2/config";
import { getV2T } from "@/lib/v2/i18n";
import { whatsappUrl } from "@/lib/whatsapp";
import { ArrowRight, ButtonLink } from "../ui/V2Button";
import { ClockIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "../ui/icons";
import { Container, Reveal, Section, SectionHead } from "../ui/primitives";

/**
 * Les botigues, a la portada.
 *
 * La portada actual dedica una secció sencera a dir els noms de tres ciutats i
 * un botó cap a /botigues: cap adreça, cap telèfon, cap horari. Per a un negoci
 * local, això és amagar exactament el que la gent ve a buscar.
 *
 * NO S'HI EMBEDEIX CAP MAPA. L'iframe de Google Maps carrega cookies de Google
 * i al projecte està —correctament— darrere del consentiment (vegeu
 * StoresMap.tsx). Com que el prototip no té banner propi, el mapa no s'arribaria
 * a veure mai. En comptes d'això, cada botiga porta un enllaç "com arribar" que
 * obre Google Maps a part: zero cookies i, en mòbil, obre l'app nativa, que és
 * el que de veritat vol qui està a punt de venir.
 */
export default async function V2Stores({ locale }: { locale: string }) {
  const t = await getV2T(locale, "V2.home.stores");
  const tc = await getV2T(locale, "V2.cta");
  const tw = await getV2T(locale, "Whatsapp");

  // Les tres botigues de venda. La matalasseria es menciona a sota: és un local
  // annex de Girona, no un quart punt de venda amb el mateix pes.
  const shops = V2_STORES.filter((s) => s.key !== "matalasseria");
  const mattress = V2_STORES.find((s) => s.key === "matalasseria");

  return (
    <Section tone="paper-2" id="botigues">
      <Container>
        <SectionHead
          eyebrow={t("eyebrow")}
          title={t("headline")}
          lead={t("lead")}
          action={
            <ButtonLink
              href={v2Path(locale, "botigues")}
              variant="secondary"
              className="group"
            >
              {tc("stores")}
              <ArrowRight />
            </ButtonLink>
          }
        />

        <ul className="mt-14 grid gap-6 md:grid-cols-3" role="list">
          {shops.map((store, i) => (
            <Reveal as="li" key={store.key} delay={i * 90}>
              <div className="flex h-full flex-col border border-v2-bone bg-v2-paper p-7 lg:p-8">
                <h3 className="font-v2-display text-v2-h3 text-v2-ink">{store.city}</h3>

                <p className="mt-4 flex items-start gap-2.5 font-v2-sans text-v2-sm text-v2-ink-2">
                  <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-v2-brass-2" />
                  <span>
                    {store.street}
                    <br />
                    {store.zip} {store.city}
                  </span>
                </p>

                <p className="mt-3 flex items-start gap-2.5 font-v2-sans text-v2-sm text-v2-ink-3">
                  <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-v2-brass-2" />
                  <span>{t("schedule")}</span>
                </p>

                <div className="mt-7 flex flex-col gap-2.5 pt-1">
                  <a
                    href={`tel:${store.phoneTel}`}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 bg-v2-ink px-5 font-v2-sans text-v2-sm font-semibold text-v2-paper transition-colors hover:bg-v2-brass-2"
                  >
                    <PhoneIcon className="h-4 w-4" />
                    {store.phoneDisplay}
                  </a>
                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={whatsappUrl(tw("storeInfo", { city: store.city }))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 border border-v2-ink/20 px-3 font-v2-sans text-v2-xs font-semibold text-v2-ink transition-colors hover:border-v2-ink"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      {tc("whatsapp")}
                    </a>
                    <a
                      href={mapsUrl(store)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[48px] items-center justify-center px-3 text-center font-v2-sans text-v2-xs font-semibold text-v2-ink transition-colors hover:text-v2-brass-2"
                    >
                      {tc("directions")}
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        {mattress && (
          <p className="mt-6 font-v2-sans text-v2-sm text-v2-ink-3">
            <span className="font-semibold text-v2-ink-2">{mattress.street}, {mattress.city}</span>
            {" — "}
            {t("mattressNote")}
          </p>
        )}
      </Container>
    </Section>
  );
}
