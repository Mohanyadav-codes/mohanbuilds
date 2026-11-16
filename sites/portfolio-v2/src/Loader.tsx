import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { BAT, BAT_PATH } from "./Bat";

const BOOT = 2300; // ms of power-on test before the dive
const ease = [0.76, 0, 0.24, 1] as const;
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* 44 pins, 11 a side, in a 600-unit box. The first 17 (the AI stack) run lime. */
const legs = Array.from({ length: 44 }, (_, idx) => ({ s: Math.floor(idx / 11), p: 180 + 24 * (idx % 11), idx }));

/**
 * Power-on self test. A chip draws itself, its pins come up and the supply ramps to 3.3 V.
 * Then the bat signal lights on the die and the camera dives through the bat into the page.
 */
export function Loader({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const [phase, setPhase] = useState<"boot" | "dive" | "out">("boot");
  const [prog, setProg] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (reduced()) {
      onReveal();
      onDone();
      return;
    }
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / BOOT);
      setProg(k);
      if (k < 1) raf.current = requestAnimationFrame(tick);
      else setPhase((p) => (p === "boot" ? "dive" : p));
    };
    raf.current = requestAnimationFrame(tick);
    const skip = () => {
      cancelAnimationFrame(raf.current);
      setProg(1);
      setPhase((p) => (p === "boot" ? "dive" : p));
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      html.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === "dive") {
      const t = setTimeout(() => setPhase("out"), 900);
      return () => clearTimeout(t);
    }
    if (phase === "out") {
      document.documentElement.style.overflow = "";
      onReveal();
      const t = setTimeout(onDone, 750);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const volts = (3.3 * (1 - Math.pow(1 - prog, 3))).toFixed(2);
  const lit = prog > 0.84;
  const lines: [number, string, string, boolean?][] = [
    [0.06, "vcc", `${volts} V`],
    [0.24, "git fetch origin", "done"],
    [0.42, "pins", `${String(Math.min(44, Math.round(prog * 64))).padStart(2, "0")}/44`],
    [0.6, "branches", "arclor · cutdeck · ▇▇▇"],
    [0.84, "signal", "lit", true],
  ];
  const diving = phase !== "boot";

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-bg"
      role="status"
      aria-label="Loading"
      animate={{ opacity: phase === "out" ? 0 : 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Board grid. */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px), linear-gradient(#ffffff04 1px, transparent 1px), linear-gradient(90deg, #ffffff04 1px, transparent 1px)",
          backgroundSize: "120px 120px, 120px 120px, 24px 24px, 24px 24px",
        }}
      />

      <motion.div animate={{ opacity: diving ? 0 : 1 }} transition={{ duration: 0.3 }} className="absolute inset-0">
        <div className="absolute inset-4 rounded-xl border border-line md:inset-6" />
        <div className="absolute left-7 right-7 top-7 flex justify-between font-mono text-[11px] text-dim md:left-10 md:right-10 md:top-10">
          <span>
            <span className="text-lime">mohan.builds</span> · power-on self test
          </span>
          <span className="hidden sm:inline">
            <span className="text-sky">HEAD</span> → <span className="text-add">main</span>
          </span>
        </div>

        {/* Self-test log. */}
        <div className="absolute bottom-24 left-7 w-[min(380px,calc(100%-56px))] font-mono text-[12px] leading-[1.95] md:bottom-28 md:left-10">
          {lines.map(([at, k, v, y]) =>
            prog >= at ? (
              <div key={k} className="flex items-baseline gap-2">
                <span className="text-lime">$</span>
                <span className="text-text/90">{k}</span>
                <span className="flex-1 translate-y-[-4px] border-b border-dotted border-white/15" />
                <span style={y ? { color: BAT } : undefined} className={y ? "font-semibold" : "text-mute"}>
                  {v}
                </span>
                <span className="w-6 text-right text-add">ok</span>
              </div>
            ) : null,
          )}
        </div>

        {/* Supply readout. */}
        <div className="absolute right-7 top-16 text-right md:bottom-24 md:right-10 md:top-auto">
          <div className="font-mono text-[11px] text-dim">supply</div>
          <div className="font-mono text-[clamp(56px,10vw,136px)] font-extrabold leading-[0.85] tracking-[-0.07em] tabular-nums">
            {volts}
            <span className="text-lime lime-glow">V</span>
          </div>
        </div>

        {/* Ruler. */}
        <div className="absolute bottom-7 left-7 right-7 md:bottom-10 md:left-10 md:right-10">
          <div className="flex h-3 items-end justify-between">
            {Array.from({ length: 51 }, (_, i) => (
              <span
                key={i}
                className="w-px"
                style={{ height: i % 10 === 0 ? 12 : i % 5 === 0 ? 8 : 5, background: i / 50 <= prog ? "#c8ff3d" : "#ffffff22" }}
              />
            ))}
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[10px] text-dim">
            <span>0</span>
            <span className="hidden sm:inline">press any key to skip</span>
            <span>{Math.round(prog * 100)}%</span>
          </div>
        </div>
      </motion.div>

      {/* The chip. The bat's body sits dead centre, so scaling about the centre flies through it. */}
      <motion.div
        className="absolute left-1/2 top-[44%] h-[min(360px,64vw)] w-[min(360px,64vw)] -translate-x-1/2 -translate-y-1/2"
        animate={diving ? { scale: 260 } : { scale: 1 }}
        transition={diving ? { duration: 0.9, ease: [0.8, 0, 0.9, 0.2] } : { duration: 0 }}
      >
        <svg viewBox="0 0 600 600" className="h-full w-full overflow-visible">
          {legs.map(({ s, p, idx }) => (
            <g key={idx} transform={`rotate(${-90 * s} 300 300)`}>
              <motion.line
                x1="130"
                x2="-760"
                y1={p}
                y2={p}
                stroke={idx < 17 ? "#c8ff3d" : "#ecebe4"}
                strokeWidth="1.6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: idx < 17 ? 0.55 : 0.12 }}
                transition={{ delay: 0.6 + idx * 0.016, duration: 1.2, ease: "easeOut" }}
              />
              <motion.rect
                x="104"
                y={p - 5}
                width="26"
                height="10"
                rx="1"
                fill={idx < 17 ? "#c8ff3d" : "#8a887f"}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                style={{ transformOrigin: "130px center", transformBox: "fill-box" }}
                transition={{ delay: 0.5 + idx * 0.016, duration: 0.3 }}
              />
            </g>
          ))}
          <motion.rect
            x="130"
            y="130"
            width="340"
            height="340"
            rx="12"
            fill="#141412"
            initial={{ opacity: 0 }}
            animate={{ opacity: prog > 0.66 ? 1 : 0 }}
            transition={{ duration: 0.35 }}
          />
          <motion.path
            d="M142,130 H458 Q470,130 470,142 V458 Q470,470 458,470 H142 Q130,470 130,458 V142 Q130,130 142,130 Z"
            fill="none"
            stroke="#ecebe4"
            strokeOpacity="0.85"
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.95, ease }}
          />
          <motion.circle cx="156" cy="156" r="7" fill="#c8ff3d" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.85, type: "spring" }} />
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: prog > 0.72 ? 1 : 0 }} fontFamily="JetBrains Mono Variable, monospace" textAnchor="middle">
            <text x="300" y="200" fontSize="13" letterSpacing="4" fill="#ecebe480">
              MOHAN YADAV
            </text>
            <text x="300" y="428" fontSize="26" fontWeight="800" letterSpacing="-1" fill="#ecebe4">
              MY-2026
            </text>
          </motion.g>
          {/* The signal on the die. */}
          <motion.g
            initial={{ opacity: 0, scale: 0.6 }}
            animate={lit ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            style={{ transformOrigin: "300px 300px" }}
          >
            <ellipse cx="300" cy="300" rx="128" ry="82" fill={BAT} opacity="0.18" filter="blur(14px)" />
            <g transform="translate(300 300) scale(0.98) translate(-100 -56)">
              <ellipse cx="100" cy="53" rx="112" ry="72" fill={BAT} stroke="#0b0b0a" strokeWidth="5" />
              <path d={BAT_PATH} fill="#0b0b0a" transform="translate(100 53) scale(0.86) translate(-100 -53)" />
            </g>
          </motion.g>
        </svg>
      </motion.div>
    </motion.div>
  );
}
