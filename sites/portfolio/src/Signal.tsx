import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { useState } from "react";
import { person } from "@shared/content";
import { BatLogo } from "./BatLogo";
import { Rain, Skyline } from "./Gotham";

/** Off duty: the human side. */
export function OffDuty() {
  const facts = [
    { k: "Base", v: person.city },
    { k: "Training", v: person.study },
    { k: "First line of code", v: "Class 9" },
    { k: "Side mission", v: "Freelance builds and videos" },
  ];
  return (
    <section id="off-duty" className="relative mx-auto max-w-[1400px] px-6 py-28 md:px-12">
      <div className="grid items-center gap-14 md:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-mute">
            <BatLogo className="h-2.5 w-6 text-signal" /> <span className="text-signal">04</span> <span className="h-px w-10 bg-white/15" /> Off duty
          </div>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-[clamp(30px,4vw,54px)] font-semibold leading-[1.08] tracking-[-0.03em]"
          >
            By day a student in Delhi. By night I ship AI tools, then film how I built them.
            <span className="text-mute"> A little music on in the background, always.</span>
          </motion.p>
        </div>
        <div className="flex flex-col gap-3">
          {facts.map((f, i) => (
            <motion.div
              key={f.k}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-baseline justify-between gap-6 border-b hairline pb-3"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">{f.k}</span>
              <span className="text-right text-[16px] text-paper">{f.v}</span>
            </motion.div>
          ))}
          <div className="mt-4 flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">Now playing</span>
            <div className="flex h-6 items-end gap-[3px]">
              {Array.from({ length: 22 }).map((_, b) => (
                <motion.span
                  key={b}
                  className="w-[3px] rounded-full bg-signal/70"
                  animate={{ height: [4, 8 + ((b * 7) % 16), 5, 4 + ((b * 5) % 18), 4] }}
                  transition={{ duration: 1.1 + (b % 5) * 0.12, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Contact: light the signal to reveal the channels. */
export function CallSignal() {
  const [lit, setLit] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(person.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <section id="signal" className="relative overflow-hidden pt-32">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #05070c 0%, #0a1024 55%, #0b1226 100%)" }} />
      {/* The beam, only when lit. */}
      <AnimatePresence>
        {lit && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="pointer-events-none absolute inset-0">
            <motion.div
              className="absolute bottom-[18%] left-1/2 h-[90%] w-[60vw] origin-bottom -translate-x-1/2"
              style={{ background: "linear-gradient(to top, rgba(255,226,122,0.35), rgba(255,226,122,0.04) 80%)", clipPath: "polygon(47% 100%, 53% 100%, 100% 0, 0 0)", filter: "blur(8px)" }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Rain density={0.6} />

      <div className="relative z-10 mx-auto flex max-w-[1100px] flex-col items-center px-6 text-center">
        <div className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-mute">
          <span className="text-signal">05</span> <span className="h-px w-10 bg-white/15" /> Make contact
        </div>
        <h2 className="font-display text-[clamp(48px,8vw,120px)] font-extrabold uppercase leading-[0.88] tracking-[-0.05em]">
          Light the <span className={`transition-all duration-700 ${lit ? "text-signal signal-glow" : "text-paper/40"}`}>signal</span>
        </h2>

        <motion.button
          onClick={() => setLit((l) => !l)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className={`group relative mt-14 cursor-pointer rounded-full transition-shadow duration-700 ${lit ? "shadow-[0_0_120px_30px_rgba(255,210,31,0.35)]" : ""}`}
          aria-pressed={lit}
          aria-label="Light the signal"
        >
          <BatLogo oval className="w-[min(70vw,300px)]" ovalFill={lit ? "#FFD21F" : "#2a2c33"} />
          {!lit && <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.25em] text-mute group-hover:text-signal">Press to light</span>}
        </motion.button>

        <AnimatePresence>
          {lit && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ delay: 0.3 }} className="mt-14 w-full">
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href={`mailto:${person.email}`} className="inline-flex h-14 items-center gap-3 rounded-2xl bg-signal px-7 font-semibold text-black transition hover:brightness-110">
                  <Mail size={18} /> {person.email}
                </a>
                <button onClick={copy} className="inline-flex h-14 cursor-pointer items-center gap-2 rounded-2xl border border-white/15 px-5 text-[14px] text-paper hover:bg-white/[0.06]">
                  {copied ? <Check size={16} className="text-mint" /> : <Copy size={16} />} {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="mx-auto mt-8 grid max-w-[900px] grid-cols-2 gap-3 sm:grid-cols-5">
                {person.links.map((l, i) => (
                  <motion.a
                    key={l.label}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + i * 0.06 }}
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition hover:border-signal/50 hover:bg-signal/[0.06]"
                  >
                    <div className="flex items-center justify-between font-display text-[17px] font-semibold">
                      {l.label} <ArrowUpRight size={15} className="text-mute transition group-hover:text-signal" />
                    </div>
                    <div className="mt-1 truncate font-mono text-[11px] text-dim">{l.handle}</div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 mt-24">
        <Skyline className="h-[220px] w-full" fill="#03050a" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-between gap-2 px-6 pb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-dim sm:flex-row md:px-12">
          <span>© 2026 Mohan Builds · New Delhi</span>
          <span>A fan-made tribute. The bat belongs to DC.</span>
        </div>
      </div>
    </section>
  );
}
