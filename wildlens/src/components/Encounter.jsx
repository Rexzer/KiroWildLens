import { useState } from "react";
import Predict from "./beats/Predict.jsx";
import WildMenu from "./beats/WildMenu.jsx";
import LookToUnlock from "./beats/LookToUnlock.jsx";
import SignatureReveal from "./beats/SignatureReveal.jsx";
import ConservationReveal from "./beats/ConservationReveal.jsx";
import AskTheAnimal from "./AskTheAnimal.jsx";

// ONE reusable flow that renders the full core loop from a species JSON object.
// Adding a species = writing data, not code. `predict` may be injected (the
// AI-selected variant for the orangutan) via the `predictOverride` prop.
// The final "connect" beat is the AI "Ask the Animal" conversation.
const ORDER = ["predict", "play", "look", "signature", "conservation", "connect"];

export default function Encounter({ species, predictOverride, becauseNote, onComplete }) {
  const predict = predictOverride || species.predict;
  const [step, setStep] = useState(0);
  const [guess, setGuess] = useState(0);
  const [menu, setMenu] = useState({ picks: [], allCorrect: false });

  const next = () => setStep((s) => s + 1);
  const beat = ORDER[step];

  // Built once, fired when the guest finishes the CONNECT beat.
  const finish = () => onComplete({
    id: species.id,
    menuPicks: menu.picks,
    predictionIndex: guess,
    tags: species.wrappedTags,
    name: species.name,
    emoji: species.emoji,
    signature: species.signature,
    conservation: species.conservation,
  });

  return (
    <div className="encounter">
      <div className="species-tab">
        <span className="species-emoji">{species.emoji}</span>
        <div>
          <div className="species-name">{species.name}</div>
          <div className="species-park">{species.park}</div>
        </div>
      </div>

      {beat === "predict" && (
        <Predict predict={predict} glow={species.glow} becauseNote={becauseNote}
          onDone={(g) => { setGuess(g); next(); }} />
      )}
      {beat === "play" && (
        <WildMenu menu={species.wildMenu} glow={species.glow}
          onDone={(m) => { setMenu(m); next(); }} />
      )}
      {beat === "look" && (
        <LookToUnlock look={species.look} backdrop={species.backdrop} glow={species.glow}
          visionKeywords={species.visionMatch} onDone={next} />
      )}
      {beat === "signature" && (
        <SignatureReveal signature={species.signature} glow={species.glow} onDone={next} />
      )}
      {beat === "conservation" && (
        <ConservationReveal conservation={species.conservation} predict={predict}
          guessIndex={guess} glow={species.glow}
          ctaLabel={`Talk to ${species.name.split(" ").slice(-1)[0]} →`}
          onDone={next} />
      )}
      {beat === "connect" && (
        <AskTheAnimal species={species} glow={species.glow} onDone={finish} />
      )}
    </div>
  );
}
