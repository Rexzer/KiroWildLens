# WildLens — Demo Build

An interactive discovery layer for **Mandai Wildlife Parks**. At an enclosure you
scan a marker, *predict* something, *play* with how the animal lives, then **look
back at the real animal and confirm what you see to unlock its conservation
story** — the physical animal is the key, not a backdrop. Encounters roll up into
a personalised **Wildlife Wrapped**.

Built as **one reusable Encounter flow** driven by per-species JSON: adding a
species means writing data, not code.

## Core loop
`SCAN → PREDICT → PLAY → LOOK → UNLOCK → REVEAL → CONNECT`

## Run it
```bash
cd wildlens
npm install
npm run dev        # open the printed Local URL; use the Network URL on your phone
```
Build: `npm run build` → static output in `dist/`.

> Open on a **phone** (via the Network URL) to test the real QR scan + camera.
> Any QR code triggers "Great Hornbill discovered" for the demo.
> If a camera isn't available (e.g. desktop), press **M** to simulate a scan —
> this is an emergency fallback only, not part of the pitch.

## The two AI moments (honest "AI-powered")
The same lightweight call pattern fires twice, and the AI only ever **selects or
phrases pre-authored content — it never invents a fact**:

1. **After the Hornbill** — classifies the guest's curiosity from their choices
   and **picks which pre-authored Orangutan question they see next** (the visible
   "AI changed the journey" moment — call it out in the pitch).
2. **At Wrapped** — phrases the closing "wildlife profile" reflection.

By default both run a **deterministic local classifier**, so judging never
depends on a network call. To route them to a real LLM, copy `.env.example` to
`.env` and set `VITE_AI_ENDPOINT` (and optionally `VITE_AI_API_KEY`). On any
error or timeout the app silently falls back to local — the demo never stalls.
See `src/ai/aiClient.js`.

## Demo script (60–90s)
1. Mandai home → tap **WildLens**.
2. **Scan** the hornbill QR (let it just work, don't explain it).
3. **Predict** how much forest is left.
4. **Build my wild menu** — one wrong tap shows the teaching feedback, then the right pair.
5. **"My food feeds the forest too"** — signature reveal.
6. **Look back** at the real hornbill, tap its beak → **unlock**.
7. **Conservation reveal** answers your guess.
8. Transition to **Orangutan** — say **"AI-powered" out loud here**: the opening
   question changed because of what the guest showed interest in.
9. Close on **Wildlife Wrapped** + the AI reflection line.
Use the **↺ reset** control between judging rounds.

## What's real vs. simulated
- **Real:** QR scan trigger, the full six-beat Hornbill flow, the AI variant
  selection, the second species from the same engine, Wildlife Wrapped, reset.
- **Simulated (labelled):** *Demo Habitat Mode* backdrop stands in for the live
  camera during Look-to-Unlock so it's demonstrable at a table — swap for a
  looping clip of the real animal in production.
- **Built but not pitched:** still-image / manual fallbacks for reliability.

## Not built (production roadmap, stated in the pitch)
Manatee & further species, multiple fallback types, text-to-speech / full WCAG,
multilingual content, PWA offline caching, analytics, any backend beyond local
JSON + the optional AI call.

## Editing content
Species live in `src/data/*.js` — each is one object matching the Encounter
schema (predict / wildMenu / look / signature / conservation). The orangutan
adds `predictVariants` (the AI-selectable opening questions).
**Validate every conservation figure against a citable source before demoing.**

## Structure
```
wildlens/
  src/
    App.jsx                 # journey state machine
    ai/aiClient.js          # the two AI moments (local default + optional LLM)
    data/{hornbill,orangutan}.js
    components/
      Entry.jsx  QrScanner.jsx  Classifying.jsx  Wrapped.jsx
      Encounter.jsx  HabitatBackdrop.jsx
      beats/{Predict,WildMenu,LookToUnlock,SignatureReveal,ConservationReveal}.jsx
    styles.css
```
