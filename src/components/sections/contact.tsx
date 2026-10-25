import { Globe, Mail, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { CopyButton } from "@/components/ui/copy-button";
import { ContactForm } from "./contact-form";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";

const reach = [
  { icon: Mail, label: "Email", value: site.email, copy: site.email, copyLabel: "Email address", href: `mailto:${site.email}` },
  { icon: Phone, label: "Phone", value: site.phone, copy: site.phone, copyLabel: "Phone number", href: `tel:${site.phone.replace(/\s/g, "")}` },
  {
    icon: Globe,
    label: "LinkedIn",
    value: "linkedin.com/in/jani-prasant-2810",
    copy: "https://www.linkedin.com/in/jani-prasant-2810/",
    copyLabel: "LinkedIn link",
    href: "https://www.linkedin.com/in/jani-prasant-2810/",
  },
];

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-h" className="wrap">
      <Reveal className="glass overflow-hidden p-[clamp(28px,5vw,56px)]">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_0%_0%,color-mix(in_srgb,var(--a1)_22%,transparent),transparent_45%),radial-gradient(circle_at_100%_100%,color-mix(in_srgb,var(--a3)_20%,transparent),transparent_50%)]"
        />
        <div className="relative grid gap-[clamp(24px,4vw,56px)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <span className="eyebrow">Contact</span>
            <h2 id="contact-h" className="mt-3.5 font-display text-[clamp(2rem,5vw,3.6rem)] font-bold tracking-[-0.04em]">
              Let&apos;s build something <span className="grad-text">useful.</span>
            </h2>
            <p className="mt-4 max-w-[40ch] text-fg-2">Hiring for data or frontend? Send a message or reach me directly. I usually reply within a day.</p>
            <Stagger as="ul" className="mt-[26px] flex flex-col gap-2.5" stagger={0.1} delay={0.3}>
              {reach.map((r) => (
                <StaggerItem as="li" key={r.label} className="flex items-center gap-3 rounded-2xl border border-line bg-glass py-[11px] pl-3.5 pr-[11px]">
                  <r.icon className="size-[18px] flex-none text-a1" aria-hidden />
                  <div className="min-w-0 flex-1 text-[14.5px] [overflow-wrap:anywhere]">
                    <span className="block select-none font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-3">{r.label}</span>
                    <a href={r.href} className="no-underline hover:text-a1" {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                      {r.value}
                    </a>
                  </div>
                  <CopyButton text={r.copy} label={r.copyLabel} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <div className="no-print">
            <ContactForm />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
