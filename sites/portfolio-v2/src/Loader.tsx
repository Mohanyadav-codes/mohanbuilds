import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BAT } from "./Bat";
import { hash } from "./lib";

/*
 * Loader: `git clone` of Mohan's own history.
 * The command types itself, then the commit graph grows upward from "first line of code" to HEAD,
 * branches fork off and merge back. At the end every branch fades away and the main line and the
 * HEAD commit slide into place as the page's own commit graph.
 */

const LIME = "#c8ff3d";
const CUT = "#ff6b5b";
const ARC = "#7aa2ff";
const SUN = "#ffbe55";

type Ref = { t: string; c: string };
type Row = {
  msg?: string;
  redact?: number[];
  lane?: 0 | 1;
  c?: string;
  root?: boolean;
  head?: boolean;
  tip?: boolean;
  fork?: { c: string; dashed?: boolean };
  merge?: { c: string };
  pass?: { c: string; dashed?: boolean };
  refs?: Ref[];
};

// Oldest first.
const ROWS: Row[] = [
  { msg: "init: first line of code", root: true, refs: [{ t: "tag: class-9", c: SUN }] },
  { msg: "learn: C++, Python, SQL" },
  { msg: "feat: vision attendance · OpenCV + Flask" },
  { msg: "feat: api ninja · a fast API client" },
  { msg: "feat: jester ai · an agent with jokes" },
  { msg: "feat: gito · chat with any GitHub repo", fork: { c: CUT } },
  { lane: 1, c: CUT, msg: "cutdeck: find the moments worth posting" },
  { lane: 1, c: CUT, msg: "cutdeck: reframe to vertical, add captions" },
  { msg: "Merge branch 'feat/cutdeck'", merge: { c: CUT }, refs: [{ t: "cutdeck · live", c: CUT }] },
  { msg: "chore: B.Tech, 3rd year · DTU", fork: { c: ARC } },
  { lane: 1, c: ARC, msg: "arclor: read a website, write the script" },
  { lane: 1, c: ARC, msg: "arclor: animate it, edit with prompts" },
  { msg: "Merge branch 'feat/arclor'", merge: { c: ARC }, fork: { c: BAT, dashed: true }, refs: [{ t: "arclor · live", c: ARC }] },
  { lane: 1, c: BAT, redact: [64, 22, 90] },
  { msg: "film: how it was built · youtube", pass: { c: BAT, dashed: true } },
  { lane: 1, c: BAT, tip: true, redact: [40, 70], refs: [{ t: "feat/classified", c: BAT }] },
  { msg: "ship: mohanbuilds.com", head: true, refs: [{ t: "HEAD → main", c: LIME }, { t: "origin/main", c: "#ff6b5b" }] },
];
const N = ROWS.length;
const sha = (r: Row, i: number) => (r.head ? hash("head") : hash(`${i}:${r.msg ?? "redacted"}`));
const branchOf = (r: Row) => (r.lane ? (r.c === CUT ? "feat/cutdeck" : r.c === ARC ? "feat/arclor" : "feat/████") : "main");

const CMD = "git clone git@github.com:Mohanyadav-codes/mohan.builds.git";
const T_TYPE = 520;
const T_ROWS = 640;
const STEP = 92;
const T_DONE = T_ROWS + N * STEP + 120;
const T_LAND = T_DONE + 420;

const H = 26; // row height
const X0 = 11; // lane 0 x inside the graph cell
const LW = 18; // lane spacing
const X1 = X0 + LW;

function Graph({ r }: { r: Row }) {
  const y = H / 2;
  const dash = (d?: boolean) => (d ? "3 3" : undefined);
  return (
    <svg width="60" height={H} className="shrink-0 overflow-visible" aria-hidden>
      {/* main lane */}
      {r.lane ? (
        <line x1={X0} x2={X0} y1={0} y2={H} stroke={LIME} strokeWidth="2" />
      ) : (
        <line x1={X0} x2={X0} y1={r.head ? y : 0} y2={r.root ? y : H} stroke={LIME} strokeWidth="2" />
      )}
      {/* side lane passing through */}
      {r.pass && <line x1={X1} x2={X1} y1={0} y2={H} stroke={r.pass.c} strokeWidth="2" strokeDasharray={dash(r.pass.dashed)} />}
      {/* side lane commit */}
      {r.lane === 1 && (
        <line x1={X1} x2={X1} y1={r.tip ? y : 0} y2={H} stroke={r.c} strokeWidth="2" strokeDasharray={dash(r.c === BAT)} />
      )}
      {r.fork && (
        <path d={`M${X0} ${y} C${X0} ${y - 8}, ${X1} ${y - 4}, ${X1} 0`} fill="none" stroke={r.fork.c} strokeWidth="2" strokeDasharray={dash(r.fork.dashed)} />
      )}
      {r.merge && <path d={`M${X1} ${H} C${X1} ${H - 6}, ${X0} ${y + 7}, ${X0} ${y}`} fill="none" stroke={r.merge.c} strokeWidth="2" />}
      {/* the commit */}
      <circle
        id={r.head ? "ld-head" : undefined}
        cx={r.lane ? X1 : X0}
        cy={y}
        r={r.head ? 6 : 4.5}
        fill={r.head ? LIME : "#0b0b0a"}
        stroke={r.lane ? r.c : LIME}
        strokeWidth="2"
      />
    </svg>
  );
}

function Line({ r, i }: { r: Row; i: number }) {
  return (
    <div className="flex items-center gap-3 whitespace-nowrap font-mono text-[12px] md:text-[13px]" style={{ height: H }}>
      <Graph r={r} />
      <span style={{ color: SUN }}>{sha(r, i)}</span>
      {r.refs && (
        <span className="hidden sm:inline">
          <span className="text-sky">(</span>
          {r.refs.map((f, k) => (
            <span key={f.t}>
              {k > 0 && <span className="text-sky">, </span>}
              <span className="font-semibold" style={{ color: f.c }}>
                {f.t}
              </span>
            </span>
          ))}
          <span className="text-sky">)</span>
        </span>
      )}
      {r.redact ? (
        <span className="flex gap-1.5">
          {r.redact.map((w, k) => (
            <span key={k} className="inline-block h-[11px] rounded-[2px]" style={{ width: w, background: `${BAT}40` }} />
          ))}
        </span>
      ) : (
        <span className="truncate text-text/80">{r.msg}</span>
      )}
    </div>
  );
}

export function Loader({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const [e, setE] = useState(0);
  const [land, setLand] = useState<null | { from: DOMRect; to: DOMRect | null }>(null);
  const t0 = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onReveal();
      onDone();
      return;
    }
    const html = document.documentElement;
    html.style.overflow = "hidden";
    t0.current = performance.now();
    const tick = (now: number) => {
      const el = now - t0.current;
      setE(el);
      if (el < T_LAND) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    const skip = () => {
      if (performance.now() - t0.current < T_DONE) t0.current = performance.now() - T_DONE;
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      html.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hand-off: measure where HEAD is now and where the page's HEAD dot waits.
  useLayoutEffect(() => {
    if (e < T_LAND || land) return;
    const from = document.getElementById("ld-head")?.getBoundingClientRect();
    const dot = document.getElementById("head-dot");
    const to = dot && dot.offsetParent ? dot.getBoundingClientRect() : null;
    document.documentElement.style.overflow = "";
    onReveal();
    setLand({ from: from ?? new DOMRect(-99, -99, 0, 0), to });
    setTimeout(onDone, 1250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [e]);

  const typed = CMD.slice(0, Math.round(Math.min(1, e / T_TYPE) * CMD.length));
  const n = Math.max(0, Math.min(N, Math.floor((e - T_ROWS) / STEP) + 1));
  const k = n / N;
  const objs = Math.round(k * 701);
  const done = e >= T_DONE;
  const shown = ROWS.slice(0, n).map((r, i) => ({ r, i })).reverse();
  const top = shown[0];
  const bar = 28;
  const fill = Math.round(k * bar);

  const cx = land ? land.from.x + land.from.width / 2 : 0;
  const cy = land ? land.from.y + land.from.height / 2 : 0;
  const tx = land?.to ? land.to.x + land.to.width / 2 : cx;
  const ty = land?.to ? land.to.y + land.to.height / 2 : cy;

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden"
      role="status"
      aria-label="Loading"
      initial={false}
      animate={{ opacity: 1 }}
    >
      {/* Backdrop fades once HEAD has landed. */}
      <motion.div className="absolute inset-0 bg-bg" animate={{ opacity: land ? 0 : 1 }} transition={{ delay: land ? 0.55 : 0, duration: 0.6 }} />

      <motion.div className="absolute inset-0" animate={{ opacity: land ? 0 : 1 }} transition={{ duration: 0.35 }}>
        <div className="relative mx-auto h-full max-w-[1400px] px-5 md:pl-[88px] md:pr-8">
          {/* Command. */}
          <div className="pt-20 font-mono text-[12.5px] leading-6 md:pt-24">
            <div className="text-mute">
              <span className="text-lime">$</span> <span className="text-text">{typed}</span>
              {e < T_ROWS && <span className="ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[3px] bg-lime" />}
            </div>
            {e > T_TYPE + 60 && <div className="text-dim">Cloning into 'mohan.builds'...</div>}
            {e > T_ROWS && <div className="text-dim">remote: Enumerating objects: 701, done.</div>}
            {e > T_ROWS && (
              <div className="text-dim">
                Receiving objects: <span className="text-text">{String(Math.round(k * 100)).padStart(3, " ")}%</span> ({objs}/701)
                {done && ", done."}
              </div>
            )}
            {done && (
              <div className="text-dim">
                Resolving deltas: 100% (<span className="text-text">312/312</span>), done.
              </div>
            )}
          </div>

          {/* The graph, growing upward. */}
          <div className="absolute inset-x-5 top-[38%] h-[52%] overflow-hidden [mask-image:linear-gradient(black_70%,transparent)] md:left-[28px] md:right-8">
            <div className="mb-2 font-mono text-[11px] text-dim md:ml-[60px]">
              <span className="text-lime">$</span> git log --graph --oneline --all
            </div>
            <AnimatePresence initial={false}>
              {shown.map(({ r, i }) => (
                <motion.div
                  key={i}
                  initial={{ height: 0, opacity: 0, x: -10 }}
                  animate={{ height: H, opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <Line r={r} i={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Big readout: the commit being written right now. */}
          {top && (
            <div className="absolute right-8 top-[38%] hidden text-right lg:block">
              <div className="font-mono text-[11px] text-dim">
                {top.r.head ? "HEAD is now at" : "writing commit"} · <span style={{ color: top.r.lane ? top.r.c : LIME }}>{branchOf(top.r)}</span>
              </div>
              <div className="mt-2">
                  <motion.div
                    key={top.i}
                    initial={{ y: "45%", opacity: 0, filter: "blur(6px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="font-mono text-[clamp(64px,8.5vw,136px)] font-extrabold leading-none tracking-[-0.07em]"
                    style={{ color: top.r.head ? LIME : "#ecebe4", textShadow: top.r.head ? "0 0 40px rgb(200 255 61 / 0.4)" : undefined }}
                  >
                    {sha(top.r, top.i)}
                  </motion.div>
              </div>
              <div className="mt-3 font-mono text-[12px] text-mute">
                {String(n).padStart(2, "0")}/{N} commits
              </div>
            </div>
          )}

          {/* ASCII progress. */}
          <div className="absolute inset-x-5 bottom-7 flex items-center justify-between gap-4 font-mono text-[11.5px] md:bottom-9 md:left-[88px] md:right-8">
            <span className="truncate">
              <span className="text-lime">{"█".repeat(fill)}</span>
              <span className="text-line">{"░".repeat(bar - fill)}</span>
              <span className="ml-3 text-mute">{done ? "checked out main" : `${(k * 8.42).toFixed(2)} MiB | 8.42 MiB/s`}</span>
            </span>
            <span className="hidden text-dim sm:inline">press any key to skip</span>
          </div>
        </div>
      </motion.div>

      {/* Hand-off: main line and HEAD become the page's commit graph. */}
      {land && (
        <>
          {land.to && (
            <motion.div
              className="absolute bottom-0 top-0 w-[2px] -translate-x-1/2"
              style={{ left: tx }}
              initial={{ backgroundColor: LIME, opacity: 1 }}
              animate={{ backgroundColor: "#262521", opacity: [1, 1, 0] }}
              transition={{ duration: 1.1, times: [0, 0.6, 1] }}
            />
          )}
          <motion.div
            className="absolute left-0 top-0 h-4 w-4 rounded-full bg-lime shadow-[0_0_0_6px_#0b0b0a,0_0_26px_rgba(200,255,61,0.8)]"
            initial={{ x: cx - 8, y: cy - 8, scale: 0.8 }}
            animate={{ x: tx - 8, y: ty - 8, scale: 1, opacity: land.to ? [1, 1, 0] : [1, 0] }}
            transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1], opacity: { duration: 1.2, times: land.to ? [0, 0.8, 1] : [0, 1] } }}
          />
        </>
      )}
    </motion.div>
  );
}
