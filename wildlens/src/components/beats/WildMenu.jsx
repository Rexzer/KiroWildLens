import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

// PLAY beat — tactile "build my wild menu". Tap foods onto the plate.
// Wrong picks teach (never a bare "wrong"). Safety: never says "feed the animal".
export default function WildMenu({ menu, glow, onDone }) {
  const [plate, setPlate] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const toggle = (opt) => {
    setFeedback({ text: opt.response, correct: opt.correct });
    setPlate((p) =>
      p.find((x) => x.id === opt.id)
        ? p.filter((x) => x.id !== opt.id)
        : p.length < menu.pick ? [...p, opt] : p
    );
  };

  const full = plate.length === menu.pick;
  const allCorrect = full && plate.every((x) => x.correct);

  return (
    <div className="beat">
      <div className="beat-kicker" style={{ color: glow }}>Think you know what I eat?</div>
      <h2 className="beat-q">{menu.prompt}</h2>

      <div className="plate" style={{ borderColor: glow }}>
        {plate.length === 0
          ? <span className="plate-hint">my plate</span>
          : plate.map((x) => <span key={x.id} className="plate-item">{x.emoji}</span>)}
      </div>

      <div className="foods">
        {menu.options.map((o) => {
          const on = plate.find((x) => x.id === o.id);
          return (
            <button key={o.id} className={`food ${on ? "on" : ""}`}
              style={on ? { borderColor: glow } : undefined}
              onClick={() => toggle(o)}>
              <span className="food-emoji">{o.emoji}</span>
              <span>{o.label}</span>
              {on && <Check size={14} className="food-check" />}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`menu-fb ${feedback.correct ? "good" : "bad"}`}>{feedback.text}</div>
      )}

      <div className="menu-note">Learn what this species eats in the wild. Never feed wildlife unless Mandai staff invite you to.</div>

      <button className="cta" disabled={!full}
        onClick={() => onDone({ picks: plate.map((x) => x.id), allCorrect })}>
        {allCorrect ? "Serve it up" : full ? "Hmm, serve anyway" : "Pick two"} <ArrowRight size={18} />
      </button>
    </div>
  );
}
