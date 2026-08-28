import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { classifyCuriosity } from "../ai/aiClient.js";

// The visible "AI-powered" moment. Between encounters, the AI reads the guest's
// Hornbill behaviour and PICKS which pre-authored Orangutan question comes next.
export default function Classifying({ signals, onDone }) {
  useEffect(() => {
    const start = Date.now();
    classifyCuriosity(signals).then((variant) => {
      const wait = Math.max(0, 1400 - (Date.now() - start)); // let the beat land
      setTimeout(() => onDone(variant), wait);
    });
  }, [signals, onDone]);

  return (
    <div className="classify">
      <div className="classify-orb"><Sparkles size={30} /></div>
      <div className="classify-title">Personalising your next encounter…</div>
      <div className="classify-sub">Reading what sparked your curiosity</div>
    </div>
  );
}
