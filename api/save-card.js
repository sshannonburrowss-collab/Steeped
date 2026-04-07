/**
 * /api/save-card.js
 * POST /api/save-card
 * Body: { theme, pages, coverItems, userId?, cardId? }
 *
 * Creates or updates a card in Supabase.
 * Returns { cardId } — the canonical ID to use in share links.
 *
 * Supabase table required:
 *   cards ( id text PK, data jsonb, user_id text, created_at timestamptz, updated_at timestamptz )
 *   RLS: enable insert/update for authenticated users OR disable RLS and use service key only
 */
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { theme, pages, coverItems, userId, cardId } = req.body || {};

  if (!theme) return res.status(400).json({ error: "theme is required" });

  const id = cardId || randomUUID();
  const now = new Date().toISOString();

  const cardData = {
    id,
    theme,
    pages,
    coverItems,
    updatedAt: now,
    createdAt: now,
  };

  const { error } = await supabase
    .from("cards")
    .upsert({
      id,
      data: cardData,
      user_id: userId || null,
      updated_at: now,
    });

  if (error) {
    console.error("[save-card] Supabase error:", error.message);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ cardId: id });
}
