"use client";

// Capçalera de la BOTIGA — clon de Kave Home, tema beige/negre.
// Estructura idèntica a Kave: barra promo a dalt + barra principal amb
//   logo (esquerra) · navegació (centre) · cerca + compte + cistell (dreta).
// Només es renderitza a les rutes de tenda (vegeu SiteHeader). Usa les
// tipografies del tema Kave (font-display / font-grotesque) i la paleta kave-*.

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import clsx from "clsx";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import CartIndicator from "@/components/cart/CartIndicator";
import { SHOW_MANTES } from "@/lib/site";

/** Secció de botiga activa, derivada del primer segment després del locale. */
function activeSection(pathname: string, prefix: string): string {
  const stripped = prefix && pathname.startsWith(prefix)
    ? pathname.slice(prefix.length)
    : pathname;
  const seg = stripped.replace(/^\/+/, "").split("/")[0] ?? "";
  return seg; // "botiga" | "mobiliari" | "catifes" | "mantes" | "cistell" | ...
}

export default function ShopHeader() {
  const t = useTranslations("Shop");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const prefix = locale === "ca" ? "" : `/${locale}`;
  const section = activeSection(pathname, prefix);

  const navLinks = [
    { key: "botiga", href: `${prefix}/botiga`, label: t("navBotiga") },
    { key: "mobiliari", href: `${prefix}/mobiliari`, label: t("navMobles") },
    { key: "catifes", href: `${prefix}/catifes`, label: t("navCatifes") },
    ...(SHOW_MANTES ? [{ key: "mantes", href: `${prefix}/mantes`, label: t("navMantes") }] : []),
    { key: "rebaixes", href: `${prefix}/rebaixes`, label: t("navRebaixes") },
  ];

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(`${prefix}/cerca${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 font-grotesque">
      {/* Barra promo — navy de marca (#132C55), com la franja "Des de 1961"
          del web original. Text clar a sobre. */}
      <div className="bg-ink text-canvas">
        <div className="max-w-layout mx-auto px-5 lg:px-10 flex items-center justify-between h-9 text-[0.72rem]">
          <Link
            href={`${prefix || "/"}`}
            className="inline-flex items-center gap-1.5 text-canvas/80 hover:text-canvas transition-colors"
            aria-label="Tornar a la web de Cortinatges Esteba"
          >
            <span aria-hidden>←</span>
            <span className="truncate">Cortinatges Esteba</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href={`${prefix}/nosaltres`} className="hidden sm:inline text-canvas/80 hover:text-canvas transition-colors">
              {t("promoRight1")}
            </Link>
            <Link href={`${prefix}/botigues`} className="hidden sm:inline text-canvas/80 hover:text-canvas transition-colors">
              {t("promoRight2")}
            </Link>
            <span aria-hidden className="hidden sm:inline text-canvas/30">|</span>
            <LocaleSwitcher />
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <div className="bg-kave-bg border-b border-kave-line">
        <div className="max-w-layout mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-[auto_1fr_auto] items-center h-16 md:h-[4.5rem] gap-4">
            {/* Logo */}
            <Link
              href={`${prefix || "/"}`}
              className="font-display text-2xl md:text-[1.75rem] leading-none text-kave-ink tracking-tight"
              aria-label="Cortinatges Esteba — tornar a l'inici"
            >
              Esteba
            </Link>

            {/* Navegació (centre, desktop) */}
            <nav className="hidden lg:flex items-center justify-center gap-7" aria-label="Navegació de la botiga">
              {navLinks.map((link) => {
                const isActive = section === link.key || (link.key === "mobiliari" && section === "mobiliari");
                return (
                  <Link
                    key={link.key}
                    href={link.href}
                    className={clsx(
                      "text-[0.95rem] underline-offset-[6px] transition-colors",
                      isActive
                        ? "text-kave-ink font-medium underline decoration-2 decoration-kave-tag"
                        : "text-kave-ink hover:underline hover:decoration-kave-tag",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Accions (dreta) */}
            <div className="flex items-center justify-end gap-3 md:gap-4">
              {/* Cerca (desktop) */}
              <form
                onSubmit={onSearch}
                className="hidden md:flex items-center gap-2 border-b border-kave-ink/30 focus-within:border-kave-ink transition-colors pb-1 w-40 lg:w-52"
                role="search"
              >
                <svg className="w-4 h-4 shrink-0 text-kave-ink/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3m1.8-4.45a6.25 6.25 0 1 1-12.5 0 6.25 6.25 0 0 1 12.5 0Z" />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  aria-label={t("searchLabel")}
                  className="w-full bg-transparent text-sm text-kave-ink placeholder:text-kave-ink/50 focus:outline-none"
                />
              </form>

              {/* Compte */}
              <Link
                href={`${prefix}/contacte`}
                aria-label={t("accountLabel")}
                className="hidden md:inline-flex p-1.5 text-kave-ink hover:text-kave-tag transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0" />
                </svg>
              </Link>

              {/* Cistell */}
              <span className="text-kave-ink [&_*]:!text-current">
                <CartIndicator />
              </span>

              {/* Hamburger (mòbil) */}
              <button
                className="lg:hidden p-1.5 text-kave-ink"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Tanca el menú" : "Obre el menú"}
                aria-expanded={menuOpen}
                aria-controls="shop-mobile-menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menú mòbil */}
      {menuOpen && (
        <div id="shop-mobile-menu" className="lg:hidden bg-kave-bg border-b border-kave-line" role="dialog" aria-label="Menú de la botiga">
          <div className="px-5 py-5">
            <form onSubmit={onSearch} className="flex items-center gap-2 border-b border-kave-ink/30 pb-2 mb-5" role="search">
              <svg className="w-4 h-4 shrink-0 text-kave-ink/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3m1.8-4.45a6.25 6.25 0 1 1-12.5 0 6.25 6.25 0 0 1 12.5 0Z" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchLabel")}
                className="w-full bg-transparent text-sm text-kave-ink placeholder:text-kave-ink/50 focus:outline-none"
              />
            </form>
            <nav className="flex flex-col gap-1" aria-label="Navegació de la botiga">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={clsx(
                    "py-2 text-base underline-offset-4",
                    section === link.key
                      ? "text-kave-ink font-medium underline decoration-2 decoration-kave-tag"
                      : "text-kave-ink",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
