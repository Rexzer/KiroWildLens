// Hardcoded demo account — no auth. Just enough to make Account/Tickets feel real.
export const ACCOUNT = {
  name: "Jamie Tan",
  initials: "JT",
  email: "jamie.tan@example.com",
  tier: "Mandai Friends — Gold",
  memberSince: "March 2024",
};

export const TICKETS = [
  {
    id: "MWP-28311",
    park: "Bird Paradise",
    type: "1-Day Admission",
    date: "28 Aug 2026",
    status: "Active",
    code: "9F2K-QLM1",
  },
  {
    id: "MWP-28312",
    park: "Singapore Zoo",
    type: "1-Day Admission",
    date: "28 Aug 2026",
    status: "Active",
    code: "7T8V-RXN4",
  },
];

// Park-wide "hottest animal" leaderboard filler — everything the guest can
// actually scan (great_hornbill, sumatran_orangutan) uses REAL live counts
// from app state. These extra rows just make the ranking feel like a whole
// park, not a 2-animal demo, and are clearly seeded rather than live.
export const SEED_SCAN_COUNTS = [
  { id: "seed_penguin", name: "King Penguin", emoji: "🐧", count: 41 },
  { id: "seed_tiger", name: "Malayan Tiger", emoji: "🐅", count: 33 },
  { id: "seed_otter", name: "Smooth-coated Otter", emoji: "🦦", count: 27 },
  { id: "seed_flamingo", name: "Greater Flamingo", emoji: "🦩", count: 19 },
];
