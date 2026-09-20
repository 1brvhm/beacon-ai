import { SCHOLARSHIPS } from "../lib/scholarships.js";
import { checkAdmin, storeReady, getPending, getApproved, setPending, normalizeCandidate, dedupe } from "../lib/store.js";

// POST /api/discover  (admin only)  → runs live web search, adds NEW
// candidates to the pending queue. Never touches what students see.
const MODEL = "claude-sonnet-5";        // stronger model for research
const MAX_SEARCHES = 8;                  // caps web-search cost per run ($10 / 1,000 searches)
const MAX_TOKENS = 3500;

const INSTRUCTIONS = `You research REAL, currently-open US college scholarships and return them as structured data. Use web search to find them. Rules:
- Only include scholarships you can verify from an official or reputable page, WITH a real https application/info URL you actually found.
- Prefer nationwide programs, plus these categories: veterans/military families, students with disabilities, general need/merit, STEM, community/identity-based, and US state grants.
- Do NOT include any scholarship whose name or organization already appears in the EXCLUDE list.
- Never guess or fabricate amounts, deadlines, or URLs. If unsure of a field, use a safe default ("Varies", null).
After researching, output ONLY a JSON array (no prose, no code fences). Each item:
{"name","cat","amt","max","states","gpa","level","difficulty","time_estimate","who","url","source_note"}
where cat is one of need|merit|veterans|disability|stem|identity|state; max is the largest award as a number (0 if unknown); states is "all" or a 2-letter code; gpa is a number or null; level is any|hs-senior|college; difficulty is 1-10 (1 = simple form or mostly need-based, 4-6 = application plus essays, 7-10 = major essays/portfolio or highly competitive); time_estimate is a short string like "~1 hr", "2-4 hrs", or "Several days"; who is one sentence; url is the official https link; source_note is where you found it. If unsure of difficulty use 5 and time_estimate "Varies". Return at most 10 items.`;

function extractJsonArray(text) {
  const a = text.indexOf("[");
  const b = text.lastIndexOf("]");
  if (a === -1 || b === -1 || b < a) return [];
  try { return JSON.parse(text.slice(a, b + 1)); } catch { return []; }
}

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }
  if (!checkAdmin(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  if (!process.env.ANTHROPIC_API_KEY) { res.status(500).json({ error: "Missing ANTHROPIC_API_KEY." }); return; }
  if (!storeReady()) { res.status(400).json({ error: "Storage not set up. Add the Upstash Redis integration on Vercel first." }); return; }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const focus = String((body && body.focus) || "").slice(0, 200);

  const [pending, approved] = await Promise.all([getPending(), getApproved()]);
  const existing = [...SCHOLARSHIPS, ...approved, ...pending];
  const excludeNames = existing.map((s) => s.name).join("; ").slice(0, 4000);

  const userMsg = `Find current US scholarships to add to our directory${focus ? `, focusing on: ${focus}` : ""}.\n\nEXCLUDE (already in our system): ${excludeNames}`;

  try {
    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: INSTRUCTIONS,
        tools: [{ type: "web_search_20260209", name: "web_search", max_uses: MAX_SEARCHES }],
        messages: [{ role: "user", content: userMsg }],
      }),
    });
    if (!apiRes.ok) { const t = await apiRes.text(); console.error("discover api", apiRes.status, t); res.status(502).json({ error: "Search service error (" + apiRes.status + ")." }); return; }

    const data = await apiRes.json();
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
    const raw = extractJsonArray(text);
    const normalized = raw.map(normalizeCandidate).filter(Boolean);
    const fresh = dedupe(normalized, existing);

    const updated = [...fresh, ...pending];
    await setPending(updated);

    res.status(200).json({ added: fresh.length, scanned: raw.length, pending: updated.length, items: fresh });
  } catch (err) {
    console.error("discover error", err);
    res.status(502).json({ error: "Discovery failed. Try again." });
  }
}
