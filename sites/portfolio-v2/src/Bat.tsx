/** A small nod to the Batman version: the emblem, the signal oval and a night skyline. */
export const BAT_PATH =
  "M100 32 L106 14 L111 33 C120 34 132 26 140 14 C160 22 185 30 198 50 C186 52 176 58 172 70 C165 62 152 62 146 70 C140 62 128 62 124 74 C116 72 106 80 100 96 C94 80 84 72 76 74 C72 62 60 62 54 70 C48 62 35 62 28 70 C24 58 14 52 2 50 C15 30 40 22 60 14 C68 26 80 34 89 33 L94 14 Z";

export const BAT = "#ffffff";

export function BatLogo({ className = "", fill = "currentColor" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 8 200 92" className={className} aria-hidden>
      <path d={BAT_PATH} fill={fill} />
    </svg>
  );
}

/** The emblem inside its oval. `lit` turns the oval yellow. */
export function SignalOval({ lit, className = "" }: { lit: boolean; className?: string }) {
  return (
    <svg viewBox="-14 -22 228 150" className={className} aria-hidden>
      <defs>
        <radialGradient id="oval-lit" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor={BAT} />
          <stop offset="1" stopColor="#d6d9e0" />
        </radialGradient>
      </defs>
      <ellipse
        cx="100"
        cy="53"
        rx="112"
        ry="72"
        fill={lit ? "url(#oval-lit)" : "#171613"}
        stroke={lit ? "#0b0b0a" : "#2e2c27"}
        strokeWidth="5"
        style={{ transition: "fill .6s" }}
      />
      <path d={BAT_PATH} fill="#0b0b0a" transform="translate(100 53) scale(0.86) translate(-100 -53)" />
    </svg>
  );
}

/** Night skyline with a few windows still on. */
export function Skyline({ className = "", fill = "#050505" }: { className?: string; fill?: string }) {
  const towers: [number, number, number, number][] = [
    [0, 60, 150, 0], [55, 40, 200, 26], [92, 70, 130, 0], [158, 36, 250, 50], [190, 64, 175, 0], [250, 44, 285, 34],
    [290, 80, 160, 0], [366, 50, 215, 20], [412, 34, 315, 66], [442, 70, 190, 0], [508, 46, 250, 0], [550, 90, 140, 0],
    [636, 40, 235, 42], [672, 62, 185, 0], [730, 38, 300, 58], [764, 70, 165, 0], [830, 50, 225, 26], [876, 84, 150, 0],
    [956, 44, 265, 38], [996, 60, 190, 0], [1052, 40, 240, 0], [1088, 76, 165, 0], [1160, 40, 210, 30],
  ];
  return (
    <svg viewBox="0 0 1200 340" className={className} aria-hidden>
      {towers.map(([x, w, h, s], i) => (
        <g key={i}>
          <rect x={x} y={340 - h} width={w} height={h} fill={fill} />
          {s > 0 && <polygon points={`${x + w / 2 - 4},${340 - h} ${x + w / 2},${340 - h - s} ${x + w / 2 + 4},${340 - h}`} fill={fill} />}
          {Array.from({ length: Math.floor(h / 24) }).map((_, r) =>
            Array.from({ length: Math.max(1, Math.floor(w / 14)) }).map((__, k) =>
              (i * 7 + r * 3 + k * 5) % 11 === 0 ? (
                <rect key={`${r}-${k}`} x={x + 5 + k * 14} y={340 - h + 12 + r * 24} width={4} height={6} fill={BAT} opacity={0.3} />
              ) : null,
            ),
          )}
        </g>
      ))}
    </svg>
  );
}
