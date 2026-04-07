/**
 * /api/my-cards.js
 * GET /api/my-cards?userId=USER_ID
 *
 * Returns all cards belonging to a user, newest first.
 */
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  const { data, error } = await supabase
    .from("cards")
    .select("data")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const cards = (data || []).map(row => row.data);
  return res.status(200).json(cards);
}
