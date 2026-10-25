import { faqs } from "@/lib/content";
import { Reveal } from "@/components/motion/primitives";
import { FaqList } from "./faq-list";

/** FAQPage JSON-LD stays server-rendered for search results; the accordion is a Motion client component. */
export function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <section id="faq" aria-labelledby="faq-h" className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)]">
        <Reveal className="lg:sticky lg:top-[110px]">
          <span className="eyebrow">FAQ</span>
          <h2 id="faq-h" className="mt-3 font-display text-[clamp(1.9rem,4.6vw,3.2rem)] font-semibold tracking-[-0.03em]">
            Quick answers.
          </h2>
          <p className="mt-3 text-[15px] text-fg-2">
            The questions recruiters ask me most. Anything else,{" "}
            <a href="#contact" className="text-a1">
              send a message
            </a>
            .
          </p>
        </Reveal>
        <FaqList />
      </div>
    </section>
  );
}
