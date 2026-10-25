import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The terms for using ${site.name}'s portfolio website: content, links, the contact form, and who to contact.`,
  alternates: { canonical: "/terms" },
};

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About this website",
    body: (
      <>
        <p>
          This is the personal portfolio of <strong>{site.name}</strong> ({site.location}). It shows my work, experience and skills, and lets you
          contact me. By using the site you agree to these terms. If you don&apos;t agree, please don&apos;t use it.
        </p>
        <p>
          Owner and contact: <strong>{site.name}</strong> · {site.location} · <a href={`mailto:${site.email}`}>{site.email}</a> · {site.phone}
        </p>
      </>
    ),
  },
  {
    id: "no-sales",
    title: "Nothing is sold on this website",
    body: (
      <>
        <p>
          This site does not sell any goods or services and takes no payments, so there are no orders, returns, refunds or shipping. You can
          download my résumé for free.
        </p>
        <p>
          If we agree to work together (a job or freelance project), that work is covered by a separate written agreement, such as an employment
          contract or an Upwork contract, not by these terms.
        </p>
      </>
    ),
  },
  {
    id: "content",
    title: "Content and intellectual property",
    body: (
      <>
        <p>
          The text, design, code and photos of me on this site belong to me unless stated otherwise. You may view them, share links to them and
          download my résumé for hiring purposes. Please don&apos;t copy the design or content and present it as your own.
        </p>
        <p>
          Client websites, names and logos shown in the portfolio belong to their owners and are shown only to describe work I did for them.
          Trademarks such as React, Next.js or Python belong to their owners.
        </p>
      </>
    ),
  },
  {
    id: "contact-form",
    title: "Using the contact form",
    body: (
      <>
        <p>Please use the contact form only for genuine messages. Don&apos;t use it to send:</p>
        <ul>
          <li>spam, advertising or bulk messages;</li>
          <li>anything unlawful, abusive or threatening;</li>
          <li>malware, or attempts to break or overload the site.</li>
        </ul>
        <p>
          Automated protections may block messages that look like spam. How your details are used is explained in the{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </>
    ),
  },
  {
    id: "accuracy",
    title: "Accuracy and links",
    body: (
      <>
        <p>
          I keep the information on this site accurate and up to date, but it is provided &ldquo;as is&rdquo;. Project descriptions and figures are a
          summary, not a guarantee of future results.
        </p>
        <p>
          The site links to other websites, such as GitHub, LinkedIn and client sites. I don&apos;t control them and am not responsible for their
          content or privacy practices.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Liability",
    body: (
      <p>
        To the extent the law allows, I am not liable for any loss arising from using this website or relying on its content. Nothing in these terms
        limits rights you have under Indian law that cannot be limited.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    body: <p>These terms are governed by the laws of India. Any dispute is subject to the courts of Gujarat, India.</p>,
  },
  {
    id: "changes",
    title: "Changes and contact",
    body: (
      <p>
        I may update these terms. The date at the top of this page shows the latest version. Questions? Email{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Use"
      intro={<p>Simple rules for using this portfolio website. It is a personal site, nothing is sold here, and your data is covered by the Privacy Policy.</p>}
      sections={sections}
    />
  );
}
