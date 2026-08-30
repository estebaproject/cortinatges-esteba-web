"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/navigation";
import { routing } from "@/routing";

const localeLabels: Record<string, string> = {
  ca: "CA",
  es: "ES",
  en: "EN",
  fr: "FR",
};

/**
 * `tone` diu sobre quin fons es pinta el selector.
 *
 * Cal perquè els colors estaven cablejats a tinta fosca (`text-ink`) i el
 * selector viu sobre una franja pintada de `bg-ink`. Són EL MATEIX TOKEN, o
 * sigui que l'idioma actiu es pintava del color exacte del seu fons: contrast
 * 1:1, invisible. Mesurat píxel a píxel, aquell retall tenia UN SOL color i
 * rang 0 — ni a producció es veia en quin idioma estaves navegant.
 *
 * La col·lisió és ESTRUCTURAL i per això aquí no hi ha cap hex: `text-ink`
 * sobre `bg-ink` dona 1:1 sigui quin sigui el valor de l'`ink`. Abans hi deia
 * «rgb(19,44,85) sobre rgb(19,44,85)» i el canvi de paleta va deixar aquell
 * número desfasat, tot i que el problema que descriu no s'havia mogut gens.
 * Citant el token en comptes del valor, això ja no pot tornar a caducar.
 *
 * Els altres tres idiomes també queien per sota del mínim AA de 4,5. La xifra
 * que hi havia escrita aquí era 2,34:1; no s'ha pogut reproduir amb els
 * tokens (`ink-muted` sobre l'`ink` d'aleshores dona 3,00:1 i sobre el d'ara
 * 2,66:1), probablement perquè es va mesurar sobre píxels ja suavitzats. Es
 * deixa dit i no es substitueix per una altra: canviar un número que no es
 * pot reproduir per un de nou és com es va arribar fins aquí.
 */
type Tone = "dark" | "light";

export default function LocaleSwitcher({ tone = "dark" }: { tone?: Tone }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const styles =
    tone === "light"
      ? { active: "text-canvas font-medium", idle: "text-canvas/70 hover:text-canvas", sep: "text-canvas/40" }
      : { active: "text-ink font-medium", idle: "text-ink-muted hover:text-ink", sep: "text-ink-faint" };

  function handleChange(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <nav aria-label="Canvi d'idioma">
      <ul className="flex items-center gap-1" role="list">
        {routing.locales.map((loc, index) => (
          <li key={loc} className="flex items-center">
            <button
              onClick={() => handleChange(loc)}
              aria-current={loc === locale ? "true" : undefined}
              className={[
                "inline-flex min-h-[44px] min-w-[36px] items-center justify-center -my-3",
                "text-body-sm font-sans tracking-wider uppercase transition-colors",
                loc === locale ? styles.active : styles.idle,
              ].join(" ")}
            >
              {localeLabels[loc]}
            </button>
            {index < routing.locales.length - 1 && (
              <span className={`mx-1 text-xs ${styles.sep}`} aria-hidden="true">
                /
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
