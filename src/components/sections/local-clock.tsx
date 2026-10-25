"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

export function LocalClock() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: site.timeZone, hour: "2-digit", minute: "2-digit", hour12: false });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="font-display text-[clamp(2.2rem,4vw,3rem)] font-semibold leading-none tracking-[-0.04em]">
      <time suppressHydrationWarning>{time}</time>
      <small className="ml-2 font-mono text-xs font-normal tracking-[0.06em] text-fg-3">IST · UTC+5:30</small>
    </div>
  );
}
