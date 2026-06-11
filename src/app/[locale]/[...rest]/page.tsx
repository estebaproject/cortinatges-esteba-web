import { notFound } from "next/navigation";

// Qualsevol ruta no existent dins d'un idioma dispara la pàgina 404 amb estil
// (src/app/[locale]/not-found.tsx), amb capçalera i peu.
export default function CatchAllNotFound() {
  notFound();
}
