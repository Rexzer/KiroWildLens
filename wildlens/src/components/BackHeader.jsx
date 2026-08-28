import { ArrowLeft } from "lucide-react";

export default function BackHeader({ title, onBack }) {
  return (
    <div className="back-header">
      <button className="back-btn" onClick={onBack} title="Back to home">
        <ArrowLeft size={18} />
      </button>
      <div className="back-title">{title}</div>
    </div>
  );
}
