import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollWords, Stagger, TiltCard } from "@/components/motion/primitives";
import { LensSwitch } from "./lens-switch";
import { LocalClock } from "./local-clock";

export function About() {
  return (
    <section id="about" aria-labelledby="about-h" className="wrap">
      <SectionHeading
        id="about-h"
        eyebrow="About"
        title="Two lenses, one engineer."
        aside={<p className="max-w-[44ch] text-fg-2">Switch the lens to see how I approach the same problem from each side.</p>}
      />
      <Stagger className="grid grid-cols-12 gap-4" stagger={0.1}>
        <TiltCard max={2} className="glass spot col-span-12 flex flex-col gap-4 p-[clamp(20px,2.4vw,30px)] lg:col-span-7">
          <ScrollWords
            className="font-display text-[clamp(1.3rem,2.4vw,1.85rem)] leading-tight tracking-[-0.025em]"
            text="Six years of shipping interfaces, then a deliberate turn toward the numbers behind them."
          />
          <p className="max-w-[62ch] text-fg-2">
            I started in 2017 turning Figma and PSD designs into pixel-perfect templates, then built more than 50 Magento 2 and PrestaShop
            storefronts. At Baltic Capital Partners I built React and TypeScript features for an NFT property marketplace, including
            listings, auctions and dashboards on a Laravel backend.
          </p>
          <p className="max-w-[62ch] text-fg-2">
            Those dashboards pulled me toward the data. In 2025 I began a postgraduate program in Data Science and AI/ML at IIT Guwahati
            through Masai School. Today I&apos;m a UI Developer at Benchmark Gensuite and build data projects alongside it.
          </p>
        </TiltCard>
        <TiltCard max={2} className="glass spot col-span-12 p-[clamp(20px,2.4vw,30px)] lg:col-span-5">
          <span className="label">
            <span className="dot" />
            Switch lens
          </span>
          <LensSwitch />
        </TiltCard>
        <TiltCard className="glass spot col-span-12 p-[clamp(20px,2.4vw,30px)] sm:col-span-6 lg:col-span-4">
          <span className="label">
            <span className="dot dot-live" />
            Now
          </span>
          <h3 className="font-display text-lg tracking-tight">UI Developer / Lead Product Developer</h3>
          <p className="mt-1.5 text-sm text-fg-2">Benchmark Gensuite · remote contract since June 2026</p>
        </TiltCard>
        <TiltCard className="glass spot col-span-12 p-[clamp(20px,2.4vw,30px)] sm:col-span-6 lg:col-span-4">
          <span className="label">
            <span className="dot" />
            Local time
          </span>
          <LocalClock />
          <p className="mt-1.5 text-sm text-fg-2">Navsari, Gujarat. Overlaps well with European mornings.</p>
        </TiltCard>
        <TiltCard className="glass spot col-span-12 p-[clamp(20px,2.4vw,30px)] lg:col-span-4">
          <span className="label">
            <span className="dot" />
            Studying
          </span>
          <h3 className="font-display text-lg tracking-tight">PG in Data Science &amp; AI/ML</h3>
          <p className="mt-1.5 text-sm text-fg-2">IIT Guwahati via Masai School · 2025–2026</p>
        </TiltCard>
      </Stagger>
    </section>
  );
}
