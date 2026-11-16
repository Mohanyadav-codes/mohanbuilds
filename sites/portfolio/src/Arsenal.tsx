import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, Lock } from "lucide-react";
import { products, type Product } from "@shared/content";
import { SceneHead } from "./SceneHead";

function Case({ children, label, lit = true }: { children: React.ReactNode; label: string; lit?: boolean }) {
  return (
    <div className="relative w-full max-w-[400px]">
      {/* Ceiling spotlight. */}
      {lit && (
        <motion.div
          className="pointer-events-none absolute -top-24 left-1/2 h-[140%] w-[120%] -translate-x-1/2"
          style={{ background: "radial-gradient(ellipse 40% 60% at 50% 0%, rgba(255,40,40,0.22), transparent 70%)" }}
          animate={{ opacity: [0.7, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      )}
      <div className="relative rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        {children}
      </div>
      <div className="mx-auto mt-4 w-max rounded-md border border-white/10 bg-[#0c0e14] px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.25em] text-steel">
        {label}
      </div>
    </div>
  );
}

/** Cutdeck: three clip cards fanned out. */
function CutdeckArt() {
  return (
    <div className="absolute inset-x-0 top-[14%] flex justify-center">
      {[-1, 0, 1].map((o) => (
        <div
          key={o}
          className="relative -mx-4 h-[140px] w-[80px] rounded-2xl border border-white/30 bg-black/35 backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-2"
          style={{ transform: `rotate(${o * 12}deg) translateY(${Math.abs(o) * 12}px)`, zIndex: 2 - Math.abs(o) }}
        >
          <div className="absolute inset-x-2 bottom-4 text-center font-display text-[10.5px] font-extrabold uppercase leading-tight text-white" style={{ WebkitTextStroke: "0.6px black" }}>
            {["No way", "Watch this", "He said what"][o + 1]}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Arclor: a website turning into a video frame on a timeline. */
function ArclorArt() {
  return (
    <div className="absolute inset-x-6 top-[11%]">
      <div className="rounded-xl border border-white/30 bg-black/30 p-2 backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-2">
        <div className="mb-2 flex items-center gap-1.5 rounded-md bg-white/15 px-2 py-1 font-mono text-[9.5px] text-white/85">
          <span className="h-1.5 w-1.5 rounded-full bg-white/70" /> yourproduct.com
        </div>
        <div className="relative grid aspect-video place-items-center overflow-hidden rounded-md bg-[radial-gradient(90%_90%_at_30%_20%,#c9d3ff,#3d5afe_55%,#101a5c)]">
          <motion.div className="absolute left-[12%] top-[22%] h-2 w-[46%] rounded-full bg-white/80" animate={{ width: ["10%", "46%", "46%"] }} transition={{ duration: 2.4, repeat: Infinity }} />
          <motion.div className="absolute left-[12%] top-[38%] h-1.5 w-[30%] rounded-full bg-white/45" animate={{ width: ["5%", "30%", "30%"] }} transition={{ duration: 2.4, repeat: Infinity, delay: 0.2 }} />
          <motion.div className="absolute bottom-[16%] right-[12%] h-9 w-9 rounded-xl bg-white/85 shadow-lg" animate={{ rotate: [0, 0, 12, 0], scale: [0.6, 1, 1, 1] }} transition={{ duration: 2.4, repeat: Infinity }} />
        </div>
        <div className="relative mt-2 h-1 rounded-full bg-white/15">
          <motion.div className="absolute inset-y-0 left-0 rounded-full bg-white" animate={{ width: ["0%", "100%"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }} />
        </div>
      </div>
    </div>
  );
}

function ProductCard({ p, i }: { p: Product; i: number }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 200, damping: 20 });
  const shine = useTransform([mx, my], ([x, y]) => `radial-gradient(380px circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(255,255,255,0.22), transparent 50%)`);
  return (
    <Case label={`Gadget ${String(i + 1).padStart(2, "0")} · ${p.status === "live" ? "Deployed" : "In the lab"}`}>
      <motion.a
        href={p.url}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onMouseLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
        className="group relative block aspect-[9/13] overflow-hidden rounded-[20px]"
      >
        <div className="absolute inset-0" style={{ background: `radial-gradient(120% 90% at 30% 10%, ${p.accent2}, ${p.accent} 40%, ${p.id === "arclor" ? "#060a26" : "#1e0906"} 88%)` }} />
        <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: shine }} />
        {p.id === "arclor" ? <ArclorArt /> : <CutdeckArt />}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-6 pt-24">
          <div className="font-display text-[42px] font-extrabold leading-none tracking-[-0.04em] text-white">{p.name}</div>
          <div className="mt-2 font-serif text-[21px] italic text-white/90">{p.tagline}</div>
          <p className="mt-3 text-[13.5px] leading-snug text-white/70">{p.blurb}</p>
          <div className="mt-5 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/80">{p.platforms.join(" · ")} · {p.price}</span>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-signal text-white transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight size={20} />
            </span>
          </div>
        </div>
      </motion.a>
    </Case>
  );
}

function Classified({ i }: { i: number }) {
  return (
    <Case label={`Gadget ${String(i + 1).padStart(2, "0")} · Classified`} lit={false}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 * i, type: "spring", stiffness: 90, damping: 16 }}
        className="relative grid aspect-[9/13] place-items-center overflow-hidden rounded-[20px] bg-[#07090e]"
      >
        <div className="absolute inset-0 opacity-[0.06]" style={{ background: "repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 12px)" }} />
        <motion.div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-gotham/15 to-transparent" animate={{ y: ["-30%", "520%"] }} transition={{ duration: 3.2, repeat: Infinity, ease: "linear", delay: i }} />
        <div className="relative text-center">
          <Lock className="mx-auto text-steel" size={26} />
          <div className="mt-4 font-display text-[26px] font-bold uppercase tracking-tight text-paper/70">Classified</div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-dim">Next release</div>
        </div>
      </motion.div>
    </Case>
  );
}

export function Arsenal() {
  return (
    <section id="arsenal" className="relative mx-auto max-w-[1400px] px-6 py-32 md:px-12 md:py-44">
      <SceneHead n="01" label="The Arsenal" title={<>Tools built <span className="text-signal signal-glow">in the dark</span></>}>
        Every tool from Mohan Builds gets its own site. Each one is small, sharp and built for one job. Two are out. The third is still under wraps.
      </SceneHead>
      <div className="grid grid-cols-1 justify-items-center gap-10 md:grid-cols-3">
        {products.map((p, i) => (
          <ProductCard key={p.id} p={p} i={i} />
        ))}
        {Array.from({ length: Math.max(0, 3 - products.length) }).map((_, k) => (
          <Classified key={k} i={products.length + k} />
        ))}
      </div>
    </section>
  );
}
