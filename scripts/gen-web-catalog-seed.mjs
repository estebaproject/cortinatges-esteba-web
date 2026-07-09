// Generador del seed SQL del cataleg web (web_products + fills).
// Importa els moduls REALS del cataleg (font de veritat) i emet un unic .sql
// idempotent-ish cap al repo ERP. NO aplica res a la BD.
//
// Run: node --experimental-strip-types scripts/gen-web-catalog-seed.mjs

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// --- Imports del cataleg (font de veritat) ---
import {
  CATIFES,
  HIDDEN_CATIFA_FAMILIES,
  CATIFA_HAS_PRODUCTO,
  CATIFA_HAS_DETALL,
  catifaImgFit,
  getCatifa,
} from "../src/lib/catifes.ts";
import { getCatifaDetall } from "../src/lib/catifes-detall.ts";
import { MANTES } from "../src/lib/mantes.ts";
import { getMantaDetall } from "../src/lib/mantes-detall.ts";
import { MOBLES, mobleImgFit } from "../src/lib/mobiliari.ts";
import { getMobleDetall } from "../src/lib/mobiliari-detall.ts";
import { getMobleSpec } from "../src/lib/mobiliari-specs.ts";
import { getMobleColors } from "../src/lib/mobiliari-colors.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(
  __dirname,
  "../../cortinatges-esteba/supabase/migrations/20260702110000_383_web_catalog_seed.sql",
);

// --- Helpers d'escapat SQL ---
function s(v) {
  if (v === null || v === undefined) return "NULL";
  return "'" + String(v).replace(/'/g, "''") + "'";
}
function n(v) {
  if (v === null || v === undefined) return "NULL";
  return String(v);
}
function b(v) {
  return v ? "true" : "false";
}
function jsonb(obj) {
  if (obj === null || obj === undefined) return "NULL";
  return "'" + JSON.stringify(obj).replace(/'/g, "''") + "'::jsonb";
}
function textArr(arr) {
  if (!arr || arr.length === 0) return "NULL";
  const inner = arr.map((x) => "'" + String(x).replace(/'/g, "''") + "'").join(",");
  return "ARRAY[" + inner + "]::text[]";
}
// Clau de carro estable d'una variant de moble (match EXACTE amb
// MoblePurchasePanel.tsx: variantKey(v, index)).
function mobleVariantKey(variant, index) {
  return variant.dim ? `${index}-${variant.dim}` : `${index}`;
}

// --- Acumuladors ---
const productRows = [];
const variantRows = [];
const colorRows = [];
const imageRows = [];

const missing = { catifaDetall: [], mantaDetall: [], mobleDetall: [], mobleSpec: [], mobleColors: [] };
const counts = {
  catifes: 0,
  mantes: 0,
  mobles: 0,
  variants: 0,
  colors: 0,
  images: 0,
};

// Subselect FK per (catalog_type, slug)
function pid(type, slug) {
  return `(select id from web_products where catalog_type=${s(type)} and slug=${s(slug)})`;
}

// ============================ CATIFES ============================
CATIFES.forEach((c, i) => {
  const detall = getCatifaDetall(c.slug);
  if (!detall) missing.catifaDetall.push(c.slug);
  const imgFit = catifaImgFit(c.slug);
  const visible = !HIDDEN_CATIFA_FAMILIES.has(c.familia);
  const perEncarrec = detall ? detall.perEncarrec : false;
  const termini = detall ? detall.termini : null;

  productRows.push({
    catalog_type: "catifa",
    slug: c.slug,
    nom: c.nom,
    familia: c.familia,
    marca: c.marca,
    supplier_ref: c.supplierRef ?? null,
    pvp_desde: c.pvpDesde,
    pvp_abans: c.pvpAbans ?? null,
    per_encarrec: perEncarrec,
    termini,
    material: null,
    dimensions: null,
    finishes: null,
    img_fit: imgFit,
    visible,
    estat: "published",
    orden: i,
  });
  counts.catifes++;

  // Variants
  if (detall) {
    detall.mides.forEach((m, idx) => {
      variantRows.push({
        type: "catifa",
        slug: c.slug,
        variant_key: m.mida,
        label: m.mida,
        ancho_cm: m.anchoCm,
        alto_cm: m.altoCm,
        dim: null,
        pvp: m.pvp,
        pvp_abans: m.pvpAbans ?? null,
        orden: idx,
      });
      counts.variants++;
    });
  }

  // Images
  imageRows.push({
    type: "catifa",
    slug: c.slug,
    kind: "hero",
    image_path: `/images/catifes/${c.slug}/1.jpg`,
    object_fit: imgFit,
    orden: 0,
  });
  counts.images++;
  if (CATIFA_HAS_PRODUCTO.has(c.slug)) {
    imageRows.push({
      type: "catifa",
      slug: c.slug,
      kind: "producto",
      image_path: `/images/catifes/${c.slug}/2.jpg`,
      object_fit: null,
      orden: 1,
    });
    counts.images++;
  }
  if (CATIFA_HAS_DETALL.has(c.slug)) {
    imageRows.push({
      type: "catifa",
      slug: c.slug,
      kind: "detall",
      image_path: `/images/catifes/${c.slug}/3.jpg`,
      object_fit: null,
      orden: 2,
    });
    counts.images++;
  }
});

// ============================ MANTES ============================
MANTES.forEach((m, i) => {
  const detall = getMantaDetall(m.slug);
  if (!detall) missing.mantaDetall.push(m.slug);
  const perEncarrec = false; // mantes-detall no exposa perEncarrec
  const termini = detall ? detall.termini : null;

  productRows.push({
    catalog_type: "manta",
    slug: m.slug,
    nom: m.nom,
    familia: null,
    marca: m.marca,
    supplier_ref: m.supplierRef ?? null,
    pvp_desde: m.pvp,
    pvp_abans: m.pvpAbans ?? null,
    per_encarrec: perEncarrec,
    termini,
    material: null,
    dimensions: null,
    finishes: null,
    img_fit: "contain",
    visible: true,
    estat: "published",
    orden: i,
  });
  counts.mantes++;

  if (detall) {
    detall.variants.forEach((v, idx) => {
      variantRows.push({
        type: "manta",
        slug: m.slug,
        variant_key: v.mida,
        label: v.mida,
        ancho_cm: null,
        alto_cm: null,
        dim: null,
        pvp: v.pvp,
        pvp_abans: v.pvpAbans ?? null,
        orden: idx,
      });
      counts.variants++;
    });
  }

  imageRows.push({
    type: "manta",
    slug: m.slug,
    kind: "hero",
    image_path: `/images/decor/${m.slug}/1.jpg`,
    object_fit: "contain",
    orden: 0,
  });
  counts.images++;
});

// ============================ MOBLES ============================
MOBLES.forEach((mo, i) => {
  const detall = getMobleDetall(mo.slug);
  if (!detall) missing.mobleDetall.push(mo.slug);
  const spec = getMobleSpec(mo.slug);
  if (!spec) missing.mobleSpec.push(mo.slug);
  const colors = getMobleColors(mo.slug);
  if (colors.length === 0) missing.mobleColors.push(mo.slug);
  const imgFit = mobleImgFit(mo.slug);
  const termini = detall ? detall.termini : null;

  productRows.push({
    catalog_type: "moble",
    slug: mo.slug,
    nom: mo.nom,
    familia: mo.cat,
    marca: mo.marca,
    supplier_ref: mo.supplierRef ?? null,
    pvp_desde: mo.pvp,
    pvp_abans: mo.pvpAbans ?? null,
    per_encarrec: false,
    termini,
    material: spec ? spec.material : null,
    dimensions: spec ? spec.dimensions : null,
    finishes: spec ? spec.finishes : null,
    img_fit: imgFit,
    visible: true,
    estat: "published",
    orden: i,
  });
  counts.mobles++;

  if (detall) {
    detall.variants.forEach((v, idx) => {
      variantRows.push({
        type: "moble",
        slug: mo.slug,
        variant_key: mobleVariantKey(v, idx),
        label: v.nom,
        ancho_cm: null,
        alto_cm: null,
        dim: v.dim,
        pvp: v.pvp,
        pvp_abans: v.pvpAbans ?? null,
        orden: idx,
      });
      counts.variants++;
    });
  }

  colors.forEach((col, idx) => {
    colorRows.push({
      type: "moble",
      slug: mo.slug,
      name: col.name,
      image_source: "public",
      image_path: col.image,
      orden: idx,
    });
    counts.colors++;
  });

  imageRows.push({
    type: "moble",
    slug: mo.slug,
    kind: "hero",
    image_path: `/images/mobiliari/${mo.slug}/1.jpg`,
    object_fit: imgFit,
    orden: 0,
  });
  counts.images++;
});

// ============================ SQL ============================
const out = [];
out.push("-- Seed del cataleg web public (web_products + fills).");
out.push("-- GENERAT automaticament des del cataleg TS del web (src/lib/*).");
out.push("-- Font: scripts/gen-web-catalog-seed.mjs al repo web. NO editar a ma.");
out.push("");
out.push("begin;");
out.push("");
out.push("-- Reset idempotent (taules noves/buides; fa segurs els re-runs).");
out.push("delete from web_product_images;");
out.push("delete from web_product_colors;");
out.push("delete from web_product_variants;");
out.push("delete from web_products;");
out.push("");

out.push("-- ============================ PRODUCTES ============================");
out.push(
  "insert into web_products (catalog_type, slug, nom, familia, marca, supplier_ref, pvp_desde, pvp_abans, per_encarrec, termini, material, dimensions, finishes, img_fit, visible, estat, orden) values",
);
const pvals = productRows.map((p) => {
  return `  (${s(p.catalog_type)}, ${s(p.slug)}, ${s(p.nom)}, ${s(p.familia)}, ${s(p.marca)}, ${s(p.supplier_ref)}, ${n(p.pvp_desde)}, ${n(p.pvp_abans)}, ${b(p.per_encarrec)}, ${s(p.termini)}, ${jsonb(p.material)}, ${s(p.dimensions)}, ${textArr(p.finishes)}, ${s(p.img_fit)}, ${b(p.visible)}, ${s(p.estat)}, ${n(p.orden)})`;
});
out.push(pvals.join(",\n") + ";");
out.push("");

out.push("-- ============================ VARIANTS ============================");
out.push(
  "insert into web_product_variants (product_id, variant_key, label, ancho_cm, alto_cm, dim, pvp, pvp_abans, orden) values",
);
const vvals = variantRows.map((v) => {
  return `  (${pid(v.type, v.slug)}, ${s(v.variant_key)}, ${s(v.label)}, ${n(v.ancho_cm)}, ${n(v.alto_cm)}, ${s(v.dim)}, ${n(v.pvp)}, ${n(v.pvp_abans)}, ${n(v.orden)})`;
});
out.push(vvals.join(",\n") + ";");
out.push("");

out.push("-- ============================ COLORS ============================");
out.push(
  "insert into web_product_colors (product_id, name, image_source, image_path, orden) values",
);
const cvals = colorRows.map((c) => {
  return `  (${pid(c.type, c.slug)}, ${s(c.name)}, ${s(c.image_source)}, ${s(c.image_path)}, ${n(c.orden)})`;
});
out.push(cvals.join(",\n") + ";");
out.push("");

out.push("-- ============================ IMATGES ============================");
out.push(
  "insert into web_product_images (product_id, kind, image_source, image_path, object_fit, orden) values",
);
const ivals = imageRows.map((im) => {
  return `  (${pid(im.type, im.slug)}, ${s(im.kind)}, 'public', ${s(im.image_path)}, ${s(im.object_fit)}, ${n(im.orden)})`;
});
out.push(ivals.join(",\n") + ";");
out.push("");

out.push("commit;");
out.push("");

writeFileSync(OUT, out.join("\n"), "utf8");

// --- Resum ---
console.log("Seed escrit a:", OUT);
console.log("Productes:", {
  catifes: counts.catifes,
  mantes: counts.mantes,
  mobles: counts.mobles,
  total: counts.catifes + counts.mantes + counts.mobles,
});
console.log("Variants:", counts.variants);
console.log("Colors:", counts.colors);
console.log("Imatges:", counts.images);
console.log("");
console.log("Cobertura (sense dades):");
console.log("  catifes sense detall:", missing.catifaDetall.length ? missing.catifaDetall : "cap");
console.log("  mantes sense detall:", missing.mantaDetall.length ? missing.mantaDetall : "cap");
console.log("  mobles sense detall:", missing.mobleDetall.length ? missing.mobleDetall : "cap");
console.log("  mobles sense spec:", missing.mobleSpec.length ? missing.mobleSpec : "cap");
console.log("  mobles sense colors:", missing.mobleColors.length ? missing.mobleColors : "cap");
