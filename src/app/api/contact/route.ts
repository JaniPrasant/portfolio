import { Resend } from "resend";
import { contactSchema, MIN_FILL_MS, type ContactData } from "@/lib/contact-schema";
import { rateLimit } from "@/lib/rate-limit";
import { site } from "@/lib/site";

const MAX_BODY_BYTES = 10_000;
const LIMIT = 5; // messages
const WINDOW_MS = 10 * 60 * 1000; // per 10 minutes per IP

type Json = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string> };

function reply(body: Json, status = 200, extra: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extra } });
}

/** Escape user text before it goes into the HTML email. */
function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/** Only accept posts from this site (blocks cross-site form abuse). */
function sameOrigin(req: Request) {
  // Browsers set Sec-Fetch-Site themselves and pages can't fake it, so it is a reliable same-site signal
  // even when a browser leaves out the Origin header on same-origin requests.
  const fetchSite = req.headers.get("sec-fetch-site");
  if (fetchSite === "same-origin") return true;
  if (fetchSite === "cross-site" || fetchSite === "same-site") return false;
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    const o = new URL(origin);
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return o.host === host || o.origin === new URL(site.url).origin;
  } catch {
    return false;
  }
}

function buildEmail(d: ContactData) {
  const consentLine = `Consent to the Privacy Policy given at ${new Date().toISOString()}`;
  const utm = Object.entries(d.utm)
    .map(([k, v]) => `${escapeHtml(k)}=${escapeHtml(v)}`)
    .join(" · ");
  const rows = [
    ["Name", d.name],
    ["Email", d.email],
    ["Company", d.company || "—"],
    ["Topic", d.topic],
  ]
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#667">${k}</td><td style="padding:4px 0"><strong>${escapeHtml(v!)}</strong></td></tr>`)
    .join("");
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">
  <h2 style="margin:0 0 12px">New message from your portfolio</h2>
  <table>${rows}</table>
  <p style="white-space:pre-wrap;margin:16px 0;padding:14px;border-radius:10px;background:#f4f5fb">${escapeHtml(d.message)}</p>
  ${utm ? `<p style="color:#667;font-size:13px">Campaign: ${utm}</p>` : ""}
  <p style="color:#667;font-size:13px">${consentLine}. Delete this email within 12 months (Privacy Policy).</p>
</div>`;
  const text = `New message from your portfolio\n\nName: ${d.name}\nEmail: ${d.email}\nCompany: ${d.company || "—"}\nTopic: ${d.topic}\n\n${d.message}${utm ? `\n\nCampaign: ${Object.entries(d.utm).map(([k, v]) => `${k}=${v}`).join(" · ")}` : ""}\n\n${consentLine}. Delete this email within 12 months (Privacy Policy).`;
  return { html, text };
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return reply({ ok: false, error: "This form only accepts messages sent from the site itself." }, 403);

  if (!req.headers.get("content-type")?.includes("application/json")) {
    return reply({ ok: false, error: "Send the form as JSON." }, 415);
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return reply({ ok: false, error: "That message is too long. Keep it under 2,000 characters." }, 413);

  const now = Date.now();
  const limited = rateLimit(clientIp(req), LIMIT, WINDOW_MS, now);
  if (!limited.ok) {
    return reply(
      { ok: false, error: `Too many messages in a short time. Try again in ${Math.ceil(limited.retryAfter / 60)} minutes, or email me directly.` },
      429,
      { "Retry-After": String(limited.retryAfter) },
    );
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return reply({ ok: false, error: "The form data couldn't be read. Refresh the page and try again." }, 400);
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (["name", "email", "message", "consent"].includes(key) && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    // A filled honeypot means a bot: pretend success so it learns nothing.
    if (parsed.error.issues.some((i) => i.path[0] === "website")) return reply({ ok: true });
    return reply({ ok: false, error: "Some fields need attention. Check the highlighted fields and try again.", fieldErrors }, 400);
  }

  const data = parsed.data;
  // Submitted faster than a person can type: treat as a bot, silently.
  if (now - data.startedAt < MIN_FILL_MS || data.startedAt > now + 60_000) return reply({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  if (!apiKey || !to) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] RESEND_API_KEY / CONTACT_TO_EMAIL not set. Message accepted locally:", { ...data, message: `${data.message.slice(0, 80)}…` });
      return reply({ ok: true });
    }
    console.error("[contact] Email is not configured: set RESEND_API_KEY and CONTACT_TO_EMAIL.");
    return reply({ ok: false, error: "The contact form is temporarily unavailable. Email me directly instead." }, 503);
  }

  const { html, text } = buildEmail(data);
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: data.email,
      subject: `Portfolio: ${data.topic} — ${data.name}`.slice(0, 140),
      html,
      text,
    });
    if (error) {
      console.error("[contact] Resend error:", error.name);
      return reply({ ok: false, error: "The message couldn't be delivered right now. Try again in a minute, or email me directly." }, 502);
    }
  } catch (err) {
    console.error("[contact] Send failed:", err instanceof Error ? err.message : "unknown");
    return reply({ ok: false, error: "The message couldn't be delivered right now. Try again in a minute, or email me directly." }, 502);
  }

  return reply({ ok: true });
}

/** Anything but POST gets a clear 405 instead of a stack trace. */
export function GET() {
  return reply({ ok: false, error: "Use POST to send a message." }, 405, { Allow: "POST" });
}
