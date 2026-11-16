import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { tracks } from "@shared/content";
import { BatLogo } from "./BatLogo";
import { SceneHead } from "./SceneHead";

/** Text that types itself out once visible. */
function TypeLine({ text, start }: { text: string; start: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    setN(0);
    const id = setInterval(() => setN((x) => (x >= text.length ? x : x + 1)), 18);
    return () => clearInterval(id);
  }, [text, start]);
  return (
    <span>
      {text.slice(0, n)}
      {n < text.length && <span className="animate-pulse">▌</span>}
    </span>
  );
}

export function Batcomputer() {
  const ai = tracks.find((t) => t.highlight)!;
  const rest = tracks.filter((t) => !t.highlight);
  const [active, setActive] = useState(ai.id);
  const [seen, setSeen] = useState(false);
  const cur = tracks.find((t) => t.id === active)!;

  return (
    <section id="computer" className="relative mx-auto max-w-[1400px] px-6 py-32 md:px-12 md:py-40">
      <SceneHead n="03" label="The Computer" title={<>Systems <span className="text-signal signal-glow">online</span></>}>
        Everything in the kit. AI is the main weapon; the rest is how it reaches people.
      </SceneHead>

      <motion.div
        onViewportEnter={() => setSeen(true)}
        viewport={{ once: true, margin: "-120px" }}
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[28px] border border-gotham/20 bg-[#04070f] shadow-[0_0_120px_-30px_rgba(125,149,255,0.45)]"
      >
        {/* Scanlines and sweep. */}
        <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: "repeating-linear-gradient(0deg, rgba(125,149,255,0.05) 0 1px, transparent 1px 3px)" }} />
        <motion.div className="pointer-events-none absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-gotham/[0.07] to-transparent" animate={{ y: ["-40%", "700%"] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />

        <div className="flex items-center justify-between border-b border-gotham/15 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-gotham/80">
          <span className="flex items-center gap-2">
            <BatLogo className="h-2.5 w-6 text-gotham" /> Mohan OS · Arsenal index
          </span>
          <span className="flex items-center gap-2">
            <motion.span className="h-1.5 w-1.5 rounded-full bg-mint" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} /> All systems online
          </span>
        </div>

        <div className="grid md:grid-cols-[260px_1fr]">
          {/* Module list. */}
          <div className="flex gap-2 overflow-x-auto border-b border-gotham/15 p-4 md:flex-col md:border-b-0 md:border-r">
            {tracks.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`group flex shrink-0 cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-3 text-left font-mono text-[12.5px] uppercase tracking-[0.14em] transition ${
                  active === t.id ? (t.highlight ? "bg-signal text-white" : "bg-gotham/15 text-paper") : "text-steel hover:bg-white/[0.04] hover:text-paper"
                }`}
              >
                <span>
                  <span className="opacity-60">{t.id}</span> {t.label}
                </span>
                <span className="opacity-60">{t.tools.length}</span>
              </button>
            ))}
            <div className="mt-auto hidden p-4 font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.18em] text-dim md:block">
              {rest.reduce((n, t) => n + t.tools.length, ai.tools.length)} systems loaded
            </div>
          </div>

          {/* Readout. */}
          <div className="relative min-h-[460px] p-6 md:p-10">
            <div className="mb-6 font-mono text-[12px] uppercase tracking-[0.2em] text-gotham">
              <TypeLine text={`> load ${cur.label.toLowerCase().replace(/ & /g, "-")} --all`} start={seen} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={cur.id} className="flex flex-wrap gap-3" initial="h" animate="s" exit="h" variants={{ s: { transition: { staggerChildren: 0.035 } } }}>
                {cur.tools.map((tool, k) => (
                  <motion.span
                    key={tool}
                    variants={{ h: { opacity: 0, y: 12, filter: "blur(6px)" }, s: { opacity: 1, y: 0, filter: "blur(0px)" } }}
                    whileHover={{ y: -3 }}
                    className={`rounded-xl border px-4 py-2.5 font-display font-semibold tracking-tight ${
                      cur.highlight
                        ? k < 6
                          ? "border-signal/50 bg-signal/10 text-[22px] text-signal-soft md:text-[26px]"
                          : "border-signal/25 bg-signal/[0.04] text-[17px] text-paper"
                        : "border-gotham/25 bg-gotham/[0.06] text-[18px] text-paper"
                    }`}
                  >
                    {tool}
                  </motion.span>
                ))}
              </motion.div>
            </AnimatePresence>
            {cur.highlight && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-10 max-w-[520px] font-mono text-[12.5px] leading-relaxed text-steel">
                // Priority module. Agents that plan and act, retrieval that finds the right context, models that see and listen.
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
