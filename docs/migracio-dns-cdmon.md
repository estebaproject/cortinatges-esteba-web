# Migració de DNS: cdmon → Vercel

Procediment per a apuntar `cortinatgesesteba.com` a la web nova de Vercel,
mantenint el correu i deixant una via de tornada.

**Panell:** cdmon (els nameservers de la zona són `ns1..ns3.cdmon.net`,
`ns4.cdmondns-01.org`, `ns5.cdmondns-01.com`).
**TTL de tots els registres:** 900 s (15 min). No cal abaixar-lo: ja permet
revertir en un quart d'hora.

---

## Estat de partida (reverificat el 15/08/2026)

> Tota la taula de sota s'ha tornat a comprovar amb `dig` el 15/08/2026 i
> **no ha canviat res** respecte del 10/08. El comodí hi segueix, el correu
> també, i l'apex encara apunta al WordPress.

| Registre | Tipus | Valor | Comentari |
|---|---|---|---|
| `@` | A | `185.42.104.42` | Servidor web de cdmon (WordPress) |
| `www` | CNAME | `cortinatgesesteba.com.` | **Segueix l'apex sol** |
| `@` | MX | `10 mail.cortinatgesesteba.com.` | Correu |
| `mail` | A | `185.22.201.59` | **Registre propi**, independent de l'apex |
| `webmail` | A | `185.22.201.59` | Registre propi |
| `autodiscover` | A | `185.42.104.42` | Registre propi |
| `ftp` | CNAME | `cortinatgesesteba.com.` | ⚠️ Segueix l'apex |
| `cpanel` | CNAME | `cortinatgesesteba.com.` | ⚠️ Segueix l'apex |
| `@` | TXT | `v=spf1 include:_spf.srv.cat include:_spf.odoo.com ~all` | SPF del correu. Hi ha **13 registres TXT** a l'apex; els altres 12 són tokens de verificació. Comprovat que només UN porta `v=spf1` i que va en una sola cadena, sense trossejar |
| `_dmarc` | TXT | `v=DMARC1; p=quarantine; aspf=s; adkim=r` | ⚠️ Vegeu la nota |
| `*` | CNAME | `cortinatgesesteba.com.` | ⚠️ **Comodí**, vegeu avall |

> **Nota sobre el DMARC.** La política és `p=quarantine` amb alineació SPF
> **estricta** (`aspf=s`). Vol dir que qualsevol correu que no alineï
> exactament el domini no rebota: **va a la carpeta de spam en silenci**. És
> el mode de fallada més difícil de detectar. Si es toca res d'enviament de
> correu, cal provar-ho enviant de veritat, no donar-ho per bo.

**Registre que dona Vercel:** `A` / `@` / `216.198.79.1`

> **El WordPress d'avui redirigeix l'arrel a `/ca/`.** `https://cortinatgesesteba.com/`
> fa un 302 cap a `https://cortinatgesesteba.com/ca/`. La web nova serveix el
> català a l'arrel, sense prefix, i `/ca/` hi entra per redirecció (`/ca/` →
> `/ca` → `/`, acabant en 200). O sigui que el dia del canvi la portada deixa
> de fer aquell salt. Comprovat: cap de les 60 URLs del sitemap del WordPress
> es perd.

---

## Abans de començar

- [ ] El deploy de **producció** a Vercel està en verd i verificat
      (`X-Robots-Tag` absent, redireccions, canonicals en no-www).
- [x] A Vercel, Settings → Domains, hi ha els dos dominis:
      `cortinatgesesteba.com` (Production) i `www.cortinatgesesteba.com`
      (308 cap a l'arrel). Sortiran com a *Invalid Configuration* fins que
      el DNS apunti: és normal.
      **Verificat el 15/08/2026 sense tocar el DNS**, demanant a la IP de
      Vercel amb la capçalera `Host` de cada domini:
      ```bash
      curl -sI -H "Host: cortinatgesesteba.com"     http://216.198.79.1/   # 200
      curl -sI -H "Host: www.cortinatgesesteba.com" http://216.198.79.1/   # 308 → https://cortinatgesesteba.com/
      curl -sI -H "Host: inventat.com"              http://216.198.79.1/   # 404 (control)
      ```
      Va per HTTP a propòsit: per HTTPS el certificat encara no existeix i
      la connexió falla abans de respondre. El 404 del domini inventat és el
      control que demostra que la prova distingeix de veritat.
- [ ] Fes una **captura de pantalla de la zona DNS sencera** al panell de
      cdmon. És la teva xarxa de seguretat real: si cal revertir, vols saber
      exactament com estava, no reconstruir-ho de memòria.
- [ ] Tria un moment de poc trànsit. La propagació és de ~15 min però pot
      trigar més en alguns operadors.

---

## ⚠️ La zona té un COMODÍ

Verificat: existeix `*.cortinatgesesteba.com` → `cortinatgesesteba.com`.
Qualsevol subdomini que no tingui registre propi **resol cap a l'apex**:

```bash
dig +short CNAME qwerty-test-9876.cortinatgesesteba.com
# → cortinatgesesteba.com.
```

Dues conseqüències que cal tenir al cap:

1. **En canviar l'A de l'apex, TOTS els subdominis sense registre propi
   passaran a apuntar a Vercel** i respondran un 404 del web nou. No només
   `ftp` i `cpanel`: qualsevol.
2. Els que SÍ tenen registre propi (`mail`, `webmail`, `autodiscover`) no
   s'hi veuen afectats. Per això el correu està a salvo.

Regla de DNS que cal recordar (RFC 4592): **el comodí deixa d'aplicar-se a un
nom en el moment que aquest nom té QUALSEVOL registre propi.** Per tant, la
manera de blindar un subdomini és crear-li registres explícits.

---

## Pas 0 — Blindar `ftp` i `cpanel` (FER-HO PRIMER)

`ftp` i `cpanel` no tenen registre propi: resolen per comodí cap a l'apex. Si
canvies l'apex sense tocar-los, tots dos passaran a apuntar a Vercel i perdràs
l'accés al servidor vell just quan el pots necessitar més.

**Canvia'ls de CNAME a registre A abans de tocar res més:**

| Registre | Tipus | Valor |
|---|---|---|
| `ftp` | A | `185.42.104.42` |
| `cpanel` | A | `185.42.104.42` |

Esperar 15 minuts i comprovar que ja no són CNAME:

```bash
dig +short CNAME ftp.cortinatgesesteba.com     # ha de sortir BUIT
dig +short A     ftp.cortinatgesesteba.com     # 185.42.104.42
dig +short CNAME cpanel.cortinatgesesteba.com  # ha de sortir BUIT
dig +short A     cpanel.cortinatgesesteba.com  # 185.42.104.42
```

---

## Pas 0 bis — Registres de Resend (formularis) ✅ JA FET

> **Aquest pas ja està fet i verificat el 15/08/2026.** Es deixa documentat pel
> valor de saber què hi ha a la zona i per si algun dia cal refer-ho.

**És INDEPENDENT del canvi de l'apex.** Són registres a `send.`, i el canvi de
l'apex és un registre `A` a `@`. Ni el tipus ni el nom coincideixen, o sigui
que el canvi de DNS del Pas 1 no els toca.

Valors que hi ha ARA a la zona, comprovats amb `dig`:

| Registre | Tipus | Nom | Valor verificat |
|---|---|---|---|
| Rebots | MX | `send` | `10 feedback-smtp.eu-west-1.amazonses.com.` ✅ |
| SPF | TXT | `send` | `v=spf1 include:amazonses.com ~all` ✅ |
| DKIM | TXT | `resend._domainkey.send` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDq9Dg…` ✅ |

Les tres variables d'entorn també hi són (Vercel → Production): `RESEND_API_KEY`,
`LEAD_TO_EMAIL` i `LEAD_FROM_EMAIL`. I `LEAD_DEBUG` **ja s'ha esborrat**, que
era el que quedava pendent.

**Per què a un subdomini i no a l'arrel:** així el SPF del domini principal
(`_spf.srv.cat` i `_spf.odoo.com`) NO es toca. Només pot haver-hi un SPF per
nom, i aquests són noms diferents.

**Compte amb el comodí.** `send.` avui resol per comodí cap a l'apex. En
crear-hi registres explícits el comodí deixa d'aplicar-s'hi (RFC 4592), però
per això cal crear-los TOTS: si en falta un, aquell tipus quedarà sense
resposta en comptes d'heretar res.

**I compte amb el DMARC.** La política és `p=quarantine` amb `aspf=s`. Amb el
subdomini d'enviament l'alineació quadra, però si alguna cosa falla el correu
**no rebota: va a spam en silenci**. Per tant, en acabar:

```bash
# comprovar que els registres hi són
dig +short MX  send.cortinatgesesteba.com
dig +short TXT send.cortinatgesesteba.com
dig +short TXT resend._domainkey.send.cortinatgesesteba.com
```

I sobretot: **enviar un formulari de debò i comprovar que arriba a la safata
d'entrada, no a la de spam**. Que l'API respongui 200 no vol dir que hagi
arribat.

Falta també definir a Vercel (entorn Production): `RESEND_API_KEY` (secreta),
`LEAD_TO_EMAIL=info@cortinatgesesteba.com` i
`LEAD_FROM_EMAIL=web@send.cortinatgesesteba.com`.

**El `from` ha de ser del domini VERIFICAT.** Si a Resend s'ha verificat
`send.cortinatgesesteba.com`, el remitent ha de ser `algú@send.cortinatgesesteba.com`.
Amb `web@cortinatgesesteba.com` (sense el `send.`) Resend rebutja l'enviament.

### Si el formulari falla: com diagnosticar-ho

Els codis ja separen els dos casos:

| Codi | Què vol dir |
|---|---|
| **500** | Falta configuració (alguna de les tres variables no arriba) |
| **502** | Les variables hi són; **Resend rebutja l'enviament** |

Per a veure el motiu exacte sense entrar als logs, definiu `LEAD_DEBUG=1` a
Production (no la marqueu com a Sensitive: és un interruptor) i llanceu:

```bash
curl -s -X POST https://cortinatgesesteba.com/api/lead \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://cortinatgesesteba.com' \
  -d '{"type":"budget","nom":"Prova","telefon":"972203423",
       "email":"p@example.com","producte":"tendals","consent":true,
       "renderedAt":'"$(( $(date +%s) * 1000 - 9000 ))"'}'
```

La resposta portarà `detail` amb el missatge de Resend, i el `from`/`to` en
joc. **Esborreu `LEAD_DEBUG` quan acabeu.**

> ⚠️ **Parany:** canviar una variable d'entorn exigeix un desplegament nou.
> Si es fa *Redeploy* sobre un desplegament ANTERIOR, es promociona aquell
> codi antic. Cal redesplegar l'últim commit, no un de vell.

---

## Pas 1 — Apuntar el domini a Vercel

Un sol canvi:

| Registre | Tipus | Valor vell | Valor nou |
|---|---|---|---|
| `@` | A | `185.42.104.42` | **`216.198.79.1`** |

`www` **no s'ha de tocar**: és un CNAME a l'apex i hi anirà darrere sol. El
redirect 308 de `www` cap a l'arrel el fa Vercel.

---

## El que NO es toca, en cap cas

Aquests registres no tenen res a veure amb la web. Tocar-los és l'única
manera de trencar el correu:

- **`MX`** → `10 mail.cortinatgesesteba.com.`
- **`TXT` / SPF** → `v=spf1 include:_spf.srv.cat include:_spf.odoo.com ~all`
- **`mail`** (A `185.22.201.59`)
- **`webmail`** (A `185.22.201.59`)
- **`autodiscover`** (A `185.42.104.42`)
- Qualsevol **DKIM** o **DMARC** que hi hagi a la zona.

El correu està a salvo perquè el MX apunta a `mail.`, que té **A pròpia** i
no depèn de l'apex. Canviar l'A del `@` no l'afecta. Verificat.

---

## Pas 2 — Verificació (15–30 min després)

```bash
# 1) El domini ja resol a Vercel
dig +short A cortinatgesesteba.com          # 216.198.79.1

# 2) www segueix l'apex i redirigeix
dig +short www.cortinatgesesteba.com
curl -sI https://www.cortinatgesesteba.com/ | rg -i "^(HTTP|location)"
#    → 308 cap a https://cortinatgesesteba.com/

# 3) EL CRÍTIC: en producció NO hi ha d'haver noindex
curl -sI https://cortinatgesesteba.com/ | rg -i "x-robots-tag"
#    → NO ha de sortir res. Si surt, ATURA'T i no continuïs.

# 4) La portada i un parell de rutes traduïdes
curl -s -o /dev/null -w "%{http_code}\n" https://cortinatgesesteba.com/
curl -s -o /dev/null -w "%{http_code}\n" https://cortinatgesesteba.com/es/servicios
curl -s -o /dev/null -w "%{http_code}\n" https://cortinatgesesteba.com/en/traditional-curtain

# 5) Una redirecció del WordPress vell (ha d'acabar en 200)
curl -sIL https://cortinatgesesteba.com/ca/serveis/ | rg -i "^HTTP"

# 5 bis) O totes de cop, contra el sitemap del WordPress. Aquesta comprovació
#        ja s'ha passat el 15/08 contra el desplegament de Vercel: les 60 URLs
#        del sitemap acaben en 200, cap perduda. Val la pena repetir-la un cop
#        el domini ja apunti a Vercel.
curl -s https://cortinatgesesteba.com/page-sitemap.xml > /tmp/wpsm.xml
rg -o '<loc>[^<]*</loc>' /tmp/wpsm.xml | sd '</?loc>' '' | while read -r u; do
  printf '%s %s\n' "$(curl -sIL -o /dev/null -w '%{http_code}' "$u")" "$u"
done | rg -v '^200 ' || echo "totes en 200"

# 6) Canonical i sitemap en no-www
curl -s https://cortinatgesesteba.com/ | rg -o '<link rel="canonical"[^>]*>'
curl -s https://cortinatgesesteba.com/robots.txt | rg -i "sitemap|host"

# 7) EL CORREU: que el MX no s'hagi mogut
dig +short MX cortinatgesesteba.com         # 10 mail.cortinatgesesteba.com.
dig +short A  mail.cortinatgesesteba.com    # 185.22.201.59
```

I una prova que no es pot fer amb `curl`: **envia't un correu a tu mateix**
a `info@cortinatgesesteba.com` i comprova que arriba.

---

## Com revertir si algo falla

La tornada és **un sol canvi**, i amb TTL de 900 s està desfet en 15 minuts:

| Registre | Tipus | Valor |
|---|---|---|
| `@` | A | `185.42.104.42` |

Amb això el WordPress torna a servir com si res. `www` hi torna darrere sol.

Els registres A de `ftp` i `cpanel` del Pas 0 es poden deixar com estan:
apunten al mateix lloc que apuntaven abans com a CNAME, així que no molesten
ni en el món nou ni en el vell.

**No cal tocar res del correu per a revertir**, perquè no s'ha tocat res del
correu per a migrar.

---

## Després, quan estigui estable

- [ ] Google Search Console: donar d'alta la propietat de
      `https://cortinatgesesteba.com` (no-www, que és la forma canònica) i
      pujar-hi `https://cortinatgesesteba.com/sitemap.xml`.
- [ ] Demanar-hi la indexació de la portada.
- [ ] Vigilar l'informe de cobertura els primers dies: les 34 URLs velles del
      WordPress han de sortir com a redirigides, no com a error.
- [ ] Donar de baixa el WordPress **només** quan la indexació estigui
      consolidada. Mentrestant, el servidor vell no fa cap mal on és, i
      `ftp`/`cpanel` hi segueixen donant accés.

---

## Pendents que no bloquegen el DNS

- La pàgina de categoria de **venecianes**: fins que hi sigui, les 4 URLs
  velles fan una redirecció **temporal (307)** cap a la fitxa d'alumini.
  Vegeu el bloc marcat `⚠️ TEMPORAL` a `next.config.ts`.
- Les **fotos del WordPress** pendents de revisar a
  `~/Desktop/fotos-wordpress-per-revisar/`.
- Els **formularis** SÍ que envien: van per servidor (`/api/lead` → Resend →
  `info@`), amb WhatsApp com a botó secundari. El que NO fan és **desar** el
  lead enlloc: si el correu es perd, el lead es perd. No hi ha ni històric ni
  mètriques. Això no bloqueja el DNS, però val la pena posar-hi persistència
  abans no entri volum de veritat.

- Les **fotos de ContentRows** a la portada es queden curtes de resolució en
  pantalles retina: el forat demana 1136px d'ample i `tradicional_8.jpg` en té
  768 i `img_descans.webp` 726. La primera, a més, és vertical (768x1024) i
  perd el 44% en retallar-se a 4/3. `roba_de_casa.jpg` (1038px) va bé. Es
  resol amb fotos noves, no amb codi.
