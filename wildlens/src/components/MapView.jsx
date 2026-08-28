import BackHeader from "./BackHeader.jsx";

// Original, illustrative zone map for the demo — NOT a reproduction of
// Mandai's real park map (which is copyrighted). It's a simplified schematic
// so the "Map" tile has something functional behind it in a hackathon build.
const ZONES = [
  { id: "bird", name: "Bird Paradise", x: 60, y: 40, w: 120, h: 70, color: "#F5B841" },
  { id: "zoo", name: "Singapore Zoo", x: 210, y: 30, w: 130, h: 90, color: "#5EEAD4" },
  { id: "river", name: "River Wonders", x: 60, y: 140, w: 120, h: 70, color: "#7DD3FC" },
  { id: "night", name: "Night Safari", x: 210, y: 150, w: 130, h: 70, color: "#C4B5FD" },
];

const PINS = [
  { name: "Great Hornbill", emoji: "🐦", x: 100, y: 65 },
  { name: "Sumatran Orangutan", emoji: "🦧", x: 275, y: 60 },
];

export default function MapView({ onBack }) {
  return (
    <div className="subpage">
      <BackHeader title="Park Map" onBack={onBack} />
      <p className="subpage-note">
        Simplified overview map — not to scale. WildLens markers are placed at each enclosure.
      </p>
      <svg viewBox="0 0 400 240" className="map-svg" role="img" aria-label="Mandai Wildlife Parks zone map">
        <rect x="0" y="0" width="400" height="240" rx="16" fill="#0E2A20" />
        {ZONES.map((z) => (
          <g key={z.id}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="12" fill={z.color} opacity="0.16" stroke={z.color} strokeOpacity="0.5" />
            <text x={z.x + z.w / 2} y={z.y + z.h / 2} textAnchor="middle" fill="#EAF6F0" fontSize="11" fontFamily="Baloo 2, sans-serif">
              {z.name}
            </text>
          </g>
        ))}
        {PINS.map((p) => (
          <g key={p.name}>
            <circle cx={p.x} cy={p.y} r="11" fill="#08130F" stroke="#5EEAD4" strokeWidth="1.5" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="12">{p.emoji}</text>
          </g>
        ))}
      </svg>
      <div className="map-legend">
        {PINS.map((p) => (
          <div key={p.name} className="map-legend-item"><span>{p.emoji}</span>{p.name} — WildLens marker live</div>
        ))}
      </div>
    </div>
  );
}
