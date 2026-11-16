import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { pins, type Pin } from "./pins";
import { reduced } from "./lib";

/* A 44-pin QFP, drawn in a 600×600 box. Body spans 130..470, 11 pins per side, 24 pitch. */
const P = (i: number) => 180 + 24 * i;
const SIDES = 4;
const PER = 11;

/** Trace from a left-side pin outwards, in left-side coordinates. Other sides are rotations of it. */
function trace(i: number) {
  const p = P(i);
  const k = i - 5;
  const x1 = 92 - Math.abs(k) * 5;
  const dy = 0.45 * (p - 300);
  const x2 = x1 - Math.abs(dy);
  return { d: `M106,${p} H${x1} L${x2},${p + dy} H-40`, via: i % 3 === 0 ? { x: x2, y: p + dy } : null };
}

function labelProps(s: number, i: number) {
  const p = P(i);
  switch (s) {
    case 0:
      return { x: 140, y: p + 3, textAnchor: "start" as const };
    case 1:
      return { x: p + 3, y: 460, textAnchor: "start" as const, transform: `rotate(-90 ${p + 3} 460)` };
    case 2:
      return { x: 460, y: 600 - p + 3, textAnchor: "end" as const };
    default:
      return { x: 600 - p + 3, y: 140, textAnchor: "end" as const, transform: `rotate(-90 ${600 - p + 3} 140)` };
  }
}

export function Chip({ onPin, power = true }: { onPin?: (p: Pin) => void; power?: boolean }) {
  const [active, setActive] = useState(5);
  const hovering = useRef(false);

  // When nobody is pointing at it, the chip probes its own pins.
  useEffect(() => {
    if (reduced()) return;
    const t = setInterval(() => {
      if (!hovering.current) setActive(Math.floor(Math.random() * pins.length));
    }, 1500);
    return () => clearInterval(t);
  }, []);
  useEffect(() => onPin?.(pins[active]), [active, onPin]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [9, -9]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-11, 11]), { stiffness: 120, damping: 18 });

  return (
    <div
      className="[perspective:1400px]"
      onMouseMove={(e) => {
        if (reduced()) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.svg
        viewBox="0 0 600 600"
        className="block h-auto w-full select-none"
        style={{ rotateX: rx, rotateY: ry }}
        role="img"
        aria-label="A 44-pin chip. Each pin is one tool in Mohan's stack."
      >
        <defs>
          <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#262624" />
            <stop offset="0.55" stopColor="#141413" />
            <stop offset="1" stopColor="#0c0c0b" />
          </linearGradient>
          <radialGradient id="sheen" cx="0.3" cy="0.25" r="0.8">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.09" />
            <stop offset="0.6" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Traces, legs and vias: draw the left side, rotate it round for the other three. */}
        {Array.from({ length: SIDES }, (_, s) => (
          <g key={s} transform={`rotate(${-90 * s} 300 300)`}>
            {Array.from({ length: PER }, (_, i) => {
              const pin = pins[s * PER + i];
              const on = s * PER + i === active;
              const t = trace(i);
              return (
                <g key={i}>
                  <path d={t.d} fill="none" stroke={on ? "#ff4d00" : "#1212113a"} strokeWidth={on ? 2.2 : 1.4} />
                  {power && (
                    <path
                      d={t.d}
                      fill="none"
                      stroke={pin.main ? "#ff4d00" : "#121211"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="trace-pulse"
                      style={{ ["--d" as string]: `${3 + ((s * PER + i) % 5) * 0.7}s`, ["--delay" as string]: `${-((s * 7 + i * 3) % 9) * 0.6}s` }}
                    />
                  )}
                  {t.via && <circle cx={t.via.x} cy={t.via.y} r="3.6" fill="#ebeae3" stroke={on ? "#ff4d00" : "#12121166"} strokeWidth="1.4" />}
                  <rect x="106" y={P(i) - 5} width="26" height="10" rx="1" fill={on ? "#ff4d00" : pin.main ? "#9c9a90" : "#b7b5ab"} stroke="#12121155" strokeWidth="0.8" />
                </g>
              );
            })}
          </g>
        ))}

        {/* Package body. */}
        <rect x="130" y="130" width="340" height="340" rx="10" fill="url(#body)" />
        <rect x="130" y="130" width="340" height="340" rx="10" fill="url(#sheen)" />
        <rect x="137" y="137" width="326" height="326" rx="7" fill="none" stroke="#ffffff12" />
        <circle cx="157" cy="157" r="6.5" fill="#ffffff10" stroke="#ffffff26" />

        {/* Pin names, inside the outline like a real pinout drawing. */}
        {pins.map((pin, idx) => {
          const s = Math.floor(idx / PER);
          const i = idx % PER;
          const on = idx === active;
          return (
            <text
              key={pin.n}
              {...labelProps(s, i)}
              fontFamily="IBM Plex Mono, monospace"
              fontSize="8.6"
              fontWeight={on ? 600 : 500}
              fill={on ? "#ff4d00" : pin.main ? "#ebeae3d0" : "#ebeae37a"}
            >
              {pin.name}
            </text>
          );
        })}

        {/* Marking. */}
        <g fontFamily="IBM Plex Mono, monospace" textAnchor="middle">
          <text x="300" y="262" fontSize="10" letterSpacing="3" fill="#ebeae38c">
            MOHAN YADAV
          </text>
          <text x="300" y="306" fontFamily="Archivo Variable, sans-serif" fontSize="46" fontWeight="850" style={{ fontStretch: "62%" }} fill="#ebeae3" letterSpacing="-0.5">
            MY-2026
          </text>
          <text x="300" y="328" fontSize="9" letterSpacing="2" fill="#ff4d00">
            FULL-STACK · AI
          </text>
          <text x="300" y="350" fontSize="7.5" letterSpacing="1.5" fill="#ebeae34d">
            IND · DTU · SINCE CL.9
          </text>
        </g>

        {/* Hit areas. */}
        {Array.from({ length: SIDES }, (_, s) => (
          <g key={s} transform={`rotate(${-90 * s} 300 300)`}>
            {Array.from({ length: PER }, (_, i) => (
              <rect
                key={i}
                x="80"
                y={P(i) - 12}
                width="100"
                height="24"
                fill="transparent"
                onMouseEnter={() => {
                  hovering.current = true;
                  setActive(s * PER + i);
                }}
                onMouseLeave={() => (hovering.current = false)}
              />
            ))}
          </g>
        ))}
      </motion.svg>
    </div>
  );
}
