/**
 * RETALLA ELS LOGOS DE MARQUES I EN DESA LA MIDA REAL.
 *
 * Els logos de "Principals col·laboradors" venen del WordPress antic i cada un
 * porta el seu marge blanc dins el fitxer: la tinta ocupa des del 8% del fitxer
 * (Designers Guild) fins al 100% (Sorema). Posats tots en la mateixa caixa amb
 * object-contain, uns semblaven gegants i altres un segell de correus.
 *
 * Aquest script:
 *   1. aplana cada logo sobre blanc (el fons de la secció),
 *   2. en retalla el marge fins a la tinta,
 *   3. el desa en WebP a public/images/brands/retallats/,
 *   4. i escriu src/lib/marques-mides.ts amb l'amplada i l'alçada de la tinta,
 *      que és el que fa servir BrandsStrip per donar-los a tots la mateixa àrea.
 *
 * Ús (des de l'arrel):  node scripts/marques/retalla-logos.cjs
 * Si s'afegeix o es canvia un logo a public/images/brands, torna-ho a córrer.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ORIGEN = "public/images/brands";
const DESTI = "public/images/brands/retallats";
const MIDES = "src/lib/marques-mides.ts";

(async () => {
  fs.mkdirSync(DESTI, { recursive: true });
  const mides = {};
  for (const f of fs.readdirSync(ORIGEN).filter((x) => /\.(jpe?g|png|webp)$/i.test(x)).sort()) {
    const nom = path.parse(f).name;
    const { data, info } = await sharp(path.join(ORIGEN, f))
      .flatten({ background: "#ffffff" })
      .trim({ threshold: 18 })
      .webp({ quality: 90 })
      .toBuffer({ resolveWithObject: true });
    fs.writeFileSync(path.join(DESTI, `${nom}.webp`), data);
    mides[f] = { src: `/images/brands/retallats/${nom}.webp`, amplada: info.width, alcada: info.height };
  }
  const cos = Object.entries(mides)
    .map(([f, m]) => `  ${JSON.stringify(f)}: { src: ${JSON.stringify(m.src)}, amplada: ${m.amplada}, alcada: ${m.alcada} },`)
    .join("\n");
  fs.writeFileSync(
    MIDES,
    `// GENERAT per scripts/marques/retalla-logos.cjs. No s'edita a mà: torna a córrer l'script.\n` +
      `// Mida de la TINTA de cada logo (sense el marge blanc que portava el fitxer original).\n` +
      `export const MIDES_LOGOS: Record<string, { src: string; amplada: number; alcada: number }> = {\n${cos}\n};\n`,
  );
  console.log(`${Object.keys(mides).length} logos retallats; mides a ${MIDES}`);
})().catch((e) => { console.error(e); process.exit(1); });
