"use client";

import { Download } from "lucide-react";
import { motion } from "motion/react";
import { useMagnetic } from "@/components/motion/primitives";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useUI } from "@/components/providers/ui-provider";

export function useResumeDownload() {
  const { confirm, toast } = useUI();
  return async () => {
    const ok = await confirm({
      title: "Download résumé?",
      body: `Prashant Jani résumé, ${site.resumeSizeLabel}. The file downloads to your device.`,
      confirmLabel: "Download PDF",
    });
    if (!ok) return;
    const a = document.createElement("a");
    a.href = site.resume;
    a.download = "Prashant-Jani-Resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast("Résumé download started");
  };
}

export function ResumeButton({
  className,
  variant = "primary",
  size,
  label = "Download résumé",
  onBeforeOpen,
}: {
  className?: string;
  variant?: "primary" | "ghost";
  size?: "sm";
  label?: string;
  onBeforeOpen?: () => void;
}) {
  const download = useResumeDownload();
  const magnetic = useMagnetic(0.25);
  return (
    <motion.button
      type="button"
      {...magnetic}
      className={cn("btn", variant === "primary" ? "btn-primary" : "btn-ghost", size === "sm" && "btn-sm", className)}
      initial="rest"
      whileHover="hover"
      onClick={() => {
        onBeforeOpen?.();
        void download();
      }}
    >
      <motion.span
        className="inline-flex"
        variants={{ rest: { y: 0 }, hover: { y: [0, 3, 0], transition: { duration: 0.6, repeat: Infinity } } }}
      >
        <Download className="size-[18px]" aria-hidden />
      </motion.span>
      {label}
    </motion.button>
  );
}
