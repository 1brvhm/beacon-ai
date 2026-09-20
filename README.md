# Beacon — deploy your live AI scholarship agent

This is a complete website + AI backend. You'll host it free on **Vercel** and pay only Anthropic's tiny per-message fee. No coding required — just follow the steps.

**How it's built (30-second version):** the website (`index.html`) never sees your API key. It talks to your own backend (`api/chat.js`), and *that* talks to Claude using a key stored securely on Vercel. This is the only safe way to run a public AI agent.

```
beacon/
├── index.html          ← the website people see
├── api/
│   ├── chat.js         ← the secured "brain" (holds your key, calls Claude)
│   └── list.js         ← serves the scholarship list to the website
├── lib/
│   └── scholarships.js ← the scholarship database — EDIT THIS to add programs
├── package.json
└── .env.example
```

---

## Step 1 — Get an Anthropic API key (5 min)

1. Go to **https://console.anthropic.com** and sign in (this is a developer account, separate from Claude.ai).
2. Add a payment method under **Billing**.
3. **Important:** under **Billing → Limits**, set a **monthly spend limit** (e.g. $20). This is your safety net so a public bot can never run up a surprise bill.
4. Go to **API keys → Create key**, and copy it (starts with `sk-ant-...`). Keep it private — treat it like a password.

## Step 2 — Put the code on GitHub (no git needed)

1. Create a free account at **https://github.com** → **New repository** → name it `beacon` → Create.
2. On the new repo page, click **uploading an existing file**.
3. Drag in **all** the files and folders from this project (keep the folder structure — `api/` and `lib/` must stay as folders). Click **Commit changes**.

## Step 3 — Deploy on Vercel (5 min)

1. Go to **https://vercel.com** → sign up **with GitHub**.
2. **Add New… → Project** → import your `beacon` repo.
3. Before clicking Deploy, open **Environment Variables** and add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** the `sk-ant-...` key from Step 1
4. Click **Deploy**. In ~1 minute you'll get a live URL like `beacon-xyz.vercel.app`. That's your shareable link.

## Step 4 (optional) — Use your own domain

In the Vercel project: **Settings → Domains → Add**, then point your domain (e.g. `scholarships.yoursite.com`). Vercel walks you through the DNS records.

---

## Editing scholarships

Open **`lib/scholarships.js`** — everything lives there. Copy an existing entry, change the fields, and commit. Both the website and the AI update automatically (they read from this one file).

- `id` — a short unique tag (no spaces), e.g. `"new-award"`
- `cat` — one of: `need`, `merit`, `veterans`, `disability`, `stem`, `identity`, `state`
- `max` — the largest award as a plain number (used for the "minimum award" filter)
- `amt` — the amount shown on the card, e.g. `"Up to $5,000"`
- `states` — `"all"`, or a two-letter code like `"CA"`
- `gpa` — a minimum GPA number, or `null` if none
- `level` — `"any"`, `"hs-senior"`, or `"college"`
- `difficulty` — a number 1–10 (1 = simple form / mostly need-based, 4–6 = application + essays, 7–10 = major essays or highly competitive). Shown as the effort meter and used by the "Max effort" filter.
- `time` — a short estimate shown on the card, e.g. `"~1 hr"`, `"2-4 hrs"`, `"Several days"`
- `who` — one plain sentence on who it's for
- `url` — the **official** application page (always verify it works)

Only add real programs with real links — that's what keeps the agent trustworthy.

## What it costs

- **Hosting:** free on Vercel's Hobby tier.
- **AI:** it uses **Claude Haiku 4.5** at roughly **half a cent per message**. The scholarship list is cached, so repeat calls are cheaper. Around **1,000 student conversations ≈ $10–30**.
- Want richer, more nuanced replies? In `api/chat.js`, change `MODEL` to `"claude-sonnet-5"` (a bit more per message).

## Cost & abuse controls (already built in)

- A **spend limit** in the Anthropic Console (Step 1) is your hard cap — set it.
- The backend caps reply length, message length, and history, and rate-limits each visitor (`api/chat.js`, the settings at the top).
- For heavy public traffic, add **Vercel KV** or **Upstash Redis** for stricter cross-server rate limiting later.

## Troubleshooting

- **"Server is missing ANTHROPIC_API_KEY"** → the env var wasn't added, or you added it after deploying. Add it, then **Redeploy** from the Vercel dashboard.
- **Website loads but chat fails** → check the key is valid and billing is active in the Anthropic Console.
- **Opening `index.html` on your computer shows an error** → that's expected. It needs its backend, so it only works once deployed to Vercel.

---

# Part 2 — AI discovery + review queue (the two-tier system)

This adds live web search that finds new scholarships and drops them into a **private review queue**. Nothing reaches students until you approve it. Everything here is additive — if you skip it, the site keeps running on your curated list.

## What gets added
- `lib/store.js` — the storage + safety logic
- `api/discover.js` — runs live web search (admin only)
- `api/admin-queue.js`, `api/admin-review.js` — the review actions (admin only)
- `admin.html` — your private console at `yoursite.com/admin.html`
- `api/list.js` and `api/chat.js` — updated to serve curated **+ approved** finds

## Step A — Add storage (Upstash Redis, ~2 min)

The queue needs somewhere durable to live. Vercel's Marketplace wires this up for you:

1. In your Vercel project → **Storage** tab → **Create / Connect Database**.
2. Choose **Upstash → Redis**, pick the free plan, connect it to this project.
3. That's it — Vercel automatically adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` to your environment variables. You don't copy anything by hand.

## Step B — Set your admin password

1. Vercel project → **Settings → Environment Variables → Add**.
2. **Name:** `ADMIN_TOKEN`  **Value:** any long random string you'll remember (this is your console password).
3. **Redeploy** (Deployments → ⋯ → Redeploy) so the new variables take effect.

## Step C — Use it

1. Go to **`yoursite.com/admin.html`** and paste your `ADMIN_TOKEN` to unlock.
2. Click **Run discovery** (optionally type a focus like "disability scholarships in Texas"). It web-searches and fills the review queue.
3. For each candidate: check the link works, edit any field (amount, GPA, category, etc.), then **Approve & publish** or **Reject**.
4. Approved ones instantly appear to students alongside your curated list. You can **Unpublish** any of them later.

## Cost
- Storage: free (Upstash free tier = 500K commands/month).
- Discovery: each run does up to ~8 web searches at $10 per 1,000 searches, plus tokens — roughly **$0.10–0.30 per run**. It's manual, so you control how often.

## Safety model (why this is the trustworthy way)
- Web search results are **candidates only** — they are never shown to students.
- Anything without a real `https` link is dropped automatically; obvious duplicates are filtered.
- A human (you) verifies and approves every item before it goes live.
- Students still only ever receive links from your approved + curated set.

## Optional — automate discovery weekly
If you want candidates to appear automatically for you to review:
1. Add an env var `CRON_SECRET` (any random string).
2. Add a file `vercel.json` at the repo root:
   ```json
   { "crons": [ { "path": "/api/discover", "schedule": "0 14 * * 1" } ] }
   ```
   (That runs Mondays at 14:00 UTC.) Vercel calls it automatically; you just review the queue when convenient. Remove the file to turn it off.
