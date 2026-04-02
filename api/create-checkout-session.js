import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return res.status(500).json({ error: "Stripe key not configured" });
  }

  const stripe = new Stripe(key);

  try {
    const { challengeData } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Post a Challenge on Land-it",
              description: `${challengeData?.title || "Hiring Challenge"} — ${challengeData?.company || "Company"}`,
            },
            unit_amount: 5499,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/create?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/create?payment=cancelled`,
      metadata: {
        challengeTitle: challengeData?.title || "",
        company: challengeData?.company || "",
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
}
