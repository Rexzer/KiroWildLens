import { useEffect, useState } from "react";
import { ScanEye, Loader2, X, Sparkles } from "lucide-react";
import useCameraVision from "../ai/useCameraVision.js";
import { matchSpecies } from "../ai/vision.js";

// Feature #3 — "scan any animal". No QR marker needed: point the camera at an
// enclosure and the on-device model identifies which WildLens species is in
// frame, then loads its encounter. Encourages open exploration beyond marked
// stops. Falls back to a tap-to-pick list if the camera/model isn't available
// (or the animal isn't one we've built yet).
const MATCH_SCORE = 0.1;
const MATCH_HITS = 2;

export default function AnimalScanner({ catalog = [], onMatch, onBack }) {
  const { videoRef, status, preds } = useCameraVision({ enabled: true });
  const [hits, setHits] = useState(0);
  const [guess, setGuess] = useState(null); // { id, label, score }
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (locked || status !== "ready" || !preds.length) return;
    const m = matchSpecies(preds, catalog);
    if (m && m.score >= MATCH_SCORE) {
      setGuess(m);
      setHits((h) => {
        const n = h + 1;
        if (n >= MATCH_HITS) {
          setLocked(true);
          setTimeout(() => onMatch(m.id), 900);
        }
        return n;
      });
    } else {
      setHits(0);
    }
  }, [preds, status, catalog, locked, onMatch]);

  const matchedName = guess ? catalog.find((c) => c.id === guess.id)?.name : null;
  const showManual = status === "no-camera" || status === "vision-failed";

  return (
    <div className="scan">
      <button className="home-fab" onClick={onBack} title="Back"><X size={16} /></button>
      <div className="scan-kicker"><Sparkles size={15} /> AI · Identify by camera</div>
      <h2 className="scan-title">
        {showManual ? "Which animal are you looking at?" : "Point at any animal — no marker needed."}
      </h2>

      {!showManual && (
        <>
          <div className="qr-frame">
            <video ref={videoRef} className="animalscan-video" playsInline muted />
            <div className="qr-reticle" />
            {status === "starting" && (
              <div className="livelook-overlay"><Loader2 size={22} className="spin" /> <span>Warming up vision…</span></div>
            )}
            {locked && matchedName && (
              <div className="animalscan-hit"><ScanEye size={20} /> Looks like a {matchedName}!</div>
            )}
          </div>
          <div className="scan-hint">
            {status === "ready"
              ? (guess ? <>I see: <b>{guess.label}</b> · {Math.round(guess.score * 100)}%</> : "Looking for an animal…")
              : "Starting camera…"}
          </div>
        </>
      )}

      {/* Manual fallback — also handy if the animal isn't one we've built yet. */}
      <div className="animalscan-manual">
        {showManual && <p className="subpage-note">Camera or AI vision isn't available here — pick the animal instead.</p>}
        {!showManual && <div className="animalscan-or">or pick it yourself</div>}
        <div className="badge-grid">
          {catalog.map((c) => (
            <button key={c.id} className="badge-tile" onClick={() => onMatch(c.id)}>
              <span className="badge-emoji">{c.emoji}</span>
              <span className="badge-name">{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
