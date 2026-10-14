/**
 * Loads privacy-friendly analytics ONLY after the visitor accepts in the cookie banner.
 *
 * To enable: set NEXT_PUBLIC_PLAUSIBLE_DOMAIN (e.g. "prashantjani.dev") and add
 * https://plausible.io to script-src and connect-src in next.config.ts.
 * Vercel Web Analytics is a cookieless alternative if you prefer it.
 */
let loaded = false;

export function loadAnalytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (loaded || !domain || typeof document === "undefined") return;
  loaded = true;
  const s = document.createElement("script");
  s.defer = true;
  s.dataset.domain = domain;
  s.src = "https://plausible.io/js/script.js";
  document.head.appendChild(s);
}
