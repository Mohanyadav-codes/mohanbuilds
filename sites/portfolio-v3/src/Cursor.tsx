import { useEffect, useRef } from "react";

/** A CAD-style crosshair with a live coordinate readout. Mouse only. */
export function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  const read = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.body.classList.add("has-cursor");
    let x = -100;
    let y = -100;
    let raf = 0;
    const draw = () => {
      raf = 0;
      if (el.current) el.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (read.current) read.current.textContent = `X ${String(Math.round(x)).padStart(4, "0")}  Y ${String(Math.round(y + window.scrollY)).padStart(5, "0")}`;
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as Element | null;
      const hot = !!t?.closest?.("a, button, [data-hot]");
      const text = !!t?.closest?.("input, textarea");
      el.current?.setAttribute("data-state", text ? "text" : hot ? "hot" : "idle");
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const leave = () => el.current?.setAttribute("data-state", "gone");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={el}
      data-state="gone"
      aria-hidden
      className="group pointer-events-none fixed left-0 top-0 z-[90] hidden [@media(pointer:fine)]:block"
      style={{ transform: "translate3d(-100px,-100px,0)" }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2 transition-opacity group-data-[state=gone]:opacity-0 group-data-[state=text]:opacity-0">
        <span className="absolute left-1/2 top-1/2 h-px w-[26px] -translate-x-1/2 -translate-y-1/2 bg-ink transition-all duration-200 group-data-[state=hot]:w-[38px] group-data-[state=hot]:bg-sig" />
        <span className="absolute left-1/2 top-1/2 h-[26px] w-px -translate-x-1/2 -translate-y-1/2 bg-ink transition-all duration-200 group-data-[state=hot]:h-[38px] group-data-[state=hot]:bg-sig" />
        <span className="absolute left-1/2 top-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink transition-all duration-200 group-data-[state=hot]:h-[22px] group-data-[state=hot]:w-[22px] group-data-[state=hot]:border-sig" />
      </div>
      <span
        ref={read}
        className="absolute left-3 top-3 whitespace-pre rounded-sm bg-ink px-1.5 py-0.5 font-mono text-[9.5px] text-paper transition-opacity group-data-[state=gone]:opacity-0 group-data-[state=text]:opacity-0 group-data-[state=hot]:bg-sig"
      />
    </div>
  );
}
