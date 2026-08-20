import Image from "next/image";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { publicPath } from "@/lib/site";

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
  // Instal·lació → trepant.
  // El dibuix anterior es llegia com un rectangle amb ratlles a 28px: el cos
  // feia 8x5,5 dins d'un viewBox de 24, el mànec era una L prima i el mandrí i
  // la broca es confonien en una sola línia trencada.
  // Aquest té el cos més gran i arrodonit, el mandrí com a peça pròpia, la
  // broca sortint neta cap a la dreta i un mànec de pistola que es tanca en
  // corba — que és el que fa que es reconegui d'una ullada.
  installacio: (
    <>
      <g transform="rotate(-32 12 12)">
        <rect x="3.4" y="8.6" width="11" height="7" rx="2.4" />
        <path d="M14.4 10.4h2.4v3.4h-2.4" />
        <path d="M16.8 12.1h4.4" />
        <path d="M7 15.6l-.9 4.3a1.85 1.85 0 0 0 3.6.5l.7-4.8" />
      </g>
    </>
  ),
};

export default async function ServicesGrid({ compact = false }: { compact?: boolean }) {
  const t = await getTranslations("Serveis");
  // Només per a la portada: el titular d'aquesta secció ara és el de l'ofici.
  const to = await getTranslations("SectionOfici");
  const locale = await getLocale();
  // Home (icones): sense "disseny". Pàgina /serveis (amb fotos): tots 5.
  const keys: IconKey[] = compact
    ? ["assessorament", "mides", "confeccio", "installacio"]
    : ["assessorament", "disseny", "mides", "confeccio", "installacio"];

  // Espaiat de la versió compacta (portada) retallat: `py-section` són 96px a
  // dalt i 96 a baix per a quatre icones amb una paraula sota. A baix en són 48
  // en mòbil i 64 en escriptori, i la capçalera de la secció baixa de 48px de
  // separació a 32/40. La versió amb fotos de /serveis no es toca.
  //
  // A dalt sí que n'hi ha més (64 i 96): aquesta secció comparteix el fons
  // càlid amb la franja d'obertura, o sigui que no hi ha cap canvi de color
  // que les separi i el titular de l'ofici quedava enganxat al que té just a
  // sobre. Aquest coixí no es llegeix com una banda buida — es llegeix com
  // l'aire que li faltava.
  return (
    <section className={compact ? "pt-16 pb-12 md:pt-24 md:pb-16 bg-canvas-warm" : "pb-section bg-canvas"} aria-label={t("title")}>
      <div className="max-w-layout mx-auto px-6 lg:px-12">
        {compact && (
          <div className="text-center mb-10 md:mb-12">
            {/* Aquesta capçalera ve de "El nostre ofici", que era una secció a
                part just a sobre. Eren dos blocs seguits de prosa centrada, 838px
                sense ni una imatge i amb 160px de blanc entremig — i els seus
                tres paràgrafs deien, pitjor, el que /nosaltres ja explica: un
                d'ells és gairebé la mateixa frase que `About.story3`.
                Ara el que aporta l'ofici (el titular: tres generacions, un sol
                ofici) encapçala els quatre passos, que és on es demostra. La
                història sencera es queda a /nosaltres, que és a la navegació. */}
            <p className="font-sans text-eyebrow text-accent-deep uppercase mb-3">
              {to("eyebrow")}
            </p>
            <h2 className="font-serif text-display-md text-ink mb-4">{to("headline")}</h2>
            <p className="font-sans text-body-lg text-ink-muted max-w-prose-editorial mx-auto">
              {t("intro")}
            </p>
          </div>
        )}
        <ul
          className={`grid ${compact ? "grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10" : "grid-cols-2 lg:grid-cols-5 gap-6"}`}
          role="list"
        >
          {keys.map((key) =>
            compact ? (
              /* LLISTA de serveis, no recorregut numerat.
                 Ho havia muntat com un camí 01→02→03→04, i estava malament de
                 fons: numerar-los promet que TOTS els encàrrecs passen pels
                 quatre, i no és cert — hi ha producte que es compra acabat i va
                 directe a muntatge, sense passar per confecció. Com a servei,
                 "Confecció" és veritat; com a pas obligatori, no.
                 Sense numeració el problema desapareix i no cal tocar cap text.

                 Les icones tornen, però amb cos: abans eren traç d'1,3 sense
                 fons ni vora ni hover, i sobretot NO eren enllaços — semblaven
                 tocables sense ser-ho. Ara van dins d'un cercle d'arena, el
                 mateix color dels botons de la casa, i tota la targeta porta a
                 /serveis. */
              <li key={key}>
                <Link href={publicPath("/serveis", locale)} className="group block text-center">
                  <span className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-sand text-ink group-hover:bg-sand-dark transition-colors">
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {ICON_SVG[key]}
                    </svg>
                  </span>
                  <h3 className="font-serif text-lg text-ink tracking-wide uppercase group-hover:text-accent-deep transition-colors">
                    {t(`items.${key}.name` as Parameters<typeof t>[0])}
                  </h3>
                  {/* Línia curta sota cada servei. Es pinta NOMÉS si la clau
                      `items.{key}.short` existeix al fitxer d'idioma: així un
                      idioma que encara no la tingui se la salta sense
                      trencar-se i sense deixar cap forat. */}
                  {t.has(`items.${key}.short` as Parameters<typeof t.has>[0]) && (
                    <p className="mt-2 font-sans text-body-sm text-ink-muted leading-snug">
                      {t(`items.${key}.short` as Parameters<typeof t>[0])}
                    </p>
                  )}
                </Link>
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
