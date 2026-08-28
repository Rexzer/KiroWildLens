import { useState } from "react";
import { ArrowRight } from "lucide-react";

// Opens every encounter — a curiosity gap the conservation reveal later closes.
export default function Predict({ predict, glow, onDone, becauseNote }) {
  const [choice, setChoice] = useState(null);
  return (
    <div className="beat">
      {becauseNote && (
        <div className="because">Chosen for you — you seemed curious about {becauseNote}.</div>
      )}
      <div className="beat-kicker" style={{ color: glow }}>Take a guess</div>
      <h2 className="beat-q">{predict.question}</h2>
      <div className="opts">
        {predict.options.map((o, i) => (
          <button key={i} className={`opt ${choice === i ? "sel" : ""}`}
            style={choice === i ? { borderColor: glow } : undefined}
            onClick={() => setChoice(i)}>
            {o}
          </button>
        ))}
      </div>
      <button className="cta" disabled={choice === null}
        onClick={() => onDone(choice)}>
        Lock it in <ArrowRight size={18} />
      </button>
    </div>
  );
}
