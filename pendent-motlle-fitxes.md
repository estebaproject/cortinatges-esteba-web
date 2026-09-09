# Pendent — el motlle de les fitxes de producte

**Estat: apuntat, no decidit.** Es va aturar expressament: fer-ho és començar una
altra ronda per les quinze fitxes i es va preferir tancar la migració primer.

Data de la troballa: setembre del 2026. Fitxer que caldria tocar:
`src/app/[locale]/colleccions/[slug]/page.tsx`.

---

## Què va passar

El client va dir, literal: **«tot això és massa rotllo»** i **«crec que amb això no
estem fent una bona web»**, mirant la fitxa de pèrgoles.

Es van mirar nou pàgines del sector, referents internacionals i oficis veïns per
veure com ho fan els que ho fan bé.

## El diagnòstic

**No sobra text. Sobra llista.** Les pàgines que funcionen són molt MÉS LLARGUES
que la nostra i no cansen, perquè allà tot va en frases amb un títol al davant.

    la nostra fitxa de pèrgoles      90 paraules  ·  14 pics
    Toldos Codina, pèrgoles         450 paraules  ·  CAP llista
    Codina, fitxa de tendal cofre   360 paraules abans de la primera llista

El que a nosaltres és un pic, a Codina és **un subtítol amb trenta paraules a sota
i la seva foto al costat**.

## La causa, que és el que importa

**La fitxa no és una pàgina: és el motlle número 12 de catorze.** El motlle només
permet titular, introducció, un parell de paràgrafs i llistes. Res més.

Dins d'aquest motlle és FÍSICAMENT IMPOSSIBLE escriure el que fa la millor
referència. Per això surten catorze pics: no és una tria de redacció, és el que el
motlle deixa fer. **Mentre no canviï, cada cosa nova que es vulgui explicar es
tornarà un pic més**, i d'aquí a sis mesos el client tornarà a dir el mateix.

## Les tres coses que li falten al motlle

Totes tres OPCIONALS: les fitxes que no les facin servir no canvien gens.

1. **Seccions amb títol, text i foto pròpia al costat.** Resol el 80% del
   problema. Sense això no es pot escriure com escriuen els bons.
2. **Peu de foto i text alternatiu escrits a mà.** Ara les imatges de galeria es
   diuen `Pèrgoles — 2`, `Pèrgoles — 3`. Sense peu, una foto d'una terrassa
   coberta no diu res a qui no sap què és una pèrgola de lames.
3. **Un desplegable de preguntes freqüents.** No existeix al web. Si no es
   construeix, NO s'hi posa la FAQ: seria tornar al problema que s'arregla.

## L'estructura que proposava la recerca per a pèrgoles

    1. Obertura, 45 paraules, cap llista
    2. «Tèxtil o lames?» — dos apartats amb títol i foto pròpia. És l'ÚNICA
       decisió real que ha de prendre qui llegeix
    3. «Adossada o exempta?» — 70 paraules
    4. «Com ho fem» — LLISTA 1, quatre passos numerats. És l'única llista que
       conserven TOTES les pàgines bones, perquè descriu una seqüència
    5. «A tenir en compte» — tres frases honestes
    6. Les fotos repartides, amb peu, una per apartat
    7. Fitxa tècnica — LLISTA 2, opcional i al final. Norma dura: cap ítem pot
       repetir una paraula ja dita a dalt

## Què ja s'ha fet, i què no

**FET** (setembre 2026):

- Esborrat el bloc «Característiques» sencer de pèrgoles: cinc dels sis ítems
  repetien alguna cosa de la mateixa pantalla.
- Trets els blocs que duplicaven altres fitxes: «Sistemes» duplicava
  `/motoritzacio`, «Teixits» duplicava `/tendals`.
- Retallats els specs de tot el catàleg: tendals de 27 ítems a 11, tapisseria de
  19 a 15, vertical es queda sense specs.
- **Les llistes passen de pics a graella de dues columnes.** No és el canvi de
  motlle: és la millora de mitja hora que treu el «web del 2015». Onze ítems
  passaven d'ocupar una pantalla sencera a 335 px al desktop.

**NO FET, i és això el que queda apuntat aquí:** les tres capacitats noves del
motlle i l'estructura de set apartats.

## Dues coses de fons que van sortir de la mateixa recerca

- **La visita es contradiu amb ella mateixa a dos clics.** La fitxa promet
  «prenem mides i t'assessorem SENSE COMPROMÍS» i `CtaVisita.body` a `/contacte`
  diu «assessorament a domicili AMB COST». Un client que descobreix un cost al
  segon clic no truca.
- **El títol al cercador és només «Pèrgoles | Cortinatges Esteba»**: sense
  Girona, sense bioclimàtica, sense lames.

## I l'argument per fer-ho algun dia

`pergolasgirona.com`, el competidor directe a Girona, **no té pàgina de
pèrgoles**: té una entrada de blog de tres paràgrafs, sense fotos de pèrgoles,
sense llistes i sense botó de pressupost. El que sí que té són sis botons per
compartir a xarxes.

Aquest terreny és nostre per agafar i ara mateix és buit.
