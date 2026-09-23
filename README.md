# Samanta Studio

A clothing marketplace demo: animated storefront, retail + wholesale, and a
live camera Try-On Studio. Built from the implementation plan in
`Drape — Full Implementation Plan (Demo v1).docx` (the plan's working name
was "Drape"; the live brand is Samanta Studio).

## What's here right now

Everything below runs today, on mock data, with **no accounts or API keys**:

- **Storefront** — `/`, `/shop`, `/shop/[category]`, `/p/[slug]` — animated with
  Lenis smooth scroll, Framer Motion reveals/parallax, a magnetic-button
  header and a custom cursor.
- **Try-On Studio** — `/studio` — requests real camera access, shows a
  silhouette "step back" guide, locks a garment overlay on once you're framed,
  captures a still, and calls `/api/tryon` to "generate a realistic look."
  If your camera is blocked (or you have none), a **Use a demo frame** button
  runs the same flow without one.
- **Wholesale** — `/wholesale` and the wholesale toggle on any product page —
  tiered pricing, MOQ enforcement, size-ratio packs, live "you saved ₹X".
- **Supabase schema + Edge Functions** — written out under `supabase/`, ready
  to deploy once you have a project. Nothing calls them yet; the app runs on
  `lib/mock-data.ts` until you wire them in.

Routes that need real auth (`/login`, `/signup`, `/account`, `/seller`,
`/admin`) show a plain explanation instead of a broken page or a 404.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Allow camera access on `/studio` to try the real
flow, or click **Use a demo frame** if you're on a machine without one.

## Day 1 checklist (from the plan)

All free, or already covered by a Gemini AI Pro plan:

1. **Google AI Studio** — create a Gemini API key, set a $10 budget alert.
2. **Supabase** — new project in `ap-south-1` (Mumbai).
3. **Vercel** — sign up with GitHub, for hosting.
4. **GitHub** — private repo, e.g. `drape`.
5. **Razorpay** — sign up, use **test keys only**.
6. **Figma** (free) — 20–30 references from Awwwards / Dribbble / Framer if
   you want to push the visual design further.

Copy `.env.example` to `.env.local` and fill these in as you go — see the
comments in that file for exactly what each key unlocks.

## Wiring up the real backend

1. `supabase link` your project, then:
   ```bash
   supabase db push               # runs supabase/migrations/*.sql
   supabase functions deploy tryon-generate
   supabase functions deploy create-order
   supabase functions deploy verify-payment
   supabase secrets set GEMINI_API_KEY=... RAZORPAY_KEY_ID=... RAZORPAY_KEY_SECRET=...
   ```
2. Swap `lib/mock-data.ts` reads in the pages under `app/` for real
   `supabase-js` queries (a `lib/supabase/client.ts` + `server.ts` pair is the
   next thing to add — none exists yet since there's no project to point at).
3. In `app/api/tryon/route.ts`, either keep it as a thin proxy to the
   `tryon-generate` Edge Function, or delete it and call the Edge Function
   directly from `StudioClient` — the Edge Function version is what actually
   ships to production per the plan's architecture (secrets never touch the
   Next.js server).

## Notable implementation notes

- **Pose tracking is simulated.** The plan calls for MediaPipe pose
  landmarks driving the AR overlay in real time. This build simulates that
  UX (align → lock) on a timer so the interaction is fully demoable; swapping
  in real MediaPipe pose/segmentation is the next real engineering step,
  documented as `lib/tryon/pose.ts` and `segmenter.ts` in the plan's file tree
  (not yet created).
- **Product photography is procedural for the catalog**, not stock photos —
  `GarmentArt` renders a duotone gradient + line-art garment icon per product
  so the grid has one consistent, license-free look without needing real
  photo assets. The homepage **Lookbook** section is the exception: two real,
  freely-licensed (Unsplash License) photos under `public/lookbook/`, edited
  locally to carry the Samanta Studio wordmark on the garment. Swap these for
  real product photography once you shoot your own.
- **`/api/tryon`** returns a mock composited image (canvas overlay + note)
  whenever `GEMINI_API_KEY` is unset, and a real Gemini call otherwise — see
  the comments in that file and in `supabase/functions/tryon-generate/index.ts`.
