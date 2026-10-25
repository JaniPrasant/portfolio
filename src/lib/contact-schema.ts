import { z } from "zod";
import { contactTopics } from "./content";

/** Minimum time (ms) between the form rendering and submission. Faster than this is almost always a bot. */
export const MIN_FILL_MS = 3000;

export const CONSENT_ERROR = "Tick the box to agree, so I can use your details to reply.";

const trimmed = (min: number, max: number, minMsg: string) =>
  z
    .string()
    .trim()
    .min(min, minMsg)
    .max(max, `Keep this under ${max} characters.`);

/** Shared by the browser form and the /api/contact route: one source of truth for validation. */
export const contactSchema = z.object({
  name: trimmed(2, 80, "Enter your name (at least 2 characters)."),
  email: z
    .string()
    .trim()
    .max(120, "Keep this under 120 characters.")
    .pipe(z.email("This email looks incomplete. Check for a typo, like name@company.com.")),
  company: z.string().trim().max(100, "Keep this under 100 characters.").optional().default(""),
  topic: z.enum(contactTopics),
  message: trimmed(20, 2000, "Add a little more detail: at least 20 characters."),
  /** DPDP Act: clear, affirmative consent. The box starts unticked and must be ticked to send. */
  consent: z.literal(true, { error: CONSENT_ERROR }),
  /** Honeypot: hidden from people, filled by naive bots. Must stay empty. */
  website: z.string().max(0).optional().default(""),
  /** Epoch ms when the form was rendered, for the minimum fill time check. */
  startedAt: z.number().int().positive(),
  utm: z.record(z.string().max(40), z.string().max(100)).optional().default({}),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
export type ContactField = "name" | "email" | "message";

/** Client-side helper: validate one visible field and return a message or "". */
export function validateField(field: ContactField, value: string): string {
  const shape = contactSchema.shape[field];
  const result = shape.safeParse(value);
  return result.success ? "" : (result.error.issues[0]?.message ?? "Check this field.");
}
