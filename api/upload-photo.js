import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { photo, inviteId } = req.body || {};
  if (!photo) return res.status(400).json({ error: "photo required" });
  if (!inviteId) return res.status(400).json({ error: "inviteId required" });
  const match = photo.match(/^data:(image\/[\w+]+);base64,(.+)$/s);
  if (!match) return res.status(400).json({ error: "Invalid photo format" });
  const mime = match[1]; const ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
  const buffer = Buffer.from(match[2], "base64");
  const filename = "invites/" + inviteId + "." + ext;
  const { error: uploadErr } = await supabase.storage.from("invite-photos").upload(filename, buffer, { contentType: mime, upsert: true });
  if (uploadErr) return res.status(500).json({ error: uploadErr.message });
  const { data } = supabase.storage.from("invite-photos").getPublicUrl(filename);
  return res.status(200).json({ url: data.publicUrl });
}
 

  const { data } = supabase.storage.from("invite-photos").getPublicUrl(filename);
  return res.status(200).json({ url: data.publicUrl });
};
