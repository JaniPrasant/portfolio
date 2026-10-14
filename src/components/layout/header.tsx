"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import { navItems, site } from "@/lib/site";
import { cn, emit, events } from "@/lib/utils";
import { PaletteSwatches, ThemeToggle } from "@/components/ui/appearance-controls";
import { ResumeButton } from "@/components/ui/resume-button";
import { useActiveSection } from "@/hooks/use-active-section";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const active = useActiveSection(navItems.map((n) => n.id));
  const menuBtn = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll, trap focus and close on Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const drawer = drawerRef.current;
    drawer?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && drawer) {
        const f = Array.from(drawer.querySelectorAll<HTMLElement>("a,button")).filter((x) => x.offsetParent !== null);
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const btn = menuBtn.current;
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      btn?.focus({ preventScroll: true });
    };
  }, [open]);

  const highlight = hovered ?? active;
  const [entranceDelay] = useState(() =>
    typeof document !== "undefined" && !document.documentElement.classList.contains("no-splash") ? 0.95 : 0,
  );

  return (
    <header className="no-print sticky top-[env(safe-area-inset-top,0px)] z-[90] pt-3.5">
      <div className="wrap">
        <motion.div
          initial={{ y: -70, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 18, delay: entranceDelay }}
          className={cn(
            "glass flex items-center gap-2.5 rounded-[20px] py-2 pl-3.5 pr-2 transition-[background-color] duration-300",
            scrolled && "glass-solid",
          )}
        >
          <a href="#top" className="flex items-center gap-2.5 whitespace-nowrap font-semibold no-underline" aria-label={`${site.name}, back to top`}>
            <motion.span
              whileHover={{ rotate: -12, scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
              className="animate-shift grid size-[34px] place-items-center rounded-[11px] bg-linear-to-br from-a1 via-a2 to-a3 font-display text-[12.5px] font-bold text-on-accent"
            >
              PJ
            </motion.span>
            <span>{site.name}</span>
          </a>

          <nav aria-label="Primary" className="mx-auto hidden xl:block" onMouseLeave={() => setHovered(null)}>
            <ul className="flex gap-0.5 p-1">
              {navItems.map((item) => (
                <li key={item.id} className="relative">
                  {highlight === item.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-[10px] border border-line bg-glass-2"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <a
                    href={`#${item.id}`}
                    aria-current={active === item.id ? "true" : undefined}
                    onMouseEnter={() => setHovered(item.id)}
                    className="relative z-[1] block rounded-[10px] px-3.5 py-[7px] text-sm text-fg-2 no-underline transition-colors hover:text-fg aria-[current=true]:text-fg"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 xl:ml-0">
            <PaletteSwatches className="hidden xl:flex" />
            <button
              type="button"
              onClick={() => emit(events.openSearch)}
              aria-label="Search the site"
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line text-[13px] text-fg-2 transition-colors hover:bg-glass-2 hover:text-fg xl:w-auto xl:justify-start xl:pl-3 xl:pr-2.5"
            >
              <Search className="size-[18px]" aria-hidden />
              <span className="hidden xl:inline">Search</span>
              <span className="kbd hidden xl:inline">⌘K</span>
            </button>
            <ThemeToggle />
            <ResumeButton size="sm" label="Résumé" className="hidden xl:inline-flex" />
            <button
              ref={menuBtn}
              type="button"
              className="icon-btn xl:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-drawer"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-[18px]" aria-hidden />
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex flex-col bg-[color-mix(in_srgb,var(--bg)_84%,transparent)] px-[18px] pb-[calc(24px+env(safe-area-inset-bottom,0px))] pt-[calc(16px+env(safe-area-inset-top,0px))] backdrop-blur-[28px] backdrop-saturate-[1.7]"
          >
            <div className="flex items-center justify-between px-1 py-1.5">
              <span className="flex items-center gap-2.5 font-semibold">
                <span className="grid size-[34px] place-items-center rounded-[11px] bg-linear-to-br from-a1 via-a2 to-a3 font-display text-[12.5px] font-bold text-on-accent">
                  PJ
                </span>
                {site.name}
              </span>
              <button type="button" className="icon-btn" aria-label="Close menu" onClick={() => setOpen(false)}>
                <X className="size-[18px]" aria-hidden />
              </button>
            </div>
            <nav aria-label="Mobile" className="mt-6 flex flex-col">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.04 * i, type: "spring", stiffness: 300, damping: 24 }}
                  className="flex items-baseline justify-between border-b border-line px-1.5 py-3.5 font-display text-[clamp(1.5rem,7vw,2.1rem)] font-semibold tracking-tight no-underline"
                >
                  {item.label}
                  <span className="font-mono text-xs font-normal tracking-normal text-fg-3">{String(i + 1).padStart(2, "0")}</span>
                </motion.a>
              ))}
            </nav>
            <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-5">
              <ResumeButton onBeforeOpen={() => setOpen(false)} />
              <ThemeToggle />
              <PaletteSwatches />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
