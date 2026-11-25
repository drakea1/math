import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(req) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event;
  try {
    const rawBody = await req.text();
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const stripe = getStripe();

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.userId || session.client_reference_id;
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (userId) {
        let subscription = null;
        if (subscriptionId) {
          subscription = await stripe.subscriptions.retrieve(subscriptionId);
        }

        const startedAtUnix = subscription?.start_date || subscription?.created || Math.floor(Date.now() / 1000);
        const isActive = !subscription || ["active", "trialing"].includes(subscription.status);

        const { error } = await supabase
          .from("profiles")
          .update({
            is_pro: isActive,
            subscription_id: subscriptionId || null,
            stripe_customer_id:
              typeof session.customer === "string"
                ? session.customer
                : session.customer?.id || null,
            subscription_started_at: new Date(startedAtUnix * 1000).toISOString(),
            auto_renew: subscription ? !subscription.cancel_at_period_end : true,
            cancel_at: subscription?.cancel_at
              ? new Date(subscription.cancel_at * 1000).toISOString()
              : null,
          })
          .eq("id", userId);

        if (error) {
          console.error("Failed updating profile on checkout.session.completed:", error);
          return NextResponse.json({ error: "Database update failed" }, { status: 500 });
        }
      }
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      const userId = subscription.metadata?.userId;
      const isActive = ["active", "trialing"].includes(subscription.status);

      const updatePayload = {
        is_pro: isActive,
        subscription_id: subscription.id,
        auto_renew: isActive && !subscription.cancel_at_period_end,
        cancel_at: subscription.cancel_at
          ? new Date(subscription.cancel_at * 1000).toISOString()
          : null,
      };

      const query = supabase.from("profiles").update(updatePayload);
      const { error } = userId
        ? await query.eq("id", userId)
        : await query.eq("subscription_id", subscription.id);

      if (error) {
        console.error("Failed updating profile on subscription.updated:", error);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const userId = subscription.metadata?.userId;

      const updatePayload = {
        is_pro: false,
        auto_renew: false,
        cancel_at: null,
      };

      const query = supabase.from("profiles").update(updatePayload);
      const { error } = userId
        ? await query.eq("id", userId)
        : await query.eq("subscription_id", subscription.id);

      if (error) {
        console.error("Failed updating profile on subscription.deleted:", error);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}