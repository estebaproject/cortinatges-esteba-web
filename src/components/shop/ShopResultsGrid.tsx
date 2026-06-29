"use client";

// Graella de resultats unificada (clon Kave) per a /rebaixes i /cerca.
// Rep ShopItems normalitzats i tria la card correcta per tipus:
//   - catifa → CatifaCard (gestiona el preu null "per encàrrec")
//   - moble/manta → KaveProductCard
// Les etiquetes (categoria/família) es resolen aquí via i18n.

import { useTranslations } from "next-intl";
import KaveProductCard from "@/components/shop/KaveProductCard";
import CatifaCard from "@/components/catifes/CatifaCard";
import type { ShopItem } from "@/lib/shop-search";

export default function ShopResultsGrid({
  items,
  prefix,
}: {
  items: ShopItem[];
  prefix: string;
}) {
  const tMobles = useTranslations("Mobiliari");
  const tCatifes = useTranslations("Catifes");
  const tMantes = useTranslations("Mantes");

  const subtitleFor = (it: ShopItem): string => {
    if (it.type === "moble") return tMobles(`tipus.${it.groupKey}` as Parameters<typeof tMobles>[0]);
    if (it.type === "catifa") return tCatifes(`families.${it.groupKey}` as Parameters<typeof tCatifes>[0]);
    return tMantes("eyebrow");
  };

  const pricePrefixFor = (it: ShopItem): string | undefined => {
    if (!it.fromPrice) return undefined;
    if (it.type === "catifa") return tCatifes("fromPrice");
    if (it.type === "manta") return tMantes("fromPrice");
    return tMobles("fromPrice");
  };

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10" role="list">
      {items.map((it) => (
        <li key={`${it.type}-${it.slug}`}>
          {it.type === "catifa" ? (
            <CatifaCard
              href={`${prefix}${it.path}`}
              image={it.image}
              title={it.nom}
              subtitle={subtitleFor(it)}
              pvpDesde={it.pvp}
              pvpAbans={it.pvpAbans}
              fit={it.fit}
            />
          ) : (
            <KaveProductCard
              href={`${prefix}${it.path}`}
              image={it.image}
              title={it.nom}
              subtitle={subtitleFor(it)}
              pvp={it.pvp as number}
              pvpAbans={it.pvpAbans}
              pricePrefix={pricePrefixFor(it)}
              fit={it.fit}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
