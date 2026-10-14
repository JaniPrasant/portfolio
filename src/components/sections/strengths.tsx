"use client";

import { motion } from "motion/react";
import { Component, Gauge, MonitorSmartphone, PenTool } from "lucide-react";
import { frontendStrengths } from "@/lib/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, TiltCard } from "@/components/motion/primitives";

const icons = {
  figma: PenTool,
  devices: MonitorSmartphone,
  gauge: Gauge,
  components: Component,
} as const;

const accents = ["var(--a1)", "var(--a2)", "var(--a3)", "var(--a1)"];

/** Frontend is the core of the career, so it gets its own spotlight before the work samples. */
export function Strengths() {
  return (
    <section id="frontend" aria-labelledby="frontend-h" className="wrap">
      <SectionHeading
        id="frontend-h"
        eyebrow="Frontend engineering"
        title="Frontend first, since 2017."
        aside={
          <p className="max-w-[46ch] text-fg-2">
            6+ years of shipping production interfaces for SaaS, fintech and e-commerce, from the Figma file to the live site.
          </p>
        }
      />
      <Stagger as="ul" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" stagger={0.12}>
        {frontendStrengths.map((s, i) => {
          const Icon = icons[s.icon];
          return (
            <TiltCard as="li" key={s.title} max={9} className="glass spot flex flex-col gap-3.5 overflow-hidden p-[clamp(20px,2.4vw,30px)]">
              {/* Accent wash that sweeps up from the bottom on hover */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-full origin-bottom"
                style={{ background: `linear-gradient(to top, color-mix(in srgb, ${accents[i]} 14%, transparent), transparent 70%)` }}
                variants={{ hidden: { scaleY: 0 }, show: { scaleY: 0 }, hover: { scaleY: 1 } }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
              />
              <motion.span
                className="relative grid size-12 place-items-center rounded-2xl border border-line-2"
                style={{ background: `color-mix(in srgb, ${accents[i]} 16%, transparent)`, color: accents[i] }}
                variants={{ hover: { rotate: [0, -14, 10, -4, 0], scale: 1.15, transition: { duration: 0.6 } } }}
              >
                <Icon className="size-[22px]" aria-hidden />
              </motion.span>
              <motion.span className="relative font-mono text-[11px] tracking-[0.12em] text-fg-3" variants={{ hover: { x: 4 } }}>
                {String(i + 1).padStart(2, "0")} / {String(frontendStrengths.length).padStart(2, "0")}
              </motion.span>
              <h3 className="relative font-display text-lg tracking-[-0.02em]">{s.title}</h3>
              <p className="relative text-[14.5px] text-fg-2">{s.body}</p>
            </TiltCard>
          );
        })}
      </Stagger>
    </section>
  );
}
