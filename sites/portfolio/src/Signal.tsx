import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Copy, Mail, Play } from "lucide-react";
import { useState } from "react";
import { person } from "@shared/content";
import { BatLogo } from "./BatLogo";
import { Rain, Skyline } from "./Gotham";

/** Off duty: the human side, as a dossier card with a record spinning. */
export function OffDuty() {
  const facts = [
    { k: "Base", v: person.city },
    { k: "Training", v: "B.Tech, 3rd year · DTU" },
    { k: "Currently shipping", v: "Arclor and Cutdeck" },
    { k: "Side mission", v: "Freelance builds and videos" },
  ];
  return (
    <section id="off-duty" className="relative mx-auto max-w-[1400px] px-6 py-28 md:px-12">
      <div className="grid items-center gap-14 md:grid-cols-[1.05fr_1fr]">
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
            By day a student in Delhi. By night I ship <span className="text-signal">AI tools</span>, then film how I built them.
            <span className="text-mute"> A little music on in the background, always.</span>
          </motion.p>
          <motion.a
            href="https://www.youtube.com/@Mohan.Builds"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group mt-10 inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-2 pr-6 transition hover:border-[#ff3b3b]/50 hover:bg-[#ff3b3b]/[0.06]"
          >
            <span className="grid h-12 w-16 place-items-center rounded-xl bg-[#ff2d2d] shadow-[0_8px_30px_-8px_rgba(255,45,45,0.8)]">
              <Play size={20} className="fill-white text-white transition-transform group-hover:scale-110" />
            </span>
            <span>
              <span className="block font-display text-[17px] font-semibold">Watch the builds</span>
              <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-steel">YouTube · @Mohan.Builds</span>
            </span>
            <ArrowUpRight size={18} className="ml-2 text-steel transition group-hover:text-paper" />
          </motion.a>
        </div>

        {/* Dossier. */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: 1.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-b from-[#0d111c] to-[#070910] p-7 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-signal/10 blur-3xl" />
          <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.25em]">
            <span className="text-signal">Dossier · M. Yadav</span>
            <span className="rounded border border-white/15 px-2 py-0.5 text-steel">Civilian ID</span>
          </div>

          <div className="mt-6 flex flex-col">
            {facts.map((f, i) => (
              <motion.div
                key={f.k}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-baseline justify-between gap-6 border-b border-white/[0.07] py-3.5"
              >
                <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-steel">{f.k}</span>
                <span className="text-right text-[16px] font-medium text-paper">{f.v}</span>
              </motion.div>
            ))}
          </div>

          {/* Record player. */}
          <div className="mt-7 flex items-center gap-5 rounded-2xl border border-white/[0.07] bg-black/30 p-4">
            <motion.div
              className="relative h-16 w-16 shrink-0 rounded-full"
              style={{ background: "repeating-radial-gradient(circle, #111 0 2px, #1b1b1f 2px 4px)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-[34%] rounded-full bg-signal">
                <div className="absolute inset-[38%] rounded-full bg-black" />
              </div>
              <div className="absolute left-1/2 top-1 h-2 w-px bg-white/20" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-steel">On repeat while building</div>
              <div className="mt-1 font-display text-[16px] font-semibold">Whatever fits the build</div>
              <div className="mt-2 flex h-5 items-end gap-[3px]">
                {Array.from({ length: 28 }).map((_, b) => (
                  <motion.span
                    key={b}
                    className="w-[3px] rounded-full bg-signal/75"
                    animate={{ height: [3, 6 + ((b * 7) % 14), 4, 3 + ((b * 5) % 16), 3] }}
                    transition={{ duration: 1.1 + (b % 5) * 0.12, repeat: Infinity, ease: "easeInOut" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
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
              style={{ background: "linear-gradient(to top, rgba(255,40,40,0.35), rgba(255,40,40,0.04) 80%)", clipPath: "polygon(47% 100%, 53% 100%, 100% 0, 0 0)", filter: "blur(8px)" }}
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
          className={`group relative mt-14 cursor-pointer rounded-full transition-shadow duration-700 ${lit ? "shadow-[0_0_120px_30px_rgba(229,20,27,0.35)]" : ""}`}
          aria-pressed={lit}
          aria-label="Light the signal"
        >
          <BatLogo oval className="w-[min(70vw,300px)]" ovalFill={lit ? "#e5141b" : "#2a2c33"} />
          {!lit && <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.25em] text-mute group-hover:text-signal">Press to light</span>}
        </motion.button>

        <AnimatePresence>
          {lit && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ delay: 0.3 }} className="mt-14 w-full">
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href={`mailto:${person.email}`} className="inline-flex h-14 items-center gap-3 rounded-2xl bg-signal px-7 font-semibold text-white transition hover:brightness-110">
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
                    className="group rounded-2xl border border-white/15 bg-[#0b1020]/80 px-4 py-4 text-left backdrop-blur-sm transition hover:border-signal/50 hover:bg-signal/[0.06]"
                  >
                    <div className="flex items-center justify-between font-display text-[17px] font-semibold">
                      {l.label} <ArrowUpRight size={15} className="text-paper/70 transition group-hover:text-signal" />
                    </div>
                    <div className="mt-1 truncate font-mono text-[12px] text-signal-soft/90">{l.handle}</div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 mt-24">
        <Skyline className="h-[220px] w-full" fill="#03050a" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-between gap-2 px-6 pb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-steel sm:flex-row md:px-12">
          <span>© 2026 Mohan Builds · New Delhi</span>
          <span>A fan-made tribute. The bat belongs to DC.</span>
        </div>
      </div>
    </section>
  );
}
