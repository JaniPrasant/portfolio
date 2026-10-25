"use client";

import { motion } from "motion/react";
import { ScrambleText } from "@/components/effects/scramble-text";
import { EASE } from "@/components/motion/primitives";
import { cn } from "@/lib/utils";

/**
 * Section intro: the eyebrow rule draws in, the title rises from a mask while its
 * glyphs decode, then the side note fades up.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  aside,
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn("mb-[30px] flex flex-wrap items-end justify-between gap-x-8 gap-y-5", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
    >
      <div>
        <motion.span
          className="eyebrow"
          variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } } }}
        >
          {eyebrow}
        </motion.span>
        <h2 id={id} className="mt-3 overflow-hidden pb-[0.08em] font-display text-[clamp(1.9rem,4.6vw,3.4rem)] font-semibold tracking-[-0.03em]">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: "105%", rotate: 3 }, show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: EASE } } }}
          >
            <ScrambleText text={title} />
          </motion.span>
        </h2>
      </div>
      {aside && (
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}>
          {aside}
        </motion.div>
      )}
    </motion.div>
  );
}
