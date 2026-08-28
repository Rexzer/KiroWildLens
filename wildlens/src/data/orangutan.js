// Sumatran Orangutan — SECONDARY species. Proves the same Encounter engine
// renders a different animal from JSON, and receives its opening question from
// the AI classification step (see src/ai/aiClient.js). The three predict
// variants below are PRE-AUTHORED; the AI only selects which one is shown.
export default {
  id: "sumatran_orangutan",
  name: "Sumatran Orangutan",
  park: "Singapore Zoo",
  emoji: "🦧",
  glow: "#5EEAD4",
  backdrop: "jungle",

  // AI picks one of these based on the guest's Hornbill behaviour.
  predictVariants: {
    food_focused: {
      because: "what animals eat",
      question: "What do you think a wild orangutan eats most of?",
      options: ["Mostly leaves", "Mostly fruit", "Mostly insects"],
      answerIndex: 1,
      answerReveal: "Mostly fruit — orangutans are the forest's great fruit-eaters, which is why they need healthy fruiting trees.",
    },
    behaviour_focused: {
      because: "how animals move and live",
      question: "How does a 90kg orangutan get around the rainforest?",
      options: ["Walks along the ground", "Swings tree to tree", "Mostly swims"],
      answerIndex: 1,
      answerReveal: "Tree to tree — orangutans are the largest tree-dwelling animal on Earth and rarely touch the ground.",
    },
    ecosystem_focused: {
      because: "the habitats animals depend on",
      question: "How much of the orangutan's forest home do you think is left?",
      options: ["Almost all of it", "Around half", "A shrinking fraction"],
      answerIndex: 2,
      answerReveal: "A shrinking fraction — clearing forest for palm oil has erased vast stretches of orangutan home.",
    },
  },
  defaultVariant: "ecosystem_focused",

  wildMenu: {
    prompt: "Build my breakfast. Tap the TWO foods I'd actually find in the wild.",
    pick: 2,
    options: [
      { id: "fruit", label: "Fruit", emoji: "🍎", correct: true, response: "Yes — ripe fruit is most of my diet." },
      { id: "bark", label: "Bark & leaves", emoji: "🍃", correct: true, response: "Right — when fruit's scarce I fall back on bark and leaves." },
      { id: "chips", label: "Chips", emoji: "🍟", correct: false, response: "Definitely not — that's not from any forest of mine." },
      { id: "fish", label: "Fish", emoji: "🐟", correct: false, response: "I'll leave fishing to someone with better swimming skills." },
    ],
  },
  look: {
    prompt: "Look at the REAL orangutan. Find the long arms it uses to swing through the canopy — tap them to unlock its story.",
    feature: "its long arms",
    hotspot: { x: 45, y: 46 },
  },
  signature: {
    headline: "I'm the gardener of the rainforest.",
    sequence: [
      { emoji: "🦧", label: "Orangutan" },
      { emoji: "🍎", label: "Eats fruit" },
      { emoji: "🌳", label: "Roams wide" },
      { emoji: "🌱", label: "Spreads seeds" },
      { emoji: "🌴", label: "Forest grows" },
    ],
    caption:
      "By eating fruit across huge ranges, orangutans plant the very forest they depend on. Lose them, and the forest thins.",
  },
  conservation: {
    status: "Critically Endangered",
    trend: "Decreasing",
    home: "Rainforests of Sumatra",
    story:
      "Forest cleared for palm oil is erasing orangutan home, and infants are orphaned when the trees fall.",
    source: "IUCN Red List — verify current figures before demo",
  },
  wrappedTags: ["forest", "seed_dispersal", "endangered"],
};
