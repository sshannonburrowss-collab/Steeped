/**
 * /api/add-signature.js
 * POST /api/add-signature
 * Body: { cardId, pageIndex, signature }
 *
 * Appends a signature item to a specific page of a card in Supabase.
 */
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { cardId, pageIndex, signature } = req.body || {};
  if (!cardId || signature === undefined || pageIndex === undefined) {
    return res.status(400).json({ error: "cardId, pageIndex and signature are required" });
  }

  // Fetch current card data
  const { data: row, error: fetchErr } = await supabase
    .from("cards")
    .select("data")
    .eq("id", cardId)
    .single();

  if (fetchErr || !row) {
    return res.status(404).json({ error: "Card not found" });
  }

  const card = row.data;
  const pages = card.pages || [];

  if (pageIndex < 0 || pageIndex >= pages.length) {
    return res.status(400).json({ error: `pageIndex ${pageIndex} out of range` });
  }

  // Append signature to the target page
  pages[pageIndex] = {
    ...pages[pageIndex],
    items: [...(pages[pageIndex].items || []), signature],
  };

  const updatedCard = { ...card, pages, updatedAt: new Date().toISOString() };

  const { error: saveErr } = await supabase
    .from("cards")
    .update({ data: updatedCard, updated_at: updatedCard.updatedAt })
    .eq("id", cardId);

  if (saveErr) {
    console.error("[add-signature] Supabase error:", saveErr.message);
    return res.status(500).json({ error: saveErr.message });
  }

  return res.status(200).json({ ok: true });
}
