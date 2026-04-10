/**
 * /api/upload-photo.js
 * POST /api/upload-photo
 * Body: { photo: "data:image/jpeg;base64,...", inviteId, userId? }
 *
 * Uploads a compressed base64 photo to Supabase Storage.
 * Requires: Storage bucket "invite-photos" with Public = ON
 */
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { photo, inviteId } = req.body || {};

  if (!photo) return res.status(400).json({ error: "photo is required" });
  if (!inviteId) return res.status(400).json({ error: "inviteId is required" });
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return res.status(500).json({ error: "SUPABASE_URL not configured" });
  if (!process.env.SUPABASE_SERVICE_KEY) return res.status(500).json({ error: "SUPABASE_SERVICE_KEY not configured" });

  // Parse base64
  const match = photo.match(/^data:(image\/[\w+]+);base64,(.+)$/);
  if (!match) return res.status(400).json({ error: "Invalid photo format — must be a data URL" });

  const mime = match[1];
  const ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
  const buffer = Buffer.from(match[2], "base64");
  const filename = `invites/${inviteId}.${ext}`;

  console.log(`[upload-photo] Uploading ${filename} (${Math.round(buffer.length/1024)}KB)`);

  const { error: uploadErr } = await supabase.storage
    .from("invite-photos")
    .upload(filename, buffer, { contentType: mime, upsert: true });

  if (uploadErr) {
    console.error("[upload-photo] Supabase upload error:", uploadErr.message);
    return res.status(500).json({ error: uploadErr.message });
  }

  const { data } = supabase.storage.from("invite-photos").getPublicUrl(filename);
  console.log(`[upload-photo] Success: ${data.publicUrl}`);
  return res.status(200).json({ url: data.publicUrl });
}
