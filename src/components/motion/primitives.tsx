"use client";

/**
 * Shared Motion building blocks used across the site.
 *
 *  Reveal / Stagger / StaggerItem  scroll-triggered entrances (whileInView + variants)
 *  TiltCard                         spring-driven 3D tilt with a light glare that follows the pointer
 *  useMagnetic                      buttons that lean toward the cursor on springs
 *  ScrollWords                      text whose words light up as you scroll past it
 *  CountUp                          numbers that count up with motion's animate()
 *
 * Every effect honours prefers-reduced-motion (MotionConfig reducedMotion="user" in
 * AppProviders, plus explicit checks for pointer- and scroll-linked values).
 */

import { useEffect, useRef, useState, useSyncExternalStore, type ElementType, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
  type MotionValue,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";

export const EASE = [0.16, 1, 0.3, 1] as const;
export const SPRING = { type: "spring", stiffness: 260, damping: 24 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
};

const motionTags = {
  div: motion.div,
  li: motion.li,
  ul: motion.ul,
  section: motion.section,
  article: motion.article,
  p: motion.p,
  span: motion.span,
  details: motion.details,
} as const;
type Tag = keyof typeof motionTags;

type BaseProps = Omit<HTMLMotionProps<"div">, "ref"> & { as?: Tag; className?: string; children?: ReactNode };

/** Fades/rises its content in the first time it scrolls into view. */
export function Reveal({ as = "div", delay = 0, className, children, ...rest }: BaseProps & { delay?: number }) {
  const M = motionTags[as] as ElementType;
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: fadeUp.hidden,
        show: { ...(fadeUp.show as object), transition: { duration: 0.8, ease: EASE, delay } },
      }}
      {...rest}
    >
      {children}
    </M>
  );
}

/** Parent that reveals its StaggerItem children one after another. */
export function Stagger({
  as = "div",
  className,
  children,
  stagger = 0.08,
  delay = 0,
  amount = 0.15,
  ...rest
}: BaseProps & { stagger?: number; delay?: number; amount?: number }) {
  const M = motionTags[as] as ElementType;
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...rest}
    >
      {children}
    </M>
  );
}

export function StaggerItem({ as = "div", className, children, ...rest }: BaseProps) {
  const M = motionTags[as] as ElementType;
  return (
    <M className={className} variants={fadeUp} {...rest}>
      {children}
    </M>
  );
}

const REDUCE = "(prefers-reduced-motion: reduce)";
function subscribeReduce(cb: () => void) {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
/**
 * Hydration-safe reduced-motion flag: false on the server and during hydration,
 * then the real OS setting. (Motion's own hook can differ between server and client.)
 */
export function useReducedMotionSafe() {
  return useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE).matches, () => false);
}

const FINE = "(pointer: fine)";
function subscribeFine(cb: () => void) {
  const mq = window.matchMedia(FINE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
/** True on mouse/trackpad devices (not touch). False during server render. */
function useFinePointer() {
  return useSyncExternalStore(subscribeFine, () => window.matchMedia(FINE).matches, () => false);
}
export { useFinePointer };

/**
 * Card that tilts toward the pointer on springs, lifts on hover and shows a soft glare.
 * Works as a StaggerItem too (it carries the fadeUp variants), so a parent <Stagger>
 * can reveal it, and children can react to its "hover" variant.
 */
export function TiltCard({
  as = "div",
  className,
  children,
  max = 6,
  lift = 6,
  glare = true,
  ...rest
}: BaseProps & { max?: number; lift?: number; glare?: boolean }) {
  const M = motionTags[as] as ElementType;
  const reduce = useReducedMotionSafe();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useMotionValue(0);
  const spring = { stiffness: 180, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glareOpacity = useSpring(hover, { stiffness: 200, damping: 30 });
  const glareBg = useMotionTemplate`radial-gradient(360px circle at ${gx} ${gy}, rgb(255 255 255 / 0.13), transparent 60%)`;

  return (
    <M
      className={cn("relative", className)}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1100 }}
      variants={{ ...fadeUp, hover: { y: reduce ? 0 : -lift, transition: SPRING } }}
      whileHover="hover"
      onPointerMove={(e: React.PointerEvent<HTMLElement>) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
        hover.set(1);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
        hover.set(0);
      }}
      {...rest}
    >
      {children}
      {glare && !reduce && (
        <motion.span
          aria-hidden
          className="no-print pointer-events-none absolute inset-0 z-[4] rounded-[inherit]"
          style={{ background: glareBg, opacity: glareOpacity }}
        />
      )}
    </M>
  );
}

/** Spread onto a motion.button / motion.a so it leans toward the cursor. */
export function useMagnetic(strength = 0.3) {
  const reduce = useReducedMotionSafe();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 16, mass: 0.4 });
  return {
    style: { x: sx, y: sy },
    whileTap: { scale: 0.95 },
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      if (reduce || e.pointerType !== "mouse") return;
      const r = e.currentTarget.getBoundingClientRect();
      x.set((e.clientX - r.left - r.width / 2) * strength);
      y.set((e.clientY - r.top - r.height / 2) * strength);
    },
    onPointerLeave: () => {
      x.set(0);
      y.set(0);
    },
  };
}

function ScrollWord({ progress, range, children }: { progress: MotionValue<number>; range: [number, number]; children: string }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
}

/** Headline whose words light up one by one as it scrolls through the viewport. */
export function ScrollWords({ text, className, as: Tag = "h3" }: { text: string; className?: string; as?: "h2" | "h3" | "p" }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.92", "start 0.4"] });
  const words = text.split(" ");
  return (
    <Tag ref={ref} className={className}>
      {reduce ? (
        text
      ) : (
        <>
          <span className="sr-only">{text}</span>
          <span aria-hidden>
            {words.map((w, i) => (
              <ScrollWord key={`${w}-${i}`} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                {w}
              </ScrollWord>
            ))}
          </span>
        </>
      )}
    </Tag>
  );
}

/** Number that counts up with an eased spring-like curve when it enters the viewport. */
export function CountUp({ to, duration = 1.6 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotionSafe();
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, { duration, ease: EASE, onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, to, duration]);

  return <span ref={ref}>{value}</span>;
}

/** Splits text into words that rise out of a mask with a stagger. */
export function MaskedWords({ text, className, delay = 0, stagger = 0.06 }: { text: string; className?: string; delay?: number; stagger?: number }) {
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {text.split(" ").map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", rotate: 6 },
              show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: EASE } },
            }}
          >
            {w}
            {" "}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
