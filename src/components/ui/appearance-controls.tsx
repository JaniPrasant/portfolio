"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useAppearance } from "@/hooks/use-appearance";
import { palettes, type Palette } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useUI } from "@/components/providers/ui-provider";

const swatchBg: Record<Palette, string> = {
  aurora: "conic-gradient(#22D3EE,#A78BFA,#F472B6,#22D3EE)",
  lagoon: "conic-gradient(#2DD4BF,#38BDF8,#818CF8,#2DD4BF)",
  neon: "conic-gradient(#4ADE80,#22D3EE,#E879F9,#4ADE80)",
};
const paletteName: Record<Palette, string> = { aurora: "Aurora", lagoon: "Lagoon", neon: "Neon" };

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useAppearance();
  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  return (
    <motion.button
      type="button"
      className={cn("icon-btn relative overflow-hidden", className)}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      whileHover={{ rotate: 20 }}
      whileTap={{ scale: 0.88 }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={theme}
          className="grid place-items-center"
          initial={{ y: 22, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -22, rotate: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {theme === "dark" ? <Sun className="size-[18px]" aria-hidden /> : <Moon className="size-[18px]" aria-hidden />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

export function PaletteSwatches({ className }: { className?: string }) {
  const { palette, setPalette } = useAppearance();
  const { toast } = useUI();
  return (
    <div role="group" aria-label="Color palette" className={cn("flex gap-1.5 px-1.5", className)}>
      {palettes.map((p) => (
        <motion.button
          key={p}
          type="button"
          whileHover={{ scale: 1.25, rotate: 30 }}
          whileTap={{ scale: 0.85 }}
          aria-label={`${paletteName[p]} palette`}
          aria-pressed={palette === p}
          title={`${paletteName[p]} palette`}
          onClick={() => {
            setPalette(p);
            toast(`${paletteName[p]} palette on`);
          }}
          style={{ background: swatchBg[p] }}
          className="size-[18px] cursor-pointer rounded-full border-2 border-transparent p-0 aria-pressed:border-fg"
        />
      ))}
    </div>
  );
}

export { paletteName };
