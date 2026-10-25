"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { clients, experience, faqs, projects, skills, education } from "@/lib/content";
import { navItems, site } from "@/lib/site";
import { emit, events, prefersReducedMotion, scrollToId } from "@/lib/utils";
import { useAppearance } from "@/hooks/use-appearance";
import { useResumeDownload } from "@/components/ui/resume-button";
import { useCopy } from "@/components/ui/copy-button";
import { paletteName } from "@/components/ui/appearance-controls";
import { useUI } from "@/components/providers/ui-provider";

type Item = { id: string; title: string; sub?: string; type: string; keywords: string; run: () => void };

function Highlight({ text, query }: { text: string; query: string }) {
  const i = query ? text.toLowerCase().indexOf(query) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-[3px] bg-[color-mix(in_srgb,var(--a1)_30%,transparent)] text-inherit">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

/** Full-site search (⌘K / Ctrl+K / "/"): sections, projects, clients, companies, skills, FAQs and quick actions. */
export function CommandPalette() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const { cyclePalette, toggleTheme } = useAppearance();
  const download = useResumeDownload();
  const copy = useCopy();
  const { toast } = useUI();

  const flash = (el: Element | null) => {
    if (!el || prefersReducedMotion()) return;
    el.animate([{ transform: "scale(1)" }, { transform: "scale(1.04)" }, { transform: "scale(1)" }], {
      duration: 700,
      easing: "cubic-bezier(.34,1.56,.64,1)",
    });
  };

  const index = useMemo<Item[]>(() => {
    const items: Item[] = [];
    const sectionKeywords: Record<string, string> = {
      about: "career story background lens",
      work: "portfolio case studies github",
      clients: "websites live production nfty baltic nicolle gateway",
      experience: "work history jobs companies",
      skills: "tools stack toolkit",
      faq: "questions availability remote freelance",
      contact: "email phone hire message",
    };
    for (const n of navItems) items.push({ id: `s-${n.id}`, title: n.label, type: "Section", keywords: sectionKeywords[n.id] ?? "", run: () => scrollToId(n.id) });
    items.push({
      id: "s-frontend",
      title: "Frontend strengths",
      type: "Section",
      keywords: "figma pixel perfect responsive performance seo components accessibility",
      run: () => scrollToId("frontend"),
    });
    items.push({ id: "s-education", title: "Education & certificates", type: "Section", keywords: "degree mca bca iit guwahati masai", run: () => scrollToId("education") });
    for (const p of projects)
      items.push({
        id: `p-${p.slug}`,
        title: p.title,
        type: "Project",
        keywords: `${p.stack.join(" ")} ${p.summary}`,
        run: () => {
          scrollToId("work");
          setTimeout(() => emit(events.openProject, p.slug), prefersReducedMotion() ? 0 : 500);
        },
      });
    for (const c of clients)
      items.push({
        id: `c-${c.domain}`,
        title: c.name,
        sub: c.domain,
        type: "Client",
        keywords: c.summary,
        run: () => scrollToId("clients"),
      });
    for (const r of experience)
      items.push({
        id: `x-${r.company}`,
        title: r.company,
        sub: r.title,
        type: "Company",
        keywords: `${r.points.join(" ")} ${r.stack.join(" ")}`,
        run: () => {
          scrollToId("experience");
          emit(events.selectCompany, r.company);
        },
      });
    for (const s of skills)
      items.push({
        id: `k-${s.name}`,
        title: s.name,
        type: "Skill",
        keywords: "",
        run: () => {
          emit(events.highlightSkill, s.name);
          const el = document.getElementById(`skill-${s.name.replace(/\W+/g, "-").toLowerCase()}`);
          el?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
        },
      });
    for (const c of education.pg.curriculum)
      items.push({ id: `e-${c.label}`, title: c.label, sub: "PG curriculum", type: "Course", keywords: "iit guwahati", run: () => scrollToId("education") });
    for (const f of faqs)
      items.push({
        id: `f-${f.q}`,
        title: f.q,
        type: "FAQ",
        keywords: f.a,
        run: () => {
          emit(events.openFaq, f.q);
          const i = faqs.indexOf(f);
          setTimeout(() => {
            const el = document.getElementById(`faq-${i}`);
            el?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
            flash(el);
          }, 50);
        },
      });
    items.push(
      { id: "a-resume", title: "Download résumé", type: "Action", keywords: "cv resume pdf", run: () => void download() },
      { id: "a-email", title: "Copy email address", type: "Action", keywords: "mail contact", run: () => void copy(site.email, "Email address") },
      { id: "a-theme", title: "Toggle dark / light theme", type: "Action", keywords: "theme dark light mode", run: toggleTheme },
      {
        id: "a-palette",
        title: "Switch color palette",
        type: "Action",
        keywords: "palette colors aurora lagoon neon",
        run: () => toast(`${paletteName[cyclePalette()]} palette on`),
      },
    );
    return items;
  }, [copy, cyclePalette, download, toast, toggleTheme]);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return index.filter((i) => i.type === "Section" || i.type === "Action");
    const terms = q.split(/\s+/);
    return index
      .map((item) => {
        const t = item.title.toLowerCase();
        const k = `${item.keywords} ${item.sub ?? ""}`.toLowerCase();
        let score = 0;
        for (const w of terms) {
          if (t.startsWith(w)) score += 6;
          else if (t.includes(w)) score += 4;
          else if (k.includes(w)) score += 1;
          else return null;
        }
        return { item, score };
      })
      .filter((r): r is { item: Item; score: number } => !!r)
      .sort((a, b) => b.score - a.score)
      .slice(0, 9)
      .map((r) => r.item);
  }, [index, q]);

  const open = useCallback(() => {
    const dlg = dialogRef.current;
    if (!dlg || dlg.open) return;
    setQuery("");
    setSelected(0);
    dlg.showModal();
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const choose = (item: Item | undefined) => {
    if (!item) return;
    dialogRef.current?.close();
    setTimeout(item.run, 60);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName ?? "");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      } else if (e.key === "/" && !typing && !dialogRef.current?.open) {
        e.preventDefault();
        open();
      }
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener(events.openSearch, open);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener(events.openSearch, open);
    };
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${selected}"]`)?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (results.length) setSelected((s) => (s + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length) setSelected((s) => (s - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[selected]);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Search the site"
      className="mt-[12vh] w-[660px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) dialogRef.current?.close();
      }}
    >
      <div className="dlg">
        <div className="flex items-center gap-3 border-b border-line px-[18px] py-[15px]">
          <Search className="size-[18px] text-a1" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-autocomplete="list"
            aria-activedescendant={results.length ? `palette-opt-${selected}` : undefined}
            placeholder="Search projects, skills, companies, FAQs…"
            autoComplete="off"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            onKeyDown={onInputKey}
            className="min-w-0 flex-1 border-0 bg-transparent text-[17px] text-fg outline-none placeholder:text-fg-3"
          />
          <span className="kbd">ESC</span>
        </div>
        <ul ref={listRef} id="palette-list" role="listbox" aria-label="Results" className="max-h-[min(440px,56vh)] overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="p-[30px] text-center text-sm text-fg-3">No matches for &ldquo;{query.trim()}&rdquo;. Try a skill, a company or a project name.</li>
          ) : (
            results.map((r, i) => (
              <li
                key={r.id}
                id={`palette-opt-${i}`}
                data-index={i}
                role="option"
                aria-selected={i === selected}
                onMouseMove={() => setSelected(i)}
                onClick={() => choose(r)}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-[11px] transition-colors aria-selected:bg-glass-2 aria-selected:shadow-[inset_3px_0_0_var(--a1)]"
              >
                <span className="min-w-0 flex-1 truncate text-[15px]">
                  <Highlight text={r.title} query={q} />
                  {r.sub && <small className="ml-2 text-[13px] text-fg-3">{r.sub}</small>}
                </span>
                <span className="rounded-[7px] border border-line-2 px-[7px] py-[3px] font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg-3">{r.type}</span>
              </li>
            ))
          )}
        </ul>
        <div className="flex flex-wrap gap-4 border-t border-line px-[18px] py-2.5 text-xs text-fg-3">
          <span>
            <span className="kbd">↑↓</span> move
          </span>
          <span>
            <span className="kbd">↵</span> open
          </span>
          <span>
            <span className="kbd">/</span> or <span className="kbd">⌘K</span> search
          </span>
        </div>
      </div>
    </dialog>
  );
}
