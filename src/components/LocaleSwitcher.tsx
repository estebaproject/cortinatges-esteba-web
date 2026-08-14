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
 * selector viu sobre la franja blava, que és EXACTAMENT el mateix color:
 * rgb(19,44,85) sobre rgb(19,44,85). Mesurat píxel a píxel, el retall de
 * l'idioma actiu tenia UN SOL color i rang 0 — o sigui que l'idioma en què
 * estàs navegant no es veia gens, ni a producció. Els altres tres es
 * quedaven a 2,34:1, també per sota del mínim AA de 4,5.
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
