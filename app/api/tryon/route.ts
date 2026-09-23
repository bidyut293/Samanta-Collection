import { NextResponse } from "next/server";

// Mirrors the `tryon-generate` Supabase Edge Function from the implementation
// plan. Locally this just acknowledges the request after a short delay so the
// Studio UI has something real to await; once GEMINI_API_KEY is set (and this
// route is deployed as the Supabase Edge Function instead), swap the mock
// branch below for the real Gemini image call.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.image || !body?.productTitle) {
    return NextResponse.json({ error: "image and productTitle are required" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    await new Promise((resolve) => setTimeout(resolve, 1400));
    return NextResponse.json({
      mock: true,
      message: "GEMINI_API_KEY is not set — returning your captured frame with a local style pass instead of a real AI render.",
    });
  }

  try {
    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Composite a photoreal, well-lit product shot of the person in this photo wearing "${body.productTitle}". Keep their pose and face. Studio quality.`,
                },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: String(body.image).split(",")[1] ?? "",
                  },
                },
              ],
            },
          ],
        }),
      },
    );

    if (!geminiResponse.ok) {
      const detail = await geminiResponse.text();
      return NextResponse.json({ error: "Gemini request failed", detail }, { status: 502 });
    }

    const data = await geminiResponse.json();
    const inlinePart = data?.candidates?.[0]?.content?.parts?.find(
      (part: { inlineData?: { data?: string } }) => part.inlineData?.data,
    );

    if (!inlinePart) {
      return NextResponse.json({ error: "Gemini returned no image" }, { status: 502 });
    }

    return NextResponse.json({
      mock: false,
      image: `data:image/png;base64,${inlinePart.inlineData.data}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gemini request threw", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
