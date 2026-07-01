// Variants de COLOR de mobiliari amb foto per acabat. Cada color té la
// seva pròpia imatge (retallada del catàleg del proveïdor), de manera que
// el selector de la fitxa canvia la foto principal en triar un color i
// afegeix l'acabat escollit a la cistella. NOMÉS info pública.
//
// NO editar a mà: regenerat des del pipeline d'extracció del PDF del catàleg.

export type MobleColor = {
  /** Nom de l'acabat tal com apareix al catàleg (no es tradueix). */
  name: string;
  /** Ruta pública de la foto del producte en aquest color. */
  image: string;
};

const MOBLE_COLORS: Record<string, MobleColor[]> = {
  "annecy": [
    { name: "Beix", image: "/images/mobiliari/annecy/color-beix.jpg" },
    { name: "Gris", image: "/images/mobiliari/annecy/color-gris.jpg" },
  ],
  "aquila": [
    { name: "Nogal", image: "/images/mobiliari/aquila/color-nogal.jpg" },
    { name: "Negro", image: "/images/mobiliari/aquila/color-negro.jpg" },
  ],
  "arles": [
    { name: "Gris", image: "/images/mobiliari/arles/color-gris.jpg" },
    { name: "Taupe", image: "/images/mobiliari/arles/color-taupe.jpg" },
  ],
  "arles-butaca": [
    { name: "Gris", image: "/images/mobiliari/arles-butaca/color-gris.jpg" },
    { name: "Taupe", image: "/images/mobiliari/arles-butaca/color-taupe.jpg" },
  ],
  "calais": [
    { name: "Beix", image: "/images/mobiliari/calais/color-beix.jpg" },
    { name: "Blanc", image: "/images/mobiliari/calais/color-blanc.jpg" },
    { name: "Gris", image: "/images/mobiliari/calais/color-gris.jpg" },
    { name: "Menta", image: "/images/mobiliari/calais/color-menta.jpg" },
  ],
  "cambrai": [
    { name: "Beix", image: "/images/mobiliari/cambrai/color-beix.jpg" },
    { name: "Crema", image: "/images/mobiliari/cambrai/color-crema.jpg" },
    { name: "Taronja", image: "/images/mobiliari/cambrai/color-taronja.jpg" },
    { name: "Gris", image: "/images/mobiliari/cambrai/color-gris.jpg" },
  ],
  "chablis": [
    { name: "Creme", image: "/images/mobiliari/chablis/color-creme.jpg" },
    { name: "Beige", image: "/images/mobiliari/chablis/color-beige.jpg" },
    { name: "Gris", image: "/images/mobiliari/chablis/color-gris.jpg" },
  ],
  "columba": [
    { name: "Black Marble", image: "/images/mobiliari/columba/color-black-marble.jpg" },
    { name: "Golden Carrara", image: "/images/mobiliari/columba/color-golden-carrara.jpg" },
  ],
  "cubo": [
    { name: "Blanco/Negro Comp.Piedra", image: "/images/mobiliari/cubo/color-blanco-negro-comp-piedra.jpg" },
    { name: "Bordeaux Marmol Natural", image: "/images/mobiliari/cubo/color-bordeaux-marmol-natural.jpg" },
  ],
  "dijon": [
    { name: "Beix", image: "/images/mobiliari/dijon/color-beix.jpg" },
    { name: "Gris clar", image: "/images/mobiliari/dijon/color-gris-clar.jpg" },
    { name: "Verd", image: "/images/mobiliari/dijon/color-verd.jpg" },
  ],
  "grenoble": [
    { name: "Beix", image: "/images/mobiliari/grenoble/color-beix.jpg" },
    { name: "Taupe", image: "/images/mobiliari/grenoble/color-taupe.jpg" },
    { name: "Marro", image: "/images/mobiliari/grenoble/color-marro.jpg" },
    { name: "Blau", image: "/images/mobiliari/grenoble/color-blau.jpg" },
    { name: "Gris", image: "/images/mobiliari/grenoble/color-gris.jpg" },
    { name: "Gris fosc", image: "/images/mobiliari/grenoble/color-gris-fosc.jpg" },
    { name: "Or", image: "/images/mobiliari/grenoble/color-or.jpg" },
  ],
  "limoges": [
    { name: "Beige", image: "/images/mobiliari/limoges/color-beige.jpg" },
    { name: "Taronja", image: "/images/mobiliari/limoges/color-taronja.jpg" },
    { name: "Taupe", image: "/images/mobiliari/limoges/color-taupe.jpg" },
    { name: "Gris", image: "/images/mobiliari/limoges/color-gris.jpg" },
    { name: "Verd", image: "/images/mobiliari/limoges/color-verd.jpg" },
    { name: "Gris fosc", image: "/images/mobiliari/limoges/color-gris-fosc.jpg" },
  ],
  "loriente": [
    { name: "Beige", image: "/images/mobiliari/loriente/color-beige.jpg" },
    { name: "Crema", image: "/images/mobiliari/loriente/color-crema.jpg" },
    { name: "Verd", image: "/images/mobiliari/loriente/color-verd.jpg" },
    { name: "Blau", image: "/images/mobiliari/loriente/color-blau.jpg" },
    { name: "Gris", image: "/images/mobiliari/loriente/color-gris.jpg" },
  ],
  "nimes": [
    { name: "Beige", image: "/images/mobiliari/nimes/color-beige.jpg" },
    { name: "Gris", image: "/images/mobiliari/nimes/color-gris.jpg" },
  ],
  "pantin": [
    { name: "Crema", image: "/images/mobiliari/pantin/color-crema.jpg" },
    { name: "Castany", image: "/images/mobiliari/pantin/color-castany.jpg" },
    { name: "Gris", image: "/images/mobiliari/pantin/color-gris.jpg" },
  ],
  "pegasus": [
    { name: "Roble", image: "/images/mobiliari/pegasus/color-roble.jpg" },
    { name: "Nogal", image: "/images/mobiliari/pegasus/color-nogal.jpg" },
  ],
  "rochelle": [
    { name: "Blau", image: "/images/mobiliari/rochelle/color-blau.jpg" },
    { name: "Verd", image: "/images/mobiliari/rochelle/color-verd.jpg" },
    { name: "Gris", image: "/images/mobiliari/rochelle/color-gris.jpg" },
    { name: "Gris fosc", image: "/images/mobiliari/rochelle/color-gris-fosc.jpg" },
  ],
  "sevres": [
    { name: "Creme", image: "/images/mobiliari/sevres/color-creme.jpg" },
    { name: "Beige", image: "/images/mobiliari/sevres/color-beige.jpg" },
    { name: "Negro", image: "/images/mobiliari/sevres/color-negro.jpg" },
  ],
  "toulouse": [
    { name: "Beige / Castano", image: "/images/mobiliari/toulouse/color-beige-castano.jpg" },
    { name: "Beige / Negro", image: "/images/mobiliari/toulouse/color-beige-negro.jpg" },
  ],
};

/** Colors amb foto d'un moble (buit si no en té). */
export function getMobleColors(slug: string): MobleColor[] {
  return MOBLE_COLORS[slug] ?? [];
}
