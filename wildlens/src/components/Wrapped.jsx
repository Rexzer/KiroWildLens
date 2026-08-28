import { useState } from "react";
import { Award, Sparkles, ChevronRight } from "lucide-react";
import BackHeader from "./BackHeader.jsx";
import { PROFILE_LABEL } from "../ai/aiClient.js";

// Wrapped is now a revisitable page, not a one-time end screen. Every
// completed encounter is saved here as a badge the guest can tap to see the
// facts again. The closing reflection is generated ONCE (when the journey
// completes, in App.jsx) and cached — this page just displays it, it never
// re-calls the AI on every visit.
export default function Wrapped({ badges, reflection, curiosityType, totalSpecies, onBack }) {
  const [openBadge, setOpenBadge] = useState(null);

  if (openBadge) {
    return <BadgeDetail badge={openBadge} onBack={() => setOpenBadge(null)} />;
  }

  const themes = [...new Set(badges.flatMap((b) => b.tags || []))];
  const complete = badges.length >= totalSpecies;

  return (
    <div className="subpage">
      <BackHeader title="Your Wildlife Wrapped" onBack={onBack} />

      <div className="wrapped-count">
        <span className="big">{badges.length}</span>
        <span>species you connected with{!complete && ` (of ${totalSpecies})`}</span>
      </div>

      {badges.length === 0 && (
        <p className="subpage-note">Scan your first WildLens marker to start collecting badges.</p>
      )}

      <div className="badge-grid">
        {badges.map((b) => (
          <button key={b.id} className="badge-tile" onClick={() => setOpenBadge(b)}>
            <span className="badge-emoji">{b.emoji}</span>
            <span className="badge-name">{b.name}</span>
            <ChevronRight size={14} className="badge-chevron" />
          </button>
        ))}
      </div>

      {badges.length > 0 && (
        <div className="wrapped-block">
          <div className="wb-label">You explored most</div>
          <div className="wb-value">{themes.includes("forest") ? "Habitat & Ecosystems" : "Wildlife Behaviour"}</div>
        </div>
      )}

      {complete && (
        <>
          <div className="wrapped-profile">
            <Award size={16} />
            <div>
              <div className="wp-label">Your wildlife profile</div>
              <div className="wp-name">{PROFILE_LABEL[curiosityType] || "Curious Explorer"}</div>
            </div>
          </div>
          <p className="wrapped-reflection">
            <Sparkles size={13} /> {reflection || "…"}
          </p>
        </>
      )}
    </div>
  );
}

function BadgeDetail({ badge, onBack }) {
  return (
    <div className="subpage">
      <BackHeader title={badge.name} onBack={onBack} />
      <div className="badge-detail-hero">
        <span className="badge-detail-emoji">{badge.emoji}</span>
      </div>
      {badge.signature && (
        <div className="wrapped-block">
          <div className="wb-label">Signature story</div>
          <div className="wb-value">{badge.signature.headline}</div>
          <p className="subpage-note">{badge.signature.caption}</p>
        </div>
      )}
      {badge.conservation && (
        <div className="wrapped-block">
          <div className="wb-label">Conservation status</div>
          <div className="wb-value">{badge.conservation.status}</div>
          <p className="subpage-note">{badge.conservation.story}</p>
        </div>
      )}
    </div>
  );
}
