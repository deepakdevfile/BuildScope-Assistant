# Cynbit BuildScope Assistant (Next.js + TypeScript)

Two connected features for the Cynbit homepage:

1. **AI BuildScope Assistant** (`/`): a chat that interviews the visitor and builds a structured brief while a live estimate updates beside it.
2. **Project Estimator** (`/estimate`): a 4-step wizard that produces the same brief without AI. It is also the fallback when the assistant is unavailable.

Both submit to the same `/api/leads` endpoint.

## Run it

```bash
npm install
cp .env.example .env.local     # optional: add GEMINI_API_KEY for the live model
npm run dev                    # http://localhost:3000
beyond Node >= 22.6
npm run typecheck
```

With no API key, `npm run dev` uses a free **keyword-based demo mode** so you can try the full flow without spending tokens. In production, with no key and no `CHAT_MOCK=1`, the chat endpoint returns 503 and the UI points users to the estimator.

## How the AI part works

```
Browser ──messages + current selection──▶ /api/chat ──▶ model (tool: update_brief)
   ▲                                          │
   └── reply + sanitised selection + estimate ┘
```

- The model **never computes prices**. It calls the `update_brief` tool with service/feature/scope ids; `lib/estimator.ts` turns those into numbers.
- Tool arguments are untrusted: `normalizeSelection` drops unknown ids, so a hallucinated or injected value cannot corrupt the brief.
- The system prompt forbids quoting prices, keeps the model on Cynbit's services, and treats visitor text as data.
- Guardrails: 24 messages max, 1000 chars each, 20 requests/min/IP, 12 user turns per session, 40 KB body cap.
- The API key stays on the server. The model is called with plain `fetch` (no SDK) behind a small `ChatProvider` interface, so another provider is one function.

## Layout

```
lib/estimator.ts   pricing + brief logic (pure, shared by UI, API and AI tool)
lib/chat.ts        system prompt, tool schema, providers (Gemini, mock), validation
lib/leads.ts       validation, honeypot, rate limit, persistence
app/api/chat       POST: assistant turn
app/api/leads      POST: submit brief
components/        DiscoveryChat, Estimator, EstimatePanel, LeadForm
```

## Before production

- **Pricing is placeholder data** in `lib/estimator.ts`. Calibrate with Cynbit's sales team.
- **Replace `saveLead()`** (file append) with a database insert and an email/Slack notification. On Vercel the filesystem is ephemeral.
- **Replace the in-memory rate limiter** with a shared store (Upstash/Redis); it is per-instance and resets on restart.
- Add streaming responses, analytics events per step, a privacy notice link and consent for storing chats.
- Check the model id in `GEMINI_MODEL` and confirm the provider's current API terms and pricing.