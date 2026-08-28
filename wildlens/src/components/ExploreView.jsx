import { Flame } from "lucide-react";
import BackHeader from "./BackHeader.jsx";
import { SEED_SCAN_COUNTS } from "../data/account.js";

// "Hottest animals" leaderboard = ranked by scan count. The two species this
// build actually implements use REAL live counts from app state so scanning
// them visibly moves the ranking; the rest are seeded so it reads like a
// whole-park leaderboard rather than a 2-row demo list.
export default function ExploreView({ onBack, liveSpecies }) {
  const rows = [
    ...liveSpecies.map((s) => ({ ...s, live: true })),
    ...SEED_SCAN_COUNTS.map((s) => ({ ...s, live: false })),
  ].sort((a, b) => b.count - a.count);

  return (
    <div className="subpage">
      <BackHeader title="Explore" onBack={onBack} />
      <p className="subpage-note">
        The hottest animals across the parks right now, ranked by WildLens scans today.
      </p>
      <div className="leaderboard">
        {rows.map((r, i) => (
          <div key={r.id} className={`lb-row ${r.live ? "lb-live" : ""}`}>
            <div className="lb-rank">{i + 1}</div>
            <div className="lb-emoji">{r.emoji}</div>
            <div className="lb-name">
              {r.name}
              {r.live && <span className="lb-tag">live</span>}
            </div>
            <div className="lb-count"><Flame size={13} /> {r.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
