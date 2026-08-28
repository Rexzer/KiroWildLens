/*
 * WildLens AI client — ONE call pattern, used across the journey.
 *
 *   Call 1 (journey-shaping): classifyCuriosity(signals) -> variantId
 *       Reads the guest's Hornbill choices, decides their curiosity type,
 *       and returns which PRE-AUTHORED Orangutan question they should see.
 *   Call 2 (closing reflection): generateReflection(tags) -> one sentence
 *       Phrases the guest's Wildlife Wrapped profile line.
 *   Call 3 (grounded conversation): askAnimal(species, question) -> answer
 *       Answers a guest's free-text question in the animal's voice, drawing
 *       ONLY on that species' pre-authored `ask.knowledge`. Local retrieval by
 *       default; the optional LLM is given the same entries as its ONLY source
 *       and instructed to say "I don't know" rather than invent anything.
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


/* ============================================================================
 * Call 3 — "Ask the Animal": grounded conversational answers.
 * ==========================================================================*/

// Tiny stop-word list so retrieval scores on meaningful words, not "the/what".
const STOP = new Set([
  "the", "a", "an", "is", "are", "do", "does", "did", "you", "your", "yours",
  "i", "me", "my", "we", "to", "of", "in", "on", "at", "for", "and", "or",
  "how", "what", "why", "where", "when", "who", "which", "can", "could",
  "would", "will", "be", "have", "has", "with", "about", "it", "its", "so",
  "much", "many", "some", "any", "get", "got", "there",
]);

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w));
}

// Score one knowledge entry against the guest's question. Multi-word keywords
// (e.g. "long arms", "palm oil") match as a phrase; single words match tokens.
function scoreEntry(entry, qTokens, qJoined) {
  const tokenSet = new Set(qTokens);
  let score = 0;
  for (const kw of entry.keywords || []) {
    const k = kw.toLowerCase();
    if (k.includes(" ")) {
      if (qJoined.includes(k)) score += 3;
    } else if (tokenSet.has(k)) {
      score += 2;
    } else if (qTokens.some((t) => t.length > 4 && (t.includes(k) || k.includes(t)))) {
      score += 1; // loose stem match (fruits~fruit, forests~forest)
    }
  }
  return score;
}

// Deterministic local answer (also the default path). Returns the best-matching
// pre-authored line, or the species' friendly fallback if nothing scores.
export function localAnswer(species, question) {
  const kb = species?.ask?.knowledge || [];
  const qJoined = " " + (question || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ") + " ";
  const qTokens = tokenize(question);
  if (!qTokens.length || !kb.length) {
    return species?.ask?.fallback || "Ask me about my food, my home, or how I help the forest!";
  }
  let best = null;
  let bestScore = 0;
  for (const entry of kb) {
    const s = scoreEntry(entry, qTokens, qJoined);
    if (s > bestScore) { bestScore = s; best = entry; }
  }
  if (best && bestScore >= 2) return best.a;
  return species?.ask?.fallback || "Ask me about my food, my home, or how I help the forest!";
}

export async function askAnimal(species, question) {
  const fallback = localAnswer(species, question);
  if (!ENDPOINT) return fallback;
  try {
    // The LLM gets the pre-authored knowledge as its ONLY source of truth.
    const facts = (species?.ask?.knowledge || []).map((e) => `- ${e.a}`).join("\n");
    const prompt =
      `You ARE a ${species.name}, replying in the first person (voice: ${species.voice}). ` +
      `Answer the visitor's question in 1-2 short, warm, kid-friendly sentences. ` +
      `Use ONLY the facts below. If the answer is not in the facts, say you don't know ` +
      `in a friendly way and suggest what they could ask instead — never invent facts, ` +
      `numbers, or claims.\n\nFACTS:\n${facts}\n\nVISITOR QUESTION: ${question}`;
    const text = await callLLM(prompt);
    return text || fallback;
  } catch {
    return fallback;
  }
}
