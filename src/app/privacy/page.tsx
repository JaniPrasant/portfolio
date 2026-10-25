import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { CookieSettingsButton } from "@/components/legal/cookie-settings-button";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `What personal data ${site.name}'s portfolio collects, why, how long it is kept, who it is shared with, and how to withdraw consent or raise a grievance.`,
  alternates: { canonical: "/privacy" },
};

const analyticsOn = Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);
const mail = (subject: string) => `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

const sections: LegalSection[] = [
  {
    id: "who",
    title: "Who is responsible for your data",
    body: (
      <>
        <p>
          This website is the personal portfolio of <strong>{site.name}</strong>, an individual frontend engineer and data analyst based in{" "}
          {site.location}. Under India&apos;s Digital Personal Data Protection Act, 2023 (&ldquo;DPDP Act&rdquo;), I am the{" "}
          <strong>Data Fiduciary</strong>: I decide why and how your personal data is used.
        </p>
        <p>
          Contact: <a href={mail("Privacy question")}>{site.email}</a> · {site.phone}
        </p>
      </>
    ),
  },
  {
    id: "data",
    title: "What data I collect, and why",
    body: (
      <>
        <p>I only collect what I need. Here is everything, in one table:</p>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th scope="col">Data</th>
                <th scope="col">When</th>
                <th scope="col">Why</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Name, email, company (optional), topic and message</td>
                <td>Only when you send the contact form and tick the consent box</td>
                <td>To read your message and reply to you. Nothing else.</td>
              </tr>
              <tr>
                <td>Campaign tags in the link you used (for example utm_source=linkedin)</td>
                <td>Only if the link had them, and only if you then send the form</td>
                <td>To know which profile or post you came from. They are attached to your message.</td>
              </tr>
              <tr>
                <td>Theme, colour palette and cookie choice</td>
                <td>When you change them</td>
                <td>To remember your settings. Stored only in your own browser; I never receive it.</td>
              </tr>
              <tr>
                <td>IP address and browser type</td>
                <td>Every visit (standard web server logs)</td>
                <td>To deliver the site, stop spam (the form allows 5 messages per 10 minutes) and keep it secure.</td>
              </tr>
              {analyticsOn && (
                <tr>
                  <td>Pages viewed and referring site, without cookies or personal identifiers</td>
                  <td>Only if you click &ldquo;Accept analytics&rdquo;</td>
                  <td>To count visits and see which pages are useful.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p>
          I do <strong>not</strong> sell your data, use it for advertising, build profiles, add you to a mailing list or use it to train AI. There are
          no tracking pixels (Meta, Google Ads, LinkedIn Insight or similar) on this site.
        </p>
      </>
    ),
  },
  {
    id: "consent",
    title: "Your consent, and how to withdraw it",
    body: (
      <>
        <p>
          The contact form has a consent box that is <strong>never ticked in advance</strong>. Your message is only sent if you tick it yourself. Each
          message records the time consent was given.
        </p>
        <p>You can withdraw consent at any time, and it is as easy as giving it:</p>
        <ul>
          <li>
            <strong>Contact form data:</strong> email <a href={mail("Withdraw consent / delete my data")}>{site.email}</a> with the subject
            &ldquo;Withdraw consent&rdquo;. I will delete your messages and stop using your details.
          </li>
          <li>
            <strong>Analytics and browser storage:</strong> use <CookieSettingsButton className="cursor-pointer border-0 bg-transparent p-0 text-a1 underline underline-offset-[3px]" />{" "}
            at any time and choose &ldquo;Essential only&rdquo;.
          </li>
        </ul>
        <p>Withdrawing consent does not affect anything done lawfully before you withdrew it.</p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long I keep your data",
    body: (
      <ul>
        <li>
          <strong>Contact messages:</strong> up to <strong>12 months</strong> after our last conversation, then deleted from my inbox. If we start
          working together, I keep what the work needs for as long as the law requires (for example, tax records).
        </li>
        <li>
          <strong>Email delivery logs at Resend:</strong> kept for a short period under Resend&apos;s own retention policy.
        </li>
        <li>
          <strong>Server logs at Vercel:</strong> kept for a short period under Vercel&apos;s own retention policy.
        </li>
        <li>
          <strong>Browser storage:</strong> stays in your browser until you clear it. Campaign tags are kept only for the current tab session.
        </li>
      </ul>
    ),
  },
  {
    id: "sharing",
    title: "Who your data is shared with",
    body: (
      <>
        <p>
          Only with the services that run this website, acting as <strong>Data Processors</strong> on my instructions. Some of them store data outside
          India, as the DPDP Act allows.
        </p>
        <ul>
          <li>
            <strong>Vercel Inc.</strong> (USA): hosts the website and processes server logs.
          </li>
          <li>
            <strong>Resend</strong> (USA): delivers contact form messages to my email inbox.
          </li>
          <li>
            <strong>Google (Gmail)</strong>: my email inbox, where your message is received and answered.
          </li>
          {analyticsOn && (
            <li>
              <strong>Plausible Analytics</strong> (EU): cookieless visit counts, only if you accept analytics.
            </li>
          )}
        </ul>
        <p>I will only share data with anyone else if Indian law requires it, for example a valid request from a government authority.</p>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>Under the DPDP Act you can:</p>
        <ul>
          <li>
            <strong>Access:</strong> ask for a summary of the data I hold about you and how it is used.
          </li>
          <li>
            <strong>Correct or update</strong> data that is wrong or incomplete.
          </li>
          <li>
            <strong>Erase</strong> your data when it is no longer needed or you withdraw consent.
          </li>
          <li>
            <strong>Nominate</strong> someone to use these rights for you if you die or become unable to.
          </li>
          <li>
            <strong>Raise a grievance</strong> (see the next section).
          </li>
        </ul>
        <p>
          To use any right, email <a href={mail("My data rights request")}>{site.email}</a>. I may ask you to confirm the request from the same email
          address you used in the form, so I don&apos;t hand your data to someone else. This is free.
        </p>
      </>
    ),
  },
  {
    id: "grievance",
    title: "Grievance Officer",
    body: (
      <>
        <p>If you have a complaint about how your data is handled, contact the Grievance Officer:</p>
        <div className="glass p-5 text-[14.5px]">
          <p>
            <strong>{site.name}</strong>, Grievance Officer
          </p>
          <p>
            Email: <a href={mail("Grievance")}>{site.email}</a> (subject: &ldquo;Grievance&rdquo;)
          </p>
          <p>Phone: {site.phone}</p>
          <p>Location: {site.location}</p>
        </div>
        <p>
          I will acknowledge your complaint within <strong>48 hours</strong> and aim to resolve it within <strong>30 days</strong>. If you are not
          satisfied with the outcome, you can complain to the <strong>Data Protection Board of India</strong>.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and tracking",
    body: (
      <>
        <p>This site sets no advertising or cross-site tracking cookies and has no tracking pixels. It uses your browser&apos;s storage for:</p>
        <ul>
          <li>
            <strong>Essential (always on):</strong> your theme, colour palette and cookie choice, plus a note that you have seen the intro animation.
            These never leave your browser.
          </li>
          <li>
            <strong>Analytics (off until you accept):</strong>{" "}
            {analyticsOn
              ? "privacy-friendly, cookieless visit counts from Plausible."
              : "currently not in use. If I add privacy-friendly analytics later, it will only load after you accept, and this page will say so."}
          </li>
        </ul>
        <p>
          Change your choice any time: <CookieSettingsButton className="cursor-pointer border-0 bg-transparent p-0 text-a1 underline underline-offset-[3px]" />.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children's data",
    body: (
      <p>
        This site is for recruiters, employers and clients. It is not meant for anyone under 18, and I do not knowingly collect data from children.
        If you are under 18, please don&apos;t use the contact form. If you are a parent or guardian and think your child has sent me their details,
        email <a href={mail("Delete a child's data")}>{site.email}</a> and I will delete them.
      </p>
    ),
  },
  {
    id: "security",
    title: "How your data is protected",
    body: (
      <>
        <ul>
          <li>
            <strong>SSL/TLS encryption:</strong> the whole site runs on HTTPS only (the padlock in your browser), with HSTS so browsers never connect
            without encryption.
          </li>
          <li>Strict security headers, including a Content Security Policy, to block injected scripts.</li>
          <li>The contact form checks every field on the server, blocks spam bots and limits how often it can be used.</li>
          <li>Secret keys are stored as encrypted environment variables, never in the code.</li>
          <li>My accounts with these services use strong passwords and two-step verification.</li>
        </ul>
        <p>
          If a data breach ever affects your personal data, I will inform you and the Data Protection Board of India as the DPDP Act requires.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        If I change this policy, I will update the date at the top of this page. If a change affects how I use data you have already given me, I will
        ask for your consent again. See also the <Link href="/terms">Terms of Use</Link>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      intro={
        <p>
          In short: I only collect what you type into the contact form, only use it to reply to you, keep it for up to 12 months, and never sell it.
          This page explains the details in plain language, as required by India&apos;s DPDP Act, 2023.
        </p>
      }
      sections={sections}
    />
  );
}
