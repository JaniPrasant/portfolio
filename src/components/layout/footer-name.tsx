"use client";

import { motion } from "motion/react";

/** Footer signature: letters drop in on a spring when the footer scrolls into view. */
export function FooterName() {
  const first = "Prashant".split("");
  const last = "Jani".split("");
  const letter = {
    hidden: { y: "100%", opacity: 0, rotate: 12 },
    show: { y: "0%", opacity: 1, rotate: 0, transition: { type: "spring", stiffness: 260, damping: 18 } },
  } as const;
  return (
    <motion.span
      className="inline-flex overflow-hidden font-display text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-tight text-fg"
      aria-label="Prashant Jani"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.8 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
    >
      {first.map((c, i) => (
        <motion.span key={`f${i}`} aria-hidden className="inline-block" variants={letter}>
          {c}
        </motion.span>
      ))}
      <span aria-hidden>&nbsp;</span>
      {last.map((c, i) => (
        <motion.span key={`l${i}`} aria-hidden className="grad-text inline-block" variants={letter}>
          {c}
        </motion.span>
      ))}
    </motion.span>
  );
}
