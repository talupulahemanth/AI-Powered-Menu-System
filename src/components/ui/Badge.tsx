import { cn } from "@/utils/cn";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info" | "gold";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral:
      "border-white/10 bg-white/5 text-white/80 shadow-[0_1px_0_rgba(255,255,255,0.06)]",
    success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    warning: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    danger: "border-rose-400/20 bg-rose-400/10 text-rose-200",
    info: "border-sky-400/20 bg-sky-400/10 text-sky-200",
    gold: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
