/** Animated SVG covers for projects without screenshots. Colors come from the active palette. */

export function AnalystKitArt() {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden className="block size-full">
      <rect width="400" height="400" fill="var(--frame)" />
      <g fill="color-mix(in srgb, var(--fg) 6%, var(--frame))" stroke="var(--line)">
        <rect x="24" y="24" width="168" height="90" rx="14" />
        <rect x="208" y="24" width="168" height="90" rx="14" />
        <rect x="24" y="130" width="352" height="160" rx="14" />
        <rect x="24" y="306" width="352" height="70" rx="14" />
      </g>
      <g className="fill-fg-3 font-mono text-[10px] tracking-[0.06em]">
        <text x="40" y="52">REVENUE · MTD</text>
        <text x="224" y="52">CONVERSION</text>
        <text x="40" y="156">SESSIONS · 30D</text>
        <text x="64" y="345">LIVE</text>
      </g>
      <g className="fill-fg font-mono text-[20px] font-medium">
        <text x="40" y="92">₹4.82L</text>
        <text x="224" y="92">3.4%</text>
      </g>
      <path
        d="M40 270 L80 254 L120 260 L160 228 L200 236 L240 206 L280 214 L320 186 L360 192 L360 278 L40 278Z"
        fill="color-mix(in srgb, var(--a1) 16%, transparent)"
      />
      <path
        className="animate-trace"
        d="M40 270 L80 254 L120 260 L160 228 L200 236 L240 206 L280 214 L320 186 L360 192"
        fill="none"
        stroke="var(--a1)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        className="animate-trace [animation-delay:.7s]"
        d="M40 262 L80 266 L120 246 L160 250 L200 220 L240 226 L280 198 L320 204 L360 176"
        fill="none"
        stroke="var(--a3)"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity=".8"
      />
      <circle cx="50" cy="341" r="6" fill="var(--a4)" />
      <rect x="130" y="333" width="64" height="16" rx="8" fill="var(--a1)" opacity=".9" />
      <rect x="204" y="333" width="74" height="16" rx="8" fill="var(--a2)" opacity=".9" />
      <rect x="288" y="333" width="66" height="16" rx="8" fill="var(--a3)" opacity=".9" />
    </svg>
  );
}

export function JobMarketArt() {
  const rows = [
    { label: "SQL", w: 270, c: "var(--a1)", o: 1 },
    { label: "Python", w: 236, c: "var(--a2)", o: 1 },
    { label: "Excel", w: 198, c: "var(--a3)", o: 1 },
    { label: "Power BI", w: 160, c: "var(--a2)", o: 0.7 },
    { label: "Tableau", w: 124, c: "var(--a1)", o: 0.6 },
  ];
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden className="block size-full">
      <rect width="400" height="250" fill="var(--frame)" />
      <text x="26" y="36" className="fill-fg-3 font-mono text-[10px] tracking-[0.06em]">
        SKILL MENTIONS · SAMPLE
      </text>
      {rows.map((r, i) => (
        <g key={r.label}>
          <text x="26" y={78 + i * 34} className="fill-fg-3 font-mono text-[11px]">
            {r.label}
          </text>
          <rect
            className="animate-grow"
            style={{ animationDelay: `${i * 0.25}s` }}
            x="96"
            y={66 + i * 34}
            width={r.w}
            height="16"
            rx="8"
            fill={r.c}
            opacity={r.o}
          />
        </g>
      ))}
    </svg>
  );
}

export function WeatherCliArt() {
  const lines = [
    { t: "$ python weather.py Navsari", c: "fill-fg", y: 76 },
    { t: "↳ geocoding… 20.95°N, 72.93°E", c: "fill-fg-3", y: 102 },
    { t: "✓ forecast fetched (retry 0/3)", c: "fill-a1", y: 128 },
    { t: "Thu  31°/26°  Partly cloudy", c: "fill-fg", y: 154 },
    { t: "Fri  30°/25°  Light rain", c: "fill-fg", y: 176 },
    { t: "Sat  32°/26°  Clear sky", c: "fill-fg", y: 198 },
    { t: "▍", c: "fill-a3", y: 220 },
  ];
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden className="block size-full">
      <rect width="400" height="250" fill="var(--frame)" />
      <rect x="18" y="18" width="364" height="214" rx="14" fill="color-mix(in srgb, var(--fg) 6%, var(--frame))" stroke="var(--line)" />
      <circle cx="38" cy="38" r="5" fill="#FB7185" />
      <circle cx="56" cy="38" r="5" fill="#FBBF24" />
      <circle cx="74" cy="38" r="5" fill="#4ADE80" />
      <g className="font-mono text-[12px]">
        {lines.map((l, i) => (
          <text key={l.t} x="36" y={l.y} className={`animate-term ${l.c}`} style={{ animationDelay: `${i * 0.42}s` }}>
            {l.t}
          </text>
        ))}
      </g>
    </svg>
  );
}

export const projectArt = {
  "analyst-kit": AnalystKitArt,
  "job-market": JobMarketArt,
  "weather-cli": WeatherCliArt,
} as const;
