import { cn } from "@/utils/cn";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}) {
  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-b from-emerald-400 to-emerald-500 text-emerald-950 shadow-[0_8px_30px_rgba(16,185,129,0.18)] hover:from-emerald-300 hover:to-emerald-500",
    secondary:
      "bg-white/8 text-white/90 hover:bg-white/12 border border-white/10",
    ghost: "bg-transparent text-white/80 hover:bg-white/8",
    danger:
      "bg-gradient-to-b from-rose-400 to-rose-500 text-rose-950 hover:from-rose-300 hover:to-rose-500",
  };
  const sizes: Record<string, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-400/40 disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
