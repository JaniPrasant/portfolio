"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { faqs } from "@/lib/content";
import { cn, events } from "@/lib/utils";
import { Stagger, StaggerItem } from "@/components/motion/primitives";

/** Accordion: answers spring open to their natural height; one open at a time. */
export function FaqList() {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();

  // The site search opens a specific question.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const i = faqs.findIndex((f) => f.q === (e as CustomEvent<string>).detail);
      if (i >= 0) setOpen(i);
    };
    window.addEventListener(events.openFaq, onOpen);
    return () => window.removeEventListener(events.openFaq, onOpen);
  }, []);

  return (
    <Stagger className="flex flex-col gap-2.5" stagger={0.07}>
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <StaggerItem
            key={f.q}
            id={`faq-${i}`}
            className={cn("glass overflow-hidden rounded-[20px] transition-colors", isOpen && "border-line-2")}
          >
            <h3>
              <motion.button
                type="button"
                id={`${uid}-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-a-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                whileTap={{ scale: 0.99 }}
                className="flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-[22px] py-5 text-left text-base font-medium"
              >
                {f.q}
                <motion.span
                  aria-hidden
                  animate={{ rotate: isOpen ? 135 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className={cn(
                    "grid size-7 flex-none place-items-center rounded-full border transition-colors",
                    isOpen ? "border-transparent bg-linear-to-br from-a1 to-a2 text-on-accent" : "border-line-2",
                  )}
                >
                  <Plus className="size-3.5" />
                </motion.span>
              </motion.button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="answer"
                  id={`${uid}-a-${i}`}
                  role="region"
                  aria-labelledby={`${uid}-q-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ height: { type: "spring", stiffness: 260, damping: 30 }, opacity: { duration: 0.25 } }}
                  className="faq-panel overflow-hidden"
                >
                  <motion.p
                    initial={{ y: -8, filter: "blur(4px)" }}
                    animate={{ y: 0, filter: "blur(0px)" }}
                    exit={{ y: -8, filter: "blur(4px)" }}
                    className="max-w-[70ch] px-[22px] pb-[22px] text-[15px] text-fg-2"
                  >
                    {f.a}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Every answer prints, even when collapsed on screen */}
            {!isOpen && <p className="hidden px-[22px] pb-4 text-[15px] print-block">{f.a}</p>}
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
