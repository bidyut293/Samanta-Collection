// Supabase Edge Function: tryon-generate
// Deploy with `supabase functions deploy tryon-generate`.
// Secrets required: GEMINI_API_KEY (set via `supabase secrets set GEMINI_API_KEY=...`).
//
// Takes a captured camera frame + product title from an authenticated user,
// asks Gemini for a photoreal composite, and logs a tryon_sessions row.
// This is the server-side counterpart to app/api/tryon/route.ts in the
// Next.js app — move the AI call here once you deploy Supabase, so the key
// never has to live in a Next.js environment variable at all.

import { createClient } from "jsr:@supabase/supabase-js@2";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { image, productId, productTitle, productImage, mode } = await req.json();
  if (!image || !productTitle) {
    return Response.json({ error: "image and productTitle are required" }, { status: 400 });
  }

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return Response.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
  }

  const parts: Record<string, unknown>[] = [
    {
      text: productImage
        ? `The second image shows a real garment: "${productTitle}". Composite a photoreal, well-lit product shot of the person in the first image wearing that exact garment — match its color, fabric texture and cut as closely as possible. Keep their pose, body and face unchanged. Studio quality.`
        : `Composite a photoreal, well-lit product shot of the person in this photo wearing "${productTitle}". Keep their pose and face. Studio quality.`,
    },
    { inlineData: { mimeType: "image/jpeg", data: String(image).split(",")[1] ?? "" } },
  ];
  if (productImage) {
    parts.push({ inlineData: { mimeType: "image/jpeg", data: String(productImage).split(",")[1] ?? "" } });
  }

  const geminiResponse = await fetch(`${GEMINI_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({ contents: [{ parts }] }),
  });

  if (!geminiResponse.ok) {
    return Response.json({ error: "Gemini request failed", detail: await geminiResponse.text() }, { status: 502 });
  }

  const data = await geminiResponse.json();
  const inlinePart = data?.candidates?.[0]?.content?.parts?.find(
    (part: { inlineData?: { data?: string } }) => part.inlineData?.data,
  );
  if (!inlinePart) {
    return Response.json({ error: "Gemini returned no image" }, { status: 502 });
  }

  const resultUrl = `data:image/png;base64,${inlinePart.inlineData.data}`;

  await supabase.from("tryon_sessions").insert({
    user_id: user.id,
    product_id: productId ?? null,
    mode: mode ?? "ai_snapshot",
    result_url: resultUrl,
  });

  return Response.json({ image: resultUrl });
});
