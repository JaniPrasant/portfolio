"use client";

import { useReducedMotionSafe } from "@/components/motion/primitives";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useFinePointer } from "@/components/motion/primitives";

/**
 * Global pointer layer.
 *  - `.spot` cards get --mx / --my so their CSS spotlight border follows the cursor.
 *  - A soft accent glow trails the cursor on springs and swells over anything clickable.
 * (Tilt and magnetic effects live in Motion components: TiltCard and useMagnetic.)
 */
export function PointerEffects() {
  const reduce = useReducedMotionSafe();
  const fine = useFinePointer();
  const enabled = fine && !reduce;
  const [visible, setVisible] = useState(false);
  const [overTarget, setOverTarget] = useState(false);
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest) return;
      const spot = target.closest<HTMLElement>(".spot");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      if (!enabled) return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      setOverTarget(!!target.closest("a, button, [role='tab'], summary, input, textarea, select"));
    };
    const onLeave = () => setVisible(false);
    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="no-print pointer-events-none fixed left-0 top-0 z-0 -ml-[170px] -mt-[170px] size-[340px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--a1)_22%,transparent),transparent_65%)]"
      style={{ x: sx, y: sy }}
      animate={{ opacity: visible ? 1 : 0, scale: overTarget ? 1.45 : 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
    />
  );
}
