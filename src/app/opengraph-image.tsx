import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 10% 0%, #3b2a7a 0%, transparent 45%), radial-gradient(circle at 95% 90%, #6a2457 0%, transparent 45%), #06071a",
          color: "#f2f3ff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #22D3EE, #A78BFA, #F472B6)",
              color: "#05060f",
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            PJ
          </div>
          <div style={{ fontSize: 30, color: "#aaafcb" }}>{new URL(site.url).host}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>{site.name}</div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: -1.5,
              backgroundImage: "linear-gradient(100deg, #22D3EE, #A78BFA, #F472B6)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Frontend engineer turning data into interfaces.
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 24, color: "#aaafcb" }}>
          {["React", "TypeScript", "Python", "SQL", "6+ years"].map((t) => (
            <div key={t} style={{ padding: "10px 20px", borderRadius: 999, border: "1px solid rgba(255,255,255,.18)" }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
