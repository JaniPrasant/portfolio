"use client";

import { useReducedMotionSafe } from "@/components/motion/primitives";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";
import { stats } from "@/lib/content";
import { ParticleField } from "@/components/effects/particle-field";
import { ResumeButton } from "@/components/ui/resume-button";
import { CountUp, EASE, MaskedWords, TiltCard, useMagnetic } from "@/components/motion/primitives";
import { PhotoFlip, RotatingWord } from "./hero-parts";

/** First visit shows the splash for about a second, so the hero entrance waits for it. */
function useEntranceDelay() {
  const [delay] = useState(() =>
    typeof document !== "undefined" && !document.documentElement.classList.contains("no-splash") ? 1.05 : 0.1,
  );
  return delay;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const d = useEntranceDelay();
  const magnetic = useMagnetic(0.25);

  // Scroll-linked parallax: copy drifts up and fades, the photo sinks and turns slightly.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const copyY = useTransform(p, [0, 1], [0, -110]);
  const copyOpacity = useTransform(p, [0, 0.75], [1, 0.15]);
  const photoY = useTransform(p, [0, 1], [0, 140]);
  const photoRotate = useTransform(p, [0, 1], [0, -5]);
  const photoScale = useTransform(p, [0, 1], [1, 0.92]);

  const up = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.8, ease: EASE, delay: d + delay },
  });

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative pb-5 pt-[clamp(40px,7vw,90px)]">
      <ParticleField className="no-print pointer-events-none absolute inset-x-0 -top-[120px] -z-10 h-[calc(100%+120px)] w-full [mask-image:linear-gradient(#000_70%,transparent)]" />
      <div className="wrap">
        <div className="grid items-center gap-[clamp(28px,5vw,64px)] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          <motion.div style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}>
            <motion.span
              {...up(0)}
              className="glass inline-flex max-w-full flex-wrap items-center gap-x-2.5 gap-y-0.5 rounded-full py-[7px] pl-2.5 pr-3.5 text-[12.5px] text-fg-2 sm:text-[13.5px]"
            >
              <span className="dot dot-live" />
              <b className="whitespace-nowrap font-medium text-fg">Open to roles</b>
              <span>Frontend engineering &amp; data analytics</span>
            </motion.span>
            <h1
              id="hero-title"
              className="mt-[26px] font-display text-[clamp(2.5rem,6.6vw,5.6rem)] font-bold leading-none tracking-[-0.045em]"
            >
              <span className="sr-only">Frontend engineer turning data into interfaces.</span>
              <span aria-hidden>
                <MaskedWords text="Frontend engineer" className="block" delay={d + 0.08} />
                <MaskedWords text="turning data into" className="block" delay={d + 0.22} />
                <motion.span
                  className="block overflow-hidden pb-[0.06em]"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.9, ease: EASE, delay: d + 0.42 }}
                >
                  <RotatingWord />
                </motion.span>
              </span>
            </h1>
            <motion.p {...up(0.55)} className="mt-[26px] max-w-[54ch] text-[clamp(1.02rem,1.5vw,1.2rem)] text-fg-2">
              I&apos;m <strong className="font-medium text-fg">Prashant Jani</strong>. I&apos;ve spent{" "}
              <strong className="font-medium text-fg">6+ years</strong> shipping production UI for SaaS, fintech and e-commerce, and now
              pair it with Python, SQL and analytics from a postgraduate program at{" "}
              <strong className="font-medium text-fg">IIT Guwahati</strong>.
            </motion.p>
            <motion.div {...up(0.68)} className="no-print mt-8 flex flex-wrap gap-3">
              <motion.a href="#work" className="btn btn-primary" {...magnetic}>
                See my work
                <ArrowRight className="arrow size-[18px]" aria-hidden />
              </motion.a>
              <ResumeButton variant="ghost" />
            </motion.div>
            <motion.ul
              className="mt-7 flex flex-wrap gap-2"
              aria-label="Profiles"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: d + 0.8 } } }}
            >
              {site.socials.map((s) => (
                <motion.li
                  key={s.label}
                  variants={{ hidden: { opacity: 0, y: 12, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1 } }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-glass px-3.5 py-[7px] text-[13px] text-fg-2 no-underline transition-colors hover:border-a1 hover:text-fg"
                  >
                    {s.label}
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            className="no-print"
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 16, delay: d + 0.3 }}
          >
            <motion.div style={reduce ? undefined : { y: photoY, rotate: photoRotate, scale: photoScale }}>
              <PhotoFlip />
            </motion.div>
          </motion.div>
        </div>

        <motion.ul
          className="mt-[clamp(40px,6vw,72px)] grid grid-cols-2 gap-4 lg:grid-cols-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: d + 0.2 } } }}
        >
          {stats.map((s) => (
            <TiltCard as="li" key={s.label} max={8} className="glass spot flex flex-col gap-1.5 px-6 py-[22px]">
              <span className="grad-text font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-none tracking-[-0.04em]">
                <CountUp to={s.value} />
                {s.suffix && <small className="text-[0.55em]">{s.suffix}</small>}
              </span>
              <span className="text-[13.5px] text-fg-2">{s.label}</span>
            </TiltCard>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
