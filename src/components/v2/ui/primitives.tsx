import clsx from "clsx";
import type { ReactNode } from "react";

/**
 * Primitives de maquetació del prototip v2.
 *
 * Existeixen per una raó concreta: a la web actual cada secció repeteix a mà
 * `max-w-layout mx-auto px-6 lg:px-12 py-section`, i quan una se n'oblida el
 * ritme vertical se'n va en orris sense que ningú ho vegi. Aquí el ritme el
 * decideix el component, no la memòria de qui l'escriu.
 */

// --- Contenidor -------------------------------------------------------------

export function Container({
  children,
  className,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  /** `wide` treu el topall de 1440 i deixa el contingut a tot l'ample útil. */
  wide?: boolean;
}) {
  return (
    <div
      className={clsx(
        "mx-auto w-full px-6 md:px-10 lg:px-14",
        !wide && "max-w-v2-layout",
        className,
      )}
    >
      {children}
    </div>
  );
}

// --- Secció -----------------------------------------------------------------

type Tone = "paper" | "paper-2" | "linen" | "ink";

const TONE_CLASS: Record<Tone, string> = {
  paper: "bg-v2-paper text-v2-ink",
  "paper-2": "bg-v2-paper-2 text-v2-ink",
  linen: "bg-v2-linen text-v2-ink",
  ink: "bg-v2-ink text-v2-paper",
};

export function Section({
  children,
  tone = "paper",
  size = "lg",
  className,
  id,
  label,
}: {
  children: ReactNode;
  tone?: Tone;
  size?: "lg" | "sm" | "none";
  className?: string;
  id?: string;
  /** aria-label de la secció. Si la secció ja té un <h2>, no cal. */
  label?: string;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={clsx(
        TONE_CLASS[tone],
        size === "lg" && "py-v2-section",
        size === "sm" && "py-v2-section-sm",
        // scroll-mt compensa la capçalera enganxada quan s'hi arriba per àncora.
        id && "scroll-mt-24",
        className,
      )}
    >
      {children}
    </section>
  );
}

// --- Aparició en scroll -----------------------------------------------------

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Retard en mil·lisegons, per escalonar files de targetes. */
  delay?: number;
  as?: "div" | "li" | "article" | "figure";
}) {
  return (
    <Tag
      className={clsx("reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

// --- Tipografia -------------------------------------------------------------

export function Eyebrow({
  children,
  className,
  tone = "brass",
}: {
  children: ReactNode;
  className?: string;
  tone?: "brass" | "paper";
}) {
  return (
    <p
      className={clsx(
        "font-v2-sans text-v2-eyebrow font-semibold uppercase",
        tone === "brass" ? "text-v2-brass-2" : "text-v2-paper/60",
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * Capçalera de secció. Per defecte va alineada a l'ESQUERRA: la web actual ho
 * centra absolutament tot, i és justament això el que li dona aire de plantilla.
 * El centrat queda per als blocs que de veritat són un pronunciament (el bloc
 * fosc de tancament), no per a cada llista de targetes.
 */
export function SectionHead({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "ink",
  className,
  action,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  tone?: "ink" | "paper";
  className?: string;
  /** Enllaç o botó que va a la dreta del títol en desktop. */
  action?: ReactNode;
  as?: "h1" | "h2";
}) {
  const dark = tone === "paper";
  return (
    <div
      className={clsx(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center text-center",
        className,
      )}
    >
      <div className={clsx(align === "center" ? "max-w-3xl" : "max-w-2xl")}>
        {eyebrow && (
          <Eyebrow tone={dark ? "paper" : "brass"} className="mb-4">
            {eyebrow}
          </Eyebrow>
        )}
        <Tag
          className={clsx(
            "font-v2-display text-v2-h2 text-balance",
            dark ? "text-v2-paper" : "text-v2-ink",
          )}
        >
          {title}
        </Tag>
        {lead && (
          <p
            className={clsx(
              "font-v2-sans text-v2-lead mt-5 max-w-v2-prose",
              dark ? "text-v2-paper/70" : "text-v2-ink-2",
              align === "center" && "mx-auto",
            )}
          >
            {lead}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
