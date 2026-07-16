// Endpoint de revalidació on-demand (ISR). El cridarà l'ERP en fer "Publicar"
// perquè els canvis de la BD es reflecteixin al web sense un redeploy complet.
//
// CONTRACTE:
//   Mètode:   POST
//   Secret:   capçalera `x-revalidate-secret` O query `?secret=` == REVALIDATE_SECRET
//   Query opcionals:
//     - `path=/ruta`  → revalidatePath(path) d'una ruta concreta
//     - `tag=nom`     → revalidateTag(tag)
//   Sense path ni tag → revalida les rutes de catifes (llistat + fitxa) per a
//   tots els locales.
//   Resposta: JSON { revalidated, now, items } | 401 si el secret no quadra.
//
// Genèric a propòsit: pot revalidar qualsevol path/tag, però per defecte catifes.

import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

const CATIFES_LIST_ROUTE = "/[locale]/catifes";
const CATIFES_DETAIL_ROUTE = "/[locale]/catifes/[slug]";

export async function POST(req: NextRequest) {
  const provided =
    req.headers.get("x-revalidate-secret") ??
    req.nextUrl.searchParams.get("secret");
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected || !provided || provided !== expected) {
    return NextResponse.json(
      { revalidated: false, message: "Secret invàlid o no configurat." },
      { status: 401 },
    );
  }

  const path = req.nextUrl.searchParams.get("path");
  const tag = req.nextUrl.searchParams.get("tag");
  const items: string[] = [];

  if (tag) {
    revalidateTag(tag);
    items.push(`tag:${tag}`);
  }
  if (path) {
    revalidatePath(path);
    items.push(`path:${path}`);
  }
  if (!tag && !path) {
    // Per defecte: totes les pàgines de catifes (tots els locales i slugs).
    revalidatePath(CATIFES_LIST_ROUTE, "page");
    revalidatePath(CATIFES_DETAIL_ROUTE, "page");
    items.push(CATIFES_LIST_ROUTE, CATIFES_DETAIL_ROUTE);
  }

  return NextResponse.json({ revalidated: true, now: Date.now(), items });
}
