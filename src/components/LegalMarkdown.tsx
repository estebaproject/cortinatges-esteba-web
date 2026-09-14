import type { ReactNode } from "react";

/**
 * Renderitzador del markdown mínim dels textos legals, COMPARTIT pel web
 * informatiu i per la botiga: ## títol, paràgraf, "- " llista, "1. " llista
 * numerada, "| a | b |" taula, "> " nota, **negreta** i `nom tècnic`.
 *
 * Els claudàtors [AIXÍ] es ressalten com a dades pendents: així, si algú
 * publica sense omplir el NIF, es veu a la pàgina i no passa per bo.
 */
function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]|https?:\/\/\S+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) out.push(<strong key={`${key}-b${i}`}>{tok.slice(2, -2)}</strong>);
    // Nom tècnic entre cometes inverses: el nom d'una clau del navegador, per
    // exemple. Sense això, les cometes sortien literals a la pàgina legal.
    else if (tok.startsWith("`")) out.push(<code key={`${key}-c${i}`} className="bg-canvas-warm border border-linen px-1 py-0.5 text-[0.9em]">{tok.slice(1, -1)}</code>);
    else if (tok.startsWith("[")) out.push(<mark key={`${key}-m${i}`} className="bg-[#F3E3B8] text-ink px-1">{tok}</mark>);
    else out.push(<a key={`${key}-a${i}`} href={tok.replace(/[.,;:]+$/, "")} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">{tok}</a>);
    last = m.index + tok.length;
    i++;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function LegalMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;
  const h = "font-sans text-xs font-semibold tracking-[0.18em] uppercase text-ink mt-10 mb-3";
  const p = "font-sans text-body-md text-ink/85 mb-4 max-w-prose-editorial";

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }
    if (line.startsWith("## ")) { blocks.push(<h2 key={k++} className={h}>{line.slice(3)}</h2>); i++; continue; }
    if (line.startsWith("> ")) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) { rows.push(lines[i].trim().slice(2)); i++; }
      blocks.push(<blockquote key={k++} className="border-l-2 border-ink/30 bg-canvas-warm px-5 py-4 mb-4 max-w-prose-editorial font-sans text-body-sm text-ink/85 space-y-1">{rows.map((r, j) => <p key={j}>{inline(r, `q${k}-${j}`)}</p>)}</blockquote>);
      continue;
    }
    if (line.startsWith("| ")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i].trim().slice(1, -1).split("|").map((c) => c.trim());
        if (!cells.every((c) => /^-+$/.test(c))) rows.push(cells);
        i++;
      }
      const [head, ...body] = rows;
      blocks.push(
        <div key={k++} className="overflow-x-auto mb-4 max-w-prose-editorial">
          <table className="w-full font-sans text-body-sm border-t border-linen">
            <thead><tr>{head.map((c, j) => <th key={j} className="py-2 pr-4 text-left font-semibold text-ink border-b border-linen">{inline(c, `th${k}-${j}`)}</th>)}</tr></thead>
            <tbody>{body.map((r, ri) => <tr key={ri} className="border-b border-linen align-top">{r.map((c, j) => <td key={j} className="py-2 pr-4 text-ink/85">{inline(c, `td${k}-${ri}-${j}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (/^(-|\d+\.)\s/.test(line)) {
      const ordered = /^\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && /^(-|\d+\.)\s/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^(-|\d+\.)\s/, "")); i++; }
      const cls = `mb-4 max-w-prose-editorial pl-5 space-y-1 font-sans text-body-md text-ink/85 ${ordered ? "list-decimal" : "list-disc"}`;
      blocks.push(ordered ? <ol key={k++} className={cls}>{items.map((it, j) => <li key={j}>{inline(it, `ol${k}-${j}`)}</li>)}</ol> : <ul key={k++} className={cls}>{items.map((it, j) => <li key={j}>{inline(it, `ul${k}-${j}`)}</li>)}</ul>);
      continue;
    }
    blocks.push(<p key={k++} className={p}>{inline(line, `p${k}`)}</p>);
    i++;
  }
  return <div>{blocks}</div>;
}
