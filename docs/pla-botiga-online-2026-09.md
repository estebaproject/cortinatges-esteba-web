# Esteba Online — Proyecto de tienda online

**Fecha:** 11/09/2026
**Estado:** documento de proyecto. Base para construir. No se ha tocado código.
**Dominio:** `cortinatgesesteba.com` es la web informativa de servicios y sigue
siendo la principal. La tienda es una sección subordinada bajo `/online`.

---

## 1. Objetivo y principios

Vender alfombras y mobiliario online, desde el mismo dominio que la web de
servicios, con cobro por el TPV virtual del banco (Redsys), y sin que la tienda
sea una puerta al programa interno de la empresa.

Cinco principios que gobiernan cada decisión de este documento:

1. **El ERP es la única fuente de verdad.** Los productos se crean y publican
   en el ERP. La tienda recibe una copia publicada; nunca escribe en el ERP.
2. **La tienda no conoce el ERP.** Tiene su propia base de datos. Aunque la
   tienda se comprometa, no hay camino hacia costes, márgenes, clientes,
   facturas o nóminas.
3. **El precio lo decide el servidor.** El navegador propone; la base de datos
   de la tienda recalcula. Un pedido con un precio manipulado es imposible.
4. **Un pedido está pagado cuando lo dice Redsys**, por notificación servidor a
   servidor con firma verificada. Nunca por la vuelta del navegador.
5. **Todo se puede apagar con un interruptor** y desplegar apagado.

---

## 2. Arquitectura

```
                 ┌──────────────────────────────────────────────┐
                 │  ERP (Supabase proyecto ERP + app React)     │
                 │  · catálogo maestro, costes, márgenes         │
                 │  · módulo "Botiga web": editar y PUBLICAR     │
                 └──────────────┬───────────────────▲───────────┘
                     publica    │                   │ recoge pedidos pagados
                 (Edge Function │ clave de servicio │ cada 5 min)
                  del ERP)      ▼                   │
                 ┌──────────────────────────────────┴───────────┐
                 │  TIENDA (Supabase proyecto esteba-online)    │
                 │  · productes, variants, colors, imatges (PVP)│
                 │  · comandes, comandes_linies, consentiments  │
                 │  · RPC: crear_comanda, marcar_pagada, per_token│
                 │  · Storage: fotos de producto                │
                 └──────────────▲───────────────────────────────┘
                                │ solo desde servidor (Server Components,
                                │ Server Actions, route handlers)
┌───────────────────────────────┴──────────────────────────────┐
│  WEB (Next.js 15 en Vercel, un solo despliegue)               │
│  /            web informativa (sin cambios)                   │
│  /online      tienda: catálogo, carrito, checkout, legales    │
│  /api/online/redsys/notify   notificación de pago             │
│  /api/online/revalidate      invalidación de caché (secreto)  │
└──────┬───────────────────────────────────────────┬───────────┘
       │ formulario firmado                        │ email transaccional
       ▼                                           ▼
   Redsys (TPV virtual del banco, Redirección)   Resend
```

La dirección de confianza es una sola: **el ERP conoce la tienda; la tienda no
conoce el ERP**. La clave de servicio del proyecto de la tienda vive en los
secretos del ERP. Ninguna clave del ERP vive en la tienda ni en la web.

Piezas y su papel:

| Pieza | Papel | Ya existe |
|---|---|---|
| Web Next.js | Web informativa + sección `/online` | Sí, la web informativa está en producción |
| Proyecto Supabase `esteba-online` | Base de datos y Storage de la tienda | No, se crea en F0 |
| Función de publicación en el ERP | Copia productos publicados a la tienda | No |
| Función de recogida en el ERP | Trae pedidos pagados al ERP | No |
| Módulo "Botiga web" del ERP | Editar y publicar productos | Parcial: hub, listado y editor en una rama sin fusionar; falta "crear" |
| Redsys | Cobro con tarjeta y Bizum | TPV virtual ya contratado |
| Resend | Emails de confirmación y envío | Ya en uso en la web |

---

## 3. Experiencia del usuario

### 3.1 URLs

- Segmento `/online`, invariable en los cuatro idiomas, con el prefijo de
  idioma delante como el resto de la web: `/online`, `/es/online`,
  `/en/online`, `/fr/online`.
- Familias y fichas traducidas con `pathnames`, como las páginas de servicios:
  `/online/catifes/adore`, `/es/online/alfombras/adore`, `/en/online/rugs/adore`.
- Mapa de rutas de la tienda:

| Ruta | Contenido | Indexable |
|---|---|---|
| `/online` | Portada: familias, destacados, promesa de servicio | Sí |
| `/online/{familia}` | Listado con filtros (familia, tamaño, color, precio) | Sí |
| `/online/{familia}/{slug}` | Ficha con selector de variante y compra | Sí |
| `/online/cerca` | Buscador por nombre y familia | No |
| `/online/cistell` | Carrito | No |
| `/online/checkout` | Datos, envío, consentimientos, botón de pago | No |
| `/online/comanda/{token}` | Confirmación del pedido (OK, KO, pendiente) | No |
| `/online/condicions` | Condiciones de venta | Sí |
| `/online/enviaments-i-devolucions` | Envíos, plazos, desistimiento, formulario | Sí |

### 3.2 Cómo se llega a la tienda y cómo se vuelve

Entradas desde la web informativa, por orden de peso:

1. **Botón "Esteba Online" en la cabecera**, a la derecha, junto a "Demana
   pressupost". En móvil, última entrada del menú. En todas las páginas.
2. **Una franja propia en la portada**, entre las colecciones y la banda de
   oficio: titular, tres o cuatro productos destacados leídos de la tienda y un
   solo botón "Entra a la tienda". Es el único lugar de la web informativa
   donde se ve producto con precio.
3. **Enlace en el pie**, en la columna de navegación.
4. **Enlaces contextuales** solo donde encajan: moquetas → alfombras online;
   tapicería → mobiliario. Cortinas, toldos y pérgolas no enlazan a la tienda;
   su camino es el presupuesto.
5. **Google**, que a medio plazo será la entrada principal: las fichas se
   indexan con datos de producto.

Vueltas desde la tienda:

- El logotipo de la cabecera de tienda vuelve a la portada informativa; un
  enlace de texto "Serveis a mida" lleva a `/serveis`.
- El pie de tienda repite tiendas físicas, contacto y WhatsApp, más los legales
  de venta.
- En las fichas, un aviso discreto hacia el presupuesto de cortinas, toldos y
  tapicería.

Reglas para que los dos mensajes no se mezclen:

- La web informativa nunca muestra el carrito ni su contador.
- La tienda nunca muestra "Demana pressupost" en la cabecera; su llamada
  principal es añadir al carrito.
- El selector de idioma conserva la sección: cambiar de idioma dentro de
  `/online` te deja dentro de `/online`.
- El carrito persiste en el navegador aunque se salga a la web informativa.

### 3.3 Identidad

Misma marca, otra tienda. Mismos tokens de color y tipografía que la web
informativa; cabecera propia (familias, buscador, carrito, enlace de vuelta),
pie propio, nombre **Esteba Online** y título de pestaña "… | Esteba Online".
El diseño de la tienda se hace con el lenguaje visual de la web informativa
(retícula, espaciado, mayúsculas con tracking), no con el de un marketplace.

---

## 4. Modelo de datos de la tienda (proyecto `esteba-online`)

Todas las tablas se crean con RLS activado y **`REVOKE ALL FROM anon`
explícito en la misma migración**. `anon` no lee ninguna tabla directamente:
solo ejecuta las RPC del apartado 4.3. No existe ninguna columna de coste ni
de margen en esta base: no es que se oculten, es que no están.

### 4.1 Catálogo

```
productes
  id uuid pk · erp_id uuid unique (id en el ERP, trazabilidad)
  tipus text ('catifa'|'moble'|'manta') · slug text · unique(tipus, slug)
  nom jsonb {ca,es,en,fr} · descripcio jsonb · familia text · marca text
  eix_variant text ('mida'|'color'|'cap')
  pvp_desde numeric(10,2) · per_encarrec bool · termini_dies int
  material jsonb · dimensions text · seo jsonb
  estat text ('published'|'archived') · ordre int
  publicat_at timestamptz · updated_at timestamptz

productes_variants
  id uuid pk · producte_id fk · variant_key text · unique(producte_id, variant_key)
  etiqueta text · ample_cm numeric · alt_cm numeric
  pvp numeric(10,2) not null · pvp_abans numeric(10,2) null
  disponible bool · ordre int

productes_colors
  id · producte_id fk · nom jsonb · imatge_path text · ordre int

productes_imatges
  id · producte_id fk · tipus ('portada'|'producte'|'detall'|'galeria')
  storage_path text · alt jsonb · ordre int
```

`variant_key` es la **identidad estable** de lo que se compra: es la clave del
carrito, de la línea de pedido y de la trazabilidad con el ERP.

### 4.2 Pedidos

```
comandes
  id uuid pk · numero text unique (AAMMDD + secuencia de 4 dígitos)
  token uuid unique default gen_random_uuid()   -- acceso público a la confirmación
  estat text ('pendent_pagament'|'pagat'|'en_preparacio'|'enviat'|'entregat'|'cancellat')
  idioma text · moneda text default 'EUR'
  nom, cognoms, email, telefon, adreca, poblacio, cp, provincia, pais
  subtotal, enviament, total numeric(12,2)
  zona_enviament text
  consentiment jsonb    -- {versio_condicions, versio_desistiment, acceptat_at, ip, user_agent, checks:{...}}
  pagament jsonb        -- {proveidor:'redsys', ds_order, ds_response, ds_authorisation_code, pagat_at}
  exportat_erp_at timestamptz null   -- la recogida del ERP lo marca
  created_at, updated_at

comandes_linies
  id · comanda_id fk · producte_id · variant_key · nom text · etiqueta_variant text
  pvp_unitari numeric(12,2) · qty int · import numeric(12,2)
  per_encarrec bool · termini_dies int     -- congelados en el momento de la compra
```

Los campos legales se congelan por línea porque el régimen de desistimiento y
el plazo de entrega dependen del producto tal como estaba cuando se compró.

### 4.3 Contrato público: las únicas puertas

Todas `SECURITY DEFINER`, `SET search_path`, con `REVOKE ALL FROM public` y
`GRANT EXECUTE TO anon`. Devuelven JSON con **lista blanca explícita** de
campos.

| RPC | Qué hace |
|---|---|
| `cataleg_llista(tipus, locale)` | Productos publicados de una familia con `pvp_desde`, portada y variantes disponibles |
| `cataleg_producte(tipus, slug)` | Una ficha completa: variantes, colores, imágenes |
| `cataleg_destacats(n)` | Para la franja de la portada informativa |
| `crear_comanda(payload)` | Ignora cualquier precio recibido, recalcula desde `productes_variants`, aplica envío, inserta cabecera y líneas en una transacción, genera `numero` y `token`; devuelve ambos |
| `marcar_comanda_pagada(numero, pagament)` | Solo la llama la ruta de notificación; exige un secreto de servidor como parámetro; idempotente |
| `comanda_per_token(token)` | Devuelve el pedido para la página de confirmación; sin token válido, nada |

Un test de contrato en CI comprueba el esquema exacto de cada respuesta y que
ninguna clave inesperada aparece.

### 4.4 Storage

Bucket público `productes` en el proyecto de la tienda. Las fotos se sirven por
CDN de Supabase. La web no guarda fotos de producto en el repositorio.

---

## 5. Sincronización con el ERP

### 5.1 Publicar productos: ERP → tienda

- El módulo "Botiga web" del ERP tiene un botón **Publicar** por producto (y
  **Retirar**). Al pulsarlo, una Edge Function del ERP:
  1. lee el producto, sus variantes, colores e imágenes del ERP;
  2. copia las imágenes al bucket de la tienda si han cambiado;
  3. hace `upsert` por `erp_id` en las tablas de la tienda, con los PVP ya
     calculados por el ERP;
  4. llama a `/api/online/revalidate` de la web con el secreto para invalidar la
     caché de esa ficha y de su familia.
- Retirar pone `estat='archived'`; la web devuelve 404 con `noindex`.
- La función usa la **clave de servicio del proyecto de la tienda**, guardada
  en los secretos del ERP. Nunca al revés.
- Carga inicial: un script hace la primera publicación de todo el catálogo
  actual, familia por familia, y un informe de paridad compara lo publicado con
  lo que la web servía hasta ahora.

### 5.2 Recoger pedidos: tienda → ERP

- Una Edge Function del ERP, programada cada 5 minutos, lee de la tienda los
  pedidos con `estat='pagat'` y `exportat_erp_at is null`, los crea en el ERP
  (cliente, pedido, líneas con su `variant_key` para casar con el maestro) y
  marca `exportat_erp_at`.
- Los cambios de estado posteriores (en preparación, enviado, entregado) se
  hacen en el ERP y la misma función los **escribe de vuelta** en la tienda,
  para que la página de confirmación y los emails los reflejen.

---

## 6. Catálogo en la web

- Lectura **solo desde el servidor** de Next, con la clave publishable del
  proyecto de la tienda. No hay cliente de Supabase en el navegador.
- ISR: `revalidate = 3600` como red de seguridad, más invalidación por
  etiqueta (`online:catifes`, `online:producte:adore`) que dispara la
  publicación desde el ERP.
- `generateStaticParams` tolera el fallo: si la base no responde en build,
  devuelve vacío y las fichas se generan bajo demanda. El build nunca se rompe
  por la tienda.
- **Alfombras**: selector de medida; cada medida es una variante con su PVP y
  la elegida es la que entra al carrito. **Mobiliario**: selector de color con
  precio único. **Mantas**: sin selector.
- Filtros de listado calculados en servidor a partir de las variantes:
  familia, rango de medida, color, rango de precio, disponible.
- Ficha: galería, selector, precio, plazo de entrega y régimen de devolución
  claros antes del botón, descripción, medidas, material, "otros de la misma
  familia".

---

## 7. Carrito y checkout

### 7.1 Carrito

- Línea = `variant_key` + cantidad. Se guarda en `localStorage`; el precio y el
  nombre se guardan solo para pintar.
- Al abrir el carrito y al entrar en el checkout, el servidor **vuelve a leer**
  las variantes: si un precio cambió o una variante dejó de estar disponible,
  se avisa antes de seguir.

### 7.2 Checkout (una sola página, tres bloques)

1. **Datos y envío**: nombre, apellidos, email, teléfono, dirección, código
   postal, población, provincia. El código postal determina la zona y el
   coste de envío, que se muestra al momento.
2. **Resumen**: líneas con su plazo de entrega y su régimen (a medida o stock),
   subtotal, envío, total con IVA. Esta es la información precontractual.
3. **Consentimientos y pago**: dos casillas sin premarcar (condiciones de
   venta; y, si hay producto a medida, la renuncia expresa al desistimiento) y
   el botón **"Pagar X €"**.

Al pulsar pagar, una Server Action: valida el formulario, pasa Turnstile,
llama a `crear_comanda`, guarda el consentimiento con versión de textos, fecha,
IP y agente, construye el formulario de Redsys y redirige.

### 7.3 Confirmación

`/online/comanda/{token}` muestra el estado real leído de la base: pagado (con
número, resumen y "te hemos enviado un email"), pendiente (Redsys aún no ha
notificado: "estamos confirmando el pago, recarga en unos segundos") o
rechazado (con botón para volver a intentar sin perder el carrito).

---

## 8. Pago: Redsys, TPV virtual del banco

- **Modalidad Redirección** con 3D Secure 2. La tarjeta nunca toca nuestro
  servidor. **Bizum** activado en el mismo TPV.
- **Ida**: formulario firmado con `Ds_SignatureVersion=HMAC_SHA256_V1`,
  `Ds_MerchantParameters` (JSON en base64: importe en céntimos, moneda 978,
  tipo de transacción 0, número de pedido, comercio, terminal, URLs de
  notificación, OK y KO) y `Ds_Signature` (HMAC-SHA256 con la clave derivada
  por 3DES del número de pedido).
- **Vuelta**: `/api/online/redsys/notify` recibe la notificación, verifica la
  firma, comprueba que importe, moneda y número coinciden con el pedido,
  interpreta `Ds_Response` (0 a 99 = autorizado) y llama a
  `marcar_comanda_pagada`. Es idempotente: una segunda notificación del mismo
  pedido no hace nada. Solo tras esto se envía el email de confirmación.
- Las URLs OK y KO solo redirigen a `/online/comanda/{token}`.
- **Número de pedido**: `AAMMDD` + secuencia de 4 dígitos (10 caracteres, los
  cuatro primeros numéricos, como exige Redsys). Lo genera `crear_comanda`.
- **Secretos** (código de comercio, terminal, clave SHA-256) solo en variables
  de servidor de Vercel, sin prefijo `NEXT_PUBLIC_`. Entorno de pruebas
  `sis-t.redsys.es` con las credenciales de test del banco antes de producción.
- **Devoluciones** desde el portal de administración de Redsys en esta fase.
  Automatizarlas desde el ERP es mejora posterior.

Qué pedir al banco, si no está ya:

1. Credenciales de **pruebas** y de **real**: código de comercio, terminal,
   clave secreta.
2. Modalidad Redirección con 3D Secure 2; **Bizum** activo.
3. Registro de las tres URLs (notificación, OK, KO) para pruebas y real.
4. Acceso al portal de administración de Redsys.
5. Confirmación por escrito de comisiones por operación y cuota mensual.

---

## 9. Envíos

- Reglas calculadas en `crear_comanda`, nunca en el navegador: portes por zona
  y recargo por tamaño grande (alfombras con ambas medidas a partir de 3 m).
- Zonas propuestas al lanzar: **Península y Baleares**. Canarias, Ceuta,
  Melilla y Andorra "bajo consulta" con botón a WhatsApp. (Decisión pendiente,
  apartado 15.)
- El plazo de entrega se muestra por línea antes del pago, congelado en el
  pedido.

---

## 10. Emails y notificaciones

Con Resend, plantillas en los cuatro idiomas, enviadas desde el servidor:

| Momento | A quién | Contenido |
|---|---|---|
| Pago confirmado | Cliente | Número, resumen, importes, dirección, plazos, condiciones y desistimiento adjuntos o enlazados (soporte duradero) |
| Pago confirmado | Esteba (`info@`) | Aviso interno con enlace al pedido en el ERP |
| Pedido enviado | Cliente | Aviso con transportista y seguimiento si lo hay (lo dispara el cambio de estado en el ERP) |
| Pago rechazado | Nadie | Se resuelve en pantalla; no se envía email |

---

## 11. Legal

- Tres textos de venta: **condiciones**, **envíos y devoluciones** con el
  régimen de desistimiento (14 días para producto de stock; exclusión para
  producto a medida, artículo 103.c del RDL 1/2007) y **formulario de
  desistimiento** (Anexo A). Se parte de los borradores existentes y los
  valida el abogado antes de abrir.
- El checkout cumple el flujo obligatorio: información precontractual visible,
  botón con importe, casillas sin premarcar, registro de la prueba del
  consentimiento en el pedido, confirmación en soporte duradero.
- Datos que Esteba debe facilitar: NIF, datos registrales, dirección para
  devoluciones, quién asume la logística inversa.
- RGPD: registro de tratamientos, contratos de encargado con Supabase, Vercel,
  Resend y el banco, y plazo de conservación de pedidos.
- El banner de cookies actual sirve; la tienda no añade rastreadores.

---

## 12. SEO

- `/online`, familias y fichas en el sitemap, derivados de los slugs de la
  base de datos, con `hreflang` de cuatro idiomas y canónica autorreferencial.
- JSON-LD `Product` con `Offer` por variante (precio, moneda, disponibilidad,
  marca) en cada ficha; `BreadcrumbList` en listados y fichas.
- `cerca`, `cistell`, `checkout` y `comanda` con `noindex` siempre.
- Títulos con intención: "Alfombra Adore a medida | Esteba Online".
- Un interruptor `ONLINE_PUBLISHED` gobierna a la vez el enlace en la cabecera
  principal, el `noindex`, `robots.txt`, el sitemap y la aceptación de pedidos.

---

## 13. Seguridad: lista de control

Antes de abrir, todo esto en verde:

- [ ] La web no tiene ninguna variable del proyecto del ERP. Solo del proyecto
      de la tienda.
- [ ] En el proyecto de la tienda, `anon` no tiene SELECT en ninguna tabla;
      solo EXECUTE en las seis RPC. Comprobado con consulta a `pg_class.relacl`.
- [ ] Privilegios por defecto del esquema fijados para que las tablas nuevas
      no concedan nada a `anon`.
- [ ] Ninguna vista sin `security_invoker`.
- [ ] Test de contrato de las RPC en CI (esquema exacto).
- [ ] Comprobación en CI de que `service_role` o `sb_secret` no aparecen en el
      repositorio de la web.
- [ ] Firma de Redsys verificada en la notificación; prueba con firma falsa
      rechazada; prueba de importe manipulado rechazada.
- [ ] `marcar_comanda_pagada` exige el secreto de servidor y es idempotente.
- [ ] Turnstile y límite de peticiones por IP en `crear_comanda`.
- [ ] Secreto en `/api/online/revalidate`.
- [ ] Segundo factor obligatorio en las cuentas del personal del ERP.
- [ ] Security advisor de Supabase sin avisos en el proyecto de la tienda.
- [ ] Copias de seguridad con punto de recuperación activadas en el proyecto
      de la tienda (plan Pro).
- [ ] En el ERP, permisos del rol `anon` revisados: esto protege al ERP por sí
      mismo, con o sin tienda.

---

## 14. Alcance del lanzamiento

| Incluido | Después |
|---|---|
| Alfombras con precio por medida | Mantas (decisión pendiente) |
| Mobiliario con color | Rebajas y cupones |
| Buscador simple | Cuentas de cliente y seguimiento |
| Carrito, checkout, Redsys con tarjeta y Bizum | Stock en tiempo real |
| Email de confirmación y de envío | Devoluciones automatizadas desde el ERP |
| Pedidos en el ERP con estados | Cortinas a medida (siguen en presupuesto) |
| Cuatro idiomas de catálogo | Analítica de ecommerce |

---

## 15. Decisiones pendientes

1. **Zonas de envío** al lanzar y quién asume la logística inversa.
2. **Familias**: alfombras y mobiliario. ¿Mantas también?
3. **Nombre**: "Esteba Online" o "Botiga Esteba".
4. **Idiomas del checkout**: los cuatro, o catalán y castellano.
5. **Quién publica**: si Esteba publicará productos, la fase ERP se adelanta;
   si lo hacemos nosotros por script, puede ir después del lanzamiento.
6. **Fecha de credenciales de pruebas de Redsys**, para fijar la fase 4.

Decididas: construcción propia; Redsys con el TPV del banco; tienda en
`/online` del dominio principal; proyecto de datos separado del ERP.

---

## 16. Fases

Cada fase se entrega verificada en local y en un deploy de preview de Vercel.
La web informativa se compara antes y después con capturas automáticas.

**F0 · Fundamentos de datos.**
Crear el proyecto `esteba-online`; migración con tablas, RLS, revocaciones,
privilegios por defecto, RPC y bucket; tests de contrato; CI de secretos.
Criterio: con la clave publishable no se puede leer ninguna tabla; las RPC
devuelven exactamente su esquema.

**F1 · Estructura de la web.**
Punto de partida: el repositorio ya está limpio de la tienda anterior (rama
`chore/neteja-botiga`, 11/09/2026): sin rutas, componentes, datos, imágenes ni
textos de tienda, y sin dependencia de Supabase. La web informativa es solo
informativa.
Trabajo: grupo de rutas `/online` con layout, cabecera y pie propios; código de
tienda nuevo en `src/online/`; interruptor `ONLINE_PUBLISHED`; entradas desde
cabecera, portada y pie.
Criterio: la web informativa no cambia ni un píxel; `/online` responde
apagada con `noindex`.

**F2 · Catálogo.**
Script de carga inicial y de paridad; fotos al bucket; lectura por RPC desde
el servidor; listados con filtros; ficha con selector de variante; ISR con
etiquetas y ruta de revalidación; JSON-LD y sitemap.
Criterio: cero datos de producto en el repositorio; un cambio publicado en la
base se ve en la web sin deploy.

**F3 · Carrito y pedido.**
Carrito por `variant_key` con revalidación de precios; checkout de tres
bloques; Server Action con Turnstile y `crear_comanda`; página de
confirmación por token; páginas legales; emails.
Criterio: imposible crear un pedido con un precio distinto al de la base,
probado con una petición manipulada.

**F4 · Pago.**
Proveedor Redsys (formulario firmado), ruta de notificación con verificación,
`marcar_comanda_pagada`, email solo tras la notificación.
Criterio: compra completa en el entorno de test con tarjeta y con Bizum;
pedido pagado con su código de autorización; email en los cuatro idiomas;
notificación con firma falsa rechazada.

**F5 · ERP.**
Fusionar el módulo "Botiga web"; añadir crear producto y subir fotos; botón
Publicar y Retirar con la función de publicación; función de recogida de
pedidos y escritura de estados; pantalla de pedidos online.
Criterio: Esteba publica un producto nuevo con fotos sin tocar código y ve el
pedido en el ERP a los cinco minutos de pagarse.

**F6 · Diseño, legal y apertura.**
Diseño de la tienda con el lenguaje de la web informativa; textos legales
validados; lista de control de seguridad en verde; dos compras reales de
prueba y su devolución; `ONLINE_PUBLISHED=true`; robots y sitemap;
monitorización de la ruta de notificación.

Dependencias: F0 → F2 → F3 → F4 → F6. F1 va en paralelo con F0. F5 puede
empezar en cuanto F0 exista y es obligatoria antes de F6 solo si Esteba va a
publicar productos por su cuenta.

---

## 17. Riesgos

- **Credenciales de Redsys.** Sin las de pruebas no arranca F4. Pedirlas ya.
- **Paridad del catálogo.** La carga inicial parte de los datos actuales de la
  web; el informe de paridad es obligatorio antes de dar la base por buena.
- **Desistimiento en producto a medida.** Es el punto jurídico crítico. No se
  abre sin la validación del abogado.
- **Notificaciones perdidas.** Si Redsys no puede alcanzar la ruta de
  notificación, el pedido queda en pendiente. Se monitoriza la ruta y el
  portal de Redsys permite reenviar la notificación.
- **Permisos del ERP.** El aislamiento protege la tienda; el ERP tiene que
  revisar sus propios permisos del rol anónimo por su cuenta.
