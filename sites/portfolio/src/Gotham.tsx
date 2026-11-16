import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BAT_PATH } from "./BatLogo";

/** Falling rain on a canvas, slanted by the wind. */
export function Rain({ density = 1 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let w = 0;
    let h = 0;
    let raf = 0;
    const drops: { x: number; y: number; l: number; v: number; a: number }[] = [];
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((w * h) / 5200 * density);
      drops.length = 0;
      for (let i = 0; i < n; i++) drops.push({ x: Math.random() * w, y: Math.random() * h, l: 8 + Math.random() * 18, v: 9 + Math.random() * 12, a: 0.08 + Math.random() * 0.22 });
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (const d of drops) {
        ctx.strokeStyle = `rgba(170,190,255,${d.a})`;
        ctx.lineWidth = d.l > 20 ? 1.3 : 0.9;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.l * 0.18, d.y + d.l);
        ctx.stroke();
        d.y += d.v;
        d.x -= d.v * 0.18;
        if (d.y > h) {
          d.y = -20;
          d.x = Math.random() * (w + 100);
        }
      }
      if (!reduce) raf = requestAnimationFrame(tick);
    };
    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [density]);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" />;
}

/** Random lightning flashes over the whole viewport. */
export function Lightning() {
  const [flash, setFlash] = useState(0);
  useEffect(() => {
    let t: number;
    const loop = () => {
      t = window.setTimeout(() => {
        setFlash((f) => f + 1);
        loop();
      }, 6000 + Math.random() * 9000);
    };
    loop();
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div
      key={flash}
      className="pointer-events-none fixed inset-0 z-[58] bg-[#cfd8ff] mix-blend-overlay"
      initial={{ opacity: 0 }}
      animate={flash ? { opacity: [0, 0.55, 0.05, 0.4, 0] } : { opacity: 0 }}
      transition={{ duration: 0.7, times: [0, 0.08, 0.2, 0.28, 1] }}
    />
  );
}

/** A Gotham skyline silhouette. */
export function Skyline({ className = "", fill = "#03050a" }: { className?: string; fill?: string }) {
  // Hand-placed towers: [x, width, height, spire]
  const towers: [number, number, number, number][] = [
    [0, 60, 180, 0], [55, 40, 240, 30], [92, 70, 160, 0], [158, 36, 300, 60], [190, 64, 210, 0], [250, 44, 340, 40],
    [290, 80, 190, 0], [366, 50, 260, 24], [412, 34, 380, 80], [442, 70, 230, 0], [508, 46, 300, 0], [550, 90, 170, 0],
    [636, 40, 280, 50], [672, 62, 220, 0], [730, 38, 360, 70], [764, 70, 200, 0], [830, 50, 270, 30], [876, 84, 180, 0],
    [956, 44, 320, 46], [996, 60, 230, 0], [1052, 40, 290, 0], [1088, 76, 200, 0], [1160, 40, 250, 36],
  ];
  return (
    <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden>
      {towers.map(([x, w, h, s], i) => (
        <g key={i}>
          <rect x={x} y={400 - h} width={w} height={h} fill={fill} />
          {s > 0 && <polygon points={`${x + w / 2 - 4},${400 - h} ${x + w / 2},${400 - h - s} ${x + w / 2 + 4},${400 - h}`} fill={fill} />}
          {Array.from({ length: Math.floor(h / 26) }).map((_, r) =>
            Array.from({ length: Math.max(1, Math.floor(w / 14)) }).map((__, k) =>
              (i * 7 + r * 3 + k * 5) % 9 === 0 ? (
                <rect key={`${r}-${k}`} x={x + 5 + k * 14} y={400 - h + 12 + r * 26} width={4} height={6} fill="#ffd27a" opacity={0.55} />
              ) : null,
            ),
          )}
        </g>
      ))}
    </svg>
  );
}

/** The signal: a beam from below hitting the clouds with the emblem. */
export function SignalBeam({ className = "", sweep = true }: { className?: string; sweep?: boolean }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="absolute bottom-[-10%] left-[66%] h-[130%] w-[40vw] origin-bottom"
        style={{ background: "linear-gradient(to top, rgba(255,226,122,0.28), rgba(255,226,122,0.05) 70%, transparent)", clipPath: "polygon(47% 100%, 53% 100%, 100% 0, 0 0)", filter: "blur(6px)" }}
        animate={sweep ? { rotate: [-14, -6, -14] } : { rotate: -10 }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[64%] top-[3%] w-[20vw] max-w-[300px]"
        animate={sweep ? { x: ["-6%", "4%", "-6%"], opacity: [0.75, 0.95, 0.75] } : undefined}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="-14 -22 228 150" className="w-full" style={{ filter: "blur(1.5px)" }}>
          <defs>
            <radialGradient id="sigfill">
              <stop offset="0" stopColor="#fff3b0" stopOpacity="0.55" />
              <stop offset="1" stopColor="#ffd21f" stopOpacity="0.18" />
            </radialGradient>
          </defs>
          <ellipse cx="100" cy="53" rx="112" ry="72" fill="url(#sigfill)" />
          <path d={BAT_PATH} fill="#06080e" opacity="0.85" transform="translate(100 53) scale(0.86) translate(-100 -53)" />
        </svg>
      </motion.div>
    </div>
  );
}

/** Slow-moving cloud layers. */
export function Clouds() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -120]);
  return (
    <motion.div style={{ y }} className="pointer-events-none absolute inset-0">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{ width: `${50 + i * 20}vw`, height: `${18 + i * 6}vw`, top: `${-4 + i * 9}%`, left: `${-20 + i * 30}%`, background: "radial-gradient(closest-side, rgba(70,84,130,0.35), transparent)" }}
          animate={{ x: ["0vw", "8vw", "0vw"] }}
          transition={{ duration: 40 + i * 12, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </motion.div>
  );
}
