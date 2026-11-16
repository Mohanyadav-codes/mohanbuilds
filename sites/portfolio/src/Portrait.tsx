import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useState } from "react";
import { BAT_PATH } from "./BatLogo";

/**
 * Hero portrait: cowl on both halves of the face, left body is Mohan,
 * right body is the suit. If /portrait.png exists it replaces the drawing.
 * The two halves drift apart slightly as you scroll.
 */
export function Portrait() {
  const [img, setImg] = useState<string | null>(null);
  useEffect(() => {
    const i = new Image();
    i.onload = () => setImg("/portrait.png");
    i.src = "/portrait.png";
  }, []);

  const { scrollY } = useScroll();
  const gap = useSpring(useTransform(scrollY, [0, 500], [0, 26]), { stiffness: 120, damping: 20 });
  const left = useTransform(gap, (g) => -g);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(my, { stiffness: 80, damping: 18 });
  const ry = useSpring(mx, { stiffness: 80, damping: 18 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 10);
      my.set((e.clientY / window.innerHeight - 0.5) * -6);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <motion.div style={{ rotateY: ry, rotateX: rx, transformPerspective: 1200 }} className="relative aspect-[500/620] w-full">
      {img ? <PhotoHalves src={img} left={left} right={gap} /> : <Drawing left={left} right={gap} />}
      {/* Seam light down the middle. */}
      <motion.div
        className="pointer-events-none absolute bottom-[2%] left-1/2 top-[6%] w-px -translate-x-1/2"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(255,226,122,0.9) 30%, rgba(125,149,255,0.9) 70%, transparent)" }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  );
}

function PhotoHalves({ src, left, right }: { src: string; left: MotionValue<number>; right: MotionValue<number> }) {
  return (
    <>
      <motion.img src={src} alt="Mohan Yadav" style={{ x: left, clipPath: "inset(0 50% 0 0)" }} className="absolute inset-0 h-full w-full object-contain" />
      <motion.img src={src} alt="" aria-hidden style={{ x: right, clipPath: "inset(0 0 0 50%)" }} className="absolute inset-0 h-full w-full object-contain" />
    </>
  );
}

const COWL =
  "M250 126 C226 126 212 132 204 140 L190 52 L168 150 C150 178 146 214 150 250 C152 300 160 340 172 372 L182 430 L318 430 L328 372 C340 340 348 300 350 250 C354 214 350 178 332 150 L310 52 L296 140 C288 132 274 126 250 126 Z " +
  // Opening for the lower face (cut out with evenodd).
  "M250 300 C238 296 226 290 214 286 C204 284 196 290 196 302 C198 330 206 356 222 374 C232 386 242 392 250 392 C258 392 268 386 278 374 C294 356 302 330 304 302 C304 290 296 284 286 286 C274 290 262 296 250 300 Z";

function Drawing({ left, right }: { left: MotionValue<number>; right: MotionValue<number> }) {
  return (
    <svg viewBox="0 0 500 620" className="absolute inset-0 h-full w-full overflow-visible" role="img" aria-label="Portrait placeholder">
      <defs>
        <clipPath id="half-l"><rect x="-50" y="0" width="300" height="640" /></clipPath>
        <clipPath id="half-r"><rect x="250" y="0" width="300" height="640" /></clipPath>
        <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9a07c" />
          <stop offset="1" stopColor="#9a6a4f" />
        </linearGradient>
        <linearGradient id="tee" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3f4c" />
          <stop offset="1" stopColor="#1c1f27" />
        </linearGradient>
        <linearGradient id="suit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2e38" />
          <stop offset="1" stopColor="#0b0c10" />
        </linearGradient>
        <linearGradient id="cowl" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#14161c" />
          <stop offset="0.5" stopColor="#23262f" />
          <stop offset="1" stopColor="#0d0e12" />
        </linearGradient>
        <radialGradient id="lens">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#dfe6ff" />
          <stop offset="1" stopColor="#7d95ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rimL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffd27a" stopOpacity="0.55" />
          <stop offset="0.25" stopColor="#ffd27a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rimR" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#7d95ff" stopOpacity="0.7" />
          <stop offset="0.25" stopColor="#7d95ff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* LEFT HALF: Mohan */}
      <motion.g style={{ x: left }} clipPath="url(#half-l)">
        <path d="M30 640 C34 540 60 486 120 462 C160 446 196 432 214 420 L286 420 C304 432 340 446 380 462 C440 486 466 540 470 640 Z" fill="url(#tee)" />
        <path d="M214 420 C224 446 276 446 286 420" fill="none" stroke="#4a5060" strokeWidth="7" />
        <path d="M120 520 C150 540 170 600 168 640 M90 560 C110 590 118 620 118 640" stroke="#2a2e38" strokeWidth="3" fill="none" />
        <rect x="216" y="370" width="68" height="60" rx="18" fill="url(#skin)" />
        <ellipse cx="250" cy="280" rx="96" ry="124" fill="url(#skin)" />
        <path d={COWL} fill="url(#cowl)" fillRule="evenodd" />
        {/* Human eye inside the cowl. */}
        <path d="M196 246 C206 236 226 234 238 246 C226 254 206 254 196 246 Z" fill="#f2ede6" />
        <circle cx="218" cy="245" r="6.5" fill="#2a1a10" />
        <circle cx="220" cy="243" r="1.8" fill="#fff" />
        <path d="M228 352 C240 358 250 358 250 358" stroke="#6e4634" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M30 640 C34 540 60 486 120 462 C160 446 196 432 214 420" fill="none" stroke="url(#rimL)" strokeWidth="6" />
      </motion.g>

      {/* RIGHT HALF: the suit */}
      <motion.g style={{ x: right }} clipPath="url(#half-r)">
        <path d="M30 640 C34 540 60 486 120 462 C160 446 196 432 214 420 L286 420 C304 432 340 446 380 462 C440 486 466 540 470 640 Z" fill="url(#suit)" />
        {/* Armour plates. */}
        <path d="M270 470 C320 470 370 480 410 510 M262 600 C320 590 380 600 440 620 M330 470 L350 640" stroke="#3a3f4c" strokeWidth="3" fill="none" />
        <path d="M380 462 C420 476 446 500 460 540" stroke="#4a5163" strokeWidth="5" fill="none" />
        <g transform="translate(250 540) scale(1.25) translate(-100 -53)">
          <path d={BAT_PATH} fill="#05060a" stroke="#3b4152" strokeWidth="1.5" />
        </g>
        <rect x="216" y="370" width="68" height="60" rx="18" fill="#101218" />
        <ellipse cx="250" cy="280" rx="96" ry="124" fill="url(#skin)" />
        <path d={COWL} fill="url(#cowl)" fillRule="evenodd" />
        <path d="M290 150 C312 200 318 260 312 300" stroke="#3a3f4c" strokeWidth="3" fill="none" />
        {/* Glowing lens. */}
        <motion.ellipse cx="282" cy="245" rx="34" ry="18" fill="url(#lens)" animate={{ opacity: [0.55, 1, 0.55] }} transition={{ duration: 2.6, repeat: Infinity }} />
        <path d="M262 246 C274 236 294 234 304 246 C294 254 274 254 262 246 Z" fill="#f4f7ff" />
        <path d="M250 358 C260 358 272 352 272 352" stroke="#6e4634" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M470 640 C466 540 440 486 380 462 C340 446 304 432 286 420" fill="none" stroke="url(#rimR)" strokeWidth="6" />
      </motion.g>
    </svg>
  );
}
