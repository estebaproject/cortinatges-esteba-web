import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { publicPath } from "@/lib/site";

const TOWN_KEYS = ["girona", "blanes", "palamos"] as const;

/**
 * Secció de tancament de la portada: botigues i crida a l'acció, juntes.
 *
 * Abans eren dues seccions seguides que deien el mateix. Aquesta obria amb
 * "Vine a veure'ns. Parlem del teu espai." i acabava amb un botó cap a
 * /botigues; la de sota (`CtaVisita`, 806px per a 66 paraules, la tercera més
 * gran de la portada) obria amb "Demana la teva visita. T'assessorem a casa o a
 * la botiga." i acabava amb DOS botons, un d'ells el mateix cap a /botigues.
 * De fet aquesta secció ja tirava del namespace `CtaVisita` per al seu botó.
 *
 * Ara és una sola secció: el titular de la crida, els tres pobles com a prova
 * que hi ha botiga de veritat, i les dues accions. El titular de `Locations`
 * no es perd: segueix encapçalant la pàgina /botigues.
 */
export default async function LocationsSection() {
  const t = await getTranslations("Locations");
  const tv = await getTranslations("CtaVisita");
  const locale = await getLocale();

  const towns = TOWN_KEYS.map((k) =>
    t(`stores.${k}.city` as Parameters<typeof t>[0]),
  ).join(" · ");

  // ESPAIAT retallat. La secció feia `py-section` (96+96) i per dins una
  // cascada de marges de 4+5+6+10+8: cinc elements que sumaven 33 unitats de
  // separació, i cada peça surava sola enmig del blau. Ara el coixí és de 56 i
  // 80, i els marges baixen un graó cadascun. El bloc es llegeix com UNA crida,
  // que és el que és, i no com cinc coses posades en columna.
  //
  // EL TEXT també ha canviat: "sense compromís" hi sortia TRES vegades — a
  // l'eyebrow, al mig del cos i al peu. Dir-ho tres vegades no tranquil·litza
  // ningú; fa pensar que hi ha lletra petita. Ara es diu UNA sola vegada, al
  // peu, que és on apareix el dubte: just sota els botons, quan ja has decidit
  // clicar. L'eyebrow passa a situar ("El primer pas") en lloc de repetir.
  // Compte: aquestes claus són del namespace `CtaVisita` i les comparteixen
  // /nosaltres i /contacte, o sigui que el canvi els arregla la mateixa pega.
  return (
    <section className="py-14 md:py-20 bg-accent-deep text-center" aria-label={tv("ariaLabel")}>
      <div className="max-w-layout mx-auto px-6 lg:px-12">
        <p className="font-sans text-body-sm text-accent-light tracking-widest uppercase mb-3">
          {tv("eyebrow")}
        </p>
        <h2 className="font-serif text-display-lg text-canvas max-w-2xl mx-auto mb-4">
          {tv("headline")}
        </h2>
        <p className="font-sans text-body-lg text-canvas/70 max-w-prose-editorial mx-auto mb-5">
          {tv("body")}
        </p>
        {/* Els tres pobles: no és decoració, és la prova que hi ha botiga on
            anar. Va en serif i amb separadors per a llegir-se d'un cop, no com
            una llista. */}
        <p className="font-serif text-display-md text-canvas/90 mb-8">{towns}</p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
            {/* Aquest botó DIU "Concerta una cita" i portava a /contacte, que és
                WhatsApp, correu i la llista de botigues. Prometia una cosa i en
                donava una altra. Ara porta on toca.
                El secundari es queda a /botigues: o véns amb cita, o mires on
                som. Són dues sortides diferents i cap de les dues és demanar
                pressupost, que viu a la franja d'obertura. */}
          <Link
            href={publicPath("/concerta-cita", locale)}
            className="inline-flex items-center justify-center px-10 py-4 bg-canvas text-ink font-sans text-body-md font-medium hover:bg-accent-light transition-colors"
          >
            {tv("ctaPrimary")}
          </Link>
          <Link
            href={publicPath("/botigues", locale)}
            className="inline-flex items-center justify-center px-10 py-4 border border-canvas/40 text-canvas font-sans text-body-md hover:border-canvas hover:bg-canvas/10 transition-colors"
          >
            {tv("ctaSecondary")}
          </Link>
        </div>

        <p className="mt-6 font-sans text-body-sm text-canvas/50">{tv("disclaimer")}</p>
      </div>
    </section>
  );
}
