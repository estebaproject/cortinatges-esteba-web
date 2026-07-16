// Capa de FONT de dades de catifes (DB-first amb fallback estàtic BLINDAT).
//
// SERVER-ONLY: només s'importa des de Server Components (les pàgines de
// /catifes). Llegeix Supabase (rol anon, RLS: només productes published+visible)
// i, davant de QUALSEVOL error o resultat buit, cau als arrays hardcodats de
// src/lib/catifes.ts i src/lib/catifes-detall.ts (la FONT DE VERITAT de reserva).
// Així, en local amb .env.local buit (getSupabase() llança), el render és idèntic
// a l'actual.
//
// REGLA DE FALLBACK:
//   - Funcions de LLISTA (array): fallback si error O array buit.
//   - Funcions d'ÍTEM (un sol registre): fallback si error O resultat nul. Això
//     reprodueix EXACTAMENT el comportament actual (p. ex. un slug no publicat
//     torna a l'estàtic, i la pàgina segueix fent notFound() com avui).
//
// NO es modifica cap dada hardcodada: aquesta capa només AFEGEIX lectura dinàmica.

import { getSupabase } from "@/lib/supabase";
import {
  CATIFES,
  VISIBLE_CATIFES,
  VISIBLE_CATIFA_SLUGS,
  HIDDEN_CATIFA_FAMILIES,
  getCatifa,
  catifaEscena,
  catifaProducto,
  catifaSlides,
  type Catifa,
  type CatifaFamilia,
  type GallerySlide,
} from "@/lib/catifes";
import {
  getCatifaDetall,
  type CatifaDetall,
  type CatifaMida,
} from "@/lib/catifes-detall";

// --- Tipus de fila (mapatge cru de les taules web_*) -----------------------

type VariantCountEmbed = { count: number }[];

type ProductRow = {
  slug: string;
  nom: string;
  familia: string;
  pvp_desde: number | string | null;
  pvp_abans: number | string | null;
  supplier_ref: string | null;
  web_product_variants: VariantCountEmbed | null;
};

type VariantRow = {
  variant_key: string;
  label: string | null;
  ancho_cm: number | string | null;
  alto_cm: number | string | null;
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
  "slug,nom,familia,pvp_desde,pvp_abans,supplier_ref,web_product_variants(count)";

const LOG_PREFIX = "[catifes-source] fallback estàtic:";

/** Mapeja una fila web_products (amb count de variants) al tipus Catifa del web. */
function rowToCatifa(row: ProductRow): Catifa {
  const nMedides = row.web_product_variants?.[0]?.count ?? 0;
  return {
    slug: row.slug,
    nom: row.nom,
    familia: row.familia as CatifaFamilia,
    pvpDesde: toNum(row.pvp_desde),
    pvpAbans: toNumOrUndef(row.pvp_abans),
    nMedides,
    marca: "Cortinatges Esteba",
    supplierRef: row.supplier_ref ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// LLISTA — totes les catifes publicades (equival a CATIFES, però només les
// visibles a la BD; les famílies amagades al web es filtren a getVisibleCatifes).
// ---------------------------------------------------------------------------

async function fetchAllCatifes(): Promise<Catifa[] | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("web_products")
      .select(PRODUCT_SELECT)
      .eq("catalog_type", "catifa")
      .eq("estat", "published")
      .eq("visible", true)
      .order("orden", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return null;
    return (data as ProductRow[]).map(rowToCatifa);
  } catch (err) {
    console.warn(`${LOG_PREFIX} getCatifes()`, (err as Error)?.message ?? err);
    return null;
  }
}

/** Totes les catifes (DB-first). Fallback: CATIFES estàtic. */
export async function getCatifes(): Promise<Catifa[]> {
  return (await fetchAllCatifes()) ?? CATIFES;
}

/**
 * Catifes visibles a la botiga (exclou famílies amagades al web, p. ex.
 * kids_collection). DB-first; fallback: VISIBLE_CATIFES estàtic.
 */
export async function getVisibleCatifes(): Promise<Catifa[]> {
  const all = await fetchAllCatifes();
  if (!all) return VISIBLE_CATIFES;
  const visible = all.filter((c) => !HIDDEN_CATIFA_FAMILIES.has(c.familia));
  // Si el filtre buida la llista (cas anòmal), millor l'estàtic que una graella buida.
  return visible.length > 0 ? visible : VISIBLE_CATIFES;
}

/** Slugs visibles (per a generateStaticParams). DB-first; fallback estàtic. */
export async function getVisibleCatifaSlugs(): Promise<string[]> {
  const all = await fetchAllCatifes();
  if (!all) return VISIBLE_CATIFA_SLUGS;
  const slugs = all
    .filter((c) => !HIDDEN_CATIFA_FAMILIES.has(c.familia))
    .map((c) => c.slug);
  return slugs.length > 0 ? slugs : VISIBLE_CATIFA_SLUGS;
}

// ---------------------------------------------------------------------------
// ÍTEM — una catifa pel seu slug (equival a getCatifa). Fallback si nul.
// ---------------------------------------------------------------------------

/** Una catifa pel slug (DB-first). Fallback: getCatifa() estàtic (inclou amagades). */
export async function getCatifaBySlug(slug: string): Promise<Catifa | undefined> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("web_products")
      .select(PRODUCT_SELECT)
      .eq("catalog_type", "catifa")
      .eq("estat", "published")
      .eq("visible", true)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return getCatifa(slug);
    return rowToCatifa(data as ProductRow);
  } catch (err) {
    console.warn(`${LOG_PREFIX} getCatifaBySlug(${slug})`, (err as Error)?.message ?? err);
    return getCatifa(slug);
  }
}

// ---------------------------------------------------------------------------
// DETALL comercial (mesures + PVP per mesura + termini). Fallback si nul/buit.
// ---------------------------------------------------------------------------

/** Detall comercial d'una catifa (DB-first). Fallback: getCatifaDetall() estàtic. */
export async function getCatifaDetallSource(
  slug: string,
): Promise<CatifaDetall | undefined> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("web_products")
      .select(
        "per_encarrec,termini,web_product_variants(variant_key,label,ancho_cm,alto_cm,pvp,pvp_abans,orden)",
      )
      .eq("catalog_type", "catifa")
      .eq("estat", "published")
      .eq("visible", true)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;

    const variants = (data?.web_product_variants ?? []) as VariantRow[];
    // Sense variants no hi ha detall vendible: cau a l'estàtic (mai un panell buit).
    if (!data || variants.length === 0) return getCatifaDetall(slug);

    const mides: CatifaMida[] = [...variants]
      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
      .map((v) => ({
        mida: v.variant_key,
        anchoCm: toNum(v.ancho_cm),
        altoCm: toNum(v.alto_cm),
        pvp: toNum(v.pvp) ?? 0,
        pvpAbans: toNumOrUndef(v.pvp_abans),
      }));

    return {
      mides,
      perEncarrec: (data as { per_encarrec: boolean | null }).per_encarrec ?? false,
      termini: (data as { termini: string | null }).termini ?? "",
    };
  } catch (err) {
    console.warn(`${LOG_PREFIX} getCatifaDetallSource(${slug})`, (err as Error)?.message ?? err);
    return getCatifaDetall(slug);
  }
}

// ---------------------------------------------------------------------------
// IMATGES / GALERIA — reconstrueix EXACTAMENT la sortida de catifaSlides():
//   escena (hero, fit cover) → producto (fit contain) → detall (fit contain).
// IMPORTANT: els `fit` es fixen aquí per igualar catifaSlides(), que sempre posa
// l'escena a "cover" fins i tot per a slugs amb img_fit='contain' (p. ex. dallas).
// Per això NO fem servir object_fit de la BD per als slides.
// ---------------------------------------------------------------------------

const IMAGE_SELECT = "kind,image_path,image_source,orden";

/**
 * Slides de galeria + imatge de producte (producto ?? escena) d'una catifa.
 * DB-first; fallback: catifaSlides() + (catifaProducto ?? catifaEscena) estàtics.
 */
export async function getCatifaImages(
  slug: string,
  nom: string,
): Promise<{ slides: GallerySlide[]; productImage: string }> {
  const fallback = () => ({
    slides: catifaSlides(slug, nom),
    productImage: catifaProducto(slug) ?? catifaEscena(slug),
  });

  try {
    const supabase = getSupabase();
    const { data: product, error: pErr } = await supabase
      .from("web_products")
      .select("id")
      .eq("catalog_type", "catifa")
      .eq("estat", "published")
      .eq("visible", true)
      .eq("slug", slug)
      .maybeSingle();
    if (pErr) throw pErr;
    if (!product) return fallback();

    const { data: imgData, error: iErr } = await supabase
      .from("web_product_images")
      .select(IMAGE_SELECT)
      .eq("product_id", (product as { id: string }).id)
      .order("orden", { ascending: true });
    if (iErr) throw iErr;

    const images = (imgData ?? []) as ImageRow[];
    const byKind = (k: string) => images.find((i) => i.kind === k) ?? null;

    const hero = byKind("hero");
    // L'escena és obligatòria; sense hero no reproduïm la galeria → estàtic.
    if (!hero) return fallback();

    const producto = byKind("producto");
    const detall = byKind("detall");

    const slides: GallerySlide[] = [
      { src: hero.image_path, alt: nom, kind: "escena", fit: "cover" },
    ];
    if (producto) {
      slides.push({ src: producto.image_path, alt: nom, kind: "producto", fit: "contain" });
    }
    if (detall) {
      slides.push({ src: detall.image_path, alt: nom, kind: "detall", fit: "contain" });
    }

    // productImage = producto ?? escena (igual que la pàgina i el JSON-LD).
    const productImage = producto?.image_path ?? hero.image_path;

    return { slides, productImage };
  } catch (err) {
    console.warn(`${LOG_PREFIX} getCatifaImages(${slug})`, (err as Error)?.message ?? err);
    return fallback();
  }
}
