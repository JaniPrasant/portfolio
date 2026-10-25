"use client";

import { ScrollProgress } from "./scroll-progress";
import { FloatingActions } from "./floating-actions";
import { CookieBanner } from "./cookie-banner";
import { CommandPalette } from "./command-palette";
import { UtmCapture } from "./utm-capture";

export function SiteOverlays() {
  return (
    <>
      <ScrollProgress />
      <FloatingActions />
      <CookieBanner />
      <CommandPalette />
      <UtmCapture />
    </>
  );
}
