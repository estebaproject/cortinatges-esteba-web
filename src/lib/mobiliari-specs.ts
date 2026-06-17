// Especificacions tecniques de mobiliari (dimensions + material + acabats).
// Generat des de DOCUMENTS/_mob/mobiliari_specs_clean.json (42 mobles amb dades;
// 2 sense — scandinave-ii i mosa — no apareixen aqui).
// Aqui viu NOMES informacio publica del producte (mides, composicio, acabats);
// MAI cap preu ni cost. Mateix patro d'inlining que src/lib/mobiliari-detall.ts.
//
// El material ja ve traduit als 4 idiomes des de la font; NO re-traduir.
// NO editar a ma: regenerar des del JSON font.

/** Idiomes disponibles per al text de material. */
export type SpecLocale = "ca" | "es" | "en" | "fr";

/** Especificacio tecnica d'un moble. */
export type MobleSpec = {
  /** Dimensio ja formatada per a la UI (ex. "140/180 × 90 × 76 cm"). */
  dimensions: string;
  /** Descripcio del material/composicio en cada idioma. */
  material: { ca: string; es: string; en: string; fr: string };
  /** Acabats o colors disponibles; pot estar buit. */
  finishes: string[];
};

const MOBILIARI_SPECS: Record<string, MobleSpec> = {
  "annecy": {
    dimensions: "61 × 61 × 84 cm",
    material: {
      ca: "Estructura amb tapisseria de tela, potes de fusta massissa (freixe).",
      es: "Estructura con tapizado de tela, patas de madera maciza (ceniza).",
      en: "Structure with fabric upholstery, solid wood legs (ash).",
      fr: "Structure avec revêtement en tissu, pieds en bois massif (frêne).",
    },
    finishes: ["Beix", "Gris"],
  },
  "arles": {
    dimensions: "55 × 53 × 75 cm",
    material: {
      ca: "Estructura amb tapisseria de teixit, potes de metall lacat negre.",
      es: "Estructura con tapizado en tejido, patas en metal lacado negro.",
      en: "Structure with fabric upholstery, black lacquered metal legs.",
      fr: "Structure avec revêtement en tissu, pieds en métal laqué noir.",
    },
    finishes: ["Gris", "Taupe"],
  },
  "calais": {
    dimensions: "45 × 56 × 80 cm",
    material: {
      ca: "Estructura i potes de plàstic, seient de pell sintètica.",
      es: "Estructura y patas de plástico, asiento de piel sintética.",
      en: "Plastic structure and legs, synthetic leather seat.",
      fr: "Structure et pieds en plastique, assise en cuir synthétique.",
    },
    finishes: ["Beix", "Blanc", "Gris", "Menta"],
  },
  "cambrai": {
    dimensions: "60 × 49 × 87 cm",
    material: {
      ca: "Estructura amb tapisseria de tela, potes de fusta massissa (freixe).",
      es: "Estructura con tapizado de tela, patas de madera maciza (ceniza).",
      en: "Structure with fabric upholstery, solid wood legs (ash).",
      fr: "Structure avec revêtement en tissu, pieds en bois massif (frêne).",
    },
    finishes: ["Beix", "Crema", "Taronja", "Gris"],
  },
  "dijon": {
    dimensions: "56 × 64 × 84 cm",
    material: {
      ca: "Estructura amb tapisseria de teixit, potes de metall lacat negre.",
      es: "Estructura con tapizado en tejido, patas en metal lacado negro.",
      en: "Structure with fabric upholstery, black lacquered metal legs.",
      fr: "Structure avec revêtement en tissu, pieds en métal laqué noir.",
    },
    finishes: ["Beix", "Gris clar", "Verd"],
  },
  "grenoble": {
    dimensions: "45 × 55 × 88 cm",
    material: {
      ca: "Estructura entapissada en vellut, potes de metall lacat negre.",
      es: "Estructura tapizada en terciopelo, patas de metal lacado en negro.",
      en: "Structure with velvet upholstery, black lacquered metal legs.",
      fr: "Structure avec revêtement en velours, pieds en métal laqué noir.",
    },
    finishes: ["Beix", "Taupe", "Marró", "Blau", "Gris", "Gris fosc", "Or"],
  },
  "limoges": {
    dimensions: "60 × 61 × 81 cm",
    material: {
      ca: "Estructura amb entapissat de vellut tipus alcàntara, potes de metall lacat negre.",
      es: "Estructura con tapizado de terciopelo tipo alcántara, patas de metal lacado en negro.",
      en: "Structure with alcantara-like velvet upholstery, black lacquered metal legs.",
      fr: "Structure avec revêtement en velours alcantara, pieds en métal laqué noir.",
    },
    finishes: ["Beige", "Taronja", "Taupe", "Gris", "Verd", "Gris fosc"],
  },
  "loriente": {
    dimensions: "57 × 48 × 85 cm",
    material: {
      ca: "Estructura amb entapissat de teixit, potes de metall lacat negre.",
      es: "Estructura con tapizado en tejido, patas en metal lacado negro.",
      en: "Structure with fabric upholstery, black lacquered metal legs.",
      fr: "Structure avec revêtement en tissu, pieds en métal laqué noir.",
    },
    finishes: ["Beige", "Crema", "Verd", "Blau", "Gris"],
  },
  "nice": {
    dimensions: "62 × 53 × 90 cm",
    material: {
      ca: "Estructura amb entapissat de tela, potes de fusta massissa (roure).",
      es: "Estructura con tapizado de tela, patas de madera maciza (roble).",
      en: "Structure with fabric upholstery, solid wood legs (oak).",
      fr: "Structure avec revêtement en tissu, pieds en bois massif (chêne).",
    },
    finishes: ["Crema"],
  },
  "nimes": {
    dimensions: "59 × 47 × 92 cm",
    material: {
      ca: "Estructura amb entapissat de teixit bouclé, potes de metall lacat negre.",
      es: "Estructura con tapizado en tejido bouclé, patas en metal lacado negro.",
      en: "Structure with bouclé fabric upholstery, black lacquered metal legs.",
      fr: "Structure avec revêtement en tissu bouclé, pieds en métal laqué noir.",
    },
    finishes: ["Beige", "Gris"],
  },
  "pantin": {
    dimensions: "57 × 45 × 83 cm",
    material: {
      ca: "Estructura de MDF xapat en noguera amb entapissat de tela, potes de metall lacat negre.",
      es: "Estructura de MDF chapado en nogal con tapizado de tela, patas de metal lacado en negro.",
      en: "Walnut veneered MDF Structure, fabric upholstery, black lacquered metal legs.",
      fr: "Structure en MDF plaqué noyer, revêtement en tissu, pieds en métal laqué noir.",
    },
    finishes: ["Crema", "Castany", "Gris"],
  },
  "rochelle": {
    dimensions: "58 × 55 × 82 cm",
    material: {
      ca: "Estructura entapissada amb vellut, potes de metall lacat negre.",
      es: "Estructura tapizada en terciopelo, patas de metal lacado en negro.",
      en: "Structure with velvet upholstery, black lacquered metal legs.",
      fr: "Structure avec revêtement en velours, pieds en métal laqué noir.",
    },
    finishes: ["Blau", "Verd", "Gris", "Gris fosc"],
  },
  "sevres": {
    dimensions: "53 × 49 × 81 cm",
    material: {
      ca: "Estructura de MDF amb acabat de xapa de noguera, entapissat de pell sintètica, potes de metall lacat negre.",
      es: "Estructura de MDF acabado en chapa de nogal, con tapizado de piel sintética, patas de metal lacado en negro.",
      en: "Walnut veneered MDF structure, synthetic leather upholstery, black lacquered metal legs.",
      fr: "Structure en MDF finition placage noyer, revêtement en cuir synthétique, pieds en métal laqué noir.",
    },
    finishes: ["Creme", "Beige", "Negro"],
  },
  "toulouse": {
    dimensions: "52 × 58 × 78 cm",
    material: {
      ca: "Estructura amb entapissat de pell sintètica, potes de fusta massissa (arbre del cautxú).",
      es: "Estructura con tapizado de piel sintética, patas de madera maciza (árbol del caucho).",
      en: "Structure with synthetic leather upholstery, solid wood legs (rubber tree).",
      fr: "Structure avec revêtement en cuir synthétique, pieds en bois massif (Hévéa).",
    },
    finishes: ["Beige / Castaño", "Beige / Negro"],
  },
  "sg-vittel": {
    dimensions: "64 × 59 × 86 cm",
    material: {
      ca: "Estructura amb entapissat de teixit, potes de metall lacat negre.",
      es: "Estructura con tapizado en tejido, patas en metal lacado negro.",
      en: "Structure with fabric upholstery, black lacquered metal legs.",
      fr: "Structure avec revêtement en tissu, pieds en métal laqué noir.",
    },
    finishes: ["Gris", "Creme", "Amarillo", "Verde"],
  },
  "arles-butaca": {
    dimensions: "78 × 72 × 82 cm",
    material: {
      ca: "Estructura amb entapissat de teixit, potes de metall lacat negre.",
      es: "Estructura con tapizado en tejido, patas en metal lacado negro.",
      en: "Structure with fabric upholstery, black lacquered metal legs.",
      fr: "Structure avec revêtement en tissu, pieds en métal laqué noir.",
    },
    finishes: ["Gris", "Taupe"],
  },
  "chablis": {
    dimensions: "80 × 91 × 95 cm",
    material: {
      ca: "Estructura amb entapissat de teixit, potes de metall lacat negre.",
      es: "Estructura con tapizado en tejido, patas en metal lacado negro.",
      en: "Structure with fabric upholstery, black lacquered metal legs.",
      fr: "Structure avec revêtement en tissu, pieds en métal laqué noir.",
    },
    finishes: ["Creme", "Beige", "Gris"],
  },
  "aquila": {
    dimensions: "210 × 110 × 76 cm",
    material: {
      ca: "Estructura de MDF, acabat en xapa de noguera / freixe negre; sobre de 25 mm de gruix.",
      es: "Estructura de MDF, acabado en chapa de nogal / fresno negro; encimera de 25 mm de grosor.",
      en: "MDF structure, walnut or black ash veneer finish; 25 mm thickness table top.",
      fr: "Structure en MDF, finition placage noyer / frêne noir ; plateau de 25 mm d'épaisseur.",
    },
    finishes: ["Nogal", "Negro"],
  },
  "ara": {
    dimensions: "50 × 40 × 53 cm",
    material: {
      ca: "Estructura de MDF, acabat en xapa de noguera; MDF xapat en noguera.",
      es: "Estructura de MDF, acabado en chapa de nogal; MDF chapado en nogal.",
      en: "MDF structure, walnut veneer finish; walnut veneered MDF.",
      fr: "Structure en MDF, finition placage noyer; MDF plaqué noyer.",
    },
    finishes: ["Nogal"],
  },
  "auriga": {
    dimensions: "160/200 × 90 × 76 cm",
    material: {
      ca: "Sobre de MDF xapat en noguera, potes de fusta massissa (color noguera).",
      es: "Encimera de MDF chapada en nogal, patas de madera maciza (color nogal).",
      en: "MDF top with walnut veneer, solid wood legs (walnut color).",
      fr: "Plateau en MDF plaqué noyer, pieds en bois massif (couleur noyer).",
    },
    finishes: ["Nogal"],
  },
  "caelum": {
    dimensions: "Ø 80 × 35 cm / Ø 60 × 45 cm",
    material: {
      ca: "Estructura de taula de MDF amb sobre de compòsit de pedra; potes de metall rosa.",
      es: "Estructura de mesa de MDF con encimera en compuesto de piedra; patas de metal rosa.",
      en: "MDF table frame with stone composite top; rose metal legs.",
      fr: "Structure de table en MDF avec plateau en pierre composite ; pieds en métal rose.",
    },
    finishes: ["Rosa"],
  },
  "canes": {
    dimensions: "Ø 80 × 38 cm / Ø 55 × 56 cm",
    material: {
      ca: "Estructura de la taula de MDF, acabat en xapa de noguera bicolor amb detalls d'acer; sobre de compòsit de pedra.",
      es: "Estructura de la mesa de MDF, acabado en chapa de nogal bicolor con detalles de acero; tablero en compuesto de piedra.",
      en: "Table frame in MDF, finished in two-tone walnut veneer with steel details; stone composite top.",
      fr: "Structure en MDF, plaqué noyer bicolore avec détails en acier ; plateau en pierre composite.",
    },
    finishes: [],
  },
  "columba": {
    dimensions: "180/260 × 90 × 76 cm",
    material: {
      ca: "Sobre de compòsit ceràmic mat, potes de fusta massissa (bedoll) xapades en noguera.",
      es: "Encimera de compuesto cerámico sin brillo, patas de madera maciza (abedul) chapadas en nogal.",
      en: "Ceramic matte composite top, solid wood legs (birch) with walnut veneer.",
      fr: "Plateau en céramique composite mate, pieds en bois massif (bouleau) plaqué noyer.",
    },
    finishes: ["Black Marble", "Golden Carrara", "Gloss L. Pandora"],
  },
  "crater": {
    dimensions: "Ø 80 × 45 cm / Ø 60 × 55 cm",
    material: {
      ca: "Base de taula de ferro lacat en bronze, sobre de compòsit de pedra.",
      es: "Base de mesa de hierro lacado en bronce, encimera en compuesto de piedra.",
      en: "Iron table frame with bronze lacquered finish, stone composite top.",
      fr: "Structure de la table en fer laqué bronze, plateau en pierre composite.",
    },
    finishes: ["Bronze"],
  },
  "cubo": {
    dimensions: "40 × 40 × 40 / 35 × 35 × 50 / 30 × 30 × 50 / 38 × 38 × 38 cm",
    material: {
      ca: "Compòsit de pedra (blanc/negre) o pedra natural (Bordeaux).",
      es: "Compuesto de piedra (Blanco/Negro) o piedra natural (Bordeaux).",
      en: "Stone composite (white/black) or natural stone (Bordeaux).",
      fr: "Pierre composite (blanc/noir) ou pierre naturelle (Bordeaux).",
    },
    finishes: ["Blanco/Negro Comp.Piedra", "Bordeaux Mármol Natural"],
  },
  "gemini": {
    dimensions: "60 × 60 × 50 cm / 100 × 100 × 40 cm",
    material: {
      ca: "Estructura de MDF amb acabat en xapa de freixe marró. Potes de metall space grey. Sobre de vidre trempat fumat.",
      es: "Estructura de MDF acabado en chapa de fresno marrón. Patas de metal space grey. Encimera de cristal endurecido oscuro.",
      en: "MDF structure with brown ash veneer finish. Space grey metal legs. Smoked tempered glass top.",
      fr: "Structure en MDF finition placage frêne brun. Pieds en métal space grey. Plateau en verre trempé teinté.",
    },
    finishes: ["Marrón"],
  },
  "orion": {
    dimensions: "240 × 120 × 76 cm (mesa) / 180 × 45 × 82 cm (aparador 4P) / 140 × 40 × 127 cm (aparador alt 3P)",
    material: {
      ca: "Estructura de MDF, acabat en xapa de roure negre. Sobre amb forma irregular. Base cònica.",
      es: "Estructura de MDF, acabado en chapa de roble negro. Encimera con forma irregular. Base cónica.",
      en: "MDF structure, Black oak veneer finish. Top panel irregular shaped. Base in cone shape.",
      fr: "Structure en MDF, finition placage de chêne noir. Plateau de forme irrégulière. Base conique.",
    },
    finishes: ["Roble"],
  },
  "pavo": {
    dimensions: "150 × 40 × 80 cm",
    material: {
      ca: "Estructura de MDF, acabat lacat; potes de metall lacat negre.",
      es: "Estructura en MDF, acabado lacado; patas de metal lacado negro.",
      en: "MDF Chipboard structure, lacquered finish; legs in black lacquered metal.",
      fr: "Structure en MDF, finition laqué; pieds en métal laqués noir.",
    },
    finishes: ["Beige"],
  },
  "pegasus": {
    dimensions: "120/160 × 40 × 76 cm (aparador) / 120 × 40 × 55 cm (moble TV) / 120 × 60 × 76 cm (escriptori)",
    material: {
      ca: "Estructura de MDF, acabat en xapa de roure o noguera, potes metàl·liques lacades en negre.",
      es: "Estructura de MDF, acabado en chapa de roble o nogal, patas metálicas lacadas en negro.",
      en: "MDF structure, oak or walnut veneer finish, black lacquered metal legs.",
      fr: "Structure en MDF, finition placage chêne ou noyer, pieds en métal laqué noir.",
    },
    finishes: ["Roble", "Nogal"],
  },
  "pictor": {
    dimensions: "Ø 120 × 76 / Ø 135 × 76 cm",
    material: {
      ca: "Estructura de MDF, acabat en xapa de noguera; sobre de 25 mm de gruix.",
      es: "Estructura de MDF, acabado en chapa de nogal; encimera de 25 mm de grosor.",
      en: "MDF structure, walnut veneer finish; 25 mm thickness table top.",
      fr: "Structure en MDF, finition placage noyer; plateau de 25 mm d'épaisseur.",
    },
    finishes: ["Nogal"],
  },
  "puppis": {
    dimensions: "60 × 45 × 60 cm",
    material: {
      ca: "Estructura de MDF, acabat en xapa de noguera; potes i nanses en acer inoxidable.",
      es: "Estructura de MDF, acabado en chapa de nogal; patas y manijas en acero inoxidable.",
      en: "Walnut veneered MDF; stainless steel handles and base.",
      fr: "MDF plaqué noyer; pieds et poignées en acier inoxydable.",
    },
    finishes: ["Nogal"],
  },
  "sagitta": {
    dimensions: "Consola 120 × 35 × 75 cm / Estanteria 160 × 40 × 106 cm / Estanteria 90 × 40 × 171 cm",
    material: {
      ca: "Estructura d'aglomerat, acabat en xapa de roure, interior de melamina.",
      es: "Estructura de aglomerado, acabado en chapa de roble.",
      en: "Chipboard structure, oak veneer finish, melamine interior.",
      fr: "Structure en aggloméré, finition placage chêne.",
    },
    finishes: ["Efecto Roble"],
  },
  "taurus": {
    dimensions: "199 × 44 × 75 cm",
    material: {
      ca: "Estructura de MDF acabada en xapa de noguera; potes i manetes en acer inoxidable.",
      es: "Estructura de MDF acabado en chapa de nogal; patas y manijas en acero inoxidable.",
      en: "Walnut veneered MDF structure; stainless steel handles and base.",
      fr: "Structure en MDF finition placage noyer; pieds et poignées en acier inoxydable.",
    },
    finishes: ["Nogal"],
  },
  "havre": {
    dimensions: "63 × 61 × 83 cm",
    material: {
      ca: "Estructura amb tapisseria de tela, potes de fusta massissa.",
      es: "Estructura con tapizado de tela, patas de madera maciza.",
      en: "Structure with fabric upholstery, solid wood legs.",
      fr: "Structure avec revêtement en tissu, pieds en bois massif.",
    },
    finishes: [],
  },
  "rennes-c-reposapi-s": {
    dimensions: "76 × 86 × 96 cm",
    material: {
      ca: "Estructura amb entapissat de teixit, potes de metall lacat negre.",
      es: "Estructura con tapizado en tejido, patas en metal lacado negro.",
      en: "Structure with fabric upholstery, black lacquered metal legs.",
      fr: "Structure avec revêtement en tissu, pieds en métal laqué noir.",
    },
    finishes: [],
  },
  "hydra": {
    dimensions: "74 × 56 × 38 / 132 × 89 × 32 cm",
    material: {
      ca: "Potes de fusta massissa (om), sobre de compòsit de pedra.",
      es: "Patas de madera maciza (olmo), tablero de compuesto de piedra.",
      en: "Solid wood legs (elm), stone composite top.",
      fr: "Pieds en bois massif (orme), plateau en composite de pierre.",
    },
    finishes: [],
  },
  "leo": {
    dimensions: "140/180 × 90 × 76 cm",
    material: {
      ca: "Sobre de compòsit ceràmic, potes de metall lacat negre.",
      es: "Encimera de compuesto cerámico, patas en metal lacado negro.",
      en: "Ceramic composite top, black lacquered metal legs.",
      fr: "Plateau en céramique composite, pieds en métal laqué noir.",
    },
    finishes: [],
  },
  "lepus": {
    dimensions: "51 × 63 × 44 / 110 × 72 × 33 cm",
    material: {
      ca: "Pota de metall, sobre de compòsit de pedra.",
      es: "Pata de metal, tablero de compuesto de piedra.",
      en: "Metal base, stone composite top.",
      fr: "Pied en métal, plateau en composite de pierre.",
    },
    finishes: [],
  },
  "lyra": {
    dimensions: "180 × 90 × 76 (taula) / 160 × 40 × 85 (aparador) cm",
    material: {
      ca: "Sobre de compòsit ceràmic beix, potes de MDF xapades en noguera.",
      es: "Encimera de compuesto cerámico beige, patas de MDF chapadas en nogal.",
      en: "Beige ceramic composite top, walnut veneered MDF legs.",
      fr: "Plateau en céramique composite beige, pieds en MDF plaqué noyer.",
    },
    finishes: ["Nogal"],
  },
  "vela": {
    dimensions: "140 × 75 × 38 cm",
    material: {
      ca: "Estructura de MDF amb acabat de xapa de roure negre, pota ovalada de llautó raspallat.",
      es: "Estructura de MDF acabado en chapa de roble negro, pata ovalada de latón cepillado.",
      en: "Black oak veneered MDF structure, oval brushed brass leg.",
      fr: "Structure en MDF finition placage chêne noir, pied ovale en laiton brossé.",
    },
    finishes: [],
  },
  "virgo": {
    dimensions: "104 × 68 × 46 / 154 × 39 × 56 cm",
    material: {
      ca: "Estructura d'aglomerat, panells de portes i calaixos de MDF.",
      es: "Estructura en aglomerado, paneles de puertas y cajones en MDF.",
      en: "Particleboard structure, MDF door and drawer panels.",
      fr: "Structure en aggloméré, panneaux de portes et tiroirs en MDF.",
    },
    finishes: ["Negro"],
  },
  "volans": {
    dimensions: "150 × 40 × 80 / 80 × 40 × 90 cm",
    material: {
      ca: "Estructura d'aglomerat, acabat en melamina, potes de metall lacat negre/or.",
      es: "Estructura de aglomerado, acabado en melamina, patas de metal lacado negro/oro.",
      en: "Particleboard structure, melamine finish, black/gold lacquered metal legs.",
      fr: "Structure en aggloméré, finition mélaminée, pieds en métal laqué noir/or.",
    },
    finishes: ["Negro"],
  },
};

/**
 * Especificacio tecnica d'un moble pel seu slug, o undefined si no en tenim
 * dades (ex. "scandinave-ii", "mosa"). Degradacio neta: el consumidor amaga el
 * bloc de specs quan retorna undefined.
 */
export function getMobleSpec(slug: string): MobleSpec | undefined {
  return MOBILIARI_SPECS[slug];
}
