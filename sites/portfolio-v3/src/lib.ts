import { useEffect, useState } from "react";

export const sections = [
  { id: "overview", n: "01", label: "Overview" },
  { id: "pinout", n: "02", label: "Pinout" },
  { id: "devices", n: "03", label: "Devices" },
  { id: "notes", n: "04", label: "App notes" },
  { id: "specs", n: "05", label: "Characteristics" },
  { id: "order", n: "06", label: "Ordering" },
] as const;

export const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Which section is in the middle of the screen. */
export function useActiveSection() {
  const [active, setActive] = useState<string>("overview");
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
    const i = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  return t.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
}

export function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
}
