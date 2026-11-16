import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { Arsenal } from "./Arsenal";
import { Batcomputer } from "./Batcomputer";
import { BatLogo } from "./BatLogo";
import { CaseFiles } from "./CaseFiles";
import { Lightning } from "./Gotham";
import { Hero } from "./Hero";
import { CallSignal, OffDuty } from "./Signal";

const SECTIONS = [
  { id: "top", label: "Gotham" },
  { id: "arsenal", label: "Arsenal" },
  { id: "cases", label: "Case files" },
  { id: "computer", label: "Computer" },
  { id: "off-duty", label: "Off duty" },
  { id: "signal", label: "Signal" },
];

/** Tracks which section is in the middle of the screen. */
function useActiveSection() {
  const [active, setActive] = useState("top");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return active;
}

function TopBar({ active }: { active: string }) {
  const [solid, setSolid] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = SECTIONS.slice(1, 5);
  const lit = hover ?? (links.some((l) => l.id === active) ? active : null);
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8"
    >
      <div
        className={`relative mx-auto flex h-14 max-w-[1240px] items-center justify-between rounded-2xl border px-3 pl-4 transition-all duration-500 ${
          solid ? "border-white/10 bg-[#070a12]/80 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl" : "border-transparent bg-transparent"
        }`}
      >
        {/* Signal-yellow edge light along the bottom. */}
        <div className={`pointer-events-none absolute inset-x-10 -bottom-px h-px bg-gradient-to-r from-transparent via-signal/60 to-transparent transition-opacity duration-500 ${solid ? "opacity-100" : "opacity-0"}`} />

        <a href="#top" className="group flex items-center gap-3">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-signal/30 bg-signal/[0.08] shadow-[inset_0_0_14px_rgba(229,20,27,0.15)]">
            <BatLogo className="h-3 w-7 text-signal transition-transform duration-500 group-hover:scale-110" />
          </span>
          <span className="font-gotham text-[19px] font-extrabold uppercase leading-none tracking-[0.12em]">
            Mohan <span className="text-signal">Builds</span>
          </span>
        </a>

        <nav className="hidden items-center md:flex" onMouseLeave={() => setHover(null)}>
          {links.map((s, k) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onMouseEnter={() => setHover(s.id)}
              className={`relative px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${lit === s.id ? "text-paper" : "text-steel"}`}
            >
              {lit === s.id && (
                <motion.span layoutId="nav-lit" className="absolute inset-0 rounded-xl bg-white/[0.06]" transition={{ type: "spring", stiffness: 380, damping: 32 }}>
                  <span className="absolute inset-x-3 -bottom-[9px] h-[2px] rounded-full bg-signal shadow-[0_0_12px_rgba(229,20,27,0.9)]" />
                </motion.span>
              )}
              <span className="relative">
                <span className="mr-1.5 text-signal/70">0{k + 1}</span>
                {s.label}
              </span>
            </a>
          ))}
        </nav>

        <a
          href="#signal"
          className="group relative flex h-10 items-center gap-2.5 overflow-hidden rounded-xl bg-signal px-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_30px_-6px_rgba(229,20,27,0.7)] transition hover:shadow-[0_0_44px_-4px_rgba(229,20,27,0.95)]"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <BatLogo className="relative h-2.5 w-6" />
          <span className="relative">Signal me</span>
        </a>
      </div>
    </motion.header>
  );
}

/** Right-edge depth gauge: a bat descends as you scroll, with tick marks and a live readout. */
function Hud({ active }: { active: string }) {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
  const top = useTransform(p, (v) => `${v * 100}%`);
  const [pct, setPct] = useState(0);
  useEffect(() => p.on("change", (v) => setPct(Math.round(v * 100))), [p]);
  const label = SECTIONS.find((s) => s.id === active)?.label ?? "";
  const H = 300;
  return (
    <div className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-5 lg:flex">
      <div className="relative w-6" style={{ height: H }}>
        {/* Ticks. */}
        {Array.from({ length: 31 }).map((_, k) => (
          <span key={k} className={`absolute right-0 h-px ${k % 5 === 0 ? "w-3 bg-white/35" : "w-1.5 bg-white/15"}`} style={{ top: (k / 30) * H }} />
        ))}
        {/* Track and fill. */}
        <div className="absolute right-[13px] top-0 h-full w-px bg-white/10">
          <motion.div className="w-full origin-top bg-gradient-to-b from-signal/20 to-signal shadow-[0_0_8px_rgba(229,20,27,0.8)]" style={{ scaleY: p, height: "100%" }} />
        </div>
        {/* Section stops. */}
        {SECTIONS.map((s, k) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            title={s.label}
            className={`absolute right-[10px] h-[7px] w-[7px] -translate-y-1/2 rotate-45 border transition ${active === s.id ? "border-signal bg-signal" : "border-white/30 bg-night hover:border-signal"}`}
            style={{ top: (k / (SECTIONS.length - 1)) * H }}
          />
        ))}
        {/* The bat. */}
        <motion.div className="pointer-events-none absolute right-[1px] -translate-y-1/2" style={{ top }}>
          <div className="grid h-6 w-6 place-items-center">
            <BatLogo className="h-2.5 w-6 text-signal drop-shadow-[0_0_8px_rgba(229,20,27,0.9)]" />
          </div>
        </motion.div>
      </div>
  <div className="mr-[7px]">
      {/* Readout. */}
      <div className="flex flex-col items-center font-mono uppercase [writing-mode:vertical-rl]">
        <AnimatePresence mode="wait">
          <motion.span key={label} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="text-[10px] tracking-[0.25em] text-signal">
            {label}
          </motion.span>
        </AnimatePresence>
        <span className="mt-3 text-[10px] tracking-[0.2em] text-steel tabular-nums">Depth {String(pct).padStart(3, "0")}%</span>
      </div>

      </div>
    </div>
  );
}
export function App() {
  const active = useActiveSection();
  return (
    <>
      <TopBar active={active} />
      <Hud active={active} />
      <main>
        <Hero />
        <Arsenal />
        <CaseFiles />
        <Batcomputer />
        <OffDuty />
        <CallSignal />
      </main>
      <Lightning />
      <div className="vignette" />
      <div className="grain" />
    </>
  );
}
