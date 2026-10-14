"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUI } from "@/components/providers/ui-provider";

function legacyCopy(text: string) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}

export function useCopy() {
  const { toast } = useUI();
  return async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      if (!legacyCopy(text)) {
        toast("Copy was blocked. Select the text and press Ctrl+C.", "error");
        return false;
      }
    }
    toast(`${label} copied`);
    return true;
  };
}

export function CopyButton({ text, label, className }: { text: string; label: string; className?: string }) {
  const copy = useCopy();
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  return (
    <button
      type="button"
      aria-label={`Copy ${label.toLowerCase()}`}
      title={`Copy ${label.toLowerCase()}`}
      className={cn("icon-btn no-print", done && "border-[color-mix(in_srgb,var(--ok)_50%,transparent)] text-ok", className)}
      onClick={async () => {
        if (await copy(text, label)) {
          setDone(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setDone(false), 1800);
        }
      }}
    >
      {done ? <Check className="size-[18px]" aria-hidden /> : <Copy className="size-[18px]" aria-hidden />}
    </button>
  );
}
