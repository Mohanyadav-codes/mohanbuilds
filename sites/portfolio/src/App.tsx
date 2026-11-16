import { motion, useScroll, useSpring } from "motion/react";
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

function TopBar() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${solid ? "bg-night/75 backdrop-blur-xl" : ""}`}>
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:px-12">
        <a href="#top" className="group flex items-center gap-3">
          <BatLogo className="h-4 w-9 text-signal transition-transform duration-500 group-hover:scale-110" />
          <span className="font-display text-[15px] font-bold uppercase tracking-[0.16em]">Mohan Builds</span>
        </a>
        <nav className="hidden items-center gap-8 font-mono text-[11.5px] uppercase tracking-[0.2em] text-mute md:flex">
          {SECTIONS.slice(1, 4).map((s) => (
            <a key={s.id} href={`#${s.id}`} className="transition hover:text-signal">{s.label}</a>
          ))}
          <a href="#signal" className="rounded-full border border-signal/40 px-4 py-2 text-signal transition hover:bg-signal hover:text-black">Signal me</a>
        </nav>
      </div>
    </header>
  );
}

/** Right-edge indicator of where you are on the page. */
function Hud() {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
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
  return (
    <div className="fixed right-3 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex">
      <div className="absolute right-[5px] top-0 h-full w-px bg-white/10">
        <motion.div className="w-full origin-top bg-signal" style={{ scaleY: p, height: "100%" }} />
      </div>
      {SECTIONS.map((s) => (
        <a key={s.id} href={`#${s.id}`} className="group relative flex items-center gap-3">
          <span className={`font-mono text-[10px] uppercase tracking-[0.2em] transition ${active === s.id ? "text-signal" : "text-mute"} opacity-0 group-hover:opacity-100`}>{s.label}</span>
          <span className={`relative h-[11px] w-[11px] rounded-full border transition ${active === s.id ? "border-signal bg-signal" : "border-white/30 bg-night"}`} />
        </a>
      ))}
    </div>
  );
}

export function App() {
  return (
    <>
      <TopBar />
      <Hud />
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
