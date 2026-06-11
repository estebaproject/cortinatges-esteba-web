import Image from "next/image";
import { getTranslations } from "next-intl/server";

type IconKey = "assessorament" | "disseny" | "mides" | "confeccio" | "installacio";

// Fotos reals que il·lustren cada servei (de la web actual).
const PHOTOS: Record<IconKey, string> = {
  assessorament: "/images/serveis/assessorament.jpg",
  disseny: "/images/serveis/disseny.jpg",
  mides: "/images/serveis/mides.jpg",
  confeccio: "/images/serveis/confeccio.jpg",
  installacio: "/images/serveis/installacio.jpg",
};

// Iconos representativos de cada servicio (SVG, viewBox 24).
const ICON_SVG: Record<IconKey, React.ReactNode> = {
  // Asesoramiento → bocadillo de conversación
  assessorament: (
    <>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
    </>
  ),
  // Diseño interior → sofá
  disseny: (
    <>
      <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
      <path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z" />
      <path d="M4 18v2M20 18v2" />
    </>
  ),
  // Toma de medidas → metro / regla con marcas
  mides: (
    <>
      <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
      <path d="m14.5 12.5 2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2" />
    </>
  ),
  // Confección → tijeras
  confeccio: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </>
  ),
  // Instalación → taladro
  installacio: (
    <>
      <rect x="3" y="8.5" width="8" height="5.5" rx="1.5" />
      <path d="M11 10.2h3v4h-3" />
      <path d="M14 12.2h6" />
      <path d="M6 14v2.5A1.5 1.5 0 0 0 7.5 18H9v-4" />
    </>
  ),
};

export default async function ServicesGrid({ compact = false }: { compact?: boolean }) {
  const t = await getTranslations("Serveis");
  // Home (icones): sense "disseny". Pàgina /serveis (amb fotos): tots 5.
  const keys: IconKey[] = compact
    ? ["assessorament", "mides", "confeccio", "installacio"]
    : ["assessorament", "disseny", "mides", "confeccio", "installacio"];

  return (
    <section className={compact ? "py-section bg-canvas-warm" : "pb-section bg-canvas"} aria-label={t("title")}>
      <div className="max-w-layout mx-auto px-6 lg:px-12">
        {compact && (
          <div className="text-center mb-12">
            <p className="font-sans text-eyebrow text-accent-deep uppercase mb-3">
              {t("eyebrow")}
            </p>
            <h2 className="font-serif text-display-md text-ink">{t("title")}</h2>
          </div>
        )}
        <ul
          className={`grid gap-6 ${compact ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-5"}`}
          role="list"
        >
          {keys.map((key) =>
            compact ? (
              <li key={key} className="text-center">
                <span className="inline-flex items-center justify-center mb-4 text-accent-deep w-12 h-12">
                  <svg
                    className="w-full h-full"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {ICON_SVG[key]}
                  </svg>
                </span>
                <h3 className="font-serif text-lg text-ink tracking-wide uppercase">
                  {t(`items.${key}.name` as Parameters<typeof t>[0])}
                </h3>
              </li>
            ) : (
              <li key={key} className="group flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-linen mb-4">
                  <Image
                    src={PHOTOS[key]}
                    alt={t(`items.${key}.name` as Parameters<typeof t>[0])}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-lg text-ink tracking-wide uppercase mb-1.5">
                  {t(`items.${key}.name` as Parameters<typeof t>[0])}
                </h3>
                <p className="font-sans text-body-sm text-ink-muted leading-relaxed">
                  {t(`items.${key}.desc` as Parameters<typeof t>[0])}
                </p>
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}
