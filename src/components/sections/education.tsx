import { education } from "@/lib/content";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, TiltCard } from "@/components/motion/primitives";

export function Education() {
  const { pg, degrees, certificates } = education;
  return (
    <section id="education" aria-labelledby="edu-h" className="wrap">
      <SectionHeading id="edu-h" eyebrow="Education" title="Learning, on record." />
      <Stagger className="grid grid-cols-12 gap-4" stagger={0.12}>
        <TiltCard max={3} className="glass spot col-span-12 flex flex-col gap-3.5 overflow-hidden p-[clamp(20px,2.4vw,30px)] lg:col-span-7">
          <span
            aria-hidden
            className="pointer-events-none absolute -right-[60px] -top-[60px] size-[220px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--a2)_40%,transparent),transparent_70%)]"
          />
          <span className="label">
            <span className="dot" />
            Postgraduate · {pg.period}
          </span>
          <h3 className="font-display text-[clamp(1.25rem,2.3vw,1.7rem)] tracking-[-0.02em]">{pg.title}</h3>
          <p className="text-fg-2">{pg.where}</p>
          <ul className="flex flex-wrap gap-[7px]" aria-label="Curriculum">
            {pg.curriculum.map((c) => (
              <li key={c.label} className={cn("chip", c.accent && `chip-${c.accent}`)}>
                {c.label}
              </li>
            ))}
          </ul>
        </TiltCard>
        <TiltCard max={3} className="glass spot col-span-12 p-[clamp(20px,2.4vw,30px)] lg:col-span-5">
          <span className="label">
            <span className="dot" />
            Certificates
          </span>
          <ul className="flex flex-col">
            {certificates.map((c, i) => (
              <li key={c.name} className={cn("flex justify-between gap-3.5 py-3 text-[14.5px]", i > 0 ? "border-t border-line" : "pt-0")}>
                <span>{c.name}</span>
                <span className="whitespace-nowrap font-mono text-xs text-fg-3">{c.year}</span>
              </li>
            ))}
          </ul>
        </TiltCard>
        {degrees.map((d) => (
          <TiltCard key={d.title} className="glass spot col-span-12 p-[clamp(20px,2.4vw,30px)] md:col-span-6">
            <span className="label">
              <span className="dot" />
              {d.kind}
            </span>
            <h3 className="font-display text-lg tracking-[-0.02em]">{d.title}</h3>
            <p className="mt-1.5 text-sm text-fg-2">{d.where}</p>
            <p className="mt-3.5 font-mono text-xs text-fg-3">{d.period}</p>
          </TiltCard>
        ))}
      </Stagger>
    </section>
  );
}
