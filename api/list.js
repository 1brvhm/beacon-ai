import { SCHOLARSHIPS, CATS } from "../lib/scholarships.js";

// GET /api/list  →  { scholarships, cats }
// The website loads this once to render cards and filters, so the
// scholarship data lives in exactly one place (lib/scholarships.js).
export default function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).json({ scholarships: SCHOLARSHIPS, cats: CATS });
}
