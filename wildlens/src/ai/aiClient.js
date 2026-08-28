/*
 * WildLens AI client — ONE call pattern, used at TWO moments in the journey.
 *
 *   Call 1 (journey-shaping): classifyCuriosity(signals) -> variantId
 *       Reads the guest's Hornbill choices, decides their curiosity type,
 *       and returns which PRE-AUTHORED Orangutan question they should see.
 *   Call 2 (closing reflection): generateReflection(tags) -> one sentence
 *       Phrases the guest's Wildlife Wrapped profile line.
 *
 * The AI only ever SELECTS or PHRASES from fixed, pre-approved content —
 * it never invents a new fact or a new question. Facts stay deterministic.
 *
 * By default this runs a local, deterministic classifier so the demo works
 * offline with zero setup. If VITE_AI_ENDPOINT is set, both calls route to a
 * real LLM, and fall back to local on any error/timeout — so the demo never
 * stalls waiting on a network call.
 */

const ENDPOINT = import.meta.env.VITE_AI_ENDPOINT;
const API_KEY = import.meta.env.VITE_AI_API_KEY;
const VARIANTS = ["food_focused", "behaviour_focused", "ecosystem_focused"];

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("ai-timeout")), ms));
}

async function callLLM(prompt, ms = 4000) {
  const req = fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
    },
    body: JSON.stringify({ prompt }),
  }).then((r) => r.json());
  const data = await Promise.race([req, timeout(ms)]);
  const text = (data && (data.text || data.output || data.completion) || "").trim();
  if (!text) throw new Error("ai-empty");
  return text;
}

/* ---- local deterministic fallbacks (also the default path) ---- */

function localClassify(signals) {
  const picks = signals?.menuPicks || [];
  // curious about how it hunts/lives -> behaviour; worried about habitat -> ecosystem
  if (picks.includes("insects")) return "behaviour_focused";
  if (signals?.predictionIndex === 2) return "ecosystem_focused";
  if (picks.includes("fruit")) return "food_focused";
  return "ecosystem_focused";
}

const REFLECTIONS = {
  behaviour_focused: "You were drawn to how animals live and move — the small survival skills that make each species its own.",
  ecosystem_focused: "You kept following the thread back to habitat — you care about the forests and waters animals can't live without.",
  food_focused: "You were curious about what keeps animals going day to day — diet, foraging, the everyday business of survival.",
};

export const PROFILE_LABEL = {
  behaviour_focused: "Behaviour Detective",
  ecosystem_focused: "Habitat Guardian",
  food_focused: "Foraging Explorer",
};

export async function classifyCuriosity(signals) {
  const fallback = localClassify(signals);
  if (!ENDPOINT) return fallback;
  try {
    const prompt =
      `A wildlife-park guest just finished an encounter. Their choices: ${JSON.stringify(signals)}. ` +
      `Classify their curiosity as exactly one of: ${VARIANTS.join(", ")}. Reply with only that word.`;
    const text = (await callLLM(prompt)).toLowerCase();
    const hit = VARIANTS.find((v) => text.includes(v));
    return hit || fallback;
  } catch {
    return fallback;
  }
}

export async function generateReflection(curiosityType) {
  const fallback = REFLECTIONS[curiosityType] || REFLECTIONS.ecosystem_focused;
  if (!ENDPOINT) return fallback;
  try {
    const prompt =
      `Given a wildlife-visit curiosity type of "${curiosityType}", write ONE warm, ` +
      `one-sentence reflection on the kind of wildlife stories this guest seemed drawn to. ` +
      `Reflect only the pattern — invent no facts about specific animals.`;
    return await callLLM(prompt);
  } catch {
    return fallback;
  }
}
