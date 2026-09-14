import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { publicPath } from "@/lib/site";
import { ONLINE_NAME, ONLINE_PUBLISHED } from "@/online/config";

/**
 * Franja d'entrada a la botiga des de la PORTADA del web de serveis. És
 * l'únic lloc del web informatiu on es veurà producte amb preu: a la fase 2
 * hi entren tres o quatre destacats llegits de la botiga. Ara: titular, text
 * i un sol botó.
 *
 * No pinta res mentre la botiga està apagada: la portada queda exactament
 * com era.
 */
export default async function OnlineBand() {
  if (!ONLINE_PUBLISHED) return null;

  const locale = await getLocale();
  const t = await getTranslations("Online");

  return (
    <section className="py-14 md:py-20 bg-canvas-warm" aria-labelledby="online-band-title">
      <div className="max-w-layout mx-auto px-6 lg:px-12 text-center">
        <p className="font-sans text-eyebrow text-ink/80 tracking-widest uppercase mb-3">
          {ONLINE_NAME}
        </p>
        <h2 id="online-band-title" className="font-serif text-display-md text-ink mb-4 uppercase">
          {t("bandTitle")}
        </h2>
        <p className="font-sans text-body-lg text-ink/80 max-w-prose-editorial mx-auto mb-8">
          {t("bandBody")}
        </p>
        <Link
          href={publicPath("/online", locale)}
          className="inline-flex items-center px-8 py-4 bg-ink text-canvas font-sans text-xs font-semibold tracking-[0.2em] uppercase hover:bg-ink/90 transition-colors"
        >
          {t("bandCta")}
        </Link>
      </div>
    </section>
  );
}
