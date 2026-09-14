/**
 * EXTREU LES DADES DEL MAPA DE BOTIGUES (src/components/StoresMapInteractiu.tsx).
 *
 * Llegeix l'arxiu del món de Protomaps (OpenStreetMap, 138 GB) per peticions
 * de rang i en copia NOMÉS dues zones, tal com vénen, a un PMTiles propi:
 *
 *   - zona àmplia (Tarragona–frontera francesa) del zoom 0 al 9,
 *   - comarques gironines amb detall als zooms 10 i 11.
 *
 * Ús (des de l'arrel del projecte):
 *
 *   1. Mira l'últim build a https://build-metadata.protomaps.dev/builds.json
 *   2. Canvia BUILD aquí sota.
 *   3. node scripts/mapa/extreu-mapa-botigues.cjs public/mapa/mapa-botigues-AAAAMMDD.pmtiles
 *   4. Canvia DADES a StoresMapInteractiu.tsx pel nom nou i esborra el vell.
 *
 * Si canvien les zones, canvia-les TAMBÉ a ZONA_AMPLIA i ZONA_GIRONA del
 * component: si el mapa deixa anar on no hi ha tessel·les, es veu en blanc.
 */
const fs = require("fs");
const zlib = require("zlib");
const { PMTiles, FetchSource, findTile, zxyToTileId } = require("pmtiles");
const BUILD = "20260914";
const src = new FetchSource(`https://build.protomaps.com/${BUILD}.pmtiles`);
const p = new PMTiles(src);
// Zona AMPLIA fins al zoom 9 (per allunyar-se: de Tarragona a la frontera) i
// comarques GIRONINES amb detall al 10 i l'11.
const TRAMS = [
  { bbox: [0.4, 40.9, 3.45, 42.95], z0: 0, z1: 9 },
  { bbox: [1.9, 41.35, 3.4, 42.55], z0: 10, z1: 11 },
];
const BBOX = [0.4, 40.9, 3.45, 42.95];
const ZMAX = 11;
const SORTIDA = process.argv[2];
const lon2x = (lon, z) => Math.floor(((lon + 180) / 360) * 2 ** z);
const lat2y = (lat, z) => { const r = (lat * Math.PI) / 180; return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z); };
async function entrada(h, id) {
  let off = h.rootDirectoryOffset, len = h.rootDirectoryLength;
  for (let d = 0; d <= 3; d++) {
    const dir = await p.cache.getDirectory(src, off, len, h);
    const e = findTile(dir, id);
    if (!e) return null;
    if (e.runLength > 0) return e;
    off = h.leafDirectoryOffset + e.offset; len = e.length;
  }
  return null;
}
function varint(n, out) { while (n >= 128) { out.push((n % 128) | 128); n = Math.floor(n / 128); } out.push(n); }
function directori(es) {
  const o = []; varint(es.length, o);
  let prev = 0; for (const e of es) { varint(e.tileId - prev, o); prev = e.tileId; }
  for (const e of es) varint(1, o);
  for (const e of es) varint(e.length, o);
  es.forEach((e, i) => { const a = es[i - 1]; varint(i > 0 && e.offset === a.offset + a.length ? 0 : e.offset + 1, o); });
  return zlib.gzipSync(Buffer.from(o));
}
(async () => {
  const h = await p.getHeader();
  const vist = new Set(), feina = [];
  for (const t of TRAMS)
    for (let z = t.z0; z <= t.z1; z++)
      for (let x = lon2x(t.bbox[0], z); x <= lon2x(t.bbox[2], z); x++)
        for (let y = lat2y(t.bbox[3], z); y <= lat2y(t.bbox[1], z); y++) {
          const id = zxyToTileId(z, x, y); if (vist.has(id)) continue; vist.add(id); feina.push(id);
        }
  const tiles = [];
  for (let i = 0; i < feina.length; i += 12) {
    await Promise.all(feina.slice(i, i + 12).map(async (id) => {
      const e = await entrada(h, id); if (!e) return;
      const r = await src.getBytes(h.tileDataOffset + e.offset, e.length);
      tiles.push({ tileId: id, data: Buffer.from(r.data) });
    }));
  }
  tiles.sort((a, b) => a.tileId - b.tileId);
  let off = 0;
  const es = tiles.map((t) => { const e = { tileId: t.tileId, offset: off, length: t.data.length }; off += t.data.length; return e; });
  const dir = directori(es);
  const meta = await p.getMetadata();
  meta.attribution = '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap</a>';
  meta.description = `Extracte de Protomaps ${BUILD}: zona amplia fins al zoom 9 i comarques gironines amb detall fins al 11.`;
  const metaBuf = zlib.gzipSync(Buffer.from(JSON.stringify(meta)));
  const dades = Buffer.concat(tiles.map((t) => t.data));
  const H = Buffer.alloc(127);
  H.write("PMTiles", 0, "ascii"); H.writeUInt8(3, 7);
  const u64 = (v, at) => H.writeBigUInt64LE(BigInt(v), at);
  const rootOff = 127, metaOff = rootOff + dir.length, dataOff = metaOff + metaBuf.length;
  u64(rootOff, 8); u64(dir.length, 16); u64(metaOff, 24); u64(metaBuf.length, 32);
  u64(dataOff, 40); u64(0, 48); u64(dataOff, 56); u64(dades.length, 64);
  u64(tiles.length, 72); u64(tiles.length, 80); u64(tiles.length, 88);
  H.writeUInt8(1, 96); H.writeUInt8(2, 97); H.writeUInt8(2, 98); H.writeUInt8(1, 99);
  H.writeUInt8(0, 100); H.writeUInt8(ZMAX, 101);
  const e7 = (v, at) => H.writeInt32LE(Math.round(v * 1e7), at);
  e7(BBOX[0], 102); e7(BBOX[1], 106); e7(BBOX[2], 110); e7(BBOX[3], 114);
  H.writeUInt8(9, 118); e7(2.95, 119); e7(41.82, 123);
  fs.writeFileSync(SORTIDA, Buffer.concat([H, dir, metaBuf, dades]));
  console.log(`escrit ${SORTIDA}: ${tiles.length} tessel·les, ${(fs.statSync(SORTIDA).size / 1e6).toFixed(2)} MB`);
})().catch((e) => { console.error("ERROR", e.stack); process.exit(1); });
