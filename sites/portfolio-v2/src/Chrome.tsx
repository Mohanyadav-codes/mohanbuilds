import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { BookOpen, Braces, GitBranch, GitCommitHorizontal, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { person } from "@shared/content";
import { go, sections, useActiveSection, useClock } from "./lib";
import { BatLogo } from "./Bat";

const tabIcon: Record<string, ReactNode> = {
  branches: <GitBranch className="h-3.5 w-3.5" />,
  log: <GitCommitHorizontal className="h-3.5 w-3.5" />,
  deps: <Braces className="h-3.5 w-3.5" />,
  readme: <BookOpen className="h-3.5 w-3.5" />,
  signal: <BatLogo className="h-2 w-[18px]" />,
};

/** Floating top bar: transparent over the hero, a glass pill once you scroll. */
export function TopBar({ onPalette }: { onPalette: () => void }) {
  const active = useActiveSection();
  const time = useClock();
  const { scrollY, scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  const [floating, setFloating] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setFloating(v > 24));
  const signal = () => (go("signal"), setTimeout(() => window.dispatchEvent(new Event("signal:light")), 650));

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5">
      <div
        className={`pointer-events-auto relative mx-auto flex h-[54px] max-w-[1400px] items-center gap-3 rounded-2xl border px-2.5 transition-[background-color,border-color,box-shadow] duration-500 md:px-3 ${
          floating
            ? "border-white/[0.08] bg-[#0f0f0e]/75 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        {/* Brand */}
        <button onClick={() => go("top")} className="group flex shrink-0 items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-white/[0.04]">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-lime/25 bg-lime/[0.07] shadow-[0_0_20px_-6px_rgba(200,255,61,0.6)]">
            <Mark className="h-[18px] w-[18px]" />
          </span>
          <span className="font-mono text-[13.5px] font-semibold tracking-[-0.01em]">
            mohan<span className="text-lime">.</span>builds
          </span>
        </button>
        <span className="hidden items-center gap-1.5 rounded-full border border-line bg-bg/60 px-2.5 py-1 font-mono text-[11px] text-mute xl:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-add/70" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-add" />
          </span>
          main
        </span>

        {/* Tabs */}
        <nav className="mx-auto hidden items-center gap-0.5 rounded-xl border border-line bg-bg/70 p-1 lg:flex">
          {sections.slice(1).map((s) => {
            const on = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => (s.id === "signal" ? signal() : go(s.id))}
                className={`relative flex h-[34px] items-center gap-2 rounded-lg px-3.5 font-mono text-[12px] transition-colors ${on ? "text-text" : "text-dim hover:text-mute"}`}
              >
                {on && (
                  <motion.span
                    layoutId="tab"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-lg bg-white/[0.07] ring-1 ring-inset ring-white/10"
                  />
                )}
                <span className={`relative ${on ? (s.id === "signal" ? "text-white" : "text-lime") : ""}`}>{tabIcon[s.id]}</span>
                <span className="relative">{s.file}</span>
              </button>
            );
          })}
        </nav>

        {/* Right */}
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <span className="hidden items-center gap-2 px-2 font-mono text-[11px] text-dim md:flex">
            <span className="text-mute">{person.city}</span>
            <span className="tabular-nums text-text/80">{time}</span>
            <span>IST</span>
          </span>
          <button
            onClick={signal}
            title="Light the signal"
            aria-label="Light the signal"
            className="group grid h-[34px] w-[44px] place-items-center rounded-lg border border-line bg-panel/80 transition hover:border-white/40 hover:shadow-[0_0_24px_-6px_rgba(255,255,255,0.6)]"
          >
            <BatLogo className="h-2.5 w-6 text-white/60 transition group-hover:text-white" />
          </button>
          <button
            onClick={onPalette}
            className="flex h-[34px] items-center gap-2 rounded-lg border border-line bg-panel/80 px-2.5 font-mono text-[11.5px] text-mute transition hover:border-lime/50 hover:text-text"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Jump to</span>
            <kbd className="rounded border border-line bg-bg px-1.5 text-[10px] text-dim">⌘K</kbd>
          </button>
        </div>

        {/* Scroll progress along the bottom edge. */}
        <motion.div
          style={{ scaleX: p }}
          className={`absolute inset-x-4 -bottom-px h-px origin-left bg-gradient-to-r from-lime/0 via-lime/80 to-lime transition-opacity duration-500 ${floating ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </header>
  );
}
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M22 12v40" stroke="#c8ff3d" strokeWidth="5" strokeLinecap="round" />
      <path d="M22 40c0-12 20-8 20-20" stroke="#c8ff3d" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="22" cy="46" r="6" fill="#0b0b0a" stroke="#c8ff3d" strokeWidth="4" />
      <circle cx="42" cy="18" r="6" fill="#0b0b0a" stroke="#c8ff3d" strokeWidth="4" />
    </svg>
  );
}

export function BranchIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="4" cy="3" r="1.6" />
      <circle cx="4" cy="13" r="1.6" />
      <circle cx="12" cy="5" r="1.6" />
      <path d="M4 4.6v6.8M12 6.6c0 3-8 2-8 5" />
    </svg>
  );
}

type Item = { group: string; label: string; hint: string; run: () => void };

/** ⌘K / Ctrl+K / "/" command palette, plus j/k/q keys to move through the page. */
export function Palette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const items: Item[] = useMemo(
    () => [
      ...sections.map((s) => ({ group: "Go to", label: s.label, hint: s.file, run: () => go(s.id) })),
      ...person.links.map((l) => ({ group: "Open", label: l.label, hint: l.handle, run: () => window.open(l.url, "_blank", "noopener") })),
      { group: "Open", label: "Arclor", hint: "arclor.com", run: () => window.open("https://arclor.com", "_blank", "noopener") },
      { group: "Open", label: "Cutdeck", hint: "cutdeck.mohanbuilds.space", run: () => window.open("https://cutdeck.mohanbuilds.space", "_blank", "noopener") },
      {
        group: "Do",
        label: "Copy email",
        hint: person.email,
        run: () => {
          navigator.clipboard?.writeText(person.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        },
      },
      { group: "Do", label: "Light the signal", hint: "l", run: () => (go("signal"), setTimeout(() => window.dispatchEvent(new Event("signal:light")), 650)) },
      { group: "Do", label: "Write an email", hint: "mailto", run: () => (window.location.href = `mailto:${person.email}`) },
    ],
    [],
  );
  const list = items.filter((i) => (i.label + " " + i.hint + " " + i.group).toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const typing = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      return t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable;
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
        return;
      }
      if (open || typing(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "/") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "j" || e.key === "k") {
        const y = window.scrollY + 80;
        const tops = sections.map((s) => document.getElementById(s.id)!.offsetTop);
        const idx = tops.findIndex((t, i) => y >= t && (i === tops.length - 1 || y < tops[i + 1]));
        const next = Math.min(sections.length - 1, Math.max(0, idx + (e.key === "j" ? 1 : -1)));
        go(sections[next].id);
      } else if (e.key === "q") {
        go("top");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      setTimeout(() => input.current?.focus(), 10);
    }
  }, [open]);

  const run = (i: Item | undefined) => {
    if (!i) return;
    i.run();
    if (i.label !== "Copy email") setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 px-4 pt-[14vh] backdrop-blur-sm"
          onMouseDown={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -12, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <span className="font-mono text-lime">&gt;</span>
              <input
                ref={input}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setSel(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") (e.preventDefault(), setSel((s) => Math.min(list.length - 1, s + 1)));
                  if (e.key === "ArrowUp") (e.preventDefault(), setSel((s) => Math.max(0, s - 1)));
                  if (e.key === "Enter") run(list[sel]);
                  if (e.key === "Escape") setOpen(false);
                }}
                placeholder="Type a command or search…"
                className="h-14 flex-1 bg-transparent font-mono text-[14px] text-text outline-none placeholder:text-dim"
              />
              <kbd className="rounded border border-line px-1.5 font-mono text-[10px] text-dim">esc</kbd>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-2">
              {list.map((i, k) => (
                <li key={i.group + i.label}>
                  <button
                    onMouseEnter={() => setSel(k)}
                    onClick={() => run(i)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${k === sel ? "bg-lime/10" : ""}`}
                  >
                    <span className="w-12 font-mono text-[10px] uppercase tracking-wider text-dim">{i.group}</span>
                    <span className={`text-[14px] ${k === sel ? "text-lime" : "text-text"}`}>
                      {i.label === "Copy email" && copied ? "Copied" : i.label}
                    </span>
                    <span className="ml-auto truncate font-mono text-[11px] text-dim">{i.hint}</span>
                  </button>
                </li>
              ))}
              {!list.length && <li className="px-3 py-6 text-center font-mono text-[12px] text-dim">No match. Try “arclor”.</li>}
            </ul>
            <div className="flex gap-4 border-t border-line px-4 py-2.5 font-mono text-[10.5px] text-dim">
              <span>↑↓ move</span>
              <span>↵ run</span>
              <span className="ml-auto">on the page: j / k next, q top, l signal</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** The commit graph that runs down the left of the page. */
export function GraphLine() {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <div aria-hidden className="pointer-events-none absolute bottom-0 left-[39px] top-0 hidden w-px md:block">
      <div className="absolute inset-0 bg-line" />
      <motion.div style={{ scaleY: p }} className="absolute inset-0 origin-top bg-gradient-to-b from-lime/0 via-lime/60 to-lime" />
    </div>
  );
}
