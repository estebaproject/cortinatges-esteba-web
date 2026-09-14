import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Layout del WEB INFORMATIU (tot el que no és /online): la capçalera i el peu
 * de Cortinatges Esteba. El grup de rutes `(site)` no canvia cap URL; només
 * permet que /online tingui la seva pròpia capçalera i el seu propi peu sense
 * decidir-ho per la ruta en temps d'execució.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      {/* Aquí hi havia el rètol de cookies. Ja no cal: l'única cosa de fora
          que carregava el web era el mapa de Google de les botigues, i des del
          14/09/2026 el mapa el dibuixa el web. Sense cap cookie ni recurs de
          tercers, no hi ha res per a què demanar permís. SI ALGÚ AFEGEIX
          ANALÍTICA, UN VÍDEO INCRUSTAT O UN PÍXEL, el rètol ha de tornar ABANS
          de publicar-ho, i la política de cookies també s'ha de canviar. */}
    </>
  );
}
