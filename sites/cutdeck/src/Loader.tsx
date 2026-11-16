import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/** The three cards of the logo, back to front: their colour and fanned pose. */
const CARDS = [
  { fill: "#4a4a5c", rotate: -24, x: -30, y: 6 },
  { fill: "#ffb547", rotate: -12, x: -15, y: 2 },
  { fill: "#ff6a5c", rotate: 0, x: 0, y: 0 },
];

/**
 * The Cutdeck logo builds itself: three cards drop in as one stack, fan out,
 * the slash cuts across the front card, then the deck opens up into the page.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(true);
  const [fan, setFan] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t1 = setTimeout(() => setFan(true), reduce ? 0 : 400);
    const t2 = setTimeout(() => setShow(false), reduce ? 300 : 1550);
    return () => [t1, t2].forEach(clearTimeout);
  }, []);
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
  }, [show]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-ink-950"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease, delay: 0.15 }}
        >
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral/25 blur-[110px]"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: fan ? 1 : 0.4, scale: fan ? 1 : 0.6 }}
            transition={{ duration: 1, ease }}
          />
          <div className="relative flex flex-col items-center">
            <motion.div
              className="relative h-[132px] w-[96px]"
              exit={{ scale: 2.6, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease }}
            >
              {CARDS.map((c, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 origin-bottom rounded-[18px] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.9)]"
                  style={{
                    background: i === 2 ? "linear-gradient(160deg, #ff8a7f, #ff5a4e 60%)" : c.fill,
                    border: "1px solid rgba(255,255,255,0.12)",
                    zIndex: i,
                  }}
                  initial={{ y: -70, opacity: 0, rotate: 0, x: 0 }}
                  animate={fan ? { y: c.y, opacity: 1, rotate: c.rotate, x: c.x } : { y: 0, opacity: 1, rotate: 0, x: 0 }}
                  transition={
                    fan
                      ? { type: "spring", stiffness: 170, damping: 15, delay: (2 - i) * 0.05 }
                      : { duration: 0.4, ease, delay: i * 0.07 }
                  }
                >
                  {i === 2 && (
                    <svg viewBox="0 0 96 132" className="absolute inset-0 h-full w-full" aria-hidden>
                      <motion.line
                        x1="26" y1="86" x2="70" y2="50"
                        stroke="#141418" strokeWidth="9" strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: fan ? 1 : 0 }}
                        transition={{ duration: 0.32, ease, delay: 0.4 }}
                      />
                    </svg>
                  )}
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              className="mt-10 font-display text-[26px] font-bold tracking-tight"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: fan ? 1 : 0, y: fan ? 0 : 8 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5, ease, delay: fan ? 0.55 : 0 }}
            >
              cutdeck
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
