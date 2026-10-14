"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheck, CircleAlert } from "lucide-react";

type ToastKind = "success" | "error";
type ConfirmOptions = { title: string; body: string; confirmLabel?: string; cancelLabel?: string };

type UIContextValue = {
  toast: (message: string, kind?: ToastKind) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const UIContext = createContext<UIContextValue | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [toastState, setToastState] = useState<{ id: number; message: string; kind: ToastKind } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const toast = useCallback((message: string, kind: ToastKind = "success") => {
    clearTimeout(toastTimer.current);
    setToastState({ id: Date.now(), message, kind });
    toastTimer.current = setTimeout(() => setToastState(null), 2800);
  }, []);

  // ---- confirmation modal (native <dialog> for focus trap + Escape) ----
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const resolver = useRef<((v: boolean) => void) | null>(null);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (options && dlg && !dlg.open) {
      dlg.showModal();
      cancelRef.current?.focus();
    }
  }, [options]);

  const settle = useCallback((value: boolean) => {
    dialogRef.current?.close();
    resolver.current?.(value);
    resolver.current = null;
    setOptions(null);
  }, []);

  return (
    <UIContext.Provider value={{ toast, confirm }}>
      {children}

      <dialog
        ref={dialogRef}
        aria-labelledby="confirm-title"
        aria-describedby="confirm-body"
        className="w-[460px]"
        onCancel={(e) => {
          e.preventDefault();
          settle(false);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) settle(false);
        }}
      >
        <div className="dlg flex flex-col gap-3.5 p-6">
          <h2 id="confirm-title" className="font-display text-xl tracking-tight">
            {options?.title}
          </h2>
          <p id="confirm-body" className="text-[15px] text-fg-2">
            {options?.body}
          </p>
          <div className="mt-1.5 flex flex-wrap justify-end gap-2">
            <button ref={cancelRef} type="button" className="btn btn-ghost btn-sm" onClick={() => settle(false)}>
              {options?.cancelLabel ?? "Cancel"}
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => settle(true)}>
              {options?.confirmLabel ?? "Confirm"}
            </button>
          </div>
        </div>
      </dialog>

      <div aria-live="polite" role="status" className="pointer-events-none fixed left-1/2 top-[calc(90px+env(safe-area-inset-top,0px))] z-[200] -translate-x-1/2 no-print">
        <AnimatePresence>
          {toastState && (
            <motion.div
              key={toastState.id}
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="glass glass-solid flex max-w-[calc(100vw-32px)] items-center gap-2.5 rounded-2xl px-4.5 py-3 text-sm"
            >
              {toastState.kind === "success" ? (
                <CircleCheck className="size-[18px] text-ok" aria-hidden />
              ) : (
                <CircleAlert className="size-[18px] text-err" aria-hidden />
              )}
              <span>{toastState.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </UIContext.Provider>
  );
}
