import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { person } from "@shared/content";
import { BatLogo } from "./BatLogo";
import { Clouds, Rain, SignalBeam, Skyline } from "./Gotham";
import { Portrait } from "./Portrait";

function Word({ text, delay, align }: { text: string; delay: number; align: "left" | "right" }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "left" ? -60 : 60, filter: "blur(12px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className={`font-display font-extrabold uppercase leading-[0.8] tracking-[-0.05em] text-[clamp(52px,9.4vw,170px)] ${align === "left" ? "text-right" : "text-left"}`}
      style={{ WebkitTextStroke: "1px rgba(244,239,231,0.12)", color: "transparent", backgroundImage: "linear-gradient(180deg, #f4efe7 20%, rgba(244,239,231,0.15) 95%)", WebkitBackgroundClip: "text", backgroundClip: "text" }}
    >
      {text}
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const fade = useTransform(scrollYProgress, [0.5, 1], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[720px] overflow-hidden">
      {/* Sky. */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0a1020 0%, #0b1226 38%, #070a14 70%, #05070c 100%)" }} />
      <Clouds />
      <SignalBeam />
      <Skyline className="absolute inset-x-0 bottom-0 h-[42%] w-full opacity-90" fill="#04060c" />
      <Skyline className="absolute inset-x-0 bottom-0 h-[28%] w-full scale-x-[-1]" fill="#020308" />

      {/* Name split around the portrait. */}
      <motion.div style={{ y: textY, opacity: fade }} className="absolute inset-x-0 top-[26%] z-10 grid grid-cols-2 gap-[min(30vw,420px)] px-6">
        <Word text="Mohan" delay={0.3} align="left" />
        <Word text="Yadav" delay={0.45} align="right" />
      </motion.div>

      <motion.div style={{ y: portraitY }} className="absolute bottom-0 left-1/2 z-20 w-[min(78vw,470px)] -translate-x-1/2">
        <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}>
          <Portrait />
        </motion.div>
      </motion.div>

      <Rain />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-40 bg-gradient-to-t from-night to-transparent" />

      {/* Side captions. */}
      <motion.div style={{ opacity: fade }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="absolute bottom-[12%] left-6 z-30 max-w-[300px] md:left-12">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-signal">By day</div>
        <div className="font-display text-[22px] font-semibold leading-tight">{person.study}</div>
        <div className="mt-1 text-[14px] text-mute">{person.since}</div>
      </motion.div>
      <motion.div style={{ opacity: fade }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="absolute bottom-[12%] right-6 z-30 max-w-[300px] text-right md:right-12">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-gotham">By night</div>
        <div className="font-display text-[22px] font-semibold leading-tight">{person.role}</div>
        <div className="mt-1 text-[14px] text-mute">Agents, RAG, vision, desktop apps</div>
      </motion.div>

      <motion.a
        href="#arsenal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.3em] text-mute hover:text-signal"
      >
        <BatLogo className="h-3 w-7" />
        <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>Descend</motion.span>
      </motion.a>
    </section>
  );
}
