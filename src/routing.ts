import { defineRouting } from "next-intl/routing";

// Rutes públiques traduïdes per idioma.
//
// El català no porta prefix (`localePrefix: "as-needed"` + `defaultLocale: "ca"`).
// Les fitxes de producte viuen internament a `/colleccions/[slug]` però es
// publiquen a l'ARREL de cada idioma, conservant els slugs que ja tenia
// indexats el WordPress. Així la majoria d'URLs històriques no necessiten cap
// redirecció.
//
// REGLA IMPORTANT: NO declaris la clau dinàmica "/colleccions/[slug]". Si hi és,
// cada fitxa queda accessible per DUES URLs (l'antiga i la nova) i es genera
// contingut duplicat; a més trenca el typecheck de LocaleSwitcher. Amb només
// claus estàtiques, la ruta interna redirigeix sola cap a la pública.
export const routing = defineRouting({
  locales: ["ca", "es", "en", "fr"],
  defaultLocale: "ca",
  localePrefix: "as-needed",

  // LA URL MANA. Sense això, el middleware mira la cookie NEXT_LOCALE i, si no
  // n'hi ha, l'Accept-Language del navegador, i REDIRIGEIX encara que la URL ja
  // digui en quin idioma s'ha de servir la pàgina.
  //
  // Amb `as-needed` + `defaultLocale: "ca"`, el català no porta prefix: la seva
  // URL canònica és la nua (`/serveis`, no `/ca/serveis`). Com que no hi ha
  // prefix que la defensi, la detecció se l'emportava. Mesurat a producció, les
  // 8 combinacions d'idioma × cookie de `/serveis`:
  //
  //     ca-ES sense cookie ....... 200  /serveis            ← l'ÚNICA que anava bé
  //     ca-ES + NEXT_LOCALE=es ... 307  /es/servicios
  //     es-ES qualsevol .......... 307  /es/servicios
  //     en-US sense cookie ....... 307  /en/services
  //     fr-FR sense cookie ....... 307  /fr/les-services
  //
  // 7 de 8 servien un idioma que ningú havia demanat. I `/serveis` no és una
  // URL de conveniència: és la canònica, és al sitemap i és la que declara el
  // `hreflang="ca"`. El castellà, l'anglès i el francès no ho patien mai, perquè
  // el seu prefix explícit fa que la detecció no s'apliqui — o sigui que l'únic
  // idioma desprotegit era el de la casa.
  //
  // La cookie és la part pitjor: la posa el nostre propi LocaleSwitcher amb
  // `Max-Age=31536000`. Qui premés "ES" una vegada es quedava un ANY veient el
  // web en castellà, encara que després li arribés un enllaç en català.
  //
  // EL QUE ES PERD: qui entri per l'arrel amb el navegador en castellà ara veu
  // català i ha de prémer "ES". És el preu, i es paga content — el selector
  // segueix funcionant igual perquè navega amb prefix explícit
  // (`router.replace(pathname, { locale })`), no depèn d'això.
  //
  // ALTERNATIVA DESCARTADA: passar a `localePrefix: "always"`. Arregla el mateix
  // però mou les 21 URLs catalanes, onze de les quals són slugs heretats del
  // WordPress que es van conservar EXPRESSAMENT per no haver de redirigir res
  // (v. el comentari de dalt). A més no tanca el cas de l'arrel nua, que és la
  // URL més compartida de totes. Es pot fer més endavant si algun dia convé;
  // això no hi tanca la porta.
  localeDetection: false,

  // VA LLIGAT AMB `localeDetection`. Les dues coses són la mateixa decisió
  // partida en dues opcions: la cookie NEXT_LOCALE existeix per DONAR DE MENJAR
  // a la detecció, i sense detecció no té cap consumidor.
  //
  // SI ALGUN DIA ES TORNA A POSAR `localeDetection: true`, S'HA DE TORNAR A
  // POSAR LA COOKIE. Deixar-la a `false` amb la detecció activada no és neutre:
  // la detecció perdria la memòria entre peticions i cauria sempre a
  // l'`Accept-Language`, o sigui que l'idioma que l'usuari hagi triat a mà al
  // selector deixaria de recordar-se. Es canvien LES DUES o cap.
  //
  // Per què sobra avui, verificat sobre next-intl 3.26.5 instal·lat:
  //   · qui la LLEGIA — resolveLocale.js, prioritats 2 i 3 — ho fa dins de
  //     `if (!locale && routing.localeDetection)`. Amb la detecció apagada no
  //     s'hi entra mai. Fora de middleware/ i navigation/ no hi ha cap altra
  //     referència a NEXT_LOCALE (ni a server/, ni a react-server/, ni a shared/).
  //   · qui l'ESCRIVIA són dos, i només un se n'havia assabentat: el middleware
  //     (middleware.js:155) ja no la posa perquè la seva condició sí que mira
  //     `localeDetection`; però el router de client (createNavigation.js:60 →
  //     syncLocaleCookie.js) NOMÉS mira que `localeCookie` sigui truthy. Com que
  //     el LocaleSwitcher fa `router.replace(pathname, { locale })`, cada canvi
  //     d'idioma seguia escrivint-la amb un any de vigència.
  //
  // Mesurat a producció abans d'aquest canvi: carregar la portada no escrivia
  // res, prémer "ES" al selector deixava `NEXT_LOCALE=es` fins al 2027, i
  // tornar a `/` amb aquella cookie posada ja servia català igualment. Estat
  // mort: l'escrivia el client i no la llegia ningú.
  //
  // NOTA: això atura les cookies NOVES. Les que la gent ja té al navegador
  // segueixen allà fins que caduquin, però són inertes.
  localeCookie: false,

  pathnames: {
    "/": "/",

    // --- Pàgines institucionals -------------------------------------------
    "/serveis": { ca: "/serveis", es: "/servicios", en: "/services", fr: "/les-services" },
    "/contacte": { ca: "/contacte", es: "/contacto", en: "/contact", fr: "/contact" },
    "/demana-pressupost": {
      ca: "/demana-pressupost",
      es: "/pide-presupuesto",
      en: "/ask-for-a-budget",
      fr: "/demandez-un-budget",
    },
    "/vols-treballar-amb-nosaltres": {
      ca: "/vols-treballar-amb-nosaltres",
      es: "/quieres-trabajar-con-nosotros",
      en: "/do-you-want-to-work-with-us",
      fr: "/voulez-vous-travailler-avec-nous",
    },
    "/concerta-cita": {
      ca: "/concerta-cita",
      es: "/concertar-cita",
      en: "/book-a-visit",
      fr: "/prendre-rendez-vous",
    },
    "/botigues": { ca: "/botigues", es: "/tiendas", en: "/stores", fr: "/magasins" },
    "/nosaltres": { ca: "/nosaltres", es: "/nosotros", en: "/about-us", fr: "/a-propos" },
    "/avis-legal": {
      ca: "/avis-legal",
      es: "/aviso-legal",
      en: "/legal-notice",
      fr: "/mentions-legales",
    },
    "/privacitat": {
      ca: "/privacitat",
      es: "/privacidad",
      en: "/privacy",
      fr: "/confidentialite",
    },
    "/cookies": { ca: "/cookies", es: "/cookies", en: "/cookies", fr: "/cookies" },

    // --- Fitxes de producte (slugs heretats del WordPress) ------------------
    "/colleccions/tradicional": {
      ca: "/cortina-tradicional",
      es: "/cortina-tradicional",
      en: "/traditional-curtain",
      fr: "/rideau-traditionnel",
    },
    "/colleccions/estor-paquet": {
      ca: "/estor-paquet",
      es: "/estor-paqueto",
      en: "/package-blind",
      fr: "/paquet-aveugle",
    },
    "/colleccions/estor-enrotllable": {
      ca: "/estor-enrotllable",
      es: "/estor-enrollable",
      en: "/roller-blind",
      fr: "/store-a-enroulement",
    },
    "/colleccions/panell-japones": {
      ca: "/panell-japones",
      es: "/panel-japones",
      en: "/japanese-panel",
      fr: "/panel-japonais",
    },
    "/colleccions/prisada": {
      ca: "/cortina-prisada",
      es: "/cortina-plisada",
      en: "/pleated-curtain",
      fr: "/rideau-plisse",
    },
    "/colleccions/vertical": {
      ca: "/cortina-vertical",
      es: "/cortina-vertical",
      en: "/vertical-curtain",
      fr: "/rideau-vertical",
    },
    "/colleccions/nit-i-dia": {
      ca: "/cortina-nit-i-dia",
      es: "/cortina-noche-y-dia",
      en: "/curtain-night-and-day",
      fr: "/rideau-nuit-et-jour",
    },
    "/colleccions/mosquitera": {
      ca: "/mosquitera",
      es: "/mosquitera",
      en: "/mosquito-net",
      fr: "/moustiquaire",
    },
    "/colleccions/motoritzacio": {
      ca: "/cortina-motoritzacio-i-domotica",
      es: "/cortina-motorizacion-y-domotica",
      en: "/curtains-motorization-and-domotics",
      fr: "/rideaux-motorisation-et-domotique",
    },

    // Les dues variants de veneciana ja existeixen com a fitxa. No estaven
    // indexades al WordPress (allà només hi havia UNA pàgina de veneciana), així
    // que aquestes URLs són noves i no necessiten cap redirecció.
    "/colleccions/veneciana-alumini": {
      ca: "/veneciana-alumini",
      es: "/veneciana-aluminio",
      en: "/aluminium-venetian-blind",
      fr: "/store-venitien-aluminium",
    },
    "/colleccions/veneciana-fusta": {
      ca: "/veneciana-fusta",
      es: "/veneciana-madera",
      en: "/wooden-venetian-blind",
      fr: "/store-venitien-bois",
    },

    // --- Fitxes EN PREPARACIÓ (consolidació de decoresteba.com) ------------
    // Les rutes es fixen ARA perquè els 301 de decoresteba puguin apuntar-hi
    // sense refer el mapa després. Mentre l'entrada visqui a DRAFT_PRODUCTS
    // (src/lib/products.ts) aquestes URLs fan 404, que és el que toca.
    "/colleccions/tendals": {
      ca: "/tendals",
      es: "/toldos",
      en: "/awnings",
      fr: "/stores-bannes", // NO "/auvents": un auvent és una marquesina fixa
    },
    "/colleccions/pergoles": {
      ca: "/pergoles",
      es: "/pergolas",
      en: "/pergolas", // NO "/arbors": un arbor és un arc de jardí
      fr: "/pergolas",
    },
    "/colleccions/tapisseria": {
      ca: "/tapisseria",
      es: "/tapiceria",
      en: "/upholstery",
      fr: "/tapisserie",
    },
    "/colleccions/moquetes": {
      ca: "/moquetes",
      es: "/moquetas",
      // "fitted-carpets" i NO "carpets": a la botiga ja hi ha /catifes, que en
      // anglès són "carpets" o "rugs". Una moqueta és revestiment continu
      // enganxat al terra i una catifa és una peça solta: si totes dues
      // s'anomenessin "carpet" competirien entre elles a la mateixa cerca i
      // l'usuari no sabria on va. "Fitted carpet" és el terme britànic exacte.
      en: "/fitted-carpets",
      fr: "/moquettes",
    },

    // PENDENT: "/colleccions/veneciana" (pàgina de categoria que presenta les
    // dues variants) i les seves 4 redireccions des del WordPress, a l'espera
    // del copy validat. Slug previst: /cortina-veneciana i equivalents.
  },
});
