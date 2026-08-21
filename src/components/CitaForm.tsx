"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { FRANGES, HORARI, DIES_VISTA, frangesDelDia } from "@/lib/lead";
import { STORE_KEYS } from "@/lib/botigues";
import { useLeadSubmit } from "@/components/forms/useLeadSubmit";
import {
  ConsentField,
  ErrorPanel,
  Honeypot,
  SuccessPanel,
  fieldClass,
  labelClass,
} from "@/components/forms/LeadFormParts";

/**
 * Formulari de cita presencial. Substitueix el Calendly que hi havia al
 * WordPress (un badge flotant cap a calendly.com/cortinatgesesteba/30min).
 *
 * NO és una reserva, és una PETICIÓ, i el text ho diu. No hi ha sincronització
 * de calendari: dues persones poden demanar la mateixa franja i la confirmeu
 * vosaltres per correu. Dir "cita confirmada" aquí seria mentir-li al client
 * i acabaria amb algú plantat a la botiga un dia que no toca.
 *
 * Es tria FRANJA, no hora. Oferir "les 10:30" sense mirar cap agenda és
 * prometre una cosa que no es pot garantir.
 *
 * No porta botó de WhatsApp, a diferència dels altres dos formularis: una cita
 * necessita dia i franja escollits d'una llista tancada, i per WhatsApp
 * tornaríeu a negociar-ho a mà, que és justament el que això estalvia.
 */
export default function CitaForm() {
  const t = useTranslations("FormCita");
  const { state, submit, honeypot, setHoneypot } = useLeadSubmit("cita");

  const avui = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);
  const maxim = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + DIES_VISTA);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const [form, setForm] = useState({
    nom: "",
    telefon: "",
    email: "",
    botiga: "",
    data: "",
    franja: "",
    missatge: "",
  });
  const [consent, setConsent] = useState(false);

  // Quines franges té el dia triat. Si el dia és tancat, la llista queda buida
  // i el desplegable ho diu en lloc d'oferir hores que no existeixen.
  const disponibles = form.data ? frangesDelDia(form.data) : [];
  const diaTancat = form.data !== "" && disponibles.length === 0;

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const v = e.target.value;
      // En canviar de dia, una franja que ja no existeix s'ha de netejar: si no,
      // es podria enviar "dissabte a la tarda" havent triat abans un dimarts.
      if (k === "data") {
        const noves = frangesDelDia(v);
        setForm({ ...form, data: v, franja: noves.includes(form.franja as never) ? form.franja : "" });
        return;
      }
      setForm({ ...form, [k]: v });
    };

  if (state === "ok") {
    return <SuccessPanel namespace="FormCita" />;
  }

  const enviant = state === "sending";
  const potEnviar = !enviant && !diaTancat && form.franja !== "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit({ ...form, consent });
      }}
      className="relative flex flex-col gap-5 max-w-xl"
    >
      <Honeypot value={honeypot} onChange={setHoneypot} />

      <div>
        <label htmlFor="cita-nom" className={labelClass}>{t("nom")}</label>
        <input id="cita-nom" type="text" required autoComplete="name" value={form.nom} onChange={set("nom")} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="cita-telefon" className={labelClass}>{t("telefon")}</label>
        <input id="cita-telefon" type="tel" required autoComplete="tel" value={form.telefon} onChange={set("telefon")} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="cita-email" className={labelClass}>{t("email")}</label>
        <input id="cita-email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="cita-botiga" className={labelClass}>{t("botiga")}</label>
        <select id="cita-botiga" required value={form.botiga} onChange={set("botiga")} className={fieldClass}>
          <option value="" disabled>{t("tria")}</option>
          {STORE_KEYS.map((k) => (
            <option key={k} value={k}>{t(`botigues.${k}` as never)}</option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cita-data" className={labelClass}>{t("data")}</label>
          <input
            id="cita-data"
            type="date"
            required
            min={avui}
            max={maxim}
            value={form.data}
            onChange={set("data")}
            className={fieldClass}
          />
          {diaTancat && (
            <p className="mt-2 font-sans text-body-sm text-accent-deep">{t("tancat")}</p>
          )}
        </div>

        <div>
          <label htmlFor="cita-franja" className={labelClass}>{t("franja")}</label>
          <select
            id="cita-franja"
            required
            value={form.franja}
            onChange={set("franja")}
            disabled={!form.data || diaTancat}
            className={`${fieldClass} disabled:opacity-50`}
          >
            <option value="" disabled>{form.data ? t("tria") : t("triaDiaPrimer")}</option>
            {disponibles.map((f) => (
              <option key={f} value={f}>
                {t(`franges.${f}` as never)} · {HORARI[f]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="cita-missatge" className={labelClass}>
          {t("missatge")} <span className="text-ink-faint">{t("opcional")}</span>
        </label>
        <textarea id="cita-missatge" rows={4} value={form.missatge} onChange={set("missatge")} className={fieldClass} />
      </div>

      <ConsentField namespace="FormCita" checked={consent} onChange={setConsent} />

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={!potEnviar}
          className="inline-flex items-center justify-center px-8 py-4 bg-ink text-canvas font-sans text-body-md font-medium tracking-widest uppercase hover:bg-ink-deep disabled:opacity-50 transition-colors"
        >
          {enviant ? t("enviant") : t("enviar")}
        </button>
        {/* Aquesta línia no és lletra petita: és el que evita que algú es
            presenti a la botiga donant per fet que la cita ja està feta. */}
        <p className="font-sans text-body-sm text-ink-muted">{t("avis")}</p>
      </div>

      {state === "error" && <ErrorPanel namespace="FormCita" />}
    </form>
  );
}
