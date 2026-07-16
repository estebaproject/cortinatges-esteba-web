// Capa de FONT de dades de mantes (DB-first amb fallback estàtic BLINDAT).
//
// SERVER-ONLY: només s'importa des de Server Components (les pàgines de
// /mantes). Llegeix Supabase (rol anon, RLS: només productes published+visible)
// i, davant de QUALSEVOL error o resultat buit, cau als arrays hardcodats de
// src/lib/mantes.ts i src/lib/mantes-detall.ts (la FONT DE VERITAT de reserva).
// Així, en local amb .env.local buit (getSupabase() llança), el render és idèntic
// a l'actual.
//
// REGLA DE FALLBACK:
//   - Funcions de LLISTA (array): fallback si error O array buit.
//   - Funcions d'ÍTEM (un sol registre): fallback si error O resultat nul. Això
//     reprodueix EXACTAMENT el comportament actual (p. ex. un slug no publicat
//     torna a l'estàtic, i la pàgina segueix fent notFound() com avui).
//
// SHOW_MANTES: la secció de mantes segueix gated site-wide pel flag SHOW_MANTES
// de src/lib/site.ts (menú, /botiga i /cerca). Aquesta capa NO l'altera: les
// pàgines de /mantes mai han filtrat per SHOW_MANTES (només renderitzen MANTES),
// així que aquí tampoc ho fem. El comportament de visibilitat es preserva intacte.
//
// NO es modifica cap dada hardcodada: aquesta capa només AFEGEIX lectura dinàmica.

import { getSupabase } from "@/lib/supabase";
import {
  MANTES,
  MANTA_SLUGS,
  getManta,
  mantaImage,
  type Manta,
} from "@/lib/mantes";
import {
  getMantaDetall,
  type MantaDetall,
  type MantaVariant,
} from "@/lib/mantes-detall";

// --- Tipus de fila (mapatge cru de les taules web_*) -----------------------

type VariantCountEmbed = { count: number }[];

type ProductRow = {
  slug: string;
  nom: string;
  pvp_desde: number | string | null;
  pvp_abans: number | string | null;
  supplier_ref: string | null;
  web_product_variants: VariantCountEmbed | null;
};

type VariantRow = {
  variant_key: string;
  pvp: number | string | null;
  pvp_abans: number | string | null;
  orden: number | null;
};

type ImageRow = {
  kind: string;
  image_path: string;
  image_source: string;
  orden: number | null;
};

// --- Helpers de coerció numèrica -------------------------------------------

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

// --- Constants de consulta --------------------------------------------------

const PRODUCT_SELECT =
  "slug,nom,pvp_desde,pvp_abans,supplier_ref,web_product_variants(count)";

const LOG_PREFIX = "[mantes-source] fallback estàtic:";

/** Mapeja una fila web_products (amb count de variants) al tipus Manta del web. */
function rowToManta(row: ProductRow): Manta {
  const nMides = row.web_product_variants?.[0]?.count ?? 0;
  return {
    slug: row.slug,
    nom: row.nom,
    // Manta.pvp és un number obligatori: null-safe a 0 (mai hauria de passar
    // per a productes published, però blinda el render).
    pvp: toNum(row.pvp_desde) ?? 0,
    pvpAbans: toNumOrUndef(row.pvp_abans),
    nMides,
    marca: "Cortinatges Esteba",
    supplierRef: row.supplier_ref ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// LLISTA — totes les mantes publicades (equival a MANTES, però només les
// visibles a la BD). Mantes no té famílies amagades: visible == publicada.
// ---------------------------------------------------------------------------

async function fetchAllMantes(): Promise<Manta[] | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("web_products")
      .select(PRODUCT_SELECT)
      .eq("catalog_type", "manta")
      .eq("estat", "published")
      .eq("visible", true)
      .order("orden", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return null;
    return (data as ProductRow[]).map(rowToManta);
  } catch (err) {
    console.warn(`${LOG_PREFIX} getMantes()`, (err as Error)?.message ?? err);
    return null;
  }
}

/** Totes les mantes (DB-first). Fallback: MANTES estàtic. */
export async function getMantes(): Promise<Manta[]> {
  return (await fetchAllMantes()) ?? MANTES;
}

/**
 * Mantes visibles a la botiga. Mantes no té famílies amagades (a diferència de
 * catifes), així que equival a totes les publicades. DB-first; fallback: MANTES.
 */
export async function getVisibleMantes(): Promise<Manta[]> {
  return (await fetchAllMantes()) ?? MANTES;
}

/** Slugs visibles (per a generateStaticParams). DB-first; fallback estàtic. */
export async function getVisibleMantaSlugs(): Promise<string[]> {
  const all = await fetchAllMantes();
  if (!all) return MANTA_SLUGS;
  const slugs = all.map((m) => m.slug);
  return slugs.length > 0 ? slugs : MANTA_SLUGS;
}

// ---------------------------------------------------------------------------
// ÍTEM — una manta pel seu slug (equival a getManta). Fallback si nul.
// ---------------------------------------------------------------------------

/** Una manta pel slug (DB-first). Fallback: getManta() estàtic. */
export async function getMantaBySlug(slug: string): Promise<Manta | undefined> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("web_products")
      .select(PRODUCT_SELECT)
      .eq("catalog_type", "manta")
      .eq("estat", "published")
      .eq("visible", true)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return getManta(slug);
    return rowToManta(data as ProductRow);
  } catch (err) {
    console.warn(`${LOG_PREFIX} getMantaBySlug(${slug})`, (err as Error)?.message ?? err);
    return getManta(slug);
  }
}

// ---------------------------------------------------------------------------
// DETALL comercial (mesures + PVP per mesura + termini). Fallback si nul/buit.
// ---------------------------------------------------------------------------

/** Detall comercial d'una manta (DB-first). Fallback: getMantaDetall() estàtic. */
export async function getMantaDetallSource(
  slug: string,
): Promise<MantaDetall | undefined> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("web_products")
      .select(
        "termini,web_product_variants(variant_key,pvp,pvp_abans,orden)",
      )
      .eq("catalog_type", "manta")
      .eq("estat", "published")
      .eq("visible", true)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;

    const variants = (data?.web_product_variants ?? []) as VariantRow[];
    // Sense variants no hi ha detall vendible: cau a l'estàtic (mai un panell buit).
    if (!data || variants.length === 0) return getMantaDetall(slug);

    const mappedVariants: MantaVariant[] = [...variants]
      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
      .map((v) => ({
        mida: v.variant_key,
        pvp: toNum(v.pvp) ?? 0,
        pvpAbans: toNumOrUndef(v.pvp_abans),
      }));

    return {
      variants: mappedVariants,
      termini: (data as { termini: string | null }).termini ?? "",
    };
  } catch (err) {
    console.warn(`${LOG_PREFIX} getMantaDetallSource(${slug})`, (err as Error)?.message ?? err);
    return getMantaDetall(slug);
  }
}

// ---------------------------------------------------------------------------
// IMATGE — hero d'una manta (equival a mantaImage). Mantes té UNA sola foto
// (no galeria de slides com catifes). DB-first; fallback: mantaImage() estàtic.
// ---------------------------------------------------------------------------

const IMAGE_SELECT = "kind,image_path,image_source,orden";

/**
 * Ruta de la imatge (hero) d'una manta. DB-first; fallback: mantaImage(slug)
 * estàtic ("/images/decor/{slug}/1.jpg").
 */
export async function getMantaImage(slug: string): Promise<string> {
  try {
    const supabase = getSupabase();
    const { data: product, error: pErr } = await supabase
      .from("web_products")
      .select("id")
      .eq("catalog_type", "manta")
      .eq("estat", "published")
      .eq("visible", true)
      .eq("slug", slug)
      .maybeSingle();
    if (pErr) throw pErr;
    if (!product) return mantaImage(slug);

    const { data: imgData, error: iErr } = await supabase
      .from("web_product_images")
      .select(IMAGE_SELECT)
      .eq("product_id", (product as { id: string }).id)
      .eq("kind", "hero")
      .order("orden", { ascending: true });
    if (iErr) throw iErr;

    const hero = ((imgData ?? []) as ImageRow[])[0] ?? null;
    // Sense hero no reproduïm la imatge de la BD → estàtic.
    if (!hero) return mantaImage(slug);
    return hero.image_path;
  } catch (err) {
    console.warn(`${LOG_PREFIX} getMantaImage(${slug})`, (err as Error)?.message ?? err);
    return mantaImage(slug);
  }
}
