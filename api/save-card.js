const { createClient } = require("@supabase/supabase-js");
const { randomUUID } = require("crypto");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { theme, pages, coverItems, userId, cardId } = req.body || {};
  const id = cardId || randomUUID();
  const now = new Date().toISOString();
  const data = { id, theme, pages, coverItems, updatedAt: now };
  const { error } = await supabase.from("cards").upsert({ id, data, user_id: userId || null, updated_at: now });
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ cardId: id });
};
