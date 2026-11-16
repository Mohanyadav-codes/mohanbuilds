import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { reduced } from "./lib";

const BOOT = 2100; // ms of power-on test before the zoom
const ease = [0.76, 0, 0.24, 1] as const;

const legs = Array.from({ length: 44 }, (_, idx) => {
  const s = Math.floor(idx / 11);
  const i = idx % 11;
  return { s, i, p: 180 + 24 * i, idx };
});

/**
 * Power-on self test. The chip draws itself, its pins come up, the supply ramps to 3.3 V,
 * then the camera dives into the die and the black splits open onto the page.
 */
export function Loader({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const [phase, setPhase] = useState<"boot" | "zoom" | "split">("boot");
  const [prog, setProg] = useState(0);
  const raf = useRef(0);
  const t0 = useRef(0);

  useEffect(() => {
    if (reduced()) {
      onReveal();
      onDone();
      return;
    }
    const html = document.documentElement;
    html.style.overflow = "hidden";
    t0.current = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0.current) / BOOT);
      setProg(k);
      if (k < 1) raf.current = requestAnimationFrame(tick);
      else setPhase((p) => (p === "boot" ? "zoom" : p));
    };
    raf.current = requestAnimationFrame(tick);
    const skip = () => {
      cancelAnimationFrame(raf.current);
      setProg(1);
      setPhase((p) => (p === "boot" ? "zoom" : p));
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
    if (phase === "zoom") {
      const t = setTimeout(() => setPhase("split"), 560);
      return () => clearTimeout(t);
    }
    if (phase === "split") {
      document.documentElement.style.overflow = "";
      onReveal();
      const t = setTimeout(onDone, 1000);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const volts = (3.3 * (1 - Math.pow(1 - prog, 3))).toFixed(2);
  const lines: [number, string, string][] = [
    [0.08, "VCC", `${volts} V`],
    [0.3, "CLOCK", "32.768 kHz · IST"],
    [0.5, "PINOUT", `${String(Math.min(44, Math.round(prog * 60))).padStart(2, "0")}/44`],
    [0.7, "DEVICES", "ARCLOR · CUTDECK · ▇▇▇"],
    [0.9, "STATUS", "MY-2026 READY"],
  ];
  const cover = typeof window === "undefined" ? 20 : (Math.hypot(window.innerWidth, window.innerHeight) / Math.min(170, window.innerWidth * 0.31)) * 1.15;

  return (
    <div className="fixed inset-0 z-[100]" aria-label="Loading" role="status">
      {phase !== "split" && (
        <div className="paper absolute inset-0 overflow-hidden">
          {/* Sheet frame. */}
          <div className="absolute inset-4 border border-ink/25 md:inset-6" />
          <div className="absolute left-7 right-7 top-7 flex justify-between font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/70 md:left-10 md:right-10 md:top-10">
            <span>Mohan Builds · Power-on self test</span>
            <span className="hidden sm:inline">Sheet 1 of 6 · Rev 3.0</span>
          </div>

          {/* The chip. */}
          <div className="absolute left-1/2 top-[44%] h-[min(340px,62vw)] w-[min(340px,62vw)] -translate-x-1/2 -translate-y-1/2">
            <svg viewBox="0 0 600 600" className="h-full w-full overflow-visible">
              {legs.map(({ s, p, idx }) => (
                <g key={idx} transform={`rotate(${-90 * s} 300 300)`}>
                  <motion.line
                    x1="150"
                    x2="-700"
                    y1={p}
                    y2={p}
                    stroke={idx < 17 ? "#ff4d00" : "#121211"}
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: idx < 17 ? 0.9 : 0.35 }}
                    transition={{ delay: 0.55 + idx * 0.018, duration: 1.1, ease: "easeOut" }}
                  />
                  <motion.rect
                    x="126"
                    y={p - 5}
                    width="24"
                    height="10"
                    fill="#121211"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    style={{ transformOrigin: "150px center", transformBox: "fill-box" }}
                    transition={{ delay: 0.45 + idx * 0.018, duration: 0.3 }}
                  />
                </g>
              ))}
              <motion.rect
                x="150"
                y="150"
                width="300"
                height="300"
                rx="9"
                fill="#121211"
                initial={{ opacity: 0 }}
                animate={{ opacity: prog > 0.72 ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.path
                d="M159,150 H441 Q450,150 450,159 V441 Q450,450 441,450 H159 Q150,450 150,441 V159 Q150,150 159,150 Z"
                fill="none"
                stroke="#121211"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease }}
              />
              <motion.circle cx="178" cy="178" r="7" fill="#ff4d00" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring" }} />
              <motion.text
                x="300"
                y="318"
                textAnchor="middle"
                fontFamily="Archivo Variable, sans-serif"
                fontSize="56"
                fontWeight="850"
                style={{ fontStretch: "62%" }}
                fill="#ebeae3"
                initial={{ opacity: 0 }}
                animate={{ opacity: prog > 0.82 ? 1 : 0 }}
              >
                MY-2026
              </motion.text>
            </svg>
          </div>

          {/* Self-test log. */}
          <div className="absolute bottom-20 left-7 w-[min(360px,calc(100%-56px))] font-mono text-[11.5px] leading-[1.9] md:bottom-24 md:left-10">
            {lines.map(([at, k, v]) =>
              prog >= at ? (
                <div key={k} className="flex items-baseline gap-2">
                  <span className="text-ink/45">&gt;</span>
                  <span className="text-ink">{k}</span>
                  <span className="leader" />
                  <span className={k === "STATUS" ? "font-semibold text-sig" : "text-ink/80"}>{v}</span>
                  <span className="w-6 text-right text-ink/45">ok</span>
                </div>
              ) : null,
            )}
          </div>

          {/* Supply readout. */}
          <div className="absolute bottom-16 right-7 text-right md:bottom-20 md:right-10">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/55">Supply</div>
            <div className="w-cond text-[clamp(64px,11vw,148px)] font-[850] leading-[0.85] tracking-[-0.02em] tabular-nums">
              {volts}
              <span className="text-sig">V</span>
            </div>
          </div>

          {/* Ruler progress. */}
          <div className="absolute bottom-7 left-7 right-7 md:bottom-10 md:left-10 md:right-10">
            <div className="flex h-3 items-end justify-between">
              {Array.from({ length: 51 }, (_, i) => (
                <span
                  key={i}
                  className="w-px"
                  style={{
                    height: i % 10 === 0 ? 12 : i % 5 === 0 ? 8 : 5,
                    background: i / 50 <= prog ? "#ff4d00" : "#12121140",
                  }}
                />
              ))}
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[9.5px] text-ink/50">
              <span>0</span>
              <span className="hidden sm:inline">press any key to skip</span>
              <span>{Math.round(prog * 100)}%</span>
            </div>
          </div>

          {/* Dive into the die. */}
          <AnimatePresence>
            {phase === "zoom" && (
              <motion.div
                className="absolute left-1/2 top-[44%] h-[min(170px,31vw)] w-[min(170px,31vw)] -translate-x-1/2 -translate-y-1/2 rounded-[4px] bg-ink"
                initial={{ scale: 1 }}
                animate={{ scale: cover }}
                transition={{ duration: 0.56, ease: [0.7, 0, 0.84, 0] }}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Black splits open onto the page. */}
      {phase === "split" && (
        <>
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-ink"
            initial={{ y: 0 }}
            animate={{ y: "-101%" }}
            transition={{ duration: 0.9, ease, delay: 0.12 }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
            initial={{ y: 0 }}
            animate={{ y: "101%" }}
            transition={{ duration: 0.9, ease, delay: 0.12 }}
          />
          <motion.div
            className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-sig"
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0] }}
            transition={{ duration: 0.7, times: [0, 0.35, 1] }}
          />
        </>
      )}
    </div>
  );
}
