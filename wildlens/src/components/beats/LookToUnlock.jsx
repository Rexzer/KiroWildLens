import { useState } from "react";
import { Eye, Lock, Unlock, Camera, MousePointerClick } from "lucide-react";
import HabitatBackdrop from "../HabitatBackdrop.jsx";
import LiveLook from "../LiveLook.jsx";

// HERO beat — the real animal is the key. The guest confirms a feature on the
// live animal to UNLOCK the story. Two paths:
//   • Live AI camera (Feature #2): the on-device model recognises the real
//     animal in frame and unlocks — the true "the physical animal is the key".
//   • Demo backdrop (fallback): tap the hotspot / confirm button. Always works,
//     so judging never depends on a camera or model being available.
export default function LookToUnlock({ look, backdrop, glow, visionKeywords = [], onDone }) {
  const [mode, setMode] = useState("demo"); // demo | camera
  const [phase, setPhase] = useState("looking"); // looking | unlocked
  const [miss, setMiss] = useState(false);
  const [camNote, setCamNote] = useState("");

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

  // Vision couldn't run here — drop back to the demo path with a gentle note.
  const onVisionUnavailable = () => {
    setMode("demo");
    setCamNote("Live camera unavailable here — use Demo Habitat Mode to unlock.");
  };

  return (
    <div className="beat look-beat">
      <div className="beat-kicker" style={{ color: glow }}>
        <Eye size={15} /> Look back at the real animal
      </div>
      <p className="look-prompt">{look.prompt}</p>

      {phase === "looking" && (
        <div className="look-toggle">
          <button className={`look-tab ${mode === "camera" ? "on" : ""}`}
            onClick={() => { setCamNote(""); setMode("camera"); }}>
            <Camera size={14} /> Live camera
          </button>
          <button className={`look-tab ${mode === "demo" ? "on" : ""}`}
            onClick={() => setMode("demo")}>
            <MousePointerClick size={14} /> Demo mode
          </button>
        </div>
      )}

      {mode === "camera" && phase === "looking" ? (
        <LiveLook look={look} visionKeywords={visionKeywords} glow={glow}
          onUnlock={unlock} onUnavailable={onVisionUnavailable} />
      ) : (
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
      )}

      {camNote && <div className="look-note">{camNote}</div>}

      {phase === "looking" && mode === "demo" && (
        <button className="cta subtle" onClick={unlock}>
          <Lock size={15} /> I can see {look.feature} — unlock
        </button>
      )}
    </div>
  );
}
