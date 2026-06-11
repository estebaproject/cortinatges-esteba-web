"use client";

import { useState } from "react";

// Botó d'email robust: copia l'adreça al porta-retalls (funciona sempre) i,
// si l'usuari té client de correu, també l'obre via mailto.
export default function CopyEmail({
  email,
  className = "",
}: {
  email: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2200);
        },
        () => {},
      );
    }
  };

  return (
    <a href={`mailto:${email}`} onClick={handleClick} className={className}>
      <span aria-live="polite">{copied ? `${email}  ✓` : email}</span>
    </a>
  );
}
