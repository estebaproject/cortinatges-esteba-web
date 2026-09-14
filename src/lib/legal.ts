import { DADES_PENDENTS, dadesEmpresa } from "@/lib/empresa";

/**
 * TEXTOS LEGALS DEL WEB (avís legal, privacitat i cookies).
 *
 * Els enllaça el peu de les DUES bandes: el web informatiu i la botiga. O
 * sigui que han de cobrir també el que passa quan algú compra, perquè el peu
 * de la botiga hi porta i fins ara aquests textos només parlaven d'un web
 * informatiu.
 *
 * D'ON VENEN. Els originals es van copiar verbatim del WordPress antic. Es
 * conserva el fons i el to, i es corregeix el que no s'aguantava:
 *
 *   1. NO DEIEN QUI ERA L'EMPRESA. Tot el document parlava d'"EL TITULAR",
 *      i la política de privacitat remetia a l'avís legal per saber qui era
 *      —però a l'avís legal tampoc hi havia ni nom, ni NIF, ni domicili, ni
 *      correu. Rodó i buit. L'article 10 de la LSSI demana aquestes dades al
 *      lloc, així que ara hi ha un apartat d'identificació al capdamunt.
 *
 *   2. LA BASE LEGAL ERA FALSA. Deia que la legitimació per tractar les dades
 *      és "els consentiments que ens dóna". Per a una compra no ho és: és
 *      l'execució del contracte, i per a la factura, una obligació legal. Dir
 *      que tot va per consentiment implica que es pot retirar i que llavors
 *      s'ha de deixar de tractar, cosa que amb una comanda pel mig no es pot
 *      fer. Ara cada finalitat porta la seva base.
 *
 *   3. LA POLÍTICA DE COOKIES DESCRIVIA COOKIES QUE NO EXISTEIXEN. Declarava
 *      set cookies de Google Analytics (__utma, __utmb, __ga...) i el web no
 *      porta cap analítica: no hi ha ni gtag, ni dataLayer, ni cap script de
 *      mesura a tot el projecte. En canvi, no declarava les dues coses que sí
 *      que passen: la clau que desa la teva decisió i el mapa de Google. Ara
 *      diu el que hi ha, ni més ni menys.
 *
 *   4. DEIA QUE NAVEGAR JA ÉS CONSENTIR. "En navegar i continuar al nostre
 *      lloc web l'usuari estarà consentint l'ús de les cookies" — i el web
 *      ensenya un rètol amb Accepto i Rebutjo. Una de les dues coses sobrava,
 *      i la que sobra és la frase.
 *
 *   5. NO ES PODIA CANVIAR D'OPINIÓ. Deia que per retirar el consentiment
 *      s'esborressin les cookies del navegador, però la decisió no es desa en
 *      una cookie sinó al `localStorage`, que esborrar cookies no toca.
 *
 * I DESPRÉS, EL 14/09/2026, VA MARXAR EL RÈTOL SENCER. L'únic recurs de
 * tercers que carregava el web era el mapa de Google de les botigues, i es va
 * substituir per un mapa propi: primer dibuixat i, el mateix dia, un de
 * carreteres amb dades d'OpenStreetMap servides des del nostre domini
 * (src/components/StoresMapInteractiu.tsx). Sense
 * cookies ni continguts de fora, no hi ha res per a què demanar permís, i la
 * política de cookies ara ho diu així. SI ALGÚ AFEGEIX ANALÍTICA, UN VÍDEO
 * INCRUSTAT O UN PÍXEL, s'ha de tornar a posar el rètol i reescriure la
 * política ABANS de publicar-ho.
 *
 * També es va treure "Servidors a la Unió Europea" de Vercel: no estava
 * comprovat, i Vercel i Resend són dels Estats Units. Ara hi ha un apartat de
 * transferències internacionals en lloc d'una afirmació que no s'aguantava.
 *
 * LES DADES DE L'EMPRESA NO S'ESCRIUEN AQUÍ: són tokens `{{així}}` i surten
 * de src/lib/empresa.ts, el mateix lloc que alimenta els textos de la botiga.
 * El que encara no se sap es pinta marcat a la pàgina.
 *
 * IDIOMA. Es serveixen en català als quatre idiomes, com abans, i la pàgina
 * ho diu. Les URL sí que estan traduïdes (/aviso-legal, /legal-notice,
 * /mentions-legales), o sigui que /en/legal-notice es declara en anglès i
 * ensenya català: l'avís ho fa explícit mentre no es tradueixin.
 *
 * Format: el mateix markdown mínim que la botiga, pintat per
 * src/components/LegalMarkdown.tsx.
 */

export type LegalDoc = { slug: string; title: string; text: string };

const AVIS_LEGAL_TEXT = `
## Qui és el titular d'aquest web

- **Denominació social**: {{denominacio}}.
- **NIF**: {{nif}}.
- **Domicili social**: {{domicili}}.
- **Dades registrals**: {{registre}}.
- **Correu electrònic**: {{correu}}.
- **Telèfon**: {{telefon}}.
- **Lloc web**: cortinatgesesteba.com.

Aquestes dades es publiquen en compliment de l'article 10 de la Llei 34/2002, de serveis de la societat de la informació i de comerç electrònic (LSSI-CE). D'ara endavant, «l'empresa».

## Propietat intel·lectual i industrial

Els continguts d'aquest lloc, incloent-hi els textos, imatges i dissenys gràfics, pertanyen a l'empresa, o a tercers que n'han autoritzat l'ús. L'empresa presenta aquests continguts amb finalitats d'informació i promoció, i n'autoritza la utilització exclusivament amb aquestes finalitats.

Qualsevol utilització d'aquests dissenys, imatges o textos haurà de citar expressament que pertanyen a l'empresa, que es reserva el dret a iniciar les accions legals oportunes per reparar els danys i perjudicis causats per qualsevol acte que vulneri els seus drets de propietat intel·lectual o industrial.

## Exclusió de responsabilitat

L'empresa actua amb la màxima diligència possible perquè les dades i la informació que ofereix al seu lloc web estiguin actualitzades en tot moment, si bé no garanteix ni es fa responsable de l'exactitud i actualització dels continguts del lloc web, i es reserva el dret a modificar-los en qualsevol moment. L'empresa tampoc no serà responsable de la informació que es pugui obtenir a través d'enllaços inclosos en el lloc web.

## Compres a través d'aquest web

La venda en línia es fa a l'apartat **Esteba Online** d'aquest mateix domini i es regeix per les seves **condicions de venda** i per la **política d'enviaments i devolucions**, que són les que regulen la relació contractual amb la persona compradora. La resta del web és informativa: els pressupostos i les feines a mida es pacten fora de línia, amb visita i presa de mides.

## Condicions d'ús

L'ús d'aquest lloc web implica l'acceptació plena dels termes d'aquest avís legal. Els possibles conflictes relatius a aquest web es regiran exclusivament pel dret de l'Estat espanyol.

En les relacions amb persones consumidores, és competent el jutjat del domicili de la persona consumidora, tal com estableix la normativa de consum. Per a la resta de casos, tota persona usuària del web, independentment de la jurisdicció territorial des de la qual accedeixi, accepta el compliment i el respecte d'aquestes clàusules.
`;

const PRIVACITAT_TEXT = `
## Qui tracta les teves dades

- **Responsable del tractament**: {{denominacio}}, NIF {{nif}}.
- **Domicili**: {{domicili}}.
- **Correu de contacte**: {{correu}}.
- **Telèfon**: {{telefon}}.

No tenim delegat de protecció de dades: per a qualsevol qüestió sobre les teves dades, escriu-nos al correu de dalt.

## Quines dades tractem, per a què i amb quina base

| Què fas | Què en tractem | Per a què | Base legal | Quant de temps |
| --- | --- | --- | --- | --- |
| Ens escrius pel formulari de contacte o de pressupost | Nom, correu, telèfon i el que ens expliques | Respondre't i preparar el pressupost | La teva sol·licitud, com a pas previ a un contracte (art. 6.1.b RGPD) | Un any des de l'últim contacte, si no arriba a haver-hi encàrrec |
| Ens envies una candidatura | Nom, contacte i el currículum | Valorar-la per a les vacants | La teva sol·licitud (art. 6.1.b RGPD) | Un any, i després l'esborrem |
| Ens compres en línia | Nom, adreça d'enviament i facturació, correu, telèfon i el detall de la comanda | Gestionar la comanda, l'enviament, la factura i les devolucions | **Execució del contracte** (art. 6.1.b RGPD) | Mentre duri la relació; les factures, els anys que marca la normativa fiscal i comptable |
| Ens compres en línia | Les dades de la factura | Complir les obligacions fiscals i comptables | **Obligació legal** (art. 6.1.c RGPD) | El que marqui cada norma |
| Ens dones permís per escriure't | Correu | Enviar-te informació de la casa | **El teu consentiment** (art. 6.1.a RGPD), que pots retirar quan vulguis | Fins que el retiris |

**No prenem cap decisió automatitzada** sobre tu ni fem perfils.

**Navegar pel web no ens dona cap dada teva.** No fem servir analítica, ni cookies, ni continguts de tercers que et segueixin. Ho expliquem a la política de cookies.

## Les dades de la teva targeta no passen per nosaltres

Els pagaments de la botiga en línia es fan a la passarel·la **Redsys**, del nostre banc. **No veiem ni desem el número de la teva targeta** en cap moment: els tracta directament la passarel·la, sota l'estàndard PCI DSS. Nosaltres només rebem el resultat de l'operació.

## Amb qui les compartim

No venem les teves dades ni les cedim a ningú per fer-hi negoci. Només hi accedeixen les empreses que ens presten un servei i que tenen contracte d'encarregat del tractament:

- **Vercel Inc.** — allotja el web.
- **Resend** — envia els correus dels formularis.
- **Redsys** — tramita els pagaments de la botiga.
- L'**empresa de transport** que dugui la comanda, a qui donem el nom, l'adreça i el telèfon perquè te la pugui lliurar.

A banda d'això, les dades es comuniquen quan ho exigeix una llei, per exemple a l'Administració tributària.

**Transferències fora de la Unió Europea.** Vercel i Resend són empreses dels Estats Units, i per això algunes dades poden sortir de la Unió Europea. Quan passa, es fa amb les garanties que demana el RGPD: el Marc de privacitat de dades UE-EUA o les clàusules contractuals tipus aprovades per la Comissió Europea.

**Si cliques un pin del mapa de botigues**, s'obre Google Maps. Això ja és un web de Google, i el que hi facis ho tracta Google segons la seva pròpia política, no nosaltres.

## Quins drets tens i com els fas servir

Tens dret a **accedir** a les teves dades, a **rectificar-les**, a demanar-ne la **supressió**, a la **limitació** del tractament, a **oposar-t'hi**, a la **portabilitat** i a **retirar el consentiment** que ens hagis donat, sense que això afecti el que s'hagi fet abans de retirar-lo.

Per exercir-los, escriu-nos a {{correu}} o al domicili de dalt, amb una còpia d'un document que t'identifiqui. Et respondrem en el termini d'un mes.

Si creus que no t'hem atès bé, pots reclamar davant l'**Agència Espanyola de Protecció de Dades** (aepd.es), o davant l'**Autoritat Catalana de Protecció de Dades** (apdcat.gencat.cat) si el tractament és de l'àmbit català.

## Com les protegim

Apliquem les mesures de seguretat de l'article 32 del RGPD, amb mecanismes que ens permeten garantir la confidencialitat, la integritat, la disponibilitat i la resiliència permanent dels sistemes i serveis de tractament. El web es serveix xifrat (HTTPS) i l'accés a les dades està limitat a qui les necessita per fer la seva feina.

## Menors

Aquest web no s'adreça a menors de 14 anys i no els demanem dades. Si ens n'arriben per error, les esborrem.

## Canvis

Si canviem la manera de tractar les dades, actualitzarem aquesta política i en canviarem la data. Si el canvi és rellevant, t'ho farem saber.
`;

const COOKIES_TEXT = `
## Què és una cookie

Una «cookie» és un petit fragment de text que els llocs web envien al navegador i que es desa al teu aparell. Serveix per recordar coses entre una visita i la següent: què has triat, si has iniciat sessió, quin idioma vols.

En aquesta política també expliquem el **magatzem local** (*localStorage*), que no és ben bé una cookie —no viatja a cap servidor— però desa informació al teu navegador igual, i per això te'l diem.

## Què fa servir aquest web, exactament

**Cap cookie.** Ni nostra ni de ningú altre. L'única cosa que el web desa al teu navegador és el cistell de la botiga en línia, i només si hi afegeixes algun producte:

| Nom | Tipus | Qui la posa | Per a què | Quant dura |
| --- | --- | --- | --- | --- |
| \`esteba-online-cistell-v1\` | Magatzem local | Nosaltres | Recordar què tens al cistell si tanques la pàgina i hi tornes | Fins que buidis el cistell o esborris les dades del lloc |

Aquesta dada **no ens arriba**: es queda al teu aparell fins que fas la comanda. I no necessita el teu permís, perquè és imprescindible per al servei que tu mateix demanes en afegir un producte al cistell (article 22.2 de la LSSI).

**No tenim analítica.** Ni Google Analytics, ni cap altra: aquest web no mesura la teva navegació, no compta visites i no té cap script de mesura instal·lat.

**No tenim publicitat, ni píxels de xarxes socials, ni continguts incrustats de tercers.** Els enllaços a Instagram i Facebook del peu són enllaços normals: no carreguen res d'ells fins que els cliques.

## El mapa de les botigues

El mapa de les pàgines de botigues i de contacte **no és un mapa de Google incrustat**. Fa servir dades d'**OpenStreetMap** que tenim guardades al nostre propi servidor, i per això mirar-lo, moure'l o fer-hi zoom no fa cap petició a ningú de fora ni desa res al teu navegador.

Cada pin és un enllaç: si el cliques, surts cap a **Google Maps** per veure com arribar-hi. A partir d'aquí ja ets al web de Google, i el que hi passi ho regeix la seva política de cookies i de privacitat, no aquesta.

## Per què no et demanem permís

Perquè no hi ha res per a què demanar-lo. El permís només cal per a cookies o eines que no són imprescindibles —analítica, publicitat, continguts de tercers—, i aquest web no en fa servir cap.

**Si algun dia n'afegim alguna, et demanarem permís abans que es carregui** i actualitzarem aquesta pàgina.

## Com les controles des del navegador

Tots els navegadors deixen veure, bloquejar i esborrar el que un lloc desa al teu aparell. Si ho bloqueges tot, el web continua funcionant igual; l'únic que notaràs és que la botiga en línia no recordarà el cistell entre una visita i la següent.

- Chrome: Configuració → Privadesa i seguretat → Cookies.
- Firefox: Configuració → Privadesa i seguretat.
- Safari: Preferències → Privadesa.
- Edge: Configuració → Cookies i permisos del lloc.

## Qui respon de tot això

El responsable és {{denominacio}}, NIF {{nif}}. Per a qualsevol dubte, escriu a {{correu}}. El tractament de les dades personals l'expliquem a la **política de protecció de dades**.
`;

export const AVIS_LEGAL: LegalDoc = {
  slug: "avis-legal",
  title: "Avís legal",
  text: AVIS_LEGAL_TEXT,
};

export const PRIVACITAT: LegalDoc = {
  slug: "privacitat",
  title: "Política de protecció de dades",
  text: PRIVACITAT_TEXT,
};

export const COOKIES: LegalDoc = {
  slug: "cookies",
  title: "Política de cookies",
  text: COOKIES_TEXT,
};

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  "avis-legal": AVIS_LEGAL,
  privacitat: PRIVACITAT,
  cookies: COOKIES,
};

/** Data de l'última revisió d'aquests textos. */
export const LEGAL_UPDATED = "2026-09-12";

/** El text amb les dades de l'empresa ja posades. */
export function legalDocText(doc: LegalDoc): string {
  return dadesEmpresa(doc.text);
}

/** Queden dades de l'empresa per omplir? Ho fa servir la pàgina per avisar. */
export const LEGAL_DADES_PENDENTS = DADES_PENDENTS;
