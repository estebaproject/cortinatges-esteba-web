import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Cortines a mida des de 1961`,
    short_name: SITE_NAME,
    description:
      "Cortines, estors i tèxtil de la llar a mida. Fabricació i instal·lació pròpies.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    // Mateix blau que `ink` i que el `themeColor` del layout: és la barra
    // d'estat de l'app un cop instal·lada.
    theme_color: "#283649",
    lang: "ca",
    // AQUESTA LLISTA S'HA DE TOCAR A MÀ CADA VEGADA QUE CANVIÏ EL FORMAT DE
    // LES ICONES. No és un consell: és la reparació d'un error que ja ha passat.
    //
    // Fins ara aquí hi deia `/icon.svg` i `/apple-icon.svg`. Els dos fitxers
    // van existir de debò —els va crear el snapshot inicial (15bb795), un
    // quadrat blau amb les lletres "CE" dins d'un <text>— però c040b47 els va
    // ESBORRAR i els va substituir per PNG. Aquell commit explica amb tot
    // detall per què canviava el dibuix i no diu ni una paraula del manifest.
    // Resultat: dues rutes que responien 404 des de llavors, o sigui que qui
    // instal·lés el web com a aplicació es quedava sense cap icona vàlida.
    //
    // PER QUÈ NOMÉS ES VA TRENCAR AQUÍ i no als <link> del <head>: aquells no
    // els escriu ningú. Next els deriva de la convenció de fitxers
    // (src/app/icon.png i src/app/apple-icon.png), o sigui que segueixen el
    // fitxer allà on vagi i no poden caducar. Aquesta llista, en canvi, és
    // text escrit a mà que NOMÉS s'assembla als fitxers reals mentre algú se'n
    // recordi. És el mateix patró que el `themeColor` del layout, que es va
    // quedar amb el blau vell quan va canviar la paleta: un valor duplicat a
    // mà al costat d'un que el framework ja deriva sol.
    //
    // Les mides han de coincidir amb les reals dels fitxers: 96x96 i 180x180.
    icons: [
      { src: "/icon.png", sizes: "96x96", type: "image/png" },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        // `any` i no `maskable`: la icona ja porta el seu propi coixí i un
        // llançador que hi apliqués la màscara adaptativa li menjaria el
        // retall de tela pels costats.
        purpose: "any",
      },
    ],
  };
}
