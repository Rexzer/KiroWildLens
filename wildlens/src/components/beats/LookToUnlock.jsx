import { useState } from "react";
import { Eye, Lock, Unlock } from "lucide-react";
import HabitatBackdrop from "../HabitatBackdrop.jsx";

// HERO beat — the real animal is the key. The guest must find a feature on the
// live animal (here, the demo habitat backdrop) and confirm it to UNLOCK the
// story. Tapping the hotspot works; a confirm button is the reliable fallback.
export default function LookToUnlock({ look, backdrop, glow, onDone }) {
  const [phase, setPhase] = useState("looking"); // looking | unlocked
  const [miss, setMiss] = useState(false);

  const tapScene = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    const near = Math.hypot(x - look.hotspot.x, y - look.hotspot.y) < 16;
    if (near) unlock();
    else { setMiss(true); setTimeout(() => setMiss(false), 1200); }
  };

  const unlock = () => {
    setPhase("unlocked");
    setTimeout(() => onDone(true), 1400);
  };

  return (
    <div className="beat look-beat">
      <div className="beat-kicker" style={{ color: glow }}>
        <Eye size={15} /> Look back at the real animal
      </div>
      <p className="look-prompt">{look.prompt}</p>

      <HabitatBackdrop variant={backdrop}>
        <div className="look-view" onClick={phase === "looking" ? tapScene : undefined}>
          {phase === "looking" && (
            <button className="hotspot" style={{ left: `${look.hotspot.x}%`, top: `${look.hotspot.y}%`, borderColor: glow }}
              onClick={(e) => { e.stopPropagation(); unlock(); }} aria-label={`Tap ${look.feature}`}>
              <span className="hotspot-ring" style={{ borderColor: glow }} />
            </button>
          )}
          {phase === "unlocked" && (
            <div className="unlocked" style={{ color: glow }}>
              <Unlock size={40} /><span>Story unlocked</span>
            </div>
          )}
          {miss && <div className="look-miss">Not quite — look for {look.feature}.</div>}
        </div>
      </HabitatBackdrop>

      {phase === "looking" && (
        <button className="cta subtle" onClick={unlock}>
          <Lock size={15} /> I can see {look.feature} — unlock
        </button>
      )}
    </div>
  );
}
