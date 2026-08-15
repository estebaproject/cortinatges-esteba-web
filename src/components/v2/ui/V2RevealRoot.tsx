"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Motor de les aparicions en scroll del prototip.
 *
 * Es munta UN sol cop al layout i observa tots els elements amb `.reveal`. Es
 * fa així, i no amb un observer per component, perquè una home amb catorze
 * seccions crearia catorze observers per a la mateixa feina.
 *
 * IMPORTANT: la classe `js` a <html> l'afegeix aquest component. Mentre no hi
 * és, `.reveal` es veu del tot (vegeu v2.css). Així, si el JS no arriba a
 * carregar-se, la pàgina es llegeix igual en comptes de quedar en blanc — que
 * és el que passa amb les animacions d'entrada mal plantejades.
 */
export default function V2RevealRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");

    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));

    // Sense IntersectionObserver (navegadors molt antics) es mostra tot d'una.
    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          // Un cop vist, es deixa d'observar: l'efecte no s'ha de repetir en
          // tornar a pujar, que marejaria.
          observer.unobserve(entry.target);
        }
      },
      // El marge inferior negatiu fa que l'element aparegui quan ja ha entrat
      // de veritat, no quan just assoma un píxel per sota del plec.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    nodes.forEach((n) => {
      // El que ja és a pantalla en carregar no s'anima: es veu directament.
      if (n.getBoundingClientRect().top < window.innerHeight * 0.9) {
        n.classList.add("is-visible");
        return;
      }
      observer.observe(n);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
