import { useEffect, useRef } from "react";

/**
 * The hero background: a field of code glyphs that drifts like slow noise.
 * Glyphs near the cursor light up lime; clicking sends a ripple through it.
 */
export function GlyphField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const ramp = " ..··::;;--==++<>{}[]//##";
    const CW = 14, CH = 22;
    let w = 0, h = 0, cols = 0, rows = 0, dpr = 1;
    const mouse = { x: -999, y: -999, tx: -999, ty: -999 };
    const ripples: { x: number; y: number; t: number }[] = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `500 12px "JetBrains Mono Variable", monospace`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      cols = Math.ceil(w / CW) + 1; rows = Math.ceil(h / CH) + 1;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    resize();

    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top;
    };
    const onDown = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      if (e.clientY - r.top > h) return;
      ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() });
      if (ripples.length > 4) ripples.shift();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);

    let raf = 0, last = 0, visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) raf = requestAnimationFrame(draw);
    });
    io.observe(c);

    function draw(now: number) {
      if (!visible) return;
      raf = requestAnimationFrame(draw);
      if (now - last < 33) return; // ~30 fps is plenty for this
      last = now;
      const t = reduced ? 0 : now / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.18;
      mouse.y += (mouse.ty - mouse.y) * 0.18;
      ctx.clearRect(0, 0, w, h);
      for (let j = 0; j < rows; j++) {
        const y = j * CH + CH / 2;
        for (let i = 0; i < cols; i++) {
          const x = i * CW + CW / 2;
          // Cheap layered waves stand in for noise.
          let v =
            Math.sin(i * 0.11 + t * 0.35 + Math.sin(j * 0.17 + t * 0.2) * 1.6) * 0.5 +
            Math.sin(j * 0.23 - t * 0.28 + i * 0.05) * 0.35 +
            Math.sin((i + j) * 0.07 + t * 0.5) * 0.25;
          v = v * 0.5 + 0.5; // 0..1
          v = Math.pow(v, 2.4);
          const dx = x - mouse.x, dy = y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const near = Math.max(0, 1 - d / 170);
          let ring = 0;
          for (const r of ripples) {
            const age = (now - r.t) / 1000;
            if (age > 2.2) continue;
            const rd = Math.hypot(x - r.x, y - r.y);
            ring = Math.max(ring, Math.exp(-((rd - age * 520) ** 2) / 900) * (1 - age / 2.2));
          }
          const lit = Math.min(1, near * near * 1.4 + ring);
          const val = Math.min(1, v * 0.8 + lit * 0.9);
          if (val < 0.06) continue;
          const ch = ramp[Math.min(ramp.length - 1, Math.floor(val * ramp.length))];
          if (ch === " ") continue;
          if (lit > 0.08) {
            ctx.fillStyle = `rgba(200,255,61,${0.18 + lit * 0.75})`;
          } else {
            ctx.fillStyle = `rgba(236,235,228,${0.05 + val * 0.16})`;
          }
          ctx.fillText(ch, x, y);
        }
      }
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
