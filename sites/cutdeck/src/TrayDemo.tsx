import { AnimatePresence, motion } from "motion/react";
import { Check, Link2, X } from "lucide-react";
import { useEffect, useState } from "react";

type Step = "idle" | "paste" | "working" | "deck" | "keep" | "skip" | "kept";
const SEQ: [Step, number][] = [
  ["idle", 1200],
  ["paste", 1800],
  ["working", 2600],
  ["deck", 1400],
  ["keep", 1100],
  ["skip", 1100],
  ["kept", 2200],
];
const LABEL: Record<Step, string> = {
  idle: "The button waits in your screen corner",
  paste: "Click it and paste a YouTube link",
  working: "It listens and finds the moments",
  deck: "Clips fan out as cards",
  keep: "Flick right to keep",
  skip: "Flick left to skip",
  kept: "Kept clips export and wait beside the button",
};

const CARDS = ["#3b2a8f", "#c2471f", "#0f6b6b"];

export function TrayDemo() {
  const [i, setI] = useState(0);
  const [prog, setProg] = useState(0);
  const step = SEQ[i][0];
  useEffect(() => {
    const t = setTimeout(() => setI((x) => (x + 1) % SEQ.length), SEQ[i][1]);
    return () => clearTimeout(t);
  }, [i]);
  useEffect(() => {
    if (step !== "working") return;
    setProg(0);
    const id = setInterval(() => setProg((p) => Math.min(1, p + 0.05)), 110);
    return () => clearInterval(id);
  }, [step]);

  const deckIdx = ["deck", "keep", "skip"].includes(step);
  const r = 26;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-[#1a1a24] to-[#0b0b10] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]">
        {/* A browser window behind, to sell "it lives on your desktop". */}
        <div className="absolute left-[6%] top-[8%] h-[64%] w-[62%] rounded-xl border border-white/[0.06] bg-white/[0.025]">
          <div className="flex h-7 items-center gap-1.5 border-b border-white/[0.05] px-3">
            {[0, 1, 2].map((k) => <span key={k} className="h-2 w-2 rounded-full bg-white/15" />)}
            <span className="ml-3 h-3 w-40 rounded bg-white/[0.06]" />
          </div>
          <div className="m-4 aspect-video w-[70%] rounded-lg bg-gradient-to-br from-[#3a1f1a] to-[#120a08]" />
        </div>

        {/* Link bubble. */}
        <AnimatePresence>
          {step === "paste" && (
            <motion.div initial={{ opacity: 0, y: 14, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute bottom-[20%] right-[4%] w-[48%] rounded-2xl border border-white/10 bg-ink-850/95 p-3 shadow-2xl">
              <div className="mb-2 text-[12px] font-semibold">Clip a video</div>
              <div className="flex items-center gap-2 rounded-lg border border-coral/40 bg-black/40 px-2.5 py-2 font-mono text-[10.5px] text-mute">
                <Link2 size={12} className="text-coral" />
                <motion.span initial={{ width: 0 }} animate={{ width: "auto" }} transition={{ duration: 0.8 }} className="overflow-hidden whitespace-nowrap">
                  youtube.com/watch?v=stream
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card deck. */}
        <AnimatePresence>
          {deckIdx && (
            <motion.div initial={{ opacity: 0, x: 30, y: 30, scale: 0.8 }} animate={{ opacity: 1, x: 0, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="absolute bottom-[20%] right-[16%] h-[58%] aspect-[9/16]">
              {CARDS.slice().reverse().map((col, ri) => {
                const k = CARDS.length - 1 - ri;
                const gone = (k === 0 && (step === "keep" || step === "skip")) || (k === 1 && step === "skip");
                const dir = k === 0 ? 1 : -1;
                const front = step === "skip" ? k === 1 : k === 0;
                return (
                  <motion.div
                    key={col}
                    className="absolute inset-0 overflow-hidden rounded-xl border border-white/15 shadow-xl"
                    style={{ background: `radial-gradient(120% 80% at 40% 20%, ${col}, #0a0a10 80%)`, zIndex: 10 - k }}
                    animate={gone ? { x: dir * 260, rotate: dir * 24, opacity: 0 } : { x: front ? 0 : (k - (step === "skip" ? 1 : 0)) * 8, rotate: front ? 0 : (k - (step === "skip" ? 1 : 0)) * 5, opacity: 1 }}
                    transition={{ duration: gone ? 0.55 : 0.4, ease: [0.3, 0, 0.4, 1] }}
                  >
                    <div className="absolute inset-x-1 top-[62%] text-center font-display text-[11px] font-extrabold uppercase text-white" style={{ WebkitTextStroke: "0.5px black" }}>
                      {["Insane", "No way", "Watch"][k]}
                    </div>
                    {front && step === "keep" && <div className="absolute left-2 top-3 -rotate-12 rounded border-2 border-mint px-1 font-display text-[11px] font-extrabold text-mint">KEEP</div>}
                    {front && step === "skip" && <div className="absolute right-2 top-3 rotate-12 rounded border-2 border-white/80 px-1 font-display text-[11px] font-extrabold text-white/80">SKIP</div>}
                  </motion.div>
                );
              })}
              <div className="absolute -bottom-9 left-1/2 flex -translate-x-1/2 gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-ink-850 text-mute"><X size={13} /></span>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-coral text-white"><Check size={14} /></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kept stack. */}
        <AnimatePresence>
          {(step === "kept" || step === "skip") && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="absolute bottom-[4.5%] right-[12%] flex gap-1">
              <div className="h-10 w-6 rounded-md border border-white/20" style={{ background: `radial-gradient(120% 80% at 40% 20%, ${CARDS[0]}, #0a0a10 80%)` }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* The pill. */}
        <motion.div className="absolute bottom-[4%] right-[3%] grid h-[60px] w-[60px] place-items-center rounded-full bg-gradient-to-b from-[#ff6d62] to-coral shadow-[0_10px_40px_-6px_rgba(255,90,78,0.8)]" animate={{ scale: step === "paste" ? 0.94 : 1 }}>
          {step === "working" ? (
            <>
              <svg width={60} height={60} className="absolute inset-0 -rotate-90">
                <circle cx={30} cy={30} r={r} stroke="rgba(255,255,255,0.25)" strokeWidth={4} fill="none" />
                <circle cx={30} cy={30} r={r} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - prog)} />
              </svg>
              <span className="font-mono text-[11px] font-bold text-white">{Math.round(prog * 100)}</span>
            </>
          ) : (
            <img src="/icon.png" alt="" className="h-9 w-9 rounded-lg" />
          )}
        </motion.div>
      </div>
      <div className="mt-5 flex items-center justify-center gap-3">
        {SEQ.map(([s], k) => (
          <span key={s} className={`h-1.5 rounded-full transition-all duration-300 ${k === i ? "w-6 bg-coral" : "w-1.5 bg-white/20"}`} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-3 text-center font-display text-[18px] font-semibold">
          {LABEL[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
