import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { clients } from "@/lib/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, TiltCard } from "@/components/motion/primitives";

const VIEWPORT_H = "clamp(300px, 30vw, 360px)";

export function Clients() {
  return (
    <section id="clients" aria-labelledby="clients-h" className="wrap">
      <SectionHeading
        id="clients-h"
        eyebrow="Frontend · client work"
        title="Live in production."
        aside={<p className="max-w-[46ch] text-fg-2">Production sites I built or maintained for clients, from React marketplaces to Magento and WordPress. Hover a browser to scroll the full page.</p>}
      />
      <Stagger as="ul" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" stagger={0.12}>
        {clients.map((c) => (
          <TiltCard as="li" key={c.domain} max={4} lift={8} className="glass spot group flex flex-col p-2.5">
            <div className="overflow-hidden rounded-[18px] border border-line bg-frame">
              <div className="flex items-center gap-1.5 border-b border-line bg-[color-mix(in_srgb,var(--fg)_4%,var(--frame))] px-3 py-[9px]" aria-hidden>
                <i className="size-2 rounded-full bg-[#FB7185]" />
                <i className="size-2 rounded-full bg-[#FBBF24]" />
                <i className="size-2 rounded-full bg-[#4ADE80]" />
                <span className="ml-2 min-w-0 flex-1 truncate rounded-[7px] bg-[color-mix(in_srgb,var(--bg)_50%,transparent)] px-2.5 py-[3px] font-mono text-[10.5px] text-fg-3">
                  {c.domain}
                </span>
              </div>
              {c.shot ? (
                <div
                  className="shot-scroll relative overflow-hidden"
                  style={{ height: VIEWPORT_H, "--frame-h": VIEWPORT_H, "--scroll-dur": "9s" } as React.CSSProperties}
                >
                  <Image src={c.shot.src} alt={c.shot.alt} width={c.shot.width} height={c.shot.height} sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw" className="h-auto w-full" />
                </div>
              ) : (
                <div
                  className="grid place-items-center bg-frame"
                  style={{
                    height: VIEWPORT_H,
                    backgroundImage:
                      "radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--a1) 35%, transparent), transparent 55%), radial-gradient(circle at 80% 80%, color-mix(in srgb, var(--a3) 30%, transparent), transparent 55%)",
                  }}
                >
                  <b className="whitespace-pre-line text-center font-display text-[32px] leading-[1.05] tracking-[-0.04em]">
                    {c.placeholder?.title}
                    <small className="mt-2.5 block font-mono text-[11px] font-normal tracking-[0.08em] text-fg-2">{c.placeholder?.caption}</small>
                  </b>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 px-2 pb-2 pt-4">
              <h3 className="font-display text-base tracking-[-0.02em]">{c.name}</h3>
              <p className="text-[13.5px] text-fg-2">{c.summary}</p>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link mt-auto inline-flex items-center gap-1.5 pt-2 text-[13px] text-a1 no-underline"
              >
                Visit site
                <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-spring group-hover/link:-translate-y-[3px] group-hover/link:translate-x-[3px]" aria-hidden />
                <span className="sr-only">: {c.name} (opens in a new tab)</span>
              </a>
            </div>
          </TiltCard>
        ))}
      </Stagger>
    </section>
  );
}
