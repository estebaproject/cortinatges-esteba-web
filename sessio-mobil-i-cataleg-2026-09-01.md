# Sessió: auditoria de mòbil i neteja del catàleg

**Data:** 30/08/2026 – 01/09/2026
**Abast:** va començar comprovant si els cinc commits de marca havien trencat res
en mòbil. No n'havien trencat cap — però la comprovació va destapar deute que
venia d'abans, i la sessió va acabar sent una neteja.
**Mètode:** tot mesurat contra producció amb Playwright i consultes a Supabase.
Cap afirmació d'aquest document surt d'una lectura del codi sense comprovar;
quan una xifra no s'ha pogut reproduir, es diu.

---

## El fil que ho travessa tot

Gairebé cada problema d'aquesta sessió és **el mateix patró**: un valor escrit a
mà que duplica una cosa que el framework o un altre fitxer ja deriva. Mentre
algú se'n recorda va bé; el dia que la font canvia, la còpia menteix en silenci
i no peta res.

Va mossegar sis vegades: el `themeColor`, les icones del manifest, l'`og:image`
de les fitxes, les rutes del sitemap, els enllaços del `ShopHeader` i dos
comentaris de color.

**Per això cada arreglo treu la duplicació en comptes de sincronitzar-la.** El
sitemap ara surt de `routing.pathnames`, l'`ink-faint` és un àlies i no una
còpia, i l'`og:image` no declara cap mida perquè el fitxer ja la té.

---

## Què s'ha arreglat

### Mòbil i marca

- **L'idioma actiu era invisible a `/botiga`.** `ShopHeader` pintava el
  selector amb el to fosc sobre `bg-ink`: `text-ink` sobre `bg-ink`, contrast
  **1:1**, a 320/360/375/390/414. És el mateix bug que `Header.tsx` ja havia
  arreglat amb `tone="light"`; aquí se'ls havia escapat. Ara 12,25:1.
- **La barra de `/botiga` sobreeixia 14px a 320** i el "FR" quedava tallat. La
  causa d'arrel: el `truncate` del text de tornada hi era des del principi i no
  s'havia activat MAI, perquè un flex item té `min-width: auto`. Faltava
  `min-w-0`. També `shrink-0` al grup dret perquè el selector no es pugui
  comprimir mai més.
- **El `theme-color` i el `manifest` s'havien quedat amb el blau vell** quan la
  paleta va passar a `#283649`. Només es nota en mòbil, que és on el navegador
  pinta la seva barra amb aquell color.
- **El manifest apuntava a `/icon.svg` i `/apple-icon.svg`**, esborrats a
  `c040b47`. 404 des de feia dos commits: qui instal·lés el web com a aplicació
  es quedava sense icona.
- **L'`apple-icon` torna a ser un quadrat opac.** iOS ja aplica la seva màscara;
  una icona prearrodonida es rodoneja dues vegades. El dibuix no s'ha tocat: 0
  de 30.860 píxels opacs canviats.

### Idiomes

- **`/serveis` es deixava segrestar per la cookie i pel navegador.** Amb
  `as-needed` i el català com a `defaultLocale`, les URLs catalanes no porten
  prefix i eren les úniques que la detecció es podia emportar. De les 24
  combinacions (3 URLs × 4 idiomes × amb i sense cookie) només **3** servien
  català. La cookie durava un any i la posava el nostre propi selector.
  Amb `localeDetection: false`: **24 de 24**.
- **`localeCookie: false`**, perquè la cookie només existeix per alimentar la
  detecció. Ull: la cookie l'escrivien DOS llocs amb condicions diferents — el
  middleware la lliga a `localeDetection`, el router de client no.

### SEO i catàleg

- **L'`og:image` mentia a les 146 fitxes.** Declarava 1200×630 o 1200×1200 i
  cap foto encaixava. `/catifes/adore` deia 1200×1200 per un fitxer de 231×335.
  S'ha tret la mida en comptes de corregir-la: és una pista opcional i les
  xarxes mesuren la imatge.
- **El sitemap es deixava `/concerta-cita`** — quatre URLs vives, enllaçades des
  de la capçalera i el peu, fora de l'índex. La llista ara es deriva.
- **Nou enllaços del `ShopHeader` feien 307** en es/en/fr per fer servir la clau
  interna de `pathnames` en comptes de `publicPath()`.
- **Els horaris de `/botigues` i `/contacte` estaven a 2,32:1 i 2,54:1.** Els
  dos grisos de text secundari s'han col·lapsat en un (`#4a5566`), perquè AA
  sobre fons clar no deixa recorregut per a dos grisos distingibles.

### Glam Velvet

Una carpeta amb fotos i mostres de color però sense catifa publicada. Resulta
que és **l'única entrada de tot el catàleg amb tres taules de preu per
referència**, i el model només sap un preu per mida. Entra limitada a la
referència 2025 amb els cinc preus derivats de la regla documentada, i s'ha
afegit també a la base de dades.

### Portada i marca (02/09)

- **El titular es parteix en titular i subtítol.** "Decoració tèxtil i protecció
  solar a mida" i "Instal·lat a casa teva." a part. L'anglès NO és una traducció
  del català: "textile decoration" era literal i el terme del sector és **soft
  furnishings**, que a més és el que la gent cerca. El castellà i el francès es
  queden com estaven — "decoración textil" sí que és el terme del sector
  espanyol, i "tissus d'ameublement" designaria el teixit, no el servei.
- **Les dues frases del text de productes van a fila separada.** Era una sola
  cadena i el salt queia per amplada: partia "Redecora casa / teva". Ara són
  dues claus, cadascuna en un `inline-block`.
- **Les icones s'inverteixen**: retall blau sobre tauler blanc, en comptes de
  blanc sobre blau. Mateix contrast, 12,25:1, perquè són els dos mateixos
  colors intercanviats. L'apple-icon segueix opaca de vora a vora.

---

## Els commits

| | |
|---|---|
| `a6fb237` | l'idioma actiu es veu a la botiga i els blaus tornen a lligar |
| `e547356` | la URL mana per damunt del navegador i de la cookie |
| `238b6b5` | fora la cookie NEXT_LOCALE, que ja no la llegia ningú |
| `818aa90` | la barra de dalt deixa de sobreeixir a 320px |
| `e9bf5da` | el manifest apunta a fitxers que existeixen i l'apple-icon torna a ser quadrada |
| `8ee1917` | dos comentaris que el canvi de paleta havia deixat mentint |
| `195eead` | les fitxes deixen de declarar una mida d'imatge que no és |
| `62d4473` | els dos grisos de text secundari es col·lapsen en un que passa AA |
| `7d42a93` | les rutes del sitemap es deriven de pathnames i /concerta-cita hi torna |
| `751f2ac` | els enllaços de la capçalera de botiga deixen de passar per una redirecció |
| `ee65f75` | els comptadors dels manifests de fotos deien qualsevol cosa |
| `e2ec1f6` | Glam Velvet entra al catàleg, limitada a la referència 2025 |
| `406c684` | Glam Velvet entra als manifests de fotos i ensenya les tres |
| `3566717` | el titular de la portada es parteix en titular i subtítol |
| `fc103e2` | les dues frases del text de productes van a fila separada |
| `d765173` | les icones s'inverteixen — retall blau sobre tauler blanc |

Tots desplegats i mesurats contra producció.

**Canvi a la base de dades** (01/09, fora de git): Glam Velvet a `web_products`
amb 5 variants i 3 imatges, i retirats els 8 `pvp_abans` placeholder. Vegeu la
nota de `scripts/gen-web-catalog-seed.mjs`.

---

## Què queda pendent

**Trobat i no arreglat, per ordre del que jo atacaria:**

1. **La branca `feat/botiga-web-module` de l'ERP, parada des del 09/07.** Té
   hub, llistat i editor de productes web amb el guard de `botiga_web.access`,
   però mai s'ha fusionat a master. I encara fusionada no resol crear productes
   nous: no hi ha cap `useCreateWebProduct`, només edició.
2. **La tipografia francesa pot deixar signes orfes.** El fitxer `fr.json` té
   **38 cadenes** amb espai NORMAL abans de `!`, `?`, `:` o `»`, i aquell espai
   és un punt de tall vàlid: el signe es pot quedar sol a la línia de sota. Es
   va veure a `HomeGrid.tagline` a 768px i allà s'ha arreglat amb `U+00A0`
   (mateixa amplada que l'espai normal amb la font Archivo, 11,89px). **Les
   altres 37 no s'han tocat.**
3. **L'orfe del titular a iOS < 17.5.** `text-balance` no hi arriba i l'última
   paraula queda sola al mig. Mesurat amb el text ANTERIOR donava `es`/`fr` a
   320px i `en` de 320 a 375; el copy ha canviat des de llavors i caldria
   tornar-ho a mesurar. Descartat conscientment; el fix seria un `@supports`.
4. **El favicon a 16px.** El retall fa 8 píxels d'ample i té 5 dents per vora:
   calen 10 mostres per dibuixar-ne 5, o sigui que no hi caben. Es veu net i
   contrasta 12,25:1, però el dentat no s'hi distingeix — a la pestanya és un
   rectangle. No és un error, és una decisió de disseny pendent. (Segueix sent
   cert amb les icones invertides: el que canvia és el color, no la mida.)
5. **El botó de WhatsApp a 1,98:1.** Blanc sobre el verd de la marca aliena. Jo
   no el tocaria.

---

## Trampes que m'han fet perdre temps

Si algú reprèn això amb les mateixes eines, que s'estalviï el que jo no:

- **El sentinella de desplegament ha de mesurar el COMPORTAMENT, no un proxy.**
  M'ha fallat tres vegades: buscant un hex que ja hi era al CSS; consultant
  `/apple-icon.png`, que va amb `cache-control: immutable` i em va servir la
  còpia vella de la CDN durant onze minuts; i buscant el hex d'un token dins de
  l'HTML quan viu al CSS extern i Tailwind l'emet com a `rgb(74 85 102)`.
- **El detector de contrast no sap veure `background-image` ni degradats.**
  Puja per la cadena fins al `body` i qualsevol text sobre foto li surt com a
  1:1. Per mesurar text sobre imatge: amagar el text, fotografiar el que hi ha
  a sota i mesurar-ho.
- **Buscar "Abans" o `line-through` per detectar rebaixes dona falsos positius.**
  El termini d'entrega diu "abans de tancar la comanda" i hi ha la clau i18n
  `"before":"abans"`. El senyal bo és el preu antic concret i `pvpAbans`.
- **`cmd | tee fitxer | head -N` trunca el fitxer** per SIGPIPE.
- **Parsejar SQL amb `(.*?);` talla el bloc** al primer punt i coma dins d'una
  cadena. Comptar per línia.
- **Comparar empremtes md5 entre Postgres i Python falla per col·lació**:
  `Ø067` s'ordena diferent. Cal `collate "C"` al costat SQL.
- **Provar un selector d'idioma amb un timeout fix** dona lectures desfasades
  una posició. Cal esperar que `document.documentElement.lang` canviï.
