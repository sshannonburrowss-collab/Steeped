import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { photo, inviteId } = req.body || {};
    if (!photo) return res.status(400).json({ error: "photo required" });
    if (!inviteId) return res.status(400).json({ error: "inviteId required" });

    const match = photo.match(/^data:([^;]+);base64,(.+)$/s);
    if (!match) return res.status(400).json({ error: "Invalid data URL format" });

    const mime = match[1];
    const buffer = Buffer.from(match[2], "base64");

    // Determine bucket and file extension based on mime type
    let bucket, ext;
    if (mime.startsWith("audio/")) {
      bucket = "invite-photos"; // reuse same bucket
      ext = mime.includes("mpeg") ? "mp3" : mime.includes("ogg") ? "ogg" : "mp3";
    } else {
      bucket = "invite-photos";
      ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
    }

    const filename = "invites/" + inviteId + "." + ext;

    const { error: uploadErr } = await supabase.storage
      .from(bucket)
      .upload(filename, buffer, { contentType: mime, upsert: true });

    if (uploadErr) return res.status(500).json({ error: uploadErr.message });

    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
    return res.status(200).json({ url: data.publicUrl });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
