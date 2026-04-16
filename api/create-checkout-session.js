export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return res.status(500).json({ error: "Stripe key not configured" });
  }

  try {
    const { challengeData } = req.body;
    const origin = req.headers.origin || "https://land-it-three.vercel.app";

    const params = new URLSearchParams();
    params.append("payment_method_types[]", "card");
    params.append("line_items[0][price_data][currency]", "usd");
    params.append("line_items[0][price_data][product_data][name]", "Post a Challenge on Land-it");
    params.append("line_items[0][price_data][product_data][description]",
      `${challengeData?.title || "Hiring Challenge"} — ${challengeData?.company || "Company"}`
    );
    params.append("line_items[0][price_data][unit_amount]", "5499");
    params.append("line_items[0][quantity]", "1");
    params.append("mode", "payment");
    params.append("allow_promotion_codes", "true");
    params.append("success_url", `${origin}/create?payment=success&session_id={CHECKOUT_SESSION_ID}`);
    params.append("cancel_url", `${origin}/create?payment=cancelled`);

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const session = await response.json();

    if (session.error) {
      return res.status(400).json({ error: session.error.message });
    }

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
}
