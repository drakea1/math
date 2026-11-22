import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function verifyPaddleSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;

  const parts = signatureHeader.split(';');
  let timestamp = '';
  const signatures = [];

  for (const part of parts) {
    const [key, value] = part.split('=');
    if (key === 'ts') timestamp = value;
    if (key === 'h1' && value) signatures.push(value);
  }

  if (!timestamp || signatures.length === 0) return false;

  const signedPayload = `${timestamp}:${rawBody}`;
  const expectedDigest = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedDigest, 'hex');

  return signatures.some((sig) => {
    const sigBuffer = Buffer.from(sig, 'hex');
    return (
      sigBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(sigBuffer, expectedBuffer)
    );
  });
}

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get('paddle-signature');
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;

    const isValid = verifyPaddleSignature(rawBody, signatureHeader, webhookSecret);
    if (!isValid) {
      console.warn('Invalid Paddle webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event_type;
    const data = event.data;

    console.log(`Received verified Paddle webhook event: ${eventType}`);

    // 1. Handle Successful Payments & Renewals
    if (eventType === 'transaction.completed') {
      const userId = data.custom_data?.user_id;
      const subscriptionId = data.subscription_id || data.items?.[0]?.subscription_id;
      const invoiceUrl = data.invoice_pdf || data.details?.receipt_url;

      if (userId) {
        const { data: existingProfile } = await supabaseAdmin
          .from('profiles')
          .select('subscription_started_at')
          .eq('id', userId)
          .single();

        const updateData = {
          is_pro: true,
          subscription_id: subscriptionId,
          auto_renew: true,
          cancel_at: null,
        };

        if (invoiceUrl) {
          updateData.latest_invoice_url = invoiceUrl;
        }

        if (!existingProfile?.subscription_started_at) {
          updateData.subscription_started_at = new Date().toISOString();
        }

        const { error } = await supabaseAdmin
          .from('profiles')
          .update(updateData)
          .eq('id', userId);

        if (error) {
          console.error('Failed to update Supabase profile on transaction.completed:', error);
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }
      } else {
        console.warn('No user_id found in custom_data for transaction');
      }
    }

    // 2. Handle Subscription Updates (e.g. Turning off Auto-Renewal)
    else if (eventType === 'subscription.updated') {
      const subscriptionId = data.id;
      const scheduledChange = data.scheduled_change;

      if (scheduledChange?.action === 'cancel') {
        const cancelAtDate = scheduledChange.effective_at;

        await supabaseAdmin
          .from('profiles')
          .update({
            auto_renew: false,
            cancel_at: cancelAtDate,
          })
          .eq('subscription_id', subscriptionId);
      }
    }

    // 3. Handle Subscription Cancellation
    else if (eventType === 'subscription.canceled') {
      const subscriptionId = data.id;

      await supabaseAdmin
        .from('profiles')
        .update({
          is_pro: false,
          auto_renew: false,
          cancel_at: data.canceled_at || new Date().toISOString(),
        })
        .eq('subscription_id', subscriptionId);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
  }
}