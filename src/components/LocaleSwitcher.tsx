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

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

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
                loc === locale
                  ? "text-ink font-medium"
                  : "text-ink-muted hover:text-ink",
              ].join(" ")}
            >
              {localeLabels[loc]}
            </button>
            {index < routing.locales.length - 1 && (
              <span className="mx-1 text-ink-faint text-xs" aria-hidden="true">
                /
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
