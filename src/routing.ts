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

    // PENDENT: "/colleccions/veneciana" (pàgina de categoria que presenta les
    // dues variants) i les seves 4 redireccions des del WordPress, a l'espera
    // del copy validat. Slug previst: /cortina-veneciana i equivalents.
  },
});
