import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

import { site, storageKeys } from "@/lib/site";
import { AppProviders } from "@/components/providers/app-providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SiteOverlays } from "@/components/overlays/site-overlays";

const unbounded = localFont({
  src: "../fonts/Unbounded-latin.woff2",
  variable: "--font-unbounded",
  weight: "200 900",
  display: "swap",
});

const jetbrains = localFont({
  src: "../fonts/JetBrainsMono-latin.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "Prashant Jani",
    "frontend engineer",
    "data analyst",
    "React developer",
    "TypeScript",
    "Python",
    "SQL",
    "portfolio",
    "Navsari",
    "remote",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: `${site.name} Portfolio`,
    title: site.title,
    description: site.description,
    locale: "en_US",
    firstName: "Prashant",
    lastName: "Jani",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@imPJ2810",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06071a" },
    { media: "(prefers-color-scheme: light)", color: "#f3f5ff" },
  ],
  colorScheme: "dark light",
  viewportFit: "cover",
};

/**
 * Runs before first paint: applies the saved theme and palette and decides whether
 * the splash shows (once per browser session, never for reduced motion).
 */
const bootScript = `(function(){var r=document.documentElement;try{var t=localStorage.getItem("${storageKeys.theme}");if(t==="light"||t==="dark")r.setAttribute("data-theme",t);var p=localStorage.getItem("${storageKeys.palette}");if(p==="aurora"||p==="lagoon"||p==="neon")r.setAttribute("data-palette",p);}catch(e){}try{if(sessionStorage.getItem("${storageKeys.splash}")||matchMedia("(prefers-reduced-motion: reduce)").matches){r.classList.add("no-splash")}else{sessionStorage.setItem("${storageKeys.splash}","1")}}catch(e){r.classList.add("no-splash")}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.name,
      jobTitle: site.role,
      url: site.url,
      image: `${site.url}/img/portrait.webp`,
      email: `mailto:${site.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Navsari", addressRegion: "Gujarat", addressCountry: "IN" },
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "Indian Institute of Technology Guwahati" },
        { "@type": "CollegeOrUniversity", name: "Uka Tarsadia University" },
        { "@type": "CollegeOrUniversity", name: "Veer Narmad South Gujarat University" },
      ],
      knowsAbout: ["React", "TypeScript", "JavaScript", "Frontend development", "Responsive web design", "ColdFusion", "Magento 2", "WordPress", "Python", "SQL", "Data analysis"],
      sameAs: site.socials.map((s) => s.href),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: `${site.name} Portfolio`,
      author: { "@id": `${site.url}/#person` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-palette="aurora"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${unbounded.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        {/* Without JavaScript, show content that Motion would otherwise animate in */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important;filter:none!important}.splash{display:none}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>
        <div className="splash no-print" aria-hidden="true">
          <div className="flex flex-col items-center gap-4">
            <div className="grid h-[86px] w-[86px] place-items-center rounded-[26px] bg-linear-to-br from-a1 via-a2 to-a3 font-display text-[26px] font-bold text-on-accent [animation:breathe_1.4s_ease-in-out_infinite]">
              PJ
            </div>
            <div className="h-[3px] w-40 overflow-hidden rounded-full bg-line">
              <i className="splash-bar block h-full bg-linear-to-r from-a1 to-a3" />
            </div>
          </div>
        </div>
        <div className="aurora" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="grain" aria-hidden="true" />
        <a
          href="#main"
          className="fixed left-4 -top-16 z-[400] rounded-xl bg-a1 px-4 py-2.5 font-semibold text-on-accent no-underline transition-[top] focus:top-[calc(12px+env(safe-area-inset-top,0px))]"
        >
          Skip to content
        </a>
        <AppProviders>
          <Header />
          <main id="main" tabIndex={-1} className="flex flex-col gap-[clamp(80px,11vw,140px)] pb-36 outline-none">
            {children}
          </main>
          <Footer />
          <SiteOverlays />
        </AppProviders>
      </body>
    </html>
  );
}
