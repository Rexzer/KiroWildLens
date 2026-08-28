// Great Hornbill — HERO species, fully built.
// Every factual claim here must be validated against a citable source before the demo.
export default {
  id: "great_hornbill",
  name: "Great Hornbill",
  park: "Bird Paradise",
  emoji: "🐦",
  glow: "#F5B841",
  backdrop: "canopy",

  // ── Ask the Animal (AI CONNECT beat) ─────────────────────────────────
  // The chatbot answers ONLY from this pre-authored knowledge, phrased in the
  // animal's first-person voice. It never invents a fact. The local retrieval
  // matcher (default) scores the guest's question against each entry's
  // `keywords`; an optional LLM (VITE_AI_ENDPOINT) is given the same entries as
  // its ONLY source and told to say "I don't know" rather than guess.
  voice: "warm and curious, a little proud of my huge beak",
  ask: {
    greeting:
      "Hi! I'm a Great Hornbill. Ask me anything about my life up in the forest canopy.",
    suggested: [
      "What do you eat?",
      "Why is your beak so big?",
      "How do you help the forest?",
      "Are you endangered?",
    ],
    fallback:
      "Hmm — even my keepers are still studying that one! Try asking about my food, my forest home, my big beak, or why I matter.",
    knowledge: [
      { keywords: ["eat", "food", "diet", "fruit", "fig", "insect", "hungry", "breakfast", "meal", "feed"],
        a: "In the wild I feast on ripe figs and fruit, and I'll snap up insects, lizards and small critters too. I'd never touch human food like bread." },
      { keywords: ["live", "home", "habitat", "forest", "where", "rainforest", "tree", "jungle", "from"],
        a: "I live high in the canopy of South and Southeast Asian rainforests — I need tall, old trees to feel at home." },
      { keywords: ["beak", "casque", "bill", "yellow", "helmet", "horn", "big", "head"],
        a: "That big yellow helmet on top of my beak is called a casque. It's mostly hollow and helps my loud calls carry across the forest." },
      { keywords: ["seed", "help", "plant", "farmer", "important", "matter", "why", "ecosystem", "forest grow"],
        a: "I'm a farmer of the forest! I swallow fruit, fly a long way, then drop the seeds — planting new trees wherever I go." },
      { keywords: ["nest", "chick", "baby", "egg", "nesting", "hole", "raise", "mother", "mum"],
        a: "A mother hornbill seals herself inside a tree hollow to raise her chicks, and the father passes food through a narrow slit — so we really need big old trees." },
      { keywords: ["fly", "wing", "move", "flight", "travel", "flap"],
        a: "I fly across the canopy on broad, whooshing wings — you can often hear my wingbeats before you ever spot me." },
      { keywords: ["endangered", "danger", "threat", "extinct", "conservation", "vulnerable", "dying", "disappear", "risk", "protect", "save", "threatened"],
        a: "I'm listed as Vulnerable. The big old trees I nest in are being logged, so there's less and less forest to raise my chicks." },
      { keywords: ["sound", "call", "noise", "sing", "loud", "voice", "song"],
        a: "My calls are loud, honking barks that echo right across the treetops." },
      { keywords: ["big", "size", "tall", "long", "weigh", "old", "age", "lifespan", "live long"],
        a: "I'm one of the larger hornbills — nearly a metre long — and hornbills can live for many decades." },
      { keywords: ["name", "who", "called", "what animal", "species"],
        a: "I'm a Great Hornbill — great by name, and great by beak!" },
    ],
  },

  // Broad on-device vision labels that should resolve to THIS species
  // (used by Look-to-Unlock camera confirm + the scan-any-animal mode).
  visionMatch: ["hornbill", "bird", "beak", "toucan", "macaw", "hummingbird", "bee eater", "jacamar"],

  predict: {
    question: "How much of this hornbill's wild forest do you think is still standing?",
    options: ["Almost all of it", "About half", "Less than a third"],
    answerIndex: 2,
    answerReveal:
      "In many areas, less than a third of the big old forest remains — and hornbills need those tall old trees to nest.",
  },
  wildMenu: {
    prompt: "Build my breakfast. Tap the TWO foods I'd actually find in the wild.",
    pick: 2,
    options: [
      { id: "fruit", label: "Fruit", emoji: "🍇", correct: true, response: "Great pick — wild figs are my favourite." },
      { id: "insects", label: "Insects", emoji: "🐛", correct: true, response: "Yes — I snap up insects and small critters too." },
      { id: "bread", label: "Bread", emoji: "🍞", correct: false, response: "That's human food — not something I'd find in my forest." },
      { id: "grass", label: "Grass", emoji: "🌾", correct: false, response: "I live in the canopy — grazing really isn't my thing." },
    ],
  },
  look: {
    prompt: "Now look at the REAL hornbill. Find the huge beak it uses to toss fruit — tap it to unlock its story.",
    feature: "the casque on its beak",
    hotspot: { x: 62, y: 34 },
  },
  signature: {
    headline: "My food feeds the forest too.",
    sequence: [
      { emoji: "🐦", label: "Hornbill" },
      { emoji: "🍇", label: "Eats fruit" },
      { emoji: "🕊️", label: "Flies far" },
      { emoji: "🌱", label: "Drops seeds" },
      { emoji: "🌳", label: "New trees" },
    ],
    caption:
      "Hornbills replant the rainforest as they fly. They're called the farmers of the forest — no hornbills, fewer trees.",
  },
  conservation: {
    status: "Vulnerable",
    trend: "Decreasing",
    home: "South & Southeast Asian rainforests",
    story:
      "The big old trees hornbills nest in are being logged. Lose the old forest, and there's nowhere left to raise chicks.",
    source: "IUCN Red List — verify current figures before demo",
  },
  wrappedTags: ["forest", "seed_dispersal", "ecosystem"],
};
