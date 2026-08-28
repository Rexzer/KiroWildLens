// DEMO HABITAT MODE — stands in for the live camera view so the Look-to-Unlock
// beat is demonstrable in a judging room. Swap `children`/background for a
// looping video of the real animal in production. Clearly labelled per brief.
export default function HabitatBackdrop({ variant = "canopy", children }) {
  return (
    <div className={`habitat habitat-${variant}`}>
      <div className="habitat-label">DEMO HABITAT MODE · live camera in production</div>
      <div className="habitat-scene" aria-hidden="true">
        <span className="leaf l1" /><span className="leaf l2" /><span className="leaf l3" />
        <span className="leaf l4" /><span className="leaf l5" />
      </div>
      {children}
    </div>
  );
}
