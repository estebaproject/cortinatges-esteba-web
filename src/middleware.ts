import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
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
  const response = intlMiddleware(request);

  if (process.env.VERCEL_ENV !== "production") {
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
