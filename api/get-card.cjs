const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "id required" });
  const { data, error } = await supabase.from("cards").select("data").eq("id", id).single();
  if (error || !data) return res.status(404).json({ error: "Card not found" });
  return res.status(200).json(data.data);
};
