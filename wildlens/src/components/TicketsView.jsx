import { Ticket, QrCode } from "lucide-react";
import BackHeader from "./BackHeader.jsx";
import { TICKETS, ACCOUNT } from "../data/account.js";

export default function TicketsView({ onBack }) {
  return (
    <div className="subpage">
      <BackHeader title="Tickets" onBack={onBack} />
      <p className="subpage-note">Active admissions for {ACCOUNT.name}. Demo data.</p>
      <div className="ticket-list">
        {TICKETS.map((t) => (
          <div key={t.id} className="ticket-card">
            <div className="ticket-top">
              <div className="ticket-park"><Ticket size={16} /> {t.park}</div>
              <span className="ticket-status">{t.status}</span>
            </div>
            <div className="ticket-type">{t.type}</div>
            <div className="ticket-meta">{t.date} · #{t.id}</div>
            <div className="ticket-code"><QrCode size={30} /><span>{t.code}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
