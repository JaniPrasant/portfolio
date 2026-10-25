"use client";

import { emit, events } from "@/lib/utils";

/** Reopens the cookie banner so a visitor can change or withdraw consent. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => emit(events.openCookies)}>
      Cookie settings
    </button>
  );
}
