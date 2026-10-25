"use client";

import { MotionConfig } from "motion/react";
import { UIProvider } from "./ui-provider";
import { PointerEffects } from "@/components/effects/pointer-effects";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 380, damping: 32 }}>
      <UIProvider>
        <PointerEffects />
        {children}
      </UIProvider>
    </MotionConfig>
  );
}
