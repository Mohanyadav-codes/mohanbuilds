import { useEffect, useRef, useState } from "react";

/** A short, stable git-style hash for any string. */
export function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  let h2 = h ^ 0x9e3779b9;
  h2 = Math.imul(h2 ^ (h2 >>> 15), 2246822507);
  return ((h >>> 0).toString(16) + (h2 >>> 0).toString(16)).padStart(7, "0").slice(0, 7);
}

export const sections = [
  { id: "top", file: "HEAD", label: "Home" },
  { id: "branches", file: "branches", label: "Products" },
  { id: "log", file: "git log", label: "Projects" },
  { id: "deps", file: "package.json", label: "Stack" },
  { id: "readme", file: "README.md", label: "About" },
  { id: "signal", file: "signal.sh", label: "Contact" },
] as const;

/** Which section is in the middle of the screen. */
export function useActiveSection() {
  const [active, setActive] = useState<string>("top");
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";
/** Text that decodes from random glyphs into the real string. */
export function useScramble(text: string, delay = 0, speed = 28) {
  const [out, setOut] = useState(() => text.replace(/\S/g, " "));
  const ref = useRef(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    let frame = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      if (now < start) return (ref.current = requestAnimationFrame(tick));
      frame++;
      const done = Math.floor(frame / 2.2);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") s += " ";
        else if (i < done) s += text[i];
        else if (i < done + 6) s += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        else s += " ";
      }
      setOut(s);
      if (done < text.length) ref.current = window.setTimeout(() => requestAnimationFrame(tick), speed) as unknown as number;
    };
    ref.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(ref.current);
      clearTimeout(ref.current);
    };
  }, [text, delay, speed]);
  return out;
}

/** Latest public push on GitHub, if the API answers. */
export function useLastPush(user: string) {
  const [push, setPush] = useState<{ repo: string; at: Date } | null>(null);
  useEffect(() => {
    const ctl = new AbortController();
    fetch(`https://api.github.com/users/${user}/events/public?per_page=30`, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then((evs: { type: string; repo: { name: string }; created_at: string }[]) => {
        const e = evs.find((x) => x.type === "PushEvent");
        if (e) setPush({ repo: e.repo.name.split("/")[1], at: new Date(e.created_at) });
      })
      .catch(() => {});
    return () => ctl.abort();
  }, [user]);
  return push;
}

export function ago(d: Date) {
  const s = (Date.now() - d.getTime()) / 1000;
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} days ago`;
}

export function useClock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 1000 * 15);
    return () => clearInterval(i);
  }, []);
  return t.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
}

export function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
