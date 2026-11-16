import { motion } from "motion/react";
import { ArrowUpRight, Users } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { projects, type Project } from "@shared/content";
import { SceneHead } from "./SceneHead";

// Desktop board layout: left %, top px, rotation.
const SPOTS: [number, number, number][] = [
  [2, 40, -4],
  [36, 0, 3],
  [70, 70, -2.5],
  [14, 470, 2.5],
  [52, 430, -3.5],
];

function File({ p, i, rot }: { p: Project; i: number; rot: number }) {
  return (
    <motion.a
      href={p.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 40, rotate: rot * 3 }}
      whileInView={{ opacity: 1, y: 0, rotate: rot }}
      whileHover={{ rotate: 0, y: -10, scale: 1.04, zIndex: 30 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 140, damping: 16, delay: i * 0.06 }}
      className="group relative block w-full rounded-sm bg-[#e9e2d3] p-3 pb-4 text-[#1b1813] shadow-[0_25px_50px_-15px_rgba(0,0,0,0.85)]"
    >
      {/* Pin. */}
      <span className="absolute -top-2 left-1/2 z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ff8a7f,#b0201a)] shadow-[0_3px_6px_rgba(0,0,0,0.6)]" />
      <div className="relative aspect-[16/10] overflow-hidden rounded-[2px]">
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
          style={{ background: `radial-gradient(120% 100% at 20% 0%, hsl(${p.hue} 70% 55%), hsl(${p.hue + 30} 55% 24%) 50%, hsl(${p.hue + 40} 40% 7%) 92%)`, filter: "grayscale(0.55) contrast(1.15)" }}
        />
        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0 1px, transparent 1px 3px)" }} />
        <div className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/85">Case #{String(i + 1).padStart(3, "0")}</div>
        <div className="absolute bottom-3 left-3 font-display text-[30px] font-extrabold leading-none tracking-[-0.03em] text-white">{p.name}</div>
        <ul className="absolute inset-0 flex flex-col justify-center gap-1.5 bg-black/80 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {p.points.map((pt) => (
            <li key={pt} className="flex gap-2 text-[13px] leading-snug text-paper">
              <span className="text-signal">▸</span>
              {pt}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2 px-0.5">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7a7262]">{p.kind}</div>
          <p className="mt-1 text-[13.5px] font-medium leading-snug">{p.blurb}</p>
        </div>
        <ArrowUpRight size={18} className="mt-0.5 shrink-0 text-[#7a7262] transition group-hover:text-[#b0201a]" />
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1 px-0.5">
        {p.stack.map((s) => (
          <span key={s} className="rounded-sm bg-[#1b1813]/[0.08] px-1.5 py-0.5 font-mono text-[10.5px] text-[#4a4438]">{s}</span>
        ))}
        {p.team && (
          <span className="inline-flex items-center gap-1 rounded-sm bg-[#b0201a]/10 px-1.5 py-0.5 font-mono text-[10.5px] text-[#8e1a14]">
            <Users size={10} /> Team build
          </span>
        )}
      </div>
      <span className="pointer-events-none absolute right-4 top-[38%] rotate-[-14deg] rounded border-[3px] border-[#b0201a]/70 px-2 py-0.5 font-display text-[18px] font-extrabold uppercase tracking-wider text-[#b0201a]/70 transition-opacity duration-300 group-hover:opacity-0">
        Solved
      </span>
    </motion.a>
  );
}

/** Red string between the pins, measured from the real card positions. */
function Strings({ board, cards }: { board: React.RefObject<HTMLDivElement | null>; cards: React.RefObject<(HTMLDivElement | null)[]> }) {
  const [pts, setPts] = useState<[number, number][]>([]);
  const [size, setSize] = useState<[number, number]>([0, 0]);
  useLayoutEffect(() => {
    const b = board.current;
    if (!b) return;
    const measure = () => {
      const br = b.getBoundingClientRect();
      setSize([br.width, br.height]);
      setPts(
        (cards.current ?? []).filter(Boolean).map((c) => {
          const r = c!.getBoundingClientRect();
          return [r.left - br.left + r.width / 2, r.top - br.top + 6];
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(b);
    return () => ro.disconnect();
  }, [board, cards]);
  if (pts.length < 2) return null;
  const order = [0, 1, 2, 4, 3, 0, 4, 1];
  return (
    <svg className="pointer-events-none absolute inset-0 z-0 hidden md:block" width={size[0]} height={size[1]}>
      {order.slice(0, -1).map((a, k) => {
        const b = order[k + 1];
        if (!pts[a] || !pts[b]) return null;
        const [x1, y1] = pts[a];
        const [x2, y2] = pts[b];
        const sag = Math.min(80, Math.hypot(x2 - x1, y2 - y1) * 0.12);
        return (
          <motion.path
            key={k}
            d={`M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + sag} ${x2} ${y2}`}
            stroke="#c4271f"
            strokeWidth={1.6}
            fill="none"
            opacity={0.75}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.4 + k * 0.15 }}
          />
        );
      })}
    </svg>
  );
}

export function CaseFiles() {
  const board = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  return (
    <section id="cases" className="relative mx-auto max-w-[1400px] px-6 py-32 md:px-12 md:py-40">
      <SceneHead n="02" label="Case Files" title={<>The work, <span className="text-signal signal-glow">on record</span></>}>
        Agents, retrieval, computer vision and developer tools. Hover a file to open it, or click to read the code.
      </SceneHead>
      <div ref={board} className="relative rounded-[28px] border border-white/[0.06] bg-[#0b0d12] p-6 md:h-[900px] md:p-0" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "18px 18px" }}>
        <Strings board={board} cards={cards} />
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:block">
          {projects.map((p, i) => {
            const [l, t, r] = SPOTS[i % SPOTS.length];
            return (
              <div
                key={p.name}
                ref={(el) => {
                  cards.current[i] = el;
                }}
                className="relative z-10 md:absolute md:left-[var(--l)] md:top-[var(--t)] md:w-[28%]"
                style={{ ["--l" as string]: `${l}%`, ["--t" as string]: `${t + 50}px` }}
              >
                <div className="md:contents">
                  <File p={p} i={i} rot={r} />
                </div>
              </div>
            );
          })}
        </div>
        <a href="https://github.com/Mohanyadav-codes" target="_blank" rel="noreferrer" className="absolute bottom-6 right-8 hidden font-mono text-[12px] uppercase tracking-[0.2em] text-mute hover:text-signal md:block">
          All files on GitHub ↗
        </a>
      </div>
    </section>
  );
}
