import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { photo, inviteId, userId } = req.body || {};
  if (!photo || !inviteId) return res.status(400).json({ error: "photo and inviteId required" });

  // Strip the data URL prefix to get raw base64
  const base64 = photo.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  // Detect format from data URL
  const mimeMatch = photo.match(/^data:(image\/\w+);base64,/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const ext = mime.split("/")[1] || "jpg";

  const filename = `invites/${inviteId}.${ext}`;

  const { error } = await supabase.storage
    .from("invite-photos")
    .upload(filename, buffer, {
      contentType: mime,
      upsert: true, // overwrite if re-saving
    });

  if (error) {
    console.error("[upload-photo]", error.message);
    return res.status(500).json({ error: error.message });
  }

  const { data: urlData } = supabase.storage
    .from("invite-photos")
    .getPublicUrl(filename);

  return res.status(200).json({ url: urlData.publicUrl });
}
