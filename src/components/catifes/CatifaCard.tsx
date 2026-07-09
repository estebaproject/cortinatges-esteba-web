"use client";

// Card de catifa — embolcall prim sobre KaveProductCard (clon Kave). Les catifes
// tenen un preu "des de" NUL·LABLE: algunes són només per encàrrec, sense preu.
// Com que KaveProductCard exigeix un pvp numèric, quan pvpDesde és null rendim
// una card visualment idèntica però amb "Per encàrrec" allà on aniria el preu
// (MAI un preu fals ni un descompte inventat). Quan hi ha preu, deleguem del tot
// a KaveProductCard, que ja gestiona la rebaixa real (pvpAbans > pvpDesde) amb
// el tatxat + -% + preu vermell + tag "Rebaixes".

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import KaveProductCard from "@/components/shop/KaveProductCard";

type Props = {
  href: string;
  /** Foto d'escena de la catifa (es mostra amb object-cover). */
  image: string;
  title: string;
  /** Línia subtil sota el títol (família). */
  subtitle?: string;
  /** Preu públic «des de» (IVA inclòs), o null si és només per encàrrec. */
  pvpDesde: number | null;
  /** Preu anterior real (€) — només si hi ha rebaixa real sobre pvpDesde. */
  pvpAbans?: number;
  /** Mostra la UI de rebaixa (només /rebaixes). Per defecte false: preu net. */
  showSale?: boolean;
  /** object-fit de la foto (default cover; contain per a portraits). */
  fit?: "contain" | "cover";
  priority?: boolean;
  sizes?: string;
};

export default function CatifaCard({
  href,
  image,
  title,
  subtitle,
  pvpDesde,
  pvpAbans,
  showSale = false,
  fit = "cover",
  priority,
  sizes,
}: Props) {
  const t = useTranslations("Catifes");
  const ts = useTranslations("Shop");

  // Cas amb preu: reutilitzem la card compartida amb prefix "des de" i la foto
  // d'escena (object-cover: el retall és intencionat). La rebaixa real, si n'hi
  // ha, la pinta KaveProductCard a partir de pvpAbans.
  if (pvpDesde !== null) {
    return (
      <KaveProductCard
        href={href}
        image={image}
        title={title}
        subtitle={subtitle}
        pvp={pvpDesde}
        pvpAbans={pvpAbans}
        pricePrefix={t("fromPrice")}
        showSale={showSale}
        fit={fit}
        priority={priority}
        sizes={sizes}
      />
    );
  }

  // Cas "per encàrrec" sense preu: mateixa estructura visual que KaveProductCard,
  // però amb una etiqueta honesta on aniria el preu.
  return (
    <Link href={href} className="group flex h-full flex-col font-grotesque">
      <div className="relative aspect-square overflow-hidden bg-white">
        <Image
          src={image}
          alt={title}
          fill
          priority={priority}
          sizes={sizes ?? "(min-width:1280px) 22vw, (min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"}
          className={`object-${fit} transition-transform duration-500 group-hover:scale-[1.02]`}
        />
        {/* Barra "Afegir a la cistella" — apareix en hover (porta a la fitxa). */}
        <span className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-kave-bg/95 text-center py-2.5 text-sm text-kave-ink border-t border-kave-line">
          {ts("addToCart")}
        </span>
      </div>

      <h3 className="mt-3 text-[0.95rem] font-semibold text-kave-ink group-hover:underline underline-offset-2 decoration-1 line-clamp-2 min-h-[2.85rem]">
        {title}
      </h3>
      {subtitle && (
        <p className="mt-0.5 text-sm text-kave-muted line-clamp-1">{subtitle}</p>
      )}

      <div className="mt-1.5 text-sm">
        <span className="text-kave-ink font-semibold">{t("onDemand")}</span>
      </div>

      <span className="mt-1.5 inline-flex items-center gap-1.5 text-[0.78rem] text-kave-muted">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-6V6.75A1.5 1.5 0 0 0 9 5.25H5.25m11.25 0H18a2.25 2.25 0 0 1 2.25 2.25v3" />
        </svg>
        {ts("deliveryFast")}
      </span>
    </Link>
  );
}
