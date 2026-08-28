import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Sparkles, Heart } from "lucide-react";
import { askAnimal } from "../ai/aiClient.js";

// CONNECT beat — the third AI moment. The guest can ask the real animal
// anything in free text; the AI answers in the animal's voice but ONLY from
// pre-authored knowledge (see src/ai/aiClient.js -> askAnimal). Works fully
// offline via local retrieval; routes to an LLM only if VITE_AI_ENDPOINT is set.
export default function AskTheAnimal({ species, glow, onDone }) {
  const greeting = species?.ask?.greeting || `Hi! I'm a ${species.name}. Ask me anything.`;
  const suggested = species?.ask?.suggested || [];
  const [messages, setMessages] = useState([{ from: "animal", text: greeting }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [asked, setAsked] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = (text) => {
    const q = (text ?? input).trim();
    if (!q || thinking) return;
    setInput("");
    setMessages((m) => [...m, { from: "me", text: q }]);
    setThinking(true);
    const start = Date.now();
    askAnimal(species, q).then((answer) => {
      const wait = Math.max(0, 550 - (Date.now() - start)); // let the "typing" land
      setTimeout(() => {
        setMessages((m) => [...m, { from: "animal", text: answer }]);
        setThinking(false);
        setAsked((n) => n + 1);
      }, wait);
    });
  };

  return (
    <div className="beat ask-beat">
      <div className="beat-kicker" style={{ color: glow }}>
        <Sparkles size={14} /> AI · Ask the animal
      </div>
      <p className="ask-prompt">
        You've met {species.name.split(" ").slice(-1)[0]} — now talk to it. Ask anything.
      </p>

      <div className="ask-thread" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.from === "me" ? "me" : "animal"}`}>
            {m.from === "animal" && <span className="bubble-emoji">{species.emoji}</span>}
            <span className="bubble-text">{m.text}</span>
          </div>
        ))}
        {thinking && (
          <div className="bubble animal">
            <span className="bubble-emoji">{species.emoji}</span>
            <span className="typing"><i /><i /><i /></span>
          </div>
        )}
      </div>

      {suggested.length > 0 && (
        <div className="ask-chips">
          {suggested.map((s) => (
            <button key={s} className="chip" onClick={() => send(s)} disabled={thinking}
              style={{ borderColor: `${glow}55` }}>
              {s}
            </button>
          ))}
        </div>
      )}

      <form className="ask-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <MessageCircle size={16} className="ask-input-icon" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask the ${species.name.split(" ").slice(-1)[0]}…`}
          aria-label="Ask the animal a question"
        />
        <button type="submit" className="ask-send" disabled={!input.trim() || thinking}
          style={{ background: glow }} aria-label="Send question">
          <Send size={16} />
        </button>
      </form>

      <button className="cta" onClick={() => onDone()} style={{ marginTop: 14 }}>
        <Heart size={16} /> {asked > 0 ? "Add to Wildlife Wrapped" : "Skip — add to Wildlife Wrapped"}
      </button>
    </div>
  );
}
