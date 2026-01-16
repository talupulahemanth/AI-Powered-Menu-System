import React, { useMemo, useRef, useState } from "react";
import { cn } from "@/utils/cn";

export function Card3D({
  children,
  className,
  interactive = true,
  glow = true,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  glow?: boolean;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const base = useMemo(
    () =>
      cn(
        "relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/8 to-white/4",
        "shadow-[0_24px_70px_rgba(0,0,0,0.45)]",
        glow &&
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-[radial-gradient(600px_circle_at_var(--x,50%)_var(--y,0%),rgba(34,197,94,0.18),transparent_40%)]",
        className
      ),
    [className, glow]
  );

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        base,
        interactive &&
          "cursor-pointer transition-transform duration-150 will-change-transform hover:border-white/20"
      )}
      style={style}
      onMouseMove={(e) => {
        if (!interactive) return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const px = x / r.width;
        const py = y / r.height;
        const rx = (py - 0.5) * -10;
        const ry = (px - 0.5) * 10;
        setStyle({
          transform: `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)` ,
          ['--x' as any]: `${Math.round(px * 100)}%`,
          ['--y' as any]: `${Math.round(py * 100)}%`,
        });
      }}
      onMouseLeave={() => {
        if (!interactive) return;
        setStyle({ transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)" });
      }}
    >
      <div className="relative">{children}</div>
    </div>
  );
}
