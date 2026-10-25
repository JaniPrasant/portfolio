"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Code2, ExternalLink, X } from "lucide-react";
import { projects, type Project, type Track } from "@/lib/content";
import { cn, events } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { projectArt } from "./project-art";
import { TiltCard } from "@/components/motion/primitives";

const filters: { id: "all" | Track; label: string }[] = [
  { id: "all", label: "All" },
  { id: "frontend", label: "Frontend" },
  { id: "data", label: "Data" },
];

const sizeClass: Record<Project["size"], string> = {
  wide: "md:col-span-12 lg:col-span-7",
  medium: "md:col-span-6 lg:col-span-5",
  small: "md:col-span-6 lg:col-span-4",
};

const FRAME_H = "clamp(260px, 32vw, 400px)";

function Cover({ project, inDialog = false }: { project: Project; inDialog?: boolean }) {
  const c = project.cover;
  if (c.kind === "art") {
    const Art = projectArt[c.art];
    return <Art />;
  }
  if (c.kind === "scroll" && !inDialog) {
    return (
      <Image
        src={c.src}
        alt={c.alt}
        width={c.width}
        height={c.height}
        sizes="(min-width: 1024px) 680px, 100vw"
        className="h-auto w-full"
      />
    );
  }
  return (
    <Image
      src={c.src}
      alt={c.alt}
      fill
      sizes={inDialog ? "880px" : "(min-width: 1024px) 400px, 100vw"}
      className="object-cover object-top transition-transform duration-700 ease-expo group-hover:scale-105"
    />
  );
}

export function Projects() {
  const [filter, setFilter] = useState<"all" | Track>("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const visible = projects.filter((p) => filter === "all" || p.tracks.includes(filter));
  const open = projects.find((p) => p.slug === openSlug) ?? null;

  const openProject = useCallback((slug: string) => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setOpenSlug(slug);
  }, []);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (open && dlg && !dlg.open) dlg.showModal();
  }, [open]);

  // The site search can open a case study directly.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail;
      setFilter("all");
      openProject(slug);
    };
    window.addEventListener(events.openProject, onOpen);
    return () => window.removeEventListener(events.openProject, onOpen);
  }, [openProject]);

  const close = () => dialogRef.current?.close();

  return (
    <section id="work" aria-labelledby="work-h" className="wrap">
      <SectionHeading
        id="work-h"
        eyebrow="Projects"
        title="Things I've built."
        aside={
          <div className="flex flex-col items-start gap-2.5 sm:items-end">
            <div
              role="group"
              aria-label="Filter projects"
              className="no-print relative inline-flex rounded-[14px] border border-line bg-glass p-1 backdrop-blur-md"
            >
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  className="relative cursor-pointer rounded-[10px] border-0 bg-transparent px-4 py-2 text-[13.5px] text-fg-2 transition-colors aria-pressed:text-fg"
                >
                  {filter === f.id && (
                    <motion.span layoutId="project-filter" className="absolute inset-0 rounded-[10px] border border-line-2 bg-glass-2" />
                  )}
                  <span className="relative">{f.label}</span>
                </button>
              ))}
            </div>
            <p className="font-mono text-xs text-fg-3" aria-live="polite">
              Showing {visible.length} project{visible.length === 1 ? "" : "s"} · hover a screenshot to scroll it
            </p>
          </div>
        }
      />

      <motion.ul layout className="grid grid-cols-12 gap-4">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 60, scale: 0.94, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.15 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
              transition={{ type: "spring", stiffness: 140, damping: 20, delay: (i % 3) * 0.08 }}
              className={cn("col-span-12", sizeClass[p.size])}
            >
              <TiltCard as="article" max={5} className="glass spot group flex h-full flex-col p-2.5">
                <div
                  className={cn("media", p.cover.kind === "scroll" ? "shot-scroll" : "aspect-[16/10]", p.size === "medium" && "lg:aspect-auto lg:h-[clamp(260px,32vw,400px)]")}
                  style={
                    p.cover.kind === "scroll"
                      ? ({ height: FRAME_H, "--frame-h": FRAME_H } as React.CSSProperties)
                      : undefined
                  }
                >
                  <Cover project={p} />
                  {p.cover.kind === "scroll" && (
                    <span className="absolute bottom-3 right-3 rounded-full bg-[rgb(5_6_20/0.6)] px-2.5 py-1 font-mono text-[10.5px] tracking-[0.08em] text-white backdrop-blur-md transition-opacity group-hover:opacity-0">
                      HOVER TO SCROLL ↓
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2.5 px-2.5 pb-2.5 pt-[18px]">
                  <div className="flex flex-wrap gap-[7px]">
                    {p.tags.map((t) => (
                      <span key={t.label} className={cn("chip", t.accent && `chip-${t.accent}`)}>
                        {t.label}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-display text-xl tracking-[-0.025em]">{p.title}</h3>
                  <p className="text-[14.5px] text-fg-2">{p.summary}</p>
                  <div className="mt-auto flex items-center justify-between gap-2.5 pt-1.5">
                    <span className="min-w-0 font-mono text-xs text-fg-3">{p.stackLine}</span>
                    <span className="inline-flex flex-none items-center gap-1.5 whitespace-nowrap text-[13.5px] text-fg-2 transition-colors group-hover:text-a1">
                      Case study
                      <ArrowRight className="size-[15px] transition-transform duration-300 ease-spring group-hover:translate-x-1" aria-hidden />
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-label={`Open ${p.title} case study`}
                  onClick={() => openProject(p.slug)}
                  className="absolute inset-0 z-[3] cursor-pointer rounded-card border-0 bg-transparent"
                />
              </TiltCard>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <dialog
        ref={dialogRef}
        aria-labelledby="project-dialog-title"
        className="w-[880px]"
        onClose={() => {
          setOpenSlug(null);
          lastFocus.current?.focus({ preventScroll: true });
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {open && (
          <div className="dlg max-h-[88vh] overflow-y-auto">
            <button type="button" className="icon-btn glass-solid absolute right-3.5 top-3.5 z-[3]" aria-label="Close case study" onClick={close} autoFocus>
              <X className="size-[18px]" aria-hidden />
            </button>
            <motion.div className="relative h-[clamp(200px,34vw,330px)] overflow-hidden rounded-t-card border-b border-line bg-frame" initial={{ scale: 1.08, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
              <Cover project={open} inDialog />
            </motion.div>
            <div className="flex flex-col gap-[18px] px-[clamp(20px,3vw,34px)] pb-[30px] pt-[26px]">
              <div className="flex flex-wrap gap-[7px]">
                {open.tags.map((t) => (
                  <span key={t.label} className={cn("chip", t.accent && `chip-${t.accent}`)}>
                    {t.label}
                  </span>
                ))}
              </div>
              <h2 id="project-dialog-title" className="font-display text-[clamp(1.5rem,3vw,2.2rem)] tracking-tight">
                {open.title}
              </h2>
              <p className="text-base text-fg-2">{open.lead}</p>
              <div className="grid gap-[26px] md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <div>
                  <h3 className="mb-3 font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-fg-3">What I built</h3>
                  <motion.ul
                    className="flex flex-col gap-[9px] text-[14.5px] text-fg-2"
                    initial="hidden"
                    animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
                  >
                    {open.points.map((pt) => (
                      <motion.li
                        key={pt}
                        className="grid grid-cols-[16px_minmax(0,1fr)] gap-2"
                        variants={{ hidden: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0 } }}
                      >
                        <span aria-hidden className="mt-2 size-[7px] rotate-45 rounded-[2px] bg-a1" />
                        {pt}
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
                <div className="flex flex-col gap-[22px]">
                  <div>
                    <h3 className="mb-3 font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-fg-3">Stack</h3>
                    <div className="flex flex-wrap gap-[7px]">
                      {open.stack.map((s) => (
                        <span key={s} className="chip">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-fg-3">Links</h3>
                    {open.links.length ? (
                      <div className="flex flex-wrap gap-2.5">
                        {open.links.map((l, i) => (
                          <a
                            key={l.href}
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn("btn btn-sm", i === 0 ? "btn-primary" : "btn-ghost")}
                          >
                            {l.kind === "live" ? <ExternalLink className="size-4" aria-hidden /> : <Code2 className="size-4" aria-hidden />}
                            {l.label}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="font-mono text-[11.5px] text-fg-3">Repository and demo links coming soon.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
