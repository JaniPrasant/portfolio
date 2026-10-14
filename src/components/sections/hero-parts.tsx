"use client";

import { useReducedMotionSafe } from "@/components/motion/primitives";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { RefreshCw } from "lucide-react";
import { EASE, useFinePointer } from "@/components/motion/primitives";

const WORDS = ["interfaces.", "dashboards.", "insights.", "decisions."];

/** Rotating gradient word in the hero headline: each word flips in letter by letter. */
export function RotatingWord() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotionSafe();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      if (!document.hidden) setI((n) => (n + 1) % WORDS.length);
    }, 2800);
    return () => clearInterval(id);
  }, [reduce]);

  const word = WORDS[i]!;
  return (
    <span className="relative inline-grid align-bottom [perspective:600px]">
      {/* Reserve width for the longest word so the line never jumps */}
      <span className="invisible col-start-1 row-start-1" aria-hidden>
        dashboards.
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={word}
          className="col-start-1 row-start-1 whitespace-nowrap"
          initial="enter"
          animate="center"
          exit="exit"
          variants={{ center: { transition: { staggerChildren: 0.035 } }, exit: { transition: { staggerChildren: 0.02 } } }}
        >
          {word.split("").map((ch, k) => (
            <motion.span
              key={k}
              className="grad-text inline-block [transform-origin:50%_100%]"
              variants={{
                enter: { y: "70%", opacity: 0, rotateX: -80 },
                center: { y: "0%", opacity: 1, rotateX: 0, transition: { duration: 0.6, ease: EASE } },
                exit: { y: "-50%", opacity: 0, rotateX: 70, transition: { duration: 0.35, ease: EASE } },
              }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const chips = [
  { label: "React", color: "var(--a1)", pos: "top-[9%] -left-[4%] xl:-left-[10%]", dur: 4.2 },
  { label: "Python", color: "var(--a3)", pos: "top-[42%] -right-[4%] xl:-right-[12%]", dur: 5 },
  { label: "TypeScript", color: "var(--a2)", pos: "bottom-[42%] -left-[6%] sm:bottom-[30%] xl:-left-[14%]", dur: 4.6 },
  { label: "SQL", color: "var(--a4)", pos: "-top-[4%] right-[6%]", dur: 3.8 },
];

/**
 * Photo card: tilts toward the cursor with a moving glare, flips on click to the
 * off-duty photo, and the floating tech chips can be dragged and spring back.
 */
export function PhotoFlip() {
  const [flipped, setFlipped] = useState(false);
  const reduce = useReducedMotionSafe();
  const fine = useFinePointer();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [10, -10]), { stiffness: 150, damping: 16 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-12, 12]), { stiffness: 150, damping: 16 });
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, rgb(255 255 255 / 0.22), transparent 55%)`;

  const faces = [
    {
      src: "/img/portrait.webp",
      alt: "Prashant Jani smiling in a white shirt in front of a red brick wall",
      title: "Prashant Jani",
      caption: "NAVSARI · IST",
      hint: "TAP TO FLIP",
      back: false,
    },
    {
      src: "/img/casual.webp",
      alt: "Prashant Jani outdoors in blue mirrored sunglasses and a black t-shirt",
      title: "Off duty",
      caption: "STILL THINKING IN SQL",
      hint: "FLIP BACK",
      back: true,
    },
  ];

  return (
    <div className="relative mx-auto aspect-[1/1.12] w-[min(78%,360px)] [perspective:1200px] lg:w-[min(100%,400px)] min-[1500px]:w-[min(100%,440px)]">
      <div
        aria-hidden
        className="animate-halo absolute -inset-3.5 -z-10 rounded-[44px] opacity-55 blur-[22px]"
        style={{ background: "conic-gradient(from var(--halo-angle), var(--a1), var(--a2), var(--a3), var(--a4), var(--a1))" }}
      />
      <motion.div
        className="size-full [transform-style:preserve-3d]"
        style={reduce ? undefined : { rotateX, rotateY }}
        onPointerMove={(e) => {
          if (reduce || e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
      >
        <motion.button
          type="button"
          aria-pressed={flipped}
          aria-label={flipped ? "Flip photo: show professional photo" : "Flip photo: show off-duty photo"}
          onClick={() => setFlipped((f) => !f)}
          animate={{ rotateY: flipped ? 180 : 0 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 110, damping: 14 }}
          className="relative size-full cursor-pointer rounded-[34px] border-0 bg-transparent p-0 [transform-style:preserve-3d]"
        >
          {faces.map((f) => (
            <span
              key={f.src}
              className="absolute inset-0 overflow-hidden rounded-[34px] border border-line-2 shadow-[0_40px_80px_-40px_var(--shadow)] [backface-visibility:hidden]"
              style={f.back ? { transform: "rotateY(180deg)" } : undefined}
            >
              <Image src={f.src} alt={f.alt} fill sizes="(min-width: 1024px) 440px, 78vw" priority={!f.back} className="object-cover" />
              <span className="absolute inset-0 bg-linear-to-b from-transparent from-55% to-black/70" />
              {!reduce && <motion.span aria-hidden className="absolute inset-0 mix-blend-overlay" style={{ background: glare }} />}
              <span className="absolute inset-x-[18px] bottom-4 z-[1] flex items-end justify-between gap-2.5 text-left">
                <span>
                  <b className="block whitespace-nowrap font-display text-[15px] font-semibold text-white sm:text-[17px]">{f.title}</b>
                  <span className="font-mono text-[11.5px] tracking-[0.06em] text-white/75">{f.caption}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-black/35 px-2.5 py-1 font-mono text-[10.5px] tracking-[0.1em] text-white backdrop-blur-md">
                  <span className="hidden sm:inline">{f.hint}</span> <RefreshCw className="size-3" aria-hidden />
                </span>
              </span>
            </span>
          ))}
        </motion.button>
      </motion.div>

      {chips.map((o, i) => (
        <motion.span
          key={o.label}
          aria-hidden
          className={`absolute z-[2] ${o.pos}`}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={reduce ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, y: [0, -14, 0] }}
          transition={{
            opacity: { delay: 1.2 + i * 0.12, duration: 0.4 },
            scale: { delay: 1.2 + i * 0.12, type: "spring", stiffness: 300, damping: 14 },
            y: { duration: o.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 },
          }}
        >
          <motion.span
            drag={fine && !reduce}
            dragSnapToOrigin
            dragElastic={0.6}
            dragTransition={{ bounceStiffness: 320, bounceDamping: 12 }}
            whileHover={fine ? { scale: 1.1 } : undefined}
            whileDrag={{ scale: 1.2, rotate: -6, zIndex: 10 }}
            title={fine ? "Drag me" : undefined}
            className={`glass glass-solid inline-flex touch-none select-none items-center gap-1.5 rounded-[14px] px-3 py-2 font-mono text-xs ${fine ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"}`}
          >
            <i className="size-2 rounded-full" style={{ background: o.color }} />
            {o.label}
          </motion.span>
        </motion.span>
      ))}
    </div>
  );
}
