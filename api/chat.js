import { getTrustedList, promptListFrom } from "../lib/store.js";

// ── Tunable limits (these bound your cost per request) ──
const MODEL = "claude-haiku-4-5-20251001"; // cheapest current model; swap to "claude-sonnet-5" for richer replies
const MAX_TOKENS = 800;
const MAX_MSG_CHARS = 600;
const MAX_HISTORY = 6;
const RATE_LIMIT = 25;
const RATE_WINDOW_MS = 60000;

const RULES = `You are Beacon, a warm, concise scholarship advisor for US college students. You match people to REAL scholarships from the fixed list provided. Rules:
- ONLY recommend scholarships from the list, by their id. Never invent scholarships, amounts, or URLs.
- Pick the 3-6 best-fit ids, most relevant first, considering the user's situation, state, GPA, study level, and desired award size.
- If someone is a veteran/military family, prioritize veteran awards but also include open need/merit ones they qualify for. Same logic for disability and other situations.
- Each scholarship shows a difficulty (1-10) and an estimated time to complete. If the user asks for easy, quick, low-effort, or "worth the time" options, prefer lower-difficulty / shorter-time ones, and you may mention the effort/time in your reply.
- Keep "reply" to 2-4 encouraging, plain-language sentences. When relevant, remind them to file the FAFSA first and to verify deadlines on official pages.
- If nothing fits well, say so kindly and offer the closest options.
Return ONLY valid JSON, no markdown, no code fences, exactly: {"reply": string, "matches": [string ids]}`;

const LEVELS = { "hs-senior": "HS senior", college: "In college", any: "Any" };

function profileText(p = {}) {
  const parts = [];
  const situ = { veterans: "Veteran/military family", disability: "Student with a disability", need: "General/financial need", merit: "High achiever", stem: "STEM student", identity: "Community-based" };
  if (Array.isArray(p.situations) && p.situations.length) parts.push("Situation: " + p.situations.map((k) => situ[k] || k).join(", "));
  if (p.state && p.state !== "Any") parts.push("State: " + p.state);
  if (p.gpa) parts.push("GPA: " + p.gpa);
  if (p.level && p.level !== "any") parts.push("Level: " + (LEVELS[p.level] || p.level));
  if (p.minAward > 0) parts.push("Minimum award wanted: $" + p.minAward);
  return parts.length ? parts.join(" \u00b7 ") : "No profile details set yet.";
}

function limited(ip) {
  const store = (globalThis.__beaconRL ||= new Map());
  const now = Date.now();
  const hits = (store.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  store.set(ip, hits);
  return hits.length > RATE_LIMIT;
}

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }
  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY. Add it in your Vercel project settings." });
    return;
  }

  const ip = (req.headers["x-forwarded-for"] || "unknown").toString().split(",")[0].trim();
  if (limited(ip)) {
    res.status(429).json({ reply: "You're sending messages a little fast - give it a few seconds and try again.", matches: [] });
    return;
  }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const profile = (body && body.profile) || {};
  const messages = (body && body.messages) || [];

  const trusted = await getTrustedList();
  const validIds = new Set(trusted.map((s) => s.id));
  const system = RULES + "\n\nSCHOLARSHIP LIST:\n" + promptListFrom(trusted);

  const trimmed = messages.slice(-MAX_HISTORY).map((m) => ({
    role: m.role === "ai" ? "assistant" : "user",
    content: String(m.text || "").slice(0, MAX_MSG_CHARS),
  }));
  for (let i = trimmed.length - 1; i >= 0; i--) {
    if (trimmed[i].role === "user") {
      trimmed[i].content = "User profile - " + profileText(profile) + "\n\nUser message: " + trimmed[i].content;
      break;
    }
  }
  if (!trimmed.length) { res.status(400).json({ error: "No message provided." }); return; }

  try {
    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
        messages: trimmed,
      }),
    });
    if (!apiRes.ok) { console.error("Anthropic error", apiRes.status, await apiRes.text()); res.status(502).json(fallback()); return; }

    const data = await apiRes.json();
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
    const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    let parsed;
    try { parsed = JSON.parse(clean); } catch { parsed = fallback(); }

    const matches = (Array.isArray(parsed.matches) ? parsed.matches : []).filter((id) => validIds.has(id)).slice(0, 6);
    res.status(200).json({ reply: parsed.reply || "Here are some options to look at.", matches });
  } catch (err) {
    console.error("Handler error", err);
    res.status(502).json(fallback());
  }
}

function fallback() {
  return {
    reply: "I hit a snag reaching the matching service. In the meantime, start with the FAFSA (it unlocks most need-based aid) and use the filters on the left to narrow things down.",
    matches: ["pell", "gates", "coke", "dell"],
  };
}
