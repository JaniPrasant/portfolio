"use client";

import { useCallback, useSyncExternalStore } from "react";
import { palettes, storageKeys, type Palette, type Theme } from "@/lib/site";
import { safeStorage } from "@/lib/utils";

/**
 * Theme and palette live as attributes on <html> (set before paint by the boot script).
 * This hook subscribes to those attributes so every toggle on the page stays in sync.
 */
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-palette"] });
  const mq = window.matchMedia("(prefers-color-scheme: light)");
  mq.addEventListener("change", cb);
  return () => {
    mo.disconnect();
    mq.removeEventListener("change", cb);
  };
}

function readTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function readPalette(): Palette {
  const attr = document.documentElement.getAttribute("data-palette");
  return (palettes as readonly string[]).includes(attr ?? "") ? (attr as Palette) : "aurora";
}

export function useAppearance() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark" as Theme);
  const palette = useSyncExternalStore(subscribe, readPalette, () => "aurora" as Palette);

  const setTheme = useCallback((t: Theme) => {
    document.documentElement.setAttribute("data-theme", t);
    safeStorage.set(storageKeys.theme, t);
  }, []);

  const toggleTheme = useCallback(() => setTheme(readTheme() === "dark" ? "light" : "dark"), [setTheme]);

  const setPalette = useCallback((p: Palette) => {
    document.documentElement.setAttribute("data-palette", p);
    safeStorage.set(storageKeys.palette, p);
  }, []);

  const cyclePalette = useCallback(() => {
    const i = palettes.indexOf(readPalette());
    const next = palettes[(i + 1) % palettes.length]!;
    setPalette(next);
    return next;
  }, [setPalette]);

  return { theme, palette, setTheme, toggleTheme, setPalette, cyclePalette };
}
