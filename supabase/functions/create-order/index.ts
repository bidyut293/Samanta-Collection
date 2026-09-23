// Supabase Edge Function: create-order
// Deploy with `supabase functions deploy create-order`.
// Secrets required: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET,
// SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
//
// Recalculates every price server-side from the current product/variant/tier
// rows — the client only ever sends variant ids and quantities, never a
// price, so a tampered request can't check out at a fake amount.

import { createClient } from "jsr:@supabase/supabase-js@2";

interface LineInput {
  variantId: string;
  qty: number;
}

function unitPriceFor(qty: number, basePrice: number, tiers: { min_qty: number; unit_price: number }[]) {
  const tier = [...tiers].sort((a, b) => b.min_qty - a.min_qty).find((t) => qty >= t.min_qty);
  return tier ? tier.unit_price : basePrice;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { lines, type, shippingAddress } = (await req.json()) as {
    lines: LineInput[];
    type: "retail" | "wholesale";
    shippingAddress?: Record<string, unknown>;
  };
  if (!lines?.length) {
    return Response.json({ error: "No line items" }, { status: 400 });
  }

  // Service-role client for price lookups and the insert that follows —
  // RLS would otherwise hide other sellers' products from this calculation.
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  let subtotal = 0;
  const orderItems: { seller_id: string; variant_id: string; qty: number; unit_price: number }[] = [];

  for (const line of lines) {
    const { data: variant, error } = await admin
      .from("product_variants")
      .select("id, price_override, product:products(id, seller_id, base_price, moq, wholesale_enabled, price_tiers(min_qty, unit_price))")
      .eq("id", line.variantId)
      .single();

    if (error || !variant) {
      return Response.json({ error: `Variant ${line.variantId} not found` }, { status: 400 });
    }

    const product = Array.isArray(variant.product) ? variant.product[0] : variant.product;
    if (type === "wholesale" && line.qty < product.moq) {
      return Response.json({ error: `Quantity below MOQ for ${line.variantId}` }, { status: 400 });
    }

    const basePrice = variant.price_override ?? product.base_price;
    const unitPrice =
      type === "wholesale" && product.wholesale_enabled
        ? unitPriceFor(line.qty, basePrice, product.price_tiers ?? [])
        : basePrice;

    subtotal += unitPrice * line.qty;
    orderItems.push({ seller_id: product.seller_id, variant_id: line.variantId, qty: line.qty, unit_price: unitPrice });
  }

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({ buyer_id: user.id, type, subtotal, total: subtotal, shipping_address: shippingAddress ?? null })
    .select()
    .single();

  if (orderError || !order) {
    return Response.json({ error: "Could not create order", detail: orderError?.message }, { status: 500 });
  }

  await admin.from("order_items").insert(orderItems.map((item) => ({ ...item, order_id: order.id })));

  const razorpayAuth = btoa(`${Deno.env.get("RAZORPAY_KEY_ID")}:${Deno.env.get("RAZORPAY_KEY_SECRET")}`);
  const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${razorpayAuth}` },
    body: JSON.stringify({ amount: Math.round(subtotal * 100), currency: "INR", receipt: order.id }),
  });

  if (!razorpayRes.ok) {
    return Response.json({ error: "Razorpay order creation failed", detail: await razorpayRes.text() }, { status: 502 });
  }

  const razorpayOrder = await razorpayRes.json();
  await admin.from("orders").update({ razorpay_order_id: razorpayOrder.id }).eq("id", order.id);

  return Response.json({ orderId: order.id, razorpayOrderId: razorpayOrder.id, amount: subtotal });
});
