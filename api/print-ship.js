/**
 * /api/print-ship.js  — Vercel / Next.js serverless route
 *
 * Prints and ships a card via Prodigi, using Supabase Storage
 * to host the card images (Prodigi needs a public URL for each asset).
 *
 * ── Required env vars (add these to Vercel) ──────────────────────
 *   PRODIGI_API_KEY          — prodigi.com → Settings → API Keys (free account)
 *   NEXT_PUBLIC_SUPABASE_URL — already in your project
 *   SUPABASE_SERVICE_KEY     — Supabase → Settings → API → service_role key
 *                              (different from the anon key — has write access)
 *
 * ── One-time Supabase setup ───────────────────────────────────────
 *   1. Supabase dashboard → Storage → New bucket
 *   2. Name it: card-prints
 *   3. Toggle "Public bucket" ON  ← important, Prodigi must read the URL
 *   4. Done — no other config needed
 *
 * ── Prodigi setup ─────────────────────────────────────────────────
 *   1. Sign up free at https://dashboard.prodigi.com
 *   2. Settings → API Keys → Create key → copy it
 *   3. Add PRODIGI_API_KEY to Vercel environment variables
 *   4. Test with sandbox first (NODE_ENV != "production") — no charges
 */

const PRODIGI_BASE =
  process.env.NODE_ENV === "production"
    ? "https://api.prodigi.com/v4.0"
    : "https://api.sandbox.prodigi.com/v4.0";

const VALID_SKUS = new Set([
  "GLOBAL-GRE-A6",   // 4.1 × 5.8"  — most affordable
  "GLOBAL-GRE-A5",   // 5.8 × 8.3"  — most popular
  "GLOBAL-GRE-SQ",   // 5.5 × 5.5"  — square
  "GLOBAL-GRE-A4",   // 8.3 × 11.7" — large
]);

// ── Upload a base64 image to Supabase Storage, return public URL ──────────────
async function uploadToSupabase(base64DataUrl, fileName) {
  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey   = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) return null;

  // Strip the data:image/...;base64, prefix and convert to Buffer
  const base64 = base64DataUrl.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  const contentType = base64DataUrl.startsWith("data:image/png") ? "image/png" : "image/jpeg";

  const uploadUrl = `${supabaseUrl}/storage/v1/object/card-prints/${fileName}`;

  const r = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${serviceKey}`,
      "Content-Type":  contentType,
      "x-upsert":      "true",   // overwrite if re-submitting same card
    },
    body: buffer,
  });

  if (!r.ok) {
    const err = await r.text();
    console.error("[print-ship] Supabase upload failed:", err);
    return null;
  }

  // Public URL format for Supabase Storage public buckets
  return `${supabaseUrl}/storage/v1/object/public/card-prints/${fileName}`;
}

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const prodigiKey = process.env.PRODIGI_API_KEY;
  if (!prodigiKey) {
    return res.status(500).json({
      error: "PRODIGI_API_KEY is not set. Add it to your Vercel environment variables.",
    });
  }

  const { sku, recipient, coverBase64, page1Base64, cardId, cardUrl } = req.body || {};

  // Validate card size
  if (!VALID_SKUS.has(sku)) {
    return res.status(400).json({ error: `Unknown card size: ${sku}` });
  }

  // Validate address
  const { name, line1, city, zip, country, state, email, line2 } = recipient || {};
  if (!name || !line1 || !city || !zip || !country) {
    return res.status(400).json({
      error: "Required fields missing: name, address line 1, city, zip/postcode, country.",
    });
  }

  // ── Upload card images to Supabase Storage ─────────────────────
  const slug = (cardId || `tmp-${Date.now()}`).toString().replace(/[^a-z0-9-]/gi, "-");
  const ts   = Date.now();

  const [coverUrl, insideUrl] = await Promise.all([
    coverBase64  ? uploadToSupabase(coverBase64,  `${slug}-${ts}-cover.jpg`)  : Promise.resolve(null),
    page1Base64  ? uploadToSupabase(page1Base64,  `${slug}-${ts}-inside.jpg`) : Promise.resolve(null),
  ]);

  if (!coverUrl && !insideUrl) {
    return res.status(400).json({
      error:
        "Could not upload card images. Make sure SUPABASE_SERVICE_KEY is set in Vercel and the 'card-prints' bucket exists and is public.",
    });
  }

  // Build Prodigi assets (front and inside of the folded card)
  const assets = [];
  if (coverUrl)              assets.push({ printArea: "cover",  url: coverUrl  });
  if (insideUrl)             assets.push({ printArea: "insert", url: insideUrl });
  if (coverUrl && !insideUrl) assets.push({ printArea: "insert", url: coverUrl  });
  if (!coverUrl && insideUrl) assets.push({ printArea: "cover",  url: insideUrl });

  // ── Build Prodigi order ────────────────────────────────────────
  const merchantReference = `steeped-${ts}`;

  const order = {
    merchantReference,
    shippingMethod: "Standard",
    recipient: {
      name,
      ...(email && { email }),
      address: {
        line1,
        ...(line2 && { line2 }),
        postalOrZipCode: zip,
        countryCode:     country,
        townOrCity:      city,
        ...(state && { stateOrCounty: state }),
      },
    },
    items: [{
      merchantReference: "card",
      sku,
      copies: 1,
      sizing: "fillPrint",
      assets,
    }],
    metadata: {
      source:  "steeped",
      cardId:  cardId  || "",
      cardUrl: cardUrl || "",
    },
  };

  // ── Submit to Prodigi ──────────────────────────────────────────
  try {
    const r = await fetch(`${PRODIGI_BASE}/orders`, {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key":    prodigiKey,
      },
      body: JSON.stringify(order),
    });

    const data = await r.json();

    if (!r.ok) {
      console.error("[print-ship] Prodigi error:", JSON.stringify(data));
      return res.status(502).json({
        error: data?.detail || data?.title || "Prodigi order failed. Please try again.",
      });
    }

    return res.status(200).json({
      orderId: data.id || merchantReference,
      status:  data.status?.stage || "InProgress",
      eta:     "3–10 business days",
    });

  } catch (err) {
    console.error("[print-ship] Network error:", err.message);
    return res.status(500).json({ error: "Could not reach Prodigi. Check your connection and try again." });
  }
}
