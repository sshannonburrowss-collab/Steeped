import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { inviteId, rsvp } = req.body || {};
  if (!inviteId || !rsvp) return res.status(400).json({ error: "inviteId and rsvp required" });
  const { data: row, error: fetchErr } = await supabase.from("invites").select("data").eq("id", inviteId).single();
  if (fetchErr || !row) return res.status(404).json({ error: "Invite not found" });
  const invite = row.data;
  invite.rsvps = [...(invite.rsvps || []), rsvp];
  invite.updatedAt = new Date().toISOString();
  const { error } = await supabase.from("invites").update({ data: invite, updated_at: invite.updatedAt }).eq("id", inviteId);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true });
}
