// Textos legals reals, copiats verbatim de cortinatgesesteba.com (català).
// Es serveixen en català a tots els idiomes (és la llengua de l'entitat).
// "EL TITULAR" = Cortinatges Esteba S.L.

export type LegalBlock = { type: "h" | "p"; text: string };
export type LegalDoc = { slug: string; title: string; blocks: LegalBlock[] };

const p = (text: string): LegalBlock => ({ type: "p", text });
const h = (text: string): LegalBlock => ({ type: "h", text });

export const AVIS_LEGAL: LegalDoc = {
  slug: "avis-legal",
  title: "Avís legal",
  blocks: [
    h("Propietat intel·lectual i industrial"),
    p("Els continguts d'aquest lloc, incloent-hi els textos, imatges i dissenys gràfics, pertanyen a EL TITULAR, o a tercers que han autoritzat el seu ús. EL TITULAR presenta aquests continguts amb finalitats d'informació i promoció. EL TITULAR autoritza la seva utilització exclusivament amb aquestes finalitats. Qualsevol utilització d'aquests dissenys, imatges o textos haurà de citar expressament la seva pertinença a EL TITULAR, qui es reserva el dret a iniciar les accions legals oportunes per reparar els danys i perjudicis causats per qualsevol acte que vulneri els seus drets de propietat intel·lectual o industrial."),
    h("Exclusió de responsabilitat"),
    p("EL TITULAR actua amb la màxima diligència possible perquè les dades i la informació que ofereix al seu lloc web estigui actualitzada en tot moment, si bé no garanteix ni es fa responsable de l'exactitud i actualització dels continguts del lloc web, reservant-se el dret a modificar aquests continguts en qualsevol moment. EL TITULAR tampoc serà responsable de la informació que es pot obtenir a través d'enllaços inclosos en el lloc web."),
    p("Les relacions comercials amb els clients es regiran per les condicions generals que, si escau, s'estableixin per EL TITULAR en un document específic a aquest efecte, o pels pactes concrets que es puguin acordar amb els clients."),
    h("Condicions d'ús"),
    p("L'ús d'aquest lloc web implica l'acceptació plena dels termes del present avís legal. Els possibles conflictes relatius a aquest web es regiran exclusivament pel dret de l'Estat Espanyol. Tota persona usuària del web, independentment de la jurisdicció territorial des de la qual es produeixi el seu accés, accepta el compliment i respecte d'aquestes clàusules amb renúncia expressa a qualsevol altre fur que pogués correspondre-li."),
  ],
};

export const PRIVACITAT: LegalDoc = {
  slug: "privacitat",
  title: "Política de protecció de dades",
  blocks: [
    p("EL TITULAR es compromet a protegir la privacitat dels usuaris que accedeixin a aquest web i/o qualsevol dels seus serveis. La utilització del web i/o de qualsevol dels serveis oferts per EL TITULAR implica l'acceptació per part de l'usuari de les disposicions contingudes en la present Política de Privacitat i que les seves dades personals siguin tractades segons s'hi estipula. Tot i que hi pugui haver enllaços del nostre web a d'altres webs, aquesta Política de Privacitat no s'aplica als webs d'altres companyies o organitzacions a les quals el web estigui redirigit."),
    h("Informació sobre el tractament de dades (Reglament (UE) 2016/679 i LO 3/2018)"),
    p("Responsable del tractament: EL TITULAR. Les nostres dades figuren a l'avís legal d'aquest web."),
    p("Finalitat del tractament: Oferir i gestionar els nostres productes i/o serveis."),
    p("Legitimació: Consentiment obtingut de l'interessat. Execució del contracte de serveis."),
    p("Destinataris: Les dades no seran comunicades a tercers, llevat que ho exigeixi una llei o sigui necessari per complir amb la finalitat del tractament."),
    p("Drets de les persones: Els interessats tenen dret a exercir els drets d'accés, rectificació, limitació de tractament, supressió, portabilitat i oposició, enviant la seva sol·licitud a la nostra adreça."),
    p("Termini de conservació de les dades: Mentre es mantingui la relació comercial o durant els anys necessaris per complir amb les obligacions legals."),
    p("Reclamació: Els interessats es poden dirigir a l'AEPD per presentar la reclamació que considerin oportuna."),
    h("Qüestions sobre privacitat"),
    p("En compliment del Reglament (UE) 2016/679 del Parlament Europeu i del Consell, de 27 d'abril de 2016 (RGPD) i la Llei Orgànica 3/2018, de 5 de desembre, de Protecció de Dades Personals i garantia dels drets digitals (LOPDGDD), li oferim informació sobre el tractament de les seves dades personals."),
    p("Amb quina finalitat tractem les seves dades personals? Tractem la informació que se'ns facilita per prestar i facturar els nostres serveis i productes. Si ens dóna el seu consentiment també podrem tractar les seves dades per enviar-li informació sobre les nostres activitats, serveis i productes."),
    p("Durant quant de temps conservarem les seves dades? Les dades personals proporcionades es conservaran mentre sigui usuari dels nostres serveis o en vulgui rebre informació, i després durant els terminis establerts per complir amb les nostres obligacions legals."),
    p("Quina és la legitimació per al tractament de les seves dades? La base legal per als tractaments de les seves dades són els consentiments que ens dóna."),
    p("A quins destinataris es comunicaran les seves dades? Les dades no seran comunicades a tercers, llevat que ho exigeixi una llei o sigui necessari per complir amb la finalitat del tractament."),
    p("Quins són els seus drets quan ens facilita les seves dades? Qualsevol persona té dret a obtenir confirmació sobre si estem tractant o no les seves dades personals. Les persones interessades tenen dret a accedir a les seves dades, a rectificar-les, a sol·licitar-ne la supressió, a la limitació del tractament, a oposar-s'hi i a la portabilitat de les seves dades. Finalment, tenen dret a presentar una reclamació davant l'Autoritat de Control competent."),
    p("Com pot exercir els seus drets? Enviant-nos un escrit adjuntant una còpia d'un document que l'identifiqui, a la nostra adreça física o a l'electrònica."),
    p("Quines mesures de seguretat apliquem? Apliquem les mesures de seguretat establertes a l'article 32 del RGPD, amb mecanismes que ens permeten garantir la confidencialitat, integritat, disponibilitat i resiliència permanent dels sistemes i serveis de tractament."),
  ],
};

export const COOKIES: LegalDoc = {
  slug: "cookies",
  title: "Política de cookies",
  blocks: [
    p("El nostre lloc web cortinatgesesteba.com utilitza una tecnologia anomenada 'cookie', amb la finalitat de poder obtenir informació sobre l'ús del lloc web, millorar l'experiència de l'usuari i garantir el seu correcte funcionament."),
    h("Definició de cookie"),
    p("Una 'cookie' és un petit fragment de text que els llocs web envien al navegador i que s'emmagatzema en el terminal de l'usuari (ordinador o dispositiu mòbil). Aquests arxius tenen la finalitat d'emmagatzemar dades que podran ser actualitzades i recuperades per l'entitat responsable de la seva instal·lació. Les cookies recullen informació sobre les preferències de l'usuari i, en general, faciliten l'ús del lloc web fent que el lloc sigui més útil al personalitzar el seu contingut."),
    h("Tipus de cookies"),
    p("Cookies tècniques: permeten a l'usuari la navegació a través de la pàgina web i la utilització de les diferents opcions o serveis que hi existeixen."),
    p("Cookies de personalització: permeten a l'usuari accedir al servei amb característiques predefinides, com l'idioma o el tipus de navegador."),
    p("Cookies d'anàlisi: permeten quantificar el nombre d'usuaris i realitzar l'anàlisi estadístic de la utilització que fan els usuaris del servei, per millorar l'oferta de productes o serveis."),
    h("Cookies utilitzades al nostre lloc web"),
    p("El nostre lloc web utilitza tant cookies pròpies, de caràcter tècnic i fonamentals per al funcionament de la web, com cookies de tercers de Google Inc. (Google Analytics) amb finalitats analítiques (__utma, __utmb, __utmc, __utmz, __utmt, __ga, __gat), de durada de sessió i persistent."),
    h("Consentiment i retirada"),
    p("En navegar i continuar al nostre lloc web l'usuari estarà consentint l'ús de les cookies. L'usuari podrà retirar en qualsevol moment el seu consentiment eliminant les cookies emmagatzemades en el seu equip mitjançant els ajustaments i configuracions del seu navegador d'Internet."),
  ],
};

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  "avis-legal": AVIS_LEGAL,
  privacitat: PRIVACITAT,
  cookies: COOKIES,
};
