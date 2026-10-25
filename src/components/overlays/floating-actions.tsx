"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "motion/react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { prefersReducedMotion, scrollToId } from "@/lib/utils";
import { useMagnetic } from "@/components/motion/primitives";

const R = 24;
const C = 2 * Math.PI * R;

/** Back-to-top button with a scroll-progress ring, plus a floating "Let's talk" button that hides at the contact section. */
export function FloatingActions() {
  const { scrollY, scrollYProgress } = useScroll();
  const [showTop, setShowTop] = useState(false);
  const [progress, setProgress] = useState(0);
  const [atContact, setAtContact] = useState(false);
  const magnetic = useMagnetic(0.3);

  useMotionValueEvent(scrollY, "change", (y) => setShowTop(y > 600));
  useMotionValueEvent(scrollYProgress, "change", (p) => setProgress(p));

  useEffect(() => {
    const el = document.getElementById("contact");
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setAtContact(!!entry?.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="no-print fixed bottom-[calc(16px+env(safe-area-inset-bottom,0px)+var(--banner-offset,0px))] right-4 z-[80] flex flex-col items-end gap-2.5 transition-[bottom] duration-500">
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="top"
            type="button"
            aria-label="Back to top"
            initial={{ opacity: 0, y: 14, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.8 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
              document.getElementById("main")?.focus({ preventScroll: true });
            }}
            className="glass glass-solid relative grid size-[50px] cursor-pointer place-items-center rounded-full"
          >
            <svg viewBox="0 0 52 52" className="absolute -inset-px size-[52px] -rotate-90" aria-hidden>
              <defs>
                <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="var(--a1)" />
                  <stop offset="1" stopColor="var(--a3)" />
                </linearGradient>
              </defs>
              <circle cx="26" cy="26" r={R} fill="none" stroke="url(#ring-grad)" strokeWidth="2.4" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - progress)} />
            </svg>
            <ArrowUp className="size-[18px]" aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!atContact && (
          <motion.div
            key="talk"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <motion.button
              type="button"
              aria-label="Contact Prashant"
              {...magnetic}
              whileHover={{ scale: 1.04 }}
              onClick={() => {
                scrollToId("contact");
                setTimeout(() => document.getElementById("f-name")?.focus({ preventScroll: true }), prefersReducedMotion() ? 0 : 700);
              }}
              className="btn btn-primary h-[54px] w-[54px] px-0 font-semibold sm:w-auto sm:pl-[18px] sm:pr-[22px]"
            >
              <MessageCircle className="size-[19px]" aria-hidden />
              <span className="hidden sm:inline">Let&apos;s talk</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
