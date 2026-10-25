"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="no-print pointer-events-none fixed inset-x-0 top-0 z-[120] h-[3px] origin-left bg-linear-to-r from-a1 via-a2 to-a3"
    />
  );
}
