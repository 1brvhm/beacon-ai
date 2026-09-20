import { checkAdmin, storeReady, getPending, getApproved, setPending, setApproved, normalizeCandidate } from "../lib/store.js";

// POST /api/admin-review  (admin only)
// body: { id, action: "approve" | "reject" | "remove", item?: {...edited fields} }
//  - approve: move pending -> approved (uses edited fields if provided)
//  - reject : drop from pending
//  - remove : drop from approved (unpublish)
export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }
  if (!checkAdmin(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  if (!storeReady()) { res.status(400).json({ error: "Storage not set up." }); return; }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const id = body && body.id;
  const action = body && body.action;
  if (!id || !action) { res.status(400).json({ error: "Missing id or action." }); return; }

  let [pending, approved] = await Promise.all([getPending(), getApproved()]);

  if (action === "reject") {
    pending = pending.filter((p) => p.id !== id);
    await setPending(pending);
  } else if (action === "remove") {
    approved = approved.filter((p) => p.id !== id);
    await setApproved(approved);
  } else if (action === "approve") {
    const original = pending.find((p) => p.id === id);
    if (!original) { res.status(404).json({ error: "Candidate not found in pending." }); return; }
    const merged = normalizeCandidate({ ...original, ...(body.item || {}) }) || original;
    merged.id = original.id;                 // keep stable id
    merged.status = "approved";
    merged.approved_at = new Date().toISOString();
    approved = [merged, ...approved.filter((a) => a.id !== merged.id)];
    pending = pending.filter((p) => p.id !== id);
    await Promise.all([setApproved(approved), setPending(pending)]);
  } else {
    res.status(400).json({ error: "Unknown action." }); return;
  }

  res.status(200).json({ ok: true, pending: pending.length, approved: approved.length });
}
