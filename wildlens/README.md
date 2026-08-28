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

## How AI powers WildLens (honest "AI-powered")
AI does **three jobs** across the journey, and a single guardrail governs all of
them: the AI only ever **recognises, selects, or phrases pre-approved content —
it never invents a fact, figure, or claim.**

**1. Recognise — on-device vision** *(`src/ai/vision.js`)*
   - **Look-to-Unlock camera:** the guest points their phone at the *real*
     animal and an on-device model (TensorFlow.js + MobileNet) confirms it's
     really there before the story unlocks — the physical animal is literally
     the key.
   - **Scan-any-animal:** no QR marker needed — point at an enclosure and the
     model identifies which WildLens species is in frame and loads its encounter.
   - Runs **entirely in the browser: no API key, no server, no per-call cost.**
     Model weights download once from a CDN. Gracefully falls back to the manual
     tap / pick paths if a camera or model isn't available.

**2. Personalise — curiosity classification** *(`classifyCuriosity`)*
   - After the Hornbill, the AI reads the guest's choices and **picks which
     pre-authored Orangutan question they see next** (the visible "AI changed the
     journey" moment — call it out in the pitch).

**3. Converse — "Ask the Animal"** *(`askAnimal`, the CONNECT beat)*
   - The guest can ask the animal anything in free text; it answers **in the
     animal's voice, but only from that species' pre-authored knowledge**
     (`ask.knowledge` in the species JSON). Unknowns get a friendly "even my
     keepers are still studying that" — never a hallucinated fact.
   - Plus the closing Wildlife Wrapped **reflection** is AI-phrased
     (`generateReflection`).

The language-model moments (2, 3, and the reflection) run a **deterministic
local classifier / retrieval matcher by default**, so judging never depends on a
network call. To route them to a real LLM (e.g. an Amazon Bedrock proxy), copy
`.env.example` to `.env` and set `VITE_AI_ENDPOINT` (and optionally
`VITE_AI_API_KEY`). On any error or timeout the app silently falls back to local
— the demo never stalls. See `src/ai/aiClient.js`.

> **Production path to species-level precision:** MobileNet gives broad labels
> ("hornbill", "ape"). Swap `loadModel()` in `vision.js` for a model trained on
> Mandai's own species (e.g. **Amazon Rekognition Custom Labels** or a custom
> TF.js model) — the `confirmPresence` / `matchSpecies` contract stays the same.

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
- **Real:** QR scan trigger, the full Hornbill flow, the AI curiosity selection,
  the second species from the same engine, **on-device vision** (live Look
  confirm + scan-any-animal), the **Ask-the-Animal** grounded chat, Wildlife
  Wrapped, reset.
- **Simulated (labelled):** *Demo Habitat Mode* backdrop is the fallback for
  Look-to-Unlock when there's no camera (e.g. at a judging table); the **Live
  camera** tab does real recognition when a camera is present.
- **Built but not pitched:** manual tap / pick fallbacks behind every AI path,
  for reliability.

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
    App.jsx                 # journey state machine (+ animalscan stage)
    ai/
      aiClient.js           # LLM moments: classify, reflection, askAnimal (local default + optional LLM)
      vision.js             # on-device recognition (TensorFlow.js + MobileNet)
      useCameraVision.js    # shared camera + live-inference hook
    data/{hornbill,orangutan}.js   # + voice / ask.knowledge / visionMatch
    components/
      Entry.jsx  QrScanner.jsx  Classifying.jsx  Reflecting.jsx  Wrapped.jsx
      Encounter.jsx  HabitatBackdrop.jsx
      AskTheAnimal.jsx      # Feature #1 — grounded chat (CONNECT beat)
      LiveLook.jsx          # Feature #2 — live vision confirm at Look
      AnimalScanner.jsx     # Feature #3 — scan any animal, no marker
      beats/{Predict,WildMenu,LookToUnlock,SignatureReveal,ConservationReveal}.jsx
    styles.css
```

> **Camera note:** the vision features (and the QR scanner) need camera access,
> which browsers only grant over **HTTPS or localhost**. `npm run dev` on
> localhost works; to test on a phone over the LAN URL, serve over HTTPS (e.g.
> `vite --https` with a trusted cert, or a tunnel like ngrok). Without a camera,
> every vision path falls back to the manual tap / pick controls.
