import { Award } from "lucide-react";
import BackHeader from "./BackHeader.jsx";
import { ACCOUNT } from "../data/account.js";

export default function AccountView({ onBack, badgeCount }) {
  return (
    <div className="subpage">
      <BackHeader title="Account" onBack={onBack} />
      <div className="account-card">
        <div className="account-avatar">{ACCOUNT.initials}</div>
        <div className="account-name">{ACCOUNT.name}</div>
        <div className="account-tier">{ACCOUNT.tier}</div>
      </div>
      <div className="account-rows">
        <div className="account-row"><span>Email</span><span>{ACCOUNT.email}</span></div>
        <div className="account-row"><span>Member since</span><span>{ACCOUNT.memberSince}</span></div>
        <div className="account-row">
          <span>Wildlife Wrapped badges</span>
          <span className="account-badges"><Award size={14} /> {badgeCount}</span>
        </div>
      </div>
      <p className="subpage-note">Demo account — no sign-in required.</p>
    </div>
  );
}
