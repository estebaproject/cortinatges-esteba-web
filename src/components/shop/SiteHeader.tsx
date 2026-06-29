"use client";

// Tria de capçalera segons la ruta. A les rutes de BOTIGA renderitza el header
// clon de Kave (ShopHeader); a la resta del lloc, la capçalera de marca Esteba
// (Header). Així el tema Kave queda confinat a la tenda sense tocar el home,
// contacte, serveis, etc.

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import ShopHeader from "@/components/shop/ShopHeader";

const SHOP_SEGMENTS = new Set([
  "botiga",
  "mobiliari",
  "catifes",
  "mantes",
  "rebaixes",
  "cerca",
  "cistell",
  "checkout",
]);
// ca és el locale per defecte i no porta prefix a la URL.
const LOCALE_PREFIXES = new Set(["es", "en", "fr"]);

function isShopPath(pathname: string): boolean {
  const parts = pathname.replace(/^\/+/, "").split("/");
  let first = parts[0] ?? "";
  if (LOCALE_PREFIXES.has(first)) first = parts[1] ?? "";
  return SHOP_SEGMENTS.has(first);
}

export default function SiteHeader() {
  const pathname = usePathname();
  return isShopPath(pathname) ? <ShopHeader /> : <Header />;
}
