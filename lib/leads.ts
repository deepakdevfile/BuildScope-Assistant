import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { buildBrief, estimate } from './estimator';
import { HandlerResult, TranscriptMessage, Lead, StoredLead } from "@/lib/types";
import { normalizeSelection } from "./estimator";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s-]{7,20}$/;

const leadsFile = (): string => 
    process.env.LEADS_FILE ?? (process.env.VERCEL ? '/tmp/leads.jsonl': path.join(process.cwd(), 'data', 'leads.jsonl'));

export type FieldErrors = Partial<
  Record<
    "name" | "email" | "company" | "phone" | "message" | "services",
    string
  >
>;

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

export function validateLead(
  body: unknown,
): { ok: true; value: Lead } | { ok: false; errors: FieldErrors } {
  const b = (body && typeof body === "object" ? body : {}) as Record<
    string,
    unknown
  >;
  const errors: FieldErrors = {};

  const name = str(b.name);
  const email = str(b.email).toLowerCase();
  const company = str(b.company);
  const phone = str(b.phone);
  const message = str(b.message);

  if (name.length < 2 || name.length > 80) {
    errors.name = "Please enter your full name.";
  }
  if (!EMAIL_RE.test(email) || email.length > 120) {
    errors.email = "Please enter a valid email address.";
  }
  if (company.length > 100) {
    errors.company = "Company name is too long.";
  }
  if (phone && !PHONE_RE.test(phone)) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (message.length > 2000) {
    errors.message = "Message must be under 2000 characters.";
  }

  const selection = normalizeSelection(b.selection);
  if (selection.services.length === 0) {
    errors.services = "Select at least one service.";
  }

  if (Object.keys(errors).length) {
    return { ok: false, errors };
  }

  const transcript: TranscriptMessage[] = (
    Array.isArray(b.transcript) ? b.transcript : []
  )
    .slice(-30)
    .flatMap((m: unknown): TranscriptMessage[] => {
      const r = (m && typeof m === "object" ? m : {}) as Record<
        string,
        unknown
      >;
      const content = str(r.content).slice(0, 1000);
      return (r.role === "user" || r.role === "assistant") && content
        ? [{ role: r.role, content }]
        : [];
    });

  return {
    ok: true,
    value: {
      name,
      email,
      company,
      phone,
      message,
      source: b.source === "chat" ? "chat" : "wizard",
      selection,
      transcript,
    },
  };
}


// In-memory limiter: fine for this prototype but we will use Redis/Upstash at scale.
const hits = new Map<string, number[]>();

export function rateLimited(key: string, limit: number, windowMs = 60_000, now = Date.now()): boolean {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);
    if(hits.size > 5000){
        hits.clear();
    }
    return recent.length > limit;
}

export function saveLead(lead: StoredLead): void {
    const file = leadsFile();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.appendFileSync(file, JSON.stringify(lead) + '\n');
}

export function handleLead(body: unknown, ip: string): HandlerResult {
    if(rateLimited(`lead:${ip}`, 5)){
        return { status: 429, json: { error: 'Too many requests. Please try again in a minute.' }};
    }

    // Setting up a honeypot for Bots, real users does not fill hidden fields
    const hp = (body as Record<string, unknown> | null)?.website;
    if(typeof hp === 'string' && hp.trim() !== ''){
        return { status: 201, json: { ok: true, id: 'CYN-0000'}};
    }

    const result = validateLead(body);
    if(!result.ok){
        return { status: 400, json: { error: 'Validation failed', fields: result.errors }};
    }

    const { value } = result;
    const id = `CYM-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const stored: StoredLead = {
        ...value, 
        id, 
        createdAt: new Date().toISOString(),
        estimate: estimate(value.selection),
        brief: buildBrief(value.selection, value),
    };
    try {
        saveLead(stored);
    } catch(err){
        console.error('Failed to persist lead', err);
        return { status: 500, json: { error: 'Could not save your inquiry. Please email opportunities@cynbit.in.' }};
    }

    return { status: 201, json: { ok: true, id, estimate: stored.estimate }};
}