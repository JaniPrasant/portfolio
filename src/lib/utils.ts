import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** localStorage/sessionStorage can be missing or throw (private mode, blocked storage). Never let that break the page. */
export const safeStorage = {
  get(key: string, kind: "local" | "session" = "local"): string | null {
    try {
      return (kind === "local" ? window.localStorage : window.sessionStorage).getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string, kind: "local" | "session" = "local") {
    try {
      (kind === "local" ? window.localStorage : window.sessionStorage).setItem(key, value);
    } catch {
      /* storage unavailable */
    }
  },
};

/** Fire-and-forget cross-component events (search palette opening a project, etc.). */
export const events = {
  openProject: "pj:open-project",
  selectCompany: "pj:select-company",
  highlightSkill: "pj:highlight-skill",
  openSearch: "pj:open-search",
  openFaq: "pj:open-faq",
} as const;

export function emit(name: string, detail?: unknown) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
