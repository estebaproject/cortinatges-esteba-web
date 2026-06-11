"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

const STORAGE_KEY = "esteba-cookie-consent";

export default function CookieBanner() {
  const t = useTranslations("CookieBanner");
  const locale = useLocale();
  const prefix = locale === "ca" ? "" : `/${locale}`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const decide = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* no-op */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] bg-ink text-canvas border-t border-ink-muted"
      role="dialog"
      aria-live="polite"
      aria-label={t("title")}
    >
      <div className="max-w-layout mx-auto px-6 lg:px-12 py-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <p className="font-sans text-body-sm text-canvas/85 flex-1">
          {t("message")}{" "}
          <Link href={`${prefix}/cookies`} className="underline hover:text-canvas">
            {t("more")}
          </Link>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => decide("rejected")}
            className="px-5 py-2.5 border border-canvas/40 text-canvas font-sans text-xs tracking-widest uppercase hover:border-canvas transition-colors"
          >
            {t("reject")}
          </button>
          <button
            onClick={() => decide("accepted")}
            className="px-5 py-2.5 bg-sand text-ink font-sans text-xs font-medium tracking-widest uppercase hover:bg-sand-dark transition-colors"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
