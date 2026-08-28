import { useEffect, useState } from "react";
import { Camera, Unlock, Loader2, ScanEye } from "lucide-react";
import useCameraVision from "../ai/useCameraVision.js";
import { confirmPresence } from "../ai/vision.js";

// Feature #2 — the REAL vision moment. Instead of the demo backdrop, the guest
// points their phone at the live animal and the on-device model confirms it's
// really there before the story unlocks. Falls back gracefully: if the camera
// or model is unavailable, the parent's manual "I can see it" button still works.
//
// CONFIRM_SCORE is intentionally lenient — a hackathon enclosure view is messy,
// and MobileNet only needs to be reasonably sure it's looking at the animal.
const CONFIRM_SCORE = 0.12;
const CONFIRM_HITS = 2; // need a couple of matching frames to avoid a fluke

export default function LiveLook({ look, visionKeywords = [], glow, onUnlock, onUnavailable }) {
  const { videoRef, status, preds } = useCameraVision({ enabled: true });
  const [hits, setHits] = useState(0);
  const [best, setBest] = useState(null);
  const [unlocking, setUnlocking] = useState(false);

  // Tell the parent to reveal its manual fallback if vision can't run here.
  useEffect(() => {
    if (status === "no-camera" || status === "vision-failed") onUnavailable?.(status);
  }, [status, onUnavailable]);

  // Watch predictions; count confident matches, then unlock.
  useEffect(() => {
    if (unlocking || status !== "ready" || !preds.length) return;
    const res = confirmPresence(preds, visionKeywords);
    setBest(res);
    if (res.ok && res.score >= CONFIRM_SCORE) {
      setHits((h) => {
        const n = h + 1;
        if (n >= CONFIRM_HITS) {
          setUnlocking(true);
          setTimeout(() => onUnlock(), 1100);
        }
        return n;
      });
    } else {
      setHits(0);
    }
  }, [preds, status, visionKeywords, unlocking, onUnlock]);

  const pct = best ? Math.round(best.score * 100) : 0;

  return (
    <div className="livelook">
      <div className="livelook-frame">
        <video ref={videoRef} className="livelook-video" playsInline muted />
        <div className="livelook-reticle" style={{ borderColor: glow }} />

        {status === "starting" && (
          <div className="livelook-overlay">
            <Loader2 size={22} className="spin" /> <span>Warming up vision…</span>
          </div>
        )}

        {status === "ready" && !unlocking && (
          <div className="livelook-hud">
            <ScanEye size={14} style={{ color: glow }} />
            {best && best.label
              ? <span>I see: <b>{best.label}</b> · {pct}%</span>
              : <span>Point at the animal…</span>}
          </div>
        )}

        {unlocking && (
          <div className="unlocked" style={{ color: glow }}>
            <Unlock size={40} /><span>Recognised — story unlocked</span>
          </div>
        )}
      </div>

      {status === "ready" && !unlocking && (
        <p className="livelook-hint">
          <Camera size={13} /> Hold steady on {look.feature} — the AI confirms it's really you.
        </p>
      )}
    </div>
  );
}
