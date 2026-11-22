import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { userId, subscriptionId } = await request.json();

    if (!userId || !subscriptionId) {
      return NextResponse.json({ error: "Missing user or subscription ID" }, { status: 400 });
    }

    const paddleUrl = process.env.NODE_ENV === "development"
      ? `https://sandbox-api.paddle.com/subscriptions/${subscriptionId}/cancel`
      : `https://api.paddle.com/subscriptions/${subscriptionId}/cancel`;

    const paddleRes = await fetch(paddleUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PADDLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        effective_from: "next_billing_period"
      }),
    });

    if (!paddleRes.ok) {
      const errData = await paddleRes.json();
      return NextResponse.json({ error: errData.error?.message || "Failed to cancel with Paddle" }, { status: 400 });
    }

    const paddleData = await paddleRes.json();
    // Paddle returns the scheduled change or current billing period end date
    const endsAt = paddleData.data?.current_billing_period?.ends_at || paddleData.data?.scheduled_change?.effective_at;

    // Update Supabase profile (keep is_pro true for now, but save when it expires)
    await supabaseAdmin
      .from("profiles")
      .update({ 
        cancel_at: endsAt 
      })
      .eq("id", userId);

    return NextResponse.json({ success: true, endsAt });
  } catch (err) {
    console.error("Cancellation error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}