import type { LegalDoc } from "@/lib/legal";

export default function LegalDocView({ doc }: { doc: LegalDoc }) {
  return (
    <section className="pt-40 md:pt-48 pb-section bg-canvas">
      <div className="max-w-prose-editorial mx-auto px-6 lg:px-12">
        <h1 className="font-serif text-display-lg text-ink mb-10">{doc.title}</h1>
        <div className="flex flex-col gap-5">
          {doc.blocks.map((block, i) =>
            block.type === "h" ? (
              <h2
                key={i}
                className="font-serif text-display-md text-ink mt-6 first:mt-0"
              >
                {block.text}
              </h2>
            ) : (
              <p key={i} className="font-sans text-body-md text-ink-muted leading-relaxed">
                {block.text}
              </p>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
