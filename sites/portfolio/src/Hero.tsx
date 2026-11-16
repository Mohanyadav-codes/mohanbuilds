import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { person } from "@shared/content";
import { BatLogo } from "./BatLogo";
import { Clouds, Rain, SignalBeam, Skyline } from "./Gotham";
import { Portrait } from "./Portrait";
import { PortraitPhoto } from "./PortraitPhoto";

function Word({ text, delay, align }: { text: string; delay: number; align: "left" | "right" }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "left" ? -60 : 60, filter: "blur(12px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className={`font-gotham font-black uppercase leading-[0.82] tracking-[0.02em] text-[clamp(84px,10.5vw,190px)] px-[0.06em] text-center ${align === "left" ? "md:text-right" : "md:text-left"}`}
      style={{ color: "transparent", backgroundImage: "linear-gradient(180deg, #ffffff 0%, #d9dde6 34%, #8a92a5 50%, #c9ced9 62%, rgba(150,160,180,0.2) 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.65))" }}
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
  // The half-and-half photo when it is in /public, the drawing otherwise.
  const [mode, setMode] = useState<"wait" | "photo" | "svg">("wait");
  useEffect(() => {
    const i = new Image();
    i.onload = () => setMode("photo");
    i.onerror = () => setMode("svg");
    i.src = PortraitPhoto.src;
  }, []);

  return (
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[720px] overflow-hidden">
      {/* Sky. */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0a1020 0%, #0b1226 38%, #070a14 70%, #05070c 100%)" }} />
      <Clouds />
      <SignalBeam />
      <Skyline className="absolute inset-x-0 bottom-0 h-[42%] w-full opacity-90" fill="#04060c" />
      <Skyline className="absolute inset-x-0 bottom-0 h-[28%] w-full scale-x-[-1]" fill="#020308" />

      {/* Name split around the portrait. */}
      <motion.div style={{ y: textY, opacity: fade }} className="absolute inset-x-0 top-[13%] z-10 grid grid-cols-1 gap-1 px-6 md:top-[26%] md:grid-cols-2 md:gap-[min(28vw,400px)]">
        <Word text="Mohan" delay={0.3} align="left" />
        <Word text="Yadav" delay={0.45} align="right" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-5 text-center md:hidden">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.25em]"><span className="text-signal">By day</span> <span className="text-mute">·</span> <span className="text-gotham">By night</span></div>
          <div className="mt-2 font-display text-[17px] font-semibold leading-snug">{person.role}</div>
          <div className="mt-1 text-[13px] text-mute">{person.study}</div>
        </motion.div>
      </motion.div>

      {mode === "photo" && (
        <motion.div style={{ y: portraitY }} className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-[min(88svh,1000px)] -translate-x-1/2 max-md:h-[62svh]">
          <motion.div
            initial={{ opacity: 0, y: 60, filter: "brightness(0)" }}
            animate={{ opacity: 1, y: 0, filter: "brightness(1)" }}
            transition={{ delay: 0.4, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            <PortraitPhoto />
          </motion.div>
        </motion.div>
      )}
      {mode === "svg" && (
        <motion.div style={{ y: portraitY }} className="absolute bottom-0 left-1/2 z-20 w-[min(78vw,470px)] -translate-x-1/2">
          <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}>
            <Portrait />
          </motion.div>
        </motion.div>
      )}

      <Rain />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-40 bg-gradient-to-t from-night to-transparent" />

      {/* Side captions. */}
      <motion.div style={{ opacity: fade }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="absolute bottom-[12%] left-6 z-30 max-w-[300px] max-md:hidden md:left-12">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-signal">By day</div>
        <div className="font-display text-[22px] font-semibold leading-tight">{person.study}</div>
        <div className="mt-1 text-[14px] text-mute">{person.since}</div>
      </motion.div>
      <motion.div style={{ opacity: fade }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="absolute bottom-[12%] right-6 z-30 max-w-[300px] text-right max-md:hidden md:right-12">
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
