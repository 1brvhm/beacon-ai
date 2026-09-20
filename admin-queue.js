import { checkAdmin, storeReady, getPending, getApproved } from "../lib/store.js";

// GET /api/admin-queue  (admin only) → { pending, approved, storeReady }
export default async function handler(req, res) {
  if (req.method !== "GET") { res.status(405).json({ error: "Method not allowed" }); return; }
  if (!checkAdmin(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const [pending, approved] = await Promise.all([getPending(), getApproved()]);
  res.status(200).json({ pending, approved, storeReady: storeReady() });
}
