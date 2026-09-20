import { getTrustedList } from "../lib/store.js";
import { CATS } from "../lib/scholarships.js";

// GET /api/list  →  { scholarships, cats }
// Serves the curated baseline plus any admin-approved finds. Falls
// back to curated-only if the store isn't set up yet.
export default async function handler(req, res) {
  if (req.method !== "GET") { res.status(405).json({ error: "Method not allowed" }); return; }
  const scholarships = await getTrustedList();
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=600");
  res.status(200).json({ scholarships, cats: CATS });
}
