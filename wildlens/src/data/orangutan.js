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

  // ── Ask the Animal (AI CONNECT beat) ─────────────────────────────────
  // Same grounded pattern as the hornbill: the chatbot answers ONLY from this
  // pre-authored knowledge, in first person, and never invents a fact.
  voice: "gentle and thoughtful, a person of the forest",
  ask: {
    greeting:
      "Hey there — I'm a Sumatran Orangutan, a person of the forest. Ask me anything!",
    suggested: [
      "What do you eat?",
      "How do you get around the forest?",
      "Why are you endangered?",
      "How do you help the forest?",
    ],
    fallback:
      "Hmm — even my keepers are still learning that one! Try asking about my food, my long arms, my forest home, or why I'm endangered.",
    knowledge: [
      { keywords: ["eat", "food", "diet", "fruit", "hungry", "breakfast", "meal", "leaves", "bark", "feed"],
        a: "I'm the forest's great fruit-eater — ripe fruit is most of my diet. When fruit is scarce I fall back on bark, leaves and the odd insect." },
      { keywords: ["live", "home", "habitat", "where", "forest", "rainforest", "sumatra", "jungle", "tree", "from"],
        a: "I live in the rainforests of Sumatra, high up in the trees." },
      { keywords: ["arm", "swing", "move", "climb", "ground", "walk", "hang", "travel", "long arms", "get around", "brachiate"],
        a: "My arms are huge — wider than I am tall — and I swing from tree to tree. I'm the largest tree-dwelling animal on Earth, so I rarely touch the ground." },
      { keywords: ["seed", "help", "plant", "garden", "important", "matter", "why", "ecosystem", "forest grow"],
        a: "By eating fruit across a huge range and dropping the seeds, I plant the very forest I depend on — I'm a gardener of the rainforest." },
      { keywords: ["baby", "infant", "mother", "mum", "smart", "clever", "intelligent", "learn", "nest", "sleep", "tool"],
        a: "Orangutan mums raise a baby for years, teaching it which fruits to eat and how to weave a fresh leafy nest to sleep in each night — we're very clever." },
      { keywords: ["endangered", "danger", "threat", "extinct", "conservation", "palm oil", "dying", "disappear", "risk", "protect", "save", "critical", "threatened"],
        a: "I'm Critically Endangered. Forest cleared for palm oil is erasing my home, and infants are orphaned when the trees come down." },
      { keywords: ["big", "size", "weigh", "heavy", "tall", "weight", "how big", "strong"],
        a: "A big male can weigh around 90kg — yet I still live my whole life up in the canopy." },
      { keywords: ["name", "who", "called", "what animal", "species", "mean"],
        a: "I'm a Sumatran Orangutan — and 'orang hutan' means 'person of the forest'." },
    ],
  },

  visionMatch: ["orangutan", "orang", "ape", "monkey", "gibbon", "chimpanzee", "gorilla", "primate", "macaque"],

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
