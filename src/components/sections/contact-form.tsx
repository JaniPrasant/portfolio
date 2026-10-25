"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CircleAlert, Trash2 } from "lucide-react";
import { contactTopics } from "@/lib/content";
import { CONSENT_ERROR, validateField, type ContactField } from "@/lib/contact-schema";
import { site, storageKeys } from "@/lib/site";
import { safeStorage } from "@/lib/utils";
import { useUI } from "@/components/providers/ui-provider";
import { burstConfetti } from "@/components/effects/confetti";
import { useMagnetic } from "@/components/motion/primitives";

const fieldVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 200, damping: 22 } },
} as const;

type Values = { name: string; email: string; company: string; topic: (typeof contactTopics)[number]; message: string; website: string };
const empty: Values = { name: "", email: "", company: "", topic: contactTopics[0], message: "", website: "" };
type Status = "idle" | "sending" | "success" | "error";

const isDev = process.env.NODE_ENV === "development";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span id={id} className="flex items-center gap-1.5 text-[12.5px] text-err">
      <CircleAlert className="size-3.5 flex-none" aria-hidden />
      {message}
    </span>
  );
}

export function ContactForm() {
  const { confirm, toast } = useUI();
  const magnetic = useMagnetic(0.2);
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [sentTo, setSentTo] = useState({ name: "", email: "" });
  const [simulateFailure, setSimulateFailure] = useState(false);
  // DPDP Act: consent must be a clear action, so the box always starts unticked.
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState("");
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
    if (status === "error") bannerRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [status]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (key === "name" || key === "email" || key === "message") {
      const field = key as ContactField;
      if (errors[field]) setErrors((e) => ({ ...e, [field]: validateField(field, String(value)) }));
    }
  };

  const blur = (key: ContactField) => {
    if (values[key]) setErrors((e) => ({ ...e, [key]: validateField(key, values[key]) }));
  };

  const reset = () => {
    setValues(empty);
    setErrors({});
    setConsent(false);
    setConsentError("");
    setServerError("");
    setStatus("idle");
    startedAt.current = Date.now();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    const fields: ContactField[] = ["name", "email", "message"];
    const next: Partial<Record<ContactField, string>> = {};
    for (const f of fields) next[f] = validateField(f, values[f]);
    setErrors(next);
    setConsentError(consent ? "" : CONSENT_ERROR);
    const firstBad = fields.find((f) => next[f]) ?? (consent ? undefined : "consent");
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }

    setStatus("sending");
    let utm: Record<string, string> = {};
    try {
      utm = JSON.parse(safeStorage.get(storageKeys.utm, "session") ?? "{}");
    } catch {
      utm = {};
    }

    try {
      if (isDev && simulateFailure) throw new Error("simulated");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, consent, startedAt: startedAt.current, utm }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fieldErrors?: Partial<Record<ContactField, string>> };
      if (res.ok && data.ok) {
        setSentTo({ name: values.name.trim().split(" ")[0] ?? "", email: values.email.trim() });
        setStatus("success");
        const rect = formRef.current?.getBoundingClientRect();
        if (rect) burstConfetti({ x: rect.left + rect.width / 2, y: rect.top + 120 });
        setValues(empty);
        setConsent(false);
        return;
      }
      if (data.fieldErrors) {
        const { consent: c, ...rest } = data.fieldErrors as Partial<Record<ContactField | "consent", string>>;
        setErrors(rest);
        if (c) setConsentError(c);
      }
      setServerError(data.error ?? "The server didn't accept the message. Check your connection and try again, or email me directly.");
      setStatus("error");
    } catch {
      setServerError("The server didn't respond. Check your connection and press Send again, or email me directly.");
      setStatus("error");
    }
  };

  const onClear = async () => {
    const hasContent = [values.name, values.email, values.company, values.message].some((v) => v.trim()) || consent;
    if (!hasContent) {
      toast("The form is already empty");
      return;
    }
    const ok = await confirm({
      title: "Clear the form?",
      body: "Everything you typed in this form will be removed. This can't be undone.",
      confirmLabel: "Clear form",
    });
    if (!ok) return;
    reset();
    toast("Form cleared");
    formRef.current?.querySelector<HTMLElement>('[name="name"]')?.focus();
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "success" ? (
        <motion.div
          key="success"
          ref={successRef}
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="flex min-h-full flex-col items-center justify-center gap-3.5 px-3 py-10 text-center outline-none"
          role="status"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 14 }}
            className="grid size-[84px] place-items-center rounded-full border border-[color-mix(in_srgb,var(--ok)_40%,transparent)] bg-[color-mix(in_srgb,var(--ok)_14%,transparent)]"
          >
            <svg viewBox="0 0 24 24" className="size-10 fill-none stroke-ok stroke-[2.4] [stroke-linecap:round] [stroke-linejoin:round]" aria-hidden>
              <motion.path d="m5 12 5 5 9-10" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25, duration: 0.5 }} />
            </svg>
          </motion.div>
          <h3 className="font-display text-2xl tracking-tight">Message sent</h3>
          <p className="max-w-[40ch] text-fg-2">
            Thanks{sentTo.name ? `, ${sentTo.name}` : ""}. I&apos;ll reply to {sentTo.email || "your email"} within a day.
          </p>
          <button type="button" className="btn btn-ghost" onClick={reset}>
            Send another message
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          ref={formRef}
          noValidate
          onSubmit={onSubmit}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          exit={{ opacity: 0, scale: 0.97 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
          className="grid grid-cols-1 gap-3.5 sm:grid-cols-2"
          aria-describedby={status === "error" ? "form-error" : undefined}
        >
          <AnimatePresence>
            {status === "error" && (
              <motion.div
                ref={bannerRef}
                id="form-error"
                role="alert"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--err)_40%,transparent)] bg-[color-mix(in_srgb,var(--err)_12%,transparent)] px-4 py-3.5 text-sm sm:col-span-2"
              >
                <CircleAlert className="mt-0.5 size-[18px] flex-none text-err" aria-hidden />
                <div>
                  <strong className="block">Your message wasn&apos;t sent.</strong>
                  <p className="text-fg-2">{serverError}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={fieldVariants} className="flex min-w-0 flex-col gap-1.5">
            <label htmlFor="f-name" className="field-label">
              Name
            </label>
            <input
              id="f-name"
              name="name"
              className="input"
              autoComplete="name"
              maxLength={80}
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              onBlur={() => blur("name")}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "e-name" : undefined}
            />
            <FieldError id="e-name" message={errors.name} />
          </motion.div>
          <motion.div variants={fieldVariants} className="flex min-w-0 flex-col gap-1.5">
            <label htmlFor="f-email" className="field-label">
              Email
            </label>
            <input
              id="f-email"
              name="email"
              type="email"
              className="input"
              autoComplete="email"
              maxLength={120}
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              onBlur={() => blur("email")}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "e-email" : undefined}
            />
            <FieldError id="e-email" message={errors.email} />
          </motion.div>
          <motion.div variants={fieldVariants} className="flex min-w-0 flex-col gap-1.5">
            <label htmlFor="f-company" className="field-label">
              Company <span className="normal-case tracking-normal text-fg-3">optional</span>
            </label>
            <input
              id="f-company"
              name="company"
              className="input"
              autoComplete="organization"
              maxLength={100}
              value={values.company}
              onChange={(e) => set("company", e.target.value)}
            />
          </motion.div>
          <motion.div variants={fieldVariants} className="flex min-w-0 flex-col gap-1.5">
            <label htmlFor="f-topic" className="field-label">
              Topic
            </label>
            <select id="f-topic" name="topic" className="input" value={values.topic} onChange={(e) => set("topic", e.target.value as Values["topic"])}>
              {contactTopics.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </motion.div>
          <motion.div variants={fieldVariants} className="flex min-w-0 flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="f-message" className="field-label">
              Message
              <span className="font-mono normal-case tracking-normal text-fg-3" aria-live="off">
                {values.message.length} / 2000
              </span>
            </label>
            <textarea
              id="f-message"
              name="message"
              className="input"
              maxLength={2000}
              value={values.message}
              onChange={(e) => set("message", e.target.value)}
              onBlur={() => blur("message")}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? "e-message" : undefined}
            />
            <FieldError id="e-message" message={errors.message} />
          </motion.div>

          {/* Honeypot: invisible to people, tempting to bots */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="f-website">Website</label>
            <input id="f-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} />
          </div>

          <motion.div variants={fieldVariants} className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="f-consent" className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug text-fg-2">
              <input
                id="f-consent"
                name="consent"
                type="checkbox"
                className="mt-0.5 size-4 flex-none cursor-pointer accent-a1"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  if (e.target.checked) setConsentError("");
                }}
                aria-invalid={consentError ? true : undefined}
                aria-describedby={consentError ? "e-consent" : "consent-note"}
              />
              <span>
                I agree that Prashant Jani may use my name, email and message only to reply to me, as described in the{" "}
                <a href="/privacy" target="_blank" rel="noopener" className="text-a1 underline underline-offset-2">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
            <span id="consent-note" className="pl-[26px] text-[12px] text-fg-3">
              Kept for up to 12 months, then deleted. You can withdraw consent or ask for deletion any time by emailing {site.email}.
            </span>
            <FieldError id="e-consent" message={consentError} />
          </motion.div>

          <motion.div variants={fieldVariants} className="mt-1 flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
            {isDev ? (
              <label className="flex items-center gap-2 text-[12.5px] text-fg-3" htmlFor="f-sim">
                <input id="f-sim" type="checkbox" className="accent-a3" checked={simulateFailure} onChange={(e) => setSimulateFailure(e.target.checked)} />
                Dev only: simulate a failed send
              </label>
            ) : (
              <span />
            )}
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-ghost" onClick={onClear}>
                <Trash2 className="size-[18px]" aria-hidden />
                Clear
              </button>
              <motion.button type="submit" className="btn btn-primary" disabled={status === "sending"} {...magnetic}>
                {status === "sending" ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden />
                ) : (
                  <ArrowRight className="size-[18px]" aria-hidden />
                )}
                {status === "sending" ? "Sending…" : "Send message"}
              </motion.button>
            </div>
          </motion.div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
