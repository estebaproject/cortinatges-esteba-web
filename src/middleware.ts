import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Middleware de next-intl + capçalera anti-indexació per als entorns que no
 * són producció.
 *
 * PER QUÈ AQUÍ I NO A `headers()` de next.config.ts:
 * `headers()` s'avalua en temps de BUILD i el resultat queda cuit al manifest
 * de rutes. Amb aquell plantejament, un "Promote to Production" o un rollback
 * a un deploy de preview publicaria a producció un build amb `noindex` a TOTES
 * les pàgines — i la web sencera desapareixeria de Google sense que cap fitxer
 * hagi canviat. Aquí, en canvi, `VERCEL_ENV` es llegeix a CADA petició, així
 * que la capçalera sempre correspon a l'entorn on s'està servint de veritat.
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * PROTOTIP v2 (/v2/...) — no passa per next-intl.
   *
   * El middleware de next-intl reescriu tota ruta que no comenci per un idioma
   * conegut. Amb /v2/ca veuria "v2" al primer segment, conclouria que hi falta
   * l'idioma i acabaria servint /ca/v2/ca, que no existeix. El prototip resol
   * l'idioma pel segment [locale] de la seva pròpia ruta (src/app/v2/[locale]),
   * així que aquí només cal deixar-lo passar.
   *
   * Es fa amb una comprovació de ruta i NO traient /v2 del matcher perquè així
   * la capçalera de noindex de sota el segueix cobrint.
   */
  if (pathname === "/v2" || pathname === "/v2/") {
    return NextResponse.redirect(new URL("/v2/ca", request.url));
  }

  const response = pathname.startsWith("/v2/")
    ? NextResponse.next()
    : intlMiddleware(request);

  if (process.env.VERCEL_ENV !== "production") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // El prototip no s'ha d'indexar MAI, ni tan sols si algun dia es desplega a
  // producció per ensenyar-lo al client.
  if (pathname.startsWith("/v2")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/(ca|es|en|fr)/:path*",
    "/((?!_next|_vercel|api|.*\\..*).*)",
  ],
};
