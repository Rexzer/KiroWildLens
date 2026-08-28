import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { generateReflection } from "../ai/aiClient.js";

// The second AI moment. Runs ONCE, when the guest finishes their final
// encounter — result is cached by the caller so Wrapped never re-triggers it.
export default function Reflecting({ curiosityType, onDone }) {
  useEffect(() => {
    const start = Date.now();
    generateReflection(curiosityType).then((text) => {
      const wait = Math.max(0, 1100 - (Date.now() - start));
      setTimeout(() => onDone(text), wait);
    });
  }, [curiosityType, onDone]);

  return (
    <div className="classify">
      <div className="classify-orb"><Sparkles size={30} /></div>
      <div className="classify-title">Wrapping up your visit…</div>
      <div className="classify-sub">Putting together your wildlife profile</div>
    </div>
  );
}
