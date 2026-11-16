import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { ago, useLastPush } from "./lib";

/* A 5×7 pixel font. GitHub's graph is 7 rows tall, so each letter fills a week column stack. */
const FONT: Record<string, string[]> = {
  M: ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  N: ["#...#", "#...#", "##..#", "#.#.#", "#..##", "#...#", "#...#"],
  Y: ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],
  D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
  V: ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LEVEL = ["#161614", "rgb(200 255 61 / 0.09)", "rgb(200 255 61 / 0.18)", "rgb(200 255 61 / 0.3)", "#c8ff3d"];

/** Which cells of a word light up, starting at column `at`. */
function ink(word: string, at: number) {
  const on = new Set<string>();
  let c = at;
  for (const ch of word) {
    FONT[ch]?.forEach((row, r) => [...row].forEach((px, k) => px === "#" && on.add(`${c + k},${r}`)));
    c += 6;
  }
  return on;
}

/** Deterministic noise so the background "commits" look the same on every visit. */
function noise(g: number, c: number, r: number) {
  const x = Math.sin(g * 91.7 + c * 12.9898 + r * 78.233) * 43758.5453;
  const v = x - Math.floor(x);
  return v < 0.55 ? 0 : v < 0.82 ? 1 : v < 0.95 ? 2 : 3;
}

function Graph({ word, g, cols, at, ready, months, today }: { word: string; g: number; cols: number; at: number; ready: boolean; months?: boolean; today?: string }) {
  const on = useMemo(() => ink(word, at), [word, at]);
  const box = useRef<HTMLDivElement>(null);

  // Hovering paints a little light, like a burst of commits.
  const paint = (e: PointerEvent) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-c]");
    if (!el || el.dataset.hot) return;
    el.dataset.hot = "1";
    setTimeout(() => delete el.dataset.hot, 700);
  };

  const todayRow = new Date().getDay();
  return (
    <div>
      {months && (
        <div className="mb-1.5 grid font-mono text-[10px] text-dim md:text-[11px]" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }, (_, c) => {
            const m = Math.floor((c / cols) * 12);
            const first = Math.floor(((c - 1) / cols) * 12) !== m || c === 0;
            return <span key={c}>{first && (cols > 40 || m % 2 === 0) ? MONTHS[m] : ""}</span>;
          })}
        </div>
      )}
      <div
        ref={box}
        onPointerOver={paint}
        className="grid gap-[2px] sm:gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        aria-hidden
      >
        {Array.from({ length: 7 }, (_, r) =>
          Array.from({ length: cols }, (_, c) => {
            const letter = on.has(`${c},${r}`);
            // Keep the background quiet around the letters so the name reads first.
            const near = c >= at - 1 && c <= at + 29;
            const lvl = letter ? 4 : near ? Math.min(1, noise(g, c, r)) : noise(g, c, r);
            const isToday = !!today && c === cols - 1 && r === todayRow;
            const delay = c * 22 + ((r * 37 + c * 11) % 7) * 18 + (letter ? 120 : 0) + g * 160;
            return (
              <span
                key={`${r}-${c}`}
                data-c
                title={isToday ? today : undefined}
                className={`contrib-cell relative aspect-square rounded-[2px] sm:rounded-[3px] ${letter ? "is-ink" : ""} ${isToday ? "is-today" : ""}`}
                style={{
                  background: ready ? LEVEL[isToday ? 4 : lvl] : LEVEL[0],
                  transitionDelay: ready ? `${delay}ms` : "0ms",
                  gridRow: r + 1,
                  gridColumn: c + 1,
                }}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}

/** The hero: Mohan's name, drawn into two GitHub contribution graphs. */
export function Contrib({ ready }: { ready: boolean }) {
  const [wide, setWide] = useState(true);
  const push = useLastPush("Mohanyadav-codes");
  useEffect(() => {
    const m = window.matchMedia("(min-width: 768px)");
    const set = () => setWide(m.matches);
    set();
    m.addEventListener("change", set);
    return () => m.removeEventListener("change", set);
  }, []);
  const cols = wide ? 53 : 31;
  const at = wide ? 2 : 1;
  const today = push ? `today · last push to ${push.repo}, ${ago(push.at)}` : "today";

  return (
    <div className="select-none">
      <div className="relative">
        <div className="min-w-0 flex-1 space-y-[10px] md:space-y-[14px]">
          <Graph word="MOHAN" g={0} cols={cols} at={at} ready={ready} months />
          <Graph word="YADAV" g={1} cols={cols} at={at} ready={ready} today={today} />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-4 font-mono text-[10.5px] text-dim">
        <span className="truncate">
          <span className="text-mute">@Mohanyadav-codes</span> · contribution graph, rendered as a name
        </span>
        <span className="flex shrink-0 items-center gap-1">
          Less
          {LEVEL.map((c) => (
            <span key={c} className="inline-block h-2.5 w-2.5 rounded-[2px]" style={{ background: c }} />
          ))}
          More
        </span>
      </div>
    </div>
  );
}
