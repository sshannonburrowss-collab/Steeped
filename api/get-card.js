/**
 * /api/get-card.js
 * GET /api/get-card?id=CARD_ID
 *
 * Fetches a card by ID. Tries Supabase first, falls back to
 * a graceful 404 if not found.
 *
 * Supabase table required:
 *   cards ( id text PK, data jsonb, user_id text, created_at timestamptz, updated_at timestamptz )
 *   RLS: enable read for all (cards are public via link)
 */
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "id is required" });

  const { data, error } = await supabase
    .from("cards")
    .select("data")
    .eq("id", id)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Card not found" });
  }

  return res.status(200).json(data.data);
}
