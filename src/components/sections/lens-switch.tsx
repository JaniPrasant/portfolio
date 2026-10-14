"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const tabs = [
  { id: "fe", label: "Frontend" },
  { id: "da", label: "Data" },
] as const;
type LensId = (typeof tabs)[number]["id"];

const bars = [
  { label: "SQL", h: 128, color: "var(--a1)", o: 1 },
  { label: "Python", h: 110, color: "var(--a2)", o: 1 },
  { label: "Excel", h: 86, color: "var(--a3)", o: 1 },
  { label: "Power BI", h: 64, color: "var(--a2)", o: 0.7 },
  { label: "Tableau", h: 46, color: "var(--a1)", o: 0.6 },
];

export function LensSwitch() {
  const [lens, setLens] = useState<LensId>("fe");
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setLens(tabs[next]!.id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Lens" className="relative inline-flex rounded-[14px] border border-line bg-glass p-1">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${t.id}`}
            aria-selected={lens === t.id}
            aria-controls={`${uid}-panel`}
            tabIndex={lens === t.id ? 0 : -1}
            onClick={() => setLens(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className="relative cursor-pointer rounded-[10px] border-0 bg-transparent px-4 py-2 text-[13.5px] text-fg-2 transition-colors aria-selected:font-semibold aria-selected:text-on-accent"
          >
            {lens === t.id && (
              <motion.span
                layoutId={`${uid}-lens-pill`}
                className="absolute inset-0 rounded-[10px] bg-linear-to-r from-a1 to-a2"
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
              />
            )}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${lens}`}
        className="relative mt-4 min-h-[280px] overflow-hidden rounded-card-sm border border-line bg-[color-mix(in_srgb,var(--bg)_65%,transparent)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {lens === "fe" ? (
            <motion.pre
              key="fe"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="code m-0 p-[18px]"
            >
              <span className="tk-c">{"// Typed, reusable, accessible"}</span>
              {"\n"}
              <span className="tk-k">export function</span> <span className="tk-f">KpiCard</span>
              {"({ label, value, delta }: "}
              <span className="tk-t">Kpi</span>
              {") {\n  "}
              <span className="tk-k">return</span>
              {" (\n    <"}
              <span className="tk-t">article</span>
              {" aria-label={label}>\n      <"}
              <span className="tk-t">h3</span>
              {">{label}</"}
              <span className="tk-t">h3</span>
              {">\n      <"}
              <span className="tk-t">data</span>
              {" value={value}>{"}
              <span className="tk-f">fmt</span>
              {"(value)}</"}
              <span className="tk-t">data</span>
              {">\n      <"}
              <span className="tk-t">Delta</span>
              {" pct={delta} />\n    </"}
              <span className="tk-t">article</span>
              {">\n  );\n}"}
            </motion.pre>
          ) : (
            <motion.div
              key="da"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-[18px]"
            >
              <svg
                viewBox="0 0 320 170"
                className="block h-[200px] w-full"
                role="img"
                aria-label="Example bar chart of skill mentions in job postings: SQL highest, then Python, Excel, Power BI and Tableau"
              >
                <path d="M30 20H315M30 70H315M30 120H315" stroke="var(--line)" />
                {bars.map((b, i) => (
                  <motion.rect
                    key={b.label}
                    x={44 + i * 56}
                    width={36}
                    rx={6}
                    fill={b.color}
                    opacity={b.o}
                    initial={{ y: 150, height: 0 }}
                    animate={{ y: 150 - b.h, height: b.h }}
                    transition={{ type: "spring", stiffness: 140, damping: 14, delay: i * 0.06 }}
                  />
                ))}
                {bars.map((b, i) => (
                  <text key={b.label} x={62 + i * 56} y={164} textAnchor="middle" className="fill-fg-3 font-mono text-[10px]">
                    {b.label}
                  </text>
                ))}
              </svg>
              <div className="mt-2 flex justify-between font-mono text-[11.5px] text-fg-3">
                <span>skill mentions · sample</span>
                <span>pandas → value_counts()</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
