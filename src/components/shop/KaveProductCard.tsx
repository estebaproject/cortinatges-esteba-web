"use client";

// Card de producte — clon de Kave Home. Presentacional i genèrica: serveix per
// a mobiliari, catifes i mantes. Mostra rebaixes REALS només si pvpAbans > pvp
// (vegeu src/lib/discount.ts): preu tatxat + -% + preu vermell + tag "Rebaixes".
// Si no hi ha oferta, card neta amb un sol preu. Tota la card és un enllaç a la
// fitxa; l'overlay "Afegir a la cistella" porta a la fitxa per triar la variant.

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { discountPct, formatEur } from "@/lib/discount";

export type KaveProductCardProps = {
  href: string;
  image: string;
  title: string;
  /** Descripció breu o categoria sota el títol. */
  subtitle?: string;
  pvp: number;
  /** Preu anterior real (€) — només si està en oferta. */
  pvpAbans?: number;
  /** Prefix de preu opcional (ex. "des de" per a famílies amb «des de»). */
  pricePrefix?: string;
  /**
   * Mostra la UI de rebaixa (tag "Rebaixes" + tatxat + -% + preu vermell) quan
   * hi ha oferta real. Per defecte FALSE: als llistats, cerca i carrusels la card
   * ensenya només el preu net. Només la pàgina /rebaixes ho posa a true, de manera
   * que les ofertes viuen concentrades allà. La fitxa de producte té la seva
   * pròpia lògica de rebaixa (panells de compra), independent d'aquest flag.
   */
  showSale?: boolean;
  fit?: "contain" | "cover";
  priority?: boolean;
  sizes?: string;
  /** Rutes de foto de cada color disponible; pinta mostres rodones a la card. */
  colors?: string[];
};

export default function KaveProductCard({
  href,
  image,
  title,
  subtitle,
  pvp,
  pvpAbans,
  pricePrefix,
  showSale = false,
  fit = "contain",
  priority,
  sizes,
  colors,
}: KaveProductCardProps) {
  const t = useTranslations("Shop");
  const locale = useLocale();
  const pct = discountPct(pvp, pvpAbans);
  // La rebaixa només es pinta si el consumidor ho demana (showSale). Fora de
  // /rebaixes la card ensenya el preu net encara que existeixi pvpAbans.
  const onSale = pct !== null && showSale;

  return (
    <Link href={href} className="group block font-grotesque">
      <div className="relative aspect-square overflow-hidden bg-white">
        <Image
          src={image}
          alt={title}
          fill
          priority={priority}
          quality={90}
          sizes={sizes ?? "(min-width:1280px) 22vw, (min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"}
          className={`${fit === "cover" ? "object-cover" : "object-contain p-4"} transition-transform duration-500 group-hover:scale-[1.02]`}
        />

        {onSale && (
          <span className="absolute left-0 top-3 z-10 bg-kave-tag text-kave-ink text-[0.7rem] font-medium tracking-wide px-2.5 py-1">
            {t("saleTag")}
          </span>
        )}

        {/* Barra "Afegir a la cistella" — apareix en hover (porta a la fitxa). */}
        <span className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-kave-bg/95 text-center py-2.5 text-sm text-kave-ink border-t border-kave-line">
          {t("addToCart")}
        </span>
      </div>

      <h3 className="mt-3 text-[0.95rem] font-semibold text-kave-ink group-hover:underline underline-offset-2 decoration-1">
        {title}
      </h3>
      {subtitle && (
        <p className="mt-0.5 text-sm text-kave-muted line-clamp-2">{subtitle}</p>
      )}

      <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
        {onSale ? (
          <>
            <span className="text-kave-muted line-through">
              {formatEur(pvpAbans as number, locale)}
            </span>
            <span className="text-kave-red font-semibold">-{pct}%</span>
            <span className="text-kave-red font-semibold">{formatEur(pvp, locale)}</span>
          </>
        ) : (
          <span className="text-kave-ink font-semibold">
            {pricePrefix ? `${pricePrefix} ` : ""}
            {formatEur(pvp, locale)}
          </span>
        )}
      </div>

      {/* Mostres de color disponibles (fins a 5 + "+N"). Decoratives: la tria
          real es fa a la fitxa. */}
      {colors && colors.length > 0 && (
        <div className="mt-2 flex items-center gap-1.5" aria-hidden>
          {colors.slice(0, 5).map((img, i) => (
            <span
              key={`${img}-${i}`}
              className="relative h-4 w-4 overflow-hidden rounded-full ring-1 ring-kave-line"
            >
              <Image src={img} alt="" fill sizes="16px" className="object-cover" />
            </span>
          ))}
          {colors.length > 5 && (
            <span className="text-[0.72rem] text-kave-muted">+{colors.length - 5}</span>
          )}
        </div>
      )}

      <span className="mt-1.5 inline-flex items-center gap-1.5 text-[0.78rem] text-kave-muted">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-6V6.75A1.5 1.5 0 0 0 9 5.25H5.25m11.25 0H18a2.25 2.25 0 0 1 2.25 2.25v3" />
        </svg>
        {t("deliveryFast")}
      </span>
    </Link>
  );
}
