import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { QrCode, Keyboard, X, Sparkles } from "lucide-react";

// Real QR scan = the marker trigger. The decoded text is passed to onDetected so
// the app can select the right species (wildlens://<id>). A hidden manual
// trigger (press "m") is an emergency fallback only, surfaced quietly if the
// camera won't start. onBack lets the guest cancel out and return home
// without completing a scan — the camera is stopped via the effect cleanup
// the moment this component unmounts.
export default function QrScanner({ onDetected, onBack, onUseVision, prompt }) {
  const ref = useRef(null);
  const scannerRef = useRef(null);
  const [camError, setCamError] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "m" || e.key === "M") fire(""); };
    window.addEventListener("keydown", onKey);

    const id = "qr-region";
    if (ref.current) ref.current.id = id;
    const scanner = new Html5Qrcode(id, { verbose: false });
    scannerRef.current = scanner;

    scanner
      .start({ facingMode: "environment" }, { fps: 10, qrbox: 220 },
        (decodedText) => fire(decodedText), () => {})
      .catch(() => setCamError(true));

    let fired = false;
    function fire(text) {
      if (fired) return;
      fired = true;
      window.removeEventListener("keydown", onKey);
      stop().then(() => onDetected(text));
    }
    async function stop() {
      try { if (scannerRef.current?.isScanning) await scannerRef.current.stop(); } catch (_) {}
    }
    return () => { window.removeEventListener("keydown", onKey); stop(); };
  }, [onDetected]);

  return (
    <div className="scan">
      {onBack && (
        <button className="home-fab" onClick={onBack} title="Back to home"><X size={16} /></button>
      )}
      <div className="scan-kicker"><QrCode size={15} /> WildLens</div>
      <h2 className="scan-title">{prompt || "Point your camera at a WildLens marker near the enclosure."}</h2>
      <div className="qr-frame">
        <div ref={ref} className="qr-region" />
        <div className="qr-reticle" />
      </div>
      {camError && (
        <div className="cam-fallback">
          <Keyboard size={14} /> Camera unavailable here — press <kbd>M</kbd> to simulate a scan.
        </div>
      )}
      <div className="scan-hint">Scanning… hold steady over the marker</div>
      {onUseVision && (
        <button className="cta ghost scan-vision-cta" onClick={onUseVision}>
          <Sparkles size={15} /> No marker? Identify the animal by camera
        </button>
      )}
    </div>
  );
}
