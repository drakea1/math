import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req) {
  try {
    const { userId, email, priceId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "You must be signed in to upgrade." },
        { status: 401 }
      );
    }

    const resolvedPriceId = priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
    if (!resolvedPriceId) {
      return NextResponse.json(
        { error: "Missing Stripe Price ID configuration." },
        { status: 500 }
      );
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://www.matharoundapp.com";

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: resolvedPriceId,
          quantity: 1,
        },
      ],
      customer_email: email || undefined,
      client_reference_id: userId,
      metadata: {
        userId,
      },
      subscription_data: {
        metadata: {
          userId,
        },
      },
      success_url: `${origin}/subscription?checkout=success`,
      cancel_url: `${origin}/subscription?checkout=canceled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create checkout session." },
      { status: 500 }
    );
  }
}