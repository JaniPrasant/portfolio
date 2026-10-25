"use client";

import { useReducedMotionSafe } from "@/components/motion/primitives";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Stagger, TiltCard, useFinePointer } from "@/components/motion/primitives";
import { skills, skillTrackLabels, type SkillTrack } from "@/lib/content";
import { cn, events } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { CopyButton } from "@/components/ui/copy-button";

const trackColor: Record<SkillTrack, string> = { fe: "var(--a1)", da: "var(--a3)", tl: "var(--a2)" };

const SQL = `-- Top 3 skills per role
SELECT role, skill, mentions
FROM (
  SELECT role, skill,
    COUNT(*) AS mentions,
    RANK() OVER (
      PARTITION BY role
      ORDER BY COUNT(*) DESC
    ) AS rnk
  FROM job_skills
  GROUP BY role, skill
) ranked
WHERE rnk <= 3;`;

/** Lightweight SQL highlighter for the snippet (keywords, functions, numbers, comments). */
function highlightSql(src: string) {
  const re = /(--[^\n]*)|\b(SELECT|FROM|AS|OVER|PARTITION BY|ORDER BY|GROUP BY|WHERE|DESC)\b|\b(COUNT|RANK)\b|\b(\d+)\b/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const cls = m[1] ? "tk-c" : m[2] ? "tk-k" : m[3] ? "tk-f" : "tk-s";
    out.push(
      <span key={k++} className={cls}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  out.push(src.slice(last));
  return out;
}

export function Skills() {
  const [track, setTrack] = useState<"all" | SkillTrack>("all");
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    const onHighlight = (e: Event) => {
      setTrack("all");
      setFlash((e as CustomEvent<string>).detail);
      setTimeout(() => setFlash(null), 1400);
    };
    window.addEventListener(events.highlightSkill, onHighlight);
    return () => window.removeEventListener(events.highlightSkill, onHighlight);
  }, []);

  const options: ("all" | SkillTrack)[] = ["all", "fe", "da", "tl"];
  const fine = useFinePointer();
  // Triggered by the always-visible <pre>, so the reveal can't get stuck hidden.
  const sqlRef = useRef<HTMLPreElement>(null);
  const sqlInView = useInView(sqlRef, { once: true, amount: 0.3 });
  const reduce = useReducedMotionSafe();
  // Selected track floats to the front with a layout animation; the rest dim behind it.
  const ordered = track === "all" ? skills : [...skills.filter((s) => s.track === track), ...skills.filter((s) => s.track !== track)];

  return (
    <section id="skills" aria-labelledby="skills-h" className="wrap">
      <SectionHeading
        id="skills-h"
        eyebrow="Skills"
        title="My toolkit."
        aside={
          <div role="group" aria-label="Highlight skills by track" className="no-print flex flex-wrap gap-2">
            {options.map((o) => (
              <button
                key={o}
                type="button"
                aria-pressed={track === o}
                onClick={() => setTrack(o)}
                className="relative cursor-pointer rounded-full border border-line-2 bg-glass px-3.5 py-[7px] text-[13px] text-fg-2 transition-colors aria-pressed:border-transparent aria-pressed:text-on-accent"
              >
                {track === o && (
                  <motion.span layoutId="skill-filter" className="absolute inset-0 rounded-full bg-linear-to-r from-a1 to-a2" />
                )}
                <span className="relative">{o === "all" ? "All" : skillTrackLabels[o]}</span>
              </button>
            ))}
          </div>
        }
      />
      <Stagger className="grid grid-cols-12 gap-4" stagger={0.12}>
        <TiltCard max={2} glare={false} className="glass spot col-span-12 p-[clamp(20px,2.4vw,30px)] lg:col-span-7">
          <motion.ul
            className="flex flex-wrap gap-2.5"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.025, delayChildren: 0.2 } } }}
          >
            {ordered.map((s) => {
              const dim = track !== "all" && s.track !== track;
              return (
                <motion.li
                  key={s.name}
                  layout
                  id={`skill-${s.name.replace(/\W+/g, "-").toLowerCase()}`}
                  variants={{
                    hidden: { opacity: 0, y: 24, scale: 0.6 },
                    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 320, damping: 20 } },
                  }}
                  transition={{ layout: { type: "spring", stiffness: 350, damping: 30 } }}
                >
                  <motion.span
                    drag={fine && !reduce}
                    dragSnapToOrigin
                    dragElastic={0.7}
                    dragTransition={{ bounceStiffness: 300, bounceDamping: 14 }}
                    animate={{
                      opacity: dim ? 0.22 : 1,
                      scale: dim ? 0.92 : flash === s.name ? 1.14 : 1,
                      filter: dim ? "blur(1.5px)" : "blur(0px)",
                    }}
                    whileHover={dim ? undefined : { y: -4, rotate: -2, scale: 1.06 }}
                    whileDrag={{ scale: 1.15, rotate: -4, zIndex: 20, boxShadow: "0 20px 40px -12px var(--shadow)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={cn(
                      "relative block select-none rounded-[14px] border border-line bg-glass px-4 py-2.5 font-mono text-[13.5px] transition-colors hover:border-a1",
                      fine && !reduce && "cursor-grab touch-none active:cursor-grabbing",
                      flash === s.name && "border-a1",
                    )}
                    style={{ borderLeft: `3px solid ${trackColor[s.track]}` }}
                  >
                    {s.name}
                  </motion.span>
                </motion.li>
              );
            })}
          </motion.ul>
          <div className="mt-[18px] flex flex-wrap items-center gap-4 font-mono text-[11.5px] text-fg-3">
            {(Object.keys(skillTrackLabels) as SkillTrack[]).map((t) => (
              <span key={t} className="inline-flex items-center gap-[7px]">
                <i className="size-2.5 rounded-[3px]" style={{ background: trackColor[t] }} />
                {t === "tl" ? "Platforms & tools" : skillTrackLabels[t]}
              </span>
            ))}
            {fine && !reduce && <span className="no-print ml-auto">Psst: the chips are draggable</span>}
          </div>
        </TiltCard>
        <TiltCard max={3} className="glass spot col-span-12 p-[clamp(20px,2.4vw,30px)] lg:col-span-5">
          <span className="label">
            <span className="dot" />
            A query I&apos;d actually write
          </span>
          <div className="relative">
            <CopyButton text={SQL} label="SQL query" className="glass-solid absolute right-2.5 top-2.5 z-[5]" />
            <pre
              ref={sqlRef}
              className="code m-0 rounded-card-sm border border-line bg-[color-mix(in_srgb,var(--bg)_70%,transparent)] p-[18px]"
            >
              <code>
                {SQL.split("\n").map((line, i) => (
                  <motion.span
                    key={i}
                    className="block"
                    initial={{ opacity: 0, x: -12 }}
                    animate={sqlInView ? { opacity: 1, x: 0 } : undefined}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.05 }}
                  >
                    {highlightSql(line)}
                  </motion.span>
                ))}
              </code>
            </pre>
          </div>
        </TiltCard>
      </Stagger>
    </section>
  );
}
