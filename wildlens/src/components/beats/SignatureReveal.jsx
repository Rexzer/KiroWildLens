import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

// One reusable reveal component, fed a per-species icon sequence + headline via
// JSON. The "aha": how this animal's everyday life holds its ecosystem together.
export default function SignatureReveal({ signature, glow, onDone }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown < signature.sequence.length) {
      const t = setTimeout(() => setShown((n) => n + 1), 620);
      return () => clearTimeout(t);
    }
  }, [shown, signature.sequence.length]);
  const done = shown >= signature.sequence.length;

  return (
    <div className="beat sig-beat">
      <div className="beat-kicker" style={{ color: glow }}>But here's the surprising part…</div>
      <h2 className="sig-head" style={{ color: glow }}>{signature.headline}</h2>

      <div className="sig-seq">
        {signature.sequence.map((s, i) => (
          <div key={i} className={`sig-node ${i < shown ? "in" : ""}`}>
            <span className="sig-emoji">{s.emoji}</span>
            <span className="sig-label">{s.label}</span>
            {i < signature.sequence.length - 1 && <span className="sig-arrow">→</span>}
          </div>
        ))}
      </div>

      {done && <p className="sig-caption">{signature.caption}</p>}

      <button className="cta" disabled={!done} onClick={onDone}>
        See what's happening to it <ArrowRight size={18} />
      </button>
    </div>
  );
}
