// ─────────────────────────────────────────────────────────────
// Beacon store — durable review queue on Upstash Redis (via the
// Vercel Marketplace, which injects KV_REST_API_URL + KV_REST_API_TOKEN).
// Everything degrades gracefully: if Redis isn't configured yet, the
// app still runs on the curated list in scholarships.js.
// ─────────────────────────────────────────────────────────────

import { SCHOLARSHIPS, CATS } from "./scholarships.js";

const RURL = process.env.KV_REST_API_URL;
const RTOK = process.env.KV_REST_API_TOKEN;

const PENDING_KEY = "beacon:pending";
const APPROVED_KEY = "beacon:approved";
const MAX_PENDING = 120;

export function storeReady() {
  return Boolean(RURL && RTOK);
}

async function cmd(args) {
  const r = await fetch(RURL, {
    method: "POST",
    headers: { Authorization: `Bearer ${RTOK}`, "content-type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!r.ok) throw new Error("redis " + r.status);
  const d = await r.json();
  return d.result;
}

export async function getArr(key) {
  if (!storeReady()) return [];
  try {
    const v = await cmd(["GET", key]);
    return v ? JSON.parse(v) : [];
  } catch {
    return [];
  }
}

async function setArr(key, arr) {
  if (!storeReady()) throw new Error("Store not configured (add the Upstash integration on Vercel).");
  await cmd(["SET", key, JSON.stringify(arr)]);
}

export const getPending = () => getArr(PENDING_KEY);
export const getApproved = () => getArr(APPROVED_KEY);
export const setPending = (a) => setArr(PENDING_KEY, a.slice(0, MAX_PENDING));
export const setApproved = (a) => setArr(APPROVED_KEY, a);

// The list students actually see: curated baseline + approved finds.
export async function getTrustedList() {
  const approved = await getApproved();
  const byId = new Map();
  for (const s of SCHOLARSHIPS) byId.set(s.id, s);
  for (const s of approved) if (!byId.has(s.id)) byId.set(s.id, s);
  return [...byId.values()];
}

export function promptListFrom(list) {
  return list
    .map((s) => `${s.id} | ${s.name} | ${(CATS[s.cat] || {}).label || s.cat} | max $${s.max} | states:${s.states} | gpa:${s.gpa || "none"} | level:${s.level} | difficulty:${s.difficulty || 5}/10 | time:${s.time || "Varies"} | ${s.who}`)
    .join("\n");
}

// ── Candidate normalization & de-duplication ──
const ALLOWED = new Set(Object.keys(CATS));

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "item";
}

function cleanUrl(u) {
  try {
    const url = new URL(String(u).trim());
    if (url.protocol !== "https:") return "";
    return url.href;
  } catch {
    return "";
  }
}

function host(u) {
  try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; }
}

export function normalizeCandidate(c) {
  const url = cleanUrl(c.url);
  const name = String(c.name || "").trim().slice(0, 120);
  if (!url || !name) return null; // must have a real name + https link
  const maxNum = Number(c.max);
  const gpaNum = Number(c.gpa);
  const diffNum = Number(c.difficulty);
  return {
    id: "disc-" + slugify(name),
    name,
    cat: ALLOWED.has(c.cat) ? c.cat : "need",
    amt: String(c.amt || "Varies").slice(0, 40),
    max: Number.isFinite(maxNum) ? Math.max(0, Math.round(maxNum)) : 0,
    states: /^[A-Z]{2}$/.test(c.states) ? c.states : "all",
    gpa: c.gpa === null || c.gpa === undefined || c.gpa === "" || !Number.isFinite(gpaNum) ? null : gpaNum,
    level: ["any", "hs-senior", "college"].includes(c.level) ? c.level : "any",
    difficulty: Number.isFinite(diffNum) ? Math.min(10, Math.max(1, Math.round(diffNum))) : 5,
    time: String(c.time_estimate || c.time || "Varies").trim().slice(0, 40),
    who: String(c.who || "").trim().slice(0, 300),
    url,
    source: String(c.source_note || c.source || "Found via web search").slice(0, 200),
    found_at: new Date().toISOString(),
    status: "pending",
  };
}

// Returns only candidates not already present (by id, name, or domain).
export function dedupe(candidates, existing) {
  const ids = new Set(existing.map((s) => s.id));
  const names = new Set(existing.map((s) => s.name.toLowerCase()));
  const hosts = new Set(existing.map((s) => host(s.url)).filter(Boolean));
  const seen = new Set();
  const out = [];
  for (const c of candidates) {
    if (!c) continue;
    const key = c.name.toLowerCase();
    if (ids.has(c.id) || names.has(key) || (host(c.url) && hosts.has(host(c.url))) || seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}

export function checkAdmin(req) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;
  const header = req.headers["x-admin-token"];
  const auth = (req.headers["authorization"] || "").replace(/^Bearer\s+/i, "");
  return header === token || auth === token || (process.env.CRON_SECRET && auth === process.env.CRON_SECRET);
}
