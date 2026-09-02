import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

// Redireccions de la migració del WordPress. Només les URLs que CANVIEN de
// veritat: les 38 restants del sitemap antic es conserven idèntiques gràcies
// als `pathnames` de src/routing.ts.
//
// - Les 14 catalanes perden el prefix /ca (el català va sense prefix).
// - 4 més netegen el typo (`pressupuesto`) i les cicatrius de WPML (-es, -fr).
// - 12 pàgines legals que no surten al sitemap del WordPress però estan vives.
//
// `permanent` és true per defecte (308). Només s'hi posa `false` (307) quan la
// redirecció és un pedaç que s'ha de repuntar: vegeu el bloc de la veneciana.
// ─────────────────────────────────────────────────────────────────────────────
//  CONSOLIDACIÓ DE decoresteba.com
// ─────────────────────────────────────────────────────────────────────────────
//
//  ⚠️ AVUI AQUESTES REGLES NO FAN RES, i és normal. decoresteba.com apunta a
//  134.0.10.155 (Apache, WordPress propi) i aquest projecte viu a Vercel. Un
//  `redirects()` de Next només pot respondre per un domini que ARRIBI a Next.
//
//  PERQUÈ S'ACTIVIN CALEN DUES COSES, per aquest ordre:
//    1. Afegir decoresteba.com i www.decoresteba.com al projecte de Vercel.
//    2. Moure els seus DNS cap a Vercel (mateix procediment que hi ha
//       documentat a docs/migracio-dns-cdmon.md per a cortinatgesesteba).
//  Fins llavors el WordPress segueix servint, que és el que volem: val més
//  contingut viu que un 404.
//
//  PER QUÈ AMB `has: host` I NO A SEQUES: sense el filtre de domini, aquestes
//  rutes també respondrien a cortinatgesesteba.com. Algunes hi xoquen de
//  debò —/pergolas i /toldos són slugs castellans nostres, que viuen sota
//  /es/— i la resta hi crearien URLs fantasma que no volem servir.
//
//  ELS DESTINS VAN TOTS A /es/ A POSTA. decoresteba és íntegrament en castellà
//  (`<html lang="es">`, slugs castellans). Qui hi arriba des de Google ve
//  buscant en castellà; enviar-lo a l'arrel catalana el fa fer marxa enrere.
//
//  NO HI SÓN LES QUATRE QUE FALTEN, i tampoc és un oblit: /toldos/, /pergolas/
//  i /tapicerias/ tenen el destí a DRAFT_PRODUCTS i FAN 404 ARA MATEIX, i
//  /moquetas/ no té ni ruta. Redirigir-les a la portada com a solució temporal
//  seria pitjor que no fer res: caldria refer el 301 en publicar-les i
//  quedaria una cadena de redireccions. Es queden servint el WordPress fins
//  que les fitxes es publiquin; llavors s'afegeixen aquí.
const DECORESTEBA_HOSTS = ["decoresteba.com", "www.decoresteba.com"];

const DECORESTEBA_REDIRECTS: { source: string; destination: string }[] = [
  // Portada a portada. L'única on enviar a l'arrel és la resposta correcta.
  { source: "/", destination: "https://cortinatgesesteba.com/es" },

  // Equivalents directes que ja funcionen en producció.
  { source: "/contactenos", destination: "https://cortinatgesesteba.com/es/contacto" },
  { source: "/sobre-nosotros", destination: "https://cortinatgesesteba.com/es/nosotros" },
  { source: "/politica-cookies", destination: "https://cortinatgesesteba.com/es/cookies" },
  // L'origen fusiona avís legal i privacitat en una sola pàgina ("Aviso legal
  // y política de privacidad"); nosaltres les tenim separades. Mana el slug
  // d'origen, que és el que hi ha indexat.
  { source: "/politica-privacidad", destination: "https://cortinatgesesteba.com/es/privacidad" },

  // Coincidència 1:1 exacta: mateix producte, mateixos models, destí viu.
  { source: "/mosquiteras", destination: "https://cortinatgesesteba.com/es/mosquitera" },

  // Una URL d'origen genèrica contra diverses fitxes nostres. No hi ha
  // equivalent 1:1 i triar-ne una seria arbitrari: van a la graella de
  // productes, que és on l'usuari pot triar. `/es/colecciones` NO existeix
  // (fa 404); la graella viu a l'àncora de la portada.
  { source: "/cortinas-estores", destination: "https://cortinatgesesteba.com/es#productes" },
  { source: "/persianas", destination: "https://cortinatgesesteba.com/es#productes" },

  // Sense equivalent exacte, però amb el parent temàtic més proper.
  // Carpes comparteix el catàleg de teixits amb tendals (lona acrílica,
  // screen, PVC/Soltis, Solscape).
  { source: "/carpas", destination: "https://cortinatgesesteba.com/es/toldos" },
  // Moqueta és revestiment continu i catifa és peça, o sigui que no és el
  // mateix producte; comparteixen intenció (tèxtil de terra) i és el més
  // honest que tenim mentre no hi hagi fitxa pròpia.
  { source: "/moquetas", destination: "https://cortinatgesesteba.com/es/catifes" },

  // L'ÚNICA que va a la portada, i és deliberat: no venem paviment de fusta
  // ni res que s'hi acosti. Un 301 cap a una pàgina que no respon a la
  // pregunta enganya l'usuari i Google acaba tractant-lo com un soft-404.
  { source: "/parques", destination: "https://cortinatgesesteba.com/es" },
];

const WP_REDIRECTS: {
  source: string;
  destination: string;
  permanent?: boolean;
}[] = [
  { source: "/ca", destination: "/" },
  { source: "/ca/serveis", destination: "/serveis" },
  { source: "/ca/contacte", destination: "/contacte" },
  { source: "/ca/demana-pressupost", destination: "/demana-pressupost" },
  { source: "/ca/vols-treballar-amb-nosaltres", destination: "/vols-treballar-amb-nosaltres" },
  { source: "/ca/cortina-tradicional-ca", destination: "/cortina-tradicional" },
  { source: "/ca/estor-paquet", destination: "/estor-paquet" },
  { source: "/ca/estor-enrotllable", destination: "/estor-enrotllable" },
  { source: "/ca/panell-japones", destination: "/panell-japones" },
  { source: "/ca/cortina-prisada", destination: "/cortina-prisada" },
  { source: "/ca/cortina-vertical-ca", destination: "/cortina-vertical" },
  { source: "/ca/cortina-nit-i-dia", destination: "/cortina-nit-i-dia" },
  { source: "/ca/cortina-motoritzacio-i-domotica", destination: "/cortina-motoritzacio-i-domotica" },
  { source: "/ca/mosquitera-ca", destination: "/mosquitera" },
  { source: "/es/pide-pressupuesto", destination: "/es/pide-presupuesto" },
  { source: "/es/cortina-vertical-es", destination: "/es/cortina-vertical" },
  { source: "/es/mosquitera-es", destination: "/es/mosquitera" },
  { source: "/fr/contact-fr", destination: "/fr/contact" },

  // --- Pàgines legals -------------------------------------------------------
  // ATENCIÓ: aquestes 12 URLs NO surten a /page-sitemap.xml del WordPress (Yoast
  // en treu les legals), però estan VIVES i responen 200. Es van descobrir
  // rastrejant els enllaços del peu, no el sitemap. Sense aquestes regles,
  // la política de privacitat enllaçada des de fora deixaria de resoldre.
  { source: "/ca/avis-legal", destination: "/avis-legal" },
  { source: "/en/legal-warning", destination: "/en/legal-notice" },
  { source: "/fr/avis-juridique", destination: "/fr/mentions-legales" },
  // (/es/aviso-legal ja coincideix amb el slug nou: no cal redirecció.)
  { source: "/ca/politica-de-proteccio-de-dades", destination: "/privacitat" },
  { source: "/es/politica-de-proteccion-de-datos", destination: "/es/privacidad" },
  { source: "/en/data-protection-policy", destination: "/en/privacy" },
  { source: "/fr/politique-de-protection-des-donnees", destination: "/fr/confidentialite" },
  { source: "/ca/politica-de-cookies", destination: "/cookies" },
  { source: "/es/politica-de-cookies-es", destination: "/es/cookies" },
  { source: "/en/cookies-policy", destination: "/en/cookies" },
  { source: "/fr/politique-d-utilisation-des-cookies", destination: "/fr/cookies" },

  // ⚠️ TEMPORAL — VENECIANA ⚠️  (afegit per no bloquejar el canvi de DNS)
  //
  // QUÈ FA: envia les 4 URLs de veneciana indexades al WordPress cap a la fitxa
  // de veneciana d'ALUMINI, perquè sense això donaven 404 en els 4 idiomes.
  //
  // PER QUÈ ÉS TEMPORAL: la decisió de producte és que /cortina-veneciana sigui
  // una pàgina de CATEGORIA que presenti alumini i fusta i enllaci a totes dues,
  // NO una redirecció a una variant. Això és un pedaç mentre no hi ha el copy.
  //
  // PER QUÈ SÓN TEMPORALS I NO PERMANENTS (`permanent: false`, i per tant les
  // úniques regles d'aquest fitxer que no ho són): els navegadors cachegen les
  // redireccions permanents de forma indefinida. Si aquestes fossin 301/308,
  // qui hi passés avui es quedaria el salt cap a la fitxa d'alumini guardat al
  // navegador i SEGUIRIA aterrant-hi encara que el servidor ja apuntés a la
  // pàgina de categoria. A més Google hauria de desfer una consolidació que
  // acaba de fer. Amb una temporal no es consolida res ara, i el dia que hi
  // hagi la categoria es consolida net i d'una sola vegada.
  //
  // COM ES REPUNTA quan arribi el copy de la pàgina de categoria:
  //   1. Afegir "/colleccions/veneciana" a `pathnames` de src/routing.ts amb els
  //      slugs: ca /cortina-veneciana · es /cortina-veneciana ·
  //      en /venetian-curtain · fr /rideau-store-venitien
  //   2. ESBORRAR aquest bloc sencer i deixar NOMÉS aquestes dues regles, ara sí
  //      DEFINITIVES i PERMANENTS (sense `permanent: false`, com la resta del
  //      fitxer), perquè amb els pathnames posats /en i /fr ja resolen soles:
  //        { source: "/ca/cortina-veneciana-ca", destination: "/cortina-veneciana" }
  //        { source: "/es/cortina-veneciana-es", destination: "/es/cortina-veneciana" }
  { source: "/ca/cortina-veneciana-ca", destination: "/veneciana-alumini", permanent: false },
  { source: "/es/cortina-veneciana-es", destination: "/es/veneciana-aluminio", permanent: false },
  { source: "/en/venetian-curtain", destination: "/en/aluminium-venetian-blind", permanent: false },
  { source: "/fr/rideau-store-venitien", destination: "/fr/store-venitien-aluminium", permanent: false },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400,
  },

  // Desactiva la normalització automàtica de barra final perquè les URLs del
  // WordPress (que SEMPRE porten barra) resolguin en UN SOL salt i no en dos.
  // A canvi, la normalització la fem nosaltres a l'última regla de redirects().
  skipTrailingSlashRedirect: true,

  async redirects() {
    return [
      // 0) decoresteba.com — han d'anar PRIMER de tot: la primera coincidència
      //    guanya, i el normalitzador de barra final del final del fitxer
      //    s'empassaria "/toldos/" abans que hi arribés. Amb i sense barra,
      //    perquè el WordPress d'origen SEMPRE la porta i és el que hi ha
      //    indexat. `has: host` les limita al domini que es consolida.
      ...DECORESTEBA_HOSTS.flatMap((host) =>
        DECORESTEBA_REDIRECTS.flatMap((r) => {
          const has = [{ type: "host" as const, value: host }];
          // L'arrel no té variant amb barra: "/" ja ÉS la barra.
          if (r.source === "/") {
            return [{ source: "/", destination: r.destination, permanent: true, has }];
          }
          return [
            { source: `${r.source}/`, destination: r.destination, permanent: true, has },
            { source: r.source, destination: r.destination, permanent: true, has },
          ];
        }),
      ),
      // 1) Regles específiques del WordPress, amb i sense barra final.
      //    Han d'anar PRIMER: la primera coincidència guanya.
      //    `permanent` per defecte true; les entrades que el declaren manen
      //    (la veneciana el posa a false perquè és un pedaç repuntable).
      ...WP_REDIRECTS.flatMap((r) => {
        const permanent = r.permanent ?? true;
        return [
          { source: `${r.source}/`, destination: r.destination, permanent },
          { source: r.source, destination: r.destination, permanent },
        ];
      }),
      // 2) Normalitzador genèric de barra final per a tota la resta.
      //    `:path+` (un o més segments), NO `:path*`: amb l'asterisc l'arrel "/"
      //    coincideix amb ella mateixa i la portada retorna un 308 sense destí.
      { source: "/:path+/", destination: "/:path+", permanent: true },
    ];
  },

  // El `X-Robots-Tag: noindex` dels entorns que no són producció NO viu aquí:
  // `headers()` s'avalua en temps de build i quedaria cuit al deploy. Viu a
  // src/middleware.ts, que s'executa a cada petició. Vegeu-hi el comentari.
};

export default withNextIntl(nextConfig);
