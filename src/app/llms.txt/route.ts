import { site } from "@/lib/site";
import { clients, education, experience, faqs, projects, skills, skillTrackLabels } from "@/lib/content";

/**
 * /llms.txt — a plain Markdown summary of the site for AI assistants (ChatGPT, Gemini, Claude, Perplexity).
 * Format follows https://llmstxt.org. It is built from the same content as the site, so it never goes stale.
 */
export function GET() {
  const byTrack = (Object.keys(skillTrackLabels) as (keyof typeof skillTrackLabels)[])
    .map((t) => `- ${skillTrackLabels[t]}: ${skills.filter((s) => s.track === t).map((s) => s.name).join(", ")}`)
    .join("\n");

  const body = `# ${site.name}

> ${site.name} is a ${site.role.toLowerCase()} based in ${site.location} (IST, UTC+5:30). ${site.description}

Key facts:
- 6+ years building production frontends with React, TypeScript, Next.js, WordPress and Magento 2.
- Postgraduate program in Data Science & AI/ML from IIT Guwahati (via Masai School); works with Python, SQL, Pandas and data visualization.
- Open to frontend engineering and data analyst roles, remote-friendly, and selective freelance work.
- Contact: ${site.email} · ${site.url}/#contact

## Main pages

- [Portfolio home](${site.url}/): projects, client work, experience, skills, education and FAQ on one page
- [Résumé (PDF)](${site.url}${site.resume}): full CV
- [Contact](${site.url}/#contact): contact form, email and phone

## Experience

${experience.map((r) => `- ${r.title}, ${r.company} (${r.period}): ${r.points[0] ?? ""}`).join("\n")}

## Projects

${projects
  .map((p) => {
    const link = p.links.find((l) => l.kind === "live") ?? p.links[0];
    return `- ${link ? `[${p.title}](${link.href})` : p.title}: ${p.summary} Stack: ${p.stack.join(", ")}.`;
  })
  .join("\n")}

## Client websites

${clients.map((c) => `- [${c.name}](${c.href}): ${c.summary}`).join("\n")}

## Skills

${byTrack}

## Education

- ${education.pg.title}, ${education.pg.where} (${education.pg.period})
${education.degrees.map((d) => `- ${d.title}, ${d.where} (${d.period})`).join("\n")}

## FAQ

${faqs.map((f) => `- ${f.q} ${f.a}`).join("\n")}

## Profiles

${site.socials.map((s) => `- [${s.label}](${s.href})`).join("\n")}

## Optional

- [Privacy Policy](${site.url}/privacy)
- [Terms of Use](${site.url}/terms)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
