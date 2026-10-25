"use client";

import { useEffect, useRef } from "react";

type Pt = { x: number; y: number; vx: number; vy: number; r: number; c: number };

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h || "22d3ee", 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Cursor-reactive constellation behind the hero. Particles drift toward the
 * pointer, link to neighbours, and scatter on click. Pauses off-screen and in
 * background tabs; draws a single still frame for reduced motion.
 */
export function ParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const root = document.documentElement;
    let W = 0,
      H = 0,
      pts: Pt[] = [],
      cols: [number, number, number][] = [],
      light = false,
      running = false,
      visible = true,
      raf = 0;
    const mouse = { x: -9999, y: -9999 };

    const recolor = () => {
      const cs = getComputedStyle(root);
      cols = ["--a1-raw", "--a2-raw", "--a3-raw"].map((v) => hexToRgb(cs.getPropertyValue(v)));
      light = cs.colorScheme.includes("light") && !cs.colorScheme.includes("dark");
      if (reduce) draw();
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, (W * H) / 16000));
      pts = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8,
        c: i % 3,
      }));
      if (reduce) draw();
    };

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const dotA = light ? 0.5 : 0.85;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]!;
        if (!reduce) {
          const dx = mouse.x - p.x,
            dy = mouse.y - p.y,
            d = Math.hypot(dx, dy);
          if (d < 180 && d > 0) {
            p.vx += (dx / d) * 0.012;
            p.vy += (dy / d) * 0.012;
          }
          p.vx = p.vx * 0.985 + (Math.random() - 0.5) * 0.01;
          p.vy = p.vy * 0.985 + (Math.random() - 0.5) * 0.01;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
        }
        const [r, g, b] = cols[p.c] ?? [34, 211, 238];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${dotA})`;
        ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j]!;
          const dd = (p.x - q.x) ** 2 + (p.y - q.y) ** 2;
          if (dd < 12000) {
            ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - dd / 12000) * (light ? 0.22 : 0.35)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        const md = (mouse.x - p.x) ** 2 + (mouse.y - p.y) ** 2;
        if (md < 26000) {
          ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - md / 26000) * 0.6})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    const loop = () => {
      draw();
      if (running) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce || !visible || document.hidden) return;
      running = true;
      loop();
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button")) return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left,
        y = e.clientY - r.top;
      for (const p of pts) {
        const dx = p.x - x,
          dy = p.y - y,
          d = Math.hypot(dx, dy) || 1;
        if (d < 240) {
          p.vx += (dx / d) * 3.2;
          p.vy += (dy / d) * 3.2;
        }
      }
    };
    const onVis = () => (document.hidden ? stop() : start());
    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(resize, 150);
    };

    recolor();
    resize();
    start();

    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(host);
    const mo = new MutationObserver(recolor);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme", "data-palette"] });
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    mq.addEventListener("change", recolor);

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      io.disconnect();
      mo.disconnect();
      mq.removeEventListener("change", recolor);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      clearTimeout(rt);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
