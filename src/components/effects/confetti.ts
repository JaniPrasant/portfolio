/** One-shot palette-colored confetti burst from a point on screen. No-op for reduced motion. */
export function burstConfetti(origin: { x: number; y: number }) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, { position: "fixed", inset: "0", pointerEvents: "none", zIndex: "250" });
  const W = (canvas.width = window.innerWidth);
  const H = (canvas.height = window.innerHeight);
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas.remove();

  const cs = getComputedStyle(document.documentElement);
  const colors = ["--a1-raw", "--a2-raw", "--a3-raw", "--a4-raw"].map((v) => cs.getPropertyValue(v).trim() || "#22d3ee");
  const parts = Array.from({ length: 120 }, (_, i) => ({
    x: origin.x,
    y: origin.y,
    vx: (Math.random() - 0.5) * 12,
    vy: Math.random() * -11 - 3,
    s: Math.random() * 6 + 4,
    r: Math.random() * 6,
    vr: (Math.random() - 0.5) * 0.3,
    c: colors[i % colors.length]!,
  }));

  let frame = 0;
  const tick = () => {
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.vy += 0.35;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      ctx.restore();
    }
    if (++frame < 130) requestAnimationFrame(tick);
    else canvas.remove();
  };
  requestAnimationFrame(tick);
}
