import type { LegalDoc } from "@/lib/legal";
import { LEGAL_DADES_PENDENTS, LEGAL_UPDATED, legalDocText } from "@/lib/legal";
import { NOM_DADA } from "@/lib/empresa";
import LegalMarkdown from "@/components/LegalMarkdown";

/**
 * Pàgina legal del web informatiu. Pinta el mateix markdown que la botiga
 * (LegalMarkdown), amb dos avisos al capdamunt quan toca:
 *
 *   - DADES PENDENTS. Si a src/lib/empresa.ts encara hi ha NIF, domicili o
 *     registre en blanc, el text els pinta marcats i aquí es diu quins són.
 *     Val més que es vegi que no pas que passi desapercebut.
 *
 *   - IDIOMA. El text és en català als quatre idiomes, però les URL sí que
 *     estan traduïdes, o sigui que /en/legal-notice es declara en anglès. Si
 *     no ho diguéssim, algú podria pensar que la traducció ha fallat.
 */
export default function LegalDocView({ doc, locale }: { doc: LegalDoc; locale: string }) {
  const pendents = LEGAL_DADES_PENDENTS.filter((k) => k === "nif" || k === "domicili" || k === "registre");

  return (
    <section className="pt-40 md:pt-48 pb-section bg-canvas">
      <div className="max-w-prose-editorial mx-auto px-6 lg:px-12">
        <h1 className="font-serif text-display-lg text-ink mb-2 uppercase">{doc.title}</h1>
        <p className="font-sans text-[11px] tracking-wide text-ink-muted">Darrera revisió: {LEGAL_UPDATED}</p>

        {pendents.length > 0 && (
          <p className="mt-6 border border-[#B25B4A]/40 bg-[#B25B4A]/5 px-4 py-3 font-sans text-body-sm text-ink" role="note">
            Aquest document encara no porta {pendents.map((k) => NOM_DADA[k]).join(", ")} de l&apos;empresa. Són dades
            obligatòries: fins que no hi siguin, el text va marcat i no s&apos;hauria de donar per publicat.
          </p>
        )}

        {locale !== "ca" && (
          <p className="mt-3 border border-linen bg-canvas-warm px-4 py-3 font-sans text-body-sm text-ink/85" role="note">
            Aquest text és en català, la llengua de l&apos;entitat, per a tots els idiomes del web.
          </p>
        )}

        <div className="mt-8">
          <LegalMarkdown text={legalDocText(doc)} />
        </div>
      </div>
    </section>
  );
}
