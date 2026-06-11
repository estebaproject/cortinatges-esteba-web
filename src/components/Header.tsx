"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";
import CartIndicator from "./cart/CartIndicator";

export default function Header() {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  const prefix = locale === "ca" ? "" : `/${locale}`;

  const navLinks = [
    { href: `${prefix || "/"}#productes`, label: t("collections"), external: false },
    { href: `${prefix}/catifes`, label: t("catifes"), external: false },
    { href: `${prefix}/mobiliari`, label: t("mobles"), external: false },
    { href: `${prefix}/serveis`, label: t("services"), external: false },
    { href: `${prefix}/botigues`, label: t("stores"), external: false },
    { href: `${prefix}/nosaltres`, label: t("about"), external: false },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Strip superior blau marí */}
      <div className="bg-ink text-canvas">
        <div className="max-w-layout mx-auto px-6 lg:px-12 flex items-center justify-between h-9 text-xs tracking-widest uppercase">
          <span className="font-sans text-canvas/70">Des de 1961</span>
          <div className="flex items-center gap-5">
            <Link
              href={`${prefix}/demana-pressupost`}
              className="hidden sm:inline text-canvas/80 hover:text-canvas transition-colors"
            >
              Demana pressupost
            </Link>
            <a
              href="https://www.instagram.com/cortinatgesesteba/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-canvas/80 hover:text-canvas transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.62c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.17-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.14.24 1.76.4 2.17.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.17a3.6 3.6 0 00-.88-1.35 3.6 3.6 0 00-1.35-.88c-.41-.16-1.03-.35-2.17-.4-1.24-.06-1.59-.07-4.74-.07zm0 2.76a5.46 5.46 0 110 10.92 5.46 5.46 0 010-10.92zm0 9a3.54 3.54 0 100-7.08 3.54 3.54 0 000 7.08zm6.95-9.22a1.28 1.28 0 11-2.55 0 1.28 1.28 0 012.55 0z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/CortinatgesEsteba"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-canvas/80 hover:text-canvas transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.08 24 18.09 24 12.07z" />
              </svg>
            </a>
            <LocaleSwitcher />
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <div className="bg-canvas border-b border-linen">
        <div className="max-w-layout mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-3 items-center h-20">
            {/* Espai buit per centrar el logo — la navegació va a la fila inferior */}
            <div className="hidden md:block" aria-hidden="true" />

            {/* Logo centrat dins caixa */}
            <Link
              href={prefix || "/"}
              className="justify-self-start md:justify-self-center group"
              aria-label="Cortinatges Esteba — inici"
            >
              <span className="flex items-center leading-none border border-ink/70 px-4 md:px-6 py-3 group-hover:border-ink transition-colors">
                <span className="font-serif text-xl md:text-2xl text-ink tracking-[0.18em] uppercase font-semibold">
                  Cortinatges Esteba
                </span>
              </span>
            </Link>

            {/* Accions dreta */}
            <div className="flex items-center justify-end gap-3 md:gap-4">
              <CartIndicator />
              <Link
                href={`${prefix}/botiga`}
                className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 bg-ink text-canvas font-sans text-xs font-semibold tracking-[0.2em] uppercase hover:bg-ink/90 transition-colors"
                aria-label="ESTEBA — botiga online"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12A1.125 1.125 0 0 1 19.748 21H4.252a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 6.75h12.974c.576 0 1.059.435 1.119 1.007Z" />
                </svg>
                ESTEBA
              </Link>
              <Link
                href={`${prefix}/contacte`}
                className="hidden md:inline-flex items-center px-6 py-2.5 bg-sand text-ink font-sans text-xs font-medium tracking-widest uppercase hover:bg-sand-dark transition-colors"
              >
                {t("contact")}
              </Link>
              <button
                className="md:hidden p-2 text-ink"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Tanca el menú" : "Obre el menú"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Segona fila nav (desktop) */}
          <nav
            className="hidden md:flex items-center justify-center gap-8 h-11 border-t border-linen"
            aria-label="Navegació secundària"
          >
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs text-ink-muted tracking-widest uppercase hover:text-ink transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-xs text-ink-muted tracking-widest uppercase hover:text-ink transition-colors"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      </div>

      {/* Menú mòbil */}
      {menuOpen && (
        <div id="mobile-menu" className="md:hidden border-b border-linen bg-canvas" role="dialog" aria-label="Menú de navegació">
          <nav className="flex flex-col px-6 py-6 gap-5">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="font-sans text-body-md text-ink tracking-wide uppercase"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-sans text-body-md text-ink tracking-wide uppercase"
                >
                  {link.label}
                </Link>
              ),
            )}
            <Link
              href={`${prefix}/botiga`}
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-ink text-canvas font-sans text-xs font-semibold tracking-[0.2em] uppercase"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12A1.125 1.125 0 0 1 19.748 21H4.252a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 6.75h12.974c.576 0 1.059.435 1.119 1.007Z" />
              </svg>
              ESTEBA
            </Link>
            <Link
              href={`${prefix}/contacte`}
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center justify-center px-5 py-3 bg-sand text-ink font-sans text-xs tracking-widest uppercase"
            >
              {t("contact")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
