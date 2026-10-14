# Prashant Jani — Portfolio

Hybrid **Frontend Engineer × Data Analyst** portfolio in the "Aurora" design: a cursor-reactive particle hero, liquid-glass bento panels, three switchable cool palettes, light and dark themes, and real project and client screenshots.

**Stack:** Next.js 16 (App Router, Turbopack, Cache Components) · React 19 · TypeScript (strict) · Tailwind CSS 4 · Motion · Zod 4 · Resend · Lucide icons. Fonts are self-hosted (no Google requests).

---

## 1. Run it locally

Requires **Node.js 20.9 or newer**.

```bash
npm install
# .env.local is already included with your Resend settings (see section 3)
npm run dev                      # http://localhost:3000
```

Without a Resend key, the contact form still works locally: messages are accepted and printed in the terminal instead of emailed. In development a "simulate a failed send" checkbox lets you preview the error state.

Useful scripts:

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint (Next.js + accessibility rules) |
| `npm run typecheck` | Generates route types, then runs `tsc` |
| `npm run check` | Lint + typecheck + build in one go (use before every deploy) |
| `npm run audit:prod` | Scans production dependencies for known vulnerabilities |

---

## 2. Edit your content

Almost everything lives in two files, so you rarely touch components:

- **`src/lib/site.ts`**: name, title, meta description, email, phone, social links, résumé path, and **`lastUpdated`** (used in the sitemap; update it when you publish changes).
- **`src/lib/content.ts`**: projects, client sites, experience, skills, education, FAQs, stats and marquee items.

Images live in `public/img/` (all WebP, each under 100 KB). The résumé PDF is `public/Prashant-Jani-Resume.pdf`; replace the file to update it.

To add another client site: save a full-page capture as WebP (about 620 px wide, under 100 KB) in `public/img/`, then add an entry to `clients` in `content.ts` with its width and height.

**Layout width:** the page is full width (fluid) on screens up to 1600 px and becomes a centered 1600 px container on wider screens. Change `max-width` on `.wrap` in `globals.css` to adjust.

---

## 3. Contact form (Resend)

Your Resend key and inbox (`prashanttechfusion@gmail.com`) are already in **`.env.local`**. That file is git-ignored, so it never reaches GitHub; add the same values in Vercel (step 4).

**Test it locally:** run `npm run dev`, open http://localhost:3000, send yourself a message from the contact form, and check the inbox (and the spam folder the first time).

**Important Resend rule:** while the sender is `onboarding@resend.dev`, Resend only delivers to the email address your Resend account was created with. If your Resend account uses a different address than `prashanttechfusion@gmail.com`, either change `CONTACT_TO_EMAIL` to that address, or verify your own domain in Resend and send from it.

Setting it up from scratch on another account:

1. Create a free account at **resend.com** and create an API key with "Sending access".
2. Put it in `.env.local` as `RESEND_API_KEY`, and set `CONTACT_TO_EMAIL` to the inbox that should receive messages.
3. Leave `CONTACT_FROM_EMAIL=Portfolio <onboarding@resend.dev>` until you own a domain. After you buy one, verify it in Resend (Domains → Add) and change the sender to something like `Portfolio <hello@yourdomain.dev>`.

Replying to a portfolio email replies straight to the sender (the form sets `reply-to`).

---

## 4. Motion (animation)

All animation runs on **Motion** (the library formerly called Framer Motion, imported from `motion/react`). Shared pieces live in `src/components/motion/primitives.tsx`:

| Effect | Where you see it |
|---|---|
| Masked word-by-word headline, letter-flip rotating word | Hero |
| Scroll-linked parallax (copy drifts and fades, photo sinks and turns) | Hero |
| Spring 3D tilt + moving glare on the photo; draggable tech chips that spring back | Hero photo |
| Velocity marquee: speeds up with scroll speed, reverses when scrolling up | Tech strip |
| Words light up one by one as you scroll | About headline |
| Spring tilt + glare cards, staggered scroll reveals | Every card grid |
| Animated count-up stats | Hero stats |
| Shared-layout sliding pills (`layoutId`) | Nav, filters, tabs, lens switch |
| Layout-animated reflow when filtering | Projects and skills |
| Draggable skill chips with elastic snap-back | Skills |
| Height-auto spring accordion | FAQ |
| Staggered panel content, dialog content and form fields | Experience, case studies, contact |
| Magnetic buttons on springs | Primary buttons, résumé, "Let's talk" |
| Spring-trailing cursor glow that swells over clickable things | Whole site (mouse only) |
| Scroll progress bar and back-to-top ring | Whole site |
| Section titles rising from a mask while their letters decode | Every section |
| Animated theme icon, header entrance, footer signature | Header, footer |

Everything respects the visitor's **reduce motion** setting: parallax, tilt, dragging and looping effects switch off, and content simply appears. Without JavaScript, and in print, all content is shown fully.

## 5. Deploy to Vercel

1. Push this folder to a new GitHub repository:
   ```bash
   git init && git add -A && git commit -m "Portfolio v1"
   git branch -M main
   git remote add origin https://github.com/JaniPrasant/portfolio.git
   git push -u origin main
   ```
2. On **vercel.com** → Add New → Project → import the repo. The framework is detected automatically.
3. In **Settings → Environment Variables** add `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (Production and Preview).
4. Deploy. Every push to `main` redeploys, and every pull request gets its own preview URL.
5. **Custom domain** (recommended for your CV): Settings → Domains → add e.g. `prashantjani.dev`, follow the DNS instructions, then set `NEXT_PUBLIC_SITE_URL` to it and redeploy. HTTPS certificates are automatic.
6. After going live, add the site in **Google Search Console** and submit `https://yourdomain/sitemap.xml`.

---

## 6. UTM tracking

Add campaign parameters to links you share, and the contact email tells you where the recruiter came from:

```
https://prashantjani.dev/?utm_source=linkedin&utm_medium=profile
https://prashantjani.dev/?utm_source=cv&utm_medium=pdf&utm_campaign=luxembourg-2026
```

They're kept in `sessionStorage` for the visit only and sent with the form.

Analytics are optional and load **only after cookie consent**: set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` and allow `https://plausible.io` in the CSP in `next.config.ts` (see `src/lib/analytics.ts`).

---

## 7. Feature checklist

| # | Feature | Where |
|---|---|---|
| 1 | Dark/light toggle (respects OS setting, remembered, no flash) + 3 palettes | `hooks/use-appearance.ts`, boot script in `app/layout.tsx` |
| 2 | Cookie banner (consent gates analytics) | `overlays/cookie-banner.tsx` |
| 3 | Full-site search (⌘K, Ctrl+K or `/`) | `overlays/command-palette.tsx` |
| 4 | Back-to-top button with progress ring | `overlays/floating-actions.tsx` |
| 5 | Mobile menu (focus trap, Esc to close) | `layout/header.tsx` |
| 6 | Loading animations (splash once per session, hero reveal, spinners) | `app/layout.tsx`, `globals.css` |
| 7 | Hover states (spotlight borders, tilt, magnetic buttons, screenshot scroll) | `effects/pointer-effects.tsx` |
| 8 | Scroll progress bar | `overlays/scroll-progress.tsx` |
| 9 | Copy-to-clipboard buttons | `ui/copy-button.tsx` |
| 10 | Print stylesheet (clean one-page CV-style print) | bottom of `globals.css` |
| 11 | Sticky header | `layout/header.tsx` |
| 12 | Skip to content | `app/layout.tsx` |
| 13 | Password visibility toggle | Skipped by design: the site has no password field |
| 14 | UTM tracking | `overlays/utm-capture.tsx` |
| 15 | Form success state (with confetti) | `sections/contact-form.tsx` |
| 16 | Form error state (field + server errors) | `sections/contact-form.tsx` |
| 17 | Confirmation modals (résumé download, clear form) | `providers/ui-provider.tsx` |
| 18 | Last updated date | Removed from the footer on request; `site.lastUpdated` still feeds the sitemap so Google sees the freshness date |
| 19 | Expandable FAQs (native, works without JS, FAQPage schema) | `sections/faq.tsx` |
| 20 | Floating contact button (hides at the contact section) | `overlays/floating-actions.tsx` |

Everything respects `prefers-reduced-motion`.

---

## 8. Security checklist

The site is static except one API route (`/api/contact`). There is no database, login or file upload, so some items don't apply.

| # | Item | Status |
|---|---|---|
| 1 | Hide API keys | `RESEND_API_KEY` is server-only (no `NEXT_PUBLIC_` prefix) and read only in the API route |
| 2 | Purge Git secrets | `.env*` is git-ignored (except `.env.example`, which holds no values). Never commit `.env.local` |
| 3 | Use public DB key | N/A: no database |
| 4 | Row-level security | N/A: no database |
| 5 | Encrypt sensitive data | HTTPS everywhere (HSTS); no data is stored |
| 6 | Server-side auth | N/A: no accounts |
| 7 | Lock record access | N/A: no records |
| 8 | Block field tampering | Server re-validates every field with the shared Zod schema; unknown fields are dropped |
| 9 | Secure session cookies | N/A: no sessions. Preferences use localStorage only |
| 10 | Hash passwords | N/A: no passwords |
| 11 | Rate limit | 5 messages per 10 minutes per IP (`lib/rate-limit.ts`; swap in Upstash for a global limit) |
| 12 | Bot protection | Honeypot field + minimum fill time + same-origin check; bots get a silent fake success |
| 13 | Parameterize queries | N/A: no database |
| 14 | Validate all input | Zod on client and server, 10 KB body cap, JSON content-type required |
| 15 | Escape user content | All user text is HTML-escaped before it goes into the email |
| 16 | Restrict file uploads | N/A: no uploads |
| 17 | Trim API responses | The API returns only `{ ok }` or a friendly error, never stack traces or provider details |
| 18 | Security headers | CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, COOP (`next.config.ts`) |
| 19 | Force HTTPS | Vercel redirects HTTP → HTTPS; HSTS + `upgrade-insecure-requests` |
| 20 | Scan dependencies | `npm run audit:prod` reports **0 vulnerabilities**. `npm audit` (dev tools) flags a `braces` issue inside `eslint-config-next`; it only affects local linting, not the deployed site, and clears when Next.js ships an updated lint config |

---

## 9. SEO checklist

| Item | Status |
|---|---|
| Meta title 50–60 chars | 58 chars, set in `site.ts` |
| Meta description 120–160 chars | 149 chars |
| One `<title>`, one `<h1>` | Yes (hero headline) |
| Images under 100 KB | All WebP under 100 KB; Next.js also serves AVIF/WebP at the right size |
| Alt text under 125 chars | Every image has descriptive alt text |
| Anchor text 2–5 words | "See my work", "Visit site", "Live demo" |
| robots.txt, sitemap.xml | Generated at `/robots.txt` and `/sitemap.xml` |
| Structured data | `Person`, `WebSite` and `FAQPage` JSON-LD |
| Open Graph / Twitter image | Generated at `/opengraph-image` |
| Core Web Vitals | Static prerender, self-hosted fonts with preload, lazy images, no layout shift; run Lighthouse after deploy |

---

## 10. Project structure

```
src/
  app/            layout, page, globals.css, API route, sitemap, robots, manifest, OG image, 404
  components/
    sections/     hero, about, projects, clients, experience, skills, education, faq, contact
    overlays/     search, cookie banner, floating buttons, scroll progress, UTM capture
    motion/       Motion primitives: reveal, stagger, tilt, magnetic, scroll words, count-up
    effects/      particle field, pointer glow, scramble text, confetti
    layout/       header (with mobile drawer), footer
    providers/    Motion config, toasts and confirmation modal
    ui/           buttons, copy button, appearance controls, section heading
  hooks/          theme/palette store, active section
  lib/            site config, content, contact schema, rate limiter, utils, analytics
  fonts/          self-hosted Unbounded and JetBrains Mono (OFL licensed)
public/           images and résumé
```
