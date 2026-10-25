"use client";

import { useReducedMotionSafe } from "@/components/motion/primitives";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";
import { marqueeRows } from "@/lib/content";

const dotColors = ["var(--a1)", "var(--a2)", "var(--a3)", "var(--a4)"];

/**
 * Velocity-driven marquee: it drifts on its own, speeds up as you scroll faster,
 * and flips direction when you scroll back up. Hovering pauses it.
 */
function VelocityRow({ items, baseVelocity }: { items: string[]; baseVelocity: number }) {
  const reduce = useReducedMotionSafe();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);
  const paused = useRef(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rowRef, { margin: "100px" });

  useAnimationFrame((_, delta) => {
    if (reduce || paused.current || !inView) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    moveBy += direction.current * moveBy * f;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      ref={rowRef}
      className="overflow-hidden"
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
    >
      <motion.div className="flex w-max gap-3 pr-3" style={{ x }}>
        {[0, 1].map((copy) =>
          items.map((t, i) => (
            <motion.span
              key={`${copy}-${t}`}
              aria-hidden={copy === 1 || undefined}
              whileHover={{ y: -4, scale: 1.06 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-glass px-5 py-3 font-mono text-sm transition-colors hover:border-a1"
            >
              <motion.i
                className="size-[9px] rounded-[3px]"
                style={{ background: dotColors[i % 4] }}
                initial={{ rotate: 45 }}
                whileHover={{ rotate: 225 }}
              />
              {t}
            </motion.span>
          )),
        )}
      </motion.div>
    </div>
  );
}

export function Marquee() {
  return (
    <div
      className="no-print flex flex-col gap-3 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]"
      aria-label="Technologies I use"
      role="region"
    >
      <VelocityRow items={marqueeRows[0]!} baseVelocity={-2.2} />
      <VelocityRow items={marqueeRows[1]!} baseVelocity={2} />
    </div>
  );
}
