import { Map, Ticket, Compass, ScanLine, Sparkles, ArrowRight } from "lucide-react";
import { ACCOUNT } from "../data/account.js";

// Home hub. Communicates "WildLens is a feature inside the Mandai visitor
// journey" — the four nav tiles and account icon are all real navigation now,
// not decoration, so a guest can leave a scan/encounter mid-flow and always
// land back here.
export default function Entry({ onOpen, onNavigate, onAccount, badgeCount }) {
  return (
    <div className="entry">
      <div className="entry-head">
        <div>
          <div className="entry-brand">Mandai</div>
          <div className="entry-sub">Wildlife Parks · Singapore</div>
        </div>
        <button className="account-fab" onClick={onAccount} title="Account">
          {ACCOUNT.initials}
        </button>
      </div>
      <div className="entry-hero">
        <h1>Good day at the parks.</h1>
        <p>Open WildLens at any enclosure to discover the animal in front of you.</p>
      </div>
      <div className="entry-nav">
        <button className="nav-item" onClick={() => onNavigate("map")}>
          <Map size={20} /><span>Map</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate("tickets")}>
          <Ticket size={20} /><span>Tickets</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate("explore")}>
          <Compass size={20} /><span>Explore</span>
        </button>
        <button className="nav-item nav-item-wrapped" onClick={() => onNavigate("wrapped")}>
          <Sparkles size={20} />
          <span>Wrapped</span>
          {badgeCount > 0 && <span className="nav-badge">{badgeCount}</span>}
        </button>
      </div>
      <button className="wildlens-tile" onClick={onOpen}>
        <div className="wl-left">
          <div className="wl-icon"><ScanLine size={22} /></div>
          <div>
            <div className="wl-name">WildLens</div>
            <div className="wl-tag">See beyond the enclosure</div>
          </div>
        </div>
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
