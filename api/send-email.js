const RESEND_API = "https://api.resend.com/emails";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "RESEND_API_KEY not configured." });

  const from = process.env.RESEND_FROM_EMAIL || "Steeped <onboarding@resend.dev>";
  const { type, to, recipientName, signerName, senderName, senderNote, cardUrl, message } = req.body || {};
  if (!to) return res.status(400).json({ error: "Recipient email (to) is required." });

  let subject, html, text;

  if (type === "nudge") {
    const nudgeMsg = message || "Your message would mean so much — there's still time to sign!";
    const from_name = senderName || "Someone special";
    subject = `${from_name} saved a spot for you on a card 🖊️`;
    html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF5EE;font-family:Georgia,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF5EE;padding:48px 0;">
  <tr><td align="center">
    <table width="540" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;box-shadow:0 8px 40px rgba(42,21,8,.12);overflow:hidden;max-width:95%;">
      <tr><td style="background:linear-gradient(150deg,#fdf0e8,#f5e0cc,#eedcb8);padding:44px 48px 36px;text-align:center;">
        <div style="font-family:Georgia,serif;font-size:32px;font-weight:400;color:#2A1508;letter-spacing:-.5px;">St<em style="color:#d4a843;font-style:italic;">ee</em>ped</div>
        <div style="font-size:9px;letter-spacing:4px;text-transform:uppercase;color:rgba(42,21,8,.4);margin-top:6px;">cards brewed with kindness</div>
      </td></tr>
      <tr><td style="padding:44px 48px 36px;">
        <p style="font-family:Georgia,serif;font-size:26px;font-weight:400;color:#2A1508;margin:0 0 8px;line-height:1.3;">A spot is waiting for you 🖊️</p>
        <p style="font-size:14px;color:rgba(42,21,8,.55);letter-spacing:.5px;margin:0 0 28px;">from ${from_name}</p>
        <div style="width:40px;height:2px;background:#d4a843;margin:0 0 28px;"></div>
        <p style="font-size:16px;color:#5a3a10;line-height:1.85;margin:0 0 24px;">${nudgeMsg}</p>
        <p style="font-size:15px;color:#8B6E4E;line-height:1.8;margin:0 0 32px;">Your words are the ones they'll read again and again. It only takes a moment to leave something that lasts.</p>
        ${cardUrl ? `
        <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:8px 0 32px;">
          <a href="${cardUrl}" style="display:inline-block;background:#2A1508;color:#FAF5EE;font-family:Georgia,sans-serif;font-size:15px;letter-spacing:.5px;padding:16px 44px;border-radius:6px;text-decoration:none;">Sign the card →</a>
        </td></tr></table>
        <p style="font-size:11px;color:rgba(42,21,8,.35);text-align:center;margin:0;">Or copy this link: <span style="color:#8B6E4E;">${cardUrl}</span></p>
        ` : ""}
      </td></tr>
      <tr><td style="padding:24px 48px;border-top:1px solid rgba(42,21,8,.07);text-align:center;">
        <p style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(42,21,8,.3);margin:0;">Steeped · Cards brewed with kindness</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
    text = `${from_name} saved a spot for you on a card.\n\n${nudgeMsg}\n\nSign it here: ${cardUrl || "(link unavailable)"}`;

  } else {
    // Card delivery
    const name = recipientName || "there";
    subject = `Something warm is waiting for you, ${name} 🌸`;
    html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF5EE;font-family:Georgia,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF5EE;padding:48px 0;">
  <tr><td align="center">
    <table width="540" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;box-shadow:0 8px 40px rgba(42,21,8,.13);overflow:hidden;max-width:95%;">

      <!-- Warm header -->
      <tr><td style="background:linear-gradient(150deg,#fdf0e8,#f5e0cc,#eedcb8);padding:52px 48px 44px;text-align:center;">
        <div style="font-family:Georgia,serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:rgba(42,21,8,.45);margin-bottom:20px;">a card, brewed just for you</div>
        <div style="font-family:Georgia,serif;font-size:42px;font-weight:400;color:#2A1508;letter-spacing:-1px;margin-bottom:6px;">St<em style="color:#d4a843;">ee</em>ped</div>
      </td></tr>

      <!-- Personal message -->
      <tr><td style="padding:52px 52px 40px;">
        <p style="font-family:Georgia,serif;font-size:30px;font-weight:400;color:#2A1508;margin:0 0 6px;line-height:1.2;">Hello, ${name}.</p>
        <div style="width:36px;height:2px;background:#d4a843;margin:18px 0 28px;"></div>
        <p style="font-size:16px;color:#5a3a10;line-height:1.9;margin:0 0 24px;">The people in your life got together and made something just for you — a card filled with their words, their warmth, and everything they wished they could say in person.</p>
        ${senderNote ? `
        <div style="border-left:3px solid #d4a843;padding:18px 22px;background:#fdf7f0;border-radius:0 8px 8px 0;margin:0 0 32px;">
          <p style="font-family:Georgia,serif;font-size:16px;color:#5a3a10;font-style:italic;line-height:1.8;margin:0;">&ldquo;${senderNote}&rdquo;</p>
        </div>
        ` : `<p style="font-size:15px;color:#8B6E4E;line-height:1.8;margin:0 0 32px;">Go ahead — open it. There's something worth reading waiting for you.</p>`}

        <!-- CTA button -->
        ${cardUrl ? `
        <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:8px 0 36px;">
          <a href="${cardUrl}" style="display:inline-block;background:#2A1508;color:#FAF5EE;font-family:Georgia,sans-serif;font-size:16px;letter-spacing:.5px;padding:18px 52px;border-radius:6px;text-decoration:none;font-weight:400;">Open your card →</a>
        </td></tr></table>
        <p style="font-size:12px;color:rgba(42,21,8,.38);text-align:center;margin:0 0 4px;">Having trouble? Copy this link into your browser:</p>
        <p style="font-size:12px;color:#8B6E4E;text-align:center;margin:0;">${cardUrl}</p>
        ` : ""}
      </td></tr>

      <!-- Warm closing -->
      <tr><td style="background:#fdf7f0;padding:32px 52px;border-top:1px solid rgba(42,21,8,.07);">
        <p style="font-family:Georgia,serif;font-size:16px;color:#8B6E4E;font-style:italic;line-height:1.8;margin:0 0 8px;">May it bring you a quiet smile today.</p>
        <p style="font-size:12px;color:rgba(42,21,8,.4);margin:0;">With warmth — Steeped</p>
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:20px 48px;text-align:center;">
        <p style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(42,21,8,.28);margin:0;">Steeped · Cards brewed with kindness · <a href="https://steepedcards.com" style="color:rgba(42,21,8,.28);text-decoration:none;">steepedcards.com</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
    text = `Hello ${name},\n\nThe people in your life got together and made something just for you.\n\n${senderNote ? `"${senderNote}"\n\n` : ""}Open your card here:\n${cardUrl || "(link unavailable)"}\n\nWith warmth — Steeped`;
  }

  try {
    const r = await fetch(RESEND_API, {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html, text }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: data?.message || "Email failed to send." });
    return res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    return res.status(500).json({ error: "Could not reach email service." });
  }
}
