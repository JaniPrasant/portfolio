import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { site } from "@/lib/site";

export type LegalSection = { id: string; title: string; body: ReactNode };

/** Plain, readable layout shared by the Privacy Policy and Terms of Use pages. */
export function LegalPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro: ReactNode; sections: LegalSection[] }) {
  return (
    <article id="top" className="wrap pt-[clamp(40px,7vw,90px)]">
      <div className="mx-auto max-w-[760px]">
        <Link href="/" className="no-print inline-flex items-center gap-1.5 text-[13.5px] text-fg-2 no-underline hover:text-fg">
          <ArrowLeft className="size-4" aria-hidden />
          Back to the portfolio
        </Link>
        <span className="eyebrow mt-8 block">{eyebrow}</span>
        <h1 className="mt-3.5 font-display text-[clamp(2.2rem,6vw,3.8rem)] font-bold leading-[1.05] tracking-[-0.045em]">{title}</h1>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.1em] text-fg-3">
          Effective {site.legalUpdatedLabel} · Applies to {site.url.replace(/^https?:\/\//, "")}
        </p>
        <div className="mt-6 text-[clamp(1rem,1.3vw,1.08rem)] text-fg-2">{intro}</div>

        <nav aria-label="On this page" className="glass mt-8 p-5">
          <b className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-3">On this page</b>
          <ol className="mt-3 grid list-decimal gap-1.5 pl-5 text-[14px] sm:grid-cols-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-fg-2 no-underline hover:text-a1">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="legal mt-10 flex flex-col gap-10">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28">
              <h2 id={`${s.id}-h`} className="font-display text-[clamp(1.25rem,2.2vw,1.6rem)] font-semibold tracking-[-0.02em]">
                <span className="mr-2 font-mono text-[0.7em] text-a1">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              <div className="mt-3 flex flex-col gap-3 text-fg-2">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
