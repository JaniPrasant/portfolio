/** Site-wide configuration. Update `lastUpdated` whenever you publish content changes. */
export const site = {
  name: "Prashant Jani",
  role: "Frontend Engineer & Data Analyst",
  url: (() => {
    const raw = (process.env.NEXT_PUBLIC_SITE_URL || "https://prashantjani.dev").trim().replace(/\/+$/, "");
    return /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
  })(),
  title: "Prashant Jani — Frontend Engineer & Data Analyst Portfolio",
  description:
    "Frontend engineer with 6+ years in React and TypeScript, moving into data analytics with Python and SQL. See projects, client sites and get in touch.",
  email: "prashanttechfusion@gmail.com",
  phone: "+91 75672 31228",
  location: "Navsari, Gujarat, India",
  timeZone: "Asia/Kolkata",
  resume: "/Prashant-Jani-Resume.pdf",
  resumeSizeLabel: "PDF, about 37 KB",
  lastUpdated: "2026-10-09",
  lastUpdatedLabel: "9 Oct 2026",
  /** Effective date of the Privacy Policy and Terms. Change it whenever you edit either page. */
  legalUpdated: "2026-10-25",
  legalUpdatedLabel: "25 October 2026",
  socials: [
    { label: "GitHub", href: "https://github.com/JaniPrasant" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/jani-prasant-2810/" },
    { label: "Stack Overflow", href: "https://stackoverflow.com/users/22635783/prashant-jani" },
    { label: "Upwork", href: "https://www.upwork.com/freelancers/~0127b8e048ec810e70?viewMode=1" },
    { label: "X", href: "https://x.com/imPJ2810" },
  ],
} as const;

export const navItems = [
  { id: "about", label: "About" },
  { id: "clients", label: "Clients" },
  { id: "work", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
] as const;

export const palettes = ["aurora", "lagoon", "neon"] as const;
export type Palette = (typeof palettes)[number];
export type Theme = "light" | "dark";

/** localStorage / sessionStorage keys, kept in one place so the inline boot script and components agree. */
export const storageKeys = {
  theme: "pj-theme",
  palette: "pj-palette",
  consent: "pj-consent",
  utm: "pj-utm",
  splash: "pj-splash-seen",
} as const;
