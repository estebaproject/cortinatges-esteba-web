import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { whatsappUrl } from "@/lib/whatsapp";
import { SITE_URL, SITE_NAME } from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
};

const STORE_KEYS = ["girona", "blanes", "palamos", "matalasseria"] as const;

// Dades reals per a l'schema LocalBusiness (SEO local / Google Maps).
const STORES_DATA = [
  { name: "Cortinatges Esteba Girona", street: "C/ Rutlla, 11", zip: "17002", city: "Girona", phone: "+34972203423" },
  { name: "Cortinatges Esteba Blanes", street: "Rambla Joaquim Ruyra, 59", zip: "17300", city: "Blanes", phone: "+34972330573" },
  { name: "Cortinatges Esteba Palamós", street: "C/ Miguel de Cervantes, 35", zip: "17230", city: "Palamós", phone: "+34972316219" },
  { name: "Cortinatges Esteba Matalasseria", street: "C/ Rutlla, 20", zip: "17002", city: "Girona", phone: "+34972203423" },
];

const storesSchema = STORES_DATA.map((s) => ({
  "@context": "https://schema.org",
  "@type": "HomeGoodsStore",
  name: s.name,
  parentOrganization: SITE_NAME,
  url: SITE_URL,
  telephone: s.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: s.street,
    postalCode: s.zip,
    addressLocality: s.city,
    addressRegion: "Girona",
    addressCountry: "ES",
  },
}));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Locations" });
  return {
    title: t("headline"),
    description: t("eyebrow"),
  };
}

export default async function StoresPage() {
  const t = await getTranslations("Locations");

  return (
    <section className="pt-40 md:pt-48 pb-section bg-canvas" aria-label={t("ariaLabel")}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storesSchema) }}
      />
      <div className="max-w-layout mx-auto px-6 lg:px-12">
        <header className="max-w-3xl mb-16">
          <p className="font-sans text-body-sm text-accent-deep tracking-widest uppercase mb-4">
            {t("eyebrow")}
          </p>
          <h1 className="font-serif text-display-lg text-ink">{t("headline")}</h1>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" role="list">
          {STORE_KEYS.map((key) => {
            const phone = t(`stores.${key}.phone` as Parameters<typeof t>[0]);
            return (
              <li
                key={key}
                className="border border-linen p-8 flex flex-col bg-canvas-warm"
              >
                <h2 className="font-serif text-display-md text-ink mb-4">
                  {t(`stores.${key}.city` as Parameters<typeof t>[0])}
                </h2>
                <p className="font-sans text-body-md text-ink-muted mb-2">
                  {t(`stores.${key}.address` as Parameters<typeof t>[0])}
                </p>
                <p className="font-sans text-body-sm text-ink-faint mb-6">
                  {t(`stores.${key}.schedule` as Parameters<typeof t>[0])}
                </p>
                <div className="mt-auto flex flex-col gap-3">
                  <a
                    href={`tel:+34${phone.replace(/\s/g, "")}`}
                    className="font-sans text-body-md text-accent-deep font-medium hover:text-ink transition-colors"
                  >
                    {phone}
                  </a>
                  <a
                    href={whatsappUrl(
                      `Hola! Voldria informació de la botiga de ${t(`stores.${key}.city` as Parameters<typeof t>[0])}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] text-white font-sans text-body-sm font-semibold hover:brightness-95 transition-all"
                  >
                    WhatsApp
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
