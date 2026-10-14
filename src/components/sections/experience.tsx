"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { experience } from "@/lib/content";
import { events } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";

export function Experience() {
  const [active, setActive] = useState(0);
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // The site search can jump straight to a company.
  useEffect(() => {
    const onSelect = (e: Event) => {
      const company = (e as CustomEvent<string>).detail;
      const i = experience.findIndex((r) => r.company === company);
      if (i >= 0) setActive(i);
    };
    window.addEventListener(events.selectCompany, onSelect);
    return () => window.removeEventListener(events.selectCompany, onSelect);
  }, []);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (i + d + experience.length) % experience.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const role = experience[active]!;

  return (
    <section id="experience" aria-labelledby="exp-h" className="wrap">
      <SectionHeading
        id="exp-h"
        eyebrow="Experience"
        title="Where I've worked."
        aside={<p className="max-w-[44ch] text-fg-2">Pick a company to see what I did there.</p>}
      />
      <motion.div className="no-print grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)]" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
        <div
          role="tablist"
          aria-label="Companies"
          aria-orientation="vertical"
          className="no-print glass flex gap-1.5 overflow-x-auto p-2 [scrollbar-width:none] lg:flex-col lg:overflow-visible"
        >
          {experience.map((r, i) => (
            <button
              key={r.company}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${i}`}
              aria-selected={active === i}
              aria-controls={`${uid}-panel`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className="relative flex-none cursor-pointer rounded-2xl border-0 bg-transparent px-4 py-3.5 text-left text-fg-2"
            >
              {active === i && (
                <motion.span
                  layoutId={`${uid}-xp-pill`}
                  className="absolute inset-0 rounded-2xl border border-line-2 bg-glass-2"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                >
                  <span className="absolute -left-px bottom-[18%] top-[18%] hidden w-[3px] rounded-full bg-linear-to-b from-a1 to-a3 lg:block" />
                  <span className="absolute inset-x-[18%] -bottom-px h-[2px] rounded-full bg-linear-to-r from-a1 to-a3 lg:hidden" />
                </motion.span>
              )}
              <span className="relative block">
                <b className={`block font-display text-[14.5px] font-semibold tracking-[-0.01em] ${active === i ? "text-fg" : "text-fg-2"}`}>
                  {r.company}
                </b>
                <span className="font-mono text-[11.5px]">{r.shortPeriod}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="glass overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={role.company}
              id={`${uid}-panel`}
              role="tabpanel"
              aria-labelledby={`${uid}-tab-${active}`}
              tabIndex={0}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="p-[clamp(22px,3vw,36px)] outline-none"
            >
              <h3 className="font-display text-[clamp(1.3rem,2.4vw,1.8rem)] tracking-[-0.025em]">{role.title}</h3>
              <div className="mt-2.5 flex flex-wrap gap-x-3.5 gap-y-2 font-mono text-[12.5px] text-fg-3">
                <span>{role.company}</span>
                <span>{role.period}</span>
                <span>{role.place}</span>
                {role.current && (
                  <span className="inline-flex items-center gap-1.5 text-ok">
                    <span className="dot dot-live" />
                    CURRENT
                  </span>
                )}
              </div>
              <motion.ul
                className="mt-[22px] flex flex-col gap-3"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } } }}
              >
                {role.points.map((pt) => (
                  <motion.li
                    key={pt}
                    className="grid grid-cols-[18px_minmax(0,1fr)] gap-2.5 text-[15px] text-fg-2"
                    variants={{ hidden: { opacity: 0, x: -18 }, show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 22 } } }}
                  >
                    <motion.span
                      aria-hidden
                      className="mt-2 size-2 rounded-[2px] bg-linear-to-br from-a1 to-a3"
                      variants={{ hidden: { rotate: -90, scale: 0 }, show: { rotate: 45, scale: 1 } }}
                    />
                    {pt}
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div
                className="mt-[22px] flex flex-wrap gap-[7px]"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.45 } } }}
              >
                {role.stack.map((s) => (
                  <motion.span
                    key={s}
                    className="chip"
                    variants={{ hidden: { opacity: 0, scale: 0.6, y: 8 }, show: { opacity: 1, scale: 1, y: 0 } }}
                    whileHover={{ y: -3, scale: 1.05 }}
                  >
                    {s}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Print shows every role, not just the selected tab */}
      <div className="hidden print-block">
        {experience.map((r) => (
          <div key={r.company} className="mt-4">
            <h3 className="font-semibold">
              {r.title} · {r.company}
            </h3>
            <p>
              {r.period} · {r.place}
            </p>
            <ul className="list-disc pl-5">
              {r.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
