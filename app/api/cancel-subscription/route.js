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
  try {
    const { userId, subscriptionId: bodySubId } = await req.json();

    if (!userId && !bodySubId) {
      return NextResponse.json(
        { error: "Missing userId or subscriptionId." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    let subscriptionId = bodySubId;
    let targetUserId = userId;

    if (!subscriptionId && userId) {
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("id, subscription_id")
        .eq("id", userId)
        .single();

      if (fetchError || !profile?.subscription_id) {
        return NextResponse.json(
          { error: "No active subscription found for this account." },
          { status: 404 }
        );
      }

      subscriptionId = profile.subscription_id;
      targetUserId = profile.id;
    }

    const stripe = getStripe();
    const updatedSub = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    const cancelAtIso = updatedSub.cancel_at
      ? new Date(updatedSub.cancel_at * 1000).toISOString()
      : null;

    const updateQuery = supabase.from("profiles").update({
      auto_renew: false,
      cancel_at: cancelAtIso,
    });

    const { error: dbError } = targetUserId
      ? await updateQuery.eq("id", targetUserId)
      : await updateQuery.eq("subscription_id", subscriptionId);

    if (dbError) {
      console.error("Failed updating profile after Stripe cancel:", dbError);
      return NextResponse.json(
        { error: "Canceled in Stripe, but failed updating profile." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      cancel_at: cancelAtIso,
    });
  } catch (err) {
    console.error("Stripe cancel-subscription error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to cancel subscription." },
      { status: 500 }
    );
  }
}