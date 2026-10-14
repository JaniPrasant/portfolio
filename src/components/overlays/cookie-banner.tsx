"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Cookie } from "lucide-react";
import { storageKeys } from "@/lib/site";
import { safeStorage } from "@/lib/utils";
import { useUI } from "@/components/providers/ui-provider";
import { loadAnalytics } from "@/lib/analytics";

type Consent = "all" | "essential";

export function CookieBanner() {
  const { toast } = useUI();
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = safeStorage.get(storageKeys.consent) as Consent | null;
    if (saved === "all") loadAnalytics();
    if (saved) return;
    const t = setTimeout(() => setOpen(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // On phones the banner spans the width, so lift the floating buttons above it.
  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      const h = open && ref.current && window.innerWidth < 520 ? ref.current.offsetHeight + 12 : 0;
      root.style.setProperty("--banner-offset", `${h}px`);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open, details]);

  const choose = (c: Consent) => {
    safeStorage.set(storageKeys.consent, c);
    if (c === "all") loadAnalytics();
    setOpen(false);
    toast(c === "all" ? "Thanks. Analytics enabled." : "Saved. Essential cookies only.");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="region"
          aria-label="Cookie preferences"
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          className="glass glass-solid no-print fixed bottom-[calc(16px+env(safe-area-inset-bottom,0px))] left-4 z-[110] w-[min(420px,calc(100%-32px))] p-5"
        >
          <div className="mb-2.5 flex items-center gap-3">
            <Cookie className="size-[22px] text-a1" aria-hidden />
            <b className="font-display text-[15px] tracking-[-0.01em]">Cookies, kept small</b>
          </div>
          <p className="text-[13.5px] text-fg-2">
            One cookie remembers your theme and palette. With your OK, privacy-friendly analytics count visits. No ads, no cross-site tracking.
          </p>
          {details && (
            <p id="cookie-details" className="mt-2 text-[12.5px] text-fg-3">
              Essential: theme, palette and this choice, stored in your browser. Analytics: page views and referrer only, no personal data, kept for
              14 months.
            </p>
          )}
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <button type="button" className="btn btn-primary btn-sm" onClick={() => choose("all")}>
              Accept analytics
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => choose("essential")}>
              Essential only
            </button>
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 text-[13px] text-fg underline underline-offset-[3px]"
              aria-expanded={details}
              aria-controls="cookie-details"
              onClick={() => setDetails((d) => !d)}
            >
              {details ? "Hide details" : "Details"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
