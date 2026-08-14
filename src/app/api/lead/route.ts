import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import {
  HONEYPOT_FIELD,
  LEAD_TYPES,
  LIMITS,
  MIN_FILL_MS,
  PRODUCT_OPTIONS,
  type LeadPayload,
  type LeadResponse,
} from "@/lib/lead";
import { LEGAL_TEXTS_VERSION } from "@/lib/consent";
import { SITE_URL } from "@/lib/site";

/**
 * Enviament de leads des del SERVIDOR cap a info@cortinatgesesteba.com.
 *
 * ANTISPAM SENSE CAPTCHA — quatre capes, cap visible per a l'usuari:
 *   1. Esquer (honeypot): camp ocult que només omplen els bots.
 *   2. Trampa de temps: enviaments en menys de MIN_FILL_MS són automàtics.
 *   3. Origen: es rebutja el que no ve del propi lloc.
 *   4. Validació estricta + descart de missatges farcits d'enllaços.
 *
 * Davant d'un bot es respon `{ ok: true }`: si se li digués que ha fallat,
 * reintentaria amb una altra tàctica. Que es pensi que ha funcionat.
 */

export const runtime = "nodejs";

/**
 * Retorna el detall de l'error a la resposta, per a poder diagnosticar amb un
 * `curl` en comptes d'anar a cegues.
 *
 * S'obre en dos casos:
 *   · fora de producció (previews i local), sempre;
 *   · a producció NOMÉS si hi ha `LEAD_DEBUG=1` definida.
 *
 * La segona porta existeix perquè els errors d'enviament passen justament a
 * producció, i una porta que només obrís als previews no serviria de res.
 * Es posa la variable, es diagnostica i S'ESBORRA. Els missatges de Resend no
 * contenen secrets (són del tipus "domain is not verified"), però tampoc cal
 * publicar-los per sempre.
 */
function potDepurar(): boolean {
  return process.env.VERCEL_ENV !== "production" || process.env.LEAD_DEBUG === "1";
}

/**
 * Empremta de la clau per a diagnosticar SENSE revelar-la: llargada, si duia
 * espais o salts de línia enganxats, i el prefix (les claus de Resend sempre
 * comencen per `re_`). Amb això es distingeix "la variable no s'ha actualitzat"
 * de "el valor és una altra cosa" sense haver de veure el secret.
 */
function empremtaClau(raw: string | undefined): string {
  if (!raw) return "absent";
  const net = raw.trim();
  return [
    `llargada ${raw.length}`,
    raw.length !== net.length ? `⚠️ amb ${raw.length - net.length} car. d'espai/salt` : "sense espais",
    net.startsWith("re_") ? "prefix re_ ✓" : `prefix «${net.slice(0, 3)}» ✗`,
  ].join(" · ");
}

/** Redueix un error desconegut a text llegible, sense arrossegar-hi secrets. */
function detall(err: unknown): string {
  if (err && typeof err === "object") {
    const e = err as { name?: string; message?: string; statusCode?: number; error?: string };
    return [e.name, e.statusCode, e.message ?? e.error].filter(Boolean).join(" · ");
  }
  return String(err);
}

const IDIOMES: Record<string, string> = {
  ca: "Català",
  es: "Castellà",
  en: "Anglès",
  fr: "Francès",
};

function net(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function emailValid(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

function telefonValid(v: string): boolean {
  // Prou permissiu per a prefixos internacionals i separadors, però exigeix
  // un mínim de dígits reals.
  return (v.match(/\d/g) ?? []).length >= 6;
}

/** Missatges amb 3+ enllaços: senyal clàssic de spam de formulari. */
function massaEnllacos(v: string): boolean {
  return (v.match(/https?:\/\//gi) ?? []).length >= 3;
}

function originValid(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  // Sense capçalera Origin no es bloqueja: alguns navegadors i proxies no
  // l'envien en same-origin. Si hi és, ha de quadrar amb el propi lloc.
  if (!origin) return true;
  try {
    const host = new URL(origin).host;
    return (
      host === new URL(SITE_URL).host ||
      host.endsWith(".vercel.app") ||
      host.startsWith("localhost")
    );
  } catch {
    return false;
  }
}

function escapaHtml(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest): Promise<NextResponse<LeadResponse>> {
  if (!originValid(req)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 403 });
  }

  let body: Partial<LeadPayload>;
  try {
    body = (await req.json()) as Partial<LeadPayload>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // --- Capes antispam 1 i 2: es respon OK per a no ensenyar-li res al bot ---
  const esquer = net(body[HONEYPOT_FIELD], 200);
  const trigat =
    typeof body.renderedAt === "number" && Date.now() - body.renderedAt >= MIN_FILL_MS;
  if (esquer || !trigat) {
    return NextResponse.json({ ok: true });
  }

  // --- Validació ---
  const type = body.type;
  if (!type || !LEAD_TYPES.includes(type)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const nom = net(body.nom, LIMITS.nom);
  const telefon = net(body.telefon, LIMITS.telefon);
  const email = net(body.email, LIMITS.email);
  const mides = net(body.mides, LIMITS.mides);
  const missatge = net(body.missatge, LIMITS.missatge);
  const producte = net(body.producte, 60);
  const locale = ["ca", "es", "en", "fr"].includes(String(body.locale))
    ? String(body.locale)
    : "ca";
  const page = net(body.page, 300);

  const obligatorisOk =
    nom.length >= 2 &&
    telefonValid(telefon) &&
    emailValid(email) &&
    body.consent === true &&
    (type !== "budget" || PRODUCT_OPTIONS.includes(producte as never));

  if (!obligatorisOk || massaEnllacos(missatge)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // --- Correu ---
  // Es fa `.trim()` A PROPÒSIT: enganxar una clau al panell de Vercel s'endú
  // molt sovint un salt de línia o un espai final invisible, i llavors Resend
  // respon 401 "API key is invalid" sense que es vegi res estrany al panell.
  // Com que la variable es marca com a Sensitive, tampoc es pot rellegir per
  // a comparar-la. Retallar-la aquí és inofensiu i estalvia hores.
  const apiKeyRaw = process.env.RESEND_API_KEY;
  const apiKey = apiKeyRaw?.trim();
  const to = process.env.LEAD_TO_EMAIL?.trim();
  const from = process.env.LEAD_FROM_EMAIL?.trim();
  if (!apiKey || !to || !from) {
    const quines = [
      !apiKey && "RESEND_API_KEY",
      !to && "LEAD_TO_EMAIL",
      !from && "LEAD_FROM_EMAIL",
    ].filter(Boolean).join(", ");
    console.error("[lead] falten variables:", quines);
    return NextResponse.json(
      { ok: false, error: "send", ...(potDepurar() ? { detail: `falten: ${quines}` } : {}) },
      { status: 500 },
    );
  }

  // Prefix FIX en català sigui quin sigui l'idioma del client: així el filtre
  // de Gmail no depèn de l'idioma i els dos tipus se separen d'un cop d'ull.
  const prefix = type === "budget" ? "[Pressupost]" : "[Currículum]";
  const subject = `${prefix} ${nom} · ${telefon}`;

  const ara = new Date().toLocaleString("ca-ES", { timeZone: "Europe/Madrid" });
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconeguda";

  const files: [string, string][] = [
    ["Nom", nom],
    ["Telèfon", telefon],
    ["Correu", email],
  ];
  if (type === "budget") {
    files.push(["Producte", producte]);
    files.push(["Mides", mides || "(no indicades)"]);
  }
  files.push(["Idioma", IDIOMES[locale] ?? locale]);

  const etiquetaMissatge = type === "budget" ? "MISSATGE" : "COMENTARIS";
  const peu =
    `${SITE_URL}${page}\n${ara} · consentiment acceptat ` +
    `(textos ${LEGAL_TEXTS_VERSION}) · IP ${ip}`;

  const text =
    files.map(([k, v]) => `${k.padEnd(10)}${v}`).join("\n") +
    (missatge ? `\n\n${etiquetaMissatge}\n${missatge}` : "") +
    `\n\n${"─".repeat(40)}\n${peu}`;

  const html =
    `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#111">` +
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse">` +
    files
      .map(
        ([k, v]) =>
          `<tr><td style="padding:2px 16px 2px 0;color:#666">${k}</td>` +
          `<td style="padding:2px 0"><strong>${escapaHtml(v)}</strong></td></tr>`,
      )
      .join("") +
    `</table>` +
    (missatge
      ? `<p style="margin:20px 0 6px;color:#666;font-size:13px;letter-spacing:.08em">${etiquetaMissatge}</p>` +
        `<div style="white-space:pre-wrap">${escapaHtml(missatge)}</div>`
      : "") +
    `<hr style="border:none;border-top:1px solid #ddd;margin:24px 0 12px">` +
    `<p style="color:#888;font-size:12px;white-space:pre-line">${escapaHtml(peu)}</p>` +
    `</div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      text,
      html,
      // La clau de tot: en respondre, la resposta va al CLIENT, no a la web.
      replyTo: email,
    });
    if (error) {
      console.error("[lead] Resend:", error);
      return NextResponse.json(
        {
          ok: false,
          error: "send",
          ...(potDepurar() ? { detail: detall(error), from, to, key: empremtaClau(apiKeyRaw) } : {}),
        },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[lead] excepció en enviar:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "send",
        ...(potDepurar() ? { detail: detall(err), from, to, key: empremtaClau(apiKeyRaw) } : {}),
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
