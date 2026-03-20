export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { to, recipientName, senderNote, cardUrl } = req.body;

  if (!to) return res.status(400).json({ error: "No recipient email provided" });
  if (!process.env.RESEND_API_KEY) return res.status(500).json({ error: "Missing RESEND_API_KEY" });

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Steeped Cards <cards@steepedcards.com>",
        to: [to],
        subject: "You have a card waiting for you",
        html: `<div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:40px 20px;color:#2A1508;">
          <h1 style="font-size:26px;font-weight:400;">Steeped</h1>
          <p style="font-size:17px;line-height:1.85;">Dear ${recipientName},<br/><br/>Someone has brewed a card just for you.</p>
          ${senderNote ? `<p style="font-style:italic;color:#7A6050;border-left:2px solid #d4a843;padding:12px 18px;margin:20px 0;">${senderNote}</p>` : ""}
          <a href="${cardUrl}" style="display:inline-block;background:#2A1508;color:#FAF5EE;padding:14px 32px;text-decoration:none;border-radius:4px;font-size:15px;margin-top:20px;">Open your card</a>
        </div>`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.message || JSON.stringify(data) });
    }

    return res.status(200).json({ success: true, id: data.id });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}