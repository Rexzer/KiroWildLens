// Great Hornbill — HERO species, fully built.
// Every factual claim here must be validated against a citable source before the demo.
export default {
  id: "great_hornbill",
  name: "Great Hornbill",
  park: "Bird Paradise",
  emoji: "🐦",
  glow: "#F5B841",
  backdrop: "canopy",
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
