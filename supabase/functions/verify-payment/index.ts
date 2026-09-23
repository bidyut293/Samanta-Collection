// Supabase Edge Function: verify-payment
// Deploy with `supabase functions deploy verify-payment`.
// Secrets required: RAZORPAY_KEY_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
//
// Razorpay Checkout returns an order id, payment id and signature to the
// client; this function re-derives that signature server-side with the
// secret key and only then marks the order paid.

import { createClient } from "jsr:@supabase/supabase-js@2";

async function hmacSha256Hex(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json();
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
    return Response.json({ error: "Missing verification fields" }, { status: 400 });
  }

  const secret = Deno.env.get("RAZORPAY_KEY_SECRET")!;
  const expectedSignature = await hmacSha256Hex(secret, `${razorpay_order_id}|${razorpay_payment_id}`);

  if (expectedSignature !== razorpay_signature) {
    return Response.json({ error: "Signature mismatch" }, { status: 400 });
  }

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { error } = await admin
    .from("orders")
    .update({ status: "paid", razorpay_payment_id })
    .eq("id", orderId)
    .eq("razorpay_order_id", razorpay_order_id);

  if (error) {
    return Response.json({ error: "Could not update order", detail: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
});
