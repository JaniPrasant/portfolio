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
  openCookies: "pj:open-cookies",
} as const;

export function emit(name: string, detail?: unknown) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  // On other pages (Privacy, Terms) the section lives on the home page.
  if (!el) {
    // A plain full navigation is intended here: the target section is on the home page.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `/#${id}`;
    return;
  }
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
