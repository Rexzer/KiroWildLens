import { useEffect, useRef, useState } from "react";
import { warmup, classifyFrame } from "./vision.js";

// Shared camera + live-classification hook for the two vision features
// (Look-to-Unlock confirm and scan-any-animal). Opens the rear camera, warms
// up the on-device model, then classifies a frame roughly once a second and
// reports predictions back. Everything is defensively guarded and the camera
// is fully released on unmount.
//
// status: "starting" | "ready" | "no-camera" | "vision-failed"
export default function useCameraVision({ enabled = true, intervalMs = 900 } = {}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const busyRef = useRef(false);
  const [status, setStatus] = useState("starting");
  const [preds, setPreds] = useState([]);

  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;

    async function start() {
      // 1) Camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch {
        if (!cancelled) setStatus("no-camera");
        return;
      }

      // 2) Model (non-fatal — camera can still show even if inference is off)
      const ok = await warmup();
      if (cancelled) return;
      if (!ok) { setStatus("vision-failed"); return; }
      setStatus("ready");

      // 3) Inference loop
      timerRef.current = setInterval(async () => {
        if (busyRef.current || !videoRef.current || videoRef.current.readyState < 2) return;
        busyRef.current = true;
        try {
          const out = await classifyFrame(videoRef.current, 5);
          if (!cancelled) setPreds(out);
        } catch {
          /* transient — keep looping */
        } finally {
          busyRef.current = false;
        }
      }, intervalMs);
    }

    start();

    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
      const s = streamRef.current;
      if (s) s.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [enabled, intervalMs]);

  return { videoRef, status, preds };
}
