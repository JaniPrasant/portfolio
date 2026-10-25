import { site } from "@/lib/site";
import Link from "next/link";
import { FooterName } from "./footer-name";
import { CookieSettingsButton } from "@/components/legal/cookie-settings-button";

export function Footer() {
  const year = site.lastUpdated.slice(0, 4);
  return (
    <footer className="border-t border-line pb-30 pt-10">
      <div className="wrap flex flex-wrap items-start justify-between gap-6 text-[13.5px] text-fg-2">
        <div className="flex flex-col gap-3">
          <FooterName />
          <span>
            {site.role.replace("&", "×")} · © {year}
          </span>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-4.5">
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-fg">
              {s.label}
            </a>
          ))}
          <a href="#top" className="no-print no-underline hover:text-fg">
            Back to top ↑
          </a>
        </nav>
        <nav aria-label="Legal" className="flex w-full flex-wrap gap-x-4.5 gap-y-2 border-t border-line pt-5 text-[13px] text-fg-3">
          <Link href="/privacy" className="no-underline hover:text-fg">
            Privacy Policy
          </Link>
          <Link href="/terms" className="no-underline hover:text-fg">
            Terms of Use
          </Link>
          <CookieSettingsButton className="no-print cursor-pointer border-0 bg-transparent p-0 text-inherit hover:text-fg" />
          <Link href="/privacy#grievance" className="no-underline hover:text-fg">
            Grievance Officer
          </Link>
        </nav>
      </div>
    </footer>
  );
}
