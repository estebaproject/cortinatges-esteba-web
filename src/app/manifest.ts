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
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  };
}
