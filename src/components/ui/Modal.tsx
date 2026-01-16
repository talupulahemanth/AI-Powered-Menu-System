import { cn } from "@/utils/cn";
import React, { useEffect } from "react";

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            "w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10",
            "bg-gradient-to-b from-[#0b1220] to-[#070b14]",
            "shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
          )}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="text-sm font-semibold text-white/90">{title}</div>
            <button
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-white/70 hover:bg-white/10"
            >
              ✕
            </button>
          </div>
          <div className="max-h-[70vh] overflow-auto p-5">{children}</div>
          {footer ? (
            <div className="border-t border-white/10 p-4">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
