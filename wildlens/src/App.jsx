import { useState, useCallback, useEffect } from "react";
import Entry from "./components/Entry.jsx";
import QrScanner from "./components/QrScanner.jsx";
import Encounter from "./components/Encounter.jsx";
import Classifying from "./components/Classifying.jsx";
import Reflecting from "./components/Reflecting.jsx";
import Wrapped from "./components/Wrapped.jsx";
import MapView from "./components/MapView.jsx";
import TicketsView from "./components/TicketsView.jsx";
import ExploreView from "./components/ExploreView.jsx";
import AccountView from "./components/AccountView.jsx";
import { RotateCcw, Home, X } from "lucide-react";
import hornbill from "./data/hornbill.js";
import orangutan from "./data/orangutan.js";
import { loadPersisted, savePersisted, clearPersisted } from "./storage.js";

// Species are addressable by marker. QR content "wildlens://<id>" selects one;
// any other QR falls back to "the next animal you haven't met yet" so a plain
// QR still works in a pinch.
const SPECIES = { great_hornbill: hornbill, sumatran_orangutan: orangutan };
const ORDER = ["great_hornbill", "sumatran_orangutan"];

function resolveSpecies(text, doneIds) {
  const m = /wildlens:\/\/([a-z_]+)/i.exec(text || "");
  if (m && SPECIES[m[1]]) return m[1];
  return ORDER.find((id) => !doneIds.includes(id)) || ORDER[ORDER.length - 1];
}

const persisted = loadPersisted();

const FRESH = {
  stage: "home",
  encounters: [],
  badges: persisted?.badges || [],
  doneIds: persisted?.doneIds || [],
  currentId: null,
  variant: persisted?.variant || null,
  curiosityType: persisted?.curiosityType || "ecosystem_focused",
  signals: null,
  reflection: persisted?.reflection || null,
  scanCounts: persisted?.scanCounts || { great_hornbill: 0, sumatran_orangutan: 0 },
};

export default function App() {
  const [s, setS] = useState(FRESH);

  // Persist the durable bits (not transient UI stage) so badges/scan counts
  // survive navigating around the app and a page refresh.
  useEffect(() => {
    savePersisted({
      badges: s.badges,
      doneIds: s.doneIds,
      variant: s.variant,
      curiosityType: s.curiosityType,
      reflection: s.reflection,
      scanCounts: s.scanCounts,
    });
  }, [s.badges, s.doneIds, s.variant, s.curiosityType, s.reflection, s.scanCounts]);

  const reset = useCallback(() => {
    clearPersisted();
    setS({
      stage: "home", encounters: [], badges: [], doneIds: [], currentId: null,
      variant: null, curiosityType: "ecosystem_focused", signals: null,
      reflection: null, scanCounts: { great_hornbill: 0, sumatran_orangutan: 0 },
    });
  }, []);

  const goHome = useCallback(() => setS((p) => ({ ...p, stage: "home" })), []);
  const navigate = useCallback((stage) => setS((p) => ({ ...p, stage })), []);

  // A marker was scanned (or M pressed) -> count the scan, pick the species,
  // and show "discovered". Scanning counts toward the Explore leaderboard
  // even on a repeat visit to an already-completed animal.
  const onDetected = (text) =>
    setS((p) => {
      const id = resolveSpecies(text, p.doneIds);
      return {
        ...p,
        currentId: id,
        stage: "discovered",
        scanCounts: { ...p.scanCounts, [id]: (p.scanCounts[id] || 0) + 1 },
      };
    });

  // Finished an encounter -> save it as a Wrapped badge (deduped by id), then
  // either trigger the AI classify moment (first-ever completion, more
  // species left) or the closing reflection (final species) or just go home.
  const onComplete = (result) => setS((p) => {
    const encounters = [...p.encounters, result];
    const doneIds = p.doneIds.includes(p.currentId) ? p.doneIds : [...p.doneIds, p.currentId];
    const badges = p.badges.some((b) => b.id === result.id) ? p.badges : [...p.badges, result];
    const isFirstEver = p.badges.length === 0 && !p.doneIds.includes(p.currentId);
    const allDone = doneIds.length >= ORDER.length;

    if (allDone) {
      return { ...p, encounters, doneIds, badges, stage: "reflecting" };
    }
    if (isFirstEver) {
      return { ...p, encounters, doneIds, badges, signals: { menuPicks: result.menuPicks, predictionIndex: result.predictionIndex }, stage: "classify" };
    }
    return { ...p, encounters, doneIds, badges, stage: "home" };
  });

  // AI moment 1 done -> store the selected variant, return HOME (not back
  // into the scanner) so the guest chooses when to scan the next marker.
  const afterClassify = (variant) =>
    setS((p) => ({ ...p, variant, curiosityType: variant, stage: "home" }));

  // AI moment 2 done -> cache the reflection, land on the celebratory Wrapped page.
  const afterReflect = (reflection) =>
    setS((p) => ({ ...p, reflection, stage: "wrapped" }));

  const species = s.currentId ? SPECIES[s.currentId] : null;
  const isOrangutan = s.currentId === "sumatran_orangutan";
  const variantData = isOrangutan
    ? orangutan.predictVariants[s.variant || orangutan.defaultVariant]
    : null;

  const liveSpecies = ORDER.map((id) => ({
    id, name: SPECIES[id].name, emoji: SPECIES[id].emoji, count: s.scanCounts[id] || 0,
  }));

  const showChrome = !["home", "wrapped", "map", "tickets", "explore", "account"].includes(s.stage);

  return (
    <div className="app">
      {showChrome && (
        <>
          <button className="home-fab" onClick={goHome} title="Back to home"><Home size={16} /></button>
          <button className="reset-fab" onClick={reset} title="Reset demo"><RotateCcw size={16} /></button>
        </>
      )}

      {s.stage === "home" && (
        <Entry
          onOpen={() => setS((p) => ({ ...p, stage: "scan" }))}
          onNavigate={navigate}
          onAccount={() => navigate("account")}
          badgeCount={s.badges.length}
        />
      )}

      {s.stage === "scan" && (
        <QrScanner
          prompt={s.badges.length === 0
            ? "Point your camera at a WildLens marker near the enclosure."
            : "Now walk to the next animal and scan its WildLens marker."}
          onDetected={onDetected}
          onBack={goHome}
        />
      )}

      {s.stage === "discovered" && species && (
        <Discovered species={species} onGo={() => setS((p) => ({ ...p, stage: "encounter" }))} onBack={goHome} />
      )}

      {s.stage === "encounter" && species && (
        <Encounter
          species={species}
          predictOverride={variantData}
          becauseNote={isOrangutan && s.variant ? variantData.because : undefined}
          onComplete={onComplete}
        />
      )}

      {s.stage === "classify" && <Classifying signals={s.signals} onDone={afterClassify} />}
      {s.stage === "reflecting" && <Reflecting curiosityType={s.curiosityType} onDone={afterReflect} />}

      {s.stage === "wrapped" && (
        <Wrapped
          badges={s.badges}
          reflection={s.reflection}
          curiosityType={s.curiosityType}
          totalSpecies={ORDER.length}
          onBack={goHome}
        />
      )}

      {s.stage === "map" && <MapView onBack={goHome} />}
      {s.stage === "tickets" && <TicketsView onBack={goHome} />}
      {s.stage === "explore" && <ExploreView onBack={goHome} liveSpecies={liveSpecies} />}
      {s.stage === "account" && <AccountView onBack={goHome} badgeCount={s.badges.length} />}
    </div>
  );
}

function Discovered({ species, onGo, onBack }) {
  return (
    <div className="discovered">
      <button className="home-fab" onClick={onBack} title="Back to home"><X size={16} /></button>
      <div className="disc-emoji">{species.emoji}</div>
      <div className="disc-kicker" style={{ color: species.glow }}>Marker detected</div>
      <h2 className="disc-name">{species.name} discovered</h2>
      <div className="disc-park">{species.park}</div>
      <button className="cta" onClick={onGo}
        style={{ background: `linear-gradient(135deg, ${species.glow}, #ffffff55)` }}>
        Meet {species.name.split(" ").slice(-1)[0]}
      </button>
    </div>
  );
}
