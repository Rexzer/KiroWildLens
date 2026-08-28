import { Check, Heart } from "lucide-react";

// REVEAL beat — closes the curiosity gap by answering the guest's earlier
// prediction, then the conservation story. Understanding over dashboards.
export default function ConservationReveal({ conservation, predict, guessIndex, glow, onDone, ctaLabel }) {
  const right = guessIndex === predict.answerIndex;
  return (
    <div className="beat cons-beat">
      <div className="reveal-answer">
        <div className="reveal-kicker" style={{ color: glow }}>You guessed: {predict.options[guessIndex]}</div>
        <div className={`reveal-verdict ${right ? "right" : "off"}`}>
          {right ? <><Check size={15} /> Spot on.</> : "Here's the truth →"}
        </div>
        <p className="reveal-text">{predict.answerReveal}</p>
      </div>

      <div className="factcard" style={{ borderColor: glow }}>
        <div className="fact-row"><span>Status</span><strong style={{ color: glow }}>{conservation.status}</strong></div>
        <div className="fact-row"><span>Trend</span><strong>{conservation.trend}</strong></div>
        <div className="fact-row"><span>Wild home</span><strong>{conservation.home}</strong></div>
        <p className="fact-story">{conservation.story}</p>
        <div className="fact-source">{conservation.source}</div>
      </div>

      <button className="cta" onClick={onDone}>
        <Heart size={16} /> {ctaLabel || "Add to Wildlife Wrapped"}
      </button>
    </div>
  );
}
