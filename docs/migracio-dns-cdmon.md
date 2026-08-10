# Migració de DNS: cdmon → Vercel

Procediment per a apuntar `cortinatgesesteba.com` a la web nova de Vercel,
mantenint el correu i deixant una via de tornada.

**Panell:** cdmon (els nameservers de la zona són `ns1..ns3.cdmon.net`,
`ns4.cdmondns-01.org`, `ns5.cdmondns-01.com`).
**TTL de tots els registres:** 900 s (15 min). No cal abaixar-lo: ja permet
revertir en un quart d'hora.

---

## Estat de partida (verificat el 10/08/2026)

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
| `@` | TXT | `v=spf1 include:_spf.srv.cat include:_spf.odoo.com ~all` | SPF del correu |

**Registre que dona Vercel:** `A` / `@` / `216.198.79.1`

---

## Abans de començar

- [ ] El deploy de **producció** a Vercel està en verd i verificat
      (`X-Robots-Tag` absent, redireccions, canonicals en no-www).
- [ ] A Vercel, Settings → Domains, hi ha els dos dominis:
      `cortinatgesesteba.com` (Production) i `www.cortinatgesesteba.com`
      (308 cap a l'arrel). Sortiran com a *Invalid Configuration* fins que
      el DNS apunti: és normal.
- [ ] Fes una **captura de pantalla de la zona DNS sencera** al panell de
      cdmon. És la teva xarxa de seguretat real: si cal revertir, vols saber
      exactament com estava, no reconstruir-ho de memòria.
- [ ] Tria un moment de poc trànsit. La propagació és de ~15 min però pot
      trigar més en alguns operadors.

---

## Pas 0 — Blindar `ftp` i `cpanel` (FER-HO PRIMER)

`ftp` i `cpanel` són CNAME cap a l'apex. Si canvies l'apex sense tocar-los,
tots dos passaran a apuntar a Vercel i perdràs l'accés al servidor vell just
quan el pots necessitar més.

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
- Els **formularis** no registren cap lead: només obren WhatsApp o el client
  de correu. Vegeu `auditoria-contingut-2026-08-10.md`, §4.
