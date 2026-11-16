import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { person } from "@shared/content";
import { go, sections, useActiveSection, useClock } from "./lib";
import { BatLogo } from "./Bat";

/** Top bar styled like an editor's tab strip. */
export function TopBar({ onPalette }: { onPalette: () => void }) {
  const active = useActiveSection();
  const time = useClock();
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-[1400px] items-center gap-4 px-4 md:px-6">
        <button onClick={() => go("top")} className="flex shrink-0 items-center gap-2 font-mono text-[13px] font-semibold">
          <Mark className="h-5 w-5" />
          <span>mohan<span className="text-lime">.</span>builds</span>
        </button>
        <span className="hidden items-center gap-1.5 rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-mute md:flex">
          <BranchIcon className="h-3 w-3 text-lime" /> main
        </span>
        <nav className="ml-2 hidden h-12 items-stretch lg:flex">
          {sections.slice(1).map((s) => (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              className={`relative flex items-center gap-2 border-l border-line px-4 font-mono text-[12px] transition last:border-r ${
                active === s.id ? "bg-panel text-text" : "text-dim hover:text-mute"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${active === s.id ? "bg-lime" : "bg-line"}`} />
              {s.file}
              {active === s.id && <motion.span layoutId="tab" className="absolute inset-x-0 top-0 h-[2px] bg-lime" />}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden font-mono text-[11px] text-dim sm:block">{person.city} · {time} IST</span>
          <button
            onClick={() => (go("signal"), setTimeout(() => window.dispatchEvent(new Event("signal:light")), 650))}
            title="Light the signal"
            aria-label="Light the signal"
            className="group grid h-[30px] w-[42px] place-items-center rounded-lg border border-line bg-panel transition hover:border-bat/60"
          >
            <BatLogo className="h-2.5 w-6 text-bat/55 transition group-hover:text-bat group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
          </button>
          <button
            onClick={onPalette}
            className="flex items-center gap-2 rounded-lg border border-line bg-panel px-2.5 py-1.5 font-mono text-[11px] text-mute transition hover:border-lime/50 hover:text-text"
          >
            <span>Jump to</span>
            <kbd className="rounded border border-line bg-bg px-1.5 text-[10px] text-dim">⌘K</kbd>
          </button>
        </div>
      </div>
      <motion.div style={{ scaleX: p }} className="h-px origin-left bg-lime/70" />
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
