// Capa de FONT de dades de mobiliari (DB-first amb fallback estàtic BLINDAT).
//
// SERVER-ONLY: només s'importa des de Server Components (les pàgines de
// /mobiliari). Llegeix Supabase (rol anon, RLS: només productes published+visible)
// i, davant de QUALSEVOL error o resultat buit, cau als objectes hardcodats de
// src/lib/mobiliari*.ts (la FONT DE VERITAT de reserva). Així, en local amb
// .env.local buit (getSupabase() llança), el render és idèntic a l'actual.
//
// REGLA DE FALLBACK (idèntica a catifes-source.ts):
//   - Funcions de LLISTA (array): fallback si error O array buit.
//   - Funcions d'ÍTEM (un sol registre): fallback si error O resultat nul. Això
//     reprodueix EXACTAMENT el comportament actual (p. ex. un slug no publicat
//     torna a l'estàtic, i la pàgina segueix fent notFound() com avui).
//
// NO es modifica cap dada hardcodada: aquesta capa només AFEGEIX lectura dinàmica.
//
// El repte dels CLIENT components (MobleBuyBlock / MoblePurchasePanel) ja està
// resolt a la pàgina: el Server Component fa TOTES les lectures aquí i les passa
// per PROPS. Els client components no importen mai dades estàtiques (només tipus
// i helpers purs), de manera que el color/variant_key/cistella són idèntics.

import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";
import {
  MOBLES,
  MOBLE_SLUGS,
  getMoble,
  mobleImage,
  type Moble,
  type MobleCat,
} from "@/lib/mobiliari";
import {
  getMobleDetall,
  type MobleDetall,
  type MobleVariant,
} from "@/lib/mobiliari-detall";
import { getMobleSpec, type MobleSpec } from "@/lib/mobiliari-specs";
import { getMobleColors, type MobleColor } from "@/lib/mobiliari-colors";

// --- Tipus de fila (mapatge cru de les taules web_*) -----------------------

type MobleProductRow = {
  slug: string;
  nom: string;
  familia: string;
  pvp_desde: number | string | null;
  pvp_abans: number | string | null;
  supplier_ref: string | null;
};

type VariantRow = {
  label: string | null;
  dim: string | null;
  pvp: number | string | null;
  pvp_abans: number | string | null;
  orden: number | null;
};

type ColorRow = {
  name: string | null;
  image_source: string | null;
  image_path: string;
  orden: number | null;
};

type ImageRow = {
  kind: string;
  image_source: string | null;
  image_path: string;
};

type MaterialJson = {
  ca?: unknown;
  es?: unknown;
  en?: unknown;
  fr?: unknown;
} | null;

// --- Helpers de coerció numèrica (idèntics a catifes-source.ts) -------------

/** numeric → number, o null. Blinda contra numeric-com-a-string de PostgREST. */
function toNum(v: number | string | null | undefined): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** numeric → number | undefined (per a camps opcionals com pvpAbans). */
function toNumOrUndef(v: number | string | null | undefined): number | undefined {
  const n = toNum(v);
  return n === null ? undefined : n;
}

/**
 * Resol la URL pública d'una imatge segons l'origen:
 *   - "storage": bucket `botiga-web` de Supabase Storage (URL pública signada).
 *   - qualsevol altre valor ("public", null): el path ja és una ruta del repo
 *     web servida des de /public (p. ex. /images/mobiliari/{slug}/color-x.jpg),
 *     s'usa tal com ve.
 */
function resolveImageUrl(
  supabase: SupabaseClient,
  source: string | null,
  path: string,
): string {
  if (source === "storage") {
    return supabase.storage.from("botiga-web").getPublicUrl(path).data.publicUrl;
  }
  return path;
}

// --- Constants de consulta --------------------------------------------------

const PRODUCT_SELECT = "slug,nom,familia,pvp_desde,pvp_abans,supplier_ref";

const LOG_PREFIX = "[mobiliari-source] fallback estàtic:";

/** Mapeja una fila web_products al tipus Moble del web. */
function rowToMoble(row: MobleProductRow): Moble {
  return {
    slug: row.slug,
    nom: row.nom,
    // La família de la BD és la categoria de moble (cadira/butaca/pouf/moble).
    cat: row.familia as MobleCat,
    // pvp és NO nul·lable al tipus Moble; el "des de" surt de pvp_desde.
    pvp: toNum(row.pvp_desde) ?? 0,
    pvpAbans: toNumOrUndef(row.pvp_abans),
    marca: "Cortinatges Esteba",
    supplierRef: row.supplier_ref ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// LLISTA — tots els mobles publicats i visibles (equival a MOBLES). Mobiliari
// no té famílies amagades al web (a diferència de catifes), així que la llista
// visible coincideix amb la llista sencera.
// ---------------------------------------------------------------------------

async function fetchAllMobles(): Promise<Moble[] | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("web_products")
      .select(PRODUCT_SELECT)
      .eq("catalog_type", "moble")
      .eq("estat", "published")
      .eq("visible", true)
      .order("orden", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return null;
    return (data as MobleProductRow[]).map(rowToMoble);
  } catch (err) {
    console.warn(`${LOG_PREFIX} getMobles()`, (err as Error)?.message ?? err);
    return null;
  }
}

/** Tots els mobles (DB-first). Fallback: MOBLES estàtic. */
export async function getMobles(): Promise<Moble[]> {
  return (await fetchAllMobles()) ?? MOBLES;
}

/** Slugs visibles (per a generateStaticParams). DB-first; fallback estàtic. */
export async function getVisibleMobleSlugs(): Promise<string[]> {
  const all = await fetchAllMobles();
  if (!all) return MOBLE_SLUGS;
  const slugs = all.map((m) => m.slug);
  return slugs.length > 0 ? slugs : MOBLE_SLUGS;
}

// ---------------------------------------------------------------------------
// ÍTEM — un moble pel seu slug (equival a getMoble). Fallback si nul.
// ---------------------------------------------------------------------------

/** Un moble pel slug (DB-first). Fallback: getMoble() estàtic. */
export async function getMobleBySlug(slug: string): Promise<Moble | undefined> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("web_products")
      .select(PRODUCT_SELECT)
      .eq("catalog_type", "moble")
      .eq("estat", "published")
      .eq("visible", true)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return getMoble(slug);
    return rowToMoble(data as MobleProductRow);
  } catch (err) {
    console.warn(`${LOG_PREFIX} getMobleBySlug(${slug})`, (err as Error)?.message ?? err);
    return getMoble(slug);
  }
}

// ---------------------------------------------------------------------------
// DETALL comercial (variants + PVP per variant + termini). Fallback si nul/buit.
// L'ORDRE de les variants (per `orden`) coincideix amb la llavor estàtica, de
// manera que el variant_key del carret (`index` o `index-dim`) és idèntic.
// ---------------------------------------------------------------------------

/** Detall comercial d'un moble (DB-first). Fallback: getMobleDetall() estàtic. */
export async function getMobleDetallSource(
  slug: string,
): Promise<MobleDetall | undefined> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("web_products")
      .select("termini,web_product_variants(label,dim,pvp,pvp_abans,orden)")
      .eq("catalog_type", "moble")
      .eq("estat", "published")
      .eq("visible", true)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;

    const variantRows = (data?.web_product_variants ?? []) as VariantRow[];
    // Sense variants no hi ha detall vendible: cau a l'estàtic (mai un panell buit).
    if (!data || variantRows.length === 0) return getMobleDetall(slug);

    const variants: MobleVariant[] = [...variantRows]
      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
      .map((v) => ({
        nom: v.label ?? "",
        dim: v.dim,
        pvp: toNum(v.pvp) ?? 0,
        pvpAbans: toNumOrUndef(v.pvp_abans),
      }));

    return {
      variants,
      termini: (data as { termini: string | null }).termini ?? "",
    };
  } catch (err) {
    console.warn(`${LOG_PREFIX} getMobleDetallSource(${slug})`, (err as Error)?.message ?? err);
    return getMobleDetall(slug);
  }
}

// ---------------------------------------------------------------------------
// SPEC tècnica (dimensions + material 4 idiomes + acabats). Fallback si nul.
// Els mobles sense dimensions/material (scandinave-ii, mosa) NO tenen spec:
// caiem a l'estàtic, que per a aquests slugs també retorna undefined.
// ---------------------------------------------------------------------------

/** Especificació tècnica d'un moble (DB-first). Fallback: getMobleSpec() estàtic. */
export async function getMobleSpecSource(
  slug: string,
): Promise<MobleSpec | undefined> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("web_products")
      .select("dimensions,material,finishes")
      .eq("catalog_type", "moble")
      .eq("estat", "published")
      .eq("visible", true)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;

    const row = data as
      | { dimensions: string | null; material: MaterialJson; finishes: string[] | null }
      | null;
    const material = row?.material ?? null;
    // Sense dimensions o sense material no hi ha spec mostrable: cau a l'estàtic
    // (que per scandinave-ii/mosa també és undefined).
    if (!row || row.dimensions == null || material == null) return getMobleSpec(slug);

    return {
      dimensions: row.dimensions,
      material: {
        ca: String(material.ca ?? ""),
        es: String(material.es ?? ""),
        en: String(material.en ?? ""),
        fr: String(material.fr ?? ""),
      },
      finishes: (row.finishes ?? []) as string[],
    };
  } catch (err) {
    console.warn(`${LOG_PREFIX} getMobleSpecSource(${slug})`, (err as Error)?.message ?? err);
    return getMobleSpec(slug);
  }
}

// ---------------------------------------------------------------------------
// COLORS amb foto per acabat. Fallback si error O buit. Molts mobles no en
// tenen (virgo, mosa…): l'estàtic també retorna [] per a aquests, així que
// "buit → estàtic" dóna el mateix resultat.
// ---------------------------------------------------------------------------

/** Colors amb foto d'un moble (DB-first). Fallback: getMobleColors() estàtic. */
export async function getMobleColorsSource(slug: string): Promise<MobleColor[]> {
  try {
    const supabase = getSupabase();
    const { data: product, error: pErr } = await supabase
      .from("web_products")
      .select("id")
      .eq("catalog_type", "moble")
      .eq("estat", "published")
      .eq("visible", true)
      .eq("slug", slug)
      .maybeSingle();
    if (pErr) throw pErr;
    if (!product) return getMobleColors(slug);

    const { data, error } = await supabase
      .from("web_product_colors")
      .select("name,image_source,image_path,orden")
      .eq("product_id", (product as { id: string }).id)
      .order("orden", { ascending: true });
    if (error) throw error;

    const rows = (data ?? []) as ColorRow[];
    if (rows.length === 0) return getMobleColors(slug);

    return rows.map((c) => ({
      name: c.name ?? "",
      image: resolveImageUrl(supabase, c.image_source, c.image_path),
    }));
  } catch (err) {
    console.warn(`${LOG_PREFIX} getMobleColorsSource(${slug})`, (err as Error)?.message ?? err);
    return getMobleColors(slug);
  }
}

// ---------------------------------------------------------------------------
// IMATGE HERO (foto principal per defecte + OG + JSON-LD). Fallback si nul.
// Equival a mobleImage(slug) = /images/mobiliari/{slug}/1.jpg.
// ---------------------------------------------------------------------------

/** Foto hero d'un moble (DB-first). Fallback: mobleImage() estàtic. */
export async function getMobleHeroImage(slug: string): Promise<string> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("web_products")
      .select("web_product_images(kind,image_source,image_path)")
      .eq("catalog_type", "moble")
      .eq("estat", "published")
      .eq("visible", true)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return mobleImage(slug);

    const images = ((data as { web_product_images: ImageRow[] | null })
      .web_product_images ?? []) as ImageRow[];
    const hero = images.find((i) => i.kind === "hero");
    if (!hero) return mobleImage(slug);

    return resolveImageUrl(supabase, hero.image_source, hero.image_path);
  } catch (err) {
    console.warn(`${LOG_PREFIX} getMobleHeroImage(${slug})`, (err as Error)?.message ?? err);
    return mobleImage(slug);
  }
}
