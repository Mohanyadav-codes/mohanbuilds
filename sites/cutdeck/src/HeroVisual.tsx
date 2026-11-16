import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const CLIPS = [
  { bg: "radial-gradient(120% 80% at 30% 20%, #3b2a8f, #120d2e 60%, #07060f)", cap: ["NO", "WAY"], hl: "#FFE135", font: "Archivo Black" },
  { bg: "radial-gradient(120% 90% at 50% 10%, #ffb547, #c2471f 45%, #1d0b06)", cap: ["$10,000", "CHALLENGE"], hl: "#FF5A4E", font: "Anton" },
  { bg: "radial-gradient(120% 80% at 40% 30%, #0f6b6b, #08231f 60%, #040a09)", cap: ["CLUTCH", "1V4"], hl: "#5CFF8A", font: "Bangers" },
  { bg: "radial-gradient(120% 80% at 70% 30%, #a0442a, #2b1410 60%, #0c0706)", cap: ["HE SAID", "WHAT"], hl: "#3CF0FF", font: "Bungee" },
  { bg: "radial-gradient(120% 80% at 60% 25%, #6b2350, #1e0a18 60%, #08040a)", cap: ["WATCH", "THIS"], hl: "#FFE135", font: "Archivo Black" },
];

/** A long video's timeline gets sliced; the slices fly up into a fanned deck. */
export function HeroVisual() {
  const [phase, setPhase] = useState<"timeline" | "cut" | "deck">("timeline");
  const [loop, setLoop] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("cut"), 1400);
    const t2 = setTimeout(() => setPhase("deck"), 2300);
    const t3 = setTimeout(() => {
      setPhase("timeline");
      setLoop((l) => l + 1);
    }, 9000);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [loop]);

  const cuts = [0.12, 0.31, 0.47, 0.66, 0.83];
  return (
    <div className="relative mx-auto h-[460px] w-full max-w-[760px]">
      {/* Timeline of the long video. */}
      <motion.div
        className="absolute inset-x-6 bottom-6 h-[78px] overflow-hidden rounded-2xl border border-white/10 bg-ink-850"
        animate={{ opacity: phase === "deck" ? 0.35 : 1, y: phase === "deck" ? 10 : 0 }}
      >
        <div className="absolute inset-x-0 top-0 flex h-[46px] gap-px opacity-80">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="flex-1" style={{ background: CLIPS[i % 5].bg }} />
          ))}
        </div>
        <div className="absolute inset-x-3 bottom-2 flex h-[22px] items-center gap-[2px]">
          {Array.from({ length: 120 }).map((_, i) => (
            <span key={i} className="flex-1 rounded-full bg-white/30" style={{ height: `${20 + Math.abs(Math.sin(i * 0.7) * 60 + Math.sin(i * 0.23) * 20)}%` }} />
          ))}
        </div>
        {/* Playhead scanning. */}
        <motion.div
          key={`ph-${loop}`}
          className="absolute inset-y-0 w-[2px] bg-amber shadow-[0_0_12px_#FFB547]"
          initial={{ left: "0%" }}
          animate={{ left: "100%" }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
        <AnimatePresence>
          {phase !== "timeline" &&
            cuts.map((c, i) => (
              <motion.div
                key={`${loop}-${i}`}
                className="absolute inset-y-0 w-[7%] rounded-md border-2 border-coral bg-coral/25"
                style={{ left: `${c * 100 - 3}%` }}
                initial={{ opacity: 0, scaleY: 0.4 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.08 }}
              />
            ))}
        </AnimatePresence>
        <div className="absolute right-3 top-2 rounded bg-black/60 px-1.5 font-mono text-[10px] text-white/80">2:41:07</div>
      </motion.div>

      {/* The deck. */}
      <div className="absolute inset-x-0 top-0 h-[360px]">
        {CLIPS.map((c, i) => {
          const off = i - 2;
          const inDeck = phase === "deck";
          return (
            <motion.div
              key={`${loop}-${i}`}
              className="absolute left-1/2 top-1/2 h-[300px] w-[169px] overflow-hidden rounded-[22px] border border-white/15 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]"
              style={{ background: c.bg, marginLeft: -84, marginTop: -150, zIndex: 10 - Math.abs(off) }}
              initial={{ opacity: 0, x: (cuts[i] - 0.5) * 640, y: 260, scale: 0.18, rotate: 0 }}
              animate={
                phase === "timeline"
                  ? { opacity: 0, x: (cuts[i] - 0.5) * 640, y: 260, scale: 0.18 }
                  : { opacity: 1, x: inDeck ? off * 118 : (cuts[i] - 0.5) * 640, y: inDeck ? Math.abs(off) * 20 : 200, scale: inDeck ? 1 - Math.abs(off) * 0.05 : 0.3, rotate: inDeck ? off * 9 : 0 }
              }
              transition={{ type: "spring", stiffness: 110, damping: 16, delay: inDeck ? Math.abs(off) * 0.06 : i * 0.06 }}
            >
              <div className="absolute left-1/2 top-[30%] h-24 w-24 -translate-x-1/2 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute inset-x-2 top-[64%] text-center leading-none" style={{ fontFamily: `"${c.font}"`, fontSize: 25, WebkitTextStroke: "1.6px black", paintOrder: "stroke fill" }}>
                <span className="text-white">{c.cap[0]} </span>
                <span style={{ color: c.hl }}>{c.cap[1]}</span>
              </div>
              <div className="absolute inset-x-3 bottom-3 h-1 overflow-hidden rounded-full bg-white/20">
                <motion.div className="h-full bg-white" initial={{ width: 0 }} animate={{ width: inDeck ? "100%" : 0 }} transition={{ duration: 6, ease: "linear" }} />
              </div>
              <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-0.5 font-mono text-[10px] text-white">{[94, 91, 89, 87, 84][i]}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
