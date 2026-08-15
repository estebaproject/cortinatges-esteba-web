"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import {
  V2_LOCALES,
  V2_PHONE_DISPLAY,
  V2_PHONE_TEL,
  v2Path,
} from "@/lib/v2/config";
import { ButtonLink } from "./ui/V2Button";
import { CloseIcon, MenuIcon, PhoneIcon } from "./ui/icons";

/**
 * Capçalera del prototip v2.
 *
 * Dues diferències de fons amb la de la web actual:
 *
 * 1. A la portada arrenca TRANSPARENT sobre la foto i es torna sòlida en fer
 *    scroll. La capçalera actual és una barra blanca opaca de 116px d'alçada
 *    que es menja la primera pantalla sencera abans que es vegi res.
 * 2. El TELÈFON hi és sempre. La web actual no en té cap a la portada, ni al
 *    capçal ni al cos, tot i que la trucada és la conversió principal d'un
 *    negoci local amb tres botigues.
 */
export default function V2Header({ locale }: { locale: string }) {
  const t = useTranslations("V2.nav");
  const tc = useTranslations("V2.cta");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // A la portada la capçalera va per sobre de la foto; a la resta de pàgines
  // sempre és sòlida, perquè no hi ha imatge a sang que la sostingui.
  const isHome = pathname === v2Path(locale) || pathname === `${v2Path(locale)}/`;
  const solid = scrolled || !isHome || menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloqueja el scroll del fons mentre el menú de mòbil és obert. Sense això
  // el contingut de darrere es mou sota el dit i es perd la posició de lectura.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => setMenuOpen(false), [pathname]);

  const links = [
    { href: v2Path(locale, "colleccions"), label: t("collections") },
    { href: `${v2Path(locale)}#estances`, label: t("rooms") },
    { href: `${v2Path(locale)}#com-treballem`, label: t("process") },
    { href: v2Path(locale, "botigues"), label: t("stores") },
    { href: v2Path(locale, "el-taller"), label: t("about") },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={clsx(
          "transition-colors duration-500 ease-editorial",
          solid
            ? "bg-v2-paper/95 backdrop-blur-sm border-b border-v2-bone"
            : "bg-transparent border-b border-transparent",
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-v2-layout items-center gap-6 px-6 md:h-[84px] md:px-10 lg:px-14">
          {/* Marca */}
          <Link
            href={v2Path(locale)}
            aria-label={t("home")}
            className="group flex shrink-0 flex-col justify-center leading-none"
          >
            <span
              className={clsx(
                "font-v2-display text-[1.0625rem] font-semibold uppercase tracking-[0.2em] transition-colors duration-500 md:text-xl",
                solid ? "text-v2-ink" : "text-v2-paper",
              )}
            >
              Esteba
            </span>
            <span
              className={clsx(
                "mt-1 hidden font-v2-sans text-[0.625rem] uppercase tracking-[0.28em] transition-colors duration-500 md:block",
                solid ? "text-v2-brass-2" : "text-v2-paper/70",
              )}
            >
              Cortinatges · 1961
            </span>
          </Link>

          {/* Navegació desktop */}
          <nav
            className="ml-auto hidden items-center gap-7 lg:flex"
            aria-label={t("menuOpen")}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "font-v2-sans text-v2-sm font-medium transition-colors duration-300",
                  solid
                    ? "text-v2-ink-2 hover:text-v2-brass-2"
                    : "text-v2-paper/85 hover:text-v2-paper",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Accions */}
          <div className="ml-auto flex items-center gap-2 lg:ml-6 lg:gap-4">
            <LocaleSwitch locale={locale} pathname={pathname} solid={solid} />

            <a
              href={`tel:${V2_PHONE_TEL}`}
              className={clsx(
                "hidden items-center gap-2 font-v2-sans text-v2-sm font-semibold transition-colors duration-300 md:inline-flex",
                solid ? "text-v2-ink hover:text-v2-brass-2" : "text-v2-paper",
              )}
            >
              <PhoneIcon className="h-4 w-4" />
              {V2_PHONE_DISPLAY}
            </a>

            <ButtonLink
              href={v2Path(locale, "pressupost")}
              variant={solid ? "primary" : "onDark"}
              className="hidden lg:inline-flex"
            >
              {tc("budgetShort")}
            </ButtonLink>

            {/* Mòbil: trucar sempre visible, abans que el menú. */}
            <a
              href={`tel:${V2_PHONE_TEL}`}
              aria-label={tc("call")}
              className={clsx(
                "inline-flex h-11 w-11 items-center justify-center md:hidden",
                solid ? "text-v2-ink" : "text-v2-paper",
              )}
            >
              <PhoneIcon className="h-5 w-5" />
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="v2-mobile-menu"
              aria-label={menuOpen ? t("menuClose") : t("menuOpen")}
              className={clsx(
                "inline-flex h-11 w-11 items-center justify-center lg:hidden",
                solid ? "text-v2-ink" : "text-v2-paper",
              )}
            >
              {menuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú de mòbil: pantalla sencera i tipografia gran. Un desplegable
          d'enllaços de 14px en un mòbil és exactament el que ningú vol tocar. */}
      {menuOpen && (
        <div
          id="v2-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t("menuOpen")}
          className="fixed inset-0 top-[72px] z-40 overflow-y-auto bg-v2-paper lg:hidden"
        >
          <nav className="flex flex-col px-6 py-8">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-v2-bone py-5 font-v2-display text-v2-h3 text-v2-ink"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={v2Path(locale, "serveis")}
              className="border-b border-v2-bone py-5 font-v2-display text-v2-h3 text-v2-ink"
            >
              {t("services")}
            </Link>
            <Link
              href={v2Path(locale, "contacte")}
              className="border-b border-v2-bone py-5 font-v2-display text-v2-h3 text-v2-ink"
            >
              {t("contact")}
            </Link>

            <ButtonLink
              href={v2Path(locale, "pressupost")}
              variant="primary"
              size="lg"
              className="mt-8 w-full"
            >
              {tc("budget")}
            </ButtonLink>
            <a
              href={`tel:${V2_PHONE_TEL}`}
              className="mt-4 inline-flex min-h-[56px] w-full items-center justify-center gap-2 border border-v2-ink/25 font-v2-sans text-v2-body font-semibold text-v2-ink"
            >
              <PhoneIcon className="h-5 w-5" />
              {V2_PHONE_DISPLAY}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

/**
 * Canvi d'idioma. Conserva la ruta actual i només intercanvia el segment
 * d'idioma: si ets a /v2/ca/botigues i tries francès, vas a /v2/fr/botigues i
 * no pas a la portada, que és el que fa la majoria de selectors mal fets.
 */
function LocaleSwitch({
  locale,
  pathname,
  solid,
}: {
  locale: string;
  pathname: string;
  solid: boolean;
}) {
  const rest = pathname.replace(new RegExp(`^/v2/${locale}`), "") || "/";

  return (
    <div className="hidden items-center gap-1 md:flex">
      {V2_LOCALES.map((loc) => (
        <Link
          key={loc}
          href={`/v2/${loc}${rest === "/" ? "" : rest}`}
          hrefLang={loc}
          aria-current={loc === locale ? "true" : undefined}
          className={clsx(
            "px-1.5 py-1 font-v2-sans text-v2-xs font-semibold uppercase transition-colors duration-300",
            loc === locale
              ? solid
                ? "text-v2-brass-2"
                : "text-v2-paper"
              : solid
                ? "text-v2-ink-3 hover:text-v2-ink"
                : "text-v2-paper/50 hover:text-v2-paper",
          )}
        >
          {loc}
        </Link>
      ))}
    </div>
  );
}
