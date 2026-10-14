"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

/**
 * Decodes the heading from random glyphs when it scrolls into view.
 * Screen readers always get the real text; the animated copy is aria-hidden.
 */
export function ScrambleText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        let frame = 0;
        const total = 26;
        const run = () => {
          let out = "";
          for (let i = 0; i < text.length; i++) {
            const reveal = (i / text.length) * total * 0.8;
            out += frame >= reveal || text[i] === " " ? text[i] : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
          setDisplay(out);
          frame++;
          if (frame <= total) raf = requestAnimationFrame(run);
          else setDisplay(text);
        };
        run();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {display}
      </span>
    </>
  );
}
